import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    endpoint: 'report',
    generatedAt: new Date().toISOString(),
    period: 'sandbox-demo',
    metrics: {
      requests: 1284,
      paidRequests: 973,
      estimatedRevenueUsd: 19.46,
      p95LatencyMs: 184,
    },
    notes: ['Demo data only. Replace this route with your real metering source before going to mainnet.'],
  })
}
