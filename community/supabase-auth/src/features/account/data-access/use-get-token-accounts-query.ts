'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSolanaClient, useClusterState } from '@solana/react-hooks'
import { getTokenAccountsByOwner } from './get-token-accounts-by-owner'

const TOKEN_PROGRAM_ID = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
const TOKEN_2022_PROGRAM_ID = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'

export function useGetTokenAccountsQuery({ address }: { address: string }) {
  const client = useSolanaClient()
  const cluster = useClusterState()
  const [data, setData] = useState<any[] | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<unknown>()

  const fetchAccounts = useCallback(async () => {
    if (!address) return
    setIsLoading(true)
    try {
      const [tokenAccounts, token2022Accounts] = await Promise.all([
        getTokenAccountsByOwner(client, { address, programId: TOKEN_PROGRAM_ID }),
        getTokenAccountsByOwner(client, { address, programId: TOKEN_2022_PROGRAM_ID }),
      ])
      setData([...(tokenAccounts ?? []), ...(token2022Accounts ?? [])])
      setError(undefined)
    } catch (err) {
      setError(err)
      setData([])
    } finally {
      setIsLoading(false)
    }
  }, [address, client])

  useEffect(() => {
    fetchAccounts().catch((err) => console.error(err))
  }, [fetchAccounts, cluster.endpoint])

  return {
    data,
    isLoading,
    isError: Boolean(error),
    isSuccess: !error && !isLoading,
    error,
    refetch: fetchAccounts,
  }
}
