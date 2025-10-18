/**
 * Payment Request and Authorization Payload for x402 Protocol
 */

import crypto from 'crypto';
import { InvalidPaymentRequestError } from '../errors/index.js';

export interface AuthorizationPayloadData {
  amount: string;
  recipient: string;
  resourceId: string;
  resourceUrl: string;
  nonce: string;
  timestamp: number;
  expiry: number;
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

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Authorization Payload Structure for x402 Protocol
 * This is the structured data that clients sign off-chain
 */
export class AuthorizationPayload {
  amount: string;
  recipient: string;
  resourceId: string;
  resourceUrl: string;
  nonce: string;
  timestamp: number;
  expiry: number;

  constructor(data: AuthorizationPayloadData) {
    this.amount = data.amount;
    this.recipient = data.recipient;
    this.resourceId = data.resourceId;
    this.resourceUrl = data.resourceUrl;
    this.nonce = data.nonce;
    this.timestamp = data.timestamp;
    this.expiry = data.expiry;
  }

  /**
   * Create authorization payload from parameters
   */
  static create(params: {
    amount: string;
    recipient: string;
    resourceId: string;
    resourceUrl: string;
    nonce: string;
    expiryHours?: number;
  }): AuthorizationPayload {
    const timestamp = Date.now();
    const expiryHours = params.expiryHours ?? 24;
    const expiry = timestamp + expiryHours * 60 * 60 * 1000;

    return new AuthorizationPayload({
      amount: params.amount,
      recipient: params.recipient,
      resourceId: params.resourceId,
      resourceUrl: params.resourceUrl,
      nonce: params.nonce,
      timestamp,
      expiry,
    });
  }

  /**
   * Serialize payload to string for signing
   */
  serialize(): string {
    const structuredData = this.createStructuredData();
    return JSON.stringify(structuredData);
  }

  /**
   * Get raw payload data as JSON string (without structured data format)
   */
  serializeRaw(): string {
    return JSON.stringify({
      amount: this.amount,
      recipient: this.recipient,
      resourceId: this.resourceId,
      resourceUrl: this.resourceUrl,
      nonce: this.nonce,
      timestamp: this.timestamp,
      expiry: this.expiry,
    });
  }

  /**
   * Create EIP-712 equivalent structured data for Solana signing
   */
  createStructuredData(): StructuredData {
    return {
      domain: {
        name: 'x402-solana-protocol',
        version: '1',
        chainId: 'devnet',
        verifyingContract: 'x402-sol',
      },
      types: {
        AuthorizationPayload: [
          { name: 'amount', type: 'string' },
          { name: 'recipient', type: 'string' },
          { name: 'resourceId', type: 'string' },
          { name: 'resourceUrl', type: 'string' },
          { name: 'nonce', type: 'string' },
          { name: 'timestamp', type: 'uint64' },
          { name: 'expiry', type: 'uint64' },
        ],
      },
      primaryType: 'AuthorizationPayload',
      message: {
        amount: this.amount,
        recipient: this.recipient,
        resourceId: this.resourceId,
        resourceUrl: this.resourceUrl,
        nonce: this.nonce,
        timestamp: this.timestamp,
        expiry: this.expiry,
      },
    };
  }

  /**
   * Get the message hash for signing
   */
  getMessageHash(): string {
    const structuredData = this.createStructuredData();
    return JSON.stringify(structuredData);
  }

  /**
   * Deserialize payload from string
   */
  static deserialize(payloadString: string): AuthorizationPayload {
    try {
      const data = JSON.parse(payloadString) as AuthorizationPayloadData;
      return new AuthorizationPayload(data);
    } catch (error) {
      throw new InvalidPaymentRequestError('Invalid payload format');
    }
  }

  /**
   * Validate payload structure and values
   */
  validate(): ValidationResult {
    const errors: string[] = [];

    if (!this.amount || typeof this.amount !== 'string' || BigInt(this.amount) <= 0) {
      errors.push('Invalid amount');
    }

    if (!this.recipient || typeof this.recipient !== 'string') {
      errors.push('Invalid recipient address');
    }

    if (!this.resourceId || typeof this.resourceId !== 'string') {
      errors.push('Invalid resource ID');
    }

    if (!this.resourceUrl || typeof this.resourceUrl !== 'string') {
      errors.push('Invalid resource URL');
    }

    if (!this.nonce || typeof this.nonce !== 'string') {
      errors.push('Invalid nonce');
    }

    if (!this.timestamp || typeof this.timestamp !== 'number') {
      errors.push('Invalid timestamp');
    }

    if (!this.expiry || typeof this.expiry !== 'number') {
      errors.push('Invalid expiry');
    }

    if (this.expiry <= this.timestamp) {
      errors.push('Expiry must be after timestamp');
    }

    if (Date.now() > this.expiry) {
      errors.push('Payload has expired');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate a cryptographically secure nonce
   */
  static generateNonce(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Create a hash of the payload for verification
   */
  hash(): string {
    const payloadString = this.serialize();
    return crypto.createHash('sha256').update(payloadString).digest('hex');
  }
}

export interface PaymentRequestData {
  payload: AuthorizationPayload;
  signature: string;
  clientPublicKey: string;
  signedTransaction?: string; // Base64-encoded serialized Solana transaction (for true x402 atomic settlement)
}

/**
 * Payment Request Structure
 * This represents a complete payment request with signature
 *
 * For TRUE x402 atomic settlement:
 * - Client creates Solana transaction (transfer SOL from client to merchant)
 * - Client signs the transaction
 * - Client sends serialized transaction in `signedTransaction` field
 * - Facilitator adds their signature as fee payer and submits
 */
export class PaymentRequest {
  payload: AuthorizationPayload;
  signature: string;
  clientPublicKey: string;
  signedTransaction?: string; // Base64-encoded serialized Solana transaction

  constructor(data: PaymentRequestData) {
    this.payload = data.payload;
    this.signature = data.signature;
    this.clientPublicKey = data.clientPublicKey;
    this.signedTransaction = data.signedTransaction;
  }

  /**
   * Create payment request from authorization data
   */
  static create(params: {
    amount: string;
    recipient: string;
    resourceId: string;
    resourceUrl: string;
    nonce: string;
    signature: string;
    clientPublicKey: string;
    expiryHours?: number;
  }): PaymentRequest {
    const timestamp = Date.now();
    const expiryHours = params.expiryHours ?? 24;
    const expiry = timestamp + expiryHours * 60 * 60 * 1000;

    const payload = new AuthorizationPayload({
      amount: params.amount,
      recipient: params.recipient,
      resourceId: params.resourceId,
      resourceUrl: params.resourceUrl,
      nonce: params.nonce,
      timestamp,
      expiry,
    });

    return new PaymentRequest({
      payload,
      signature: params.signature,
      clientPublicKey: params.clientPublicKey,
    });
  }

  /**
   * Validate the payment request
   */
  validate(): ValidationResult {
    const payloadValidation = this.payload.validate();

    if (!payloadValidation.isValid) {
      return {
        isValid: false,
        errors: payloadValidation.errors,
      };
    }

    if (!this.signature || typeof this.signature !== 'string') {
      return {
        isValid: false,
        errors: ['Invalid signature'],
      };
    }

    if (!this.clientPublicKey || typeof this.clientPublicKey !== 'string') {
      return {
        isValid: false,
        errors: ['Invalid client public key'],
      };
    }

    return {
      isValid: true,
      errors: [],
    };
  }

  /**
   * Serialize payment request for transmission
   */
  serialize(): string {
    const data: Record<string, unknown> = {
      payload: {
        amount: this.payload.amount,
        recipient: this.payload.recipient,
        resourceId: this.payload.resourceId,
        resourceUrl: this.payload.resourceUrl,
        nonce: this.payload.nonce,
        timestamp: this.payload.timestamp,
        expiry: this.payload.expiry,
      },
      signature: this.signature,
      clientPublicKey: this.clientPublicKey,
    };

    if (this.signedTransaction) {
      data.signedTransaction = this.signedTransaction;
    }

    return JSON.stringify(data);
  }

  /**
   * Deserialize payment request from string
   */
  static deserialize(requestString: string): PaymentRequest {
    try {
      const data = JSON.parse(requestString);
      const payload = new AuthorizationPayload(data.payload as AuthorizationPayloadData);

      return new PaymentRequest({
        payload,
        signature: data.signature as string,
        clientPublicKey: data.clientPublicKey as string,
        signedTransaction: data.signedTransaction as string | undefined,
      });
    } catch (error) {
      throw new InvalidPaymentRequestError('Invalid payment request format');
    }
  }
}
