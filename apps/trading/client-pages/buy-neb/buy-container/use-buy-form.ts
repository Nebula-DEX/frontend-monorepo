import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAccount, useChainId } from 'wagmi';
import { type Squid } from '@0xsquid/sdk';

import { type AssetERC20 } from '@vegaprotocol/assets';

import { useAssetReadContracts } from '../../../lib/hooks/use-asset-read-contracts';
import { useSquidRoute } from './use-squid-route';
import { type FormFields, type Configs, formSchema } from './form-schema';
import { useNativeBalance } from '../../../lib/hooks/use-native-balance';
import { useEvmDeposit } from '../../../lib/hooks/use-evm-deposit';
import { useEvmSquidDeposit } from 'apps/trading/lib/hooks/use-evm-squid-deposit';
import { type TxDeposit, type TxSquidDeposit } from '../../../stores/evm';
import BigNumber from 'bignumber.js';
import { MAX_BUY_USDT, SWAP_MARKET_ID } from './buy-container';
import { OrderTimeInForce, OrderType, Side } from '@vegaprotocol/types';
import { useSimpleTransaction } from '@vegaprotocol/wallet-react';
import { removeDecimal, toBigNum } from '@vegaprotocol/utils';
import { localLoggerFactory } from '@vegaprotocol/logger';
import { useT } from '../../../lib/use-t';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  accountsQueryOptions,
  type Market,
  useAccounts,
} from '@vegaprotocol/rest';
import { vegaAccountType } from '@vegaprotocol/rest-clients/dist/trading-data';
import { APP_TOKEN_ID, USDT_ID } from 'apps/trading/lib/constants';

export type OrderCheck = 'idle' | 'pending' | 'success' | 'fail';

const logger = localLoggerFactory({
  application: 'buy-neb',
  logLevel: 'debug',
});

/**
 * Form logic for deposits
 */
export const useBuyForm = (props: {
  address: string;
  pubKey: string;
  squid: Squid;
  assets: Array<AssetERC20>;
  initialAsset?: AssetERC20;
  configs: Configs;
  minAmount?: string;
  asks?: Array<{ price: string; volume: string; numberOfOrders: string }>;
  market: Market;
}) => {
  const [depositCheck, setDepositCheck] = useState<OrderCheck>('idle');
  const [swapCheck, setSwapCheck] = useState<OrderCheck>('idle');
  const [orderCheck, setOrderCheck] = useState<OrderCheck>('idle');

  const accountsParams = {
    partyId: props.pubKey,
    type: vegaAccountType.ACCOUNT_TYPE_GENERAL,
  };
  const { data: accounts } = useAccounts(accountsParams);
  const queryClient = useQueryClient();
  const t = useT();
  const bestAsk = props?.asks ? props.asks[0] : undefined;
  const nextBestAsk = props?.asks ? props.asks[1] : undefined;
  const tx = useSimpleTransaction();

  const { address } = useAccount();

  const chainId = useChainId();
  const defaultChain = props.squid.chains.find(
    (c) => c.chainId === String(chainId)
  );

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromAddress: props.address,
      toPubKey: props.pubKey,
      fromChain: defaultChain && defaultChain.chainId,
      fromAsset: '',
      // fromAddress is just derived from the connected wallet, but including
      // it as a form field so its included with the zodResolver validation
      // and shows up as an error if its not set
      toAsset: props.initialAsset?.id,
      amount: '',
    },
  });

  const fields = form.watch();

  const tokens = props.squid.tokens?.filter((t) => {
    if (!fields.fromChain) return false;
    if (t.chainId === fields.fromChain) return true;
    return false;
  });

  const chain = props.squid.chains.find((c) => c.chainId === fields.fromChain);
  const toAsset = props.assets?.find((a) => a.id === fields.toAsset);
  const fromAsset = tokens?.find((t) => t.address === fields.toAsset);

  // Data relating to the selected from asset, like balance on address and allowance
  // Only relevant if the asset is not a the chains native asset
  const balances = useAssetReadContracts({
    token: fromAsset,
    configs: props.configs,
  });

  // Because the read contracts above don't work with native balances we need to
  // separately get the native token balance
  const nativeBalance = useNativeBalance({
    address,
    chainId: fields.fromChain,
  });

  // Check if the from and to asset are the same, if not then we will be using
  // squid to swap and then deposit via a post hook
  const isSwap =
    fields.fromAsset && toAsset
      ? fields.fromAsset.toLowerCase() !==
        toAsset?.source.contractAddress.toLowerCase()
      : undefined;

  const route = useSquidRoute({
    form,
    toAsset,
    enabled: isSwap,
  });

  const deposit = useEvmDeposit();
  const squidDeposit = useEvmSquidDeposit();

  const executeSpotBuy = (res: TxDeposit | TxSquidDeposit) => {
    if (!bestAsk) {
      throw new Error('no asks on swap market book');
    }

    if (!res.data?.result) {
      throw new Error('No resulting data from squid swap');
    }

    // amount of deposited arbitrum usdt
    const amount = BigInt(res.data.result.amount);
    const size = getFeeAdjustedAmount(amount, price, props.market);

    const orderSubmission = {
      marketId: SWAP_MARKET_ID,
      side: Side.SIDE_BUY,
      type: OrderType.TYPE_LIMIT,
      price: bestAsk.price,
      timeInForce: OrderTimeInForce.TIME_IN_FORCE_FOK,
      size: size.toString(),
    };

    logger.log('executing spot buy', orderSubmission);

    return tx.send({ orderSubmission });
  };

  const onSubmit = form.handleSubmit(async (fields) => {
    if (!bestAsk) {
      throw new Error('no asks on swap market book');
    }

    // Get full details of the chosen assets
    const fromAsset = tokens.find(
      (t) => t.address === fields.fromAsset && t.chainId === fields.fromChain
    );
    const toAsset = props.assets?.find((a) => a.id === fields.toAsset);

    if (!toAsset || toAsset.source.__typename !== 'ERC20') {
      throw new Error('no to asset');
    }

    const isSwapRequired =
      fromAsset &&
      fromAsset.address.toLowerCase() !==
        toAsset.source.contractAddress.toLowerCase();

    if (props.squid.initialized && isSwapRequired) {
      if (!fromAsset) {
        throw new Error('no from asset');
      }

      if (!route.data) {
        throw new Error('no route data');
      }

      // Final USDT amount needs converting as route data values are in
      // raw integers
      if (
        toBigNum(
          route.data.route.estimate.toAmount,
          route.data.route.estimate.toToken.decimals
        ).isGreaterThan(MAX_BUY_USDT)
      ) {
        form.setError('amount', {
          message: t('Maximum of 100k USD permitted'),
        });
        return;
      }

      const quantumizedAmount = BigNumber(
        route.data.route.estimate.toAmount
      ).div(toAsset.quantum);

      if (props.minAmount && quantumizedAmount.isLessThan(props.minAmount)) {
        // TODO: use i18n and qUSD tooltip
        form.setError('amount', {
          message: 'You must deposit at least 10 qUSD',
        });
        return;
      }

      // Balances before the swap, so we can compare and make sure that the
      // squid swap and the spot buy were successful
      const { usdt, neb } = getBalances(accounts);

      const res = await squidDeposit.write({
        asset: toAsset,
        amount: fields.amount.toString(),
        toPubKey: props.pubKey,
        routeData: route.data,
        chainId: Number(fields.fromChain),
      });

      if (res.status === 'finalized' && res.data?.result) {
        setSwapCheck('pending');
        await sleep(1000 * 10);

        let data = await queryClient.fetchQuery(
          accountsQueryOptions(queryClient, accountsParams)
        );
        let balances = getBalances(data);

        if (balances.usdt.isLessThanOrEqualTo(usdt)) {
          setSwapCheck('fail');
          return;
        } else {
          setSwapCheck('success');
        }

        await executeSpotBuy(res);

        setOrderCheck('pending');
        await sleep(1000 * 60);

        data = await queryClient.fetchQuery(
          accountsQueryOptions(queryClient, accountsParams)
        );
        balances = getBalances(data);

        if (balances.neb.isLessThanOrEqualTo(neb)) {
          setOrderCheck('fail');
        } else {
          setOrderCheck('success');
        }
      } else {
        logger.error(
          `squid deposit failed and spot buy could not be executed: ${JSON.stringify(
            res
          )}`
        );
      }
    } else {
      // Same asset, no swap required, use normal ethereum bridge
      // or normal arbitrum bridge to swap

      // Find the matching config for the selected asset
      const config = props.configs.find(
        (c) => c.chain_id === toAsset.source.chainId
      );

      if (!config) {
        throw new Error(`no bridge for toAsset ${toAsset.id}`);
      }

      // Amount is the 'real' amount input by the user in this case
      // as no swap has occurred
      if (Number(fields.amount) > MAX_BUY_USDT) {
        form.setError('amount', {
          message: t('Maximum of 100k USD permitted'),
        });
        return;
      }

      // Balances before the swap, so we can compare and make sure that the
      // squid swap and the spot buy were successful
      const { usdt, neb } = getBalances(accounts);

      const res = await deposit.write({
        asset: toAsset,
        bridgeAddress: config.collateral_bridge_contract
          .address as `0x${string}`,
        amount: fields.amount.toString(),
        allowance: (balances.data?.allowance || BigNumber(0)).toString(),
        toPubKey: props.pubKey,
        chainId: Number(config.chain_id),
        requiredConfirmations: config.confirmations,
      });

      if (res.status === 'finalized' && res.data?.result) {
        setDepositCheck('pending');
        await sleep(1000 * 10);

        let data = await queryClient.fetchQuery(
          accountsQueryOptions(queryClient, accountsParams)
        );
        let balances = getBalances(data);

        if (balances.usdt.isLessThanOrEqualTo(usdt)) {
          setDepositCheck('fail');
          return;
        } else {
          setDepositCheck('success');
        }

        await executeSpotBuy(res);

        setOrderCheck('pending');
        await sleep(1000 * 60);

        data = await queryClient.fetchQuery(
          accountsQueryOptions(queryClient, accountsParams)
        );
        balances = getBalances(data);

        if (balances.neb.isLessThanOrEqualTo(neb)) {
          setOrderCheck('fail');
        } else {
          setOrderCheck('success');
        }
      } else {
        logger.error(
          `normal deposit failed and spot buy could not be executed: ${JSON.stringify(
            res
          )}`
        );
      }
    }
  });

  let estimatedAmount = '0';
  const price = BigInt(bestAsk?.price ?? 0); // Price of NEB in USDT

  if (isSwap) {
    // Estimate the final amount after deposit and swap
    const toAmount = BigInt(route.data?.route.estimate.toAmount ?? 0); // USDT
    const adjustedAmount = getFeeAdjustedAmount(toAmount, price, props.market);
    estimatedAmount = toBigNum(
      adjustedAmount.toString(),
      props.market.positionDecimalPlaces
    ).toString();
  } else {
    // Estimate the final amount after deposit and swap
    const amount = toAsset ? removeDecimal(fields.amount, toAsset.decimals) : 0;
    const toAmount = BigInt(amount ?? 0); // Amount in USDT
    const adjustedAmount = getFeeAdjustedAmount(toAmount, price, props.market);
    estimatedAmount = toBigNum(
      adjustedAmount.toString(),
      props.market.positionDecimalPlaces
    ).toString();
  }

  const reset = () => {
    form.reset();
    deposit.reset();
    squidDeposit.reset();
    setDepositCheck('idle');
    setSwapCheck('idle');
    setOrderCheck('idle');
  };

  return {
    form,

    chain,
    tokens,
    fromAsset,
    toAsset,

    route,
    isSwap,
    nativeBalance,
    balances,

    deposit,
    squidDeposit,
    onSubmit,
    tx,
    estimatedAmount,
    bestAsk,
    nextBestAsk,
    depositCheck,
    orderCheck,
    swapCheck,
    reset,
    fields,
  };
};

export function getBalances(accounts: ReturnType<typeof useAccounts>['data']) {
  const usdtAccount = accounts?.find((a) => a.asset.id === USDT_ID);
  const usdt = usdtAccount ? usdtAccount.balance.value : BigNumber(0);
  const nebAccount = accounts?.find((a) => a.asset.id === APP_TOKEN_ID);
  const neb = nebAccount ? nebAccount.balance.value : BigNumber(0);

  return { usdt, neb };
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getFeeAdjustedAmount(
  amount: bigint,
  price: bigint,
  market: Market
) {
  const feeFactor = BigNumber(market.makerFee)
    .plus(market.liquidityFee)
    .plus(market.infraFee)
    .plus(market.buyBackFee)
    .plus(market.treasuryFee);
  const size = amount / price;
  const notional = size * price;
  const feeAmount = BigNumber(String(notional)).times(feeFactor);
  // Amount adjusted for fees
  const feeAdjustedAmount = BigNumber(String(size)).minus(feeAmount);

  return feeAdjustedAmount;
}
