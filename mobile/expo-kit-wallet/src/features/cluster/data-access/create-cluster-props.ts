import { createMMKV } from 'react-native-mmkv'
import { createClusterStore, type ClusterStore } from '@/features/cluster/data-access/cluster-store'
import { createMmkvCache } from '@/features/cluster/data-access/mmkv-cache'

export const APP_CLUSTER_STORAGE_KEY = 'wallet-ui:cluster'
export const APP_STORAGE_ID = 'expo-kit-wallet'

const storage = createMMKV({ id: APP_STORAGE_ID })

export interface ClusterProviderConfig {
  store: ClusterStore
}

export function createClusterProps(): ClusterProviderConfig {
  const store = createClusterStore({
    cache: createMmkvCache({ storage, storageKey: APP_CLUSTER_STORAGE_KEY }),
  })
  return { store }
}
