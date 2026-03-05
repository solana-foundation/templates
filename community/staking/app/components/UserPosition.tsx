'use client'

import React from 'react'
import { UserPosition as UserPositionType } from '@/hooks/useStakingProgram'

interface Props {
  position: UserPositionType | null
  loading: boolean
  onClaim: () => void
  claiming: boolean
}

function formatToken(num: number): string {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })
}

export default function UserPosition({ position, loading, onClaim, claiming }: Props) {
  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="rounded-xl glass p-6">
          <div className="skeleton h-3 w-24 mb-3" />
          <div className="skeleton h-10 w-36 mb-2" />
          <div className="skeleton h-3 w-16" />
        </div>
        <div className="rounded-xl glass p-6">
          <div className="skeleton h-3 w-28 mb-3" />
          <div className="skeleton h-10 w-32 mb-2" />
          <div className="skeleton h-3 w-20" />
        </div>
        <div className="skeleton h-12 w-full rounded-xl" />
      </div>
    )
  }

  const stakedAmount = position?.stakedAmount ?? 0
  const rewardDebt = position?.rewardDebt ?? 0

  return (
    <div className="space-y-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
      {/* Staked Amount */}
      <div className="rounded-xl glass p-6 transition-all duration-300 hover:glass-strong">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Your Staked Amount</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-primary animate-count-up">
          {formatToken(stakedAmount)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">tokens locked</p>
      </div>

      {/* Rewards */}
      <div className="relative overflow-hidden rounded-xl glass p-6 transition-all duration-300 hover:glass-strong">
        {rewardDebt > 0 && <div className="absolute inset-0 glow-success opacity-30" />}
        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Rewards Claimed</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-success animate-count-up">
            {formatToken(rewardDebt)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">total claimed</p>
        </div>
      </div>

      {/* Claim Button */}
      <button
        className="group relative w-full overflow-hidden rounded-xl px-4 py-3.5 font-semibold text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={claiming || stakedAmount === 0}
        onClick={onClaim}
      >
        <div className="absolute inset-0 gradient-success transition-opacity group-hover:opacity-90" />
        <div className="relative flex items-center justify-center gap-2">
          {claiming ? (
            <>
              <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Claiming...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z"
                  clipRule="evenodd"
                />
              </svg>
              Claim Rewards
            </>
          )}
        </div>
      </button>
    </div>
  )
}
