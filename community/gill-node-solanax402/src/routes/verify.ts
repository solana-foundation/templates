/**
 * Payment verification routes
 */

import type { Request, Response } from 'express';
import type { Address } from 'gill';
import { PaymentRequest } from '../lib/payment-request.js';
import { SolanaUtils } from '../lib/solana-utils.js';
import type { NonceDatabase } from '../lib/nonce-database.js';

export interface VerifyRouteContext {
  solanaUtils: SolanaUtils;
  nonceDb: NonceDatabase;
  facilitatorAddress: Address;
  maxPaymentAmount: bigint;
}

/**
 * Verify a payment request (Step 1 of x402 protocol)
 * 1. Receives the signed payload (Signature + Nonce)
 * 2. Checks the database for the Nonce. If the Nonce exists, returns an error
 * 3. Verifies the cryptographic signature against the client's public key
 * 4. Returns {"isValid": true} or {"isValid": false}
 */
export function verifyPaymentRoute(context: VerifyRouteContext) {
  return async (req: Request, res: Response) => {
    console.log('FACILITATOR DEBUG: Raw Request Body Received:', JSON.stringify(req.body));

    const { paymentRequest } = req.body;

    if (!paymentRequest) {
      return res.json({ isValid: false, error: 'Payment request is required' });
    }

    try {
      // Deserialize and validate payment request
      const paymentReq = PaymentRequest.deserialize(paymentRequest);
      const validation = paymentReq.validate();

      if (!validation.isValid) {
        return res.json({
          isValid: false,
          error: `Invalid payment request: ${validation.errors.join(', ')}`,
        });
      }

      const { payload, signature, clientPublicKey } = paymentReq;

      // 2. Check if nonce has been used
      const nonceStatus = await context.nonceDb.isNonceUsed(payload.nonce);
      if (nonceStatus.used) {
        return res.json({ isValid: false, error: 'Nonce has already been used' });
      }

      // 3. Verify cryptographic signature against client's public key
      const structuredData = payload.createStructuredData();

      console.log('FACILITATOR DEBUG: Structured Data for Verification:', JSON.stringify(structuredData));
      console.log('FACILITATOR DEBUG: Client PubKey:', clientPublicKey);
      console.log('FACILITATOR DEBUG: Signature:', signature);

      const isValidSignature = context.solanaUtils.verifyStructuredDataSignature(
        structuredData,
        signature,
        clientPublicKey
      );

      console.log('FACILITATOR DEBUG: Signature Valid?', isValidSignature);

      if (!isValidSignature) {
        return res.json({ isValid: false, error: 'Invalid signature' });
      }

      // STORE AND MARK NONCE AS USED IMMEDIATELY AFTER VERIFICATION (x402 protocol requirement)
      await context.nonceDb.storeNonce({
        nonce: payload.nonce,
        clientPublicKey: clientPublicKey,
        amount: payload.amount,
        recipient: payload.recipient,
        resourceId: payload.resourceId,
        resourceUrl: payload.resourceUrl,
        timestamp: payload.timestamp,
        expiry: payload.expiry,
      });

      // MARK NONCE AS USED IMMEDIATELY TO PREVENT REPLAY ATTACKS
      await context.nonceDb.markNonceUsed(payload.nonce, null);

      console.log('FACILITATOR DEBUG: Nonce stored and marked as used:', payload.nonce);

      // Additional validations
      const amount = BigInt(payload.amount);
      if (amount <= 0 || amount > context.maxPaymentAmount) {
        return res.json({ isValid: false, error: 'Invalid payment amount' });
      }

      if (!context.solanaUtils.isValidPublicKey(payload.recipient)) {
        return res.json({ isValid: false, error: 'Invalid recipient address' });
      }

      if (!context.solanaUtils.isValidPublicKey(clientPublicKey)) {
        return res.json({ isValid: false, error: 'Invalid client public key' });
      }

      // 4. Return {"isValid": true}
      return res.json({ isValid: true });
    } catch (error) {
      return res.json({
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}
