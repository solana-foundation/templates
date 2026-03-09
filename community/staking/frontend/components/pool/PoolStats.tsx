"use client";

import { PoolState, shortAddress } from "../../lib/types";

interface PoolStatsProps {
  poolState: PoolState | null;
  loading?: boolean;
  vaultBalance?: number;
}

function StatCard({
  label,
  value,
  sub,
  icon,
  accent
}: {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  accent?: string;
}) {
  return (
    <div className="glass-card p-4 flex items-start gap-3 hover:scale-[1.01] transition-transform">
      <div className="text-2xl mt-0.5">{icon}</div>
      <div className="min-w-0">
        <div className="text-xs text-slate-600 mb-0.5">{label}</div>
        <div className={`text-lg font-bold tabular-nums truncate ${accent ?? "text-slate-950"}`}>
          {value}
        </div>
        {sub && <div className="text-xs text-slate-600 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass-card p-4 animate-pulse space-y-2">
      <div className="h-3 rounded bg-slate-200 w-1/2" />
      <div className="h-5 rounded bg-slate-200 w-3/4" />
    </div>
  );
}

export function PoolStats({ poolState, loading, vaultBalance }: PoolStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!poolState) {
    return (
      <div className="glass-card p-4 text-center text-sm text-slate-700">
        Pool not initialized yet.
      </div>
    );
  }

  const totalStaked = poolState.totalStaked.toNumber();
  const rewardRate = poolState.rewardRate.toNumber();
  const dailyRate = rewardRate * 86_400;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard
        icon="🔒"
        label="Total Staked"
        value={`${totalStaked.toLocaleString()} SOL`}
        accent="text-emerald-400"
      />
      <StatCard
        icon="⚡"
        label="Reward Rate"
        value={`${rewardRate.toLocaleString()} pts/s`}
        sub={`~${dailyRate.toLocaleString()} pts/day`}
        accent="text-sky-400"
      />
      <StatCard
        icon="🏦"
        label="Vault Balance"
        value={vaultBalance != null ? `${vaultBalance.toLocaleString()} tokens` : "—"}
        accent="text-violet-400"
      />
      <StatCard
        icon="🎯"
        label="Reward Mint"
        value={shortAddress(poolState.rewardMint)}
        sub={poolState.isPaused ? "⚠️ Paused" : "● Active"}
        accent="text-amber-400"
      />
    </div>
  );
}
