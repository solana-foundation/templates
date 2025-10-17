import { useSolana } from '@/components/solana/use-solana'

export function useCounterAccountsQueryKey() {
  const { cluster } = useSolana()

  return ['counter', 'accounts', { cluster }]
}
