import { getPrimarySkrDomain } from '@solana-mobile/skr-domain'
import type { Address } from '@solana/kit'
import { useQuery } from '@tanstack/react-query'

import { mainnetRpc } from '@/features/wallet/data-access/mainnet-rpc'

export function useGetPrimarySkrDomain(address: Address) {
  return useQuery({
    queryFn: () => getPrimarySkrDomain(mainnetRpc, address),
    queryKey: ['get-primary-skr-domain', address],
    // Primary names rarely change; don't hit the public mainnet RPC on every mount.
    staleTime: 60 * 60 * 1000,
  })
}
