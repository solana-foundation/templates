import { Address } from 'gill'
import { useQuery } from '@tanstack/react-query'
import { useWalletUi } from '@wallet-ui/react'

import { useGetSignaturesQueryKey } from './use-get-signatures-query-key'

export function useGetSignaturesQuery({ address }: { address: Address }) {
  const { client } = useWalletUi()

  return useQuery({
    queryKey: useGetSignaturesQueryKey({ address }),
    queryFn: () => client.rpc.getSignaturesForAddress(address).send(),
  })
}
