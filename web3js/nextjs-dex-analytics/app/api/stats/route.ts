import { NextResponse } from 'next/server'

interface HeliusPerfSample {
  numSlots: number
  numTransactions: number
  samplePeriodSecs: number
  slot: number
}

interface StatsResponseBody {
  tps: number | null
  solPriceUsd: number | null
  tvlUsd: number | null
  volume24hUsd: number | null
  solChange24hPct?: number | null
  tvlChange24hPct?: number | null
  volume24hChangePct?: number | null
}

export async function GET() {
  const heliusApiKey = process.env.HELIUS_API_KEY
  const heliusRpcUrl = heliusApiKey
    ? `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`
    : 'https://api.mainnet-beta.solana.com'

  const tpsPromise = (async () => {
    try {
      const res = await fetch(heliusRpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getRecentPerformanceSamples',
          params: [1],
        }),
      })
      if (!res.ok) return null
      const json = (await res.json()) as { result?: HeliusPerfSample[] }
      const sample = json.result?.[0]
      if (!sample || sample.samplePeriodSecs <= 0) return null
      const tps = sample.numTransactions / sample.samplePeriodSecs
      return Math.round(tps)
    } catch {
      return null
    }
  })()

  const solPricePromise = (async () => {
    try {
      const res = await fetch('https://coins.llama.fi/prices/current/coingecko:solana?searchWidth=2400', {
        next: { revalidate: 15 },
      })
      if (!res.ok) return null
      const json = (await res.json()) as {
        coins?: Record<string, { price?: number }>
      }
      const price = json.coins?.['coingecko:solana']?.price
      return typeof price === 'number' ? price : null
    } catch {
      return null
    }
  })()

  const solPrice24hAgoPromise = (async () => {
    try {
      const nowSec = Math.floor(Date.now() / 1000)
      const t24 = nowSec - 86400
      const res = await fetch(`https://coins.llama.fi/prices/historical/${t24}/coingecko:solana?searchWidth=2400`, {
        next: { revalidate: 600 },
      })
      if (!res.ok) return null
      const json = (await res.json()) as {
        coins?: Record<string, { price?: number }>
      }
      const price = json.coins?.['coingecko:solana']?.price
      return typeof price === 'number' ? price : null
    } catch {
      return null
    }
  })()

  const tvlPromise = (async () => {
    try {
      const res = await fetch('https://api.llama.fi/v2/chains', { next: { revalidate: 300 } })
      if (!res.ok) return null
      const chains = (await res.json()) as Array<{ name?: string; tvl?: number }>
      const sol = chains.find((c) => c.name === 'Solana')
      return typeof sol?.tvl === 'number' ? sol.tvl : null
    } catch {
      return null
    }
  })()

  const volumePromise = (async () => {
    try {
      const url =
        'https://api.llama.fi/overview/dexs?chain=Solana&excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true'
      const res = await fetch(url, { next: { revalidate: 120 } })
      if (!res.ok) return null
      const json = (await res.json()) as { total24h?: number }
      return typeof json.total24h === 'number' ? json.total24h : null
    } catch {
      return null
    }
  })()

  const tvlHistoryPromise = (async () => {
    try {
      const res = await fetch('https://api.llama.fi/v2/historicalChainTvl/Solana', { next: { revalidate: 600 } })
      if (!res.ok) return null
      const arr = (await res.json()) as Array<{ date: number; tvl: number }>
      if (!Array.isArray(arr) || arr.length < 2) return null
      const last = arr[arr.length - 1]?.tvl
      const prev = arr[arr.length - 2]?.tvl
      if (typeof last !== 'number' || typeof prev !== 'number' || prev === 0) return null
      const change = ((last - prev) / prev) * 100
      return Number.isFinite(change) ? change : null
    } catch {
      return null
    }
  })()

  const volumeHistoryPromise = (async () => {
    try {
      const url =
        'https://api.llama.fi/overview/dexs?chain=Solana&excludeTotalDataChart=false&excludeTotalDataChartBreakdown=true'
      const res = await fetch(url, { next: { revalidate: 600 } })
      if (!res.ok) return null
      const json = (await res.json()) as { totalDataChart?: Array<[number, number]> }
      const chart = json.totalDataChart
      if (!Array.isArray(chart) || chart.length < 2) return null
      const last = chart[chart.length - 1]?.[1]
      const prev = chart[chart.length - 2]?.[1]
      if (typeof last !== 'number' || typeof prev !== 'number' || prev === 0) return null
      const change = ((last - prev) / prev) * 100
      return Number.isFinite(change) ? change : null
    } catch {
      return null
    }
  })()

  const [tps, solPriceUsd, solPrice24hAgo, tvlUsd, volume24hUsd, tvlChange24hPct, volume24hChangePct] =
    await Promise.all([
      tpsPromise,
      solPricePromise,
      solPrice24hAgoPromise,
      tvlPromise,
      volumePromise,
      tvlHistoryPromise,
      volumeHistoryPromise,
    ])

  let solChange24hPct: number | null = null
  if (typeof solPriceUsd === 'number' && typeof solPrice24hAgo === 'number' && solPrice24hAgo !== 0) {
    solChange24hPct = ((solPriceUsd - solPrice24hAgo) / solPrice24hAgo) * 100
  }

  const body: StatsResponseBody = {
    tps,
    solPriceUsd,
    tvlUsd,
    volume24hUsd,
    solChange24hPct: solChange24hPct !== null ? Number.parseFloat(solChange24hPct.toFixed(2)) : null,
    tvlChange24hPct: typeof tvlChange24hPct === 'number' ? Number.parseFloat(tvlChange24hPct.toFixed(2)) : null,
    volume24hChangePct:
      typeof volume24hChangePct === 'number' ? Number.parseFloat(volume24hChangePct.toFixed(2)) : null,
  }

  return NextResponse.json(body, {
    headers: {
      // Short CDN cache to coalesce frequent client polls while keeping UI near real-time
      'Cache-Control': 'public, s-maxage=3, stale-while-revalidate=15',
    },
  })
}
