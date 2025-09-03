import { Button } from '@/components/ui/button'

import { useCounterInitializeMutation } from '@/features/counter/data-access/use-counter-initialize-mutation'

export function CounterUiButtonInitialize() {
  const mutationInitialize = useCounterInitializeMutation()

  return (
    <Button onClick={() => mutationInitialize.mutateAsync()} disabled={mutationInitialize.isPending}>
      Initialize Counter {mutationInitialize.isPending && '...'}
    </Button>
  )
}
