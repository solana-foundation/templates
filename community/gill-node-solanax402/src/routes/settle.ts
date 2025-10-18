/**
 * Payment settlement routes
 */

import type { Request, Response } from 'express';
import type { Address } from 'gill';
import { PaymentRequest } from '../lib/payment-request.js';
import { SolanaUtils } from '../lib/solana-utils.js';
import type { NonceDatabase } from '../lib/nonce-database.js';

export interface SettleRouteContext {
  solanaUtils: SolanaUtils;
  nonceDb: NonceDatabase;
  facilitatorAddress: Address;
  facilitatorKeypair: any; // Keypair from Gill
  simulateTransactions: boolean;
  config: {
    facilitatorPrivateKey: string;
  };
}

/**
 * Settle a payment (Step 2 of x402 protocol)
 * 1. Performs the same checks as /verify
 * 2. Submits the Solana transaction to the RPC, using the client's signature
 * 3. Records the Nonce (or Signature) in the database
 * 4. Returns {"status": "settled"}
 */
export function settlePaymentRoute(context: SettleRouteContext) {
  return async (req: Request, res: Response) => {
    const { paymentRequest } = req.body;

    if (!paymentRequest) {
      return res.json({ status: 'error', error: 'Payment request is required' });
    }

    let paymentReq: PaymentRequest | null = null;
    try {
      // Deserialize payment request to get nonce and other details
      paymentReq = PaymentRequest.deserialize(paymentRequest);
      const { payload } = paymentReq;
      const nonce = payload.nonce;

      // Get nonce details for transaction (already stored by verify)
      const nonceDetails = await context.nonceDb.getNonceDetails(nonce);
      if (!nonceDetails) {
        return res.json({ status: 'error', error: 'Nonce not found - please verify payment first' });
      }

      // Check if nonce has already been settled (has transaction signature)
      if (nonceDetails.transactionSignature) {
        return res.json({ status: 'error', error: 'Payment already settled' });
      }

      // Check if nonce has expired
      if (Date.now() > nonceDetails.expiry) {
        return res.json({ status: 'error', error: 'Nonce has expired' });
      }

      console.log('Starting Solana on-chain payment settlement...');
      console.log('Payment details:', {
        nonce: nonce,
        amount: nonceDetails.amount,
        clientPublicKey: nonceDetails.clientPublicKey,
        recipient: nonceDetails.recipient,
      });

      console.log('x402 SOL Payment Setup:', {
        clientPublicKey: nonceDetails.clientPublicKey,
        recipient: nonceDetails.recipient,
        amount: nonceDetails.amount,
        facilitator: context.facilitatorAddress.toString(),
      });

      const requiredAmount = BigInt(nonceDetails.amount);

      if (!context.simulateTransactions) {
        // Check SOL balances in devnet mode
        const clientBalance = await context.solanaUtils.getSOLBalance(nonceDetails.clientPublicKey);

        console.log('SOL Balance check:', {
          clientBalance: clientBalance.toString(),
          requiredAmount: requiredAmount.toString(),
          sufficient: clientBalance >= requiredAmount,
        });

        if (clientBalance < requiredAmount) {
          return res.json({
            status: 'error',
            error: `Insufficient SOL balance. Required: ${requiredAmount}, Available: ${clientBalance}`,
          });
        }
      } else {
        console.log(' Simulation Mode: Skipping balance checks for x402 demo');
      }

      console.log(` Executing x402 payment: ${requiredAmount} lamports (${Number(requiredAmount) / 1000000000} SOL)`);

      // Generate simulated or real transaction signature
      let transactionSignature: string;
      if (context.simulateTransactions) {
        transactionSignature = 'x402-demo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        console.log('Transaction confirmed on-chain (simulated):', transactionSignature);
      } else {
        // TRUE x402 ATOMIC SETTLEMENT (Sponsored Transaction)
        // Client must sign the transaction - their funds move instantly (instant finality)
        if (!paymentReq.signedTransaction) {
          throw new Error(
            'Missing signed transaction. TRUE x402 requires client to sign the transaction for instant finality.'
          );
        }

        console.log('TRUE x402 PROTOCOL: Processing sponsored transaction');
        console.log('   Client signed transaction (their SOL will move to merchant)');
        console.log('   Facilitator will add signature as fee payer (pays gas)');
        console.log();

        try {
          transactionSignature = await context.solanaUtils.submitSponsoredTransaction(
            context.config.facilitatorPrivateKey, // facilitator private key (fee payer)
            paymentReq.signedTransaction // client-signed transaction
          );
          console.log('ATOMIC SETTLEMENT complete!');
          console.log(
            `   View on Solana Explorer: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
          );
        } catch (error) {
          console.error('Sponsored transaction failed:', error);
          throw new Error(
            `Failed to submit sponsored transaction: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }

      // Verify the transfer worked by checking balances
      if (!context.simulateTransactions) {
        const recipientBalance = await context.solanaUtils.getSOLBalance(nonceDetails.recipient);
        console.log(` Transfer completed! Recipient balance: ${recipientBalance.toString()} lamports`);
      }

      // 3. Record the Transaction Signature in the database
      await context.nonceDb.updateTransactionSignature(nonce, transactionSignature);

      // Store transaction record
      await context.nonceDb.storeTransaction({
        nonce: nonce,
        transactionSignature: transactionSignature,
        status: 'confirmed',
      });

      // 4. Return {"status": "settled"}
      return res.json({ status: 'settled', transactionSignature: transactionSignature });
    } catch (error) {
      console.error('Settlement error:', error);

      // Store failed transaction
      if (paymentReq && paymentReq.payload) {
        await context.nonceDb.storeTransaction({
          nonce: paymentReq.payload.nonce,
          transactionSignature: null,
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      return res.json({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}
