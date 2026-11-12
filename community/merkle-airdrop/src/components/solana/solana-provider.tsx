'use client'

import { ReactNode } from 'react'
import { ClientProvider } from '@solana/react'
import { client } from '@/lib/solana-client'

export function SolanaProvider({ children }: { children: ReactNode }) {
  return <ClientProvider client={client}>{children}</ClientProvider>
}
