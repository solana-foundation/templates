import { fetchMaybeCounter, findCounterPda } from '@project/anchor'
import { useQuery } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-kit'

// The connected wallet's counter account: its derived address, and a `count`
// that is `null` until the account is initialized. Each wallet has its own
// counter, derived from the wallet address.
export function useCounterQuery() {
  const { account, chain, client } = useMobileWallet()

  return useQuery({
    enabled: !!account,
    queryKey: ['counter', chain, account?.address],
    queryFn: async () => {
      if (!account) {
        return null
      }
      const [counterAddress] = await findCounterPda({ authority: account.address })
      const counter = await fetchMaybeCounter(client.rpc, counterAddress)
      return { address: counterAddress, count: counter.exists ? counter.data.count : null }
    },
  })
}
