'use client'

import { useMemo } from 'react'
import type { Address, Lamports } from '@solana/kit'
import { useTrackedDataSWR } from '@solana/react/swr'
import { useAppClient } from '@/components/provider'
import { useCluster } from '@/components/solana/cluster-provider'

export function useBalance(address?: Address) {
  const { cluster } = useCluster()
  const client = useAppClient()

  const spec = useMemo(
    () =>
      address
        ? {
            initialValueSource: client.rpc.getBalance(address, { commitment: 'confirmed' as const }),
            initialValueMapper: (lamports: Lamports) => lamports,
            streamSource: client.rpcSubscriptions.accountNotifications(address, { commitment: 'confirmed' as const }),
            streamValueMapper: ({ lamports }: { lamports: Lamports }) => lamports,
          }
        : null,
    [client, address],
  )

  const { data, error } = useTrackedDataSWR(address ? (['balance', cluster.id, address] as const) : null, spec)

  return {
    lamports: data?.value ?? null,
    isLoading: address != null && data == null && error == null,
    error,
  }
}
