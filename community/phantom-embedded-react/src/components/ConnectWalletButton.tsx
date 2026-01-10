'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useDisconnect, useAccounts, usePhantom, useModal, useDiscoveredWallets, useSolana } from '@phantom/react-sdk'
import { Connection, PublicKey } from '@solana/web3.js'
import PhantomIcon from './icons/PhantomIcon'

/**
 * Type for wallet account from useAccounts hook
 * Represents a connected wallet address with its type
 */
interface WalletAccount {
  address: string
  addressType: string
}

/**
 * ConnectWalletButton - Main wallet connection component
 *
 * Phantom Connect SDK (Beta 26)
 * @see https://docs.phantom.com
 *
 * Uses the SDK's built-in modal for connection:
 * - useModal() hook controls the built-in connection modal
 * - useDiscoveredWallets() detects all available wallets via Wallet Standard & EIP-6963
 * - useSolana() hook provides Solana-specific operations (signMessage, signTransaction, etc.)
 * - Modal handles Google, Apple, Phantom Login, and discovered wallet connections
 * - Theming is configured in ConnectionProvider via theme prop
 */
export default function ConnectWalletButton() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // SDK built-in modal hook
  const { open: openModal, isOpened: isModalOpen } = useModal()

  // Connection state hooks
  const { disconnect } = useDisconnect()
  const accounts = useAccounts() as WalletAccount[] | null

  // usePhantom provides isConnected, isLoading state
  const { isLoading: isSDKLoading, isConnected: phantomConnected } = usePhantom()

  // Wallet discovery hook - detects all available wallets (runs in background)
  // Note: Don't block UI on this - SDK handles wallet display in modal automatically
  const { wallets: discoveredWallets } = useDiscoveredWallets()

  // Solana-specific operations hook (Beta 26)
  // Provides signMessage, signTransaction, signAndSendTransaction, etc.
  const solana = useSolana()

  // Check connected state from both accounts and phantom hook
  const isConnected = (accounts && accounts.length > 0) || phantomConnected

  // Get the first account address safely
  const primaryAccount = accounts?.[0]
  const primaryAddress = primaryAccount?.address

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch balance when connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected && primaryAddress) {
        try {
          // Use custom RPC URL if provided, otherwise use public mainnet
          const rpcUrl =
            process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
            `https://api.${process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta'}.solana.com`

          const connection = new Connection(rpcUrl)
          const publicKey = new PublicKey(primaryAddress)
          const balanceInLamports = await connection.getBalance(publicKey)
          setBalance(balanceInLamports / 1e9) // Convert lamports to SOL
        } catch (err) {
          console.error('Error fetching balance:', err)
          setBalance(0)
        }
      }
    }

    fetchBalance()
  }, [isConnected, primaryAddress])

  // Log discovered wallets in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && discoveredWallets && discoveredWallets.length > 0) {
      console.log('🔍 Discovered Wallets:', discoveredWallets)
    }
  }, [discoveredWallets])

  // Handle disconnect
  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect()
      setIsDropdownOpen(false)
      setBalance(null)
    } catch (err) {
      console.error('Disconnect error:', err)
    }
  }, [disconnect])

  // Handle copy address
  const handleCopyAddress = useCallback(() => {
    if (primaryAddress) {
      navigator.clipboard.writeText(primaryAddress)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }, [primaryAddress])

  // Format address for display
  const formatAddress = (address: string): string => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  // Show loading state only while SDK initializes (not during wallet discovery)
  if (isSDKLoading) {
    return (
      <button
        disabled
        className="flex items-center gap-3 px-6 py-3 bg-phantom/50 text-white rounded-xl font-semibold cursor-wait"
      >
        <PhantomIcon className="w-6 h-6 animate-pulse" />
        <span>Loading...</span>
      </button>
    )
  }

  // Connected state - show address and dropdown
  if (isConnected) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="group flex items-center gap-3 px-5 py-3 bg-phantom text-white rounded-xl font-medium hover:bg-phantom-dark focus:outline-none focus:ring-2 focus:ring-phantom-light transition-all shadow-lg shadow-phantom/20"
        >
          {/* Phantom icon */}
          <PhantomIcon className="w-6 h-6" />

          {/* Address display */}
          <span className="text-sm font-semibold">{primaryAddress ? formatAddress(primaryAddress) : 'Connected'}</span>

          {/* Chevron */}
          <svg
            className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-bg-surface rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Account Info */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-br from-phantom/5 to-transparent">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-phantom to-phantom-dark flex items-center justify-center p-2">
                  <PhantomIcon className="w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted mb-1">Connected Account</p>
                  <p className="text-sm font-mono font-semibold text-ink truncate">{primaryAddress || 'Unknown'}</p>
                </div>
              </div>

              {/* Balance */}
              <div className="flex items-center justify-between p-3 bg-bg-page rounded-lg">
                <span className="text-xs font-medium text-muted">Balance</span>
                <span className="text-sm font-bold text-ink">
                  {balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-2">
              <button
                onClick={handleCopyAddress}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-ink hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                {copySuccess ? 'Copied!' : 'Copy Address'}
              </button>

              <button
                onClick={handleDisconnect}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-orange hover:bg-orange/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Disconnected state - show connect button that opens SDK modal
  return (
    <button
      onClick={openModal}
      disabled={isModalOpen}
      className="group flex items-center gap-3 px-6 py-3 bg-phantom text-white rounded-xl font-semibold hover:bg-phantom-dark focus:outline-none focus:ring-2 focus:ring-phantom-light transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-phantom/20 hover:shadow-xl hover:shadow-phantom/30"
    >
      <PhantomIcon className="w-6 h-6" />
      <span>Login with Phantom</span>
    </button>
  )
}
