'use client'

/**
 * InitializePool — admin form to create the staking pool.
 *
 * Displayed when no StakeConfig account exists on-chain. Lets the
 * deployer set the three pool parameters (rewards rate, max stake,
 * freeze period) and submits an InitializePool instruction.
 */

import { useState } from 'react'
import { useWalletSession, useSendTransaction } from '@solana/react-hooks'
import { createWalletTransactionSigner } from '@solana/client'
import { getInitializePoolInstructionAsync } from '@/client/index'

interface Props {
  /** Called after successful initialization to refresh state. */
  onInitialized: () => Promise<void>
}

export function InitializePool({ onInitialized }: Props) {
  const session = useWalletSession()
  const { send, isSending, error, reset } = useSendTransaction()

  const [rewardsPerStake, setRewardsPerStake] = useState('1')
  const [maxStake, setMaxStake] = useState('1000000')
  const [freezePeriod, setFreezePeriod] = useState('0')

  async function handleInitialize() {
    if (!session) return
    reset()

    const { signer } = createWalletTransactionSigner(session)

    const ix = await getInitializePoolInstructionAsync({
      admin: signer,
      rewardsPerStake: Number(rewardsPerStake),
      maxStake: BigInt(maxStake),
      freezePeriod: BigInt(freezePeriod),
    })

    await send({
      instructions: [ix],
      feePayer: signer,
    })

    await onInitialized()
  }

  return (
    <section className="rounded border border-zinc-200 p-6 dark:border-zinc-800">
      <h2 className="text-lg font-semibold">Initialize Pool</h2>
      <p className="mt-1 text-sm text-zinc-500">No staking pool found on-chain. Configure and deploy one below.</p>

      {!session ? (
        <p className="mt-4 text-sm text-zinc-400">Connect your wallet to initialize.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {/* Rewards per stake */}
          <div>
            <label className="block text-sm font-medium">Rewards per Stake</label>
            <input
              type="number"
              min="1"
              value={rewardsPerStake}
              onChange={(e) => setRewardsPerStake(e.target.value)}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm
                dark:border-zinc-700 dark:bg-zinc-900"
            />
            <p className="mt-1 text-xs text-zinc-400">Reward tokens minted per stake action (u8).</p>
          </div>

          {/* Max stake */}
          <div>
            <label className="block text-sm font-medium">Max Stake (lamports)</label>
            <input
              type="text"
              inputMode="numeric"
              value={maxStake}
              onChange={(e) => setMaxStake(e.target.value)}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm
                dark:border-zinc-700 dark:bg-zinc-900"
            />
            <p className="mt-1 text-xs text-zinc-400">
              Maximum lamports a single user can stake in total (1 SOL = 1,000,000,000 lamports).
            </p>
          </div>

          {/* Freeze period */}
          <div>
            <label className="block text-sm font-medium">Freeze Period (seconds)</label>
            <input
              type="number"
              min="0"
              value={freezePeriod}
              onChange={(e) => setFreezePeriod(e.target.value)}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm
                dark:border-zinc-700 dark:bg-zinc-900"
            />
            <p className="mt-1 text-xs text-zinc-400">
              Seconds a stake must be locked before it can be unstaked. Use 0 for no lock.
            </p>
          </div>

          {/* Submit */}
          <button
            onClick={handleInitialize}
            disabled={isSending}
            className="w-full rounded bg-zinc-900 py-2 text-sm font-medium text-white
              transition-colors hover:bg-zinc-700 disabled:opacity-50
              dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {isSending ? 'Initializing…' : 'Initialize Pool'}
          </button>

          {error ? (
            <p className="text-xs text-red-600">{error instanceof Error ? error.message : 'Transaction failed'}</p>
          ) : null}
        </div>
      )}
    </section>
  )
}
