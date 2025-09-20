import { BASIC_PROGRAM_ADDRESS } from '@project/anchor'
import { useSolana } from '@/components/solana/use-solana'
import { useQuery } from '@tanstack/react-query'

export function useGetProgramAccountQuery() {
  const { client, cluster } = useSolana()

  return useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => client.rpc.getAccountInfo(BASIC_PROGRAM_ADDRESS).send(),
  })
}
