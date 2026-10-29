import { devnet } from '@solana/kit'
import { SOLANA_DEVNET_CHAIN } from '@solana/wallet-standard-chains'

/**
 * The one network this app talks to.
 *
 * A network picker is deliberately absent. One chain means one RPC endpoint and one set of wallets
 * that advertise it, so nothing here is rebuilt or re-filtered at runtime — which is what keeps the
 * wallet store and the render pass short enough to read in one sitting. To offer a second network,
 * make these values state and rebuild `src/rpc.ts` when they change.
 */
export const CHAIN = SOLANA_DEVNET_CHAIN

export const CLUSTER_LABEL = 'Devnet'

const rpcUrl = import.meta.env.VITE_RPC_URL_DEVNET || 'https://api.devnet.solana.com'

/**
 * `devnet()` is a type-level brand and not a request: it is what tells Kit this endpoint has the
 * devnet-only RPC methods, which is how `requestAirdrop` reaches the client at all.
 */
export const RPC_URL = devnet(rpcUrl)

/** Links a transaction signature or an address to Solana Explorer, on this cluster. */
export function getExplorerUrl(path: string): string {
  const url = new URL(path, 'https://explorer.solana.com')
  url.searchParams.set('cluster', 'devnet')
  return url.toString()
}

/**
 * Links to the web faucet with the network and address pre-filled.
 *
 * Worth offering next to the RPC airdrop, because the RPC one is aggressively rate limited and
 * returns 429 far more often than it succeeds.
 */
export function getFaucetUrl(address: string): string {
  const url = new URL('https://faucet.solana.com')
  url.searchParams.set('cluster', 'devnet')
  url.searchParams.set('walletAddress', address)
  return url.toString()
}
