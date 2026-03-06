'use client'

import { useState, useEffect } from 'react'
import { Copy, Check } from 'lucide-react'
import { createSolanaRpc, address } from '@solana/kit'
import { useWallets } from '@privy-io/react-auth/solana'

type SolanaWallet = ReturnType<typeof useWallets>['wallets'][number]

/**
 * Displays Solana embedded wallet details:
 * - Wallet address with copy button
 * - SOL balance (fetched from devnet)
 * - Connection status
 */
export function WalletInfo({ wallets }: { wallets: SolanaWallet[] }) {
  const [copied, setCopied] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const wallet = wallets[0] // Primary Solana wallet

  useEffect(() => {
    if (!wallet?.address) return

    const fetchBalance = async () => {
      setLoading(true)
      try {
        const rpc = createSolanaRpc('https://api.devnet.solana.com')
        const result = await rpc.getBalance(address(wallet.address)).send()
        setBalance(Number(result.value) / 1e9)
      } catch (error) {
        console.error('Failed to fetch balance:', error)
        setBalance(null)
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
  }, [wallet?.address])

  const copyAddress = async () => {
    if (wallet?.address) {
      await navigator.clipboard.writeText(wallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!wallet) {
    return (
      <p className="text-muted text-sm">
        No Solana wallet found. One will be created automatically when you log in with Privy.
      </p>
    )
  }

  return (
    <div className="wallet-detail">
      {/* Connection Status */}
      <div className="wallet-row">
        <span className="wallet-label">Status</span>
        <div className="status-indicator">
          <span className="status-dot connected" />
          <span>Connected</span>
        </div>
      </div>

      {/* Wallet Address */}
      <div className="wallet-row">
        <span className="wallet-label">Address</span>
        <div className="wallet-value">
          <span>
            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
          </span>
          <button className="copy-btn" onClick={copyAddress} title="Copy address">
            {copied ? <Check size={14} className="text-foreground" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* SOL Balance */}
      <div className="wallet-row">
        <span className="wallet-label">Balance (Devnet)</span>
        <div className="balance-tag">
          {loading ? 'Loading...' : balance !== null ? `◎ ${balance.toFixed(4)} SOL` : 'Unable to fetch'}
        </div>
      </div>
    </div>
  )
}
