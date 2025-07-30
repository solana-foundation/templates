import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useConnection } from '../solana/solana-provider'
import { AppText } from '@/components/app-text'
import { Cluster } from '@/components/cluster/cluster'

export function ClusterUiVersion({ selectedCluster }: { selectedCluster: Cluster }) {
  const connection = useConnection()
  const query = useQuery({
    queryKey: ['get-version', { selectedCluster }],
    queryFn: () =>
      connection.getVersion().then((version) => {
        return {
          core: version['solana-core'],
          features: version['feature-set'],
        }
      }),
  })

  return <AppText>Version: {query.isLoading ? 'Loading...' : `${query.data?.core} (${query.data?.features})`}</AppText>
}
