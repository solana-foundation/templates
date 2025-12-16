import { useWallet } from '@solana/react-hooks'
import { createClaimMessage, createRenewalMessage } from '@/lib/solana-auth'
import bs58 from 'bs58'

/**
 * Custom hook to abstract wallet functionality using @solana/react-hooks
 */
export function useSolana() {
  const wallet = useWallet()

  const isConnected = wallet.status === 'connected'

  const address = isConnected ? wallet.session.account.address.toString() : null

  /**
   * Sign a message with the connected wallet
   * @param message - Message bytes to sign
   * @returns Signature bytes
   * @throws Error if wallet is not connected or doesn't support message signing
   */
  const signMessage = async (message: Uint8Array): Promise<Uint8Array> => {
    if (!isConnected) {
      throw new Error('Wallet not connected')
    }

    if (!wallet.session?.signMessage) {
      throw new Error('Wallet does not support message signing')
    }

    try {
      const signature = await wallet.session.signMessage(message)
      return signature
    } catch (error) {
      console.error('Message signing error:', error)
      throw new Error('Failed to sign message. User may have rejected the request.')
    }
  }

  const mintNFT = async (tier: string) => {
    const message = createClaimMessage(tier)
    const messageBytes = new TextEncoder().encode(message)
    const signatureBytes = await signMessage(messageBytes)
    const signature = bs58.encode(signatureBytes)

    const response = await fetch('/api/nft/mint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tier,
        walletAddress: address,
        signature,
        message,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to mint NFT')
    }

    return {
      success: true,
      assetId: data.assetId,
      expiresAt: data.expiresAt,
      explorerUrl: data.explorerUrl,
    }
  }

  const renewNFT = async (tier: string, assetId: string) => {
    const message = createRenewalMessage(tier, assetId)
    const messageBytes = new TextEncoder().encode(message)
    const signatureBytes = await signMessage(messageBytes)
    const signature = bs58.encode(signatureBytes)

    const response = await fetch('/api/nft/renew', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tier,
        assetId,
        walletAddress: address,
        signature,
        message,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to renew NFT')
    }

    return {
      success: true,
      assetId: data.assetId,
      expiresAt: data.expiresAt,
      explorerUrl: data.explorerUrl,
    }
  }

  return {
    status: wallet.status,
    connected: isConnected,
    publicKey: address,
    signMessage,
    mintNFT,
    renewNFT,
  }
}
