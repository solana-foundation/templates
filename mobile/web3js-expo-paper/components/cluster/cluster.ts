import { IdentifierString } from '@wallet-standard/base'
import { ClusterNetwork } from '@/components/cluster/cluster-network'

export interface Cluster {
  id: IdentifierString
  name: string
  endpoint: string
  network: ClusterNetwork
  active?: boolean
}
