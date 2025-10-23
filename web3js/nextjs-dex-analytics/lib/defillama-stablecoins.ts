'use server'

const STABLECOINS_API = 'https://stablecoins.llama.fi'

export interface Stablecoin {
  id: string
  name: string
  symbol: string
  gecko_id?: string
  pegType: string
  pegMechanism: string
  circulating: {
    peggedUSD: number
    peggedEUR?: number
  }
  chains: string[]
  chainCirculating: {
    [chain: string]: {
      current: {
        peggedUSD: number
      }
      circulatingPrevDay?: {
        peggedUSD: number
      }
      circulatingPrevWeek?: {
        peggedUSD: number
      }
    }
  }
  price?: number
  change_1d?: number
  change_7d?: number
  change_1m?: number
}

export interface StablecoinChartData {
  date: number
  totalCirculating: number
  [key: string]: number
}

// Get all stablecoins
export async function getAllStablecoins(): Promise<Stablecoin[]> {
  try {
    console.log('[v0] Fetching all stablecoins...')
    const response = await fetch(`${STABLECOINS_API}/stablecoins?includePrices=true`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      console.log(`[v0] Stablecoins API error: ${response.status}`)
      throw new Error(`Failed to fetch stablecoins: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`[v0] Fetched ${data.peggedAssets?.length || 0} stablecoins`)
    return data.peggedAssets || []
  } catch (error) {
    console.error('[v0] Error fetching stablecoins:', error)
    return []
  }
}

// Get Solana stablecoins
export async function getSolanaStablecoins(): Promise<Stablecoin[]> {
  const allStablecoins = await getAllStablecoins()
  const solanaStablecoins = allStablecoins.filter((coin) => coin.chains?.includes('Solana'))

  const enrichedStablecoins = solanaStablecoins.map((coin) => {
    const current = coin.chainCirculating?.Solana?.current?.peggedUSD || 0
    const prevDay = coin.chainCirculating?.Solana?.circulatingPrevDay?.peggedUSD || current

    const change_1d = prevDay > 0 ? ((current - prevDay) / prevDay) * 100 : 0

    return {
      ...coin,
      change_1d,
    }
  })

  console.log(`[v0] Found ${enrichedStablecoins.length} stablecoins on Solana`)
  return enrichedStablecoins
}

// Get historical stablecoin data for charts
export async function getStablecoinChartData(stablecoinId: string): Promise<StablecoinChartData[]> {
  try {
    console.log(`[v0] Fetching chart data for ${stablecoinId}...`)
    const response = await fetch(`${STABLECOINS_API}/stablecoin/${stablecoinId}`, {
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch stablecoin chart data: ${response.statusText}`)
    }

    const data = await response.json()
    return data.chainCirculating?.Solana || []
  } catch (error) {
    console.error(`[v0] Error fetching chart data for ${stablecoinId}:`, error)
    return []
  }
}

// Get aggregated Solana stablecoin market cap over time
export async function getSolanaStablecoinHistory(): Promise<StablecoinChartData[]> {
  try {
    console.log('[v0] Fetching Solana stablecoin history...')
    const response = await fetch(`${STABLECOINS_API}/stablecoincharts/Solana`, {
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      console.log(`[v0] Stablecoin charts API error: ${response.status}`)
      throw new Error(`Failed to fetch stablecoin history: ${response.statusText}`)
    }

    const data = await response.json()

    console.log(`[v0] Fetched ${data.length || 0} historical data points`)
    if (data.length > 0) {
      console.log('[v0] Sample data point:', JSON.stringify(data[0]))
    }

    return data || []
  } catch (error) {
    console.error('[v0] Error fetching stablecoin history:', error)
    return []
  }
}
