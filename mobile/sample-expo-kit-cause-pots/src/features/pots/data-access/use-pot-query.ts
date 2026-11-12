import { fetchMaybePot } from '@project/anchor'
import type { Address } from '@solana/kit'
import { useQuery } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-kit'

// A single pot by address, with the generated account fetcher. The address is
// undefined when the route parameter is invalid, which disables the query.
export function usePotQuery({ pot }: { pot: Address | undefined }) {
  const { chain, client } = useMobileWallet()

  return useQuery({
    enabled: !!pot,
    queryKey: ['pot', chain, pot],
    queryFn: async () => {
      if (!pot) {
        return null
      }
      const maybePot = await fetchMaybePot(client.rpc, pot)
      return maybePot.exists ? maybePot : null
    },
  })
}
