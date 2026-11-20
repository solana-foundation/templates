import type { Address } from '@solana/kit'
import { useQuery } from '@tanstack/react-query'

import { useAppCluster } from '@/features/cluster/data-access/cluster-provider'

export function useGetTransactionSignatures(address: Address) {
  const { client, cluster } = useAppCluster()

  return useQuery({
    queryFn: async () =>
      await client.rpc
        .getSignaturesForAddress(address, {
          commitment: 'confirmed',
          limit: 25,
        })
        .send(),
    queryKey: ['get-transaction-signatures', cluster.id, cluster.url, address],
  })
}
