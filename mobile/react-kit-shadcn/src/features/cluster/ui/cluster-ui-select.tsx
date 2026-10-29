import { useConnectedWallet } from '@solana/kit-plugin-wallet/react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCluster } from '@/features/cluster/data-access/cluster-context'
import { getCluster, type Cluster } from '@/features/cluster/data-access/clusters'
import { useAppClient } from '@/features/core/data-access/use-app-client'

/**
 * Switching networks rebuilds the client, which disconnects the current wallet: one client targets
 * one chain, and the wallet was authorized against the old one.
 *
 * Networks the connected wallet does not advertise are disabled rather than hidden. Picking one
 * would drop the wallet out of the rebuilt client's discovery and silently disconnect it — a
 * disabled row that names the wallet explains why that network is unavailable, where a missing row
 * would just look like the app forgot about it.
 */
export function ClusterUiSelect() {
  const { cluster, clusters, setCluster } = useCluster()
  const connected = useConnectedWallet(useAppClient())

  function isSupported(candidate: Cluster) {
    return !connected || connected.wallet.chains.includes(candidate.id)
  }

  return (
    <Select onValueChange={(value) => setCluster(getCluster(value))} value={cluster.id}>
      <SelectTrigger aria-label="Select network" className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="min-w-[220px]">
        {clusters.map((item) => (
          <SelectItem disabled={!isSupported(item)} key={item.id} value={item.id}>
            {item.label}
            {isSupported(item) ? null : (
              <span className="text-muted-foreground ml-auto text-xs">Not in {connected?.wallet.name}</span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
