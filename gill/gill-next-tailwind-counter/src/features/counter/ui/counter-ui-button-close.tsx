import { CounterAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useCounterCloseMutation } from '@/features/counter/data-access/use-counter-close-mutation'

export function CounterUiButtonClose({ account, counter }: { account: UiWalletAccount; counter: CounterAccount }) {
  const closeMutation = useCounterCloseMutation({ account, counter })

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
