'use client'

import { useCallback, useState, useEffect, useRef } from 'react'
import { useSolanaClient } from '@solana/react-hooks'
import { address, getAddressFromPublicKey, generateKeyPair } from '@solana/kit'
import {
  createBuyNowRequest,
  createCartRequest,
  createSolanaPayRequest,
  verifyPayment,
} from '@solana-commerce/headless'
import type { CartItem } from '@/store/types/cart'

export const USDC_MINT_MAINNET = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
export const USDC_MINT_DEVNET = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
const USDC_MINT = process.env.NEXT_PUBLIC_USDC_MINT || USDC_MINT_MAINNET

function getMerchantWallet(): string {
  const wallet = process.env.NEXT_PUBLIC_MERCHANT_WALLET
  if (!wallet) {
    throw new Error(
      'NEXT_PUBLIC_MERCHANT_WALLET environment variable is required. ' +
        'Please set it to your Solana wallet address to receive payments.',
    )
  }
  return wallet
}

/**
 * Commerce Kit's createSolanaPayRequest expects amounts in 9 decimals (like SOL lamports),
 * but USDC only has 6 decimals. The library internally divides by 10^9 when encoding the URL,
 * so we multiply by 10^9 here to get the correct final amount.
 */
const SOLANA_PAY_AMOUNT_MULTIPLIER = 1_000_000_000
const USDC_MINOR_UNITS = 1_000_000
const POLLING_INTERVAL_MS = 2000

export type HeadlessPaymentStatus = 'idle' | 'generating' | 'pending' | 'verifying' | 'confirmed' | 'failed'

export interface HeadlessPaymentRequest {
  url: URL
  qr: string
  reference: string
  amount: number
  recipient: string
  splToken?: string
}

interface Product {
  id: string
  name: string
  price: number
  quantity?: number
  currency?: string
}

interface UseHeadlessCheckoutOptions {
  label?: string
  message?: string
  memo?: string
  qrSize?: number
  onPaymentFound?: (signature: string) => void
  onPaymentVerified?: (result: { verified: boolean; signature?: string; error?: string }) => void
}

async function generatePaymentReference() {
  const keyPair = await generateKeyPair()
  return getAddressFromPublicKey(keyPair.publicKey)
}

async function createPaymentRequest(
  products: Product[],
  totalAmount: number,
  reference: string,
  options: { label: string; message: string; memo?: string; qrSize: number },
) {
  const merchantWallet = getMerchantWallet()
  const isCart = products.length > 1

  const commerceRequest = isCart
    ? createCartRequest(merchantWallet, products, {
        currency: 'USDC',
        memo: options.memo,
        label: options.label,
        message: options.message,
      })
    : createBuyNowRequest(merchantWallet, products[0], {
        memo: options.memo,
        label: options.label,
        message: options.message,
      })

  const { url, qr } = await createSolanaPayRequest(
    {
      recipient: address(merchantWallet),
      amount: BigInt(Math.round(totalAmount * SOLANA_PAY_AMOUNT_MULTIPLIER)),
      splToken: address(USDC_MINT),
      reference: address(reference),
      label: commerceRequest.label,
      message: commerceRequest.message,
      memo: commerceRequest.memo,
    },
    { size: options.qrSize, background: 'white', color: 'black' },
  )

  return {
    url,
    qr,
    reference,
    amount: totalAmount,
    recipient: merchantWallet,
    splToken: USDC_MINT,
  }
}

function cartItemsToProducts(items: CartItem[]): Product[] {
  return items.map((item) => ({
    id: item.product.id,
    name: `${item.product.name} (${item.size}, ${item.color})`,
    price: item.price * item.quantity,
    quantity: item.quantity,
    currency: 'USDC',
  }))
}

function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

/**
 * React hook for headless Solana payments using Commerce Kit.
 *
 * Manages the complete payment flow:
 * 1. Generates a Solana Pay QR code with a unique reference
 * 2. Polls the blockchain for transactions to that reference
 * 3. Verifies the payment amount and recipient on-chain
 *
 * @example
 * ```tsx
 * const checkout = useHeadlessCheckout({
 *   label: 'My Store',
 *   onPaymentVerified: (result) => {
 *     if (result.verified) clearCart()
 *   }
 * })
 *
 * checkout.openCheckout(9.99)
 * checkout.openCartCheckout(cartItems, 'Order #123')
 * ```
 */
export function useHeadlessCheckout(options: UseHeadlessCheckoutOptions = {}) {
  const {
    label = 'Solana Commerce Kit',
    message = 'Thanks for your purchase!',
    memo,
    qrSize = typeof window !== 'undefined' && window.innerWidth < 640 ? 280 : 400,
    onPaymentFound,
    onPaymentVerified,
  } = options

  const client = useSolanaClient()

  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState(0)
  const [status, setStatus] = useState<HeadlessPaymentStatus>('idle')
  const [paymentRequest, setPaymentRequest] = useState<HeadlessPaymentRequest | null>(null)
  const [signature, setSignature] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean
    signature?: string
    error?: string
  } | null>(null)

  const callbacksRef = useRef({ onPaymentFound, onPaymentVerified })
  useEffect(() => {
    callbacksRef.current = { onPaymentFound, onPaymentVerified }
  }, [onPaymentFound, onPaymentVerified])

  const createPaymentForProducts = useCallback(
    async (products: Product[], totalAmount: number, paymentMemo?: string) => {
      setStatus('generating')
      setError(null)

      try {
        const reference = await generatePaymentReference()
        const request = await createPaymentRequest(products, totalAmount, reference, {
          label,
          message,
          memo: paymentMemo || memo,
          qrSize,
        })

        setPaymentRequest(request)
        setAmount(totalAmount)
        setStatus('pending')
        return request
      } catch (err) {
        const paymentError = err instanceof Error ? err : new Error('Failed to create payment')
        setError(paymentError)
        setStatus('failed')
        throw paymentError
      }
    },
    [label, message, memo, qrSize],
  )

  useEffect(() => {
    const reference = paymentRequest?.reference
    const shouldPoll = isOpen && paymentRequest && client && status === 'pending' && !signature

    if (!shouldPoll || !reference) return

    let cancelled = false

    const poll = async () => {
      const referenceAddr = address(reference)

      while (!cancelled) {
        try {
          const results = await client.runtime.rpc.getSignaturesForAddress(referenceAddr, { limit: 1 }).send()

          if (!results?.length) {
            await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL_MS))
            continue
          }

          if (cancelled) return

          const foundSignature = results[results.length - 1].signature
          setSignature(foundSignature)
          callbacksRef.current.onPaymentFound?.(foundSignature)
          setStatus('verifying')

          // Type cast needed: @solana/client omits `rentEpoch` from account types,
          // while Commerce Kit (gill) expects it. They're runtime compatible.
          const result = await verifyPayment(
            client.runtime.rpc as unknown as Parameters<typeof verifyPayment>[0],
            foundSignature,
            Math.round(paymentRequest!.amount * USDC_MINOR_UNITS),
            getMerchantWallet(),
            USDC_MINT,
          )

          setVerificationResult(result)
          setStatus(result.verified ? 'confirmed' : 'failed')
          callbacksRef.current.onPaymentVerified?.(result)
          return
        } catch (err) {
          const isNotFound = (err as Error)?.message?.includes('not found')
          if (isNotFound && !cancelled) {
            await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL_MS))
            continue
          }
          if (!isNotFound) console.error('Payment polling error:', err)
          return
        }
      }
    }

    poll()
    return () => {
      cancelled = true
    }
  }, [isOpen, paymentRequest, signature, client, status])

  const openCheckout = useCallback(
    async (checkoutAmount: number) => {
      setIsOpen(true)
      const product: Product = { id: 'product', name: label, price: checkoutAmount, currency: 'USDC' }
      await createPaymentForProducts([product], checkoutAmount)
    },
    [createPaymentForProducts, label],
  )

  const openCartCheckout = useCallback(
    async (items: CartItem[], checkoutMemo?: string) => {
      setIsOpen(true)
      const products = cartItemsToProducts(items)
      const total = calculateCartTotal(items)
      await createPaymentForProducts(products, total, checkoutMemo)
    },
    [createPaymentForProducts],
  )

  const closeCheckout = useCallback(() => {
    setIsOpen(false)
    setPaymentRequest(null)
    setSignature(null)
    setError(null)
    setStatus('idle')
    setVerificationResult(null)
    setAmount(0)
  }, [])

  return {
    isOpen,
    amount,
    status,
    paymentRequest,
    signature,
    error,
    verificationResult,
    isGenerating: status === 'generating',
    isPending: status === 'pending',
    isVerifying: status === 'verifying',
    isConfirmed: status === 'confirmed',
    isFailed: status === 'failed',
    paymentFound: !!signature,
    openCheckout,
    openCartCheckout,
    closeCheckout,
  }
}
