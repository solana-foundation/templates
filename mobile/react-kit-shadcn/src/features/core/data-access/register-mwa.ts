import { registerMwa } from '@solana-mobile/wallet-standard-mobile'

/**
 * Registers Mobile Wallet Adapter as a wallet-standard wallet.
 *
 * This is the whole mobile-wallet integration: MWA joins the same registry browser-extension
 * wallets announce themselves on, so the wallet plugin discovers it alongside everything else and
 * no code below this point knows the difference.
 *
 * Without `VITE_MWA_REMOTE_HOST_AUTHORITY` set, MWA appears only in Chrome on Android and in a
 * Solana Mobile web shell, where it connects to a wallet installed on the same device. Pointing
 * that variable at a reflector host additionally offers the QR code flow, which pairs a desktop
 * browser with a wallet on a phone.
 *
 * Localnet is deliberately absent from `chains`: mobile wallets do not carry a localnet
 * configuration, and the ones that resolve `solana:localnet` at all tend to map it to mainnet,
 * which surfaces as a confusing network mismatch at signing time rather than an honest refusal.
 *
 * Call this once, before React renders.
 */
export function registerMobileWalletAdapter(): void {
  const remoteHostAuthority = import.meta.env.VITE_MWA_REMOTE_HOST_AUTHORITY

  registerMwa({
    appIdentity: {
      icon: 'favicon.svg',
      name: 'React Kit Shadcn',
      uri: window.location.origin,
    },
    chains: ['solana:devnet', 'solana:testnet', 'solana:mainnet'],
    ...(remoteHostAuthority ? { remoteHostAuthority } : {}),
  })
}
