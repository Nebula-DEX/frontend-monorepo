import { useQuery, useQueryClient } from '@tanstack/react-query';
import { tradesQueryOptions } from '../queries/trades';

export function useTrades(marketId?: string) {
  const client = useQueryClient();
  const queryResult = useQuery(tradesQueryOptions(client, marketId));
  return queryResult;
}
