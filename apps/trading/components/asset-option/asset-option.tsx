import { type ReactNode } from 'react';
import { type AssetERC20 } from '@vegaprotocol/assets';
import { Emblem } from '@vegaprotocol/emblem';
import { truncateMiddle } from '@vegaprotocol/ui-toolkit';
import { addDecimalsFormatNumber, isAssetNative } from '@vegaprotocol/utils';
import { getErc20Abi } from '../../lib/utils/get-erc20-abi';
import { useAccount, useBalance, useReadContracts } from 'wagmi';
import { DEFAULT_DISPLAY_DPS } from '../../lib/constants';

export const AssetOption = ({
  asset,
  balance,
}: {
  asset: AssetERC20;
  balance?: string | ReactNode;
}) => {
  return (
    <div className="w-full flex items-center gap-2 h-10">
      <Emblem asset={asset.id} chain={asset.source.chainId} />
      <div className="text-sm text-left leading-4">
        <div>
          {asset.name} | {asset.symbol}
        </div>
        <div className="text-surface-0-fg-muted text-xs">
          {asset.source.__typename === 'ERC20'
            ? truncateMiddle(asset.source.contractAddress)
            : asset.source.__typename}
        </div>
      </div>
      {balance && <div className="ml-auto text-sm">{balance}</div>}
    </div>
  );
};

type AssetBalanceProps = { chainId: string; address: string };

/** Show the balance of an asset on an evm chain */
export const AssetBalance = (props: AssetBalanceProps) => {
  if (isAssetNative(props.address)) {
    return <NativeTokenBalance {...props} />;
  }

  return <TokenBalance {...props} />;
};

const NativeTokenBalance = (props: AssetBalanceProps) => {
  const { address } = useAccount();

  const { data } = useBalance({
    address,
    chainId: Number(props.chainId),
  });

  if (!data) return null;

  return (
    <>
      {addDecimalsFormatNumber(
        data.value.toString(),
        data.decimals,
        DEFAULT_DISPLAY_DPS
      )}
    </>
  );
};

const TokenBalance = (props: AssetBalanceProps) => {
  const { address } = useAccount();

  const tokenAddress = props.address as `0x${string}`;

  const { data } = useReadContracts({
    contracts: [
      {
        address: tokenAddress,
        abi: getErc20Abi({ address: tokenAddress }),
        functionName: 'balanceOf',
        args: address && [address],
        chainId: Number(props.chainId),
      },
      {
        address: tokenAddress,
        abi: getErc20Abi({ address: tokenAddress }),
        functionName: 'decimals',
        chainId: Number(props.chainId),
      },
    ],
  });

  if (!data) return null;

  const value = data[0].result;
  const decimals = data[1].result;

  if (!value || !decimals) return null;

  return (
    <>
      {addDecimalsFormatNumber(value.toString(), decimals, DEFAULT_DISPLAY_DPS)}
    </>
  );
};
