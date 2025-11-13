import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { updatePlugin, mplCore } from '@metaplex-foundation/mpl-core'
import { publicKey, createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi'
import { EXPIRATION_PERIODS, TIER_COLLECTIONS } from './config'
import type { TierType } from './types'
import { parsePrivateKey } from './utils'

/**
 * Renews a membership NFT by updating its expiration date.
 *
 * @param assetId - The NFT asset ID to renew
 * @param tier - The membership tier
 * @param currentExpiresAt - Current expiration timestamp (ms)
 * @param originalIssuedAt - Original issuance timestamp (ms), defaults to renewedAt
 * @returns Result object with success status and new expiration date
 *
 * @example
 * const result = await renewMembershipNFT('abc123', 'bronze', Date.now(), Date.now())
 */
export async function renewMembershipNFT(
  assetId: string,
  tier: TierType,
  currentExpiresAt: number,
  originalIssuedAt?: number,
): Promise<{
  success: boolean
  expiresAt?: number
  error?: string
}> {
  try {
    const rpcUrl = process.env.SOLANA_RPC_URL
    const authorityKey = process.env.AUTHORITY_PRIVATE_KEY

    if (!rpcUrl || !authorityKey) {
      throw new Error('Missing SOLANA_RPC_URL or AUTHORITY_PRIVATE_KEY')
    }

    const umi = createUmi(rpcUrl).use(mplCore())

    const secretKey = parsePrivateKey(authorityKey)
    const authorityKeypair = umi.eddsa.createKeypairFromSecretKey(secretKey)

    umi.use(signerIdentity(createSignerFromKeypair(umi, authorityKeypair)))

    const renewedAt = Date.now()

    const baseTime = currentExpiresAt > renewedAt ? currentExpiresAt : renewedAt
    const expiresAt = baseTime + EXPIRATION_PERIODS[tier]

    const collectionAddress = TIER_COLLECTIONS[tier]
    if (!collectionAddress) {
      throw new Error(`Invalid tier: ${tier}`)
    }

    await updatePlugin(umi, {
      asset: publicKey(assetId),
      collection: publicKey(collectionAddress),
      plugin: {
        type: 'Attributes',
        attributeList: [
          { key: 'tier', value: tier },
          {
            key: 'issued_at',
            value: (originalIssuedAt || renewedAt).toString(),
          },
          { key: 'renewed_at', value: renewedAt.toString() },
          { key: 'expires_at', value: expiresAt.toString() },
          { key: 'renewable', value: 'true' },
        ],
      },
    }).sendAndConfirm(umi)

    return {
      success: true,
      expiresAt,
    }
  } catch (error) {
    console.error('NFT renewal error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Renewal failed',
    }
  }
}
