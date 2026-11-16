import { address as toAddress, formatDecimalFixedPoint, lamportsToSol } from '@solana/kit'
import type { UiWalletAccount } from '@wallet-standard/ui'
import { ExternalLinkIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getExplorerUrl } from '@/features/cluster/data-access/clusters'
import { useAppCluster } from '@/features/core/data-access/use-app-cluster'
import { useWalletBalance } from '@/features/wallet/data-access/use-wallet-balance'
import { WalletUiFundAccount } from '@/features/wallet/ui/wallet-ui-fund-account'
import { formatError } from '@/features/wallet/util/format-error'

const solFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 5 })

export function WalletFeatureAccount({ account }: { account: UiWalletAccount }) {
  const cluster = useAppCluster()
  const { data, error, isLoading } = useWalletBalance(account.address)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Balance updates live over an account subscription.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">Address</span>
          <a
            className="text-primary inline-flex max-w-full items-center gap-1 font-mono text-sm underline underline-offset-4"
            href={getExplorerUrl(cluster, `/address/${account.address}`)}
            rel="noreferrer"
            target="_blank"
          >
            <span className="truncate">{account.address}</span>
            <ExternalLinkIcon className="size-3 shrink-0" />
          </a>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">Balance</span>
          {isLoading && !data ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <span className="text-3xl font-semibold tabular-nums">
              {data ? `${formatDecimalFixedPoint(solFormatter, lamportsToSol(data.value))} ◎` : '—'}
            </span>
          )}
          {error ? (
            <Badge variant="destructive">Could not refresh: {formatError(error, 'unknown reason')}</Badge>
          ) : null}
        </div>
        {data?.value === 0n ? <WalletUiFundAccount address={toAddress(account.address)} cluster={cluster} /> : null}
      </CardContent>
    </Card>
  )
}
