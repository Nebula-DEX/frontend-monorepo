import axios from 'axios';
import { z } from 'zod';
import { Time } from '../utils/datetime';
import { queryOptions } from '@tanstack/react-query';

/** Interval tme in seconds */
const intervalSchema = z.enum([
  '60', // 1m
  '300', // 5m
  '900', // 15m
  '1800', // 30m
  '3600', // 1H
  '14400', // 4H
  '21600', // 6H
  '28800', // 8H
  '43200', // 12H
  '86400', // 1D
  '604800', // 7D
]);
export type IntervalV2 = z.infer<typeof intervalSchema>;

const parametersSchema = z.object({
  marketId: z.string(),
  interval: intervalSchema,
  fromTimestamp: z.string(),
  toTimestamp: z.string().optional(),
});

export type QueryParams = z.infer<typeof parametersSchema>;

const candleSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  marketId: z.string(),
  interval: z.number(),
  openingTimestamp: z.number(),
  closingTimestamp: z.number(),
  open: z.number(),
  close: z.number(),
  high: z.number(),
  low: z.number(),
  volume: z.number().default(0),
});

export type CandleV2 = z.infer<typeof candleSchema>;

const candlesSchema = z.array(candleSchema);

export function candleDataQueryOptionsV2(params: {
  marketId: string;
  interval: IntervalV2;
  fromTimestamp: string;
  toTimestamp?: string;
}) {
  return queryOptions({
    queryKey: queryKeys.single(params),
    queryFn: () => retrieveCandleDataV2(params),
    staleTime: Time.HOUR,
    enabled: Boolean(params.marketId && params.interval),
  });
}

// Options for when polling candles for TV. Never cached as its passed directly to the chart.
export function candleDataPollOptionsV2(params: {
  marketId: string;
  interval: IntervalV2;
  fromTimestamp: string;
  toTimestamp?: string;
}) {
  return queryOptions({
    queryKey: ['temp'],
    queryFn: () => retrieveCandleDataV2(params),
    gcTime: 0,
  });
}

export async function retrieveCandleDataV2(params: QueryParams) {
  const pathparams = parametersSchema.parse(params);
  const base = 'https://candles.neb.exchange';
  const url = new URL(base);
  url.pathname = [
    'data',
    pathparams.marketId,
    pathparams.interval,
    pathparams.fromTimestamp,
    pathparams.toTimestamp,
  ].join('/');

  const result = await axios.get(url.href);

  return candlesSchema.parse(
    // API returns candles with newest first but charting purposes we want oldest first
    result.data.reverse()
  );
}

export const queryKeys = {
  all: ['candle-data-v2'],
  single: (params: {
    marketId: string;
    interval: string;
    fromTimestamp?: string;
    toTimestamp?: string;
  }) => [...queryKeys.all, 'single', params],
} as const;
