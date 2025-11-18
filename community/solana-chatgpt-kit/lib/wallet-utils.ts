/**
 * Wallet utility functions for external wallet integration (Phantom, etc.)
 */

export interface SolanaProvider {
  isPhantom?: boolean
  isConnected: boolean
  publicKey?: { toString: () => string }
  connect: () => Promise<{ publicKey?: { toString: () => string } }>
  signAndSendTransaction: (transaction: any) => Promise<string | { signature: string }>
  request?: (params: { method: string; params: any }) => Promise<string>
}

/**
 * Get Solana wallet provider from window, parent, or top
 */
export function getProvider(): SolanaProvider | null {
  if (typeof window === 'undefined') return null

  // Try window.solana (prefer Phantom)
  const w = window as unknown as { solana?: SolanaProvider }
  if (w?.solana?.isPhantom) return w.solana
  if (w?.solana) return w.solana

  // Try parent window if in iframe (same-origin only)
  try {
    if (window.parent && window.parent !== window) {
      const p = window.parent as unknown as { solana?: SolanaProvider }
      if (p?.solana?.isPhantom) return p.solana
      if (p?.solana) return p.solana
    }
  } catch {
    // Cross-origin access blocked, continue
  }

  // Try top window if in nested iframe (same-origin only)
  try {
    if (window.top && window.top !== window) {
      const t = window.top as unknown as { solana?: SolanaProvider }
      if (t?.solana?.isPhantom) return t.solana
      if (t?.solana) return t.solana
    }
  } catch {
    // Cross-origin access blocked, continue
  }

  return null
}

/**
 * Ensure wallet is connected and return the provider
 */
export async function ensureWalletConnected(): Promise<SolanaProvider> {
  const provider = getProvider()
  if (!provider) {
    throw new Error('No Solana wallet found. Please install Phantom or another Solana wallet.')
  }

  try {
    if (!provider.isConnected) {
      await provider.connect()
    }
    return provider
  } catch (e) {
    throw new Error('Wallet connection was rejected by user.')
  }
}

/**
 * Get the connected wallet's public key
 */
export function getWalletPublicKey(provider: SolanaProvider): string | null {
  return provider.publicKey?.toString() ?? null
}

/**
 * Convert base64 string to Uint8Array
 */
export function base64ToUint8Array(b64: string): Uint8Array {
  const binaryString = typeof atob !== 'undefined' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary')
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

/**
 * Sign and send a transaction using the external wallet
 * Tries multiple methods in order of preference:
 * 1. signAndSendTransaction with VersionedTransaction object
 * 2. signAndSendTransaction with base64 string
 * 3. signAndSendTransaction with Uint8Array
 * 4. provider.request API with base64
 * 5. provider.request API with base58
 */
export async function signAndSendTransaction(provider: SolanaProvider, transactionBase64: string): Promise<string> {
  let signature: string | undefined

  // Method 1: VersionedTransaction object (most reliable)
  if (!signature && typeof provider.signAndSendTransaction === 'function') {
    try {
      const { VersionedTransaction } = await import('@solana/web3.js')
      const tx = VersionedTransaction.deserialize(base64ToUint8Array(transactionBase64))
      const res = await provider.signAndSendTransaction(tx)
      signature = typeof res === 'string' ? res : res?.signature
    } catch {
      // Fall through to next method
    }
  }

  // Method 2: Direct base64 string
  if (!signature && typeof provider.signAndSendTransaction === 'function') {
    try {
      const res = await provider.signAndSendTransaction(transactionBase64)
      signature = typeof res === 'string' ? res : res?.signature
    } catch {
      // Fall through to next method
    }
  }

  // Method 3: Uint8Array
  if (!signature && typeof provider.signAndSendTransaction === 'function') {
    try {
      const res = await provider.signAndSendTransaction(base64ToUint8Array(transactionBase64))
      signature = typeof res === 'string' ? res : res?.signature
    } catch {
      // Fall through to next method
    }
  }

  // Method 4: Request API with base64
  if (!signature && typeof provider.request === 'function') {
    try {
      signature = await provider.request({
        method: 'signAndSendTransaction',
        params: { transaction: transactionBase64 },
      })
    } catch {
      // Fall through to next method
    }
  }

  // Method 5: Request API with base58
  if (!signature && typeof provider.request === 'function') {
    try {
      const bs58 = await import('bs58')
      const messageBase58 = bs58.default.encode(base64ToUint8Array(transactionBase64))
      signature = await provider.request({
        method: 'signAndSendTransaction',
        params: { message: messageBase58 },
      })
    } catch {
      // No more methods to try
    }
  }

  if (!signature || typeof signature !== 'string') {
    throw new Error('Failed to obtain transaction signature from wallet')
  }

  return signature
}
