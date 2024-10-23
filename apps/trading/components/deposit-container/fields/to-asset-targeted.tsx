import { FormGroup } from '@vegaprotocol/ui-toolkit';
import { AssetOption } from '../../asset-option';
import { type AssetERC20 } from '@vegaprotocol/assets';
import { useT } from '../../../lib/use-t';

export const ToAssetTargeted = (props: {
  toAsset: AssetERC20;
  balance: string;
}) => {
  const t = useT();
  return (
    <FormGroup label={t('Asset')} labelFor="asset">
      <AssetOption asset={props.toAsset} balance={props.balance} />
    </FormGroup>
  );
};
