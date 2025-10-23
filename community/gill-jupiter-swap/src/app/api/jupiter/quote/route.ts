import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const inputMint = searchParams.get('inputMint')
    const outputMint = searchParams.get('outputMint')
    const amount = searchParams.get('amount')
    const slippageBps = searchParams.get('slippageBps')

    if (!inputMint || !outputMint || !amount || !slippageBps) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Build Jupiter API URL
    const jupiterUrl = new URL('https://lite-api.jup.ag/swap/v1/quote')
    jupiterUrl.searchParams.set('inputMint', inputMint)
    jupiterUrl.searchParams.set('outputMint', outputMint)
    jupiterUrl.searchParams.set('amount', amount)
    jupiterUrl.searchParams.set('slippageBps', slippageBps)
    jupiterUrl.searchParams.set('maxAccounts', '33')

    // Add referral parameters if configured
    const referralAccount = process.env.NEXT_PUBLIC_JUP_REFERRAL_ACCOUNT
    const referralBps = process.env.NEXT_PUBLIC_JUP_REFERRAL_BPS
    if (referralAccount && referralBps) {
      jupiterUrl.searchParams.set('referralAccount', referralAccount)
      jupiterUrl.searchParams.set('referralBps', referralBps)
    }

    // Fetch quote from Jupiter API
    const response = await fetch(jupiterUrl.toString(), {
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.NEXT_PUBLIC_JUPITER_API_KEY && {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_JUPITER_API_KEY}`
        })
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Jupiter API error:', response.status, errorText)
      return NextResponse.json(
        { error: `Jupiter API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const quoteData = await response.json()
    return NextResponse.json(quoteData)

  } catch (error) {
    console.error('Quote API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
