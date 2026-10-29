import { registerMwa } from '@solana-mobile/wallet-standard-mobile'

import { CHAIN } from './cluster'

/**
 * Registers Mobile Wallet Adapter as a wallet-standard wallet.
 *
 * This is the whole mobile-wallet integration: MWA joins the same registry browser extensions
 * announce themselves on, so `src/wallet-store.ts` discovers it alongside everything else and no
 * code below this point knows the difference.
 *
 * Without `VITE_MWA_REMOTE_HOST_AUTHORITY` set, MWA appears only in Chrome on Android and in a
 * Solana Mobile web shell, where it connects to a wallet installed on the same device. Pointing
 * that variable at a reflector host additionally offers the QR code flow, which pairs a desktop
 * browser with a wallet on a phone.
 *
 * Call this once, before anything reads the registry.
 */
export function registerMobileWalletAdapter(): void {
  const remoteHostAuthority = import.meta.env.VITE_MWA_REMOTE_HOST_AUTHORITY

  registerMwa({
    appIdentity: {
      icon: 'favicon.svg',
      name: 'TypeScript Kit Minimal',
      uri: window.location.origin,
    },
    chains: [CHAIN],
    ...(remoteHostAuthority ? { remoteHostAuthority } : {}),
  })
}
