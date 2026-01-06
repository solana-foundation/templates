import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { create, mplCore } from '@metaplex-foundation/mpl-core'
import { generateSigner, publicKey, createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi'
import { TIER_COLLECTIONS, TIER_INFO, EXPIRATION_PERIODS } from './config'
import type { TierType } from './types'
import { verifyNFTAccess } from './verify-nft'
import { parsePrivateKey } from './utils'

export async function mintMembershipNFT(
  tier: TierType,
  recipientAddress: string,
): Promise<{ success: boolean; assetId?: string; expiresAt?: number; error?: string }> {
  try {
    const rpcUrl = process.env.SOLANA_RPC_URL
    const authorityKey = process.env.AUTHORITY_PRIVATE_KEY

    if (!rpcUrl || !authorityKey) {
      throw new Error('Missing SOLANA_RPC_URL or AUTHORITY_PRIVATE_KEY')
    }

    const collectionAddress = TIER_COLLECTIONS[tier]
    if (!collectionAddress) {
      throw new Error(`Invalid tier: ${tier}`)
    }

    const umi = createUmi(rpcUrl).use(mplCore())

    const secretKey = parsePrivateKey(authorityKey)
    const authorityKeypair = umi.eddsa.createKeypairFromSecretKey(secretKey)

    umi.use(signerIdentity(createSignerFromKeypair(umi, authorityKeypair)))

    const asset = generateSigner(umi)

    const issuedAt = Date.now()
    const expiresAt = issuedAt + EXPIRATION_PERIODS[tier]

    await create(umi, {
      asset,
      collection: {
        publicKey: publicKey(collectionAddress),
      },
      name: TIER_INFO[tier].name,
      uri: '',
      owner: publicKey(recipientAddress),
      plugins: [
        {
          type: 'Attributes',
          attributeList: [
            { key: 'tier', value: tier },
            { key: 'issued_at', value: issuedAt.toString() },
            { key: 'expires_at', value: expiresAt.toString() },
            { key: 'renewable', value: 'true' },
          ],
        },
      ],
    }).sendAndConfirm(umi)

    return {
      success: true,
      assetId: asset.publicKey,
      expiresAt,
    }
  } catch (error) {
    console.error('NFT minting error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Minting failed',
    }
  }
}

export async function canMintNFT(
  walletAddress: string,
  tier: TierType,
): Promise<{ canMint: boolean; reason?: string }> {
  try {
    const { nfts } = await verifyNFTAccess(walletAddress)

    const existingNFT = nfts.find((nft) => nft.tier === tier)

    if (existingNFT) {
      if (existingNFT.isExpired) {
        return {
          canMint: false,
          reason: 'You have an expired membership for this tier. Please renew instead.',
        }
      } else {
        return {
          canMint: false,
          reason: 'Active membership already exists for this tier',
        }
      }
    }
    return { canMint: true }
  } catch (error) {
    console.error('Can mint check error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      canMint: false,
      reason: `Cannot verify existing NFTs: ${errorMessage}. Please try again.`,
    }
  }
}
