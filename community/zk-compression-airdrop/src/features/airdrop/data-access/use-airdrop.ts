'use client'

import { useState, useCallback } from 'react'
import { PublicKey, Keypair } from '@solana/web3.js'
import BN from 'bn.js'
import bs58 from 'bs58'
import { useWalletSession } from '@solana/react-hooks'
import { mintTo } from '@lightprotocol/compressed-token'
import { parseRecipients, calculateBatches, createRpcConnection } from './airdrop-utils'
import type { AirdropData, AirdropConfig, AirdropProgress } from './airdrop-types'

interface UseAirdropReturn {
  executeAirdrop: (config: AirdropConfig, airdropData: AirdropData, batchSize?: number) => Promise<void>
  progress: AirdropProgress | null
  isExecuting: boolean
  error: string | null
}

export function useAirdrop(): UseAirdropReturn {
  const wallet = useWalletSession()
  const account = wallet?.account
  const [progress, setProgress] = useState<AirdropProgress | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeAirdrop = useCallback(
    async (config: AirdropConfig, airdropData: AirdropData, batchSize: number = 10) => {
      if (!account) {
        setError('Wallet not connected')
        return
      }

      setIsExecuting(true)
      setError(null)

      try {
        const rpc = createRpcConnection(config.network)
        const mint = new PublicKey(config.mintAddress)
        const { recipients, amounts } = parseRecipients(airdropData)
        const totalBatches = calculateBatches(recipients.length, batchSize)

        const privateKeyString = process.env.DEV_WALLET
        if (!privateKeyString) {
          throw new Error('DEV_WALLET environment variable not set')
        }

        const secretKey = bs58.decode(privateKeyString)
        const authority = Keypair.fromSecretKey(secretKey)

        const initialProgress: AirdropProgress = {
          currentBatch: 0,
          totalBatches,
          successfulMints: 0,
          failedMints: 0,
          signatures: [],
        }

        setProgress(initialProgress)

        for (let i = 0; i < recipients.length; i += batchSize) {
          const batchRecipients = recipients.slice(i, i + batchSize)
          const batchAmounts = amounts.slice(i, i + batchSize).map((a) => new BN(a.toString()))
          const currentBatch = Math.floor(i / batchSize) + 1

          try {
            const signature = await mintTo(rpc, authority, mint, batchRecipients, authority, batchAmounts)

            setProgress((prev) => ({
              ...prev!,
              currentBatch,
              successfulMints: prev!.successfulMints + batchRecipients.length,
              signatures: [...prev!.signatures, signature],
            }))
          } catch (err) {
            console.error('Batch mint error:', err)
            setProgress((prev) => ({
              ...prev!,
              currentBatch,
              failedMints: prev!.failedMints + batchRecipients.length,
            }))
          }

          if (i + batchSize < recipients.length) {
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsExecuting(false)
      }
    },
    [account],
  )

  return {
    executeAirdrop,
    progress,
    isExecuting,
    error,
  }
}
