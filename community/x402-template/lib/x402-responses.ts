import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { X402_CONFIG } from './x402-config'

export function create402Response(request: NextRequest, clearCookie = false): NextResponse {
  const pathname = request.nextUrl.pathname
  const accept = request.headers.get('Accept')
  const userAgent = request.headers.get('User-Agent')

  if (accept?.includes('text/html') && userAgent?.includes('Mozilla')) {
    const paywallUrl = new URL('/paywall', request.url)
    paywallUrl.searchParams.set('resource', pathname)
    const response = NextResponse.redirect(paywallUrl, 302)
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
          scheme: X402_CONFIG.PAYMENT_SCHEME,
          network: X402_CONFIG.NETWORK,
          maxAmountRequired: X402_CONFIG.REQUIRED_AMOUNT,
          resource: `${request.nextUrl.protocol}//${request.nextUrl.host}${pathname}`,
          description: X402_CONFIG.PAYMENT_DESCRIPTION,
          mimeType: '',
          payTo: X402_CONFIG.TREASURY_ADDRESS,
          maxTimeoutSeconds: X402_CONFIG.PAYMENT_TIMEOUT_SECONDS,
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
