import { unstable_cache } from 'next/cache'
import { TIER_COLLECTIONS, GRACE_PERIOD } from './config'
import type { NFTWithExpiration, TierType } from './types'
import { isExpiringSoon, isValidSolanaAddress, timestampToMs, findAttributeValue } from './utils'

type HeliusAsset = {
  id: string
  grouping?: Array<{ group_value?: string | null }>
  content?: {
    metadata?: {
      attributes?: Array<{ trait_type?: string | null; value?: string | number | null }>
    }
  }
  // Metaplex Core plugin attributes
  plugins?: {
    attributes?: {
      data?: {
        attribute_list?: Array<{ key?: string | null; value?: string | number | null }>
      }
    }
  }
}

type HeliusResponse = {
  result?: { items?: HeliusAsset[] }
}

const TIER_ADDRESSES = new Set(Object.values(TIER_COLLECTIONS))

/**
 * Finds the tier type for a given collection address.
 * @param groupValue - The collection address to look up
 * @returns The corresponding tier type, or 'unknown' if not found
 */
const findCollectionTier = (groupValue: string | null | undefined): TierType => {
  if (!groupValue) return 'unknown' as TierType

  const entry = Object.entries(TIER_COLLECTIONS).find(([, address]) => address === groupValue)
  return (entry?.[0] ?? 'unknown') as TierType
}

export async function verifyNFTAccess(walletAddress: string): Promise<{
  hasAccess: boolean
  nfts: NFTWithExpiration[]
}> {
  try {
    const heliusApiKey = process.env.HELIUS_API_KEY
    if (!heliusApiKey) {
      throw new Error('HELIUS_API_KEY not configured')
    }

    if (!isValidSolanaAddress(walletAddress)) {
      throw new Error('Invalid wallet address')
    }

    const network = process.env.HELIUS_NETWORK ?? 'devnet'
    const base = network === 'mainnet' ? 'https://mainnet.helius-rpc.com' : 'https://devnet.helius-rpc.com'
    const url = `${base}/?api-key=${heliusApiKey}`

    const requestBody = {
      jsonrpc: '2.0' as const,
      id: 'verify-nft',
      method: 'getAssetsByOwner' as const,
      params: {
        ownerAddress: walletAddress,
        page: 1,
      },
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      cache: 'no-store',
    })

    if (!response.ok) {
      if (response.status >= 500) {
        throw new Error(`Helius API server error: ${response.status}`)
      }
      throw new Error(`Helius API error: ${response.status}`)
    }

    const data = (await response.json()) as HeliusResponse

    const items = data?.result?.items && Array.isArray(data.result.items) ? data.result.items : []
    const now = Date.now()

    const nfts: NFTWithExpiration[] = items
      .filter((asset) => {
        const grouping = asset.grouping ?? []
        return grouping.some((g) => g?.group_value && TIER_ADDRESSES.has(g.group_value))
      })
      .map((asset) => {
        const grouping = asset.grouping ?? []
        const groupValue = grouping.find((g) => g?.group_value && TIER_ADDRESSES.has(g.group_value))?.group_value

        const tier = findCollectionTier(groupValue)

        // Try Metaplex Core plugin attributes first, fallback to metadata attributes
        const attributes = asset.plugins?.attributes?.data?.attribute_list ?? asset.content?.metadata?.attributes

        const expiresAt = timestampToMs(findAttributeValue(attributes, 'expires_at')) ?? 0
        const issuedAt = timestampToMs(findAttributeValue(attributes, 'issued_at'))
        const renewedAt = timestampToMs(findAttributeValue(attributes, 'renewed_at'))

        const isExpired = now > expiresAt
        const gracePeriodActive = isExpired && expiresAt > 0 && now - expiresAt <= GRACE_PERIOD

        return {
          tier,
          assetId: asset.id,
          expiresAt,
          isExpired,
          isExpiringSoon: isExpiringSoon(expiresAt),
          gracePeriodActive,
          issuedAt,
          renewedAt,
        }
      })

    const hasAccess = nfts.some((n) => !n.isExpired)

    return { hasAccess, nfts }
  } catch (error) {
    console.error('NFT verification error:', error)
    return { hasAccess: false, nfts: [] }
  }
}

export async function verifyNFTAccessCached(walletAddress: string) {
  return unstable_cache(async () => verifyNFTAccess(walletAddress), ['nft-verification', walletAddress], {
    revalidate: 300,
    tags: ['nft-verification'],
  })()
}

export async function verifySpecificNFT(walletAddress: string, assetId: string): Promise<NFTWithExpiration | null> {
  const { nfts } = await verifyNFTAccess(walletAddress)
  return nfts.find((nft) => nft.assetId === assetId) || null
}
