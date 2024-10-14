import { type SVGAttributes } from 'react';
import { EmblemSvg } from '../emblem-svg';

export const Cattle = (props: SVGAttributes<SVGElement>) => {
  return (
    <EmblemSvg {...props} viewBox="0 0 150 150">
      <style>{`.cls-1{fill:#fceebb;}.cls-1,.cls-2,.cls-3,.cls-4,.cls-5{stroke:#000000;stroke-miterlimit:10;}.cls-1,.cls-5{stroke-width:2px;}.cls-2{fill:#7d7d81;stroke-width:3px;}.cls-3{fill:#dbdbdb;}.cls-3,.cls-4{stroke-width:4px;}.cls-4{fill:#e2bda8;}.cls-5{fill:#ffffff;}`}</style>
      <path
        class="cls-1"
        d="M47.68,45.28c-8.05-11-8.76-29.65-.1-37.83a.46.46,0,0,1,.75.39c-.64,10.41,8,19.66,14.08,24.8a5.53,5.53,0,0,1-.25,8.65l-6.76,5.07A5.51,5.51,0,0,1,47.68,45.28Z"
      />
      <path
        class="cls-1"
        d="M102.32,45.28c8.05-11,8.76-29.65.1-37.83a.46.46,0,0,0-.75.39c.64,10.41-8,19.66-14.08,24.8a5.53,5.53,0,0,0,.25,8.65l6.76,5.07A5.51,5.51,0,0,0,102.32,45.28Z"
      />
      <path
        class="cls-2"
        d="M102.39,50.21a6.47,6.47,0,0,0,2.5-2c13.33-16.51,35.17-11.69,36.4-7.66s-16,21-32.45,16.59C96.23,53.81,99.94,51.24,102.39,50.21Z"
      />
      <path
        class="cls-2"
        d="M47.61,50.21a6.47,6.47,0,0,1-2.5-2C31.79,31.75,9.94,36.57,8.71,40.6s16,21,32.45,16.59C53.77,53.81,50.06,51.24,47.61,50.21Z"
      />
      <path
        class="cls-3"
        d="M116.48,68c0,28.66-18.57,62.09-41.48,62.09S33.52,96.63,33.52,68,52.09,26.28,75,26.28,116.48,39.31,116.48,68Z"
      />
      <ellipse class="cls-4" cx="75" cy="115.81" rx="30.3" ry="25.85" />
      <circle cx="56.3" cy="59.35" r="5.01" />
      <circle cx="93.7" cy="59.35" r="5.01" />
      <circle class="cls-5" cx="62.82" cy="117.37" r="5.52" />
      <circle class="cls-5" cx="87.18" cy="117.37" r="5.52" />
    </EmblemSvg>
  );
};
