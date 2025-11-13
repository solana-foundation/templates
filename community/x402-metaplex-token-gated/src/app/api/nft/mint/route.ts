import { NextRequest, NextResponse } from 'next/server'
import bs58 from 'bs58'
import { mintMembershipNFT, canMintNFT } from '@/lib/mint-nft'
import { verifyWalletSignature } from '@/lib/solana-auth'
import type { TierType } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      tier,
      walletAddress,
      signature,
      message,
    }: { tier: TierType; walletAddress: string; signature: string; message: string } = body

    if (!tier || !walletAddress || !signature || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['bronze', 'silver', 'gold'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    const signatureBytes = bs58.decode(signature)

    if (!verifyWalletSignature(walletAddress, signatureBytes, message)) {
      return NextResponse.json({ error: 'Invalid wallet signature' }, { status: 401 })
    }

    const { canMint, reason } = await canMintNFT(walletAddress, tier)

    if (!canMint) {
      return NextResponse.json({ error: reason || 'Cannot mint NFT' }, { status: 400 })
    }

    const result = await mintMembershipNFT(tier, walletAddress)

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Minting failed' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      assetId: result.assetId,
      expiresAt: result.expiresAt,
      explorerUrl: `https://explorer.solana.com/address/${result.assetId}?cluster=devnet`,
    })
  } catch (error) {
    console.error('Mint API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
