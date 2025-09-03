import { CounterAccount } from '@project/anchor'
import { Button } from '@/components/ui/button'

import { useCounterDecrementMutation } from '../data-access/use-counter-decrement-mutation'

export function CounterUiButtonDecrement({ counter }: { counter: CounterAccount }) {
  const decrementMutation = useCounterDecrementMutation({ counter })

  return (
    <Button variant="outline" onClick={() => decrementMutation.mutateAsync()} disabled={decrementMutation.isPending}>
      Decrement
    </Button>
  )
}
