import { FormGroup, Input, TradingInputError } from '@vegaprotocol/ui-toolkit';
import { type Control, Controller, useFormContext } from 'react-hook-form';
import { type FormFields } from '../form-schema';
import {
  FormSecondaryActionButton,
  FormSecondaryActionWrapper,
} from '../../../../components/form-secondary-action';
import { useT } from '../../../../lib/use-t';
import type BigNumber from 'bignumber.js';
import { isAssetNative } from '@vegaprotocol/utils';

export function Amount(props: {
  control: Control<FormFields>;
  balanceOf: BigNumber | undefined;
  nativeBalanceOf: BigNumber | undefined;
  symbol?: string;
}) {
  const t = useT();
  const form = useFormContext<FormFields>();
  const fromAsset = form.watch('fromAsset');

  return (
    <Controller
      control={props.control}
      name="amount"
      render={({ field, fieldState }) => {
        return (
          <FormGroup
            label={
              props.symbol
                ? t('Amount ({{symbol}})', { symbol: props.symbol })
                : t('Amount')
            }
            labelFor="amount"
          >
            <Input {...field} />
            {fieldState.error && (
              <TradingInputError>{fieldState.error.message}</TradingInputError>
            )}
            {fromAsset && (
              <FormSecondaryActionWrapper>
                <FormSecondaryActionButton
                  onClick={() => {
                    const fromAsset = form.getValues('fromAsset');

                    if (!fromAsset) return;

                    // TODO: use max not picking up selected asset??
                    const value = isAssetNative(fromAsset)
                      ? props.nativeBalanceOf?.toString() || '0'
                      : props.balanceOf?.toString() || '0';

                    form.setValue('amount', value, {
                      shouldValidate: true,
                    });
                  }}
                >
                  {t('Use maximum')}
                </FormSecondaryActionButton>
              </FormSecondaryActionWrapper>
            )}
          </FormGroup>
        );
      }}
    />
  );
}
