import { useEVMBridgeConfigs, useEthereumConfig } from '@vegaprotocol/web3';

import { type AssetERC20, useEnabledAssets } from '@vegaprotocol/assets';
import { useT } from '../../lib/use-t';
import { type TxDeposit, type TxSquidDeposit } from '../../stores/evm';
import { OnboardFallbackDepositForm } from './onboard-fallback-deposit-form';
import { ONBOARDING_TARGET_ASSET } from '../../lib/constants';

/**
 * Gets env vars, assets, and configs required for the deposit form
 */
export const OnboardDeposit = (props: {
  onDeposit?: (tx: TxDeposit | TxSquidDeposit) => void;
  minAmount?: string;
}) => {
  const t = useT();
  const { config } = useEthereumConfig();
  const { configs } = useEVMBridgeConfigs();
  const { data: assets, loading: assetsLoading } = useEnabledAssets();

  if (!config) return null;
  if (!configs?.length) return null;

  const allConfigs = [config, ...configs];

  // Make sure asset is an existing enabled asset
  const asset = assets?.find((a) => a.id === ONBOARDING_TARGET_ASSET);

  if (assetsLoading) {
    return (
      <p className="text-sm text-surface-1-fg-muted pt-2">{t('Loading...')}</p>
    );
  }

  return (
    <OnboardFallbackDepositForm
      assets={assets as AssetERC20[]}
      initialAsset={asset as AssetERC20}
      configs={allConfigs}
      onDeposit={props.onDeposit}
      minAmount={props.minAmount}
    />
  );
};
