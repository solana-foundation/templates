import {
  useWalletSignAndSendTransaction,
  type UseWalletSignAndSendTransactionProps,
} from '@/features/wallet/data-access/use-wallet-sign-and-send-transaction'
import { ToolsUiActionCard } from '@/features/tools/ui/tools-ui-action-card'

export function ToolsFeatureSignAndSendTransaction(props: UseWalletSignAndSendTransactionProps) {
  const { isPending, mutateAsync } = useWalletSignAndSendTransaction(props)

  return (
    <ToolsUiActionCard
      actionLabel="Sign and Send Transaction"
      defaultText="Hello Solana!"
      description="Create a memo transaction and submit it through the wallet."
      isLoading={isPending}
      onSubmit={async (text) => {
        const signature = await mutateAsync(text)

        return {
          description: `Signature: ${signature}`,
          status: 'success',
          title: 'Transaction sent',
        }
      }}
      title="Sign and Send Transaction"
    />
  )
}
