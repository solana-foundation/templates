'use client'

import React, { useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletConnectButton } from './WalletConnectButton'
import Navbar from './Navbar'
import { useStakingProgram } from '@/hooks/useStakingProgram'
import { useToast } from './Toast'
import { STAKING_CLUSTER_LABEL } from '@/lib/staking-config'

function formatToken(num: number): string {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })
}

export default function StakingDashboard() {
  const { connected, publicKey } = useWallet()
  const { poolStats, userPosition, poolLoading, userLoading, stake, unstake, claim } = useStakingProgram()
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState<'stake' | 'manage'>('stake')
  const [amount, setAmount] = useState('')
  const [staking, setStaking] = useState(false)
  const [unstaking, setUnstaking] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [requesting, setRequesting] = useState(false)

  const stakedAmount = userPosition?.stakedAmount ?? 0
  const rewardDebt = userPosition?.rewardDebt ?? 0
  const poolReady = Boolean(poolStats)

  const handleStake = useCallback(async () => {
    const num = parseFloat(amount)
    if (!num || num <= 0) return
    if (!poolReady) {
      showToast('error', 'Pool not initialized', 'Run node scripts/initialize-pool.js --mint <TOKEN_MINT_ADDRESS>')
      return
    }
    setStaking(true)
    try {
      showToast('info', 'Signing transaction...', `Staking ${num} tokens`)
      const txSig = await stake(num)
      showToast('success', 'Staked!', `${num} tokens staked`, txSig)
      setAmount('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transaction failed'
      showToast('error', 'Stake failed', msg)
    } finally {
      setStaking(false)
    }
  }, [amount, poolReady, showToast, stake])

  const handleUnstake = useCallback(async () => {
    const num = parseFloat(amount)
    if (!num || num <= 0) return
    setUnstaking(true)
    try {
      showToast('info', 'Signing transaction...', `Unstaking ${num} tokens`)
      const txSig = await unstake(num)
      showToast('success', 'Unstaked!', `${num} tokens returned`, txSig)
      setAmount('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transaction failed'
      showToast('error', 'Unstake failed', msg)
    } finally {
      setUnstaking(false)
    }
  }, [amount, showToast, unstake])

  const handleClaim = useCallback(async () => {
    setClaiming(true)
    try {
      showToast('info', 'Signing transaction...', 'Claiming rewards')
      const txSig = await claim()
      showToast('success', 'Claimed!', 'Rewards claimed', txSig)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transaction failed'
      showToast('error', 'Claim failed', msg)
    } finally {
      setClaiming(false)
    }
  }, [showToast, claim])

  const handleFaucet = useCallback(async () => {
    if (!publicKey) return
    setRequesting(true)
    try {
      showToast('info', 'Requesting tokens...', 'Minting test tokens')
      const res = await fetch('/api/faucet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: publicKey.toBase58() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showToast('success', 'Tokens received!', `${data.amount} test tokens minted`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Faucet failed'
      showToast('error', 'Faucet failed', msg)
    } finally {
      setRequesting(false)
    }
  }, [publicKey, showToast])

  const isProcessing = staking || unstaking

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto max-w-lg px-4 py-6 sm:px-6">
        {/* Hero */}
        <div className="mb-5 text-center animate-fade-in">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Stake Tokens</h1>
          <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
            Stake SPL tokens to earn rewards. Built with Anchor on Solana.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex border-b border-border animate-fade-in" style={{ animationDelay: '100ms' }}>
          <button
            onClick={() => setActiveTab('stake')}
            className={`relative px-5 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'stake' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Stake
            {activeTab === 'stake' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />}
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`relative px-5 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'manage' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Manage
            {activeTab === 'manage' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />}
          </button>
        </div>

        {activeTab === 'stake' ? (
          /* ─── Stake Tab ─── */
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
            {/* Pool info cards */}
            {poolLoading ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border p-3">
                  <div className="skeleton h-3 w-16 mb-1" />
                  <div className="skeleton h-5 w-20" />
                </div>
                <div className="rounded-lg border border-border p-3">
                  <div className="skeleton h-3 w-16 mb-1" />
                  <div className="skeleton h-5 w-20" />
                </div>
              </div>
            ) : poolStats ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-card p-3">
                  <p className="text-[11px] text-muted-foreground">Total Staked</p>
                  <p className="mt-0.5 text-base font-semibold font-mono">{formatToken(poolStats.totalStaked)}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-3">
                  <p className="text-[11px] text-muted-foreground">Reward Pool</p>
                  <p className="mt-0.5 text-base font-semibold font-mono">{formatToken(poolStats.rewardPool)}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
                <p className="font-semibold text-amber-200">Pool not initialized</p>
                <p className="mt-1 text-xs leading-relaxed text-amber-100/80">
                  Run <code className="font-mono">node scripts/initialize-pool.js --mint &lt;TOKEN_MINT_ADDRESS&gt;</code>{' '}
                  before using the staking UI.
                </p>
              </div>
            )}

            {/* Amount input */}
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</span>
                {connected && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAmount((stakedAmount / 2).toString())}
                      className="rounded-md border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                    >
                      HALF
                    </button>
                    <button
                      onClick={() => setAmount(stakedAmount.toString())}
                      className="rounded-md border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                    >
                      MAX
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="any"
                  className="flex-1 bg-transparent text-2xl font-mono font-light text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                />
                <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                      className="h-3 w-3"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">SPL</span>
                </div>
              </div>
            </div>

            {/* Info rows */}
            <div className="rounded-lg border border-border bg-card divide-y divide-border">
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-xs text-muted-foreground">Reward Rate</span>
                <span className="text-xs font-mono">{poolStats ? `${poolStats.rewardRate} / sec` : '—'}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-xs text-muted-foreground">Your Staked</span>
                <span className="text-xs font-mono">{connected ? formatToken(stakedAmount) : '—'}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-xs text-muted-foreground">Claimed</span>
                <span className="text-xs font-mono">{connected ? formatToken(rewardDebt) : '—'}</span>
              </div>
            </div>

            {/* Action button */}
            {!connected ? (
              <div className="flex justify-center">
                <WalletConnectButton />
              </div>
            ) : (
              <button
                onClick={handleStake}
                disabled={isProcessing || !poolReady || !amount || parseFloat(amount) <= 0}
                className="w-full rounded-lg bg-foreground px-4 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-85 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {staking ? 'Staking...' : 'Stake Tokens'}
              </button>
            )}

            {/* Devnet faucet */}
            {connected && (
              <div className="text-center">
                <button
                  onClick={handleFaucet}
                  disabled={requesting}
                  className="text-xs text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground disabled:opacity-40"
                >
                  {requesting ? 'Minting...' : `Get test tokens (${STAKING_CLUSTER_LABEL})`}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ─── Manage Tab ─── */
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
            {!connected ? (
              <div className="rounded-lg border border-border bg-card p-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">Connect your wallet to manage your position</p>
                <div className="flex justify-center">
                  <WalletConnectButton />
                </div>
              </div>
            ) : !poolReady ? (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-6 text-center">
                <p className="text-sm font-semibold text-amber-200">Pool not initialized</p>
                <p className="mt-2 text-xs text-amber-100/80">
                  Initialize the pool first, then refresh this page to manage positions.
                </p>
              </div>
            ) : userLoading ? (
              <div className="space-y-3">
                <div className="rounded-xl border border-border p-5">
                  <div className="skeleton h-4 w-32 mb-2" />
                  <div className="skeleton h-8 w-40" />
                </div>
                <div className="rounded-xl border border-border p-5">
                  <div className="skeleton h-4 w-32 mb-2" />
                  <div className="skeleton h-8 w-40" />
                </div>
              </div>
            ) : (
              <>
                {/* Position cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border bg-card p-3">
                    <p className="text-[11px] text-muted-foreground">Staked</p>
                    <p className="mt-0.5 text-lg font-semibold font-mono">{formatToken(stakedAmount)}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-3">
                    <p className="text-[11px] text-muted-foreground">Claimed</p>
                    <p className="mt-0.5 text-lg font-semibold font-mono">{formatToken(rewardDebt)}</p>
                  </div>
                </div>

                {/* Unstake */}
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unstake</p>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="any"
                      className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-foreground focus:outline-none"
                    />
                    <button
                      onClick={handleUnstake}
                      disabled={unstaking || !poolReady || !amount || parseFloat(amount) <= 0}
                      className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {unstaking ? '...' : 'Unstake'}
                    </button>
                  </div>
                </div>

                {/* Claim */}
                <button
                  onClick={handleClaim}
                  disabled={claiming || !poolReady || stakedAmount === 0}
                  className="w-full rounded-lg bg-foreground px-4 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-85 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {claiming ? 'Claiming...' : 'Claim Rewards'}
                </button>
              </>
            )}
          </div>
        )}

        {/* Pool metadata */}
        {poolStats && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span>
              Program <code className="font-mono">55UV...ZXCp</code>
            </span>
            <span>·</span>
            <span>
              Admin{' '}
              <code className="font-mono">
                {poolStats.admin.slice(0, 4)}...{poolStats.admin.slice(-4)}
              </code>
            </span>
            <span>·</span>
            <span>
              Mint{' '}
              <code className="font-mono">
                {poolStats.mint.slice(0, 4)}...{poolStats.mint.slice(-4)}
              </code>
            </span>
          </div>
        )}
      </main>
    </div>
  )
}
