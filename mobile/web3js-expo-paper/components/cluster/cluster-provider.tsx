import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { AppConfig } from '@/constants/app-config'
import { Cluster } from '@/components/cluster/cluster'
import { ClusterNetwork } from '@/components/cluster/cluster-network'

export interface ClusterProviderContext {
  selectedCluster: Cluster
  clusters: Cluster[]
  setSelectedCluster: (cluster: Cluster) => void

  getExplorerUrl(path: string): string
}

const Context = createContext<ClusterProviderContext>({} as ClusterProviderContext)

export function ClusterProvider({ children }: { children: ReactNode }) {
  const [selectedCluster, setSelectedCluster] = useState<Cluster>(AppConfig.clusters[0])
  const value: ClusterProviderContext = useMemo(
    () => ({
      selectedCluster,
      clusters: [...AppConfig.clusters].sort((a, b) => (a.name > b.name ? 1 : -1)),
      setSelectedCluster: (cluster: Cluster) => setSelectedCluster(cluster),
      getExplorerUrl: (path: string) => `https://explorer.solana.com/${path}${getClusterUrlParam(selectedCluster)}`,
    }),
    [selectedCluster, setSelectedCluster],
  )
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useCluster() {
  return useContext(Context)
}

function getClusterUrlParam(cluster: Cluster): string {
  let suffix = ''
  switch (cluster.network) {
    case ClusterNetwork.Devnet:
      suffix = 'devnet'
      break
    case ClusterNetwork.Mainnet:
      suffix = ''
      break
    case ClusterNetwork.Testnet:
      suffix = 'testnet'
      break
    default:
      suffix = `custom&customUrl=${encodeURIComponent(cluster.endpoint)}`
      break
  }

  return suffix.length ? `?cluster=${suffix}` : ''
}
