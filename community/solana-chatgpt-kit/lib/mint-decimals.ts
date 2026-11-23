import { PublicKey } from '@solana/web3.js'
import type { AccountInfo, ParsedAccountData } from '@solana/web3.js'

type ParsedAccountReader = (address: PublicKey) => Promise<{ value: AccountInfo<Buffer | ParsedAccountData> | null }>

// Decimals scale the swap amount, so they are never guessed: known mints come from `known`, any other
// mint is read from the chain. A mint's decimals never change, so each mint is read at most once.
export function createMintDecimalsReader(
  getParsedAccountInfo: ParsedAccountReader,
  known: Record<string, number> = {},
) {
  const decimalsByMint = new Map<string, number>(Object.entries(known))

  return async function readMintDecimals(mint: string): Promise<number> {
    const cached = decimalsByMint.get(mint)
    if (cached !== undefined) return cached

    let address: PublicKey
    try {
      address = new PublicKey(mint)
    } catch {
      throw new Error(`Not a valid token mint address: ${mint}`)
    }
    const { value } = await getParsedAccountInfo(address)
    const parsed = value && 'parsed' in value.data ? value.data.parsed : undefined
    const decimals = parsed?.type === 'mint' ? parsed.info?.decimals : undefined
    if (typeof decimals !== 'number') {
      throw new Error(`Could not read decimals for token mint ${mint}`)
    }
    decimalsByMint.set(mint, decimals)
    return decimals
  }
}
