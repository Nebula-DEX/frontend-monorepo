import { Interval } from '@vegaprotocol/types';

export const ALLOWED_TRADINGVIEW_HOSTNAMES = [
  'localhost',
  'trade.neb.exchange',
];

export const CHARTING_LIBRARY_FILE = 'charting_library.standalone.js';

export const TRADINGVIEW_INTERVAL_MAP = {
  [Interval.INTERVAL_BLOCK]: undefined, // TODO: handle block tick
  [Interval.INTERVAL_I1M]: '1',
  [Interval.INTERVAL_I5M]: '5',
  [Interval.INTERVAL_I15M]: '15',
  [Interval.INTERVAL_I30M]: '30',
  [Interval.INTERVAL_I1H]: '60',
  [Interval.INTERVAL_I4H]: '240',
  [Interval.INTERVAL_I6H]: '360',
  [Interval.INTERVAL_I8H]: '480',
  [Interval.INTERVAL_I12H]: '720',
  [Interval.INTERVAL_I1D]: '1D',
  [Interval.INTERVAL_I7D]: '1W',
} as const;

export type ResolutionRecord = typeof TRADINGVIEW_INTERVAL_MAP;
export type ResolutionString = ResolutionRecord[keyof ResolutionRecord];

/**
 * Custom trading sessions for current markets. There is a fallback to Etc/UTC
 * with a 24x7 session time if nothing is provided, which is suitable for all
 * crypto markets
 *
 * TODO: This should be removed when the `session:` and `timezone:` metadata tags
 * are added to the markets
 */
export const TRADINGVIEW_SESSION_CONFIG: Record<
  string,
  | {
      // See tradingview timezone docs here:
      // https://www.tradingview.com/charting-library-docs/latest/ui_elements/timezones/
      timezone?: string;
      // See tradingview session docs here:
      // https://www.tradingview.com/charting-library-docs/latest/connecting_data/Trading-Sessions/#intraday-sessions
      session?: string;
    }
  | undefined
> = {
  // USD/JPY
  '82b7c459a515e8404ca92fcfa3bef312d331abb2af40ae056de13c810a3c4c08': {
    timezone: 'Etc/UTC',
    session: '2200-2200',
  },
  // EUR/USD
  '778e7f4cd2414faf44d1e8a5391bbec87616aef5798bb2093f2db56704543c5f': {
    timezone: 'Etc/UTC',
    session: '2200-2200',
  },
  // USD/CNH
  c256ac0206dd6c4b2c443acd4590b156fc4f0f6963806780a374f1202cc68e85: {
    timezone: 'Etc/UTC',
    session: '2200-2200',
  },
  // AUD/USD
  d81a8bacb5e1a6b4bc8773d8af4e4ad29a5109e0ed4648ffe26c136c84cad3fc: {
    timezone: 'Etc/UTC',
    session: '2200-2200',
  },
  // GBP/USD
  '74711691b900bc8fea802ebb99d06c4ee326bda75058ac1c9637e9bc8233872d': {
    timezone: 'Etc/UTC',
    session: '2200-2200',
  },
  // FTSE100
  '03d186c550ae6f13c1b0732320f1923c60767e37df5fa4099565a3db49691894': {
    timezone: 'Etc/UTC',
    session: '0800-1630',
  },
  // CAC40
  '2b851d11814da7e409ce6b0da8a62f0cf0e2fa4fb4a6344289aebbad1a79cb8d': {
    timezone: 'Etc/UTC',
    session: '0800-1630',
  },
  // DAX40
  a98b3eeea8bdc5afd0677869df89d9630a277a02f7336bbc4c074ce5f743b581: {
    timezone: 'Etc/UTC',
    session: '0800-1630',
  },
  // NIKKEI
  ee75df55c84dd341ce285fd65b7dc8f0857db977f6fb2875bce1beb405735a48: {
    timezone: 'Etc/UTC',
    session: '0000-0300,0430-0600',
  },
  // WTI/USD
  '19fa4e7dcaf956efe33e5345bfd7a8ad3b4ea4634cdd12b3158321350f949009': {
    timezone: 'Etc/UTC',
    session: '2300F-2200',
  },
  // LC1/USD
  f54044c1c87ff31509ea495d8bc55783864bbcd2ced04db8cd2ce64ef43d1f49: {
    timezone: 'Etc/UTC',
    session: '2300F-2130', // Sunday - Fri all day with a break between 2130 and 2300
  },
  // NG/USD
  b0e849d267dc8b1e543a2109885b9f9dba600a733a3b30595e93e772862b6cb1: {
    timezone: 'Etc/UTC',
    session: '2300F-2200',
  },
  // XAU/USD
  b47b9a2c8a9f69c01a54093ed81083f712ec88e98a0cc1358a621be3e8632116: {
    timezone: 'Etc/UTC',
    session: '2300F-2200',
  },
  // JO1/USD
  '95a8b0dcd0acdd6c0c0df61bb24283626abaeb2f66821173e13affbb076d2b76': {
    timezone: 'Etc/UTC',
    session: '1300-1800',
  },
  // W_1/USD
  '90cbdea8d4986173b2fbcbbec1fe7565e7fc1e3aa60b3ccb0e9d1a5a9eb18f19': {
    timezone: 'Etc/UTC',
    session: '0000-1245,1330-1820',
  },
};
