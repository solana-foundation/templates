import { createClient } from '@solana/kit'
import { rpcAirdrop, solanaRpc } from '@solana/kit-plugin-rpc'
import { walletSigner } from '@solana/kit-plugin-wallet'
import { systemProgram } from '@solana-program/system'
import type { ClusterOption } from './clusters'

export function createAppClient(cluster: ClusterOption) {
  return createClient()
    .use(walletSigner({ chain: cluster.chain }))
    .use(solanaRpc({ rpcUrl: cluster.endpoint, rpcSubscriptionsUrl: cluster.websocket }))
    .use(rpcAirdrop())
    .use(systemProgram())
}

export type AppClient = ReturnType<typeof createAppClient>
