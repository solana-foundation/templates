'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useConnectedWallet } from '@solana/kit-plugin-wallet/react'
import { useSolana } from '@/components/solana/solana-provider'
import { prepareAirdropBatch, validateAirdrop, calculateBatches } from './airdrop-utils'
import type { AirdropData, AirdropConfig, AirdropProgress } from './airdrop-types'

export function useAirdrop() {
  const { client } = useSolana()
  const wallet = useConnectedWallet(client)
  const [progress, setProgress] = useState<AirdropProgress | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [requiresReview, setRequiresReview] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const busy = useRef(false)
  const submitted = useRef(false)
  const lifecycle = useRef<AbortController | null>(null)
  useEffect(() => {
    const controller = new AbortController()
    lifecycle.current = controller
    return () => controller.abort()
  }, [client, wallet?.account.address])

  const executeAirdrop = useCallback(
    async (config: AirdropConfig, data: AirdropData, batchSize = 3) => {
      const controller = lifecycle.current
      if (busy.current || submitted.current || !controller || controller.signal.aborted) return
      busy.current = true
      setIsExecuting(true)
      setError(null)
      const selected = client.wallet.getState().connected
      try {
        validateAirdrop(config, data, batchSize)
        const totalBatches = calculateBatches(data.recipients.length, batchSize)
        setProgress({ currentBatch: 0, totalBatches, successfulMints: 0, failedMints: 0, signatures: [] })
        for (let start = 0; start < data.recipients.length; start += batchSize) {
          const instructions = await prepareAirdropBatch(client, config, data, start, batchSize, controller.signal)
          controller.signal.throwIfAborted()
          if (client.wallet.getState().connected !== selected) throw new Error('Wallet changed. Airdrop stopped.')
          submitted.current = true
          setRequiresReview(true)
          const result = await client.sendTransaction(instructions, { abortSignal: controller.signal })
          const signature = result.context.signature
          setProgress(
            (prev) =>
              prev && {
                ...prev,
                currentBatch: prev.currentBatch + 1,
                successfulMints: prev.successfulMints + Math.min(batchSize, data.recipients.length - start),
                signatures: [...prev.signatures, signature],
              },
          )
          controller.signal.throwIfAborted()
        }
      } catch (err) {
        setError(
          `${err instanceof Error ? err.message : String(err)}${submitted.current ? ' Airdrop stopped. Check the wallet and on-chain results before restarting; submitted batches are not retried automatically.' : ''}`,
        )
      } finally {
        busy.current = false
        setIsExecuting(false)
      }
    },
    [client],
  )

  return { executeAirdrop, progress, isExecuting, requiresReview, error }
}
