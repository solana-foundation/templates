import nacl from 'tweetnacl'
import bs58 from 'bs58'

export function verifyWalletSignature(walletAddress: string, signature: Uint8Array, message: string): boolean {
  try {
    const publicKey = bs58.decode(walletAddress)
    const messageBytes = new TextEncoder().encode(message)

    return nacl.sign.detached.verify(messageBytes, signature, publicKey)
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

export function createClaimMessage(tier: string): string {
  return `Claim ${tier} NFT membership at ${Date.now()}`
}

export function createRenewalMessage(tier: string, assetId: string): string {
  return `Renew ${tier} NFT ${assetId} at ${Date.now()}`
}

export function isMessageExpired(message: string, maxAgeMs: number = 60000): boolean {
  const timestampMatch = message.match(/at (\d+)$/)
  if (!timestampMatch) return true

  const timestamp = parseInt(timestampMatch[1])
  return Date.now() - timestamp > maxAgeMs
}
