import { defineSeekerConnectElements } from '@solana-mobile/seeker-connect-ui'
import { registerSeekerConnect } from '@solana-mobile/seeker-connect-wallet-standard'

import { CHAIN } from './cluster'

/**
 * Registers Seeker Connect as a wallet-standard wallet, and defines its custom elements.
 *
 * Seeker Connect reaches the Seeker device's built-in wallet directly over Mobile Wallet Adapter,
 * with Seeker-branded UI instead of the generic wallet chooser. Registration only adds it to the
 * registry; connecting works when the app runs in a browser on the Seeker itself, where the wallet
 * app can be launched. Anywhere else a connection attempt fails with `association-failed`.
 *
 * The wallet advertises exactly one chain, fixed at registration, so it follows {@link CHAIN}.
 * Sessions are per-interaction: every connect and sign launches the wallet through a short-lived
 * relay session, and "connected" means a cached authorization that is replayed silently on the next
 * request.
 *
 * `firstConnectWalletBaseUri` is deliberately unset: the `connect.solanamobile.com` App Link domain
 * is not live yet, so first connections use the generic `solana-wallet:` scheme.
 *
 * `defineSeekerConnectElements` registers `<seeker-connect-button>` and the progress and error
 * dialogs the wallet shows around each interaction. They are Lit custom elements with their own
 * Shadow DOM, which is why they cost this template no framework and no styling of its own — and why
 * they follow `prefers-color-scheme` rather than anything in `global.css`. The call is idempotent.
 *
 * Call this once, before anything reads the registry.
 */
export function registerSeekerConnectWallet(): void {
  defineSeekerConnectElements()

  registerSeekerConnect({
    chain: CHAIN,
    identity: {
      icon: 'favicon.svg',
      name: 'TypeScript Kit Minimal',
      uri: window.location.origin,
    },
    relayDomain: 'relay.solanamobile.com',
  })
}
