import { CounterAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useCounterSetMutation } from '@/features/counter/data-access/use-counter-set-mutation'

export function CounterUiButtonSet({ account, counter }: { account: UiWalletAccount; counter: CounterAccount }) {
  const setMutation = useCounterSetMutation({ account, counter })

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
