import { Emblem } from '@vegaprotocol/emblem';
import type { MarketMaybeWithCandles } from '@vegaprotocol/markets';
import { Link } from 'react-router-dom';
import { priceValueFormatter } from './use-column-defs';
import { Links } from '../../lib/links';
import { cn, Sparkline, Tooltip } from '@vegaprotocol/ui-toolkit';
import { useCandleData } from '@vegaprotocol/rest';
import { formatNumber } from '@vegaprotocol/utils';
import { signedNumberCssClass } from '@vegaprotocol/datagrid';

export const TopMarketList = ({
  markets,
}: {
  markets?: MarketMaybeWithCandles[];
}) => {
  return (
    <ul className="flex flex-col justify-between gap-3">
      {markets?.map((market) => {
        return <TopMarket key={market.id} market={market} />;
      })}
    </ul>
  );
};

const TopMarket = (props: { market: MarketMaybeWithCandles }) => {
  const { sparkline, pctChange } = useCandleData(props.market.id);
  return (
    <li className="grid auto-rows-min grid-cols-3 gap-3">
      <span className="overflow-hidden">
        <Tooltip description={props.market.tradableInstrument.instrument.name}>
          <Link to={Links.MARKET(props.market.id)}>
            <span className="flex items-center gap-2">
              <Emblem market={props.market.id} size={26} />
              <span className="overflow-hidden text-ellipsis">
                {props.market.tradableInstrument.instrument.code}
              </span>
            </span>
          </Link>
        </Tooltip>
      </span>
      <span className="text-right font-mono">
        {priceValueFormatter(props.market, 2)}
      </span>
      <span className="flex justify-end gap-2 text-xs">
        {pctChange && (
          <span
            className={cn('font-mono text-sm', signedNumberCssClass(pctChange))}
          >
            {formatNumber(pctChange, 2)}%
          </span>
        )}
        {sparkline && <Sparkline data={sparkline} />}
      </span>
    </li>
  );
};
