import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAccount, useChainId } from 'wagmi';

import { type AssetERC20 } from '@vegaprotocol/assets';
import {
  useSimpleTransaction,
  useVegaWallet,
} from '@vegaprotocol/wallet-react';

import { useEvmDeposit } from '../../../lib/hooks/use-evm-deposit';
import { useAssetReadContracts } from './use-asset-read-contracts';

import {
  type FormFields,
  type Configs,
  fallbackFormSchema,
} from './form-schema';
import BigNumber from 'bignumber.js';
import { type TxDeposit } from '../../../stores/evm';
import { localLoggerFactory } from '@vegaprotocol/logger';
import { MAX_BUY_USDT, SWAP_MARKET_ID } from './deposit-container';
import { OrderTimeInForce, OrderType, Side } from '@vegaprotocol/types';
import { removeDecimal, toBigNum } from '@vegaprotocol/utils';

const logger = localLoggerFactory({ application: 'buy-neb-fallback' });

export const useFallbackDepositForm = (props: {
  assets: Array<AssetERC20>;
  initialAsset?: AssetERC20;
  configs: Configs;
  minAmount?: string;
  asks?: Array<{ price: string; volume: string; numberOfOrders: string }>;
  market: {
    decimalPlaces: number;
    positionDecimalPlaces: number;
  };
}) => {
  const bestAsk = props?.asks ? props.asks[0] : undefined;
  const tx = useSimpleTransaction();
  const { pubKey } = useVegaWallet();

  const { address } = useAccount();
  const chainId = useChainId();

  const form = useForm<FormFields>({
    resolver: zodResolver(fallbackFormSchema),
    defaultValues: {
      // fromAddress is just derived from the connected wallet, but including
      // it as a form field so its included with the zodResolver validation
      // and shows up as an error if its not set
      fromAddress: address,
      fromChain: String(chainId),
      fromAsset: props.initialAsset?.source.contractAddress,
      toAsset: props.initialAsset?.id,
      toPubKey: pubKey,
      amount: '',
    },
  });

  const fields = form.watch();

  const toAsset = props.assets?.find((a) => a.id === fields.toAsset);

  // Data relating to the select asset, like balance on address, allowance
  const balances = useAssetReadContracts({
    token: toAsset
      ? {
          address: toAsset.source.contractAddress,
          chainId: toAsset.source.chainId,
          decimals: toAsset.decimals,
        }
      : undefined,
    configs: props.configs,
  });

  const deposit = useEvmDeposit();

  const executeSpotBuy = (res: TxDeposit) => {
    if (!bestAsk) {
      throw new Error('no asks on swap market book');
    }

    if (!res.data?.result) {
      throw new Error('No resulting data from squid swap');
    }

    // amount of deposited arbitrum usdt
    const amount = BigInt(res.data.result.amount);
    const price = BigInt(bestAsk.price);
    const size = String(amount / price);

    const orderSubmission = {
      marketId: SWAP_MARKET_ID,
      side: Side.SIDE_BUY,
      type: OrderType.TYPE_LIMIT,
      price: bestAsk.price,
      timeInForce: OrderTimeInForce.TIME_IN_FORCE_FOK,
      size,
    };
    tx.send({ orderSubmission });
  };

  const onSubmit = form.handleSubmit(async (fields) => {
    const toAsset = props.assets?.find((a) => a.id === fields.toAsset);

    if (!toAsset || toAsset.source.__typename !== 'ERC20') {
      throw new Error('invalid asset');
    }

    const config = props.configs.find(
      (c) => c.chain_id === toAsset.source.chainId
    );

    if (!config) {
      throw new Error(`no bridge for toAsset ${toAsset.id}`);
    }

    // The default bridgeAddress for the selected toAsset if an arbitrum
    // to asset is selected will get changed to the squid receiver address
    const bridgeAddress = config.collateral_bridge_contract.address;

    if (Number(fields.amount) > MAX_BUY_USDT) {
      form.setError('amount', {
        message: 'Maximum of 100k permitted',
      });
      return;
    }

    const res = await deposit.write({
      asset: toAsset,
      bridgeAddress: bridgeAddress as `0x${string}`,
      amount: fields.amount.toString(),
      allowance: (balances.data?.allowance || BigNumber(0)).toString(),
      toPubKey: fields.toPubKey,
      chainId: Number(config.chain_id),
      requiredConfirmations: config.confirmations,
    });

    if (res.status === 'finalized' && res.data?.result) {
      executeSpotBuy(res);
    } else {
      logger.error(
        `fallback deposit failed and spot buy could not be executed: ${JSON.stringify(
          res
        )}`
      );
    }
  });

  // Estimate the final amount after deposit and swap
  const amount = toAsset ? removeDecimal(fields.amount, toAsset.decimals) : 0;
  const toAmount = BigInt(amount ?? 0); // Amount in USDT
  const price = BigInt(bestAsk?.price ?? 0); // Price of NEB in USDT

  // The estimated amount of NEB that will be received, note fees on spot market are set
  // to 0 so this should be the final amount
  const estimatedAmount = toBigNum(
    String(toAmount / price),
    props.market.positionDecimalPlaces
  ).toString();

  return {
    form,
    toAsset,

    balances,

    deposit,
    onSubmit,
    tx,
    estimatedAmount,
    bestAsk,
  };
};
