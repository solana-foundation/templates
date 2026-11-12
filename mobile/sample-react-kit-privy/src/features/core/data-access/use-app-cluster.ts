import { getCluster, type Cluster } from '@/features/cluster/data-access/clusters'

import { useAppClient } from './use-app-client'

/**
 * The cluster the client is actually talking to right now.
 *
 * Prefer this over the selected cluster from `useCluster()` anywhere the answer has to agree with
 * the client — cache keys, explorer links, fee estimates. `ClusterProvider` publishes the rebuilt
 * client one render after the selection changes, so for that one render the two disagree, and only
 * this one matches the `rpc` that requests are going through.
 */
export function useAppCluster(): Cluster {
  return getCluster(useAppClient().chain)
}
