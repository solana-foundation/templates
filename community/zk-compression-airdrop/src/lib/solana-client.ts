import { createClient } from '@solana/kit'
import { solanaRpc } from '@solana/kit-plugin-rpc'
import { walletSigner } from '@solana/kit-plugin-wallet'
import type { ClusterOption } from '@/components/solana/clusters'

export function createAppClient(cluster: ClusterOption) {
  const chain =
    cluster.id === 'mainnet-beta'
      ? 'solana:mainnet'
      : cluster.id === 'testnet'
        ? 'solana:testnet'
        : cluster.id === 'devnet'
          ? 'solana:devnet'
          : null
  if (!chain) throw new Error('Select a supported Solana network')
  return createClient()
    .use(walletSigner({ chain }))
    .use(
      solanaRpc({
        rpcUrl: cluster.endpoint,
        rpcSubscriptionsUrl: cluster.websocket,
        transactionConfig: { version: 1 },
      }),
    )
}
export type AppClient = ReturnType<typeof createAppClient>
