import BigNumber from 'bignumber.js';
import { yesterday } from '../utils';
import { useCandlesV2 } from './use-candles-v2';
import { type CandleV2 } from '../queries/candle-data-v2';

/** Get candle data from the last 24 hours */
export function useCandleData(marketId: string) {
  const queryResult = useCandlesV2(marketId, '3600', String(yesterday()));

  const candles = queryResult.data?.filter((c) => Boolean(c.close));

  const volume = useCandleVolume(candles);
  const sparkline = useCandleSparkline(candles);
  const priceChange = useCandlePriceChange(candles);
  const pctChange = useCandlePctChange(candles);

  return {
    ...queryResult,
    // notional,
    volume,
    sparkline,
    priceChange,
    pctChange,
  };
}

function useCandleVolume(candles?: CandleV2[]) {
  if (!candles) return;

  const volume = candles?.reduce((acc, candle) => {
    if (candle.volume) {
      return acc.plus(candle.volume);
    }
    return acc;
  }, new BigNumber(0));

  return volume;
}

function useCandleSparkline(candles?: CandleV2[]) {
  if (!candles) return;

  const sparkline = candles?.map((d) => d.close);

  return sparkline;
}

function useCandlePriceChange(candles?: CandleV2[]) {
  if (!candles) return;

  const firstCandle = candles[0];
  const lastCandle = candles[candles.length - 1];

  if (!firstCandle?.close || !lastCandle?.close) return;

  const priceChange = lastCandle.close - firstCandle.close;
  return priceChange;
}

function useCandlePctChange(candles?: CandleV2[]) {
  if (!candles) return;

  const firstCandle = candles[0];
  const lastCandle = candles[candles.length - 1];

  if (!firstCandle?.close || !lastCandle?.close) return;

  const priceChange = lastCandle.close - firstCandle.close;
  const pctChange = (priceChange / firstCandle.close) * 100;
  return pctChange;
}
