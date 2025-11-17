'use client'

import { PhantomProvider } from '@phantom/react-sdk'
import { AddressType } from '@phantom/browser-sdk'
import { ReactNode } from 'react'

interface ConnexionProviderProps {
  children: ReactNode
}

export default function ConnexionProvider({ children }: ConnexionProviderProps) {
  // Support both NEXT_PUBLIC_APP_URL and NEXT_PUBLIC_REDIRECT_URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_REDIRECT_URL?.replace(/\/$/, '') || ''

  // Debug: Log environment variables (only in development)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('🔧 Environment Check:', {
      appId: process.env.NEXT_PUBLIC_PHANTOM_APP_ID ? '✅ Set' : '❌ Missing',
      appUrl: appUrl || '❌ Missing',
      rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL ? '✅ Set' : '❌ Missing',
    })
  }

  return (
    <PhantomProvider
      config={{
        addressTypes: [AddressType.solana],
        appId: process.env.NEXT_PUBLIC_PHANTOM_APP_ID || '',
        // Specify authentication providers for embedded wallet
        // Options: "google", "apple", "injected"
        providers: [
          'google',
          'apple',
          'injected', // Allow browser extension connection
        ],
        authOptions: {
          authUrl: 'https://connect.phantom.app/login',
          redirectUrl: `${appUrl}/auth/callback`, // Must be an existing page in your app and whitelisted in Phantom Portal
        },
      }}
    >
      {children}
    </PhantomProvider>
  )
}
