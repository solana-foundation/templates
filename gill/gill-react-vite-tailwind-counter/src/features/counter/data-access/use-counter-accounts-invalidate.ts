import { useQueryClient } from '@tanstack/react-query'
import { useCounterAccountsQueryKey } from './use-counter-accounts-query-key'

export function useCounterAccountsInvalidate() {
  const queryClient = useQueryClient()
  const queryKey = useCounterAccountsQueryKey()

  return () => queryClient.invalidateQueries({ queryKey })
}
