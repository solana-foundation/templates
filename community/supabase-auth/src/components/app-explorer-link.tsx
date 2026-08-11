'use client'

import { ArrowUpRightFromSquare } from 'lucide-react'
import { useCluster } from '@/components/solana/cluster-provider'

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
}: Pick<ExplorerLinkProps, 'address' | 'block' | 'transaction'> & {
  cluster: { id: string }
}) {
  const base = 'https://explorer.solana.com'
  const path = address ? `/address/${address}` : transaction ? `/tx/${transaction}` : block ? `/block/${block}` : '/'
  const clusterQuery = cluster.id === 'mainnet-beta' ? '' : `?cluster=${cluster.id}`

  return `${base}${path}${clusterQuery}`
}

export function AppExplorerLink({ className, label = '', ...link }: ExplorerLinkProps) {
  const { cluster } = useCluster()
  const href = buildExplorerUrl({ ...link, cluster: { id: cluster.id } })

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
