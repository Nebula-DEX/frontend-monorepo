import { type SVGAttributes } from 'react';
import { EmblemSvg } from '../emblem-svg';

export const NebSpot = (props: SVGAttributes<SVGElement>) => {
  return (
    <EmblemSvg {...props} viewBox="0 0 176 176">
      <path d="M0 0H176V176H0V0Z" fill="white" />
      <path d="M0 0H176V176H0V0Z" fill="url(#gradient0)" />
      <path d="M0 0H176V176H0V0Z" fill="url(#gradient1)" />
      <path d="M0 0H176V176H0V0Z" fill="url(#gradient2)" />
      <path
        // This is the letter N
        d="M46.08 140V36.32H65.952L111.024 105.44V36.32H130.896V140H111.024L65.952 70.88V140H46.08Z"
        fill="#101621"
      />
      <defs>
        <radialGradient
          id="gradient0"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(35.5 -39.875) rotate(96.9694) scale(220.799 178.819)"
        >
          <stop stopColor="white" stopOpacity="0.2" />
          <stop offset="1" stopColor="#B8FF20" />
        </radialGradient>
        <radialGradient
          id="gradient1"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(172.792 3.29253) rotate(135.014) scale(244.305 200.42)"
        >
          <stop stopColor="#00BFA5" stopOpacity="0.8" />
          <stop offset="1" stopColor="#00BFA5" stopOpacity="0.06" />
        </radialGradient>
        <radialGradient
          id="gradient2"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(59.5 192.5) rotate(-48.4127) scale(154.423 183.14)"
        >
          <stop stopColor="#0075FF" stopOpacity="0.8" />
          <stop offset="0.953677" stopColor="#0075FF" stopOpacity="0" />
        </radialGradient>
      </defs>
    </EmblemSvg>
  );
};
