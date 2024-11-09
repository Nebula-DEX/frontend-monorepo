import axios from 'axios';
import { queryOptions, type QueryClient } from '@tanstack/react-query';
import { restApiUrl } from '../paths';
import { getMarket, type Market } from './markets';
import { z } from 'zod';
import type {
  v2ListTradesResponse,
  vegaTrade,
} from '@vegaprotocol/rest-clients/dist/trading-data';
import { Decimal, fromNanoSeconds } from '../utils';

const queryParamsSchema = z.object({
  marketId: z.string().optional(),
});
type QueryParams = z.infer<typeof queryParamsSchema>;

const tradeSchema = z.object({
  id: z.string(),
  price: z.instanceof(Decimal),
  _price: z.string(),
  size: z.instanceof(Decimal),
  _size: z.string(),
  date: z.date(),
  timestamp: z.number(),
});
const tradesSchema = z.array(tradeSchema);

export type Trade = z.infer<typeof tradeSchema>;

export function tradesQueryOptions(
  queryClient: QueryClient,
  marketId?: string
) {
  return queryOptions({
    queryKey: queryKeys.list(),
    queryFn: () => retrieveTrades(queryClient, { marketId }),
  });
}

async function retrieveTrades(queryClient: QueryClient, input: QueryParams) {
  const queryParams = queryParamsSchema.parse(input);

  if (!queryParams.marketId) return;

  const endpoint = restApiUrl('/api/v2/trades');
  const [market, trades] = await Promise.all([
    getMarket(queryClient, queryParams.marketId),
    axios.get<v2ListTradesResponse>(endpoint, {
      params: new URLSearchParams({
        marketIds: queryParams.marketId,
      }),
    }),
  ]);

  const res = tradesSchema.parse(
    trades.data.trades?.edges?.map((e) => e.node && mapTrade(e.node, market))
  );

  return res;
}

function mapTrade(t: vegaTrade, market: Market) {
  const date = t.timestamp ? fromNanoSeconds(t.timestamp) : null;
  return {
    id: t.id,
    _price: t.price,
    price: new Decimal(t.price, market.decimalPlaces),
    _size: t.size,
    size: new Decimal(t.size, market.positionDecimalPlaces),
    date,
    timestamp: date?.getTime(),
  };
}

export const queryKeys = {
  all: ['trades'],
  list: (marketId?: string) => [...queryKeys.all, 'list', { marketId }],
} as const;
