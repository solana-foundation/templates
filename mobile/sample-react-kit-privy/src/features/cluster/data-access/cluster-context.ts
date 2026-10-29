import { createContext, use } from 'react'

import type { Cluster } from './clusters'

export type ClusterContextValue = {
  cluster: Cluster
  clusters: readonly Cluster[]
  setCluster: (cluster: Cluster) => void
}

export const ClusterContext = createContext<ClusterContextValue | null>(null)

export function useCluster(): ClusterContextValue {
  const value = use(ClusterContext)
  if (!value) {
    throw new Error('useCluster must be used within a ClusterProvider')
  }
  return value
}
