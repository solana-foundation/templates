import { useMutation } from '@tanstack/react-query'
import type { Account, useMobileWallet } from '@wallet-ui/react-native-kit'

import type { SolanaClient } from '@/features/cluster/data-access/create-solana-client'
import { ToolsUiActionCard } from '@/features/tools/ui/tools-ui-action-card'
import { executeWalletSignTransaction } from '@/features/wallet/util/execute-wallet-sign-transaction'

export function ToolsFeatureSignTransaction({
  account,
  client,
  signTransactions,
}: {
  account: Account
  client: SolanaClient
  signTransactions: ReturnType<typeof useMobileWallet>['signTransactions']
}) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (text: string) => executeWalletSignTransaction({ account, client, signTransactions, text }),
  })

  return (
    <ToolsUiActionCard
      actionLabel="Sign Transaction"
      defaultText="Hello Solana!"
      description="Create a memo transaction and request a wallet signature."
      isLoading={isPending}
      onSubmit={async (text) => {
        const signature = await mutateAsync(text)

        return {
          description: `Signature: ${signature}`,
          status: 'success',
          title: 'Transaction signed',
        }
      }}
      title="Sign Transaction"
    />
  )
}
