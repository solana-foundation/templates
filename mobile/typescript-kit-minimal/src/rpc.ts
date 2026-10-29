import { createClient } from '@solana/kit'
import { rpcAirdrop, solanaRpcConnection } from '@solana/kit-plugin-rpc'

import { RPC_URL } from './cluster'

/**
 * The app's connection to the cluster: `client.rpc`, `client.rpcSubscriptions` and
 * `client.airdrop`.
 *
 * A module-level constant rather than a provider. With one network there is exactly one client for
 * the lifetime of the page, and the job a framework does here — creating it once and handing it
 * down a tree — is what an ES module already does.
 *
 * Kit's plugins are worth taking even in a template about doing without a framework, because they
 * are not one: `createClient().use(...)` composes plain functions and the result is a plain object.
 * These two are what they save:
 *
 * - `solanaRpcConnection` installs both `rpc` and `rpcSubscriptions`, deriving the websocket URL
 *   from `rpcUrl` by swapping `http` for `ws`. Spelling that out by hand is the sort of line that
 *   works until someone points the app at an endpoint that serves its socket elsewhere.
 * - `rpcAirdrop` installs `client.airdrop(address, amount)`, which requests and then waits on a
 *   signature subscription rather than polling `getSignatureStatuses` — so it resolves the moment
 *   the transaction lands. It is also typed to refuse a mainnet RPC, which has no faucet to ask.
 *
 * `RPC_URL` is branded devnet, and that brand is what carries `requestAirdrop` through to here.
 */
export const client = createClient()
  .use(solanaRpcConnection({ rpcUrl: RPC_URL }))
  .use(rpcAirdrop())
