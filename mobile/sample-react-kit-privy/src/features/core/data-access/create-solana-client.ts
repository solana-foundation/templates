import { memoProgram } from '@solana-program/memo'
import { createClient, extendClient } from '@solana/kit'
import { solanaDevnetRpc, solanaLocalRpc, solanaMainnetRpc, solanaTestnetRpc } from '@solana/kit-plugin-rpc'
import { walletSigner } from '@solana/kit-plugin-wallet'

import type { Cluster } from '@/features/cluster/data-access/clusters'

/**
 * Builds the Kit client for one cluster.
 *
 * `walletSigner` comes first because it is what sets `client.payer`, and the RPC plugin needs a
 * payer before it can install transaction planning and sending on top of it. The chain is then
 * stamped onto the client with `extendClient`, so consumers can read the active network back off
 * `useClient()` in lockstep with `rpc` — during a network switch the selected cluster changes one
 * render before the rebuilt client is published, and anything keyed on the network (a query key, an
 * explorer link) has to move with the client rather than ahead of it.
 *
 * The RPC plugin is picked per network rather than parameterised, because each one installs the
 * capabilities that network actually has: devnet, testnet, and localnet bundle `airdrop`, mainnet
 * does not. That keeps the return type a union whose mainnet member has no `airdrop`, which is what
 * lets the airdrop card narrow with `'airdrop' in client` instead of testing the network name.
 *
 * Two details keep that union alive, and both look redundant until it collapses:
 *
 * - The switch is on the destructured `id`, not on `cluster.id`. `Cluster` is not a discriminated
 *   union, so switching on the property narrows nothing; switching on the local narrows it to a
 *   literal in each branch.
 * - Every branch writes its own `extendClient` call, stamping that narrowed literal. Hoisting the
 *   call into one shared generic helper — or stamping the whole `Cluster` object, which has the
 *   same type everywhere — leaves the four branch types differing only by the presence of
 *   `airdrop`. TypeScript subtype-reduces the inferred return union to the mainnet member, and the
 *   airdrop capability disappears from the type with it.
 */
export function createSolanaClient(cluster: Cluster) {
  const { id, rpcUrl } = cluster
  const base = createClient().use(walletSigner({ chain: id }))

  switch (id) {
    case 'solana:mainnet':
      return base
        .use(solanaMainnetRpc({ rpcUrl }))
        .use((client) => extendClient(client, { chain: id }))
        .use(memoProgram())
    case 'solana:testnet':
      return base
        .use(solanaTestnetRpc({ rpcUrl }))
        .use((client) => extendClient(client, { chain: id }))
        .use(memoProgram())
    case 'solana:localnet':
      return base
        .use(solanaLocalRpc({ rpcUrl }))
        .use((client) => extendClient(client, { chain: id }))
        .use(memoProgram())
    case 'solana:devnet':
    default:
      return base
        .use(solanaDevnetRpc({ rpcUrl }))
        .use((client) => extendClient(client, { chain: id }))
        .use(memoProgram())
  }
}

/**
 * The concrete client type published to the tree. Pass it to `useClient<AppClient>()` at every read
 * site so the wallet namespace, `rpc`, `rpcSubscriptions`, `memo`, and `chain` are all typed.
 */
export type AppClient = ReturnType<typeof createSolanaClient>
