'use client'

import { PhantomProvider, darkTheme, AddressType } from '@phantom/react-sdk'
import { ReactNode } from 'react'

/**
 * Props for the ConnectionProvider component
 */
interface ConnectionProviderProps {
  children: ReactNode
}

/**
 * ConnectionProvider wraps the app with PhantomProvider for wallet connectivity
 *
 * Phantom Connect SDK (Beta 26)
 * @see https://docs.phantom.com/sdks/react-sdk
 *
 * Features in Beta 26:
 * - ConnectButton component for ready-to-use connection UI
 * - useDiscoveredWallets hook for wallet discovery via Wallet Standard & EIP-6963
 * - useModal hook controls the built-in connection modal
 * - useSolana hook for Solana-specific operations (signMessage, signTransaction, etc.)
 * - Full TypeScript support with proper types
 * - Automatic wallet detection for injected providers
 * - Providers: "google", "apple", "phantom", "x", "tiktok", "injected"
 * - Security patches for CVE-2025-55182 and CVE-2025-66478
 */
export default function ConnectionProvider({ children }: ConnectionProviderProps) {
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
        // Network support - Solana blockchain
        addressTypes: [AddressType.solana],
        // App ID from Phantom Portal (required for embedded providers)
        appId: process.env.NEXT_PUBLIC_PHANTOM_APP_ID || '',
        // Authentication providers available to users
        // The modal will automatically detect and display available wallets
        providers: [
          'google', // Google OAuth
          'apple', // Apple ID
          'phantom', // Phantom Login
          'injected', // Browser extension + discovered wallets via Wallet Standard
        ],
        // User wallet connects to existing Phantom ecosystem
        embeddedWalletType: 'user-wallet',
        // OAuth redirect configuration (required for Google/Apple login)
        authOptions: {
          redirectUrl:
            typeof window !== 'undefined'
              ? `${window.location.origin}/auth/callback`
              : process.env.NEXT_PUBLIC_APP_URL
                ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
                : 'http://localhost:3000/auth/callback',
        },
      }}
      // Theme for built-in modal UI (darkTheme or lightTheme available)
      theme={darkTheme}
      // App branding for the connection modal
      appName="Phantom Starter"
      // App icon displayed in the modal (optional)
      appIcon="/phantom-logo.png"
    >
      {children}
    </PhantomProvider>
  )
}
