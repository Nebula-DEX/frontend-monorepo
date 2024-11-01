import { type Address } from 'viem';

// The name of the app to be used in the document title and elsewhere in the UI
export const APP_NAME = 'Nebula';

// Neb token
export const APP_SYMBOL = 'NEB';
export const APP_TOKEN_ID =
  'd1984e3d365faa05bcafbe41f50f90e3663ee7c0da22bb1e24b164e9532691b2';

// USDT (Arb) token, usded for the buying neb via spot market
export const USDT_ID =
  '2a1f29de786c49d7d4234410bf2e7196a6d173730288ffe44b1f7e282efb92b1';

// The asset to be used for deposits during onboarding
export const ONBOARDING_TARGET_ASSET = APP_TOKEN_ID;

// The smart contract to receive squid deposits so that recovery of assets can
// be done if the swap was not successfull
export const SQUID_RECEIVER_ADDRESS =
  '0x35a297F91F356C6830D8F426713Db463B2F66dc8' as Address;

export const DEFAULT_DISPLAY_DPS = 2;
