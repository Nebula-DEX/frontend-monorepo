import { FormGroup, Input, TradingInputError } from '@vegaprotocol/ui-toolkit';
import { type Control, Controller } from 'react-hook-form';
import { type FormFields } from '../form-schema';
import { useT } from '../../../lib/use-t';
import { APP_NAME } from '../../../lib/constants';
import { type Key } from '@vegaprotocol/wallet';

export function ToPubKey(props: {
  control: Control<FormFields>;
  pubKeys: Key[];
}) {
  const t = useT();
  return (
    <Controller
      name="toPubKey"
      control={props.control}
      render={({ field, fieldState }) => {
        const key = props.pubKeys.find((p) => p.publicKey === field.value);

        return (
          <FormGroup
            label={t('DEPOSIT_FIELD_TO_PUBKEY', { appName: APP_NAME })}
            labelFor="toPubKey"
          >
            {key ? (
              <input
                className="appearance-none bg-transparent text-sm text-surface-0-fg-muted w-full focus:outline-none"
                readOnly
                value={field.value}
              />
            ) : (
              <Input {...field} value={field.value} />
            )}
            {fieldState.error && (
              <TradingInputError>{fieldState.error.message}</TradingInputError>
            )}
          </FormGroup>
        );
      }}
    />
  );
}
