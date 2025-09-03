import { CounterAccount } from '@project/anchor'
import { Button } from '@/components/ui/button'
import { useCounterIncrementMutation } from '../data-access/use-counter-increment-mutation'

export function CounterUiButtonIncrement({ counter }: { counter: CounterAccount }) {
  const incrementMutation = useCounterIncrementMutation({ counter })

  return (
    <Button variant="outline" onClick={() => incrementMutation.mutateAsync()} disabled={incrementMutation.isPending}>
      Increment
    </Button>
  )
}
