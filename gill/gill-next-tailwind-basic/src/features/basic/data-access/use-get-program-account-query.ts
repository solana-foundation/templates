import { useWalletUi } from '@wallet-ui/react'
import { useQuery } from '@tanstack/react-query'
import { getBasicProgramId } from '@project/anchor'

export function useGetProgramAccountQuery() {
  const { client, cluster } = useWalletUi()

  return useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => client.rpc.getAccountInfo(getBasicProgramId(cluster.id)).send(),
  })
}
