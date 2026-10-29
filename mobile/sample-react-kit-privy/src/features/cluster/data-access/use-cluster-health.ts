import { useRequestQuery } from '@solana/react/query'

import { useAppClient } from '@/features/core/data-access/use-app-client'

import { identifyCluster } from './clusters'

export type ClusterHealth =
  | { status: 'checking' }
  | { status: 'ok' }
  | { status: 'unreachable'; error: unknown }
  | { status: 'mismatch'; actual: string }

/**
 * Checks that the active cluster's RPC is reachable and is the network it claims to be.
 *
 * `getGenesisHash` answers both questions in one call: a refused connection means nothing is
 * listening, and a hash that belongs to a different network means the endpoint is not what the
 * picker says it is — the failure mode when an RPC URL is pasted into the wrong variable.
 *
 * Retries are off. A validator that is not running will not start during a backoff, and retrying
 * turns an instant, accurate answer into several seconds of ambiguity.
 */
export function useClusterHealth(): ClusterHealth {
  const { chain, rpc } = useAppClient()

  const { data, error, isError } = useRequestQuery(['cluster-genesis-hash', chain], rpc.getGenesisHash(), {
    getAbortSignal: () => AbortSignal.timeout(5_000),
    retry: false,
    staleTime: 30_000,
  })

  if (isError) {
    return { error, status: 'unreachable' }
  }
  if (!data) {
    return { status: 'checking' }
  }

  const actual = identifyCluster(data)
  return actual === chain ? { status: 'ok' } : { actual, status: 'mismatch' }
}
