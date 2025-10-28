/**
 * Supported payment kinds endpoint
 * GET /api/facilitator/supported
 *
 * This endpoint is required by x402 middleware to discover which payment methods
 * the facilitator supports. This implements the x402 protocol format.
 */

import { NextResponse } from 'next/server'

export async function GET() {
  // Treasury wallet address (where payments are sent) - also used as fee payer
  const feePayer = process.env.TREASURY_WALLET_ADDRESS || '2wKupLR9q6wXYppw8Gr2NvWxKBUqm4PPJKkQfoxHDBg4'

  // Return x402-compliant response
  return NextResponse.json({
    kinds: [
      {
        scheme: 'exact',
        network: 'solana-devnet',
        extra: {
          feePayer: feePayer,
        },
      },
      {
        scheme: 'exact',
        network: 'solana',
        extra: {
          feePayer: feePayer,
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
