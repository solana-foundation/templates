import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'

export function useAccountGetBalance({ address }: { address: PublicKey }) {
  const { chain, connection } = useMobileWallet()
  return useQuery({
    queryKey: ['get-balance', chain, address.toString()],
    queryFn: () => connection.getBalance(address),
  })
}
