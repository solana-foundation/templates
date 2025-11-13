import { NextRequest, NextResponse } from 'next/server'
import bs58 from 'bs58'
import { renewMembershipNFT } from '@/lib/update-nft'
import { verifyWalletSignature } from '@/lib/solana-auth'
import { verifySpecificNFT } from '@/lib/verify-nft'
import type { TierType } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { assetId, walletAddress, tier, signature, message } = body

    if (!assetId || !walletAddress || !tier || !signature || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['bronze', 'silver', 'gold'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    const signatureBytes = bs58.decode(signature)

    if (!verifyWalletSignature(walletAddress, signatureBytes, message)) {
      return NextResponse.json({ error: 'Invalid wallet signature' }, { status: 401 })
    }

    const nft = await verifySpecificNFT(walletAddress, assetId)

    if (!nft) {
      return NextResponse.json({ error: 'NFT not found or not owned by wallet' }, { status: 404 })
    }

    if (nft.tier !== tier) {
      return NextResponse.json({ error: 'NFT tier does not match requested tier' }, { status: 400 })
    }

    const result = await renewMembershipNFT(assetId, tier as TierType, nft.expiresAt, nft.issuedAt || Date.now())

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Renewal failed' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      assetId,
      expiresAt: result.expiresAt,
      explorerUrl: `https://explorer.solana.com/address/${assetId}?cluster=devnet`,
    })
  } catch (error) {
    console.error('Renew API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
