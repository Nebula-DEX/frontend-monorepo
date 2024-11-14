import {
  Button,
  cn,
  Intent,
  VegaIcon,
  VegaIconNames,
} from '@vegaprotocol/ui-toolkit';
import { useT } from '../../lib/use-t';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { GradientText } from '../gradient-text';
import { ColourfulBorder } from '@vegaprotocol/ui-toolkit';
import { Links } from 'apps/trading/lib/links';
import { type RewardCard } from '@vegaprotocol/rest';
import { useState } from 'react';
import { formatNumber } from '@vegaprotocol/utils';

export const SimpleRewardCard = (props: RewardCard) => {
  const t = useT();
  return (
    <div className="grid grid-rows-[subgrid] row-span-3 p-4 rounded-grid relative overflow-hidden bg-gradient-to-b from-surface-1/80 to-surface-1/60">
      <ColourfulBorder />
      <RewardImage img={`/reward-${props.rewardId}.jpg`} />

      {props.tags && props.tags.length > 0 && (
        <div className="flex flex-wrap items-start gap-2">
          {props.tags.map((t, i) => (
            <span
              key={i}
              className={cn('text-sm py-1 px-2 rounded-full text-white', {
                'bg-highlight': t.variant === 'primary',
                'bg-highlight-secondary': t.variant === 'secondary',
                'bg-highlight-tertiary': t.variant === 'tertiary',
              })}
            >
              {t.text}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h3 className="text-3xl leading-none">{props.title}</h3>
        <h4 className="text-surface-1-fg-muted text-4xl">
          {formatNumber(props.prizePool, 2)} <span className="calt">NEB</span>
        </h4>

        <div className="flex flex-col gap-4 text-surface-1-fg-muted">
          <ReactMarkdown
            components={{
              ul: ({ children }) => {
                return (
                  <ul className="flex flex-col gap-0 list-disc pl-4 marker:text-highlight marker:mr-0">
                    {children}
                  </ul>
                );
              },
              li: ({ children }) => {
                return (
                  <li className="m-0 pl-2">
                    <span className="relative -left-2">{children}</span>
                  </li>
                );
              },
              strong: ({ children }) => {
                return (
                  <GradientText>
                    <strong>{children}</strong>
                  </GradientText>
                );
              },
            }}
          >
            {props.description}
          </ReactMarkdown>
        </div>
      </div>

      <Link to={Links.COMPETITIONS_GAME(props.rewardId)}>
        <Button className="w-full" intent={Intent.Primary}>
          {t('View more')}
        </Button>
      </Link>
    </div>
  );
};

const RewardImage = (props: { img: string }) => {
  const [showFallback, setShowFallback] = useState(false);
  return (
    <div className="aspect-[400/280] bg-surface-1 overflow-hidden rounded-grid -mx-4 -mt-4">
      {!showFallback ? (
        <>
          {/* eslint-disable-next-line */}
          <img
            src={props.img}
            // src="/reward-d95a8b0dcd0acdd6c0c0df61bb24283626abaeb2f66821173e13affbb076d2b76.jpg"
            className="object-cover object-bottom"
            onError={(e) => {
              setShowFallback(true);
            }}
          />
        </>
      ) : (
        <div className="flex justify-center items-center h-full w-full">
          <VegaIcon name={VegaIconNames.DICE} size={50} />
        </div>
      )}
    </div>
  );
};
