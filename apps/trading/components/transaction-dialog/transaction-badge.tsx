import { VegaIcon, VegaIconNames } from '@vegaprotocol/ui-toolkit';
import classNames from 'classnames';

const BADGE_SIZING = classNames('w-8 h-8 rounded-full relative flex-shrink-0');
const BADGE_BACKGROUND = 'bg-vega-clight-700 dark:bg-vega-cdark-700';
const INNER_ICON_SIZING = classNames(
  'w-6 h-6', // 24
  'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
);

export const PendingBadge = () => {
  return (
    <div className={classNames(BADGE_SIZING, BADGE_BACKGROUND)}>
      <div className={INNER_ICON_SIZING}>
        <VegaIcon
          name={VegaIconNames.LOADING}
          size={24}
          className={classNames(
            'animate-spin',
            'stroke-vega-clight-200 dark:stroke-vega-cdark-200'
          )}
        />
      </div>
    </div>
  );
};

export const FailedBadge = () => {
  return (
    <div className={classNames(BADGE_SIZING, BADGE_BACKGROUND)}>
      <VegaIcon
        name={VegaIconNames.EXCLAMATION_SIGN}
        size={24}
        className={classNames(
          INNER_ICON_SIZING,
          'fill-vega-clight-50 dark:fill-vega-cdark-50'
        )}
      />
    </div>
  );
};

export const DefaultBadge = () => {
  return (
    <div className={classNames(BADGE_SIZING, BADGE_BACKGROUND)}>
      <VegaIcon
        name={VegaIconNames.SLIM_TICK}
        size={24}
        className={classNames(
          INNER_ICON_SIZING,
          'stroke-vega-clight-200 dark:stroke-vega-cdark-200'
        )}
      />
    </div>
  );
};

export const ConfirmedBadge = () => {
  return (
    <div
      className={classNames(
        BADGE_SIZING,
        'bg-vega-clight-50 dark:bg-vega-cdark-50'
      )}
    >
      <VegaIcon
        name={VegaIconNames.SLIM_TICK}
        size={24}
        className={classNames(
          INNER_ICON_SIZING,
          'stroke-vega-clight-900 dark:stroke-vega-cdark-900'
        )}
      />
    </div>
  );
};
