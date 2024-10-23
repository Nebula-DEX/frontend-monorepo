import { useQuery, useQueryClient } from '@tanstack/react-query';
import { candleDataQueryOptionsV2 } from '../queries/candle-data-v2';

export function useCandlesV2(
  marketId: string,
  interval: string,
  fromTimestamp: string,
  toTimestamp?: string
) {
  const client = useQueryClient();

  const queryResult = useQuery(
    candleDataQueryOptionsV2(client, {
      marketId,
      interval,
      fromTimestamp,
      toTimestamp,
    })
  );

  return queryResult;
}
