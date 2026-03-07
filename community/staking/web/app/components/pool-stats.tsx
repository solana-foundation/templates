'use client'

/**
 * PoolStats — read-only overview of the staking pool.
 *
 * Displays the global config values: rewards rate, max stake cap,
 * freeze period, and the vault's current SOL balance.
 */

import { useBalance } from '@solana/react-hooks'
import type { StakingState } from '@/app/hooks/use-staking'
import { lamportsToSol } from '@/app/lib/format'

type Props = Pick<StakingState, 'pool' | 'pdas'>

export function PoolStats({ pool, pdas }: Props) {
  // Watch vault balance in real-time
  const { lamports: vaultBalance } = useBalance(pdas?.vault ?? undefined, {
    watch: true,
  })

  if (!pool) {
    return (
      <section className="rounded border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-lg font-semibold">Pool Statistics</h2>
        <p className="mt-2 text-sm text-zinc-500">Pool not initialized yet.</p>
      </section>
    )
  }

  return (
    <section className="rounded border border-zinc-200 p-6 dark:border-zinc-800">
      <h2 className="text-lg font-semibold">Pool Statistics</h2>

      <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-zinc-500">Rewards per Stake</dt>
          <dd className="text-xl font-medium">{pool.rewardsPerStake}</dd>
        </div>

        <div>
          <dt className="text-zinc-500">Max Stake</dt>
          <dd className="text-xl font-medium">{lamportsToSol(pool.maxStake)} SOL</dd>
        </div>

        <div>
          <dt className="text-zinc-500">Freeze Period</dt>
          <dd className="text-xl font-medium">
            {pool.freezePeriod === 0n ? 'None' : `${pool.freezePeriod.toString()}s`}
          </dd>
        </div>

        <div>
          <dt className="text-zinc-500">Vault Balance</dt>
          <dd className="text-xl font-medium">{vaultBalance != null ? `${lamportsToSol(vaultBalance)} SOL` : '—'}</dd>
        </div>
      </dl>
    </section>
  )
}
