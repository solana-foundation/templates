'use client'

/**
 * Top-level Solana context provider.
 *
 * Wraps the app with `SolanaProvider` from @solana/react-hooks which
 * composes the client store (RPC, wallet, account cache) with the SWR
 * query layer in a single drop-in component.
 *
 * Cluster defaults to localnet for development; set NEXT_PUBLIC_CLUSTER
 * to "devnet" or "mainnet-beta" to switch.
 */

import { SolanaProvider } from '@solana/react-hooks'
import type { ReactNode } from 'react'

const CLUSTER = (process.env.NEXT_PUBLIC_CLUSTER as 'localnet' | 'devnet' | 'mainnet-beta') ?? 'devnet'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SolanaProvider
      config={{
        cluster: CLUSTER,
        walletConnectors: 'default',
      }}
    >
      {children}
    </SolanaProvider>
  )
}
