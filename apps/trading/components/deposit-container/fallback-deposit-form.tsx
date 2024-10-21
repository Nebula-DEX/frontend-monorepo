import { FormProvider } from 'react-hook-form';

import { type AssetERC20 } from '@vegaprotocol/assets';
import { Button, Intent } from '@vegaprotocol/ui-toolkit';
import { useVegaWallet } from '@vegaprotocol/wallet-react';

import { useT } from '../../lib/use-t';

import * as Fields from './fields';

import { type Configs } from './form-schema';
import { FeedbackDialog } from './feedback-dialog';
import { useFallbackDepositForm } from './use-fallback-deposit-form';
import { type TxDeposit } from '../../stores/evm';

export const FallbackDepositForm = (props: {
  assets: Array<AssetERC20>;
  initialAsset?: AssetERC20;
  configs: Configs;
  onDeposit?: (tx: TxDeposit) => void;
  minAmount?: string;
}) => {
  const t = useT();
  const { pubKeys } = useVegaWallet();
  const { form, toAsset, balances, deposit, onSubmit } =
    useFallbackDepositForm(props);

  return (
    <FormProvider {...form}>
      <form data-testid="deposit-form" onSubmit={onSubmit}>
        <Fields.ToPubKeySelect control={form.control} pubKeys={pubKeys} />
        <Fields.ToAsset
          control={form.control}
          assets={props.assets}
          toAsset={toAsset}
          queryKey={balances.queryKey}
        />
        <Fields.FromAddress control={form.control} />
        <Fields.Amount
          control={form.control}
          balanceOf={balances.data?.balanceOf}
          nativeBalanceOf={undefined}
        />
        <Button type="submit" size="lg" fill={true} intent={Intent.Secondary}>
          {t('Deposit')}
        </Button>
      </form>

      <FeedbackDialog data={deposit.data} onChange={deposit.reset} />
    </FormProvider>
  );
};
