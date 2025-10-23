import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userPublicKey, quoteResponse } = body

    if (!userPublicKey || !quoteResponse) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Build Jupiter swap request
    const swapRequest = {
      userPublicKey,
      quoteResponse,
      ...(process.env.NEXT_PUBLIC_JUP_REFERRAL_ACCOUNT && process.env.NEXT_PUBLIC_JUP_REFERRAL_BPS && {
        referralAccount: process.env.NEXT_PUBLIC_JUP_REFERRAL_ACCOUNT,
        referralBps: parseInt(process.env.NEXT_PUBLIC_JUP_REFERRAL_BPS)
      })
    }

    // Send swap request to Jupiter API
    const response = await fetch('https://lite-api.jup.ag/swap/v1/swap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.NEXT_PUBLIC_JUPITER_API_KEY && {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_JUPITER_API_KEY}`
        })
      },
      body: JSON.stringify(swapRequest)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Jupiter swap API error:', response.status, errorData)
      return NextResponse.json(
        { error: `Jupiter swap API error: ${errorData.message || response.statusText}` },
        { status: response.status }
      )
    }

    const swapData = await response.json()
    return NextResponse.json(swapData)

  } catch (error) {
    console.error('Swap API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
