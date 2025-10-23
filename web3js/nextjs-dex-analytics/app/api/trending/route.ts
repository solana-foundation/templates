import { fetchTrendingTokensData } from '@/lib/defillama'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const hoursParam = Number(searchParams.get('hours') ?? '24')
  const hours = Number.isFinite(hoursParam) && hoursParam > 0 ? Math.floor(hoursParam) : 24

  try {
    const data = await fetchTrendingTokensData(hours)
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=300',
      },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch trending tokens' }, { status: 500 })
  }
}
