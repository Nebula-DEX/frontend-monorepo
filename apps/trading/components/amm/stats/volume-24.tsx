import type { Market } from '@vegaprotocol/rest';

export const Volume24 = ({ market }: { market: Market }) => {
  throw new Error('candles service does not contain notional value');
  // const { notional, status } = useCandleData(market.id);

  // if (status === 'pending') {
  //   return (
  //     <div className="h-4 py-1">
  //       <LoaderCircleIcon size={16} className="animate-spin" />
  //     </div>
  //   );
  // }

  // return (
  //   <Currency
  //     value={notional}
  //     symbol={market.quoteSymbol}
  //     formatDecimals={market.positionDecimalPlaces}
  //   />
  // );
};

export const CompactVolume24 = ({ market }: { market: Market }) => {
  throw new Error('candles service does not contain notional value');
  // const { notional, status } = useCandleData(market.id);

  // if (status === 'pending') {
  //   return (
  //     <div className="h-4 py-1">
  //       <LoaderCircleIcon size={14} className="animate-spin" />
  //     </div>
  //   );
  // }

  // return (
  //   <CompactNumber
  //     number={notional || BigNumber(0)}
  //     decimals={2}
  //     compactAbove={1000}
  //   />
  // );
};
