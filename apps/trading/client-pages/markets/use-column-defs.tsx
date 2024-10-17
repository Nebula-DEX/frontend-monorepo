import { useMemo } from 'react';
import type { ColDef, ValueFormatterParams } from 'ag-grid-community';
import type {
  VegaICellRendererParams,
  VegaValueFormatterParams,
  VegaValueGetterParams,
} from '@vegaprotocol/datagrid';
import { MarketProductPill, StackedCell } from '@vegaprotocol/datagrid';
import {
  addDecimalsFormatNumber,
  formatNumber,
  priceChangePercentage,
  toBigNum,
} from '@vegaprotocol/utils';
import { Sparkline, Tooltip } from '@vegaprotocol/ui-toolkit';
import type {
  MarketMaybeWithData,
  MarketMaybeWithDataAndCandles,
} from '@vegaprotocol/markets';
import {
  Last24hPriceChange,
  calcCandleVolume,
  calcCandleVolumePrice,
  getAsset,
  getQuoteAsset,
  getQuoteName,
  isSpot,
} from '@vegaprotocol/markets';
import { useT } from '../../lib/use-t';
import { Emblem } from '@vegaprotocol/emblem';
import { MarketIcon, getMarketStateTooltip } from './market-icon';

const openInterestValues = (data: MarketMaybeWithData) => {
  if (!data) return null;
  const { data: marketData, positionDecimalPlaces, decimalPlaces } = data;
  if (!marketData) return null;
  const { openInterest, markPrice } = marketData;

  const openInterestPosition =
    openInterest === undefined
      ? '-'
      : addDecimalsFormatNumber(openInterest, positionDecimalPlaces);
  const openInterestNotional = toBigNum(
    openInterest,
    positionDecimalPlaces
  ).multipliedBy(toBigNum(markPrice, decimalPlaces));

  return {
    openInterest: openInterestPosition,
    openInterestNotional,
  };
};

const OpenInterestCell = ({
  data,
}: {
  data: MarketMaybeWithData | undefined;
}) => {
  const openInterestData = data && openInterestValues(data);
  if (!openInterestData) return null;
  const { openInterest, openInterestNotional } = openInterestData;
  const assetSymbol = getOpenInterestCellUnits(data);
  const openInterestNotionalFormatted =
    assetSymbol.toUpperCase() === 'USDT'
      ? `$${formatNumber(openInterestNotional, 0)}`
      : `${formatNumber(openInterestNotional, 0)} ${assetSymbol}`;
  return (
    <StackedCell
      primary={openInterest}
      secondary={openInterestNotionalFormatted}
    />
  );
};

/**
 * Open Interest should be expressed in settlement units as per:
 * frontend-monorepo/issues/7024
 */
const getOpenInterestCellUnits = (
  data: MarketMaybeWithData | undefined
): string => {
  if (!data) return '';

  const p = data?.tradableInstrument?.instrument?.product;
  if (p.__typename === 'Perpetual' || p.__typename === 'Future') {
    return p.settlementAsset.symbol;
  }

  // Spot markets have no explicit settlement asset, so we use the quote instead
  return getQuoteName(data);
};

export const priceChangeRenderer = (
  data: MarketMaybeWithDataAndCandles | undefined,
  showChangeValue = true
) => {
  if (!data) return null;
  return (
    <Last24hPriceChange
      marketId={data.id}
      decimalPlaces={data.decimalPlaces}
      orientation="vertical"
      showChangeValue={showChangeValue}
      fallback={
        <span className="leading-4">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden">
            <span data-testid="price-change-percentage">{'0.00%'}</span>
          </div>
          {showChangeValue && (
            <span
              data-testid="price-change"
              className="text-ellipsis whitespace-nowrap overflow-hidden text-surface-1-fg-muted text-xs"
            >
              ({'0.00'})
            </span>
          )}
        </span>
      }
    />
  );
};

export const priceChangeSparklineRenderer = (
  data: MarketMaybeWithDataAndCandles | undefined
) => {
  if (!data) return null;
  const candles = data.candles
    ?.filter((c) => c.close)
    .map((c) => Number(c.close));
  if (!candles?.length) return null;
  return <Sparkline width={80} height={20} data={candles || [0]} />;
};

export const priceValueFormatter = (
  data: MarketMaybeWithData | undefined,
  formatDecimalPlaces?: number
): string => {
  if (isSpotMarket(data)) {
    const quoteAsset = data && getQuoteAsset(data);
    return data?.data?.lastTradedPrice === undefined
      ? '-'
      : `${addDecimalsFormatNumber(
          data.data.lastTradedPrice,
          data.decimalPlaces
        )} ${quoteAsset?.symbol}`;
  }
  let quoteName: string | undefined = undefined;
  if (data?.tradableInstrument?.instrument?.product) {
    quoteName = data && getQuoteName(data);
  }

  return data?.data?.bestOfferPrice === undefined
    ? '-'
    : quoteName === 'USDT'
    ? `$${addDecimalsFormatNumber(
        data.data.markPrice,
        data.decimalPlaces,
        formatDecimalPlaces
      )}`
    : `${addDecimalsFormatNumber(
        data.data.markPrice,
        data.decimalPlaces,
        formatDecimalPlaces
      )} ${quoteName}`;
};

export const useMarketsColumnDefs = () => {
  const t = useT();

  return useMemo<ColDef[]>(
    () => [
      {
        headerName: t('Market'),
        field: 'tradableInstrument.instrument.code',
        minWidth: 410,
        pinned: true,
        cellClass: 'text-base',
        cellRenderer: ({
          value,
          data,
        }: VegaICellRendererParams<
          MarketMaybeWithData,
          'tradableInstrument.instrument.code'
        >) => {
          const tradingMode = data?.data?.marketTradingMode;
          const state = data?.data?.marketState;
          const tooltip = getMarketStateTooltip(state, tradingMode);
          const productType =
            data?.tradableInstrument?.instrument.product.__typename;
          return (
            <Tooltip description={t(tooltip)}>
              <span className="flex items-center gap-2 cursor-pointer">
                <Emblem market={data?.id || ''} />
                <StackedCell
                  primary={
                    <span className="flex gap-1 items-center">
                      {data?.tradableInstrument?.instrument.name}
                      <MarketProductPill productType={productType} />
                      <MarketIcon data={data} />
                    </span>
                  }
                  secondary={value}
                />
              </span>
            </Tooltip>
          );
        },
      },
      {
        headerName: t('Price'),
        field: 'data.markPrice',
        cellRenderer: 'PriceFlashCell',
        filter: 'agNumberColumnFilter',
        maxWidth: 150,
        cellClass: 'text-sm text-right',
        valueGetter: ({ data }: VegaValueGetterParams<MarketMaybeWithData>) => {
          if (isSpotMarket(data)) {
            return data?.data?.lastTradedPrice === undefined
              ? undefined
              : toBigNum(
                  data?.data?.lastTradedPrice,
                  data.decimalPlaces
                ).toNumber();
          }
          return data?.data?.markPrice === undefined
            ? undefined
            : toBigNum(data?.data?.markPrice, data.decimalPlaces).toNumber();
        },
        valueFormatter: ({
          data,
        }: VegaValueFormatterParams<MarketMaybeWithData, 'data.markPrice'>) => {
          return priceValueFormatter(data);
        },
      },
      {
        headerName: '24h Change',
        field: 'data.candles',
        type: 'rightAligned',
        cellClass: 'text-sm text-right font-mono',
        cellRenderer: ({
          data,
        }: ValueFormatterParams<MarketMaybeWithDataAndCandles, 'candles'>) => {
          return (
            <div className="flex gap-2 justify-end">
              <span>{priceChangeSparklineRenderer(data)}</span>
              <span>{priceChangeRenderer(data)}</span>
            </div>
          );
        },
        valueGetter: ({
          data,
        }: VegaValueGetterParams<MarketMaybeWithDataAndCandles>) => {
          if (!data?.candles) return 0;
          const candles = data.candles.map((c) => c.close);
          const change = priceChangePercentage(candles);
          if (!change) return 0;
          return change;
        },
      },
      {
        headerName: t('24h Volume'),
        type: 'rightAligned',
        field: 'data.candles',
        sort: 'desc',
        cellClass: 'text-sm text-right',
        valueGetter: ({
          data,
        }: VegaValueGetterParams<MarketMaybeWithDataAndCandles>) => {
          if (!data) return 0;
          const candles = data?.candles;
          const volPrice =
            candles &&
            calcCandleVolumePrice(
              candles,
              data.decimalPlaces,
              data.positionDecimalPlaces
            );
          if (!volPrice) return 0;
          return Number(volPrice);
        },
        cellRenderer: ({
          data,
        }: ValueFormatterParams<MarketMaybeWithDataAndCandles, 'candles'>) => {
          if (!data) return '-';
          const candles = data.candles;
          const vol = candles ? calcCandleVolume(candles) : '0';
          let quoteName: string | undefined = undefined;
          try {
            quoteName = getAsset(data).symbol;
          } catch {
            quoteName = '';
          }
          const volPrice = candles
            ? calcCandleVolumePrice(
                candles,
                data.decimalPlaces,
                data.positionDecimalPlaces
              )
            : '0';

          const volume =
            data && vol && vol !== '0'
              ? addDecimalsFormatNumber(vol, data.positionDecimalPlaces, 2)
              : '0.00';
          const volumePrice = volPrice && formatNumber(volPrice, 0);

          return volumePrice ? (
            <span className="font-mono">
              <StackedCell
                primary={volume}
                secondary={
                  quoteName === 'USDT'
                    ? `$${volumePrice}`
                    : `${volumePrice} ${quoteName}`
                }
              />
            </span>
          ) : (
            <StackedCell primary={volume} secondary={''} />
          );
        },
      },
      {
        headerName: t('Open interest'),
        field: 'data.openInterest',
        type: 'rightAligned',
        cellClass: 'text-sm text-right',
        valueGetter: ({ data }: VegaValueGetterParams<MarketMaybeWithData>) => {
          const openInterestData = data && openInterestValues(data);
          if (!openInterestData) return 0;
          const { openInterestNotional } = openInterestData;
          return openInterestNotional.toNumber();
        },
        cellRenderer: ({
          data,
        }: VegaValueFormatterParams<
          MarketMaybeWithData,
          'data.openInterest'
        >) => {
          if (!data || isSpotMarket(data) || !openInterestValues(data)) {
            return <span>-</span>;
          }
          return (
            <span className="font-mono">
              <OpenInterestCell data={data} />
            </span>
          );
        },
      },
    ],
    [t]
  );
};

const isSpotMarket = (
  market: Pick<MarketMaybeWithData, 'tradableInstrument'> | undefined | null
) => {
  const product = market?.tradableInstrument?.instrument?.product;
  return product && isSpot(product);
};
