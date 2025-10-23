export interface DexVolumeData {
  date: number
  dailyVolume: number
  totalVolume: number
  breakdown: Record<string, number>
}

export interface DexProtocolSummary {
  name: string
  displayName: string
  disabled: boolean
  logo: string
  address: string
  url: string
  description: string
  audits: string
  category: string
  twitter: string
  audit_links: string[]
  forkedFrom: string[]
  gecko_id: string
  chains: string[]
  module: string
  protocolType: string
  methodology: string
  latestFetchIsOk: boolean
  slug: string
  tvl: number
  chainTvls: Record<string, number>
  change_1h: number
  change_1d: number
  change_7d: number
  fdv: number
  mcap: number
  total24h: number
  total48hto24h: number
  total7d: number
  total14dto7d: number
  total60dto30d: number
  total30d: number
  totalAllTime: number
  breakdown24h: Record<string, Record<string, number>>
}

const DEFILLAMA_API = 'https://api.llama.fi'

export async function getSolanaDexVolumes(): Promise<DexVolumeData[]> {
  try {
    const response = await fetch(`${DEFILLAMA_API}/overview/dexs?excludeTotalDataChart=false`, {
      next: { revalidate: 600, tags: ['defillama:dex:overview'] },
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch DEX overview: ${response.status}`)
    }

    const data = await response.json()

    if (data.totalDataChartBreakdown && Array.isArray(data.totalDataChartBreakdown)) {
      // Get list of Solana DEX protocols first
      const solanaProtocols = await getSolanaDexProtocols()
      const solanaProtocolNames = new Set(solanaProtocols.map((p) => p.name))

      return data.totalDataChartBreakdown.map((item: any) => {
        const timestamp = item[0]
        const breakdown = item[1] || {}

        // Sum up volumes for all Solana DEXs and track individual volumes
        let solanaVolume = 0
        const dexBreakdown: Record<string, number> = {}

        for (const [protocol, volume] of Object.entries(breakdown)) {
          if (solanaProtocolNames.has(protocol)) {
            const vol = (volume as number) || 0
            solanaVolume += vol
            dexBreakdown[protocol] = vol
          }
        }

        return {
          date: timestamp,
          dailyVolume: solanaVolume,
          totalVolume: solanaVolume,
          breakdown: dexBreakdown,
        }
      })
    }

    return []
  } catch (error) {
    console.error('[v0] Error fetching Solana DEX volumes:', error)
    return []
  }
}

export async function getDexProtocolSummary(protocol: string): Promise<DexProtocolSummary | null> {
  try {
    const response = await fetch(`${DEFILLAMA_API}/summary/dexs/${protocol}`, {
      next: { revalidate: 600, tags: ['defillama:dex:protocol', `defillama:dex:protocol:${protocol}`] },
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch protocol summary: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`[v0] Error fetching protocol summary for ${protocol}:`, error)
    return null
  }
}

export async function getSolanaDexProtocols(): Promise<DexProtocolSummary[]> {
  try {
    // Get all DEX protocols
    const response = await fetch(`${DEFILLAMA_API}/overview/dexs?chain=Solana&excludeTotalDataChart=true`, {
      next: { revalidate: 900, tags: ['defillama:dex:protocols'] },
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch DEX protocols: ${response.status}`)
    }

    const data = await response.json()

    // Filter for protocols that have Solana in their chains
    if (data.protocols && Array.isArray(data.protocols)) {
      return data.protocols.filter((p: any) => p.chains && Array.isArray(p.chains) && p.chains.includes('Solana'))
    }

    return []
  } catch (error) {
    console.error('[v0] Error fetching Solana DEX protocols:', error)
    return []
  }
}

export async function getDexProtocolDetails(protocol: string): Promise<any> {
  try {
    const response = await fetch(`${DEFILLAMA_API}/summary/dexs/${protocol}`, {
      next: { revalidate: 600, tags: ['defillama:dex:protocol', `defillama:dex:protocol:${protocol}`] },
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch protocol details: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`[v0] Error fetching protocol details for ${protocol}:`, error)
    return null
  }
}
