import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { X402_CONFIG } from './lib/x402-config'
import { create402Response, create402Error } from './lib/x402-responses'
import { verifyPayment, verifyCookieSignature } from './lib/x402-verification'

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (!pathname.startsWith('/protected')) {
    return NextResponse.next()
  }

  const paymentCookie = request.cookies.get(X402_CONFIG.COOKIE_NAME)
  if (paymentCookie?.value) {
    const isValid = await verifyCookieSignature(paymentCookie.value)
    if (isValid) {
      return NextResponse.next()
    }
  }

  const paymentHeader = request.headers.get('X-PAYMENT')

  if (!paymentHeader) {
    return create402Response(request, !!paymentCookie?.value)
  }

  try {
    const payment = JSON.parse(paymentHeader)
    const resource = `${request.nextUrl.protocol}//${request.nextUrl.host}${pathname}`

    const result = await verifyPayment(payment, resource)

    if (!result.isValid) {
      return create402Error(result.reason || 'Payment verification failed')
    }

    const response = NextResponse.next()
    response.cookies.set(X402_CONFIG.COOKIE_NAME, result.signature!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: X402_CONFIG.COOKIE_MAX_AGE,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Payment verification error:', error)
    return create402Error(error instanceof Error ? error.message : 'Payment verification failed')
  }
}

export const config = {
  matcher: ['/protected/:path*'],
}
