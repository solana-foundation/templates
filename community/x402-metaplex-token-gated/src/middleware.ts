import { NextResponse, NextRequest } from 'next/server'
import { paymentMiddleware } from 'x402-next'
import { TIER_INFO } from './lib/config'
import type { TierType } from './lib/types'

export const middleware = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname
  const tier = pathname.split('/').pop() as TierType

  if (!['bronze', 'silver', 'gold'].includes(tier) || !tier) {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
  }

  const cookieName = `payment_${tier}`
  const paymentCookie = request.cookies.get(cookieName)

  if (pathname.startsWith('/members/')) {
    if (!paymentCookie) {
      return NextResponse.redirect(new URL(`/buy/${tier}`, request.url))
    }

    try {
      const { expiresAt } = JSON.parse(paymentCookie.value)

      if (Date.now() >= expiresAt) {
        return NextResponse.redirect(new URL(`/renew/${tier}`, request.url))
      }
    } catch {
      return NextResponse.redirect(new URL(`/buy/${tier}`, request.url))
    }

    return NextResponse.next()
  }

  // For /buy/* and /renew/* routes - check cookie to bypass payment
  // DEV ONLY: Cookie-based payment tracking to avoid double payments
  // PRODUCTION: Use database-backed payment records.
  if (paymentCookie) {
    try {
      const { expiresAt } = JSON.parse(paymentCookie.value)

      if (Date.now() < expiresAt) {
        return NextResponse.next()
      }
    } catch {
      // Invalid cookie, proceed with payment
    }
  }

  const paymentHandler = paymentMiddleware(
    (process.env.NEXT_PUBLIC_PAYMENT_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
    {
      [`/buy/${tier}`]: {
        price: TIER_INFO[tier].price,
        network: 'solana-devnet',
        config: {
          description: `Access to ${TIER_INFO[tier].name} Membership Content - ${TIER_INFO[tier].duration} days`,
        },
      },
      [`/renew/${tier}`]: {
        price: TIER_INFO[tier].price,
        network: 'solana-devnet',
        config: {
          description: `Renew ${TIER_INFO[tier].name} Membership - ${TIER_INFO[tier].duration} days`,
        },
      },
    },
    {
      url: 'https://x402.org/facilitator',
    },
  )

  const response = await paymentHandler(request)

  if (response.ok && response.status === 200) {
    const durationMs = TIER_INFO[tier].duration * 24 * 60 * 60 * 1000
    const expiresAt = Date.now() + durationMs

    const paymentData = {
      tier,
      paidAt: Date.now(),
      expiresAt,
    }

    response.cookies.set({
      name: cookieName,
      value: JSON.stringify(paymentData),
      expires: new Date(expiresAt),
      path: '/',
      sameSite: 'strict',
    })
  }

  return response
}

export const config = {
  matcher: ['/buy/:path*', '/renew/:path*', '/members/:path*'],
}
