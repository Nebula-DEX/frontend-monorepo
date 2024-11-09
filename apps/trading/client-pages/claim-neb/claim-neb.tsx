import { HeaderPage } from '../../components/header-page';
import { useDialogStore, useVegaWallet } from '@vegaprotocol/wallet-react';
import { Button, Dialog, Intent, Loader } from '@vegaprotocol/ui-toolkit';
import { useAccount, useSignMessage } from 'wagmi';
import { useT } from '../../lib/use-t';
import { useMutation } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { FeedbackDialog } from './feedback-dialog';
import { APP_SYMBOL } from 'apps/trading/lib/constants';

export const ClaimNeb = () => {
  const t = useT();
  const { pubKey } = useVegaWallet();
  const { address } = useAccount();
  const open = useDialogStore((store) => store.open);

  return (
    <section className="flex flex-col gap-10 min-w-[500px] max-w-3xl mx-auto">
      <HeaderPage>{t('Claim {{symbol}}', { symbol: APP_SYMBOL })}</HeaderPage>
      {pubKey && address ? (
        <ClaimContainer pubKey={pubKey} />
      ) : (
        <Button intent={Intent.Primary} onClick={open}>
          {t('Connect wallet')}
        </Button>
      )}
    </section>
  );
};

const ClaimContainer = (props: { pubKey: string }) => {
  const mutationSign = useSignMessage({
    mutation: {
      onError: (err) => {
        if (err.name === 'UserRejectedRequestError') {
          mutationSign.reset();
          mutationSend.reset();
        }
      },
    },
  });
  const mutationSend = useMutation({
    mutationFn: async (hash: string) => {
      // TODO:
      // - get full url for claim endpoint and make request
      const endpoint = `/claim/${props.pubKey}/${hash}`;
      // eslint-disable-next-line no-console
      console.log('GET', endpoint);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    },
  });

  const submit = async () => {
    const result = await mutationSign.signMessageAsync({
      message: props.pubKey,
    });
    mutationSend.mutate(result);
  };

  let buttonContent: ReactNode = 'Claim NEB';

  const isOpen = !mutationSign.isIdle || !mutationSend.isIdle;
  const isPending = mutationSign.isPending || mutationSend.isPending;

  if (isPending) {
    buttonContent = <Loader />;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <Button type="submit" intent={Intent.Primary} fill>
        {buttonContent}
      </Button>

      <Dialog
        open={isOpen}
        onChange={() => {
          mutationSign.reset();
          mutationSend.reset();
        }}
      >
        <FeedbackDialog
          mutationSign={mutationSign}
          mutationSend={mutationSend}
        />
      </Dialog>
    </form>
  );
};
