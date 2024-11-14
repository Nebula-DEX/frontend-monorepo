import { Button, cn, Intent } from '@vegaprotocol/ui-toolkit';
import { Side } from '@vegaprotocol/types';
import { useForm } from '../use-form';
import {
  useDialogStore,
  useVegaWallet,
  useWallet,
} from '@vegaprotocol/wallet-react';
import { useT } from '../../../lib/use-t';
import { useTicketContext } from '../ticket-context';
import {
  SidebarAccountsViewType,
  useSidebar,
  useSidebarAccountsInnerView,
  ViewType,
} from 'apps/trading/lib/hooks/use-sidebar';
import { type ReactNode } from 'react';
import omit from 'lodash/omit';
import { useOpenVolume } from '@vegaprotocol/positions';

type SubmitButtonProps = {
  type: 'button' | 'submit';
  side: Side | 'indeterminate';
  disabled: boolean;
  onClick?: () => void;
  children: ReactNode;
};

export const SubmitButton = ({ text }: { text: string }) => {
  const t = useT();
  const ticket = useTicketContext();
  const form = useForm();
  const side = form.watch('side');
  const needsDeposit = useIsDepositRequired();

  const connected = useWallet(
    (store) => store.status === 'connected' && store.current !== 'viewParty'
  );
  const openDialog = useDialogStore((store) => store.open);

  const setSidebarView = useSidebar((store) => store.setView);
  const setSidebarInnerView = useSidebarAccountsInnerView(
    (store) => store.setView
  );

  const openDeposit = (assetId: string) => {
    setSidebarView(ViewType.Assets);
    setSidebarInnerView([SidebarAccountsViewType.Deposit, assetId]);
  };

  const asset =
    ticket.type === 'default'
      ? ticket.settlementAsset
      : side === Side.SIDE_BUY
      ? ticket.quoteAsset // buying with quote
      : ticket.baseAsset; // selling with base

  let p: SubmitButtonProps = {
    type: 'button',
    side,
    disabled: true,
    onClick: undefined,
    children: text,
  };

  if (!connected) {
    return (
      <Button
        type={'button' as const}
        disabled={false}
        onClick={openDialog}
        intent={Intent.Primary}
      >
        {t('Connect')}
      </Button>
    );
  } else if (needsDeposit) {
    return (
      <Button
        type={'button'}
        disabled={false}
        onClick={() => {
          openDeposit(asset.id);
        }}
        intent={Intent.Primary}
      >
        {t('Deposit')}
      </Button>
    );
  } else {
    p = {
      type: 'submit',
      side,
      disabled: false,
      onClick: undefined,
      children: text,
    };
  }

  return (
    <button
      data-testid="place-order"
      {...omit(p, 'children', 'side')}
      className={cn(
        'w-full h-10 flex flex-col justify-center items-center rounded-button-lg text-white p-2 transition-all',
        'relative',
        {
          'bg-red-500 enabled:hover:bg-red-550 dark:bg-red-600 dark:enabled:hover:bg-red-650':
            p.side === Side.SIDE_SELL,
          'bg-green-600 enabled:hover:bg-green-650 dark:bg-green-650 dark:enabled:hover:bg-green-600':
            p.side === Side.SIDE_BUY,
          'bg-intent-primary': p.side === 'indeterminate',
        }
      )}
    >
      {p.children}
    </button>
  );
};

/**
 * Returns bool indicating if a deposit is required to trade.
 * User with no position and 0 balance in the required general account
 * will result in this function returning true
 */
const useIsDepositRequired = () => {
  const ticket = useTicketContext();
  const form = useForm();
  const { pubKey } = useVegaWallet();
  const openVolumeQuery = useOpenVolume(pubKey, ticket.market.id);
  const side = form.watch('side');
  const noPosition = openVolumeQuery?.openVolume === '0';

  if (ticket.type === 'default') {
    return noPosition && ticket.accounts.general === '0';
  }

  // Spot market. If buying will need balance in the quote account, if selling
  // will need balance in base account
  if (side === Side.SIDE_BUY) {
    return noPosition && ticket.accounts.quote === '0';
  } else {
    return noPosition && ticket.accounts.base === '0';
  }

  return false;
};
