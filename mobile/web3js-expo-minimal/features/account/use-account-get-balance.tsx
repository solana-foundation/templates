import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'

export function useAccountGetBalance({ publicKey }: { publicKey: PublicKey }) {
  const { chain, connection } = useMobileWallet()
  return useQuery({
    queryKey: ['get-balance', chain, publicKey.toString()],
    queryFn: () => connection.getBalance(publicKey),
  })
}
