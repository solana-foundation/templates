'use client'

import { useCallback, useState, useEffect, useRef } from 'react'
import { useSolanaClient } from '@solana/react-hooks'
import { toAddress } from '@solana/client'
import type { PaymentRequest } from '@/lib/solana-pay/types'
import { createPaymentRequest, generatePaymentQR } from '@/lib/solana-pay'

interface UseCheckoutOptions {
  label?: string
  message?: string
  memo?: string
  qrSize?: number
  onPaymentFound?: (signature: string, memo?: string) => void
}

/**
 * Manages the complete Solana Pay checkout flow including payment creation and monitoring.
 */
export function useCheckout(options: UseCheckoutOptions = {}) {
  const {
    label = 'Solana Pay Store',
    message = 'Thanks for your purchase!',
    memo,
    qrSize = typeof window !== 'undefined' && window.innerWidth < 640 ? 280 : 400,
    onPaymentFound,
  } = options

  const client = useSolanaClient()
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState<number>(0)

  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null)
  const [qrCode, setQrCode] = useState<ReturnType<typeof generatePaymentQR> | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const [signature, setSignature] = useState<string | null>(null)
  const [paymentMemo, setPaymentMemo] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const onPaymentFoundRef = useRef(onPaymentFound)

  useEffect(() => {
    onPaymentFoundRef.current = onPaymentFound
  }, [onPaymentFound])

  const createPayment = useCallback(
    (
      paymentAmount: number,
      paymentLabel?: string,
      paymentMessage?: string,
      paymentMemo?: string,
      paymentQrSize?: number,
    ) => {
      setIsGenerating(true)
      setError(null)

      try {
        const request = createPaymentRequest(paymentAmount, paymentLabel, paymentMessage, paymentMemo)
        const qr = generatePaymentQR(request.url, paymentQrSize)

        setPaymentRequest(request)
        setQrCode(qr)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to create payment'))
        setPaymentRequest(null)
        setQrCode(null)
      } finally {
        setIsGenerating(false)
      }
    },
    [],
  )

  const resetPayment = useCallback(() => {
    setPaymentRequest(null)
    setQrCode(null)
    setError(null)
    setIsGenerating(false)
    setSignature(null)
    setPaymentMemo(null)
    setIsSearching(false)
  }, [])

  useEffect(() => {
    const reference = paymentRequest?.reference
    const enabled = isOpen && !!paymentRequest && !!client

    if (!enabled || !reference || signature) {
      return
    }

    setIsSearching(true)
    let cancelled = false

    const searchForPayment = async () => {
      // Convert PublicKey to Address for @solana/client
      const referenceAddress = toAddress(reference.toBase58())

      while (!cancelled) {
        try {
          // Re-implement findReference logic using @solana/client
          const signatures = await client.runtime.rpc.getSignaturesForAddress(referenceAddress, { limit: 1 }).send()

          if (!signatures || signatures.length === 0) {
            if (!cancelled) {
              await new Promise((resolve) => setTimeout(resolve, 2000))
            }
            continue
          }

          if (cancelled) return

          // Get the oldest signature (last in array)
          const oldest = signatures[signatures.length - 1]
          const sig = oldest.signature
          const extractedMemo = oldest.memo || null

          setSignature(sig)
          setPaymentMemo(extractedMemo)
          setIsSearching(false)

          onPaymentFoundRef.current?.(sig, extractedMemo || undefined)
          return
        } catch (error) {
          if ((error as Error)?.message?.includes('not found')) {
            if (!cancelled) {
              await new Promise((resolve) => setTimeout(resolve, 2000))
            }
            continue
          }

          console.error('Error searching for payment:', error)
          setIsSearching(false)
          return
        }
      }
    }

    searchForPayment()

    return () => {
      cancelled = true
    }
  }, [isOpen, paymentRequest, signature, client])

  const openCheckout = useCallback(
    (checkoutAmount: number) => {
      setAmount(checkoutAmount)
      setIsOpen(true)
      createPayment(checkoutAmount, label, message, memo, qrSize)
    },
    [createPayment, label, message, memo, qrSize],
  )

  const closeCheckout = useCallback(() => {
    setIsOpen(false)
    resetPayment()
  }, [resetPayment])

  return {
    isOpen,
    amount,
    paymentRequest,
    qrCode,
    signature,
    memo: paymentMemo,
    isSearching,
    paymentFound: !!signature,
    error,
    isGenerating,
    openCheckout,
    closeCheckout,
  }
}
