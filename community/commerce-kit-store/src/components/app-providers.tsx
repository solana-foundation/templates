'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { DialogProvider } from '@solana-commerce/kit'
import { ClientProvider } from '@solana/react'
import { client } from '@/lib/solana-client'

import React from 'react'

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider attribute="class" forcedTheme="dark" disableTransitionOnChange>
      <ClientProvider client={client}>
        <DialogProvider>{children}</DialogProvider>
      </ClientProvider>
    </ThemeProvider>
  )
}
