import { useQuery } from '@tanstack/react-query'
import { useSeekerWallet } from '@/components/seeker-wallet-provider'

export function useNetworkGetVersion() {
  const { chain, client } = useSeekerWallet()
  return useQuery({
    queryKey: ['getVersion', chain],
    queryFn: () =>
      client.rpc
        .getVersion()
        .send()
        .then((version) => ({ core: version['solana-core'], features: version['feature-set'] })),
  })
}
