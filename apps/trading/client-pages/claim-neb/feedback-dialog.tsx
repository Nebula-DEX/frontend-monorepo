import { DialogTitle } from '@vegaprotocol/ui-toolkit';
import { type ReactNode } from 'react';
import { useT } from '../../lib/use-t';

import {
  ConfirmedBadge,
  DefaultBadge,
  FailedBadge,
  PendingBadge,
} from '../../components/transaction-dialog/transaction-badge';
import type { UseMutationResult } from '@tanstack/react-query';
import type { UseSignMessageReturnType } from 'wagmi';

type FeedbackDialogProps = {
  mutationSign: UseSignMessageReturnType<unknown>;
  mutationSend: UseMutationResult<void, Error, string, unknown>;
};

export const FeedbackDialog = (props: FeedbackDialogProps) => {
  const t = useT();
  return (
    <>
      <DialogTitle className="sr-only">{t('Claim NEB')}</DialogTitle>
      <div className="flex flex-col items-start gap-4">
        <div className="flex flex-col gap-4 w-full">
          <FeedbackStep
            pending={props.mutationSign.isPending}
            complete={props.mutationSign.isSuccess}
            failed={props.mutationSign.isError}
          >
            <p>{t('Sign message')}</p>
            {props.mutationSign.isError && (
              <p className="text-sm text-intent-danger">
                {props.mutationSign.error.message}
              </p>
            )}
            {props.mutationSign.isSuccess && (
              <p className="text-sm text-surface-0-fg-muted">Message signed</p>
            )}
            {props.mutationSign.isPending && (
              <p className="text-sm text-surface-0-fg-muted">
                Approve in wallet
              </p>
            )}
          </FeedbackStep>
          <FeedbackStep
            pending={props.mutationSend.isPending}
            complete={props.mutationSend.isSuccess}
            failed={props.mutationSend.isError}
          >
            <p>{t('Claim')}</p>
            {props.mutationSend.isError && (
              <p className="text-sm text-intent-danger">
                {props.mutationSend.error.message}
              </p>
            )}
            {props.mutationSend.isPending ||
              (props.mutationSend.isIdle && (
                <p className="text-sm text-surface-0-fg-muted">
                  {t('Send claim request')}
                </p>
              ))}
            {props.mutationSend.isSuccess && (
              <p className="text-sm text-green-550">
                {t(
                  'Claim request complete. It may take several minutes to credit your account.'
                )}
              </p>
            )}
          </FeedbackStep>
        </div>
      </div>
    </>
  );
};

const FeedbackStep = ({
  failed = false,
  ...props
}: {
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
        ) : failed ? (
          <FailedBadge />
        ) : (
          <DefaultBadge />
        )}
      </div>
      <div className="grow flex flex-col gap-0.5">{props.children}</div>
    </div>
  );
};
