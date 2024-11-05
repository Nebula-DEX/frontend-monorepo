import { FormProvider } from 'react-hook-form';
import { type Squid } from '@0xsquid/sdk';

import { type AssetERC20 } from '@vegaprotocol/assets';
import { Button, Intent, Loader } from '@vegaprotocol/ui-toolkit';

import { useT } from '../../../lib/use-t';

import { NonSwapInfo, SwapInfo } from './swap-info';
import { type Configs } from './form-schema';
import * as Fields from './fields';
import { FeedbackDialog, SquidFeedbackDialog } from './feedback-dialog';
import { useBuyForm } from './use-buy-form';
import { useVegaWallet } from '@vegaprotocol/wallet-react';
import type { RouteResponse } from '@0xsquid/sdk/dist/types';

export const BuyForm = (props: {
  address: string;
  pubKey: string;
  squid: Squid;
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
  const { pubKeys } = useVegaWallet();
  const {
    form,
    chain,
    tokens,
    balances,
    nativeBalance,
    route,
    isSwap,
    squidDeposit,
    deposit,
    tx,
    estimatedAmount,
    bestAsk,
    toAsset,
    onSubmit,
  } = useBuyForm(props);

  return (
    <FormProvider {...form}>
      <form data-testid="deposit-form" onSubmit={onSubmit}>
        <Fields.FromAddress control={form.control} />
        <Fields.ToPubKey control={form.control} pubKeys={pubKeys} />
        <Fields.FromChain
          control={form.control}
          chains={props.squid.chains}
          tokens={props.squid.tokens}
        />
        <Fields.FromAsset
          control={form.control}
          tokens={tokens}
          chain={chain}
        />
        <Fields.Amount
          control={form.control}
          balanceOf={balances.data?.balanceOf}
          nativeBalanceOf={nativeBalance.data}
        />
        {isSwap ? (
          <div className="mb-4">
            <SwapInfo
              route={route.data?.route}
              estimatedAmount={estimatedAmount}
              error={route.error}
              bestAsk={bestAsk}
            />
          </div>
        ) : (
          <div className="mb-4">
            <NonSwapInfo
              estimatedAmount={estimatedAmount}
              bestAsk={bestAsk}
              toAsset={toAsset}
            />
          </div>
        )}
        <SubmitButton
          isSwap={isSwap}
          isFetchingRoute={route.isFetching}
          route={route.data}
          estimatedAmount={estimatedAmount}
        />
        {!isSwap && (
          <FeedbackDialog
            depositData={deposit.data}
            orderTx={tx}
            onChange={deposit.reset}
            estimatedAmount={estimatedAmount}
          />
        )}
        {isSwap && (
          <SquidFeedbackDialog
            depositData={squidDeposit.data}
            orderTx={tx}
            onChange={squidDeposit.reset}
            asks={props.asks}
            estimatedAmount={estimatedAmount}
          />
        )}
      </form>
    </FormProvider>
  );
};

const SubmitButton = (props: {
  estimatedAmount: string;
  route: RouteResponse | undefined | null;
  isSwap?: boolean;
  isFetchingRoute?: boolean;
  isExecutingSwap?: boolean;
  isExecutingOrder?: boolean;
}) => {
  const t = useT();
  const estimate = props.route?.route.estimate;

  let text = t('Buy NEB');

  if (props.estimatedAmount && props.estimatedAmount !== '0') {
    text = t('Buy {{amount}} {{symbol}}', {
      amount: props.estimatedAmount,
      symbol: 'NEB',
    });
  }

  if (props.isFetchingRoute) {
    text = t('Calculating swap...');
  }

  if (props.isExecutingSwap && estimate) {
    text = t('Swapping {{from}} to {{to}}', {
      from: estimate.fromToken.symbol,
      to: estimate.toToken.symbol,
    });
  }

  if (props.isExecutingOrder) {
    text = t('Buying NEB...');
  }

  const isExecuting = props.isExecutingSwap || props.isExecutingOrder;

  return (
    <Button
      type="submit"
      size="lg"
      fill={true}
      intent={Intent.Secondary}
      disabled={
        props.isFetchingRoute || props.isExecutingSwap || props.isExecutingOrder
      }
      className="flex gap-2 items-center"
    >
      {text}
      {isExecuting && <Loader size="small" />}
    </Button>
  );
};
