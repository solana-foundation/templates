import type { Address } from 'gill'
import { useWalletUi } from '@wallet-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useGetBalanceQueryKey } from './use-get-balance-query-key'

export function useGetBalanceQuery({ address }: { address: Address }) {
  const { client } = useWalletUi()

  return useQuery({
    retry: false,
    queryKey: useGetBalanceQueryKey({ address }),
    queryFn: () => client.rpc.getBalance(address).send(),
  })
}
