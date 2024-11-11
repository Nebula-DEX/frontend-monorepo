import { LineChart } from 'pennant';
import { type Market, useTrades } from '@vegaprotocol/rest';
import { Loader, Splash } from '@vegaprotocol/ui-toolkit';
import { useT } from '../../lib/use-t';

export const SpotMarketChartContainer = (props: { market: Market }) => {
  const t = useT();
  const { data: trades, isError, isLoading } = useTrades(props.market.id);

  if (isError) {
    return (
      <Splash>
        <p className="text-xs">{t('Chart initialization failed')}</p>
      </Splash>
    );
  }

  if (isLoading) {
    return (
      <Splash>
        <Loader />
      </Splash>
    );
  }

  const data: {
    cols: [string, string];
    rows: Array<[Date, number]>;
  } = {
    cols: ['Date', 'Price'],
    rows: trades?.length
      ? (trades
          .map((t) => [t.date, t.price.value.toNumber()])
          .reverse() as Array<[Date, number]>)
      : [],
  };

  return (
    <LineChart
      data={data}
      theme="dark"
      priceFormat={(val) => {
        return val.toString();
      }}
    />
  );
};
