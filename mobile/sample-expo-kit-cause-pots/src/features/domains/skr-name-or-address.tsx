import { getPrimarySkrDomain } from '@solana-mobile/skr-domain'
import type { Address } from '@solana/kit'
import { useQuery } from '@tanstack/react-query'
import { ellipsify } from '../../utils/ellipsify'
import { mainnetRpc } from './mainnet-rpc'

// A wallet's primary .skr name, looked up on mainnet, or its shortened
// address when it has none. Render it inside a <Text>.
export function SkrNameOrAddress({ address }: { address: Address }) {
  const { data } = useQuery({
    queryFn: () => getPrimarySkrDomain(mainnetRpc, address),
    queryKey: ['primary-skr-domain', address],
    // Primary names rarely change; don't hit the public mainnet RPC on every mount.
    staleTime: 60 * 60 * 1000,
  })
  return <>{data ?? ellipsify(address)}</>
}
