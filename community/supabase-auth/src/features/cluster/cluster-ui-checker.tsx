'use client'

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AppAlert } from '@/components/app-alert'
import { useClusterState, useClusterStatus, useWalletActions } from '@solana/react-hooks'
import { resolveCluster } from '@/components/solana/clusters'

export function ClusterUiChecker({ children }: { children: ReactNode }) {
  const clusterState = useClusterState()
  const clusterStatus = useClusterStatus()
  const { setCluster } = useWalletActions()
  const cluster = resolveCluster(clusterState.endpoint)

  const handleRefresh = async () => {
    try {
      await setCluster(clusterState.endpoint, {
        commitment: clusterState.commitment,
        websocketEndpoint: clusterState.websocketEndpoint,
      })
    } catch (error) {
      console.error('Failed to refresh cluster status', error)
    }
  }

  if (clusterStatus.status === 'idle' || clusterStatus.status === 'connecting') {
    return null
  }

  if (clusterStatus.status === 'error') {
    return (
      <AppAlert
        action={
          <Button variant="outline" onClick={handleRefresh}>
            Refresh
          </Button>
        }
        className="mb-4"
      >
        Error connecting to cluster <span className="font-bold">{cluster.label}</span>.
      </AppAlert>
    )
  }
  return children
}
