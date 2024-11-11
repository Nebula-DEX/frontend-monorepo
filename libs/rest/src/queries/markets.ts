import { removePaginationWrapper } from '@vegaprotocol/utils';
import { restApiUrl } from '../paths';
import {
  type v2GetMarketResponse,
  type v2ListMarketsResponse,
  type vegaMarket,
  vegaMarketState,
} from '@vegaprotocol/rest-clients/dist/trading-data';
import axios from 'axios';
import get from 'lodash/get';
import keyBy from 'lodash/keyBy';
import { z } from 'zod';
import { type Assets, erc20AssetSchema, getAssets } from './assets';
import { queryOptions, type QueryClient } from '@tanstack/react-query';
import {
  getBaseUnit,
  getQuoteUnit,
  getSessionFromTags,
  getTimezoneFromTags,
} from '@vegaprotocol/markets';

const marketState = z.nativeEnum(vegaMarketState);
export type MarketState = z.infer<typeof marketState>;

const baseSchema = z.object({
  id: z.string(),

  /** Short code of the market */
  code: z.string(),

  /** Long name for the market */
  name: z.string(),

  /** Number of decimal places used for order price */
  decimalPlaces: z.number(),

  /** Number of decimal places used for order size */
  positionDecimalPlaces: z.number(),

  /** Base symbol, eg XAU in XAU/USD */
  baseSymbol: z.string(),

  /** Quote symbol, eg USD in XAU/USD */
  quoteSymbol: z.string(),

  /** Maker fee factor, paid to the passive side of the trade  */
  makerFee: z.number(),

  /** Liquidity fee factor, paid to liquidity providers */
  liquidityFee: z.number(),

  /** Infra fee factor, paid to validators */
  infraFee: z.number(),

  /** Take from taker and used to purchase tokens through automated purchase programs */
  buyBackFee: z.number(),

  /** Taken from taker and sent to network treasury */
  treasuryFee: z.number(),

  /** Asset the market settles in */
  settlementAsset: erc20AssetSchema,

  /** Live data which can get updated frequently */
  data: z.object({
    state: marketState,
  }),

  /**
   * Metadata which can be anything but also contains reserved
   * patterns for required information:
   *
   * base:XAU
   * quote:USD
   * timezone:Europe/Berlin https://www.tradingview.com/charting-library-docs/latest/ui_elements/timezones
   * session:24x7 https://www.tradingview.com/charting-library-docs/latest/connecting_data/Trading-Sessions
   */
  metatags: z.array(z.string()),

  /** Timezone for the market, set in metatags */
  timezone: z.string().optional(),

  /** Trading session (eg. 24x7 or Mon-Fri 0900-1700) */
  session: z.string().optional(),
});

const futureSchema = baseSchema.extend({
  type: z.literal('future'),
});

const perpSchema = baseSchema.extend({
  type: z.literal('perp'),
});

const spotSchema = baseSchema.extend({
  type: z.literal('spot'),
  baseAsset: erc20AssetSchema,
  quoteAsset: erc20AssetSchema,
});

const marketSchema = z.discriminatedUnion('type', [
  futureSchema,
  perpSchema,
  spotSchema,
]);

const marketsSchema = z.map(z.string(), marketSchema);

export type Market = z.infer<typeof marketSchema>;
export type Markets = z.infer<typeof marketsSchema>;

export function marketsOptions(queryClient: QueryClient) {
  return queryOptions({
    queryKey: queryKeys.all,
    queryFn: () => retrieveMarkets(queryClient),
    staleTime: Number.POSITIVE_INFINITY,
  });
}

/**
 * Retrieves all markets from `/markets` endpoint.
 */
export const retrieveMarkets = async (queryClient: QueryClient) => {
  const endpoint = restApiUrl('/api/v2/markets');
  const [assets, res] = await Promise.all([
    getAssets(queryClient),
    axios.get<v2ListMarketsResponse>(endpoint),
  ]);
  const markets = removePaginationWrapper(res.data.markets?.edges).map((m) =>
    mapMarket(m, assets)
  );
  const map = new Map(Object.entries(keyBy(markets, 'id')));
  return marketsSchema.parse(map);
};

const pathParamsSchema = z.object({
  marketId: z.string(),
});

export function marketOptions(queryClient: QueryClient, marketId?: string) {
  return queryOptions({
    queryKey: queryKeys.single(marketId),
    queryFn: () => retrieveMarket(queryClient, { marketId }),
    staleTime: Number.POSITIVE_INFINITY,
    // Get data from the cache if list view has already been fetched
    // @ts-ignore queryOptions does not like this function even though its fine when used
    // in a normal query
    initialData: () => {
      if (!marketId) return;
      const markets = getMarketsFromCache(queryClient);
      return markets?.get(marketId);
    },
  });
}

export const retrieveMarket = async (
  queryClient: QueryClient,
  pathParams: { marketId?: string }
) => {
  const params = pathParamsSchema.parse(pathParams);
  const endpoint = restApiUrl('/api/v2/market/{marketId}', params);
  const [assets, res] = await Promise.all([
    getAssets(queryClient),
    axios.get<v2GetMarketResponse>(endpoint),
  ]);
  if (!res.data.market) throw new Error('market not found');
  const market = mapMarket(res.data.market, assets);
  return marketSchema.parse(market);
};

function mapMarket(m: vegaMarket, assets: Assets) {
  let type;
  let settlementAsset;
  let baseAsset;
  let quoteAsset;

  const tags = get(m, 'tradableInstrument.instrument.metadata.tags', []);

  let baseSymbol = getBaseUnit(tags);
  let quoteSymbol = getQuoteUnit(tags);
  const timezone = getTimezoneFromTags(tags);
  const session = getSessionFromTags(tags);

  if (m.tradableInstrument?.instrument?.future) {
    type = 'future';
    settlementAsset = assets.get(
      get(m, 'tradableInstrument.instrument.future.settlementAsset', '')
    );
  } else if (m.tradableInstrument?.instrument?.perpetual) {
    type = 'perp';
    settlementAsset = assets.get(
      get(m, 'tradableInstrument.instrument.perpetual.settlementAsset', '')
    );
  } else if (m.tradableInstrument?.instrument?.spot) {
    type = 'spot';
    baseAsset = assets.get(
      get(m, 'tradableInstrument.instrument.spot.baseAsset', '')
    );
    baseSymbol = baseAsset?.symbol || baseSymbol;
    quoteAsset = assets.get(
      get(m, 'tradableInstrument.instrument.spot.quoteAsset', '')
    );

    // In spot markets, though there is technically no settlement asset. For other markets
    // fees are paid in the settlementAsset so to keep things simple its useful for all markets
    // to have an assigned settlementAsset which we know can be safely displayed to the user as
    // the asset fees are paid in.
    settlementAsset = quoteAsset;
    quoteSymbol = quoteAsset?.symbol || quoteSymbol;
  }

  return {
    id: m.id,
    type,
    code: m.tradableInstrument?.instrument?.code,
    name: m.tradableInstrument?.instrument?.name,
    decimalPlaces: Number(m.decimalPlaces),
    positionDecimalPlaces: Number(m.positionDecimalPlaces),
    settlementAsset,
    baseAsset,
    baseSymbol,
    quoteAsset,
    quoteSymbol,
    liquidityFee: Number(m.fees?.factors?.liquidityFee),
    makerFee: Number(m.fees?.factors?.makerFee),
    infraFee: Number(m.fees?.factors?.infrastructureFee),
    // @ts-ignore TODO: upgrade rest clients version
    buyBackFee: Number(m.fees?.factors?.buyBackFee),
    // @ts-ignore TODO: upgrade rest clients version
    treasuryFee: Number(m.fees?.factors?.treasuryFee),
    data: {
      state: m.state,
    },
    metatags: m.tradableInstrument?.instrument?.metadata?.tags || [],
    timezone,
    session,
  };
}

export const OPEN_MARKETS_STATES = [
  vegaMarketState.STATE_ACTIVE,
  vegaMarketState.STATE_SUSPENDED,
  vegaMarketState.STATE_SUSPENDED_VIA_GOVERNANCE,
  vegaMarketState.STATE_PENDING,
];

export const CLOSED_MARKETS_STATES = [
  vegaMarketState.STATE_SETTLED,
  vegaMarketState.STATE_TRADING_TERMINATED,
  vegaMarketState.STATE_CLOSED,
  vegaMarketState.STATE_CANCELLED,
];

export const PROPOSED_MARKETS_STATES = [vegaMarketState.STATE_PROPOSED];

export const isActiveMarket = (market: Market) => {
  return OPEN_MARKETS_STATES.includes(market.data.state);
};

/**
 * Fetch and cache markets use this if needing market data
 * from another query
 */
export async function getMarkets(queryClient: QueryClient) {
  const markets = await queryClient.fetchQuery(marketsOptions(queryClient));

  if (!markets) {
    throw new Error('no markets');
  }

  return markets;
}

/** Fetch and cache single market */
export async function getMarket(queryClient: QueryClient, marketId: string) {
  const market = await queryClient.fetchQuery(
    marketOptions(queryClient, marketId)
  );

  if (!market) {
    throw new Error(`market ${marketId} not found`);
  }

  return market;
}

export function getMarketsFromCache(queryClient: QueryClient) {
  return queryClient.getQueryData<Markets>(queryKeys.all);
}

export const queryKeys = {
  all: ['markets'],
  list: () => [...queryKeys.all, 'list'],
  single: (marketId?: string) => [...queryKeys.all, 'single', { marketId }],
} as const;
