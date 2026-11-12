import { useQuery } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { AppText } from '@/components/app-text'
import React from 'react'
import { ellipsify } from '@/utils/ellipsify'
import { Cluster } from '@/components/cluster/cluster'

export function ClusterUiGenesisHash({ selectedCluster }: { selectedCluster: Cluster }) {
  const { connection } = useMobileWallet()
  const query = useQuery({
    queryKey: ['get-genesis-hash', { selectedCluster }],
    queryFn: () => connection.getGenesisHash(),
  })

  if (!query.data) {
    return <AppText>Genesis Hash: {query.isError ? 'Unable to load' : 'Loading...'}</AppText>
  }

  // A failed refetch keeps the last known value, so label it instead of passing it off as current.
  return (
    <AppText>
      Genesis Hash: {ellipsify(query.data, 8)}
      {query.isError ? ' (refresh failed)' : ''}
    </AppText>
  )
}
