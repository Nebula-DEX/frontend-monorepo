import { useEffect } from 'react';

import { useForm } from './use-form';

import { ticketEventEmitter } from '../../lib/ticket-event-emitter';
import { useTicketContext } from './ticket-context';

import * as utils from './utils';
import * as derivativeUtils from './derivative/utils';
import * as spotUtils from './spot/utils';
import BigNumber from 'bignumber.js';
import { useActiveOrders } from '@vegaprotocol/orders';
import { useOpenVolume } from '@vegaprotocol/positions';
import { useVegaWallet } from '@vegaprotocol/wallet-react';
import { useMarkPrice } from '@vegaprotocol/markets';
import { toBigNum } from '@vegaprotocol/utils';

/**
 * Listen for events from the ticketEventEmitter and update the
 * corresponding field in the form
 */
export const useDerivativeLimitTicketEvents = () => {
  const { pubKey } = useVegaWallet();
  const form = useForm('limit');
  const ticket = useTicketContext('default');

  const { data: orders } = useActiveOrders(pubKey, ticket.market.id);
  const { openVolume } = useOpenVolume(pubKey, ticket.market.id) || {
    openVolume: '0',
    averageEntryPrice: '0',
  };

  useEffect(() => {
    ticketEventEmitter.listen((fields) => {
      const formValues = form.getValues();

      for (const f in fields) {
        const field = f as keyof typeof fields;
        const value = fields[field];

        if (!value) return;

        let price: BigNumber;
        let size: BigNumber;

        if (field === 'size') {
          price = BigNumber(formValues.price || 0);
          size = BigNumber(value || 0);
        } else if (field === 'price') {
          price = BigNumber(value || 0);
          size = BigNumber(formValues.size || 0);
        } else {
          return;
        }

        const notional = utils.toNotional(size, price || BigNumber(0));
        const pct = derivativeUtils.calcPctBySize({
          size,
          openVolume,
          price,
          ticket,
          fields: formValues,
          orders: orders || [],
        });
        form.setValue(field, Number(value));
        form.setValue('notional', notional.toNumber());
        form.setValue('sizePct', pct.toNumber());
      }
    });

    return () => {
      ticketEventEmitter.unlisten();
    };
  }, [form, ticket.type, openVolume, orders, ticket]);
};

/**
 * Listen for events from the ticketEventEmitter and update the
 * corresponding field in the form
 */
export const useDerivativeMarketTicketEvents = () => {
  const { pubKey } = useVegaWallet();
  const form = useForm('market');
  const ticket = useTicketContext('default');

  const { data: orders } = useActiveOrders(pubKey, ticket.market.id);
  const { openVolume } = useOpenVolume(pubKey, ticket.market.id) || {
    openVolume: '0',
    averageEntryPrice: '0',
  };
  const { data: _markPrice } = useMarkPrice(ticket.market.id);
  const markPrice = _markPrice
    ? toBigNum(_markPrice, ticket.market.decimalPlaces)
    : undefined;

  useEffect(() => {
    ticketEventEmitter.listen((fields) => {
      const formValues = form.getValues();

      for (const f in fields) {
        const field = f as keyof typeof fields;
        const value = fields[field];

        if (!value) return;

        let price: BigNumber;
        let size: BigNumber;

        if (field === 'size') {
          price = markPrice || BigNumber(0);
          size = BigNumber(value);
        } else if (field === 'price') {
          // no op, price cannot be set for market order
          return;
        } else {
          return;
        }

        const notional = utils.toNotional(size, price || BigNumber(0));
        const pct = derivativeUtils.calcPctBySize({
          size,
          openVolume,
          price,
          ticket,
          fields: formValues,
          orders: orders || [],
        });
        form.setValue(field, Number(value));
        form.setValue('notional', notional.toNumber());
        form.setValue('sizePct', pct.toNumber());
      }
    });

    return () => {
      ticketEventEmitter.unlisten();
    };
  }, [form, ticket.type, openVolume, orders, ticket, markPrice]);
};

export const useSpotLimitTicketEvents = () => {
  const form = useForm('limit');
  const ticket = useTicketContext('spot');

  useEffect(() => {
    ticketEventEmitter.listen((fields) => {
      const formValues = form.getValues();

      for (const f in fields) {
        const field = f as keyof typeof fields;
        const value = fields[field];

        if (!value) return;

        let price: BigNumber;
        let size: BigNumber;

        if (field === 'size') {
          price = BigNumber(formValues.price);
          size = BigNumber(value);
        } else if (field === 'price') {
          price = BigNumber(value);
          size = BigNumber(formValues.size) || BigNumber(0);
        } else {
          return;
        }

        const notional = utils.toNotional(size, price || BigNumber(0));
        const pct = spotUtils.calcPctBySize({
          size,
          side: formValues.side,
          price,
          ticket,
        });
        form.setValue(field, Number(value));
        form.setValue('notional', notional.toNumber());
        form.setValue('sizePct', Number(pct));
      }
    });

    return () => {
      ticketEventEmitter.unlisten();
    };
  }, [form, ticket.type, ticket]);
};

export const useSpotMarketTicketEvents = () => {
  const form = useForm('market');
  const ticket = useTicketContext('spot');

  const { data: _markPrice } = useMarkPrice(ticket.market.id);
  const markPrice = _markPrice
    ? toBigNum(_markPrice, ticket.market.decimalPlaces)
    : undefined;

  useEffect(() => {
    ticketEventEmitter.listen((fields) => {
      const formValues = form.getValues();

      for (const f in fields) {
        const field = f as keyof typeof fields;
        const value = fields[field];

        if (!value) return;

        let price: BigNumber;
        let size: BigNumber;

        if (field === 'size') {
          price = markPrice || BigNumber(0);
          size = BigNumber(value);
        } else if (field === 'price') {
          // no op, can't set price on market order
          return;
        } else {
          return;
        }

        const notional = utils.toNotional(size, price || BigNumber(0));
        const pct = spotUtils.calcPctBySize({
          size,
          side: formValues.side,
          price,
          ticket,
        });
        form.setValue(field, Number(value));
        form.setValue('notional', notional.toNumber());
        form.setValue('sizePct', Number(pct));
      }
    });

    return () => {
      ticketEventEmitter.unlisten();
    };
  }, [form, ticket.type, ticket, markPrice]);
};
