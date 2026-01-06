'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { SolanaClientConfig } from '@solana/client'
import { SolanaProvider } from '@solana/react-hooks'

import React from 'react'

const defaultConfig: SolanaClientConfig = {
  endpoint: process.env.SOLANA_RPC_URL!,
}

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SolanaProvider config={defaultConfig}>{children}</SolanaProvider>
    </ThemeProvider>
  )
}
