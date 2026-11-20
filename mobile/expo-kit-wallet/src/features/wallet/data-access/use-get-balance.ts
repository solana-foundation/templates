import type { Address } from '@solana/kit'
import { useQuery } from '@tanstack/react-query'

import { useAppCluster } from '@/features/cluster/data-access/cluster-provider'

export function useGetBalance(address: Address) {
  const { client, cluster } = useAppCluster()

  return useQuery({
    queryFn: async () => await client.rpc.getBalance(address, { commitment: 'confirmed' }).send(),
    queryKey: ['get-balance', cluster.id, cluster.url, address],
  })
}
