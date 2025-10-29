import { NextRequest, NextResponse } from 'next/server'

/**
 * Settle endpoint for x402 protocol
 * POST /api/facilitator/settle
 *
 * This endpoint is called after payment verification to settle/finalize the payment.
 * For our use case, we just verify the payment was successful.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Facilitator settle request:', body)

    // For Solana, settlement happens on-chain automatically
    // We just need to acknowledge the payment
    return NextResponse.json(
      {
        success: true,
        message: 'Payment settled',
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Facilitator settle error:', error)
    return NextResponse.json({ success: false, reason: 'Internal server error' }, { status: 500 })
  }
}
