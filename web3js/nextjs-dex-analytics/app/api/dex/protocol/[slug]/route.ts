import { getDexProtocolDetails } from '@/lib/defillama-volumes'
import { NextResponse } from 'next/server'

export async function GET(_request: Request, context: { params: { slug: string } }) {
  const slug = context.params.slug
  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ error: 'Missing protocol slug' }, { status: 400 })
  }

  try {
    const data = await getDexProtocolDetails(slug)
    return NextResponse.json(data, {
      headers: {
        // Cache per-protocol for 10 minutes, allow 1 hour stale while revalidating
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to load protocol' }, { status: 500 })
  }
}
