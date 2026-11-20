import { CLUSTERS, DEFAULT_CLUSTER, type Cluster } from './clusters'

const STORAGE_KEY = 'sample-react-kit-privy:cluster'

/**
 * Reads and writes the selected cluster. Every access is guarded because `localStorage` throws
 * rather than returning `null` when a browser blocks storage (private mode, embedded frames), and a
 * remembered network is never worth breaking the app over.
 */
export function loadCluster(): Cluster {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return CLUSTERS.find((cluster) => cluster.id === stored) ?? DEFAULT_CLUSTER
  } catch {
    return DEFAULT_CLUSTER
  }
}

export function saveCluster(cluster: Cluster): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, cluster.id)
  } catch {
    /* Storage is unavailable — the selection lives for this session only. */
  }
}
