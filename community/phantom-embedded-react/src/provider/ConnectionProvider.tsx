'use client'

import { PhantomProvider, darkTheme } from '@phantom/react-sdk'
import { AddressType } from '@phantom/browser-sdk'
import { ReactNode } from 'react'

interface ConnexionProviderProps {
  children: ReactNode
}

/**
 * ConnectionProvider wraps the app with PhantomProvider for wallet connectivity
 *
 * Phantom Connect SDK (Beta 22+)
 * @see https://docs.phantom.com
 *
 * Changes in Beta 22:
 * - Removed authOptions (authUrl and redirectUrl are now optional/handled internally)
 * - Added "phantom" provider for Phantom Login authentication
 * - Added theme support with built-in darkTheme and lightTheme
 * - New providers available: "x" (Twitter), "tiktok"
 */
export default function ConnexionProvider({ children }: ConnexionProviderProps) {
  // Debug: Log environment variables (only in development)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('🔧 Environment Check:', {
      appId: process.env.NEXT_PUBLIC_PHANTOM_APP_ID ? '✅ Set' : '❌ Missing',
      rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL ? '✅ Set' : '❌ Missing',
    })
  }

  return (
    <PhantomProvider
      config={{
        // Network support
        addressTypes: [AddressType.solana],

        // App ID from Phantom Portal (required for embedded providers)
        appId: process.env.NEXT_PUBLIC_PHANTOM_APP_ID || '',

        // Authentication providers available to users
        // Options: "google", "apple", "phantom", "x", "tiktok", "injected"
        providers: [
          'google', // Google OAuth
          'apple', // Apple ID
          'phantom', // Phantom Login (NEW in beta 22)
          'injected', // Browser extension
        ],

        // User wallet connects to existing Phantom ecosystem
        embeddedWalletType: 'user-wallet',
      }}
      // Theme for built-in modal UI
      theme={darkTheme}
      // Optional: App branding for the connection modal
      appName="Phantom Starter"
    >
      {children}
    </PhantomProvider>
  )
}
