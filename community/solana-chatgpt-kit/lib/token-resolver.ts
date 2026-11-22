import { PublicKey } from '@solana/web3.js'
import { TOKENS, TOKEN_DECIMALS, getSolanaConnection } from '@/lib/solana-config'

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

// A mint's decimals never change, so each mint is read from the chain at most once per server process.
const mintDecimals = new Map<string, number>()

async function readMintDecimals(mint: string): Promise<number> {
  const cached = mintDecimals.get(mint)
  if (cached !== undefined) return cached

  let address: PublicKey
  try {
    address = new PublicKey(mint)
  } catch {
    throw new Error(`Not a valid token mint address: ${mint}`)
  }
  const { value } = await getSolanaConnection().getParsedAccountInfo(address)
  const parsed = value && 'parsed' in value.data ? value.data.parsed : undefined
  const decimals = parsed?.type === 'mint' ? parsed.info?.decimals : undefined
  if (typeof decimals !== 'number') {
    throw new Error(`Could not read decimals for token mint ${mint}`)
  }
  mintDecimals.set(mint, decimals)
  return decimals
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
    // Decimals scale the swap amount, so never guess them: use the known list, else the mint account on-chain.
    const known = (Object.keys(TOKENS) as Array<keyof typeof TOKENS>).find((symbol) => TOKENS[symbol] === raw)
    if (known) return { mint: raw, symbol: known, decimals: TOKEN_DECIMALS[known] }

    return { mint: raw, symbol: raw, decimals: await readMintDecimals(raw) }
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
