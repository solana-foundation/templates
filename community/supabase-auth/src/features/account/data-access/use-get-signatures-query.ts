'use client'

import { useMemo } from 'react'
import { address as toAddress } from '@solana/kit'
import { useRequest } from '@solana/react'
import { useSolana } from '@/components/provider'

export function useGetSignaturesQuery({ address }: { address: string }) {
  const { client } = useSolana()
  const source = useMemo(
    () => client.rpc.getSignaturesForAddress(toAddress(address), { commitment: 'confirmed', limit: 100 }),
    [client, address],
  )
  const query = useRequest(source)
  return {
    ...query,
    isLoading: query.status === 'fetching',
    isError: query.status === 'error',
    refetch: async () => query.refresh(),
  }
}
