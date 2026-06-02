import { type NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const sandboxUsdcMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
const sandboxUsdcRawAmount = '1000000000'
const localHostnames = new Set(['localhost', '127.0.0.1', '::1'])

function getRequestHostname(request: NextRequest) {
  const host = request.headers.get('host') ?? ''

  if (host.startsWith('[')) {
    return host.slice(1, host.indexOf(']'))
  }

  return host.split(':')[0]
}

export async function GET(request: NextRequest) {
  // Dev-only localhost shim. It reports a fake balance so the Pay.sh CLI can pick the
  // sandbox USDC challenge. It never moves funds; the real payment still settles on-chain.
  // Refuse production and non-localhost requests so tunnels or public deploys do not expose it.
  if (process.env.NODE_ENV === 'production' || !localHostnames.has(getRequestHostname(request))) {
    return NextResponse.json({ error: 'not_available' }, { status: 404 })
  }

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
