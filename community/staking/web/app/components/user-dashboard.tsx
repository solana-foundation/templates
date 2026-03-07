'use client'

/**
 * UserDashboard — top-level panel for a connected wallet.
 *
 * Composes:
 *  - StakeForm   — create a new stake
 *  - UnstakeCard — one card per active stake
 *  - RewardsPanel — accumulated / claimable rewards
 *
 * Uses the `useStaking()` hook to fetch all on-chain state in one pass.
 */

import { useStaking } from '@/app/hooks/use-staking'
import { useWallet } from '@solana/react-hooks'
import { lamportsToSol } from '@/app/lib/format'
import { StakeForm } from './stake-form'
import { UnstakeCard } from './unstake-card'
import { RewardsPanel } from './rewards-panel'

export function UserDashboard() {
  const wallet = useWallet()
  const { pool, user, stakes, refresh, loading } = useStaking()

  /* ── Not connected ─────────────────────────────────── */
  if (wallet.status !== 'connected') {
    return (
      <section className="rounded border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
        <p className="text-sm text-zinc-500">Connect your wallet to view your staking dashboard.</p>
      </section>
    )
  }

  /* ── Loading state ─────────────────────────────────── */
  if (loading) {
    return <section className="py-8 text-center text-sm text-zinc-500">Loading on-chain data…</section>
  }

  const freezePeriod = pool?.freezePeriod ?? 0n

  return (
    <div className="space-y-6">
      {/* ── Summary strip ─────────────────────────────── */}
      {user && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Stat label="Total Staked" value={`${lamportsToSol(user.amountStaked)} SOL`} />
          <Stat label="Active Stakes" value={String(stakes.length)} />
          <Stat
            label="Claimable Rewards"
            value={`${lamportsToSol(
              user.accumulatedRewards > user.claimedRewards ? user.accumulatedRewards - user.claimedRewards : 0n,
            )} SOL`}
          />
        </div>
      )}

      {/* ── Stake form ────────────────────────────────── */}
      <StakeForm pool={pool} user={user} refresh={refresh} />

      {/* ── Active stakes ─────────────────────────────── */}
      {stakes.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Active Stakes</h2>
          <div className="space-y-3">
            {stakes.map((s) => (
              <UnstakeCard key={s.id} stake={s} freezePeriod={freezePeriod} onUnstaked={refresh} />
            ))}
          </div>
        </section>
      )}

      {/* ── Rewards ───────────────────────────────────── */}
      <RewardsPanel user={user} refresh={refresh} />
    </div>
  )
}

/* ─── tiny helper ──────────────────────────────────────── */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-zinc-200 p-4 dark:border-zinc-800">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold">{value}</p>
    </div>
  )
}
