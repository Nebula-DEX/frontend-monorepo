import omitBy from 'lodash/omitBy';
import isUndefined from 'lodash/isUndefined';
import { removePaginationWrapper } from '@vegaprotocol/utils';
import { restApiUrl } from '../paths';
import {
  type v2ListAccountsResponse,
  vegaAccountType,
} from '@vegaprotocol/rest-clients/dist/trading-data';
import axios from 'axios';
import { z } from 'zod';
import { erc20AssetSchema, getAssets } from './assets';
import { Decimal, Time } from '../utils';
import { queryOptions, type QueryClient } from '@tanstack/react-query';

const accountTypeSchema = z.nativeEnum(vegaAccountType);
export type AccountType = z.infer<typeof accountTypeSchema>;

const queryParamSchema = z.object({
  partyId: z.string().optional(),
  type: accountTypeSchema.optional(),
  assetId: z.string().optional(),
});

export type QueryParams = z.input<typeof queryParamSchema>;

export const accountSchema = z.object({
  type: accountTypeSchema,
  asset: erc20AssetSchema,
  balance: z.instanceof(Decimal),
  marketId: z.string(),
  partyId: z.string(),
});
export type Reward = z.infer<typeof accountSchema>;

const accountsSchema = z.array(accountSchema);

export function accountsQueryOptions(client: QueryClient, params: QueryParams) {
  return queryOptions({
    queryKey: queryKeys.list(params),
    queryFn: () => retrieveAccounts(client, params),
    staleTime: Time.MIN,
  });
}

export const retrieveAccounts = async (
  queryClient: QueryClient,
  params?: QueryParams
) => {
  const endpoint = restApiUrl('/api/v2/accounts');
  const queryParams = queryParamSchema.parse(params);
  const validParams = omitBy(
    {
      'filter.partyIds': queryParams.partyId,
      'filter.assetId': queryParams.assetId,
      'filter.accountTypes': queryParams.type,
    },
    isUndefined
  ) as unknown as URLSearchParams;

  const [assets, res] = await Promise.all([
    getAssets(queryClient),
    axios.get<v2ListAccountsResponse>(endpoint, {
      params: new URLSearchParams(validParams),
    }),
  ]);

  const accounts = removePaginationWrapper(res.data.accounts?.edges).map(
    (account) => {
      if (!account.asset) return null;

      const asset = assets.get(account.asset);

      if (!asset) return null;

      return {
        type: account.type,
        asset,
        marketId: account.marketId,
        partyId: account.owner,
        balance: new Decimal(account.balance, asset.decimals),
      };
    }
  );

  return accountsSchema.parse(accounts);
};

export const queryKeys = {
  all: ['accounts'],
  list: (params?: QueryParams) => [...queryKeys.all, params],
} as const;
