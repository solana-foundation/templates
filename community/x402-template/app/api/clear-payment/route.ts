import { NextResponse } from 'next/server'

/**
 * Clear payment cookie endpoint
 * POST /api/clear-payment
 *
 * Clears the httpOnly payment cookie so users can test the paywall again
 */
export async function POST() {
  const response = NextResponse.json({ success: true })

  // Clear the httpOnly cookie by setting it with Max-Age=0
  response.cookies.set('solana_payment_verified', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })

  return response
}
