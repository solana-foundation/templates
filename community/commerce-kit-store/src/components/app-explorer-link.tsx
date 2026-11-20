import { ArrowUpRightFromSquare } from 'lucide-react'
import { resolveWalletChain } from '@/lib/solana-network'

type PathType = 'address' | 'tx' | 'block'

interface ExplorerLinkProps {
  path: string
  type: PathType
  label: string
  className?: string
}

function getExplorerUrl(path: string, type: PathType): string {
  const chain = resolveWalletChain(
    process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com',
    process.env.NEXT_PUBLIC_SOLANA_CLUSTER,
  )
  const cluster = chain === 'solana:devnet' ? '?cluster=devnet' : ''
  return `https://explorer.solana.com/${type}/${encodeURIComponent(path)}${cluster}`
}

export function AppExplorerLink({ path, type, label, className }: ExplorerLinkProps) {
  const url = getExplorerUrl(path, type)

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className || 'link font-mono inline-flex gap-1'}>
      {label}
      <ArrowUpRightFromSquare size={12} />
    </a>
  )
}
