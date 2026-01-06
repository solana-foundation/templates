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

const MERCHANT_WALLET = process.env.NEXT_PUBLIC_MERCHANT_WALLET || '11111111111111111111111111111111'
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
const AMOUNT_DECIMALS = 1_000_000_000
const USDC_DECIMALS = 1_000_000

export type HeadlessPaymentStatus = 'idle' | 'generating' | 'pending' | 'verifying' | 'confirmed' | 'failed'

export interface HeadlessPaymentRequest {
  url: URL
  qr: string
  reference: string
  amount: number
  recipient: string
  splToken?: string
}

export interface HeadlessProduct {
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

/**
 * Headless checkout hook using @solana-commerce/headless with @solana/client.
 * Uses @solana/kit for key generation instead of @solana/web3.js.
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
  const [amount, setAmount] = useState<number>(0)
  const [status, setStatus] = useState<HeadlessPaymentStatus>('idle')
  const [paymentRequest, setPaymentRequest] = useState<HeadlessPaymentRequest | null>(null)
  const [signature, setSignature] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean
    signature?: string
    error?: string
  } | null>(null)

  const onPaymentFoundRef = useRef(onPaymentFound)
  const onPaymentVerifiedRef = useRef(onPaymentVerified)

  useEffect(() => {
    onPaymentFoundRef.current = onPaymentFound
    onPaymentVerifiedRef.current = onPaymentVerified
  }, [onPaymentFound, onPaymentVerified])

  /**
   * Creates a payment request for a single amount using createBuyNowRequest.
   */
  const createPayment = useCallback(
    async (paymentAmount: number, paymentLabel?: string, paymentMessage?: string, paymentMemo?: string) => {
      setStatus('generating')
      setError(null)

      try {
        const referenceKeyPair = await generateKeyPair()
        const referenceAddress = await getAddressFromPublicKey(referenceKeyPair.publicKey)

        const product = {
          id: 'product',
          name: paymentLabel || label,
          price: paymentAmount,
          currency: 'USDC',
        }

        const commerceRequest = createBuyNowRequest(MERCHANT_WALLET, product, {
          memo: paymentMemo || memo,
          label: paymentLabel || label,
          message: paymentMessage || message,
        })

        const { url, qr } = await createSolanaPayRequest(
          {
            recipient: address(MERCHANT_WALLET),
            amount: BigInt(Math.round(paymentAmount * AMOUNT_DECIMALS)),
            splToken: address(USDC_MINT),
            reference: referenceAddress,
            label: commerceRequest.label,
            message: commerceRequest.message,
            memo: commerceRequest.memo,
          },
          { size: qrSize, background: 'white', color: 'black' },
        )

        const request: HeadlessPaymentRequest = {
          url,
          qr,
          reference: referenceAddress,
          amount: paymentAmount,
          recipient: MERCHANT_WALLET,
          splToken: USDC_MINT,
        }

        setPaymentRequest(request)
        setStatus('pending')
        return request
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create payment')
        setError(error)
        setStatus('failed')
        throw error
      }
    },
    [label, message, memo, qrSize],
  )

  /**
   * Creates a payment request for cart items using createCartRequest.
   */
  const createCartPayment = useCallback(
    async (items: CartItem[], paymentLabel?: string, paymentMessage?: string, paymentMemo?: string) => {
      setStatus('generating')
      setError(null)

      try {
        const referenceKeyPair = await generateKeyPair()
        const referenceAddress = await getAddressFromPublicKey(referenceKeyPair.publicKey)

        const products: HeadlessProduct[] = items.map((item) => ({
          id: item.product.id,
          name: `${item.product.name} (${item.size}, ${item.color})`,
          price: item.price * item.quantity,
          quantity: item.quantity,
          currency: 'USDC',
        }))

        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

        const commerceRequest = createCartRequest(MERCHANT_WALLET, products, {
          currency: 'USDC',
          memo: paymentMemo || memo,
          label: paymentLabel || label,
          message: paymentMessage || message,
        })

        const { url, qr } = await createSolanaPayRequest(
          {
            recipient: address(MERCHANT_WALLET),
            amount: BigInt(Math.round(totalAmount * AMOUNT_DECIMALS)),
            splToken: address(USDC_MINT),
            reference: referenceAddress,
            label: commerceRequest.label,
            message: commerceRequest.message,
            memo: commerceRequest.memo,
          },
          { size: qrSize, background: 'white', color: 'black' },
        )

        const request: HeadlessPaymentRequest = {
          url,
          qr,
          reference: referenceAddress,
          amount: totalAmount,
          recipient: MERCHANT_WALLET,
          splToken: USDC_MINT,
        }

        setPaymentRequest(request)
        setAmount(totalAmount)
        setStatus('pending')
        return request
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create cart payment')
        setError(error)
        setStatus('failed')
        throw error
      }
    },
    [label, message, memo, qrSize],
  )

  useEffect(() => {
    const reference = paymentRequest?.reference
    const shouldPoll = isOpen && !!paymentRequest && !!client && status === 'pending' && !signature

    if (!shouldPoll || !reference) return

    let cancelled = false

    const pollForPayment = async () => {
      const referenceAddr = address(reference)

      while (!cancelled) {
        try {
          const signatures = await client.runtime.rpc.getSignaturesForAddress(referenceAddr, { limit: 1 }).send()

          if (!signatures?.length) {
            if (!cancelled) await new Promise((resolve) => setTimeout(resolve, 2000))
            continue
          }

          if (cancelled) return

          const sig = signatures[signatures.length - 1].signature
          setSignature(sig)
          onPaymentFoundRef.current?.(sig)
          setStatus('verifying')

          try {
            const result = await verifyPayment(
              client.runtime.rpc as unknown as Parameters<typeof verifyPayment>[0],
              sig,
              Math.round(paymentRequest!.amount * USDC_DECIMALS),
              MERCHANT_WALLET,
              USDC_MINT,
            )

            setVerificationResult(result)
            setStatus(result.verified ? 'confirmed' : 'failed')
            onPaymentVerifiedRef.current?.(result)
          } catch (verifyError) {
            console.error('Verification error:', verifyError)
            setVerificationResult({
              verified: false,
              signature: sig,
              error: verifyError instanceof Error ? verifyError.message : 'Verification failed',
            })
            setStatus('failed')
          }

          return
        } catch (error) {
          if ((error as Error)?.message?.includes('not found')) {
            if (!cancelled) await new Promise((resolve) => setTimeout(resolve, 2000))
            continue
          }
          console.error('Error polling for payment:', error)
          return
        }
      }
    }

    pollForPayment()
    return () => {
      cancelled = true
    }
  }, [isOpen, paymentRequest, signature, client, status])

  const openCheckout = useCallback(
    async (checkoutAmount: number) => {
      setAmount(checkoutAmount)
      setIsOpen(true)
      await createPayment(checkoutAmount, label, message, memo)
    },
    [createPayment, label, message, memo],
  )

  /**
   * Opens checkout with cart items.
   */
  const openCartCheckout = useCallback(
    async (items: CartItem[], checkoutMemo?: string) => {
      setIsOpen(true)
      await createCartPayment(items, label, message, checkoutMemo || memo)
    },
    [createCartPayment, label, message, memo],
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

  const reset = useCallback(() => {
    setPaymentRequest(null)
    setSignature(null)
    setError(null)
    setStatus('idle')
    setVerificationResult(null)
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
    createPayment,
    createCartPayment,
    reset,
  }
}
