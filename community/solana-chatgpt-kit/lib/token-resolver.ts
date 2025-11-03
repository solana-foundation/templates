import { TOKENS, TOKEN_DECIMALS } from '@/lib/solana-config'

export type ResolvedToken = {
  mint: string
  symbol: string
  decimals: number
}

function isMintAddress(value: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)
}

function sanitizeSymbol(input: string): string {
  return input.trim().replace(/^\$/i, '').toUpperCase()
}

async function searchLiteBySymbol(
  symbol: string,
): Promise<{ address: string; symbol: string; decimals: number } | null> {
  try {
    const res = await fetch(`https://lite-api.jup.ag/tokens/v2/search?query=${encodeURIComponent(symbol)}`)
    if (!res.ok) return null
    const arr: Array<{ id: string; symbol: string; decimals: number; tags?: string[] }> = await res.json()
    if (!Array.isArray(arr) || arr.length === 0) return null
    // Prefer verified/strict if present
    arr.sort((a, b) => {
      const aw = (a.tags || []).some((x) => x === 'verified' || x === 'strict') ? 1 : 0
      const bw = (b.tags || []).some((x) => x === 'verified' || x === 'strict') ? 1 : 0
      return bw - aw
    })
    const t = arr[0]
    return { address: t.id, symbol: t.symbol, decimals: t.decimals ?? 9 }
  } catch {
    return null
  }
}

export async function resolveTokenParam(
  input: string | null | undefined,
  fallbackSymbol: keyof typeof TOKENS,
): Promise<ResolvedToken> {
  // Fallbacks
  const fallbackMint = TOKENS[fallbackSymbol]
  const fallbackDecimals = TOKEN_DECIMALS[fallbackSymbol] ?? 9

  if (!input || input.trim() === '') {
    return { mint: fallbackMint, symbol: String(fallbackSymbol), decimals: fallbackDecimals }
  }

  const raw = input.trim()
  if (isMintAddress(raw)) {
    // Best effort decimals discovery via token list; default to 9
    try {
      const res = await fetch('https://tokens.jup.ag/tokens')
      if (res.ok) {
        const tokens: Array<{ address: string; symbol: string; decimals: number }> = await res.json()
        const t = tokens.find((t) => t.address === raw)
        if (t) return { mint: raw, symbol: t.symbol || raw, decimals: t.decimals ?? 9 }
      }
    } catch {}
    return { mint: raw, symbol: raw, decimals: 9 }
  }

  // Symbol path
  const sym = sanitizeSymbol(raw)

  // Known map quick path
  if ((TOKENS as any)[sym]) {
    const mint = (TOKENS as any)[sym] as string
    const decimals = (TOKEN_DECIMALS as any)[sym] ?? 9
    return { mint, symbol: sym, decimals }
  }

  // Try lite search endpoint
  const hit = await searchLiteBySymbol(sym)
  if (hit) {
    return { mint: hit.address, symbol: sym, decimals: hit.decimals }
  }

  // Fallback
  return { mint: fallbackMint, symbol: String(fallbackSymbol), decimals: fallbackDecimals }
}
