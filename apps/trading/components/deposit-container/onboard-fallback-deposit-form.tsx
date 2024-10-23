import { Controller, FormProvider } from 'react-hook-form';

import { type AssetERC20 } from '@vegaprotocol/assets';
import {
  Button,
  Intent,
  FormGroup,
  Input,
  TradingInputError,
} from '@vegaprotocol/ui-toolkit';
import { useVegaWallet } from '@vegaprotocol/wallet-react';

import { useT } from '../../lib/use-t';

import * as Fields from './fields';

import { type Configs } from './form-schema';
import { FeedbackDialog } from './feedback-dialog';
import { useFallbackDepositForm } from './use-fallback-deposit-form';
import { type TxDeposit } from '../../stores/evm';
import {
  FormSecondaryActionButton,
  FormSecondaryActionWrapper,
} from '../form-secondary-action';

export const OnboardFallbackDepositForm = (props: {
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
        <Fields.ToPubKey control={form.control} pubKeys={pubKeys} />
        {toAsset && (
          <Fields.ToAssetTargeted
            toAsset={toAsset}
            balance={balances.data?.balanceOf.toString() || '0'}
          />
        )}
        <Fields.FromAddress control={form.control} />
        <Controller
          control={form.control}
          name="amount"
          render={({ field, fieldState }) => {
            return (
              <FormGroup label="Amount" labelFor="amount">
                <Input {...field} />
                {fieldState.error && (
                  <TradingInputError>
                    {fieldState.error.message}
                  </TradingInputError>
                )}
                <FormSecondaryActionWrapper>
                  <FormSecondaryActionButton
                    onClick={() => {
                      const fromAsset = form.getValues('fromAsset');

                      if (!fromAsset) return;

                      const value = balances.data?.balanceOf.toString() || '0';

                      form.setValue('amount', value, {
                        shouldValidate: true,
                      });
                    }}
                  >
                    {t('Use maximum')}
                  </FormSecondaryActionButton>
                </FormSecondaryActionWrapper>
              </FormGroup>
            );
          }}
        />
        <Button
          type="submit"
          size="lg"
          className="mt-4"
          fill={true}
          intent={Intent.Secondary}
        >
          {t('Deposit')}
        </Button>
      </form>

      <FeedbackDialog data={deposit.data} onChange={deposit.reset} />
    </FormProvider>
  );
};
