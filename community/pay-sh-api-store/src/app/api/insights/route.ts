import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    endpoint: 'insights',
    generatedAt: new Date().toISOString(),
    signal: 'API demand is strongest when agents can discover price, pay once, and receive structured output.',
    confidence: 0.91,
    recommendation: 'Expose one narrow paid endpoint first, then add more endpoints once usage is visible.',
  })
}
