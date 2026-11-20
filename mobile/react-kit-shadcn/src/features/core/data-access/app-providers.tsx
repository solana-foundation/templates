import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

import { ClusterProvider } from '@/features/cluster/data-access/cluster-provider'

export function AppProviders({ children }: { children: ReactNode }) {
  // Created in state so the cache survives re-renders but is never shared between app instances.
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ClusterProvider>{children}</ClusterProvider>
    </QueryClientProvider>
  )
}
