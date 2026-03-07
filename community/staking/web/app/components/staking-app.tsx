'use client'

/**
 * StakingApp — top-level client shell.
 *
 * Calls `useStaking()` once and threads pool / pdas / user / stakes
 * down to every child, avoiding duplicate RPC calls.
 */

import { useStaking } from '@/app/hooks/use-staking'
import { WalletConnectButton } from './wallet-button'
import { PoolStats } from './pool-stats'
import { InitializePool } from './initialize-pool'
import { UserDashboard } from './user-dashboard'

export function StakingApp() {
  const staking = useStaking()
  const { pool, pdas, refresh } = staking

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      {/* ── Header ────────────────────────────────────── */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-semibold tracking-tight">Staking Template</h1>
          <WalletConnectButton />
        </div>
      </header>

      {/* ── Main content ──────────────────────────────── */}
      <main className="mx-auto max-w-3xl space-y-8 px-6 py-10">
        {/* Show init form when pool doesn't exist yet */}
        {!pool && !staking.loading ? <InitializePool onInitialized={refresh} /> : <PoolStats pool={pool} pdas={pdas} />}

        <UserDashboard
          pool={staking.pool}
          user={staking.user}
          stakes={staking.stakes}
          refresh={staking.refresh}
          loading={staking.loading}
        />
      </main>
    </div>
  )
}
