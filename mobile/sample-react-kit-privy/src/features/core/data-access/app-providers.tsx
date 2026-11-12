import { PrivyProvider } from '@privy-io/react-auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

import { ClusterProvider } from '@/features/cluster/data-access/cluster-provider'

// Both are public client-side identifiers — the Privy app secret never belongs in a browser app.
const privyAppId = import.meta.env.VITE_PRIVY_APP_ID
const privyClientId = import.meta.env.VITE_PRIVY_CLIENT_ID

export function AppProviders({ children }: { children: ReactNode }) {
  // Created in state so the cache survives re-renders but is never shared between app instances.
  const [queryClient] = useState(() => new QueryClient())

  // Thrown rather than rendered around: without an app id there is no Privy session to manage, and
  // in development Vite's error overlay turns this into a readable setup instruction.
  if (!privyAppId || !privyClientId) {
    throw new Error('Missing Privy environment variables. Copy .env.example to .env and follow README.md.')
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider appId={privyAppId} clientId={privyClientId}>
        <ClusterProvider>{children}</ClusterProvider>
      </PrivyProvider>
    </QueryClientProvider>
  )
}
