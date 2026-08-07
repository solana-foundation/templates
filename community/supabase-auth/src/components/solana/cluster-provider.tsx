'use client'

import { createContext, ReactNode, useCallback, useContext, useMemo, useSyncExternalStore } from 'react'
import { ClusterId, ClusterOption, DEFAULT_CLUSTER, resolveCluster } from './clusters'

type ClusterContextValue = {
  cluster: ClusterOption
  setCluster: (id: ClusterId) => void
}

const ClusterContext = createContext<ClusterContextValue | null>(null)

const STORAGE_KEY = 'solana-cluster'
const CLUSTER_EVENT = 'cluster-change'

function readStoredClusterId(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_CLUSTER.id
  } catch {
    // localStorage is unavailable in Safari private mode.
    return DEFAULT_CLUSTER.id
  }
}

function getServerClusterId(): string {
  return DEFAULT_CLUSTER.id
}

function subscribe(callback: () => void) {
  window.addEventListener(CLUSTER_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(CLUSTER_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

export function ClusterProvider({ children }: { children: ReactNode }) {
  const clusterId = useSyncExternalStore(subscribe, readStoredClusterId, getServerClusterId)

  const setCluster = useCallback((id: ClusterId) => {
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {
      // localStorage is unavailable in Safari private mode.
    }
    window.dispatchEvent(new Event(CLUSTER_EVENT))
  }, [])

  const value = useMemo(() => ({ cluster: resolveCluster(clusterId), setCluster }), [clusterId, setCluster])

  return <ClusterContext.Provider value={value}>{children}</ClusterContext.Provider>
}

export function useCluster() {
  const context = useContext(ClusterContext)
  if (!context) {
    throw new Error('useCluster must be used within a ClusterProvider')
  }
  return context
}
