export interface HeliusTokenMetadata {
  symbol: string
  name: string
  image?: string
  mint: string
  decimals: number
}

export interface TopToken {
  symbol: string
  name: string
  mint: string
  icon: string
  decimals: number
  volume24hUsd?: number
}

/**
 * Fetch token metadata (symbol, name, image, decimals) for a list of mints using Helius Tokens API.
 */
export async function fetchTokenMetadataFromHelius(
  mints: string[],
  heliusApiKey: string,
): Promise<Map<string, HeliusTokenMetadata>> {
  if (mints.length === 0) return new Map()

  const response = await fetch(`https://api.helius.xyz/v0/tokens/metadata?api-key=${heliusApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mintAccounts: mints }),
    // Node runtime; avoid edge fetch issues
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Helius token metadata: ${response.statusText}`)
  }

  const data = (await response.json()) as Array<{
    symbol?: string
    name?: string
    image?: string
    mint?: string
    decimals?: number
  }>

  const map = new Map<string, HeliusTokenMetadata>()
  for (const t of data) {
    if (!t.mint) continue
    map.set(t.mint, {
      symbol: t.symbol || '',
      name: t.name || '',
      image: t.image,
      mint: t.mint,
      decimals: typeof t.decimals === 'number' ? t.decimals : 0,
    })
  }

  return map
}

/**
 * Get top tokens by 24h volume using Jupiter price API as a ranking source, then enrich with Helius metadata.
 */
export async function getTopTokensByVolume(limit: number, heliusApiKey: string): Promise<TopToken[]> {
  const coinsRes = await fetch(
    `https://price.jup.ag/v6/coins?limit=${limit}&sortBy=volume24hUSD&direction=desc&offset=0`,
    { next: { revalidate: 300 } },
  )

  if (!coinsRes.ok) {
    throw new Error(`Failed to fetch top tokens: ${coinsRes.statusText}`)
  }

  const coins = (await coinsRes.json()) as Array<{
    id: string
    name: string
    symbol: string
    image: string
    volume24hUSD?: number
  }>

  const mints = coins.map((c) => c.id)
  let heliusMap = new Map<string, HeliusTokenMetadata>()
  try {
    heliusMap = await fetchTokenMetadataFromHelius(mints, heliusApiKey)
  } catch {
    // if Helius fails, continue with Jupiter images/symbols
    heliusMap = new Map()
  }

  return coins.map((c) => {
    const meta = heliusMap.get(c.id)
    return {
      symbol: meta?.symbol || c.symbol,
      name: meta?.name || c.name,
      mint: c.id,
      icon: meta?.image || c.image,
      decimals: meta?.decimals ?? 0,
      volume24hUsd: c.volume24hUSD,
    }
  })
}
