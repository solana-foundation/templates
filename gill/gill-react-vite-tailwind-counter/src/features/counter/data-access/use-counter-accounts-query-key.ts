import { useWalletUi } from '@wallet-ui/react'

export function useCounterAccountsQueryKey() {
  const { cluster } = useWalletUi()

  return ['counter', 'accounts', { cluster }]
}
