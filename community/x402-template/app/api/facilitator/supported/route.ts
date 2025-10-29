/**
 * Supported payment kinds endpoint
 * GET /api/facilitator/supported
 *
 * This endpoint is required by x402 middleware to discover which payment methods
 * the facilitator supports. This implements the x402 protocol format.
 */

import { NextResponse } from 'next/server'
import { env } from '@/lib/env'

export async function GET() {
  return NextResponse.json({
    kinds: [
      {
        scheme: env.NEXT_PUBLIC_PAYMENT_SCHEME,
        network: env.NEXT_PUBLIC_NETWORK,
        extra: {
          feePayer: env.NEXT_PUBLIC_FEE_PAYER,
        },
      },
    ],
  })
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
