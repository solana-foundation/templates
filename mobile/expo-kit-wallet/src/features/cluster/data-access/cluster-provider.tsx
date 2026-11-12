import { useStore } from '@nanostores/react'
import type { SolanaCluster, SolanaClusterId } from '@wallet-ui/react-native-kit'
import type { PropsWithChildren } from 'react'
import { createContext, useContext, useMemo } from 'react'

import type { AppCluster, ClusterStore } from '@/features/cluster/data-access/cluster-store'
import { createSolanaClient, type SolanaClient } from '@/features/cluster/data-access/create-solana-client'

export interface ClusterContextValue {
  client: SolanaClient
  cluster: SolanaCluster
  clusters: AppCluster[]
  resetClusters(): void
  setCluster(cluster: SolanaClusterId): void
  updateClusterUrl(cluster: SolanaClusterId, url: string): void
}

export interface ClusterProviderProps {
  store: ClusterStore
}

const ClusterContext = createContext<ClusterContextValue | undefined>(undefined)

export function ClusterProvider({ children, store }: PropsWithChildren<ClusterProviderProps>) {
  const cluster = useStore(store.$cluster)
  const clusters = useStore(store.$clusters)
  const client = useMemo(() => createSolanaClient(cluster), [cluster])

  const value = useMemo(
    () => ({
      client,
      cluster,
      clusters,
      resetClusters: store.resetClusters,
      setCluster: store.setCluster,
      updateClusterUrl: store.updateClusterUrl,
    }),
    [client, cluster, clusters, store.resetClusters, store.setCluster, store.updateClusterUrl],
  )

  return <ClusterContext.Provider value={value}>{children}</ClusterContext.Provider>
}

export function useAppCluster() {
  const context = useContext(ClusterContext)
  if (!context) {
    throw new Error('useAppCluster must be used within AppClusterProvider')
  }
  return context
}
