import { Button } from '@/components/ui/button'
import { UiWalletAccount } from '@wallet-ui/react'

import { useCounterInitializeMutation } from '@/features/counter/data-access/use-counter-initialize-mutation'

export function CounterUiButtonInitialize({ account }: { account: UiWalletAccount }) {
  const mutationInitialize = useCounterInitializeMutation({ account })

  return (
    <Button onClick={() => mutationInitialize.mutateAsync()} disabled={mutationInitialize.isPending}>
      Initialize Counter {mutationInitialize.isPending && '...'}
    </Button>
  )
}
