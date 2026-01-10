'use client'

import { ReactNode } from 'react'
import { SolanaProvider as BaseSolanaProvider } from '@solana/react-hooks'
import { autoDiscover, createClient } from '@solana/client'

const client = createClient({
  endpoint: 'https://api.devnet.solana.com',
  walletConnectors: autoDiscover(),
})

export function SolanaProvider({ children }: { children: ReactNode }) {
  return <BaseSolanaProvider client={client}>{children}</BaseSolanaProvider>
}
