import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useClusterHealth } from '@/features/cluster/data-access/use-cluster-health'
import { CLUSTERS, getCluster } from '@/features/cluster/data-access/clusters'
import { useAppCluster } from '@/features/core/data-access/use-app-cluster'

/**
 * Explains a bad endpoint once, up front, instead of letting the rest of the app fail one card at a
 * time.
 *
 * An unreachable Localnet gets the command that fixes it, because it almost always means the
 * validator has not been started yet. Everything else gets the endpoint it failed to reach, or the
 * network it turned out to be.
 */
export function ClusterUiOfflineAlert() {
  const cluster = useAppCluster()
  const health = useClusterHealth()

  if (health.status === 'checking' || health.status === 'ok') {
    return null
  }

  if (health.status === 'mismatch') {
    const actual = getCluster(health.actual)
    // Only point at the network menu when the detected network is actually in it. Mainnet stays out
    // of the picker until `VITE_RPC_URL_MAINNET` names an endpoint, and telling someone to pick an
    // entry that is not there reads as a broken app rather than a wrong endpoint.
    const offered = CLUSTERS.some((candidate) => candidate.id === actual.id)
    return (
      <Alert variant="destructive">
        <AlertTitle>This endpoint is not {cluster.label}</AlertTitle>
        <AlertDescription>
          <span>
            <code className="font-mono text-xs">{cluster.rpcUrl}</code> reports the genesis hash of {actual.label}.{' '}
            {offered ? (
              <>
                Point it at {cluster.label}, or pick {actual.label} in the network menu.
              </>
            ) : (
              <>
                Point it at {cluster.label}, or set <code className="font-mono text-xs">VITE_RPC_URL_MAINNET</code> and
                restart to offer {actual.label} in the network menu.
              </>
            )}
          </span>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive">
      <AlertTitle>Can&apos;t reach the {cluster.label} RPC</AlertTitle>
      <AlertDescription>
        {cluster.id === 'solana:localnet' ? (
          <>
            <span>Start a local validator and this page will connect on its own:</span>
            <code className="bg-muted text-foreground w-full rounded px-2 py-1 font-mono text-xs break-all">
              npx solana-mobile@latest localnet start
            </code>
          </>
        ) : (
          <span>
            Nothing answered at <code className="font-mono text-xs">{cluster.rpcUrl}</code>.
          </span>
        )}
      </AlertDescription>
    </Alert>
  )
}
