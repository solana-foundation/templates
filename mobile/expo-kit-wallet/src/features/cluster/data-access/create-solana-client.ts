import { createClient } from '@solana/kit'
import { solanaRpcConnection } from '@solana/kit-plugin-rpc'
import type { SolanaCluster } from '@wallet-ui/react-native-kit'

export function createSolanaClient(cluster: SolanaCluster) {
  return createClient().use(
    solanaRpcConnection({
      rpcSubscriptionsUrl: cluster.urlWs,
      rpcUrl: cluster.url,
    }),
  )
}

export type SolanaClient = ReturnType<typeof createSolanaClient>
