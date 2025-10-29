/**
 * x402 Payment Verification
 *
 * Handles payment verification via facilitator
 */

import transactionStorage from './transaction-storage'
import { X402_CONFIG } from './x402-config'

interface PaymentPayload {
  signature: string
  from: string
  to: string
  amount: string
  token: string
}

interface Payment {
  x402Version: number
  scheme: string
  network: string
  payload: PaymentPayload
}

interface VerificationResult {
  isValid: boolean
  signature?: string
  reason?: string
}

export async function verifyPayment(payment: Payment, resource: string): Promise<VerificationResult> {
  try {
    if (!payment.payload || !payment.payload.signature) {
      return { isValid: false, reason: 'Invalid payment structure' }
    }

    const { signature, from, to, amount } = payment.payload

    if (await transactionStorage.has(signature)) {
      return { isValid: true, signature }
    }

    const paymentRequirements = {
      scheme: 'exact',
      network: 'solana-devnet',
      maxAmountRequired: X402_CONFIG.REQUIRED_AMOUNT,
      resource,
      description: 'Access to protected content',
      payTo: X402_CONFIG.TREASURY_ADDRESS,
      maxTimeoutSeconds: 60,
      asset: X402_CONFIG.USDC_DEVNET_MINT,
    }

    const verifyResponse = await fetch(`${X402_CONFIG.FACILITATOR_BASE_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment,
        paymentRequirements,
      }),
    })

    if (!verifyResponse.ok) {
      return {
        isValid: false,
        reason: `Facilitator verification failed: ${verifyResponse.status}`,
      }
    }

    const verifyResult = await verifyResponse.json()

    if (!verifyResult.isValid) {
      return {
        isValid: false,
        reason: verifyResult.reason || 'Payment verification failed',
      }
    }

    await transactionStorage.add(signature, { from, to, amount })
    console.log('Payment verified successfully:', signature)

    try {
      const settleResponse = await fetch(`${X402_CONFIG.FACILITATOR_BASE_URL}/settle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: verifyResult.transactionId,
          payment,
        }),
      })

      if (!settleResponse.ok) {
        const settleResult = await settleResponse.json()
        return {
          isValid: false,
          reason: settleResult.reason || 'Settlement verification failed',
        }
      }

      const settleResult = await settleResponse.json()
      if (!settleResult.success) {
        return {
          isValid: false,
          reason: settleResult.reason || 'Settlement verification failed',
        }
      }
    } catch (error) {
      return {
        isValid: false,
        reason: error instanceof Error ? `Settlement failed: ${error.message}` : 'Settlement failed',
      }
    }

    return { isValid: true, signature }
  } catch (error) {
    return {
      isValid: false,
      reason: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function verifyCookieSignature(signature: string): Promise<boolean> {
  return await transactionStorage.has(signature)
}
