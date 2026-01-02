import { encodeURL, createQR } from '@solana/pay'
import { Keypair } from '@solana/web3.js'
import BigNumber from 'bignumber.js'
import type { PaymentRequest } from './types'
import { MERCHANT_WALLET, USDC_MINT } from './constants'

/**
 * Creates a Solana Pay transfer request with a unique reference.
 * Uses the Transfer Request pattern for simple, direct token transfers.
 *
 * @param amount - Payment amount in USDC
 * @param label - Merchant label for the payment
 * @param message - Message to display to the customer
 * @param memo - Optional on-chain memo
 * @returns Payment request object with URL and reference
 */
export function createPaymentRequest(
  amount: number,
  label: string = 'Solana Pay Store',
  message: string = 'Thanks for your purchase!',
  memo?: string,
): PaymentRequest {
  const reference = Keypair.generate().publicKey
  const amountBigNumber = new BigNumber(amount)

  const url = encodeURL({
    recipient: MERCHANT_WALLET,
    amount: amountBigNumber,
    splToken: USDC_MINT,
    reference,
    label,
    message,
    memo,
  })

  return {
    url,
    reference,
    amount: amountBigNumber,
    recipient: MERCHANT_WALLET,
    splToken: USDC_MINT,
    memo,
  }
}

/**
 * Generates a QR code from a Solana Pay URL.
 *
 * @param url - The Solana Pay URL to encode
 * @param size - QR code size in pixels
 * @param background - Background color
 * @param color - Foreground color
 * @returns QR code instance
 */
export function generatePaymentQR(
  url: URL | string,
  size: number = 400,
  background: string = 'white',
  color: string = 'black',
) {
  return createQR(url, size, background, color)
}
