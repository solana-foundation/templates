/**
 * Custom error classes for x402 protocol
 */

export class X402Error extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'X402Error';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class PaymentVerificationError extends X402Error {
  constructor(message: string) {
    super(message, 'PAYMENT_VERIFICATION_FAILED', 402);
    this.name = 'PaymentVerificationError';
  }
}

export class PaymentSettlementError extends X402Error {
  constructor(message: string) {
    super(message, 'PAYMENT_SETTLEMENT_FAILED', 402);
    this.name = 'PaymentSettlementError';
  }
}

export class InvalidPaymentRequestError extends X402Error {
  constructor(message: string) {
    super(message, 'INVALID_PAYMENT_REQUEST', 400);
    this.name = 'InvalidPaymentRequestError';
  }
}

export class NonceError extends X402Error {
  constructor(message: string) {
    super(message, 'NONCE_ERROR', 400);
    this.name = 'NonceError';
  }
}

export class DatabaseError extends X402Error {
  constructor(message: string) {
    super(message, 'DATABASE_ERROR', 500);
    this.name = 'DatabaseError';
  }
}

export class InsufficientBalanceError extends X402Error {
  constructor(message: string) {
    super(message, 'INSUFFICIENT_BALANCE', 402);
    this.name = 'InsufficientBalanceError';
  }
}

export class TransactionError extends X402Error {
  constructor(message: string) {
    super(message, 'TRANSACTION_ERROR', 500);
    this.name = 'TransactionError';
  }
}

export class SignatureVerificationError extends X402Error {
  constructor(message: string) {
    super(message, 'SIGNATURE_VERIFICATION_FAILED', 401);
    this.name = 'SignatureVerificationError';
  }
}
