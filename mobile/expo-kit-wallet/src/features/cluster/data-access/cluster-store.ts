import { atom, computed } from 'nanostores'
import {
  createSolanaDevnet,
  createSolanaLocalnet,
  createSolanaMainnet,
  createSolanaTestnet,
} from '@wallet-ui/react-native-kit'
import type { SolanaClusterId } from '@wallet-ui/react-native-kit'

import type { SyncCache } from '@/features/cluster/data-access/sync-cache'

export interface AppCluster {
  id: SolanaClusterId
  isEnabled: boolean
  label: string
  url: string
}

export interface ClusterStoreContext {
  cache: SyncCache<unknown>
}

interface ClusterStoreState {
  clusterId: SolanaClusterId
  clusters: AppCluster[]
}

interface StoredCluster {
  id: SolanaClusterId
  url?: string
}

interface StoredClusterState {
  clusterId?: SolanaClusterId
  clusters?: StoredCluster[]
}

const DEFAULT_CLUSTER_ID = 'solana:devnet' as SolanaClusterId

export const DEFAULT_CLUSTERS = [
  {
    id: 'solana:devnet' as SolanaClusterId,
    label: 'Devnet',
    url: 'https://api.devnet.solana.com',
  },
  {
    id: 'solana:testnet' as SolanaClusterId,
    label: 'Testnet',
    url: 'https://api.testnet.solana.com',
  },
  {
    id: 'solana:localnet' as SolanaClusterId,
    label: 'Localhost',
    url: '',
  },
  {
    id: 'solana:mainnet' as SolanaClusterId,
    label: 'Mainnet',
    url: '',
  },
] as const satisfies readonly Omit<AppCluster, 'isEnabled'>[]

function createAppCluster(cluster: Omit<AppCluster, 'isEnabled'>): AppCluster {
  const url = cluster.url.trim()

  return {
    ...cluster,
    isEnabled: url.length > 0,
    url,
  }
}

function createDefaultState(): ClusterStoreState {
  return {
    clusterId: DEFAULT_CLUSTER_ID,
    clusters: DEFAULT_CLUSTERS.map(createAppCluster),
  }
}

function createSolanaCluster(cluster: AppCluster) {
  if (!cluster.isEnabled) {
    return null
  }

  switch (cluster.id) {
    case 'solana:devnet':
      return createSolanaDevnet({ label: cluster.label, url: cluster.url })
    case 'solana:localnet':
      return createSolanaLocalnet({ label: cluster.label, url: cluster.url })
    case 'solana:mainnet':
      return createSolanaMainnet({ label: cluster.label, url: cluster.url })
    case 'solana:testnet':
      return createSolanaTestnet({ label: cluster.label, url: cluster.url })
    default:
      return null
  }
}

function findEnabledCluster(clusters: AppCluster[], clusterId: SolanaClusterId | string | undefined) {
  return clusters.find((cluster) => cluster.id === clusterId && cluster.isEnabled)
}

function findFallbackCluster(clusters: AppCluster[], clusterId: SolanaClusterId | string | undefined) {
  return (
    findEnabledCluster(clusters, clusterId) ??
    findEnabledCluster(clusters, DEFAULT_CLUSTER_ID) ??
    clusters.find((cluster) => cluster.isEnabled)
  )
}

function getEnabledSolanaCluster(clusters: AppCluster[], clusterId: SolanaClusterId | string | undefined) {
  const cluster = findFallbackCluster(clusters, clusterId)
  const solanaCluster = cluster ? createSolanaCluster(cluster) : null

  if (!solanaCluster) {
    throw new Error('At least one cluster must have an RPC URL.')
  }

  return solanaCluster
}

function getStoredClusterState(value: unknown): StoredClusterState {
  if (typeof value === 'string') {
    return { clusterId: value as SolanaClusterId }
  }

  if (!value || typeof value !== 'object') {
    return {}
  }

  return value as StoredClusterState
}

function normalizeState(value: unknown) {
  const stored = getStoredClusterState(value)
  const clusters = DEFAULT_CLUSTERS.map((cluster) => {
    const storedCluster = stored.clusters?.find((item) => item.id === cluster.id)
    return createAppCluster({
      ...cluster,
      url: storedCluster?.url ?? cluster.url,
    })
  })
  const fallbackCluster = findFallbackCluster(clusters, stored.clusterId)

  return fallbackCluster ? { clusterId: fallbackCluster.id, clusters } : createDefaultState()
}

function serializeState(state: ClusterStoreState): StoredClusterState {
  return {
    clusterId: state.clusterId,
    clusters: state.clusters.map(({ id, url }) => ({ id, url })),
  }
}

export function createClusterStore(context: ClusterStoreContext) {
  const { cache } = context
  const initialState = normalizeState(cache.get())
  const $clusterId = atom(initialState.clusterId)
  const $clusters = atom(initialState.clusters)
  const $cluster = computed([$clusters, $clusterId], (clusters, clusterId) =>
    getEnabledSolanaCluster(clusters, clusterId),
  )

  function getState(): ClusterStoreState {
    return {
      clusterId: $clusterId.get(),
      clusters: $clusters.get(),
    }
  }

  function setState(state: ClusterStoreState) {
    if (!state.clusters.some((cluster) => cluster.isEnabled)) {
      throw new Error('At least one cluster must have an RPC URL.')
    }

    cache.set(serializeState(state))
    $clusters.set(state.clusters)
    $clusterId.set(state.clusterId)
  }

  function resetClusters() {
    setState(createDefaultState())
  }

  function setCluster(clusterId: SolanaClusterId) {
    const state = getState()

    if (!findEnabledCluster(state.clusters, clusterId)) {
      throw new Error(`Cluster ${clusterId} does not have an RPC URL.`)
    }

    setState({ ...state, clusterId })
  }

  function updateClusterUrl(clusterId: SolanaClusterId, url: string) {
    const state = getState()
    const clusters = state.clusters.map((cluster) =>
      cluster.id === clusterId ? createAppCluster({ ...cluster, url }) : cluster,
    )
    const nextClusterId = findFallbackCluster(clusters, state.clusterId)?.id ?? DEFAULT_CLUSTER_ID

    setState({
      clusterId: nextClusterId,
      clusters,
    })
  }

  return {
    $cluster,
    $clusterId,
    $clusters,
    resetClusters,
    setCluster,
    updateClusterUrl,
  }
}

export type ClusterStore = ReturnType<typeof createClusterStore>
