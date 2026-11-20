import { registerSeekerConnect } from '@solana-mobile/seeker-connect-wallet-standard'

import { DEFAULT_CLUSTER } from '@/features/cluster/data-access/clusters'

/**
 * Registers Seeker Connect as a wallet-standard wallet.
 *
 * Seeker Connect reaches the Seeker device's built-in wallet directly over Mobile Wallet Adapter,
 * with Seeker-branded UI instead of the generic wallet chooser. Registration only adds it to the
 * registry; connecting works when the app runs in a browser on the Seeker itself, where the wallet
 * app can be launched. Anywhere else a connection attempt fails with `association-failed`.
 *
 * The wallet advertises exactly one chain, fixed at registration, so it follows the app's default
 * cluster rather than the network picker. Sessions are per-interaction: every connect and sign
 * launches the wallet through a short-lived relay session, and "connected" means a cached
 * authorization that is replayed silently on the next request.
 *
 * `firstConnectWalletBaseUri` is deliberately unset: the `connect.solanamobile.com` App Link
 * domain is not live yet, so first connections use the generic `solana-wallet:` scheme.
 *
 * Call this once, before React renders.
 */
export function registerSeekerConnectWallet(): void {
  registerSeekerConnect({
    chain: DEFAULT_CLUSTER.id,
    identity: {
      icon: 'favicon.svg',
      name: 'React Kit Privy',
      uri: window.location.origin,
    },
    relayDomain: 'relay.solanamobile.com',
  })
}
