import { CounterAccount } from '@project/anchor'
import { Button } from '@/components/ui/button'

import { useCounterCloseMutation } from '@/features/counter/data-access/use-counter-close-mutation'

export function CounterUiButtonClose({ counter }: { counter: CounterAccount }) {
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
