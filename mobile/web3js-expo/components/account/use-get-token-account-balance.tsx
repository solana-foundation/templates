import { PublicKey } from '@solana/web3.js'
import { useConnection } from '@/components/solana/solana-provider'
import { useQuery } from '@tanstack/react-query'

export function useGetTokenAccountBalance({ address }: { address: PublicKey }) {
  const connection = useConnection()

  return useQuery({
    queryKey: ['get-token-account-balance', { endpoint: connection.rpcEndpoint, account: address.toString() }],
    queryFn: () => connection.getTokenAccountBalance(address),
  })
}
