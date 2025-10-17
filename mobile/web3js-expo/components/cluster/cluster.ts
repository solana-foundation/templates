import { IdentifierString } from '@wallet-standard/core'
import { ClusterNetwork } from '@/components/cluster/cluster-network'

export interface Cluster {
  id: IdentifierString
  name: string
  endpoint: string
  network: ClusterNetwork
  active?: boolean
}
