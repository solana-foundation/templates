import { ExternalLinkIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getExplorerUrl } from '@/features/cluster/data-access/clusters'
import { useAppCluster } from '@/features/core/data-access/use-app-cluster'
import { formatError } from '@/features/wallet/util/format-error'

/** A titled card with a consistent place for the result, or the reason there isn't one. */
export function WalletUiActionCard({
  children,
  description,
  error,
  result,
  signature,
  title,
}: {
  children: ReactNode
  description: string
  error?: unknown
  result?: string
  signature?: string
  title: string
}) {
  const cluster = useAppCluster()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {children}
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Failed</AlertTitle>
            <AlertDescription>{formatError(error)}</AlertDescription>
          </Alert>
        ) : null}
        {result ? (
          <Alert>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              <code className="text-foreground w-full font-mono text-xs break-all">{result}</code>
              {signature ? (
                <a
                  className="text-primary inline-flex items-center gap-1 text-xs underline underline-offset-4"
                  href={getExplorerUrl(cluster, `/tx/${signature}`)}
                  rel="noreferrer"
                  target="_blank"
                >
                  View on Solana Explorer
                  <ExternalLinkIcon className="size-3" />
                </a>
              ) : null}
            </AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  )
}
