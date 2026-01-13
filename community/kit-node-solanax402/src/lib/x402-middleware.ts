/**
 * x402 Express Middleware
 * Handles payment verification and routing for the x402 protocol
 * Uses native fetch instead of axios
 */

import type { Request, Response, NextFunction } from 'express';

export interface X402Options {
  facilitatorUrl?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface RouteConfig {
  amount?: string;
  payTo?: string;
  asset?: string;
  network?: string;
}

export interface PaymentInfo {
  verified: boolean;
  nonce: string;
  amount: string;
  recipient: string;
  resourceId: string;
  transactionSignature: string;
}

export interface VerificationResult {
  isValid: boolean;
  error?: string;
}

export interface SettlementResult {
  status: string;
  transactionSignature?: string;
  error?: string;
}

export interface HealthCheckResult {
  healthy: boolean;
  facilitator?: string;
  timestamp?: string;
  error?: string;
}

export interface StatsResult {
  success: boolean;
  data?: {
    totalNonces: number;
    usedNonces: number;
    activeNonces: number;
    expiredNonces: number;
  };
  error?: string;
}

export interface PaymentRequestData {
  payload: {
    amount: string;
    recipient: string;
    resourceId: string;
    resourceUrl: string;
    nonce: string;
    timestamp: number;
    expiry: number;
  };
  signature: string;
  clientPublicKey: string;
}

// Extend Express Request to include payment info
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      payment?: PaymentInfo;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

/**
 * x402 Middleware Class
 */
export class X402Middleware {
  private facilitatorUrl: string;
  private timeout: number;
  private retryAttempts: number;
  private retryDelay: number;
  private routeConfig: RouteConfig;

  constructor(options: X402Options = {}, routeConfig: RouteConfig = {}) {
    this.facilitatorUrl = options.facilitatorUrl || 'http://localhost:3001';
    this.timeout = options.timeout || 30000;
    this.retryAttempts = options.retryAttempts || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.routeConfig = routeConfig;
  }

  /**
   * Main middleware function - implements x402 protocol
   */
  middleware() {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        // Extract payment request from X-PAYMENT header (x402 standard)
        const paymentHeader = req.headers['x-payment'] as string | undefined;

        if (!paymentHeader) {
          const { amount, payTo, asset, network } = this.routeConfig;

          // Return HTTP 402 Payment Required with standardized accepts array
          res.status(402).json({
            accepts: [
              {
                scheme: 'exact',
                network: network || 'solana-mainnet',
                maxAmountRequired: amount || '1000000',
                asset: asset || 'USDC_SPL_MINT_ADDRESS',
                payTo: payTo || 'MERCHANT_WALLET_ADDRESS',
                resource: req.path,
              },
            ],
            error: 'Payment Required',
            message: 'The X-PAYMENT header is missing or empty.',
          });
          return;
        }

        // Parse payment request
        let paymentRequest: PaymentRequestData;
        try {
          paymentRequest = JSON.parse(paymentHeader) as PaymentRequestData;
        } catch (error) {
          res.status(400).json({
            error: 'Invalid Payment Request',
            message: 'X-PAYMENT header must contain valid JSON',
            code: 'INVALID_PAYMENT_FORMAT',
          });
          return;
        }

        // Verify payment request with facilitator
        const verificationResult = await this.verifyPayment(paymentRequest);

        if (!verificationResult.isValid) {
          res.status(402).json({
            error: 'Payment Verification Failed',
            message: verificationResult.error,
            code: 'PAYMENT_VERIFICATION_FAILED',
          });
          return;
        }

        // Settle payment with facilitator
        const settlementResult = await this.settlePayment(paymentRequest);

        if (settlementResult.status !== 'settled') {
          res.status(402).json({
            error: 'Payment Settlement Failed',
            message: settlementResult.error,
            code: 'PAYMENT_SETTLEMENT_FAILED',
          });
          return;
        }

        // Add payment info to request object for use in route handlers
        req.payment = {
          verified: true,
          nonce: paymentRequest.payload.nonce,
          amount: paymentRequest.payload.amount,
          recipient: paymentRequest.payload.recipient,
          resourceId: paymentRequest.payload.resourceId,
          transactionSignature: settlementResult.transactionSignature || '',
        };

        // Continue to the next middleware/route handler
        next();
      } catch (error) {
        console.error('X402 Middleware Error:', error);

        res.status(500).json({
          error: 'Internal Server Error',
          message: 'Payment processing failed',
          code: 'PAYMENT_PROCESSING_ERROR',
        });
      }
    };
  }

  /**
   * Verify payment request with facilitator
   */
  async verifyPayment(paymentRequest: PaymentRequestData): Promise<VerificationResult> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.facilitatorUrl}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentRequest: JSON.stringify(paymentRequest),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      return data as VerificationResult;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            isValid: false,
            error: 'Request timeout',
          };
        }
        return {
          isValid: false,
          error: error.message || 'Verification failed',
        };
      }
      return {
        isValid: false,
        error: 'Verification request failed',
      };
    }
  }

  /**
   * Settle payment with facilitator
   */
  async settlePayment(paymentRequest: PaymentRequestData): Promise<SettlementResult> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.facilitatorUrl}/settle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentRequest: JSON.stringify(paymentRequest),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      return data as SettlementResult;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            status: 'error',
            error: 'Request timeout',
          };
        }
        return {
          status: 'error',
          error: error.message || 'Settlement failed',
        };
      }
      return {
        status: 'error',
        error: 'Settlement request failed',
      };
    }
  }

  /**
   * Retry mechanism for failed requests
   */
  async retryRequest<T>(requestFn: () => Promise<T>, attempts: number = this.retryAttempts): Promise<T> {
    for (let i = 0; i < attempts; i++) {
      try {
        return await requestFn();
      } catch (error) {
        if (i === attempts - 1) {
          throw error;
        }

        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay * (i + 1)));
      }
    }
    throw new Error('All retry attempts failed');
  }

  /**
   * Health check for facilitator connection
   */
  async healthCheck(): Promise<HealthCheckResult> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.facilitatorUrl}/health`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = (await response.json()) as {
        success?: boolean;
        data?: { facilitator?: string; timestamp?: string };
      };
      return {
        healthy: true,
        facilitator: data.data?.facilitator,
        timestamp: data.data?.timestamp,
      };
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get facilitator statistics
   */
  async getStats(): Promise<StatsResult> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.facilitatorUrl}/stats`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      return data as StatsResult;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

/**
 * Factory function to create middleware instance
 */
export function createX402Middleware(routeConfig: RouteConfig = {}, options: X402Options = {}) {
  const middleware = new X402Middleware(options, routeConfig);
  return middleware.middleware();
}

/**
 * Create middleware with additional utility methods
 */
export function createX402MiddlewareWithUtils(routeConfig: RouteConfig = {}, options: X402Options = {}) {
  const middleware = new X402Middleware(options, routeConfig);

  return {
    middleware: middleware.middleware(),
    healthCheck: () => middleware.healthCheck(),
    getStats: () => middleware.getStats(),
    verifyPayment: (paymentRequest: PaymentRequestData) => middleware.verifyPayment(paymentRequest),
    settlePayment: (paymentRequest: PaymentRequestData) => middleware.settlePayment(paymentRequest),
  };
}
