import { Keypair } from '@solana/web3.js'
import bs58 from 'bs58'
import fs from 'fs'

export function loadKeypairFromEnv(): Keypair {
  const base58 = process.env.PRIVATE_KEY_BASE58
  const keyfile = process.env.SOLANA_KEYPAIR_PATH

  if (base58) {
    try {
      return Keypair.fromSecretKey(bs58.decode(base58))
    } catch (e) {
      throw new Error('Failed to decode PRIVATE_KEY_BASE58: ensure it is a valid base58-encoded 64-byte secret key.')
    }
  }

  if (keyfile) {
    const raw = fs.readFileSync(keyfile, 'utf8').trim()
    try {
      const arr = JSON.parse(raw)
      return Keypair.fromSecretKey(new Uint8Array(arr))
    } catch (e) {
      throw new Error('Failed to read SOLANA_KEYPAIR_PATH: ensure it points to a Solana CLI keypair JSON file.')
    }
  }

  throw new Error('Provide either PRIVATE_KEY_BASE58 or SOLANA_KEYPAIR_PATH in environment.')
}
