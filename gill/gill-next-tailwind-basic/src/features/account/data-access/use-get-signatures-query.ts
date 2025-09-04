import type { Address } from 'gill'
import { useSolana } from '@/components/solana/use-solana'
import { useQuery } from '@tanstack/react-query'
import { useGetSignaturesQueryKey } from './use-get-signatures-query-key'

export function useGetSignaturesQuery({ address }: { address: Address }) {
  const { client } = useSolana()

  return useQuery({
    queryKey: useGetSignaturesQueryKey({ address }),
    queryFn: () => client.rpc.getSignaturesForAddress(address).send(),
  })
}
