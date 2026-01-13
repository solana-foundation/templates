import { ClusterMoniker } from '@solana/client'
import { ArrowUpRightFromSquare } from 'lucide-react'

type PathType = 'address' | 'tx' | 'block'

interface ExplorerLinkProps {
  path: string
  type: PathType
  label: string
  cluster?: ClusterMoniker
  className?: string
}

function getExplorerUrl(path: string, type: PathType, _cluster: ClusterMoniker): string {
  const baseUrl = 'https://itx-indexer.com'

  if (type === 'tx') {
    return `${baseUrl}/indexer/${path}`
  }

  return `${baseUrl}/${type}/${path}`
}

function getCluster(): ClusterMoniker {
  return (process.env.NEXT_PUBLIC_SOLANA_CLUSTER || 'devnet') as ClusterMoniker
}

export function AppExplorerLink({ path, type, label, cluster, className }: ExplorerLinkProps) {
  const activeCluster = cluster || getCluster()
  const url = getExplorerUrl(path, type, activeCluster)

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className || 'link font-mono inline-flex gap-1'}>
      {label}
      <ArrowUpRightFromSquare size={12} />
    </a>
  )
}
