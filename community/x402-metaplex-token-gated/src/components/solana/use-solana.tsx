import { useWalletUi } from '@wallet-ui/react'
import { useWalletUiGill } from '@wallet-ui/react-gill'
import { getWallets } from '@wallet-standard/app'
import { getSolanaSignMessageFeature } from './features'
import { createClaimMessage, createRenewalMessage } from '@/lib/solana-auth'
import bs58 from 'bs58'

/**
 * Custom hook to abstract Wallet UI and related functionality from your app.
 *
 * This is a great place to add custom shared Solana logic or clients.
 */
export function useSolana() {
  const walletUi = useWalletUi()
  const client = useWalletUiGill()

  /**
   * Sign a message with the connected wallet
   * @param message - Message bytes to sign
   * @returns Signature bytes
   * @throws Error if wallet is not connected or doesn't support message signing
   */
  const signMessage = async (message: Uint8Array): Promise<Uint8Array> => {
    if (!walletUi.wallet || !walletUi.account) {
      throw new Error('Wallet not connected')
    }

    const walletsApi = getWallets()
    const rawWallet = walletsApi.get().find((w: { name: string }) => w.name === walletUi.wallet?.name)

    if (!rawWallet) {
      throw new Error('Could not find wallet in registry')
    }

    const signFeature = getSolanaSignMessageFeature(rawWallet)

    if (!signFeature) {
      throw new Error('Wallet does not support message signing')
    }

    try {
      const [result] = await signFeature.signMessage({
        account: walletUi.account,
        message: message,
      })

      return result.signature
    } catch (error) {
      console.error('Message signing error:', error)
      throw new Error('Failed to sign message. User may have rejected the request.')
    }
  }

  /**
   * Mint a membership NFT for the connected wallet
   * @param tier - Tier type (bronze, silver, gold)
   * @returns Mint result with assetId and explorerUrl
   * @throws Error if wallet is not connected or minting fails
   */
  const mintNFT = async (tier: string) => {
    if (!walletUi.account?.address) {
      throw new Error('Wallet not connected')
    }

    const message = createClaimMessage(tier)
    const messageBytes = new TextEncoder().encode(message)

    const signatureBytes = await signMessage(messageBytes)
    const signature = bs58.encode(signatureBytes)

    const response = await fetch('/api/nft/mint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tier,
        walletAddress: walletUi.account.address,
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

  /**
   * Renew a membership NFT for the connected wallet
   * @param tier - Tier type (bronze, silver, gold)
   * @param assetId - NFT asset ID to renew
   * @returns Renewal result with assetId, new expiresAt, and explorerUrl
   * @throws Error if wallet is not connected or renewal fails
   */
  const renewNFT = async (tier: string, assetId: string) => {
    if (!walletUi.account?.address) {
      throw new Error('Wallet not connected')
    }

    const message = createRenewalMessage(tier, assetId)
    const messageBytes = new TextEncoder().encode(message)

    const signatureBytes = await signMessage(messageBytes)
    const signature = bs58.encode(signatureBytes)

    const response = await fetch('/api/nft/renew', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tier,
        assetId,
        walletAddress: walletUi.account.address,
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
    ...walletUi,
    client,
    signMessage,
    mintNFT,
    renewNFT,
  }
}
