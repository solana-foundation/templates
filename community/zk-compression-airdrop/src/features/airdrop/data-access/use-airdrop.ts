'use client'

import { useState, useCallback, useEffect, useRef, useSyncExternalStore } from 'react'
import { useConnectedWallet } from '@solana/kit-plugin-wallet/react'
import { useSolana } from '@/components/solana/solana-provider'
import { prepareAirdropBatch, validateAirdrop, calculateBatches } from './airdrop-utils'
import type { AirdropData, AirdropConfig } from './airdrop-types'

export function useAirdrop(config: AirdropConfig) {
  const { client, submissions, cluster } = useSolana()
  const key = JSON.stringify([config.network, config.mintAddress])
  const getSubmission = useCallback(() => submissions.get(key), [submissions, key])
  const submission = useSyncExternalStore(submissions.subscribe, getSubmission, getSubmission)
  const wallet = useConnectedWallet(client)
  const [isExecuting, setIsExecuting] = useState(false)
  const busy = useRef(false)
  const lifecycle = useRef<AbortController | null>(null)
  useEffect(() => {
    const controller = new AbortController()
    lifecycle.current = controller
    return () => controller.abort(new Error('Wallet or network changed, or view closed. Airdrop stopped.'))
  }, [client, wallet?.account.address, key])

  const executeAirdrop = useCallback(
    async (data: AirdropData, batchSize = 3) => {
      const controller = lifecycle.current
      if (busy.current || submissions.get(key).submitted || !controller || controller.signal.aborted) return
      busy.current = true
      setIsExecuting(true)
      submissions.update(key, (current) => ({ ...current, error: null }))
      const selected = client.wallet.getState().connected
      try {
        const prepared = validateAirdrop(config, data, batchSize)
        const totalBatches = calculateBatches(data.recipients.length, batchSize)
        submissions.update(key, (current) => ({
          ...current,
          cluster: cluster.id,
          progress: { currentBatch: 0, totalBatches, successfulMints: 0, failedMints: 0, signatures: [] },
        }))
        for (let start = 0; start < data.recipients.length; start += batchSize) {
          const instructions = await prepareAirdropBatch(client, config, prepared, start, batchSize, controller.signal)
          controller.signal.throwIfAborted()
          if (client.wallet.getState().connected !== selected) throw new Error('Wallet changed. Airdrop stopped.')
          submissions.update(key, (current) => ({ ...current, submitted: true }))
          const result = await client.sendTransaction(instructions, { abortSignal: controller.signal })
          const signature = result.context.signature
          submissions.update(key, (current) => ({
            ...current,
            progress: current.progress && {
              ...current.progress,
              currentBatch: current.progress.currentBatch + 1,
              successfulMints: current.progress.successfulMints + Math.min(batchSize, data.recipients.length - start),
              signatures: [...current.progress.signatures, signature],
            },
          }))
          controller.signal.throwIfAborted()
        }
      } catch (err) {
        submissions.update(key, (current) => ({
          ...current,
          error: `${err instanceof Error ? err.message : String(err)}${current.submitted ? ' Airdrop stopped. Check the wallet and on-chain results before restarting; submitted batches are not retried automatically.' : ''}`,
        }))
      } finally {
        busy.current = false
        setIsExecuting(false)
      }
    },
    [client, config, key, submissions, cluster.id],
  )

  return {
    executeAirdrop,
    progress: submission.progress,
    progressCluster: submission.cluster,
    isExecuting,
    requiresReview: submission.submitted,
    error: submission.error,
  }
}
