import { useConnection } from '@/components/solana/solana-provider'
import { useQuery } from '@tanstack/react-query'
import { AppText } from '@/components/app-text'
import React from 'react'
import { ellipsify } from '@/utils/ellipsify'
import { Cluster } from '@/components/cluster/cluster'

export function ClusterUiGenesisHash({ selectedCluster }: { selectedCluster: Cluster }) {
  const connection = useConnection()
  const query = useQuery({
    queryKey: ['get-genesis-hash', { selectedCluster }],
    queryFn: () => connection.getGenesisHash(),
  })

  return <AppText>Genesis Hash: {query.isLoading ? 'Loading...' : `${ellipsify(query.data, 8)}`}</AppText>
}
