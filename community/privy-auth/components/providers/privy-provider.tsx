'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana'
import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit'

// Suppress Privy's internal missing key warning so it doesn't trigger the Next.js dev overlay
if (typeof window !== 'undefined') {
  const originalError = console.error
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Each child in a list should have a unique "key" prop') &&
      args[0].includes('Me')
    ) {
      return
    }
    originalError(...args)
  }
}

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID

export default function PrivyClientProvider({ children }: { children: React.ReactNode }) {
  // During build-time SSG, the app ID won't be available.
  // Render children without Privy context to avoid crashing the build.
  if (!PRIVY_APP_ID || PRIVY_APP_ID === 'your-privy-app-id') {
    return <>{children}</>
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          walletChainType: 'solana-only',
          theme: 'dark',
          accentColor: '#9945FF',
          logo: 'https://solana.com/favicon.ico',
        },
        loginMethods: ['google', 'github', 'discord', 'twitter', 'email', 'wallet'],
        embeddedWallets: {
          solana: {
            createOnLogin: 'users-without-wallets',
          },
        },
        externalWallets: {
          solana: { connectors: toSolanaWalletConnectors() },
        },
        solana: {
          rpcs: {
            'solana:devnet': {
              rpc: createSolanaRpc('https://api.devnet.solana.com'),
              rpcSubscriptions: createSolanaRpcSubscriptions('wss://api.devnet.solana.com'),
            },
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
