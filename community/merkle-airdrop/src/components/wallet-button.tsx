'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useClient } from '@solana/react'
import { useConnect, useConnectedWallet, useDisconnect, useWallets } from '@solana/kit-plugin-wallet/react'
import { getWalletForHandle } from '@wallet-standard/ui-registry'
import type { AppClient } from '@/lib/solana-client'
import { ellipsify } from '@/lib/utils'

const ids = new WeakMap<object, number>()
let nextId = 0
function walletId(wallet: object) {
  if (!ids.has(wallet)) ids.set(wallet, ++nextId)
  return ids.get(wallet)!
}

export function WalletButton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const client = useClient<AppClient>()
  const wallets = useWallets(client)
  const connected = useConnectedWallet(client)
  const { dispatchAsync: connect, error: connectError, isRunning: connecting, reset: resetConnect } = useConnect(client)
  const {
    dispatchAsync: disconnect,
    error: disconnectError,
    isRunning: disconnecting,
    reset: resetDisconnect,
  } = useDisconnect(client)
  const [open, setOpen] = useState(false)
  const [copyError, setCopyError] = useState<string | null>(null)
  const menu = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const outside = (event: MouseEvent) => {
      if (!menu.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('mousedown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [])
  function clearErrors() {
    resetConnect()
    resetDisconnect()
    setCopyError(null)
  }
  async function copyAddress() {
    if (!connected) return
    clearErrors()
    try {
      await navigator.clipboard.writeText(connected.account.address)
      setOpen(false)
    } catch {
      setCopyError('Could not copy the address. Please try again.')
    }
  }
  const error = copyError ?? connectError ?? disconnectError
  const pending = connecting || disconnecting
  return (
    <div className="relative inline-block" ref={menu}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className={`${{ sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-base', lg: 'px-6 py-3 text-lg' }[size]} inline-flex items-center gap-2 rounded-lg border border-gray-300`}
      >
        {connected && (
          <Image unoptimized src={getWalletForHandle(connected.wallet).icon} alt="" width={20} height={20} />
        )}
        {connected ? ellipsify(connected.account.address) : 'Select Wallet'}
      </button>
      {open && (
        <div className="absolute left-0 z-50 min-w-48 rounded-lg border bg-white p-2 text-gray-900">
          {connected && (
            <button type="button" disabled={pending} onClick={() => void copyAddress()} className="block w-full p-2">
              Copy address
            </button>
          )}
          {connected && (
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                clearErrors()
                void disconnect()
                  .then(() => setOpen(false))
                  .catch(() => {})
              }}
              className="block w-full p-2"
            >
              Disconnect
            </button>
          )}
          {wallets.map((wallet) => (
            <button
              type="button"
              key={walletId(getWalletForHandle(wallet))}
              disabled={pending}
              onClick={() => {
                clearErrors()
                void connect(wallet)
                  .then(() => setOpen(false))
                  .catch(() => {})
              }}
              className="flex w-full items-center gap-2 p-2"
            >
              <Image unoptimized src={wallet.icon} alt="" width={20} height={20} />
              {wallet.name}
              {connected && getWalletForHandle(connected.wallet) === getWalletForHandle(wallet) ? ' (Active)' : ''}
            </button>
          ))}
          {!wallets.length && (
            <a href="https://solana.com/solana-wallets" target="_blank" rel="noreferrer">
              Get a Solana wallet
            </a>
          )}
        </div>
      )}
      {error != null && <p role="alert">{error instanceof Error ? error.message : String(error)}</p>}
    </div>
  )
}
