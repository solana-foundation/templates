import { useMutation } from '@tanstack/react-query'
import type { useMobileWallet } from '@wallet-ui/react-native-kit'

import { ToolsUiActionCard } from '@/features/tools/ui/tools-ui-action-card'
import { executeWalletSignMessage } from '@/features/wallet/util/execute-wallet-sign-message'

export function ToolsFeatureSignMessage({
  signMessages,
}: {
  signMessages: ReturnType<typeof useMobileWallet>['signMessages']
}) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (text: string) => executeWalletSignMessage({ text, signMessages }),
  })

  return (
    <ToolsUiActionCard
      actionLabel="Sign Message"
      defaultText="Hello Solana!"
      description="Sign a message payload with the connected account."
      isLoading={isPending}
      onSubmit={async (text) => {
        const signedPayload = await mutateAsync(text)

        return {
          description: `Signed payload: ${signedPayload}`,
          status: 'success',
          title: 'Message signed',
        }
      }}
      title="Sign Message"
    />
  )
}
