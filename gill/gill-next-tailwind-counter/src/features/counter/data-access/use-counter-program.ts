import { useWalletUi } from '@wallet-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useClusterVersion } from '@/features/cluster/data-access/use-cluster-version'
import { useCounterProgramId } from './use-counter-program-id'

export function useCounterProgram() {
  const { client, cluster } = useWalletUi()
  const programId = useCounterProgramId()
  const query = useClusterVersion()

  return useQuery({
    retry: false,
    queryKey: ['get-program-account', { cluster, clusterVersion: query.data }],
    queryFn: () => client.rpc.getAccountInfo(programId).send(),
  })
}
