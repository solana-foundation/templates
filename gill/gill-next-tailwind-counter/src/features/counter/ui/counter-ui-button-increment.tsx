import { CounterAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { useCounterIncrementMutation } from '../data-access/use-counter-increment-mutation'

export function CounterUiButtonIncrement({ account, counter }: { account: UiWalletAccount; counter: CounterAccount }) {
  const incrementMutation = useCounterIncrementMutation({ account, counter })

  return (
    <Button variant="outline" onClick={() => incrementMutation.mutateAsync()} disabled={incrementMutation.isPending}>
      Increment
    </Button>
  )
}
