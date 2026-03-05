'use client'

import React from 'react'
import { PoolStats as PoolStatsType } from '@/hooks/useStakingProgram'

interface Props {
  stats: PoolStatsType | null
  loading: boolean
}

function StatSkeleton() {
  return (
    <div className="rounded-xl glass p-5">
      <div className="skeleton h-3 w-20 mb-3" />
      <div className="skeleton h-8 w-28 mb-2" />
      <div className="skeleton h-3 w-16" />
    </div>
  )
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(2) + 'K'
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function PoolStats({ stats, loading }: Props) {
  if (loading) {
    return (
      <section className="mb-8 animate-fade-in">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="rounded-2xl glass p-8">
              <div className="skeleton h-3 w-32 mb-4" />
              <div className="skeleton h-12 w-48 mb-2" />
              <div className="skeleton h-3 w-24" />
            </div>
          </div>
          <StatSkeleton />
          <StatSkeleton />
        </div>
      </section>
    )
  }

  return (
    <section className="mb-8 animate-slide-up">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* TVL Hero Card */}
        <div className="sm:col-span-2 lg:col-span-2">
          <div className="relative overflow-hidden rounded-2xl gradient-primary p-8 glow-primary">
            {/* Background decoration */}
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/5 blur-xl" />

            <div className="relative">
              <p className="text-sm font-medium text-white/70">Total Value Locked</p>
              <p className="mt-2 text-4xl font-bold tracking-tight text-white animate-count-up">
                {stats ? formatNumber(stats.totalStaked) : '0.00'}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
                    <path d="M8 1a.75.75 0 01.75.75v6.999l2.72-2.72a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 111.06-1.06l2.72 2.72V1.75A.75.75 0 018 1z" />
                  </svg>
                  tokens staked
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reward Pool */}
        <div className="rounded-xl glass p-5 transition-all duration-300 hover:glass-strong">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Reward Pool</p>
          <p className="mt-2 text-2xl font-bold text-foreground animate-count-up">
            {stats ? formatNumber(stats.rewardPool) : '—'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">tokens available</p>
        </div>

        {/* Reward Rate */}
        <div className="rounded-xl glass p-5 transition-all duration-300 hover:glass-strong">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Reward Rate</p>
          <p className="mt-2 text-2xl font-bold text-foreground animate-count-up">
            {stats ? stats.rewardRate.toLocaleString() : '—'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">tokens / second</p>
        </div>
      </div>

      {/* Admin info bar */}
      {stats && (
        <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl glass px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Admin</span>
            <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono text-foreground">
              {stats.admin.slice(0, 6)}...{stats.admin.slice(-4)}
            </code>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Mint</span>
            <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono text-foreground">
              {stats.mint.slice(0, 6)}...{stats.mint.slice(-4)}
            </code>
          </div>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="hidden items-center gap-2 sm:flex">
            <div className="h-2 w-2 rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">Pool Active</span>
          </div>
        </div>
      )}
    </section>
  )
}
