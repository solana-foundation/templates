import { useSolana } from '@/components/solana/use-solana'
import { useQuery } from '@tanstack/react-query'

export function useClusterVersion() {
  const { client, cluster } = useSolana()
  return useQuery({
    retry: false,
    queryKey: ['version', { cluster }],
    queryFn: () => client.rpc.getVersion().send(),
  })
}
