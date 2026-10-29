'use client'

import { useCallback, useState, useEffect, useRef } from 'react'
import { useClient } from '@solana/react'
import type { AppClient } from '@/lib/solana-client'
import { usdcMinorUnits, verifyUsdcPayment } from '@/lib/verify-payment'
import { address, getAddressFromPublicKey, generateKeyPair } from '@solana/kit'
import { createBuyNowRequest, createCartRequest, createSolanaPayRequest } from '@solana-commerce/headless'
import type { CartItem } from '@/store/types/cart'

export const USDC_MINT_MAINNET = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
export const USDC_MINT_DEVNET = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
export const USDC_MINT = process.env.NEXT_PUBLIC_USDC_MINT || USDC_MINT_MAINNET

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
const POLLING_INTERVAL_MS = 2000

export type HeadlessPaymentStatus =
  'idle' | 'generating' | 'pending' | 'verifying' | 'unavailable' | 'confirmed' | 'failed'

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
      amount: usdcMinorUnits(totalAmount) * 1_000n,
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

  const client = useClient<AppClient>()

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
  const generation = useRef(0)
  useEffect(
    () => () => {
      generation.current++
    },
    [],
  )
  useEffect(() => {
    callbacksRef.current = { onPaymentFound, onPaymentVerified }
  }, [onPaymentFound, onPaymentVerified])

  const createPaymentForProducts = useCallback(
    async (products: Product[], totalAmount: number, paymentMemo?: string) => {
      const currentGeneration = ++generation.current
      setStatus('generating')
      setError(null)
      setPaymentRequest(null)
      setSignature(null)
      setVerificationResult(null)

      try {
        const reference = await generatePaymentReference()
        const request = await createPaymentRequest(products, totalAmount, reference, {
          label,
          message,
          memo: paymentMemo || memo,
          qrSize,
        })

        if (currentGeneration !== generation.current) return
        setPaymentRequest(request)
        setAmount(totalAmount)
        setStatus('pending')
        return request
      } catch (err) {
        if (currentGeneration !== generation.current) return
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
    const shouldPoll = isOpen && paymentRequest

    if (!shouldPoll || !reference) return

    let cancelled = false
    let failures = 0

    const poll = async () => {
      const referenceAddr = address(reference)

      while (!cancelled) {
        try {
          const results = await client.rpc
            .getSignaturesForAddress(referenceAddr, { limit: 10, commitment: 'confirmed' })
            .send()

          if (cancelled) return
          setError(null)
          if (!results?.length) {
            failures = 0
            setStatus('pending')
            await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL_MS))
            continue
          }

          if (cancelled) return

          for (const candidate of results) {
            if (candidate.err) continue
            setStatus('verifying')
            const result = await verifyUsdcPayment(client.rpc, candidate.signature, {
              amount: usdcMinorUnits(paymentRequest.amount),
              recipient: paymentRequest.recipient,
              mint: paymentRequest.splToken!,
              reference,
            })
            if (cancelled) return
            if (!result.verified) continue
            const verified = { ...result, signature: candidate.signature }
            setSignature(candidate.signature)
            setVerificationResult(verified)
            setStatus('confirmed')
            callbacksRef.current.onPaymentFound?.(candidate.signature)
            callbacksRef.current.onPaymentVerified?.(verified)
            return
          }
          failures = 0
          setStatus('pending')
          await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL_MS))
        } catch (err) {
          if (cancelled) return
          setError(err instanceof Error ? err : new Error('Unable to verify payment'))
          setStatus('unavailable')
          failures++
          await new Promise((resolve) =>
            setTimeout(resolve, Math.min(30_000, POLLING_INTERVAL_MS * 2 ** Math.min(failures, 4))),
          )
        }
      }
    }

    poll()
    return () => {
      cancelled = true
    }
  }, [isOpen, paymentRequest, client])

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
    generation.current++
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
