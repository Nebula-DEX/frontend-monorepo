import { FormProvider } from 'react-hook-form';

import { type AssetERC20 } from '@vegaprotocol/assets';
import { Button, Intent } from '@vegaprotocol/ui-toolkit';
import { useVegaWallet } from '@vegaprotocol/wallet-react';

import { useT } from '../../../lib/use-t';

import * as Fields from './fields';

import { type Configs } from './form-schema';
import { FeedbackDialog } from './feedback-dialog';
import { useFallbackDepositForm } from './use-fallback-deposit-form';
import { getChainName } from '@vegaprotocol/web3';
import { APP_SYMBOL } from 'apps/trading/lib/constants';

export const FallbackDepositForm = (props: {
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
  const t = useT();
  const { pubKeys } = useVegaWallet();
  const { form, balances, deposit, tx, estimatedAmount, toAsset, onSubmit } =
    useFallbackDepositForm(props);

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
        <SubmitButton estimatedAmount={estimatedAmount} />
      </form>
      <dl className="text-xs">
        {toAsset && (
          <div className="grid grid-cols-2">
            <dt className="text-surface-1-fg-muted">{t('Available USDT')}</dt>
            <dd className="text-right">
              {balances.data?.balanceOf.toString()}
            </dd>
          </div>
        )}
        <div className="grid grid-cols-2">
          <dt className="text-surface-1-fg-muted">{t('NEB')}</dt>
          <dd className="text-right">
            {estimatedAmount} {APP_SYMBOL}
          </dd>
        </div>
      </dl>
      <FeedbackDialog
        estimatedAmount={estimatedAmount}
        depositData={deposit.data}
        orderTx={tx}
        onChange={deposit.reset}
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
