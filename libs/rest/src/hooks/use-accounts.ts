import {
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { accountsQueryOptions, type QueryParams } from '../queries/accounts';

export function useAccounts(params: QueryParams) {
  const client = useQueryClient();
  const queryResult = useQuery(accountsQueryOptions(client, params));
  return queryResult;
}

export function useSuspenseAccounts(params: QueryParams) {
  const client = useQueryClient();
  const queryResult = useSuspenseQuery(accountsQueryOptions(client, params));
  return queryResult;
}
