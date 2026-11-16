import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { AppText } from '@/components/app-text'
import { Cluster } from '@/components/cluster/cluster'

export function ClusterUiVersion({ selectedCluster }: { selectedCluster: Cluster }) {
  const { connection } = useMobileWallet()
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

  if (!query.data) {
    return <AppText>Version: {query.isError ? 'Unable to load' : 'Loading...'}</AppText>
  }

  // A failed refetch keeps the last known value, so label it instead of passing it off as current.
  return (
    <AppText>
      Version: {query.data.core} ({query.data.features}){query.isError ? ' (refresh failed)' : ''}
    </AppText>
  )
}
