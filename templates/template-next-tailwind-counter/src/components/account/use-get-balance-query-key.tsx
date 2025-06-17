import { Address } from 'gill'
import { useWalletUi } from '@wallet-ui/react'

export function useGetBalanceQueryKey({ address }: { address: Address }) {
  const { cluster } = useWalletUi()

  return ['get-balance', { cluster, address }]
}
