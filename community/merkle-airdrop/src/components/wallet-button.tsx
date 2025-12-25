'use client'

import * as React from 'react'
import { useWalletConnection, useWalletSession } from '@solana/react-hooks'
import { ellipsify } from '@/lib/utils'

type WalletButtonProps = {
  size?: 'sm' | 'md' | 'lg'
}

export function WalletButton({ size = 'md' }: WalletButtonProps) {
  const { connectors, connect, disconnect, status: walletStatus, connected } = useWalletConnection()
  const wallet = useWalletSession()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isConnecting, setIsConnecting] = React.useState<string | null>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleConnect = async (connectorId: string) => {
    try {
      setIsConnecting(connectorId)
      await connect(connectorId)
      setIsOpen(false)
    } catch (error) {
      console.error('Error connecting wallet:', error)
    } finally {
      setIsConnecting(null)
    }
  }

  const handleDisconnect = async () => {
    await disconnect()
    setIsOpen(false)
  }

  const handleCopy = async () => {
    const address = wallet?.account.address.toString()
    if (!address) return
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(address)
    }
    setIsOpen(false)
  }

  const displayLabel = connected
    ? wallet?.account
      ? ellipsify(wallet.account.address.toString())
      : (wallet?.connector.name ?? 'Wallet')
    : 'Select Wallet'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${sizeClasses[size]} rounded-lg font-medium transition-colors bg-gray-100 hover:bg-gray-200 border border-gray-300 flex items-center gap-2`}
      >
        {wallet?.connector.icon ? (
          <img src={wallet.connector.icon} alt={wallet.connector.name} className="w-5 h-5 rounded" />
        ) : null}
        {displayLabel}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {connected ? (
            <>
              <button
                onClick={handleCopy}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-t-lg"
              >
                Copy address
              </button>
              <button
                onClick={handleDisconnect}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600"
              >
                Disconnect
              </button>
              <div className="border-t border-gray-200" />
            </>
          ) : null}

          {connectors.length ? (
            connectors.map((connector, index) => (
              <button
                key={connector.id}
                onClick={() => handleConnect(connector.id)}
                disabled={walletStatus === 'connecting' || isConnecting === connector.id || connector.ready === false}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  index === connectors.length - 1 && !connected ? 'rounded-b-lg' : ''
                }`}
              >
                {connector.icon ? <img src={connector.icon} alt={connector.name} className="w-5 h-5 rounded" /> : null}
                {connector.name}
              </button>
            ))
          ) : (
            <a
              href="https://solana.com/solana-wallets"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-b-lg text-blue-600"
            >
              Get a Solana wallet
            </a>
          )}
        </div>
      )}
    </div>
  )
}
