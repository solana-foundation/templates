'use client'

import { useCallback, useEffect, useState } from 'react'
import { toAddress } from '@solana/client'
import { useSolanaClient, useClusterState } from '@solana/react-hooks'

type SignatureResult = {
  blockTime: number | null
  confirmationStatus?: string
  err: unknown
  memo?: string | null
  signature: string
  slot: number
}

export function useGetSignaturesQuery({ address }: { address: string }) {
  const client = useSolanaClient()
  const cluster = useClusterState()
  const [data, setData] = useState<SignatureResult[] | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<unknown>()

  const fetchSignatures = useCallback(async () => {
    if (!address) return
    setIsLoading(true)
    try {
      const res = await client.runtime.rpc.getSignaturesForAddress(toAddress(address)).send()
      setData(res ?? [])
      setError(undefined)
    } catch (err) {
      setError(err)
      setData([])
    } finally {
      setIsLoading(false)
    }
  }, [address, client])

  useEffect(() => {
    fetchSignatures().catch((err) => console.error(err))
  }, [fetchSignatures, cluster.endpoint])

  return {
    data,
    isLoading,
    isError: Boolean(error),
    error,
    refetch: fetchSignatures,
  }
}
