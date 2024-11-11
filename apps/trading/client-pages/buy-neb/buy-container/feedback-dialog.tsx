import {
  Dialog,
  DialogTitle,
  VegaIcon,
  VegaIconNames,
} from '@vegaprotocol/ui-toolkit';
import { type ReactNode } from 'react';
import { addDecimalsFormatNumber } from '@vegaprotocol/utils';
import { useT } from '../../../lib/use-t';
import {
  BlockExplorerLink,
  DApp,
  EXPLORER_TX,
  useLinks,
} from '@vegaprotocol/environment';
import { type TxDeposit, type TxSquidDeposit } from '../../../stores/evm';

import {
  ConfirmedBadge,
  DefaultBadge,
  FailedBadge,
  PendingBadge,
} from '../../../components/transaction-dialog/transaction-badge';
import { APP_SYMBOL, DEFAULT_DISPLAY_DPS } from '../../../lib/constants';
import type { useSimpleTransaction } from '@vegaprotocol/wallet-react';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Links } from 'apps/trading/lib/links';
import type { OrderCheck } from './use-buy-form';

type FeedbackDialogProps = {
  estimatedAmount: string;
  depositData?: TxDeposit;
  orderTx?: ReturnType<typeof useSimpleTransaction>;
  onChange: (open: boolean) => void;
  depositCheck: OrderCheck;
  orderCheck: OrderCheck;
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
          depositCheck={props.depositCheck}
          orderCheck={props.orderCheck}
        />
      )}
    </Dialog>
  );
};

const Content = (props: {
  tx: TxDeposit;
  estimatedAmount: string;
  orderTx: FeedbackDialogProps['orderTx'];
  depositCheck: OrderCheck;
  orderCheck: OrderCheck;
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
                ? !data.approveHash || !data.approveReceipt
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
                className="text-sm text-surface-0-fg-muted"
              >
                {t('View on explorer')}
              </BlockExplorerLink>
            )}
          </FeedbackStep>
          <FeedbackStep
            pending={
              !data.depositHash &&
              (data.approvalRequired ? Boolean(data.approveReceipt) : true)
            }
            complete={Boolean(data.depositHash)}
          >
            <p>{t('Send deposit')}</p>
            {data.depositHash && (
              <BlockExplorerLink
                sourceChainId={props.tx.chainId}
                tx={data.depositHash}
                className="text-sm text-surface-0-fg-muted"
              >
                {t('View on explorer')}
              </BlockExplorerLink>
            )}
          </FeedbackStep>
          <FeedbackStep
            pending={
              props.tx.status === 'complete' || props.depositCheck === 'pending'
            }
            complete={
              props.tx.status === 'finalized' &&
              props.depositCheck === 'success'
            }
            failed={props.depositCheck === 'fail'}
          >
            <p>{t('Confirm deposit')}</p>
            {props.depositCheck === 'fail' ? (
              <p className="text-sm text-intent-danger">
                {t('The deposit failed')}
              </p>
            ) : (
              <>
                {props.depositCheck === 'success' &&
                props.tx.status === 'finalized' ? (
                  <p className="text-sm text-surface-0-fg-muted">
                    {t('Deposit complete')}
                  </p>
                ) : props.depositCheck === 'pending' ||
                  props.tx.status === 'complete' ||
                  props.tx.status === 'finalized' ? (
                  <p className="text-sm text-surface-0-fg-muted">
                    {t('This may take several minutes')}
                  </p>
                ) : null}
              </>
            )}
          </FeedbackStep>
          <OrderFeedbackStep
            orderTx={props.orderTx}
            orderCheck={props.orderCheck}
          />
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
  swapCheck: OrderCheck;
  orderCheck: OrderCheck;
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
          swapCheck={props.swapCheck}
          orderCheck={props.orderCheck}
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
  swapCheck: OrderCheck;
  orderCheck: OrderCheck;
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
                className="underline underline-offset-4 flex items-center gap-1 text-sm text-surface-0-fg-muted"
                target="_blank"
                rel="noreferrer"
              >
                {t('View on Axelarscan')}
                <VegaIcon name={VegaIconNames.OPEN_EXTERNAL} size={14} />
              </a>
            )}
          </FeedbackStep>
          <FeedbackStep
            pending={
              Boolean(data.hash && !data.result) ||
              props.swapCheck === 'pending'
            }
            complete={Boolean(data.result) && props.swapCheck === 'success'}
            failed={props.swapCheck === 'fail'}
          >
            <p>{t('Confirm deposit')}</p>
            {Boolean(
              (data.hash && !data.result) || props.swapCheck === 'pending'
            ) && (
              <p className="text-sm text-surface-0-fg-muted">
                {t('This may take several minutes')}
              </p>
            )}
            {props.swapCheck === 'fail' ? (
              <p className="text-sm text-intent-danger">
                {t('The swap with squid router failed')}
              </p>
            ) : (
              <>
                {props.tx.status === 'finalized' &&
                  data.receipt &&
                  props.swapCheck === 'success' && (
                    <p className="text-surface-0-fg-muted text-sm">
                      {t('Deposit complete')}
                    </p>
                  )}
              </>
            )}
          </FeedbackStep>
          <OrderFeedbackStep
            orderTx={props.orderTx}
            orderCheck={props.orderCheck}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="text-intent-danger">{t('Deposit failed:')}</p>
          {props.tx.error && (
            <>
              {isUserRejected(props.tx.error) ? (
                <p className="text-sm">{t('User rejected the transaction')}</p>
              ) : (
                <p className="break-all text-sm">{props.tx.error.message}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const FeedbackStep = (props: {
  children: ReactNode;
  pending: boolean;
  complete: boolean;
  failed?: boolean;
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="w-8 flex justify-center items-center">
        {props.complete ? (
          <ConfirmedBadge />
        ) : props.pending ? (
          <PendingBadge />
        ) : props.failed ? (
          <FailedBadge />
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

function OrderFeedbackStep(props: {
  orderTx?: ReturnType<typeof useSimpleTransaction>;
  orderCheck: OrderCheck;
}) {
  const t = useT();
  const explorerLink = useLinks(DApp.Explorer);

  const failContent = (
    <>
      <p className="text-intent-danger text-sm">{t('Spot order failed')}</p>
      {props.orderTx?.error && (
        <p className="text-sm text-surface-0-fg-muted first-letter:capitalize">
          {props.orderTx?.error}
        </p>
      )}
      {props.orderTx?.result?.txHash && (
        <Link
          to={explorerLink(
            EXPLORER_TX.replace(':hash', props.orderTx.result.txHash)
          )}
          className="text-sm text-surface-0-fg-muted"
        >
          {t('View on explorer')}
        </Link>
      )}
    </>
  );

  return (
    <FeedbackStep
      pending={
        props.orderTx?.status === 'Requested' ||
        props.orderTx?.status === 'Pending' ||
        props.orderCheck === 'pending'
      }
      complete={
        props.orderTx?.status === 'Confirmed' && props.orderCheck === 'success'
      }
      failed={props.orderCheck === 'fail'}
    >
      <p>{t('Approve spot order')}</p>
      {props.orderCheck === 'fail' ? (
        <>
          {props.orderTx?.status === 'Failed' ? (
            <>{failContent}</>
          ) : (
            <p className="text-sm text-intent-warning">
              <Trans
                i18nKey="The spot market order might not have worked, <0>click here</0> to check on Console"
                components={[
                  <Link
                    key="link"
                    to={Links.PORTFOLIO()}
                    className="underline underline-offset-4"
                  >
                    click here
                  </Link>,
                ]}
              />
            </p>
          )}
        </>
      ) : (
        <>
          {props.orderTx?.status === 'Requested' && (
            <p className="text-surface-0-fg-muted text-sm">
              {t('Confirm in wallet...')}
            </p>
          )}
          {props.orderTx?.status === 'Confirmed' &&
            props.orderCheck === 'success' && (
              <p className="text-surface-0-fg-muted text-sm">
                {t('Spot order confirmed')}
              </p>
            )}
          {props.orderTx?.status === 'Failed' && <>{failContent}</>}
        </>
      )}
    </FeedbackStep>
  );
}
