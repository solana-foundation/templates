/**
 * Solana utilities using @solana/kit
 * Handles Solana operations, signatures, and transactions
 */

import {
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createKeyPairSignerFromBytes,
  signTransaction,
  sendTransactionWithoutConfirmingFactory,
  getSignatureFromTransaction,
  assertIsTransactionWithinSizeLimit,
  getBase64Codec,
} from '@solana/kit';
import type { Rpc, RpcSubscriptions, SolanaRpcApi, SolanaRpcSubscriptionsApi } from '@solana/kit';
import { getTransactionDecoder } from '@solana/transactions';
import { address } from '@solana/addresses';
import type { Address } from '@solana/addresses';
import { SignatureVerificationError } from '../errors/index.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

export interface SolanaUtilsConfig {
  rpcEndpoint: string;
  rpcSubscriptionsEndpoint?: string;
}

export interface StructuredData {
  domain: {
    name: string;
    version: string;
    chainId: string;
    verifyingContract: string;
  };
  types: {
    [key: string]: Array<{ name: string; type: string }>;
  };
  primaryType: string;
  message: Record<string, unknown>;
}

export interface X402SOLPaymentTransactionParams {
  fromPublicKey: string;
  toPublicKey: string;
  amount: bigint;
  facilitatorAddress: Address;
  nonce: string;
  resourceId: string;
}

export class SolanaUtils {
  private rpc: Rpc<SolanaRpcApi>;
  private rpcSubscriptions?: RpcSubscriptions<SolanaRpcSubscriptionsApi>;

  constructor(config: SolanaUtilsConfig) {
    this.rpc = createSolanaRpc(config.rpcEndpoint) as Rpc<SolanaRpcApi>;
    if (config.rpcSubscriptionsEndpoint) {
      this.rpcSubscriptions = createSolanaRpcSubscriptions(
        config.rpcSubscriptionsEndpoint
      ) as RpcSubscriptions<SolanaRpcSubscriptionsApi>;
    }
  }

  /**
   * Get SOL balance for a public key
   */
  async getSOLBalance(publicKey: string): Promise<bigint> {
    try {
      const addr = address(publicKey);
      const response = await this.rpc.getBalance(addr).send();
      return response.value;
    } catch (error) {
      console.error('Error getting SOL balance:', error);
      return BigInt(0);
    }
  }

  /**
   * Check if a public key is valid
   */
  isValidPublicKey(addr: string): boolean {
    try {
      address(addr);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verify a signature against a message and public key
   */
  verifySignature(message: string, signature: string, publicKey: string): boolean {
    try {
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = bs58.decode(signature);
      const publicKeyBytes = bs58.decode(publicKey);

      return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }

  /**
   * Verify a structured data signature (EIP-712 equivalent for Solana)
   */
  verifyStructuredDataSignature(structuredData: StructuredData, signature: string, publicKey: string): boolean {
    try {
      // Convert structured data to string for verification
      const messageString = JSON.stringify(structuredData);
      return this.verifySignature(messageString, signature, publicKey);
    } catch (error) {
      console.error('Structured data signature verification error:', error);
      return false;
    }
  }

  /**
   * Sign a message with a keypair (for testing purposes)
   */
  signMessage(message: string, privateKeyBase58: string): string {
    try {
      const messageBytes = new TextEncoder().encode(message);
      const privateKeyBytes = bs58.decode(privateKeyBase58);

      const signature = nacl.sign.detached(messageBytes, privateKeyBytes);
      return bs58.encode(signature);
    } catch (error) {
      console.error('Message signing error:', error);
      throw new SignatureVerificationError(
        `Failed to sign message: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Sign structured data (EIP-712 equivalent) for x402 authorization
   */
  signStructuredData(structuredData: StructuredData, privateKeyBase58: string): string {
    try {
      const messageString = JSON.stringify(structuredData);
      return this.signMessage(messageString, privateKeyBase58);
    } catch (error) {
      console.error('Structured data signing error:', error);
      throw new SignatureVerificationError(
        `Failed to sign structured data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Convert lamports to SOL
   */
  lamportsToSOL(lamports: bigint): number {
    return Number(lamports) / 1_000_000_000;
  }

  /**
   * Convert SOL to lamports
   */
  solToLamports(sol: number): bigint {
    return BigInt(Math.floor(sol * 1_000_000_000));
  }

  /**
   * Get recent blockhash
   */
  async getRecentBlockhash(): Promise<string> {
    const response = await this.rpc.getLatestBlockhash().send();
    return response.value.blockhash;
  }

  /**
   * Get RPC instance for direct access
   */
  getRpc() {
    return this.rpc;
  }

  /**
   * Get RPC subscriptions instance for direct access
   */
  getRpcSubscriptions() {
    return this.rpcSubscriptions;
  }

  /**
   * Submit a sponsored transaction (TRUE x402 instant finality)
   * Client signs the transaction, facilitator adds signature as fee payer.
   * This achieves instant on-chain settlement with NO debt tracking.
   * @param facilitatorPrivateKey - Facilitator private key in base58 format
   * @param serializedTransaction - Base64-encoded serialized transaction signed by client
   * @returns Transaction signature
   */
  async submitSponsoredTransaction(facilitatorPrivateKey: string, serializedTransaction: string): Promise<string> {
    try {
      console.log('TRUE x402 ATOMIC SETTLEMENT: Sponsored Transaction');
      console.log('  Client has signed transaction (their SOL will move)');
      console.log('  Facilitator will add signature as fee payer (pays gas)');
      console.log();

      // Create facilitator keypair signer
      const secretKey = bs58.decode(facilitatorPrivateKey);
      const facilitatorSigner = await createKeyPairSignerFromBytes(secretKey);

      console.log('  Facilitator (fee payer):', facilitatorSigner.address);

      const base64Codec = getBase64Codec();
      const transactionBytes = base64Codec.encode(serializedTransaction);

      // Deserialize the transaction
      const transactionDecoder = getTransactionDecoder();
      const transaction = transactionDecoder.decode(transactionBytes);

      console.log('  Transaction details:');
      console.log('     - Signatures:', transaction.signatures ? Object.keys(transaction.signatures).length : 0);
      console.log();
      console.log('  How TRUE x402 works:');
      console.log('     - Client signs: Authorizes their SOL to move');
      console.log('     - Facilitator signs: Pays gas fee (sponsored transaction)');
      console.log('     - Single atomic transaction on-chain');
      console.log("     - Client's funds -> Merchant (instant settlement)");
      console.log();

      console.log('  Facilitator signing as fee payer...');

      // Add facilitator's signature (fee payer) to the already client-signed transaction
      const signedTransaction = await signTransaction([facilitatorSigner], transaction);

      console.log('  Both signatures present (client + facilitator)');
      console.log('  Sending to Solana network...');

      assertIsTransactionWithinSizeLimit(signedTransaction);

      const signature = getSignatureFromTransaction(signedTransaction);

      const sendTx = sendTransactionWithoutConfirmingFactory({ rpc: this.rpc });
      await sendTx(signedTransaction, { commitment: 'confirmed' });

      // Wait for confirmation
      await this.waitForConfirmation(signature);

      console.log('  ATOMIC SETTLEMENT COMPLETE!');
      console.log('     Signature:', signature);
      console.log('     Explorer:', `https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      console.log();
      console.log("  Client's SOL moved to merchant, facilitator paid gas!");

      return signature;
    } catch (error) {
      console.error('  Sponsored transaction error:', error);
      throw new Error(
        `Failed to submit sponsored transaction: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Wait for transaction confirmation by polling getSignatureStatuses
   */
  private async waitForConfirmation(signature: string, maxRetries = 30, intervalMs = 1000): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      const response = await this.rpc
        .getSignatureStatuses([signature as Parameters<SolanaRpcApi['getSignatureStatuses']>[0][0]])
        .send();
      const status = response.value[0];

      if (status !== null) {
        if (status.err) {
          throw new Error(`Transaction failed: ${JSON.stringify(status.err)}`);
        }
        if (status.confirmationStatus === 'confirmed' || status.confirmationStatus === 'finalized') {
          return;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    throw new Error(`Transaction confirmation timeout after ${maxRetries * intervalMs}ms`);
  }
}
