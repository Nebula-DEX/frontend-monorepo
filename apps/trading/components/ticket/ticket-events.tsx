import {
  useDerivativeLimitTicketEvents,
  useDerivativeMarketTicketEvents,
  useSpotLimitTicketEvents,
  useSpotMarketTicketEvents,
} from './use-ticket-events';

export const DerivativeLimitTicketEventUpdater = () => {
  useDerivativeLimitTicketEvents();
  return null;
};

export const DerivativeMarketTicketEventUpdater = () => {
  useDerivativeMarketTicketEvents();
  return null;
};

export const SpotLimitTicketEventUpdater = () => {
  useSpotLimitTicketEvents();
  return null;
};

export const SpotMarketTicketEventUpdater = () => {
  useSpotMarketTicketEvents();
  return null;
};
