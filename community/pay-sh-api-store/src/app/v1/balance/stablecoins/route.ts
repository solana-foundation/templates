import { type NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const sandboxUsdcMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
const sandboxUsdcRawAmount = '1000000000'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const address = searchParams.get('address')
  const network = searchParams.get('network')

  if (!address) {
    return NextResponse.json({ error: 'missing_address' }, { status: 400 })
  }

  return NextResponse.json(
    {
      balances:
        network === 'sandbox'
          ? [
              {
                mint: sandboxUsdcMint,
                raw_amount: sandboxUsdcRawAmount,
                ui_amount: 1000,
                symbol: 'USDC',
                decimals: 6,
              },
            ]
          : [],
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  )
}
