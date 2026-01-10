'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { Provider } from '@/components/provider'
import { AuthProvider } from '@/components/auth/auth-provider'
import React from 'react'

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <Provider>{children}</Provider>
      </AuthProvider>
    </ThemeProvider>
  )
}
