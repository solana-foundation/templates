import { COUNTER_PROGRAM_ADDRESS } from '@project/anchor'
import { useSolana } from '@/components/solana/use-solana'
import { useQuery } from '@tanstack/react-query'
import { useClusterVersion } from '@/features/cluster/data-access/use-cluster-version'

export function useCounterProgram() {
  const { client, cluster } = useSolana()
  const query = useClusterVersion()

  return useQuery({
    retry: false,
    queryKey: ['get-program-account', { cluster, clusterVersion: query.data }],
    queryFn: () => client.rpc.getAccountInfo(COUNTER_PROGRAM_ADDRESS).send(),
  })
}
