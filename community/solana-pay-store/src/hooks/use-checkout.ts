'use client'

import { useCallback, useState, useEffect, useRef } from 'react'
import { Connection } from '@solana/web3.js'
import { findReference } from '@solana/pay'
import type { PaymentRequest } from '@/lib/solana-pay/types'
import { createPaymentRequest, generatePaymentQR } from '@/lib/solana-pay'
import { RPC_ENDPOINT } from '@/lib/solana-pay/constants'

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

  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState<number>(0)

  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null)
  const [qrCode, setQrCode] = useState<ReturnType<typeof generatePaymentQR> | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const [signature, setSignature] = useState<string | null>(null)
  const [paymentMemo, setPaymentMemo] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [connection] = useState(() => new Connection(RPC_ENDPOINT, 'confirmed'))

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
    const enabled = isOpen && !!paymentRequest

    if (!enabled || !reference || signature) {
      return
    }

    setIsSearching(true)
    let cancelled = false

    const searchForPayment = async () => {
      while (!cancelled) {
        try {
          const signatureInfo = await findReference(connection, reference, {
            finality: 'confirmed',
          })

          if (cancelled) return

          const sig = signatureInfo.signature
          const extractedMemo = signatureInfo.memo

          setSignature(sig)
          setPaymentMemo(extractedMemo)
          setIsSearching(false)

          onPaymentFoundRef.current?.(sig, extractedMemo || undefined)
          return
        } catch (error) {
          if ((error as Error)?.message?.includes('not found') || (error as Error).name === 'FindReferenceError') {
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
  }, [isOpen, paymentRequest, signature, connection])

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
