'use client'

import { useState, useRef, useEffect } from 'react'
import {
  useConnect,
  useDisconnect,
  useIsPhantomLoginAvailable,
  useIsExtensionInstalled,
  useAccounts,
} from '@phantom/react-sdk'
import ConnectionModal from './ConnectionModal'
import PhantomIcon from './icons/PhantomIcon'

export default function ConnectWalletButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { connect, isConnecting, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { isAvailable: isPhantomAvailable } = useIsPhantomLoginAvailable()
  const { isInstalled: isExtensionInstalled } = useIsExtensionInstalled()
  const accounts = useAccounts()

  const isConnected = accounts && accounts.length > 0

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
      if (isConnected && accounts[0]) {
        try {
          // Using Solana web3.js to fetch balance
          const { Connection, PublicKey } = await import('@solana/web3.js')

          // Use custom RPC URL if provided, otherwise use public mainnet
          const rpcUrl =
            process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
            `https://api.${process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta'}.solana.com`

          const connection = new Connection(rpcUrl)
          const publicKey = new PublicKey(accounts[0].address)
          const balanceInLamports = await connection.getBalance(publicKey)
          setBalance(balanceInLamports / 1e9) // Convert lamports to SOL
        } catch (err) {
          console.error('Error fetching balance:', err)
          setBalance(0)
        }
      }
    }

    fetchBalance()
  }, [isConnected, accounts])

  const handleConnect = async (provider: 'google' | 'apple' | 'injected') => {
    try {
      await connect({ provider })
      setIsModalOpen(false)
    } catch (err) {
      console.error('Connection error:', err)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      setIsDropdownOpen(false)
      setBalance(null)
    } catch (err) {
      console.error('Disconnect error:', err)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  if (isConnected) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="group flex items-center gap-3 px-5 py-3 bg-phantom text-white rounded-xl font-medium hover:bg-phantom-dark focus:outline-none focus:ring-2 focus:ring-phantom-light transition-all shadow-lg shadow-phantom/20"
        >
          {/* Phantom icon */}
          <PhantomIcon className="w-6 h-6" />

          {/* Address */}
          <span className="text-sm font-semibold">{formatAddress(accounts[0].address)}</span>

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
                  <p className="text-sm font-mono font-semibold text-ink truncate">{accounts[0].address}</p>
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
                onClick={() => {
                  navigator.clipboard.writeText(accounts[0].address)
                  // Optional: show toast notification
                }}
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
                Copy Address
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

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isConnecting}
        className="group flex items-center gap-3 px-6 py-3 bg-phantom text-white rounded-xl font-semibold hover:bg-phantom-dark focus:outline-none focus:ring-2 focus:ring-phantom-light transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-phantom/20 hover:shadow-xl hover:shadow-phantom/30"
      >
        <PhantomIcon className="w-6 h-6" />
        <span>{isConnecting ? 'Connecting...' : 'Login with Phantom'}</span>
      </button>

      <ConnectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnect={handleConnect}
        isConnecting={isConnecting}
        isPhantomAvailable={isPhantomAvailable}
        isExtensionInstalled={isExtensionInstalled}
        error={error}
      />
    </>
  )
}
