/**
 * Local registry of dWallets created during this browser session.
 *
 * We persist just enough to use a dWallet again (its on-chain IDs + Solana
 * address). The secret material lives in the 2PC-MPC protocol, not here.
 */

export interface StoredDWallet {
  /** Ika dWallet object id (on Sui). */
  dWalletID: string
  /** Ika dWallet capability id, proves the holder may use this dWallet. */
  dWalletCapID: string
  /** The encrypted user secret key share id, needed at sign time. */
  encryptedUserSecretKeyShareID: string
  /** The dWallet's ED25519 public key as a Solana address (base58). */
  solanaAddress: string
  /** When it was created (ISO). */
  createdAt: string
  /** A human label. */
  label?: string
}

const STORAGE_KEY = 'ika-template:dwallets'

export function listDWallets(): StoredDWallet[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as StoredDWallet[]) : []
  } catch {
    return []
  }
}

export function saveDWallet(dWallet: StoredDWallet): void {
  const all = listDWallets()
  const without = all.filter((d) => d.dWalletID !== dWallet.dWalletID)
  localStorage.setItem(STORAGE_KEY, JSON.stringify([dWallet, ...without]))
}

export function getDWallet(dWalletID: string): StoredDWallet | undefined {
  return listDWallets().find((d) => d.dWalletID === dWalletID)
}

export function removeDWallet(dWalletID: string): void {
  const all = listDWallets().filter((d) => d.dWalletID !== dWalletID)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}
