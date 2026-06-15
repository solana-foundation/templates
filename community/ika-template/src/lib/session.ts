import { UserShareEncryptionKeys, Curve } from '@ika.xyz/sdk'
import { Keypair } from '@solana/web3.js'

import { deriveUserShareKeysInWorker } from './ika-worker-client'

/**
 * The "user share" identity, represented as a generated Solana keypair.
 *
 * In Ika's 2PC-MPC every signature needs two shares:
 *   - the *user share* (this), and
 *   - the *Ika network share* (held t-of-N across Ika validators, never local).
 * Neither can sign alone, and the full key is never assembled anywhere.
 *
 * The user share is really just 32 bytes of entropy fed into
 * `UserShareEncryptionKeys.fromRootSeedKey`. A Solana keypair's secret is
 * exactly 32 bytes of ed25519 seed, so we generate a keypair here to make the
 * "this is your half" idea tangible. In a real app this could be the user's own
 * wallet or any key they control.
 *
 * NOTE: this keypair is ONLY the user-share identity. It is NOT the dWallet
 * (whose address comes from DKG) and NOT the user's Phantom wallet.
 *
 * Deriving UserShareEncryptionKeys from the seed is a heavy (~8s) synchronous
 * WASM op (class-groups keypair), so we run it in a Web Worker and cache the
 * serialized result. Restoring from those bytes is cheap and synchronous.
 *
 * ⚠️ TEACHING TOOL ONLY. Stored in localStorage, which is fine for
 * devnet/testnet but not production key management. Clearing browser storage
 * (or regenerating) loses access to dWallets created with the old keypair.
 */

const KEYPAIR_STORAGE_KEY = 'ika-template:user-share-keypair:ed25519'
const ENC_KEYS_STORAGE_KEY = 'ika-template:user-share-enc-keys:ed25519'

/** Restore the persisted user-share keypair, or null if none has been generated. */
export function getUserShareKeypair(): Keypair | null {
  const stored = localStorage.getItem(KEYPAIR_STORAGE_KEY)
  if (!stored) return null
  try {
    return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(stored)))
  } catch {
    return null
  }
}

/**
 * Generate a fresh user-share keypair, persist it, and derive + cache its
 * encryption keys in the worker (so the later "Create dWallet" click is instant
 * instead of freezing for ~8s). Returns the keypair.
 */
export async function generateUserShareKeypair(): Promise<Keypair> {
  const keypair = Keypair.generate()
  localStorage.setItem(KEYPAIR_STORAGE_KEY, JSON.stringify(Array.from(keypair.secretKey)))
  localStorage.removeItem(ENC_KEYS_STORAGE_KEY)
  // Derive the encryption keys off-thread now and cache them.
  await ensureEncryptionKeysCached(keypair)
  return keypair
}

export function hasUserShare(): boolean {
  return getUserShareKeypair() !== null
}

/** The user-share keypair's public key (base58), for display. Null if not generated. */
export function userSharePublicKey(): string | null {
  return getUserShareKeypair()?.publicKey.toBase58() ?? null
}

/** Wipe the local user-share keypair + cached encryption keys. */
export function clearUserShare(): void {
  localStorage.removeItem(KEYPAIR_STORAGE_KEY)
  localStorage.removeItem(ENC_KEYS_STORAGE_KEY)
}

/** Derive (in the worker) and cache the serialized encryption keys for a keypair. */
async function ensureEncryptionKeysCached(keypair: Keypair): Promise<Uint8Array> {
  const cached = localStorage.getItem(ENC_KEYS_STORAGE_KEY)
  if (cached) {
    try {
      return Uint8Array.from(JSON.parse(cached))
    } catch {
      // fall through and re-derive
    }
  }
  // A Solana secretKey is 64 bytes (seed || pubkey); the first 32 are the seed.
  const seed = keypair.secretKey.slice(0, 32)
  const bytes = await deriveUserShareKeysInWorker({ rootSeed: seed, curve: Curve.ED25519 })
  localStorage.setItem(ENC_KEYS_STORAGE_KEY, JSON.stringify(Array.from(bytes)))
  return bytes
}

/**
 * Get the UserShareEncryptionKeys (ED25519). The expensive derivation runs in
 * the worker (and is normally already cached from generate time); restoring
 * from the cached bytes here is cheap and synchronous.
 *
 * @throws if no user-share keypair has been generated yet.
 */
export async function getUserShareEncryptionKeys(): Promise<UserShareEncryptionKeys> {
  const keypair = getUserShareKeypair()
  if (!keypair) {
    throw new Error('No user share yet. Generate your user-share keypair first.')
  }
  const bytes = await ensureEncryptionKeysCached(keypair)
  return UserShareEncryptionKeys.fromShareEncryptionKeysBytes(bytes)
}
