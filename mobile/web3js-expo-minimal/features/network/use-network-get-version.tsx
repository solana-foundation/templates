import { useQuery } from '@tanstack/react-query'
import { useMobileWalletAdapter } from '@wallet-ui/react-native-web3js'

export function useNetworkGetVersion() {
  const { clusterId, connection } = useMobileWalletAdapter()
  return useQuery({
    queryKey: ['getVersion', clusterId],
    queryFn: () =>
      connection.getVersion().then((version) => ({ core: version['solana-core'], features: version['feature-set'] })),
  })
}
