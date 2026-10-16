'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useClient } from '@solana/react'
import type { AppClient } from '@/lib/solana-client'
import type { HeadlessPaymentRequest } from './use-headless-checkout'
import { prepareWalletPayment } from '@/lib/prepare-wallet-payment'
import { paymentSendFailure } from '@/lib/payment-send-failure'
import { signature } from '@solana/kit'

export function useWalletPayment(request: HeadlessPaymentRequest | null, confirmed: boolean) {
  const client = useClient<AppClient>()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [uncertain, setUncertain] = useState<{ signature: string; lastValidBlockHeight: bigint } | null>(null)
  const locked = useRef(false)
  const current = useRef(request)
  const isConfirmed = useRef(confirmed)
  const [reference, setReference] = useState(request?.reference)
  if (reference !== request?.reference) {
    setReference(request?.reference)
    setError(null)
    setSubmitted(false)
    setUncertain(null)
  }
  useLayoutEffect(() => {
    current.current = request
    isConfirmed.current = confirmed
    return () => {
      current.current = null
    }
  }, [request, confirmed])

  useEffect(() => {
    if (!uncertain || !submitted || confirmed) return
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>
    const reconcile = async () => {
      try {
        const finalizedHeight = await client.rpc.getBlockHeight({ commitment: 'finalized' }).send()
        const { value } = await client.rpc
          .getSignatureStatuses([signature(uncertain.signature)], { searchTransactionHistory: true })
          .send()
        const status = value[0]
        const failed = status?.confirmationStatus === 'finalized' && status.err !== null
        const expired = !status && finalizedHeight > uncertain.lastValidBlockHeight
        if (cancelled) return
        if (failed || expired) {
          setSubmitted(false)
          setUncertain(null)
          setError(
            failed
              ? 'Payment transaction failed. You can try again.'
              : 'Payment expired without confirmation. You can try again.',
          )
          return
        }
      } catch {
        // An unavailable RPC cannot prove that another payment is safe.
      }
      if (!cancelled) timer = setTimeout(() => void reconcile(), 5000)
    }
    void reconcile()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [client, uncertain, submitted, confirmed])

  async function pay() {
    if (!request || confirmed || locked.current || submitted) return
    locked.current = true
    setBusy(true)
    setError(null)
    let dispatched = false
    try {
      const instructions = await prepareWalletPayment(client, request)
      if (current.current !== request || isConfirmed.current) throw new Error('Checkout changed or was already paid.')
      dispatched = true
      await client.sendTransaction(instructions)
      if (current.current === request) setSubmitted(true)
    } catch (e) {
      if (current.current === request) {
        const message = e instanceof Error ? e.message : String(e)
        const rejected = /user rejected|user denied|rejected by the wallet|request rejected/i.test(message)
        const failure = paymentSendFailure(e)
        const pending = dispatched && !rejected && !failure?.beforeSend
        setSubmitted(pending)
        if (pending && failure && !failure.beforeSend) setUncertain(failure)
        setError(
          pending
            ? 'Payment outcome is not yet known. Do not pay again; keep this checkout open while confirmation is checked.'
            : rejected
              ? 'Payment rejected. No payment was sent.'
              : message,
        )
      }
    } finally {
      locked.current = false
      setBusy(false)
    }
  }
  return { pay, busy, error, submitted }
}
