import { getSolanaDexProtocols, getSolanaDexVolumes } from '@/lib/defillama-volumes'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [protocols, volumes] = await Promise.all([getSolanaDexProtocols(), getSolanaDexVolumes()])

    return NextResponse.json(
      { protocols, volumes },
      {
        headers: {
          // Cache at the edge for 10 minutes, allow 1 hour stale while revalidating
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
        },
      },
    )
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load DEX overview' }, { status: 500 })
  }
}
