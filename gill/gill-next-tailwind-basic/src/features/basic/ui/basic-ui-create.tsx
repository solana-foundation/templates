import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { useGreetMutation } from '../data-access/use-greet-mutation'

export function BasicUiCreate({ account }: { account: UiWalletAccount }) {
  const greetMutation = useGreetMutation({ account })

  return (
    <Button onClick={() => greetMutation.mutateAsync()} disabled={greetMutation.isPending}>
      Run program{greetMutation.isPending && '...'}
    </Button>
  )
}
