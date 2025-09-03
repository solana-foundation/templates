import { ReactNode } from 'react'

import { useCounterProgram } from '@/features/counter/data-access/use-counter-program'

export function CounterUiProgramGuard({ children }: { children: ReactNode }) {
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
