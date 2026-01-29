import { useQuery } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-kit'

export function useNetworkGetVersion() {
  const { chain, client } = useMobileWallet()
  return useQuery({
    queryKey: ['getVersion', chain],
    queryFn: () =>
      client.rpc
        .getVersion()
        .send()
        .then((version) => ({ core: version['solana-core'], features: version['feature-set'] })),
  })
}
