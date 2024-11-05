import { useEVMBridgeConfigs, useEthereumConfig } from '@vegaprotocol/web3';

import { DepositForm } from './deposit-form';
import { type AssetERC20, useEnabledAssets } from '@vegaprotocol/assets';
import { useSquid } from './use-squid';
import { FallbackDepositForm } from './fallback-deposit-form';
import { useT } from '../../../lib/use-t';
import { Networks, useEnvironment } from '@vegaprotocol/environment';
import { useOrderbook } from '@vegaprotocol/market-depth';
import { useMarket } from '@vegaprotocol/rest';

export const SWAP_MARKET_ID =
  '13af1d3e06d639f2973ec108d0d4ce0aa8fe77a4f5c29891aec3abe329fb1fa0';
export const MAX_BUY_USDT = 100_000;

/**
 * Gets env vars, assets, and configs required for the deposit form
 */
export const DepositContainer = (props: {
  address: string;
  pubKey: string;
  initialAssetId?: string;
  minAmount?: string;
}) => {
  const t = useT();
  const { VEGA_ENV } = useEnvironment();
  const { config } = useEthereumConfig();
  const { configs } = useEVMBridgeConfigs();
  const { data: assets, loading: assetsLoading } = useEnabledAssets();
  const { data: squid, error: squidError } = useSquid();
  const { data: market, isLoading: marketLoading } = useMarket(SWAP_MARKET_ID);
  const { data: book, loading: bookLoading } = useOrderbook(SWAP_MARKET_ID);
  const lowestAskLvl = book?.depth?.sell ? book.depth.sell[0] : undefined;

  if (!config) return null;
  if (!configs?.length) return null;

  const allConfigs = [config, ...configs];

  // Make sure asset is an existing enabled asset
  const asset = assets?.find((a) => a.id === props.initialAssetId);

  const loading = assetsLoading || bookLoading || marketLoading || !squid;
  if (loading && !squidError) {
    return (
      <p className="text-sm text-surface-1-fg-muted pt-2">{t('Loading...')}</p>
    );
  }

  if (!lowestAskLvl) {
    return <p>{t('NEB is not currently available to buy')}</p>;
  }

  // If we have squid initialized show the form which allows swaps
  if (
    squid &&
    !squidError &&
    VEGA_ENV === Networks.MAINNET &&
    squid.initialized
  ) {
    return (
      <DepositForm
        address={props.address}
        pubKey={props.pubKey}
        squid={squid}
        assets={assets as AssetERC20[]}
        initialAsset={asset as AssetERC20}
        configs={allConfigs}
        minAmount={props.minAmount}
        asks={book?.depth.sell}
        market={market}
      />
    );
  }

  // If for some reason squid cannot be initialized (api down for example)
  // use a form which doesn't require squid, but also doesn't allow swaps,
  // which is better than noting
  return (
    <FallbackDepositForm
      assets={assets as AssetERC20[]}
      initialAsset={asset as AssetERC20}
      configs={allConfigs}
      minAmount={props.minAmount}
      asks={book?.depth.sell}
      market={market}
    />
  );
};
