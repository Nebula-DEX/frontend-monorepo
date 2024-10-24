import { useQuery } from '@tanstack/react-query';
import { candleDataQueryOptionsV2 } from '../queries/candle-data-v2';

export function useCandlesV2(
  marketId: string,
  interval: string,
  fromTimestamp: string,
  toTimestamp?: string
) {
  const queryResult = useQuery(
    candleDataQueryOptionsV2({
      marketId,
      interval,
      fromTimestamp,
      toTimestamp,
    })
  );

  return queryResult;
}
