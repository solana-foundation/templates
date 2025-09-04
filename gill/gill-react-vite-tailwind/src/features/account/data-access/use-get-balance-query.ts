import type { Address } from 'gill'
import { useSolana } from '@/components/solana/use-solana'
import { useQuery } from '@tanstack/react-query'
import { useGetBalanceQueryKey } from './use-get-balance-query-key'

export function useGetBalanceQuery({ address }: { address: Address }) {
  const { client } = useSolana()

  return useQuery({
    retry: false,
    queryKey: useGetBalanceQueryKey({ address }),
    queryFn: () => client.rpc.getBalance(address).send(),
  })
}
