import { useSolana } from '@/components/solana/use-solana'
import { useQuery } from '@tanstack/react-query'
import { getCounterProgramAccounts } from '@project/anchor'
import { useCounterAccountsQueryKey } from './use-counter-accounts-query-key'

export function useCounterAccountsQuery() {
  const { client } = useSolana()

  return useQuery({
    queryKey: useCounterAccountsQueryKey(),
    queryFn: async () => await getCounterProgramAccounts(client.rpc),
  })
}
