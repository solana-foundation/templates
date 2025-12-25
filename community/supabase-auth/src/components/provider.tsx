'use client'

import { ReactNode } from 'react'
import { SolanaProvider } from '@solana/react-hooks'
import { autoDiscover, createClient } from '@solana/client'

const client = createClient({
  endpoint: 'https://api.devnet.solana.com',
  walletConnectors: autoDiscover(),
})

export function Provider({ children }: { children: ReactNode }) {
  return <SolanaProvider client={client}>{children}</SolanaProvider>
}
