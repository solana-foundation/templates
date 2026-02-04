import { useQuery } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { Address } from '@solana/kit'

export function useAccountGetBalance({ address }: { address: Address }) {
  const { chain, client } = useMobileWallet()
  return useQuery({
    queryKey: ['get-balance', chain, address],
    queryFn: () => client.rpc.getBalance(address).send(),
  })
}
