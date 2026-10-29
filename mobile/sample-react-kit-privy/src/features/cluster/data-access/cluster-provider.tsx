import { ClientProvider } from '@solana/react'
import { useCallback, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'

import { createSolanaClient, type AppClient } from '@/features/core/data-access/create-solana-client'

import { ClusterContext } from './cluster-context'
import { loadCluster, saveCluster } from './cluster-storage'
import { CLUSTERS, type Cluster } from './clusters'

/**
 * Owns the selected cluster and the client built for it.
 *
 * One client targets one network: the wallet plugin is bound to a single chain and each network has
 * its own RPC endpoints, so switching networks builds a fresh client rather than mutating one. The
 * previous client is disposed by this effect's cleanup, which also cleans up the double-build React
 * performs in StrictMode.
 */
export function ClusterProvider({ children }: { children: ReactNode }) {
  const [cluster, setClusterState] = useState<Cluster>(loadCluster)
  const [client, setClient] = useState<AppClient | null>(null)

  const setCluster = useCallback((next: Cluster) => {
    saveCluster(next)
    setClusterState(next)
  }, [])

  useLayoutEffect(() => {
    const next = createSolanaClient(cluster)
    // Publishing synchronously here, rather than deriving the client from render, is what lets the
    // effect's cleanup own disposal of the connections the client wraps.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setClient(next)
    return () => next[Symbol.dispose]()
  }, [cluster])

  const value = useMemo(() => ({ cluster, clusters: CLUSTERS, setCluster }), [cluster, setCluster])

  if (!client) {
    // Only the render pass before the layout effect lands here, and it is never painted.
    return null
  }

  return (
    <ClusterContext.Provider value={value}>
      <ClientProvider client={client}>{children}</ClientProvider>
    </ClusterContext.Provider>
  )
}
