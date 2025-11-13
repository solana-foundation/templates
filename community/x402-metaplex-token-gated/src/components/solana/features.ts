import { SolanaSignMessage, type SolanaSignMessageFeature } from '@solana/wallet-standard-features'
import type { Wallet } from '@wallet-standard/base'

/**
 * Extracts the Solana message signing feature from a wallet.
 *
 * @param wallet - Wallet that may expose the message signing capability.
 * @returns The signing feature if available, otherwise undefined.
 */
export const getSolanaSignMessageFeature = (wallet: Wallet) =>
  (wallet.features as unknown as Partial<SolanaSignMessageFeature>)[SolanaSignMessage]
