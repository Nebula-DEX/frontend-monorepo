import { type Market, useTrades } from '@vegaprotocol/rest';
import { LineChart } from 'pennant';

export const SpotMarketChartContainer = (props: { market: Market }) => {
  const { data: trades } = useTrades(props.market.id);

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
