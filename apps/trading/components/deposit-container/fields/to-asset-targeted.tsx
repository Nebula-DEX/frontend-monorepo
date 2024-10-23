import { FormGroup } from '@vegaprotocol/ui-toolkit';
import { AssetOption } from '../../asset-option';
import { type AssetERC20 } from '@vegaprotocol/assets';
import { useT } from '../../../lib/use-t';
import { formatNumber } from '@vegaprotocol/utils';
import { DEFAULT_DISPLAY_DPS } from '../../../lib/constants';

export const ToAssetTargeted = (props: {
  toAsset: AssetERC20;
  balance: string;
}) => {
  const t = useT();
  return (
    <FormGroup label={t('Asset')} labelFor="asset">
      <AssetOption
        asset={props.toAsset}
        balance={formatNumber(props.balance, DEFAULT_DISPLAY_DPS)}
      />
    </FormGroup>
  );
};
