import { address as toAddress, type Lamports } from '@solana/kit'
import { useTrackedDataQuery } from '@solana/react/query'
import { useMemo } from 'react'

import { useAppClient } from '@/features/core/data-access/use-app-client'

/**
 * The account balance, seeded by one RPC read and kept current by an account subscription.
 *
 * `useTrackedDataQuery` runs both halves and hands back whichever is newer — the underlying store
 * dedupes on slot, so an initial fetch that resolves late can never overwrite a fresher
 * notification. The result lands in the TanStack Query cache, so two components asking for the same
 * balance share one socket.
 *
 * The cache key reads `chain` off the client rather than off the cluster context. Both hold the same
 * value in a steady state, but during a network switch the context flips one render before the
 * rebuilt client is published — keying on the context would file the new network's balance under
 * the old network's `rpc`.
 */
export function useWalletBalance(walletAddress: string | undefined) {
  const client = useAppClient()
  const { chain, rpc, rpcSubscriptions } = client

  const accountAddress = useMemo(() => (walletAddress ? toAddress(walletAddress) : undefined), [walletAddress])

  const spec = useMemo(() => {
    if (!accountAddress) {
      return null
    }
    return {
      initialValueMapper: (balance: Lamports) => balance,
      initialValueSource: rpc.getBalance(accountAddress, { commitment: 'confirmed' }),
      streamSource: rpcSubscriptions.accountNotifications(accountAddress),
      streamValueMapper: ({ lamports }: { lamports: Lamports }) => lamports,
    }
  }, [accountAddress, rpc, rpcSubscriptions])

  return useTrackedDataQuery(['balance', chain, accountAddress], spec)
}
