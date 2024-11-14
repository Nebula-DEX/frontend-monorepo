import { useQuery } from '@tanstack/react-query';
import {
  candleDataQueryOptionsV2,
  type IntervalV2,
} from '../queries/candle-data-v2';

export function useCandlesV2(
  marketId: string,
  interval: IntervalV2,
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
