import { FormProvider } from 'react-hook-form';

import { type AssetERC20 } from '@vegaprotocol/assets';
import { Button, Intent } from '@vegaprotocol/ui-toolkit';
import { useVegaWallet } from '@vegaprotocol/wallet-react';

import { useT } from '../../../lib/use-t';

import * as Fields from './fields';

import { type Configs } from './form-schema';
import { FeedbackDialog } from './feedback-dialog';
import { useFallbackBuyForm } from './use-fallback-buy-form';
import { getChainName } from '@vegaprotocol/web3';
import { APP_SYMBOL } from 'apps/trading/lib/constants';
import { NonSwapInfo } from './swap-info';

export const FallbackBuyForm = (props: {
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
    balances,
    deposit,
    tx,
    estimatedAmount,
    toAsset,
    bestAsk,
    nextBestAsk,
    onSubmit,
    depositCheck,
    orderCheck,
    fields,
  } = useFallbackBuyForm(props);

  let symbol = undefined;
  if (props.initialAsset) {
    const chain = getChainName(Number(props.initialAsset.source.chainId));
    symbol = `${props.initialAsset?.symbol} ${chain}`;
  }

  return (
    <FormProvider {...form}>
      <form data-testid="deposit-form" onSubmit={onSubmit}>
        <Fields.FromAddress control={form.control} />
        <Fields.ToPubKey control={form.control} pubKeys={pubKeys} />
        <Fields.Amount
          control={form.control}
          balanceOf={balances.data?.balanceOf}
          nativeBalanceOf={undefined}
          symbol={symbol}
        />
        <div className="mb-4">
          <NonSwapInfo
            estimatedAmount={estimatedAmount}
            bestAsk={bestAsk}
            nextBestAsk={nextBestAsk}
            toAsset={toAsset}
            market={props.market}
            amount={fields.amount}
          />
        </div>
        <SubmitButton estimatedAmount={estimatedAmount} />
      </form>
      <FeedbackDialog
        estimatedAmount={estimatedAmount}
        depositData={deposit.data}
        orderTx={tx}
        onChange={deposit.reset}
        depositCheck={depositCheck}
        orderCheck={orderCheck}
      />
    </FormProvider>
  );
};

const SubmitButton = (props: { estimatedAmount: string }) => {
  const t = useT();

  let text = t('Buy NEB');

  if (props.estimatedAmount !== '0') {
    text = t('Buy {{amount}} {{symbol}}', {
      amount: props.estimatedAmount,
      symbol: APP_SYMBOL,
    });
  }

  return (
    <Button type="submit" size="lg" fill={true} intent={Intent.Secondary}>
      {text}
    </Button>
  );
};
