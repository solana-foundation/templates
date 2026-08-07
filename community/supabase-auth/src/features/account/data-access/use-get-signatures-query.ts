'use client'

import { useCallback, useEffect, useState } from 'react'
import { address as toAddress, type GetSignaturesForAddressApi } from '@solana/kit'
import { useAppClient } from '@/components/provider'

type SignatureResult = ReturnType<GetSignaturesForAddressApi['getSignaturesForAddress']>[number]

export function useGetSignaturesQuery({ address }: { address: string }) {
  const client = useAppClient()
  const [data, setData] = useState<SignatureResult[] | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<unknown>()

  const fetchSignatures = useCallback(async () => {
    if (!address) return
    setIsLoading(true)
    try {
      const res = await client.rpc.getSignaturesForAddress(toAddress(address)).send()
      setData([...(res ?? [])])
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
  }, [fetchSignatures])

  return {
    data,
    isLoading,
    isError: Boolean(error),
    error,
    refetch: fetchSignatures,
  }
}
