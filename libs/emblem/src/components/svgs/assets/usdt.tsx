import { type SVGAttributes } from 'react';
import { EmblemSvg } from '../emblem-svg';

export const USDT = (props: SVGAttributes<SVGElement>) => {
  return (
    <EmblemSvg {...props} viewBox="0 0 48 48">
      <title>USDT logo</title>
      <circle cx="24" cy="24" r="20" fill="#26a69a" />
      <rect width="18" height="5" x="15" y="13" fill="#fff" />
      <path
        fill="#fff"
        d="M24,21c-4.457,0-12,0.737-12,3.5S19.543,28,24,28s12-0.737,12-3.5S28.457,21,24,21z M24,26 c-5.523,0-10-0.895-10-2c0-1.105,4.477-2,10-2s10,0.895,10,2C34,25.105,29.523,26,24,26z"
      />
      <path
        fill="#fff"
        d="M24,24c1.095,0,2.093-0.037,3-0.098V13h-6v10.902C21.907,23.963,22.905,24,24,24z"
      />
      <path
        fill="#fff"
        d="M25.723,25.968c-0.111,0.004-0.223,0.007-0.336,0.01C24.932,25.991,24.472,26,24,26 s-0.932-0.009-1.387-0.021c-0.113-0.003-0.225-0.006-0.336-0.01c-0.435-0.015-0.863-0.034-1.277-0.06V36h6V25.908 C26.586,25.934,26.158,25.953,25.723,25.968z"
      />
    </EmblemSvg>
  );
};
