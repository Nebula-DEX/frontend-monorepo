import {
  Dialog,
  DialogTitle,
  VegaIcon,
  VegaIconNames,
} from '@vegaprotocol/ui-toolkit';
import { type ReactNode } from 'react';
import { addDecimalsFormatNumber } from '@vegaprotocol/utils';
import { useT } from '../../../lib/use-t';
import { BlockExplorerLink } from '@vegaprotocol/environment';
import { type TxDeposit, type TxSquidDeposit } from '../../../stores/evm';

import {
  ConfirmedBadge,
  DefaultBadge,
  PendingBadge,
} from '../../../components/transaction-dialog/transaction-badge';
import { APP_SYMBOL, DEFAULT_DISPLAY_DPS } from '../../../lib/constants';
import type { useSimpleTransaction } from '@vegaprotocol/wallet-react';

type FeedbackDialogProps = {
  estimatedAmount: string;
  depositData?: TxDeposit;
  orderTx?: ReturnType<typeof useSimpleTransaction>;
  onChange: (open: boolean) => void;
};

export const FeedbackDialog = (props: FeedbackDialogProps) => {
  const t = useT();
  const txActive = Boolean(
    props.depositData && props.depositData.status !== 'idle'
  );
  return (
    <Dialog open={txActive} onChange={props.onChange}>
      <DialogTitle className="sr-only">{t('Deposit')}</DialogTitle>
      {props.depositData && (
        <Content
          tx={props.depositData}
          orderTx={props.orderTx}
          estimatedAmount={props.estimatedAmount}
        />
      )}
    </Dialog>
  );
};

const Content = (props: {
  tx: TxDeposit;
  estimatedAmount: string;
  orderTx: FeedbackDialogProps['orderTx'];
}) => {
  const t = useT();
  const data = props.tx.data;

  const showSteps = data && props.tx.status !== 'error';

  return (
    <div className="flex flex-col items-start gap-4">
      <div>
        <p className="text-surface-1-fg-muted">
          {t('Send')} <br />
          {data && data.asset && (
            <span className="text-surface-1-fg text-2xl">
              {addDecimalsFormatNumber(
                data.amount,
                data.asset.decimals,
                DEFAULT_DISPLAY_DPS
              )}{' '}
              {data.asset.symbol}
            </span>
          )}
        </p>
        <p className="text-surface-1-fg-muted">
          {t('Receive')} <br />
          <span className="text-surface-1-fg text-2xl">
            {props.estimatedAmount}
            {` ${APP_SYMBOL}`}
          </span>
        </p>
      </div>
      <hr className="w-full" />
      {showSteps ? (
        <div className="flex flex-col gap-4 w-full">
          <FeedbackStep
            pending={
              data.approvalRequired
                ? Boolean(data.approveHash && !data.approveReceipt)
                : false
            }
            complete={
              data.approvalRequired ? Boolean(data.approveReceipt) : true
            }
          >
            <span>{t('Approve spending')}</span>
            {data.approveHash && (
              <BlockExplorerLink
                sourceChainId={props.tx.chainId}
                tx={data.approveHash}
                className="text-sm"
              >
                {t('View on explorer')}
              </BlockExplorerLink>
            )}
          </FeedbackStep>
          <FeedbackStep
            pending={Boolean(data.depositHash && !data.depositReceipt)}
            complete={Boolean(data.depositReceipt)}
          >
            <p>{t('Send deposit')}</p>
            {data.depositHash && (
              <BlockExplorerLink
                sourceChainId={props.tx.chainId}
                tx={data.depositHash}
                className="text-sm"
              >
                {t('View on explorer')}
              </BlockExplorerLink>
            )}
          </FeedbackStep>
          <FeedbackStep
            pending={Boolean(data.depositHash && data.depositReceipt)}
            complete={Boolean(props.tx.status === 'finalized')}
          >
            <p>{t('Confirm deposit')}</p>
          </FeedbackStep>
          <FeedbackStep
            pending={
              props.orderTx?.status === 'Requested' ||
              props.orderTx?.status === 'Pending'
            }
            complete={props.orderTx?.status === 'Confirmed'}
          >
            <p>{t('Approve spot order')}</p>
            {props.orderTx?.status === 'Requested' && (
              <p className="text-surface-0-fg-muted">
                {t('Confirm in wallet')}
              </p>
            )}
            {props.orderTx?.status === 'Confirmed' && (
              <p className="text-surface-0-fg-muted">
                {t('Spot order confirmed')}
              </p>
            )}
          </FeedbackStep>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="text-intent-danger">{t('Deposit failed:')}</p>
          {props.tx.error && (
            <>
              {isUserRejected(props.tx.error) ? (
                <p>{t('User rejected the transaction')}</p>
              ) : (
                <p className="break-all">{props.tx.error.message}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

type SquidFeedbackDialogProps = {
  depositData?: TxSquidDeposit;
  orderTx?: ReturnType<typeof useSimpleTransaction>;
  asks?: Array<{ price: string; volume: string; numberOfOrders: string }>;
  onChange: (open: boolean) => void;
  estimatedAmount: string;
};

export const SquidFeedbackDialog = (props: SquidFeedbackDialogProps) => {
  const t = useT();
  const txActive = Boolean(
    props.depositData && props.depositData.status !== 'idle'
  );
  return (
    <Dialog open={txActive} onChange={props.onChange}>
      <DialogTitle className="sr-only">{t('Swap and Deposit')}</DialogTitle>
      {props.depositData && (
        <SquidContent
          tx={props.depositData}
          orderTx={props.orderTx}
          asks={props.asks}
          estimatedAmount={props.estimatedAmount}
        />
      )}
    </Dialog>
  );
};

const SquidContent = (props: {
  tx: TxSquidDeposit;
  orderTx?: ReturnType<typeof useSimpleTransaction>;
  asks?: Array<{ price: string; volume: string; numberOfOrders: string }>;
  estimatedAmount: string;
}) => {
  const t = useT();
  const data = props.tx.data;

  const showSteps = data && props.tx.status !== 'error';
  const estimate = data?.routeData.route.estimate;

  return (
    <div className="flex flex-col items-start gap-4">
      <div>
        <p className="text-surface-1-fg-muted">
          {t('Send')} <br />
          {estimate && (
            <span className="text-surface-1-fg text-2xl">
              {addDecimalsFormatNumber(
                estimate.fromAmount,
                estimate.fromToken.decimals
              )}{' '}
              {estimate.fromToken.symbol}
            </span>
          )}
        </p>
        <p className="text-surface-1-fg-muted">
          {t('Receive')} <br />
          <span className="text-surface-1-fg text-2xl">
            {props.estimatedAmount}
            {` ${APP_SYMBOL}`}
          </span>
        </p>
      </div>
      <hr className="w-full" />
      {showSteps ? (
        <div className="flex flex-col gap-4 w-full">
          <FeedbackStep
            pending={Boolean(!data.hash)}
            complete={Boolean(data.hash)}
          >
            <span>{t('Send swap and deposit')}</span>
            {data.hash && (
              <a
                href={`https://axelarscan.io/gmp/${data.hash}`}
                className="underline underline-offset-4 flex items-center gap-1"
                target="_blank"
                rel="noreferrer"
              >
                {t('View on Axelarscan')}
                <VegaIcon name={VegaIconNames.OPEN_EXTERNAL} size={14} />
              </a>
            )}
          </FeedbackStep>
          <FeedbackStep
            pending={Boolean(data.hash && !data.result)}
            complete={Boolean(data.result)}
          >
            <p>{t('Confirm deposit')}</p>
            {props.tx.status === 'finalized' && data.receipt && (
              <p className="text-surface-0-fg-muted">
                {t(
                  'Your tokens have been swapped and deposited to the network. It may take a few minutes for your funds to appear under your public key.'
                )}
              </p>
            )}
          </FeedbackStep>
          <FeedbackStep
            pending={
              props.orderTx?.status === 'Requested' ||
              props.orderTx?.status === 'Pending'
            }
            complete={props.orderTx?.status === 'Confirmed'}
          >
            <p>{t('Approve spot order')}</p>
            {props.orderTx?.status === 'Requested' && (
              <p className="text-surface-0-fg-muted">
                {t('Confirm in wallet')}
              </p>
            )}
            {props.orderTx?.status === 'Confirmed' && (
              <p className="text-surface-0-fg-muted">
                {t('Spot order confirmed')}
              </p>
            )}
          </FeedbackStep>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="text-intent-danger">{t('Deposit failed:')}</p>
          {props.tx.error && (
            <>
              {isUserRejected(props.tx.error) ? (
                <p>{t('User rejected the transaction')}</p>
              ) : (
                <p className="break-all">{props.tx.error.message}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const FeedbackStep = (props: {
  pending: boolean;
  complete: boolean;
  children: ReactNode;
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="w-8 flex justify-center items-center">
        {props.complete ? (
          <ConfirmedBadge />
        ) : props.pending ? (
          <PendingBadge />
        ) : (
          <DefaultBadge />
        )}
      </div>
      <div className="grow flex flex-col gap-0.5">{props.children}</div>
    </div>
  );
};

function isUserRejected(err: unknown) {
  if (
    err !== null &&
    typeof err === 'object' &&
    'shortMessage' in err &&
    err.shortMessage === 'User rejected the request.'
  ) {
    return true;
  }
  return false;
}
