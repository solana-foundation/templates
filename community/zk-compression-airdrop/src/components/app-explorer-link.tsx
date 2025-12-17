'use client'

import { ArrowUpRightFromSquare } from 'lucide-react'
import { useClusterState } from '@solana/react-hooks'
import { resolveCluster } from '@/components/solana/clusters'

type ExplorerLinkProps = {
  address?: string
  block?: string
  className?: string
  label: string
  transaction?: string
}

function buildExplorerUrl({
  cluster,
  address,
  transaction,
  block,
}: ExplorerLinkProps & {
  cluster: { id: string; endpoint: string }
}) {
  const base = 'https://explorer.solana.com'
  const path = address ? `/address/${address}` : transaction ? `/tx/${transaction}` : block ? `/block/${block}` : '/'
  const clusterQuery =
    cluster.id === 'mainnet-beta'
      ? ''
      : cluster.id === 'custom'
        ? `?cluster=custom&customUrl=${encodeURIComponent(cluster.endpoint)}`
        : `?cluster=${cluster.id}`

  return `${base}${path}${clusterQuery}`
}

export function AppExplorerLink({ className, label = '', address, block, transaction }: ExplorerLinkProps) {
  const clusterState = useClusterState()
  const cluster = resolveCluster(clusterState.endpoint)
  const href = buildExplorerUrl({
    label,
    address,
    block,
    transaction,
    cluster: { id: cluster.id, endpoint: cluster.endpoint },
  })

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className ? className : `link font-mono inline-flex gap-1`}
    >
      {label}
      <ArrowUpRightFromSquare size={12} />
    </a>
  )
}
