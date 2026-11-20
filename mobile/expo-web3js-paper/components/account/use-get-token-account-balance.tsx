import { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'

export function useGetTokenAccountBalance({ address }: { address: PublicKey }) {
  const { connection } = useMobileWallet()

  return useQuery({
    queryKey: ['get-token-account-balance', { endpoint: connection.rpcEndpoint, account: address.toString() }],
    queryFn: () => connection.getTokenAccountBalance(address),
  })
}
