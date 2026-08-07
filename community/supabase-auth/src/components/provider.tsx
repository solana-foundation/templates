'use client'

import { ReactNode, useMemo } from 'react'
import { ClientProvider, useClient } from '@solana/react'
import { useCluster } from '@/components/solana/cluster-provider'
import { AppClient, createAppClient } from '@/components/solana/solana-client'

export function Provider({ children }: { children: ReactNode }) {
  const { cluster } = useCluster()
  const client = useMemo(() => createAppClient(cluster), [cluster])

  return <ClientProvider client={client}>{children}</ClientProvider>
}

export function useAppClient() {
  return useClient<AppClient>()
}
