'use client'

import React, { useState } from 'react'

interface Props {
  onStake: (amount: number) => void
  onUnstake: (amount: number) => void
  onFaucet: () => void
  staking: boolean
  unstaking: boolean
  requesting: boolean
  userBalance?: number
  stakedAmount?: number
}

export default function StakeForm({
  onStake,
  onUnstake,
  onFaucet,
  staking,
  unstaking,
  requesting,
  userBalance = 0,
  stakedAmount = 0,
}: Props) {
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake'>('stake')
  const [amount, setAmount] = useState('')

  const isStaking = activeTab === 'stake'
  const maxAmount = isStaking ? userBalance : stakedAmount
  const isProcessing = isStaking ? staking : unstaking

  const handleSubmit = () => {
    const numAmount = parseFloat(amount)
    if (!numAmount || numAmount <= 0) return

    if (isStaking) {
      onStake(numAmount)
    } else {
      onUnstake(numAmount)
    }
    setAmount('')
  }

  const handleMax = () => {
    if (maxAmount > 0) {
      setAmount(maxAmount.toString())
    }
  }

  const handleTabSwitch = (tab: 'stake' | 'unstake') => {
    setActiveTab(tab)
    setAmount('')
  }

  return (
    <div className="rounded-xl glass overflow-hidden animate-slide-up" style={{ animationDelay: '200ms' }}>
      {/* Tab Header */}
      <div className="flex border-b border-border">
        <button
          onClick={() => handleTabSwitch('stake')}
          className={`relative flex-1 px-4 py-3.5 text-sm font-semibold transition-colors ${
            isStaking ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Stake
          {isStaking && <div className="absolute bottom-0 left-0 right-0 h-0.5 gradient-primary" />}
        </button>
        <button
          onClick={() => handleTabSwitch('unstake')}
          className={`relative flex-1 px-4 py-3.5 text-sm font-semibold transition-colors ${
            !isStaking ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Unstake
          {!isStaking && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-destructive" />}
        </button>
      </div>

      {/* Form Body */}
      <div className="p-5">
        {/* Amount label + balance */}
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground">Amount</label>
          {maxAmount > 0 && (
            <span className="text-xs text-muted-foreground">
              {isStaking ? 'Balance' : 'Staked'}:{' '}
              <span className="font-mono text-foreground">
                {maxAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </span>
          )}
        </div>

        {/* Input with MAX */}
        <div className="relative mb-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="any"
            className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3.5 pr-20 font-mono text-lg text-foreground placeholder:text-muted-foreground/40 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={handleMax}
            disabled={maxAmount <= 0}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/20 disabled:opacity-30"
          >
            MAX
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isProcessing || !amount || parseFloat(amount) <= 0}
          className={`group relative w-full overflow-hidden rounded-xl px-4 py-3.5 font-semibold text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
            isStaking ? '' : ''
          }`}
        >
          <div
            className={`absolute inset-0 transition-opacity group-hover:opacity-90 ${
              isStaking ? 'gradient-primary' : 'bg-destructive'
            }`}
          />
          <div className="relative flex items-center justify-center gap-2">
            {isProcessing ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </>
            ) : (
              <>
                {isStaking ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path
                      fillRule="evenodd"
                      d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path
                      fillRule="evenodd"
                      d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {isStaking ? 'Stake Tokens' : 'Unstake Tokens'}
              </>
            )}
          </div>
        </button>

        {/* Info text */}
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {isStaking ? 'Tokens will be transferred to the staking vault' : 'Tokens will be returned to your wallet'}
        </p>

        {/* Devnet Faucet */}
        {isStaking && userBalance === 0 && (
          <div className="mt-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-center">
            <p className="text-xs text-muted-foreground mb-2">No tokens yet? Get free test tokens on devnet</p>
            <button
              onClick={onFaucet}
              disabled={requesting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary/15 px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/25 disabled:opacity-40"
            >
              {requesting ? (
                <>
                  <svg
                    className="h-3.5 w-3.5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Minting...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3.5 w-3.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Get 100 Test Tokens
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
