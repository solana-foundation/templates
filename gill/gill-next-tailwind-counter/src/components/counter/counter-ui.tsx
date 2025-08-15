import { ellipsify } from '@wallet-ui/react'
import {
  useCounterAccountsQuery,
  useCounterCloseMutation,
  useCounterDecrementMutation,
  useCounterIncrementMutation,
  useCounterInitializeMutation,
  useCounterProgram,
  useCounterProgramId,
  useCounterSetMutation,
} from './counter-data-access'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExplorerLink } from '../cluster/cluster-ui'
import { CounterAccount } from '@project/anchor'
import { ReactNode } from 'react'

export function CounterProgramExplorerLink() {
  const programId = useCounterProgramId()

  return <ExplorerLink address={programId.toString()} label={ellipsify(programId.toString())} />
}

export function CounterList() {
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
        <CounterCard key={counter.address} counter={counter} />
      ))}
    </div>
  )
}

export function CounterProgramGuard({ children }: { children: ReactNode }) {
  const programAccountQuery = useCounterProgram()

  if (programAccountQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!programAccountQuery.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }

  return children
}

function CounterCard({ counter }: { counter: CounterAccount }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Counter: {counter.data.count}</CardTitle>
        <CardDescription>
          Account: <ExplorerLink address={counter.address} label={ellipsify(counter.address)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-evenly">
          <CounterButtonIncrement counter={counter} />
          <CounterButtonSet counter={counter} />
          <CounterButtonDecrement counter={counter} />
          <CounterButtonClose counter={counter} />
        </div>
      </CardContent>
    </Card>
  )
}

export function CounterButtonInitialize() {
  const mutationInitialize = useCounterInitializeMutation()

  return (
    <Button onClick={() => mutationInitialize.mutateAsync()} disabled={mutationInitialize.isPending}>
      Initialize Counter {mutationInitialize.isPending && '...'}
    </Button>
  )
}

export function CounterButtonIncrement({ counter }: { counter: CounterAccount }) {
  const incrementMutation = useCounterIncrementMutation({ counter })

  return (
    <Button variant="outline" onClick={() => incrementMutation.mutateAsync()} disabled={incrementMutation.isPending}>
      Increment
    </Button>
  )
}

export function CounterButtonSet({ counter }: { counter: CounterAccount }) {
  const setMutation = useCounterSetMutation({ counter })

  return (
    <Button
      variant="outline"
      onClick={() => {
        const value = window.prompt('Set value to:', counter.data.count.toString() ?? '0')
        if (!value || parseInt(value) === counter.data.count || isNaN(parseInt(value))) {
          return
        }
        return setMutation.mutateAsync(parseInt(value))
      }}
      disabled={setMutation.isPending}
    >
      Set
    </Button>
  )
}

export function CounterButtonDecrement({ counter }: { counter: CounterAccount }) {
  const decrementMutation = useCounterDecrementMutation({ counter })

  return (
    <Button variant="outline" onClick={() => decrementMutation.mutateAsync()} disabled={decrementMutation.isPending}>
      Decrement
    </Button>
  )
}

export function CounterButtonClose({ counter }: { counter: CounterAccount }) {
  const closeMutation = useCounterCloseMutation({ counter })

  return (
    <Button
      variant="destructive"
      onClick={() => {
        if (!window.confirm('Are you sure you want to close this account?')) {
          return
        }
        return closeMutation.mutateAsync()
      }}
      disabled={closeMutation.isPending}
    >
      Close
    </Button>
  )
}
