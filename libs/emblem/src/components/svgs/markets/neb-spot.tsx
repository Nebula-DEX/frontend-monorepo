import { type SVGAttributes } from 'react';
import { USDT } from '../assets/usdt';
import { NEB } from '../assets/neb';
import { cn } from '@vegaprotocol/ui-toolkit';

export const NebSpot = (props: SVGAttributes<SVGElement>) => {
  return (
    <span className="relative flex">
      <NEB {...props} />
      <USDT {...props} className={cn(props.className, '-ml-2')} />
    </span>
  );
};
