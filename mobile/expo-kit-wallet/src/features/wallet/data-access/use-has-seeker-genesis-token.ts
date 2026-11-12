import { hasSeekerGenesisToken } from '@solana-mobile/skr-genesis-token'
import type { Address } from '@solana/kit'
import { useQuery } from '@tanstack/react-query'

import { mainnetRpc } from '@/features/wallet/data-access/mainnet-rpc'

export function useHasSeekerGenesisToken(address: Address) {
  return useQuery({
    queryFn: () => hasSeekerGenesisToken(mainnetRpc, address),
    queryKey: ['has-seeker-genesis-token', address],
    staleTime: 60 * 60 * 1000,
  })
}
