import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { solanaPaywallHtml } from './paywall-template'
import { X402_CONFIG } from './x402-config'

export function create402Response(request: NextRequest, clearCookie = false): NextResponse {
  const pathname = request.nextUrl.pathname
  const accept = request.headers.get('Accept')
  const userAgent = request.headers.get('User-Agent')

  if (accept?.includes('text/html') && userAgent?.includes('Mozilla')) {
    const response = new NextResponse(solanaPaywallHtml, {
      status: 402,
      headers: { 'Content-Type': 'text/html' },
    })
    if (clearCookie) {
      response.cookies.delete(X402_CONFIG.COOKIE_NAME)
    }
    return response
  }

  const response = NextResponse.json(
    {
      x402Version: 1,
      error: 'Payment required',
      accepts: [
        {
          scheme: 'exact',
          network: 'solana-devnet',
          maxAmountRequired: X402_CONFIG.REQUIRED_AMOUNT,
          resource: `${request.nextUrl.protocol}//${request.nextUrl.host}${pathname}`,
          description: 'Access to protected content',
          mimeType: '',
          payTo: X402_CONFIG.TREASURY_ADDRESS,
          maxTimeoutSeconds: 60,
          asset: X402_CONFIG.USDC_DEVNET_MINT,
          outputSchema: {
            input: {
              type: 'http',
              method: request.method,
              discoverable: true,
            },
          },
          extra: {
            feePayer: X402_CONFIG.FEE_PAYER,
          },
        },
      ],
    },
    { status: 402, headers: { 'Content-Type': 'application/json' } },
  )

  if (clearCookie) {
    response.cookies.delete(X402_CONFIG.COOKIE_NAME)
  }

  return response
}

export function create402Error(error: string): NextResponse {
  return NextResponse.json(
    {
      x402Version: 1,
      error,
      accepts: [],
    },
    { status: 402 },
  )
}
