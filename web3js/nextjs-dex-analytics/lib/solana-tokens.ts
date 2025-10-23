export const SOLANA_TOKEN_MINTS: Record<string, string> = {
  SOL: 'So11111111111111111111111111111111111111112', // Native SOL
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
  TRUMP: '6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN', // Official Trump
  PUMP: 'pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn', // Pump.fun
  WIF: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', // dogwifhat
  PYUSD: '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo', // Paypal USD,
  JUP: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', // Jupiter Token
  JLP: '27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4', // Jupiter LP Token
  cbBTC: 'cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij',
  EURC: 'HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr', // Euro Coin
  KMNO: 'KMNo3nJsBXfcpJTVhZcXLW7RmTwTt4GVFE7suUBo9sS',

  // Add more as needed (e.g., from Helius API)
}

export interface SolanaToken {
  symbol: string
  name: string
  icon: string
  mint: string
  decimals: number
  volume24h?: string // Optional: Added for reference (USD)
}

export const SOLANA_TOKENS: SolanaToken[] = [
  {
    symbol: 'SOL',
    name: 'Solana',
    icon: '◎',
    mint: SOLANA_TOKEN_MINTS.SOL,
    decimals: 9,
    volume24h: '$13.2B',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '💵',
    mint: SOLANA_TOKEN_MINTS.USDC,
    decimals: 6,
    volume24h: '$14.9B', // Included as high-volume stable
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    icon: '💵',
    mint: SOLANA_TOKEN_MINTS.USDT,
    decimals: 6,
  },
  {
    symbol: 'TRUMP',
    name: 'Official Trump',
    icon: '🇺🇸', // Placeholder; fetch real icon via API
    mint: SOLANA_TOKEN_MINTS.TRUMP,
    decimals: 6,
    volume24h: '$421M',
  },
  {
    symbol: 'PUMP',
    name: 'Pump.fun',
    icon: '🚀',
    mint: SOLANA_TOKEN_MINTS.PUMP,
    decimals: 6,
    volume24h: '$370M',
  },
  {
    symbol: 'WIF',
    name: 'dogwifhat',
    icon: '🐕‍🦺',
    mint: SOLANA_TOKEN_MINTS.WIF,
    decimals: 6,
    volume24h: '$362M',
  },
  {
    symbol: 'JUP',
    name: 'Jupiter',
    icon: '🪐',
    mint: SOLANA_TOKEN_MINTS.JUP,
    decimals: 6,
  },
  {
    symbol: 'JLP',
    name: 'Jupiter LP',
    icon: '💧',
    mint: SOLANA_TOKEN_MINTS.JLP,
    decimals: 6,
  },
  {
    symbol: 'PYUSD',
    name: 'PayPal USD',
    icon: '💰',
    mint: SOLANA_TOKEN_MINTS.PYUSD,
    decimals: 6,
  },
  {
    symbol: 'EURC',
    name: 'Euro Coin',
    icon: '💶',
    mint: SOLANA_TOKEN_MINTS.EURC,
    decimals: 6,
  },
  {
    symbol: 'cbBTC',
    name: 'Coinbase Wrapped BTC',
    icon: '₿',
    mint: SOLANA_TOKEN_MINTS.cbBTC,
    decimals: 6,
  },
  {
    symbol: 'KMNO',
    name: 'Kamino',
    icon: '🧪',
    mint: SOLANA_TOKEN_MINTS.KMNO,
    decimals: 6,
  },
  // Extend with more from API (e.g., Fefe, LAUNCHCOIN)
]

export function toTokenAmount(amount: number, decimals: number): string {
  return Math.floor(amount * Math.pow(10, decimals)).toString()
}

export function fromTokenAmount(amount: string, decimals: number): number {
  return Number.parseInt(amount) / Math.pow(10, decimals)
}
