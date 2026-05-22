'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useInitStatus, useUser, useWalletAccounts, useWalletProviders } from '@dynamic-labs-sdk/react-hooks'
import { connectWithWalletProvider, logout } from '@dynamic-labs-sdk/client'
import { isSolanaWalletAccount } from '@dynamic-labs-sdk/solana'
import DynamicLogo from './dynamic/logo'

function ConnectButton() {
  const initStatus = useInitStatus()
  const user = useUser()
  const accounts = useWalletAccounts()
  const providers = useWalletProviders()
  const [open, setOpen] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)

  if (initStatus !== 'finished') return null

  const solanaWallet = accounts.find(isSolanaWalletAccount)
  const solanaProviders = providers.filter((p) => p.chain === 'SOL')

  if (user && solanaWallet) {
    const shortAddr = `${solanaWallet.address.slice(0, 4)}...${solanaWallet.address.slice(-4)}`
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono text-[#606060]">{shortAddr}</span>
        <button
          onClick={() => logout()}
          className="px-3 py-1.5 text-sm rounded-lg transition-colors hover:bg-[#F9F9F9]"
          style={{ border: '1px solid #DADADA' }}
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((o) => !o)
          setConnectError(null)
        }}
        className="px-4 py-2 bg-[#4779FF] hover:bg-[#3366ee] text-white text-sm rounded-lg font-medium transition-colors"
      >
        Connect Wallet
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg p-2 min-w-[200px] z-50"
          style={{ border: '1px solid #DADADA' }}
        >
          {connectError && (
            <p className="text-xs text-[#C5221F] px-3 py-2 mb-1 bg-[#FCE8E6] rounded-lg">{connectError}</p>
          )}
          {solanaProviders.length === 0 ? (
            <p className="text-sm text-[#606060] px-3 py-2">No Solana wallets detected</p>
          ) : (
            solanaProviders.map((provider) => (
              <button
                key={provider.key}
                onClick={async () => {
                  setConnectError(null)
                  try {
                    await connectWithWalletProvider({ walletProviderKey: provider.key })
                    setOpen(false)
                  } catch (err) {
                    setConnectError(err instanceof Error ? err.message : 'Failed to connect wallet')
                  }
                }}
                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-[#030303] hover:bg-[#F9F9F9] rounded-lg transition-colors"
              >
                {provider.metadata.icon && (
                  <img src={provider.metadata.icon} alt="" className="w-5 h-5 rounded" />
                )}
                {provider.metadata.displayName}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 bg-white"
      style={{
        borderBottom: '1px solid #DADADA',
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.08)',
      }}
    >
      <Link href="/" className="flex items-center">
        <DynamicLogo width={120} height={24} className="text-[#030303]" />
      </Link>
      <ConnectButton />
    </header>
  )
}
