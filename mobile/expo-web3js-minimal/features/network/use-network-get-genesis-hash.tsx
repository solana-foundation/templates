import { useQuery } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'

export function useNetworkGetGenesisHash() {
  const { chain, connection } = useMobileWallet()
  return useQuery({
    queryKey: ['getGenesisHash', chain],
    queryFn: () => connection.getGenesisHash(),
  })
}
