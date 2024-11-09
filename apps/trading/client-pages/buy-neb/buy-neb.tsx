import { HeaderPage } from '../../components/header-page';
import { BuyContainer } from './buy-container';
import { useDialogStore, useVegaWallet } from '@vegaprotocol/wallet-react';
import { Button, Intent } from '@vegaprotocol/ui-toolkit';
import { APP_SYMBOL, USDT_ID } from '../../lib/constants';
import { useAccount } from 'wagmi';
import { useT } from '../../lib/use-t';

export const BuyNeb = () => {
  const t = useT();
  const { pubKey } = useVegaWallet();
  const { address } = useAccount();
  const open = useDialogStore((store) => store.open);

  return (
    <section className="flex flex-col gap-10 min-w-[500px] max-w-3xl mx-auto">
      <HeaderPage>{t('Buy {{symbol}}', { symbol: APP_SYMBOL })}</HeaderPage>
      {pubKey && address ? (
        <BuyContainer
          address={address}
          pubKey={pubKey}
          initialAssetId={USDT_ID}
        />
      ) : (
        <Button intent={Intent.Primary} onClick={open}>
          {t('Connect wallet')}
        </Button>
      )}
    </section>
  );
};
