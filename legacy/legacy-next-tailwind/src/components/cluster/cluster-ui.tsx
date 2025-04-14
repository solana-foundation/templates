'use client'

import { useConnection } from '@solana/wallet-adapter-react'

import { useQuery } from '@tanstack/react-query'
import * as React from 'react'
import { ReactNode } from 'react'

import { useCluster } from './cluster-data-access'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export function ExplorerLink({ path, label, className }: { path: string; label: string; className?: string }) {
  const { getExplorerUrl } = useCluster()
  return (
    <a
      href={getExplorerUrl(path)}
      target="_blank"
      rel="noopener noreferrer"
      className={className ? className : `link font-mono`}
    >
      {label}
    </a>
  )
}

export function ClusterChecker({ children }: { children: ReactNode }) {
  const { cluster } = useCluster()
  const { connection } = useConnection()

  const query = useQuery({
    queryKey: ['version', { cluster, endpoint: connection.rpcEndpoint }],
    queryFn: () => connection.getVersion(),
    retry: 1,
  })
  if (query.isLoading) {
    return null
  }
  if (query.isError || !query.data) {
    return (
      <div className="alert alert-warning text-warning-content/80 rounded-none flex justify-center">
        <span>
          Error connecting to cluster <strong>{cluster.name}</strong>
        </span>
        <button className="btn btn-xs btn-neutral" onClick={() => query.refetch()}>
          Refresh
        </button>
      </div>
    )
  }
  return children
}

export function ClusterUiSelect() {
  const { clusters, setCluster, cluster } = useCluster()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{cluster.name}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {clusters.map((item) => (
          <DropdownMenuItem key={item.name} onClick={() => setCluster(item)}>
            {item.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
