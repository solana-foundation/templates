import { CounterUiCard } from './counter-ui-card'
import { useCounterAccountsQuery } from '@/features/counter/data-access/use-counter-accounts-query'

export function CounterUiList() {
  const counterAccountsQuery = useCounterAccountsQuery()

  if (counterAccountsQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!counterAccountsQuery.data?.length) {
    return (
      <div className="text-center">
        <h2 className={'text-2xl'}>No accounts</h2>
        No accounts found. Initialize one to get started.
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {counterAccountsQuery.data?.map((counter) => (
        <CounterUiCard key={counter.address} counter={counter} />
      ))}
    </div>
  )
}
