import { useReadContracts } from 'wagmi';
import compact from 'lodash/compact';
import { erc20Abi } from 'viem';
import BigNumber from 'bignumber.js';
import { useEnvironment } from '@vegaprotocol/environment';
import { ASSET_POOL_ADDRESSES } from '@vegaprotocol/web3';
import { useAssets } from '@vegaprotocol/rest';
import { APP_TOKEN_ID } from '../constants';

export const useTotalValueLocked = () => {
  const { VEGA_ENV } = useEnvironment();
  const { data } = useAssets();

  const assets = Array.from(data?.values() || []).filter(
    (a) => a.status === 'STATUS_ENABLED'
  );

  const addresses = ASSET_POOL_ADDRESSES[VEGA_ENV];

  // All markets are currently settled in the app token (NEB)
  const tradableAssets = assets.filter((asset) => asset.id === APP_TOKEN_ID);
  const contracts = tradableAssets.map((asset) => {
    const chainId = Number(asset.chainId);
    const assetPoolAddress = addresses[chainId];

    if (!assetPoolAddress) return;

    const config = {
      abi: erc20Abi,
      address: asset.contractAddress as `0x${string}`,
      functionName: 'balanceOf',
      args: [assetPoolAddress],
      chainId,
    };

    return config;
  });

  const queryResult = useReadContracts({
    contracts: compact(contracts),
    query: {
      enabled: Boolean(contracts.length),
    },
  });

  const result = (queryResult.data || []).map((res, i) => {
    const asset = tradableAssets[i];
    const rawValue = res.result ? res.result.toString() : '0';
    const val = BigNumber(rawValue).div(asset.quantum);
    return val;
  });

  if (!result.length) {
    return {
      ...queryResult,
      data: undefined,
    };
  }

  const tvl = BigNumber.sum.apply(null, result);

  return {
    ...queryResult,
    data: tvl,
  };
};
