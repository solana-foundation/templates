import type { Address } from 'gill'
import { useWalletUi } from '@wallet-ui/react'

export function useGetSignaturesQueryKey({ address }: { address: Address }) {
  const { cluster } = useWalletUi()

  return ['get-signatures', { cluster, address }]
}
