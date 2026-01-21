'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { DialogProvider } from '@solana-commerce/kit'
import { SolanaClientConfig } from '@solana/client'
import { SolanaProvider } from '@solana/react-hooks'

import React from 'react'

const defaultConfig: SolanaClientConfig = {
  endpoint: process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com',
}

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider attribute="class" forcedTheme="dark" disableTransitionOnChange>
      <SolanaProvider config={defaultConfig}>
        <DialogProvider>{children}</DialogProvider>
      </SolanaProvider>
    </ThemeProvider>
  )
}
