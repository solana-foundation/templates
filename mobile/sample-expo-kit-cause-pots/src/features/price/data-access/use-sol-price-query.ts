import { useQuery } from '@tanstack/react-query'

// CoinGecko's public price endpoint, no API key required.
const SOL_PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'

// The SOL/USD rate, used to render pots with a USD display currency.
export function useSolPriceQuery() {
  return useQuery({
    queryKey: ['sol-price'],
    queryFn: async () => {
      const response = await fetch(SOL_PRICE_URL)
      if (!response.ok) {
        throw new Error(`Failed to fetch SOL price: ${response.status}`)
      }
      const data = (await response.json()) as { solana?: { usd?: number } }
      const price = data.solana?.usd
      if (typeof price !== 'number') {
        throw new Error('Unexpected SOL price response')
      }
      return price
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
  })
}
