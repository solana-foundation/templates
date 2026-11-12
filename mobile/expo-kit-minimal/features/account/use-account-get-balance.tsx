import { useQuery } from '@tanstack/react-query'
import { useSeekerWallet } from '@/components/seeker-wallet-provider'
import { Address } from '@solana/kit'

export function useAccountGetBalance({ address }: { address: Address }) {
  const { chain, client } = useSeekerWallet()
  return useQuery({
    queryKey: ['get-balance', chain, address],
    queryFn: () => client.rpc.getBalance(address).send(),
  })
}
