import { useQuery } from '@tanstack/react-query'
import { useMobileWalletAdapter } from '@wallet-ui/react-native-web3js'

export function useNetworkGetGenesisHash() {
  const { clusterId, connection } = useMobileWalletAdapter()
  return useQuery({
    queryKey: ['getGenesisHash', clusterId],
    queryFn: () => connection.getGenesisHash(),
  })
}
