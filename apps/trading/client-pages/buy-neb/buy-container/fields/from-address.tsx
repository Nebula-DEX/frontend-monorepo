import { type Control, useFormContext } from 'react-hook-form';

import { useAccount, useDisconnect, useChainId, useAccountEffect } from 'wagmi';
import { ConnectKitButton } from 'connectkit';

import {
  FormGroup,
  Button,
  Intent,
  truncateMiddle,
} from '@vegaprotocol/ui-toolkit';
import { Emblem } from '@vegaprotocol/emblem';

import { useT } from '../../../../lib/use-t';

import { type FormFields } from '../form-schema';

import {
  FormSecondaryActionButton,
  FormSecondaryActionWrapper,
} from '../../../../components/form-secondary-action';

export function FromAddress(props: { control: Control<FormFields> }) {
  const t = useT();
  const form = useFormContext();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();
  const chainId = useChainId();

  useAccountEffect({
    onConnect: ({ address }) => {
      form.setValue('fromAddress', address, { shouldValidate: true });
    },
    onDisconnect: () => form.setValue('fromAddress', ''),
  });

  return (
    <FormGroup label={t('From address')} labelFor="fromAddress">
      {isConnected ? (
        <div className="flex items-center gap-2">
          <Emblem chain={String(chainId)} size={25} />
          <input
            value={truncateMiddle(address as string)}
            readOnly
            className="appearance-none bg-transparent text-sm text-surface-0-fg-muted w-full focus:outline-none font-mono"
            tabIndex={-1}
          />
          <FormSecondaryActionWrapper>
            <FormSecondaryActionButton
              onClick={() => disconnect()}
              className="mt-6"
            >
              {t('Disconnect')}
            </FormSecondaryActionButton>
          </FormSecondaryActionWrapper>
        </div>
      ) : (
        <ConnectKitButton.Custom>
          {({ show }) => {
            return (
              <Button
                type="button"
                onClick={() => {
                  if (show) show();
                }}
                intent={Intent.Info}
                size="sm"
              >
                {t('Connect')}
              </Button>
            );
          }}
        </ConnectKitButton.Custom>
      )}
    </FormGroup>
  );
}
