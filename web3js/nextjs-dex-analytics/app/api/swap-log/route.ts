import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    payload = null
  }

  const entry = {
    tag: 'SWAP_EVENT',
    ts: new Date().toISOString(),
    payload,
  }

  // Visible in Vercel Function Logs
  console.info('[SWAP_EVENT]', JSON.stringify(entry))

  return new NextResponse(null, {
    status: 204,
    headers: { 'Cache-Control': 'no-store' },
  })
}
