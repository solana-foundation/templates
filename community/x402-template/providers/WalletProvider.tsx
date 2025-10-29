'use client'

import { ReactNode, useMemo } from 'react'
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { env } from '@/lib/env'

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const endpoint = env.NEXT_PUBLIC_RPC_ENDPOINT

  // Initialize wallets - must be done on client side only
  const wallets = useMemo(() => {
    if (typeof window === 'undefined') {
      return []
    }
    // Create Phantom adapter - even if Wallet Standard is available,
    // we need to add it here for useWallet() hook to work
    return [new PhantomWalletAdapter()]
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect={false} onError={(error) => console.error('Wallet error:', error)}>
        {children}
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}
