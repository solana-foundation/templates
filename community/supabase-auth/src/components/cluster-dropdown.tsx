'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useClusterState, useSolanaClient } from '@solana/react-hooks'
import { CLUSTERS, resolveCluster } from '@/components/solana/clusters'

export function ClusterDropdown() {
  const clusterState = useClusterState()
  const client = useSolanaClient()
  const cluster = resolveCluster(clusterState.endpoint)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{cluster.label}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup
          value={cluster.id}
          onValueChange={async (clusterId) => {
            const next = CLUSTERS.find((item) => item.id === clusterId)
            if (!next) return
            await client.actions.setCluster(
              next.endpoint,
              next.websocket ? { websocketEndpoint: next.websocket } : undefined,
            )
          }}
        >
          {CLUSTERS.map((cluster) => {
            return (
              <DropdownMenuRadioItem
                key={cluster.id}
                value={cluster.id}
                disabled={clusterState.status.status === 'connecting'}
              >
                {cluster.label}
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
