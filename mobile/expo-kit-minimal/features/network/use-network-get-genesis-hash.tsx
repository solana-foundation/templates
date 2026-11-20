import { useQuery } from '@tanstack/react-query'
import { useSeekerWallet } from '@/components/seeker-wallet-provider'

export function useNetworkGetGenesisHash() {
  const { chain, client } = useSeekerWallet()
  return useQuery({
    queryKey: ['getGenesisHash', chain],
    queryFn: () => client.rpc.getGenesisHash().send(),
  })
}
