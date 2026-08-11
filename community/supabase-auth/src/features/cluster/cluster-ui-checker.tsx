'use client'

import { ReactNode } from 'react'
import { useRequestSWR } from '@solana/react/swr'
import { Button } from '@/components/ui/button'
import { AppAlert } from '@/components/app-alert'
import { useAppClient } from '@/components/provider'
import { useCluster } from '@/components/solana/cluster-provider'

export function ClusterUiChecker({ children }: { children: ReactNode }) {
  const client = useAppClient()
  const { cluster } = useCluster()
  const { error, isLoading, mutate } = useRequestSWR(['cluster-health', cluster.id], client.rpc.getLatestBlockhash())

  if (isLoading) {
    return null
  }

  if (error) {
    return (
      <AppAlert
        action={
          <Button variant="outline" onClick={() => mutate()}>
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
