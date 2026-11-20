'use client'

import { useCallback } from 'react'
import { useRequest } from '@solana/react'
import { useSolana } from '@/components/provider'
import { getTokenAccountsByOwner } from './get-token-accounts-by-owner'

export function useGetTokenAccountsQuery({ address }: { address: string }) {
  const { client } = useSolana()
  const fetchAccounts = useCallback(
    async (signal: AbortSignal) => {
      const results = await Promise.all([
        getTokenAccountsByOwner(client, { address, programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' }, signal),
        getTokenAccountsByOwner(client, { address, programId: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb' }, signal),
      ])
      return results.flat()
    },
    [client, address],
  )
  const query = useRequest(fetchAccounts)
  return {
    ...query,
    isLoading: query.status === 'fetching',
    isError: query.status === 'error',
    isSuccess: query.status === 'success',
    refetch: async () => query.refresh(),
  }
}
