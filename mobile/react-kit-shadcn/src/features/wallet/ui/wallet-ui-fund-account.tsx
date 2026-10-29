import { lamports, type Address, type ClientWithAirdrop } from '@solana/kit'
import { useAirdrop } from '@solana/react'
import { ExternalLinkIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { getFaucetUrl, type Cluster } from '@/features/cluster/data-access/clusters'
import { useAppClient } from '@/features/core/data-access/use-app-client'
import { formatError } from '@/features/wallet/util/format-error'

const ONE_SOL = lamports(1_000_000_000n)

/**
 * Offers a way to fund an empty account, and only then.
 *
 * Shown inline under a zero balance rather than as a card of its own: funding is a one-off step at
 * the very start, and a permanent card for it implies the app is about faucets.
 *
 * Mainnet has no faucet, and its client carries no `airdrop` capability to reflect that. Narrowing
 * on the capability rather than on the network name keeps the check honest, and keeps `useAirdrop`
 * in a component that only renders when the capability is really there.
 */
export function WalletUiFundAccount({ address, cluster }: { address: Address; cluster: Cluster }) {
  const client = useAppClient()

  if (!('airdrop' in client)) {
    return null
  }

  return <FundAccount address={address} client={client} cluster={cluster} />
}

function FundAccount({ address, client, cluster }: { address: Address; client: ClientWithAirdrop; cluster: Cluster }) {
  const { dispatch, error, isRunning } = useAirdrop(client)
  const faucetUrl = getFaucetUrl(cluster, address)

  return (
    <div className="bg-muted/40 flex flex-col gap-2 rounded-lg border p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button disabled={isRunning} onClick={() => dispatch(address, ONE_SOL)} size="sm" variant="outline">
          {isRunning ? 'Requesting…' : 'Airdrop 1 SOL'}
        </Button>
        {faucetUrl ? (
          <span className="text-muted-foreground text-xs">
            or use{' '}
            <a
              className="text-primary inline-flex items-center gap-1 underline underline-offset-4"
              href={faucetUrl}
              rel="noreferrer"
              target="_blank"
            >
              the web faucet
              <ExternalLinkIcon className="size-3" />
            </a>
          </span>
        ) : null}
      </div>
      {error ? (
        <p className="text-destructive text-xs">
          {formatError(error, 'The airdrop failed.')}
          {faucetUrl ? ' The RPC faucet is heavily rate limited — the web faucet is more reliable.' : ''}
        </p>
      ) : null}
    </div>
  )
}
