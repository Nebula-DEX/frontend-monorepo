import groupBy from 'lodash/groupBy';
import { addDecimalsFormatNumber, toBigNum } from '@vegaprotocol/utils';
import BigNumber from 'bignumber.js';
import { type RouteResponse } from '@0xsquid/sdk/dist/types';
import { TradingInputError } from '@vegaprotocol/ui-toolkit';
import { useT } from '../../../lib/use-t';
import { APP_SYMBOL } from '../../../lib/constants';
import type { AssetERC20 } from '@vegaprotocol/assets';
import type { Market } from '@vegaprotocol/rest';

export const SwapInfo = (props: {
  route?: RouteResponse['route'];
  estimatedAmount: string;
  error: Error | null;
  bestAsk?: { price: string; volume: string; numberOfOrders: string };
  nextBestAsk?: { price: string; volume: string; numberOfOrders: string };
  market: Market;
}) => {
  const t = useT();
  const error = props.error;

  if (error) {
    return <TradingInputError>{error.message}</TradingInputError>;
  }

  if (!props.route) {
    return null;
  }

  const estimate = props.route.estimate;
  const feeGroups = groupBy(estimate.feeCosts, 'token.address');
  const gasGroups = groupBy(estimate.gasCosts, 'token.address');

  return (
    <dl className="text-xs">
      <div className="grid grid-cols-2">
        <dt className="text-surface-1-fg-muted">{t('USDT')} (est)</dt>
        <dd className="text-right">
          {addDecimalsFormatNumber(
            estimate.toAmount,
            estimate.toToken.decimals
          )}{' '}
          {estimate.toToken.symbol}
        </dd>
      </div>
      <div className="grid grid-cols-2">
        <dt className="text-surface-1-fg-muted">{t('NEB')} (est)</dt>
        <dd className="text-right">
          {props.estimatedAmount} {APP_SYMBOL}
        </dd>
      </div>
      {props.bestAsk && (
        <div className="grid grid-cols-2">
          <dt className="text-surface-1-fg-muted">{t('Best offer')}</dt>
          <dd className="text-right">
            {`${addDecimalsFormatNumber(
              props.bestAsk.volume,
              props.market.positionDecimalPlaces
            )} @ `}
            {addDecimalsFormatNumber(
              props.bestAsk.price,
              estimate.toToken.decimals
            )}{' '}
            {estimate.toToken.symbol}
          </dd>
        </div>
      )}
      {props.nextBestAsk && (
        <div className="grid grid-cols-2">
          <dt className="text-surface-1-fg-muted">{t('Next best offer')}</dt>
          <dd className="text-right">
            {`${addDecimalsFormatNumber(
              props.nextBestAsk.volume,
              props.market.positionDecimalPlaces
            )} @ `}
            {addDecimalsFormatNumber(
              props.nextBestAsk.price,
              estimate.toToken.decimals
            )}{' '}
            {estimate.toToken.symbol}
          </dd>
        </div>
      )}
      {Object.entries(gasGroups).map(([key, group]) => {
        const fees = group.map((f) => {
          return toBigNum(f.amount, f.token.decimals);
        });
        const total = BigNumber.sum.apply(null, fees);
        return (
          <div key={key} className="grid grid-cols-2 mt-2">
            <dt className="text-surface-1-fg-muted">{t('Gas costs')}</dt>
            <dd className="text-right">
              {total.toString()} {group[0].token.symbol}
            </dd>
          </div>
        );
      })}
      {Object.entries(feeGroups).map(([key, group]) => {
        const fees = group.map((f) => {
          return toBigNum(f.amount, f.token.decimals);
        });
        const total = BigNumber.sum.apply(null, fees);
        return (
          <div key={key} className="grid grid-cols-2">
            <dt className="text-surface-1-fg-muted">{t('Estimated fees')}</dt>
            <dd className="text-right">
              {total.toString()} {group[0].token.symbol}
            </dd>
          </div>
        );
      })}
    </dl>
  );
};

export const NonSwapInfo = (props: {
  estimatedAmount: string;
  bestAsk?: { price: string; volume: string; numberOfOrders: string };
  nextBestAsk?: { price: string; volume: string; numberOfOrders: string };
  toAsset?: AssetERC20;
  market: Market;
  amount: string;
}) => {
  const t = useT();
  return (
    <dl className="text-xs">
      {props.toAsset && (
        <div className="grid grid-cols-2">
          <dt className="text-surface-1-fg-muted">{t('USDT')}</dt>
          <dd className="text-right">
            {props.amount || '0'} {props.toAsset.symbol}
          </dd>
        </div>
      )}
      <div className="grid grid-cols-2">
        <dt className="text-surface-1-fg-muted">{t('NEB')} (est)</dt>
        <dd className="text-right">
          {props.estimatedAmount} {APP_SYMBOL}
        </dd>
      </div>
      {props.toAsset && (
        <>
          {props.bestAsk && (
            <div className="grid grid-cols-2">
              <dt className="text-surface-1-fg-muted">{t('Best offer')}</dt>
              <dd className="text-right">
                {`${addDecimalsFormatNumber(
                  props.bestAsk.volume,
                  props.market.positionDecimalPlaces
                )} @ `}
                {addDecimalsFormatNumber(
                  props.bestAsk.price,
                  props.toAsset.decimals
                )}{' '}
                {props.toAsset.symbol}
              </dd>
            </div>
          )}
          {props.nextBestAsk && (
            <div className="grid grid-cols-2">
              <dt className="text-surface-1-fg-muted">
                {t('Next best offer')}
              </dt>
              <dd className="text-right">
                {`${addDecimalsFormatNumber(
                  props.nextBestAsk.volume,
                  props.market.positionDecimalPlaces
                )} @ `}
                {addDecimalsFormatNumber(
                  props.nextBestAsk.price,
                  props.toAsset.decimals
                )}{' '}
                {props.toAsset.symbol}
              </dd>
            </div>
          )}
        </>
      )}
    </dl>
  );
};
