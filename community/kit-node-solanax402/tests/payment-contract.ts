import type { PaymentRequestData } from '../src/lib/x402-middleware.js';

export const signedPayment: PaymentRequestData = {
  payload: {
    amount: '10000000',
    recipient: 'merchant',
    resourceId: '/resource',
    resourceUrl: '/resource',
    nonce: 'nonce',
    timestamp: 1,
    expiry: 2,
  },
  signature: 'authorization',
  clientPublicKey: 'client',
  signedTransaction: 'base64-wire',
};
