import { NextResponse } from 'next/server'
import { PublicKey } from '@solana/web3.js'
import { getMint } from '@solana/spl-token'
import { getSolanaConnection } from '@/lib/solana-config'

const MINT_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/

async function fetchPriceV3(id: string) {
  // lite-api v3 — returns keyed by id with usdPrice
  const res = await fetch(`https://lite-api.jup.ag/price/v3?ids=${encodeURIComponent(id)}`)
  const data = await res.json()
  return { ok: res.ok, data }
}

// No symbol resolution: mint-only

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tokenIdParam = searchParams.get('tokenId') || searchParams.get('id')
    console.log('[PRICE] incoming params:', {
      raw: tokenIdParam,
    })
    if (!tokenIdParam) {
      return NextResponse.json({ error: 'tokenId (mint address) is required' }, { status: 400 })
    }

    const tokenId = tokenIdParam.trim()
    if (!MINT_REGEX.test(tokenId)) {
      console.warn('[PRICE] invalid mint provided', tokenId)
      return NextResponse.json({ error: 'Provide a valid mint address (contract)' }, { status: 400 })
    }

    // Fetch USD price via lite-api v3
    const { ok, data } = await fetchPriceV3(tokenId)
    console.log('[PRICE] jup lite v3 ok:', ok, 'keys:', data ? Object.keys(data) : null)
    if (!ok) {
      throw new Error(data?.error || 'Failed to fetch price')
    }

    // Support both data shapes: direct keyed, or nested "data"
    const node = data?.[tokenId] || data?.data?.[tokenId]
    const usdPrice = node?.usdPrice ?? node?.price
    if (usdPrice == null) {
      console.warn('[PRICE] no price in response for', tokenId, 'node:', node)
      return NextResponse.json({ error: 'Price not available for the given token' }, { status: 404 })
    }

    // Market cap via mint supply
    const connection = getSolanaConnection()
    const mintInfo = await getMint(connection, new PublicKey(tokenId))
    const supply = Number(mintInfo.supply) / Math.pow(10, mintInfo.decimals)
    const marketCap = supply * parseFloat(usdPrice)

    const formatPrice = (price: number) => {
      if (price < 0.0001) return price.toFixed(12)
      if (price < 0.01) return price.toFixed(8)
      if (price < 1) return price.toFixed(6)
      return price.toFixed(4)
    }

    return NextResponse.json({
      tokenId,
      price: parseFloat(usdPrice),
      priceFormatted: formatPrice(parseFloat(usdPrice)),
      marketCap,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch price' },
      { status: 500 },
    )
  }
}
