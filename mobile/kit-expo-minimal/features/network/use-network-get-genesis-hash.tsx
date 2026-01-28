import { useQuery } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-kit'

export function useNetworkGetGenesisHash() {
  const { chain, client } = useMobileWallet()
  return useQuery({
    queryKey: ['getGenesisHash', chain],
    queryFn: () => client.rpc.getGenesisHash().send(),
  })
}
