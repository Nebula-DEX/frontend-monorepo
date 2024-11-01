import { FormGroup, truncateMiddle } from '@vegaprotocol/ui-toolkit';
import { type Control, Controller } from 'react-hook-form';
import { type FormFields } from '../form-schema';
import { useT } from '../../../../lib/use-t';
import { APP_NAME, APP_TOKEN_ID } from '../../../../lib/constants';
import { type Key } from '@vegaprotocol/wallet';
import { Emblem } from '@vegaprotocol/emblem';

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
        const value = key
          ? `${truncateMiddle(field.value)} - ${key?.name}`
          : truncateMiddle(field.value);

        return (
          <FormGroup
            labelFor="toPubKey"
            label={t('DEPOSIT_FIELD_TO_PUBKEY', { appName: APP_NAME })}
          >
            <div className="flex items-center gap-2">
              <Emblem asset={APP_TOKEN_ID} size={25} />
              <input
                value={value}
                readOnly
                className="appearance-none bg-transparent text-sm text-surface-0-fg-muted w-full focus:outline-none font-mono"
                tabIndex={-1}
              />
            </div>
          </FormGroup>
        );
      }}
    />
  );
}
