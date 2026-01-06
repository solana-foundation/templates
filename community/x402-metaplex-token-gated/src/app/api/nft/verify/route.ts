import { NextRequest, NextResponse } from 'next/server'
import { verifyNFTAccess } from '@/lib/verify-nft'
import { getDaysUntilExpiration, formatDate } from '@/lib/utils'

/**
 * Builds the verification response payload with enriched NFT data.
 * Extracts common logic used by both GET and POST handlers.
 */
async function buildVerificationResponse(walletAddress: string) {
  const { hasAccess, nfts } = await verifyNFTAccess(walletAddress)

  const nftDetails = nfts.map((nft) => ({
    assetId: nft.assetId,
    tier: nft.tier,
    issuedAt: nft.issuedAt,
    expiresAt: nft.expiresAt,
    isExpired: nft.isExpired,
    isExpiringSoon: nft.isExpiringSoon,
    gracePeriodActive: nft.gracePeriodActive,
    daysUntilExpiration: getDaysUntilExpiration(nft.expiresAt),
    expirationDate: formatDate(nft.expiresAt),
    explorerUrl: `https://explorer.solana.com/address/${nft.assetId}?cluster=devnet`,
  }))

  return {
    walletAddress,
    hasAccess,
    nfts: nftDetails,
    activeTiers: nfts.filter((nft) => !nft.isExpired || nft.gracePeriodActive).map((nft) => nft.tier),
    expiredTiers: nfts.filter((nft) => nft.isExpired && !nft.gracePeriodActive).map((nft) => nft.tier),
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('wallet')

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
    }

    const data = await buildVerificationResponse(walletAddress)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Verify API error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress } = body

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
    }

    const data = await buildVerificationResponse(walletAddress)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Verify API error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
