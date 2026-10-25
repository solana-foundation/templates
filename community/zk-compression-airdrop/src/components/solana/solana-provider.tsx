'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { ClientProvider, useClient } from '@solana/react'
import { CLUSTERS, type ClusterOption } from './clusters'
import { createAppClient, type AppClient } from '@/lib/solana-client'

const ClusterContext = createContext<{ cluster: ClusterOption; setCluster: (cluster: ClusterOption) => void } | null>(
  null,
)

export function useSolana() {
  const client = useClient<AppClient>()
  const context = useContext(ClusterContext)
  if (!context) throw new Error('useSolana must be used within SolanaProvider')
  return { client, ...context }
}

export function SolanaProvider({ children }: { children: ReactNode }) {
  const [cluster, setCluster] = useState(CLUSTERS[0])
  const [active, setActive] = useState<{ cluster: ClusterOption; client: AppClient } | null>(null)
  useEffect(() => {
    const client = createAppClient(cluster)
    let disposed = false
    queueMicrotask(() => {
      if (!disposed) setActive({ cluster, client })
    })
    return () => {
      disposed = true
      client[Symbol.dispose]()
    }
  }, [cluster])
  if (!active || active.cluster !== cluster) return null
  return (
    <ClusterContext.Provider value={{ cluster, setCluster }}>
      <ClientProvider client={active.client}>{children}</ClientProvider>
    </ClusterContext.Provider>
  )
}
