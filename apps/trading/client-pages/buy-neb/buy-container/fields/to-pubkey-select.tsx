import { FormGroup, TradingInputError } from '@vegaprotocol/ui-toolkit';
import { type Control, Controller } from 'react-hook-form';
import { type FormFields } from '../form-schema';
import { type Key } from '@vegaprotocol/wallet';
import { useT } from '../../../../lib/use-t';
import { APP_NAME } from '../../../../lib/constants';

export function ToPubKeySelect(props: {
  control: Control<FormFields>;
  pubKeys: Key[];
}) {
  const t = useT();
  return (
    <Controller
      name="toPubKey"
      control={props.control}
      render={({ field, fieldState }) => {
        return (
          <FormGroup
            label={t('DEPOSIT_FIELD_TO_PUBKEY', { appName: APP_NAME })}
            labelFor="toPubKey"
          >
            <input
              {...field}
              className="appearance-none w-full bg-transparent"
              readOnly
            />
            {fieldState.error && (
              <TradingInputError>{fieldState.error.message}</TradingInputError>
            )}
          </FormGroup>
        );
      }}
    />
  );
}
