'use client'

import { useCallback } from 'react'
import { useAction } from '@solana/react'
import { toast } from 'sonner'
import { toastTx } from '@/components/toast-tx'
import { parseTransactionError } from '@/lib/errors'

/**
 * Runs a transaction-producing action, toasting an explorer link on success and the
 * failure reason on error. Dispatching again aborts any call still in flight.
 *
 * `run` never rejects — a superseded or aborted call resolves to `undefined` — so it is
 * safe to call without awaiting from an event handler.
 */
export function useSend() {
  const { dispatchAsync, isRunning } = useAction(
    async (_signal: AbortSignal, action: () => Promise<string | undefined>, successMessage: string) => {
      try {
        const signature = await action()
        toastTx(signature, successMessage)
        return signature
      } catch (error) {
        console.error(error)
        toast.error(parseTransactionError(error))
        return undefined
      }
    },
  )

  const run = useCallback(
    (action: () => Promise<string | undefined>, successMessage: string) =>
      dispatchAsync(action, successMessage).catch(() => undefined),
    [dispatchAsync],
  )

  return { run, isSending: isRunning }
}
