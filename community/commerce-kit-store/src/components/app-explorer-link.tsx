import { ArrowUpRightFromSquare } from 'lucide-react'

type PathType = 'address' | 'tx' | 'block'

interface ExplorerLinkProps {
  path: string
  type: PathType
  label: string
  className?: string
}

function getExplorerUrl(path: string, type: PathType): string {
  const baseUrl = 'https://itx-indexer.com'

  if (type === 'tx') {
    return `${baseUrl}/indexer/${path}`
  }

  return `${baseUrl}/${type}/${path}`
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
