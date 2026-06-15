import { ed25519 } from '@noble/curves/ed25519.js'
import { PublicKey } from '@solana/web3.js'

/**
 * Local, dependency-free ed25519 verification.
 *
 * EdDSA verifies the *message* directly (the hash is applied internally), so
 * this is exactly what Solana validators do when they check the dWallet's
 * signature on a transaction message.
 */
export function verifyEd25519(params: { message: Uint8Array; signature: Uint8Array; publicKey: Uint8Array }): boolean {
  try {
    return ed25519.verify(params.signature, params.message, params.publicKey)
  } catch {
    return false
  }
}

/** Resolve a base58 Solana address to its 32 raw public-key bytes. */
export function addressToPublicKeyBytes(address: string): Uint8Array {
  return new PublicKey(address).toBytes()
}

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.trim().replace(/^0x/, '')
  if (clean.length % 2 !== 0) throw new Error('Hex string must have an even length')
  const out = new Uint8Array(clean.length / 2)
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16)
  }
  return out
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
