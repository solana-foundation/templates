import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'

/**
 * The Sui "operator" is a generated Ed25519 keypair that pays Ika fees and
 * signs the Sui transactions that drive DKG / presign / sign.
 *
 * We generate it in-app (rather than connecting a browser wallet) so the
 * template works with zero wallet setup and no connection failures. It's a
 * throwaway testnet fee-payer: fund it with SUI from the faucet and a little
 * IKA (sent to its address), and it just works.
 *
 * ⚠️ TEACHING TOOL ONLY. The secret key lives in localStorage, which is fine
 * for a devnet/testnet demo but is NOT production key management. A real app
 * would use a wallet or a server-side relayer / gas station.
 */

const OPERATOR_STORAGE_KEY = 'ika-template:operator-keypair:sui'

/** Restore the persisted operator keypair, or null if none has been generated. */
export function getOperatorKeypair(): Ed25519Keypair | null {
  const stored = localStorage.getItem(OPERATOR_STORAGE_KEY)
  if (!stored) return null
  try {
    // Stored as a bech32 `suiprivkey1...` string.
    return Ed25519Keypair.fromSecretKey(stored)
  } catch {
    return null
  }
}

/** Generate a fresh operator keypair, persist it, and return it. */
export function generateOperatorKeypair(): Ed25519Keypair {
  const keypair = Ed25519Keypair.generate()
  localStorage.setItem(OPERATOR_STORAGE_KEY, keypair.getSecretKey())
  return keypair
}

export function hasOperator(): boolean {
  return getOperatorKeypair() !== null
}

/** The operator's Sui address, or null if not generated. */
export function operatorAddress(): string | null {
  return getOperatorKeypair()?.toSuiAddress() ?? null
}

/** Wipe the operator keypair. */
export function clearOperator(): void {
  localStorage.removeItem(OPERATOR_STORAGE_KEY)
}
