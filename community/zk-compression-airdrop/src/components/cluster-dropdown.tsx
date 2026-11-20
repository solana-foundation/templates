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
import { useSolana } from '@/components/solana/solana-provider'
import { CLUSTERS } from '@/components/solana/clusters'

export function ClusterDropdown() {
  const { cluster, setCluster } = useSolana()

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
            setCluster(next)
          }}
        >
          {CLUSTERS.map((cluster) => {
            return (
              <DropdownMenuRadioItem key={cluster.id} value={cluster.id}>
                {cluster.label}
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
