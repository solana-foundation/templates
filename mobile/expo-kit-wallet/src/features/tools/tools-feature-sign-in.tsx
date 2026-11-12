import { getBase64Decoder } from '@solana/kit'
import type { Account, SignInOutput, SignInPayload, SolanaClusterId } from '@wallet-ui/react-native-kit'

import { ToolsUiActionCard } from '@/features/tools/ui/tools-ui-action-card'
import { useWalletSignIn } from '@/features/wallet/data-access/use-wallet-sign-in'

export function ToolsFeatureSignIn({
  account,
  cluster,
  signIn,
}: {
  account: Account
  cluster: SolanaClusterId
  signIn: (signInPayload: SignInPayload) => Promise<SignInOutput>
}) {
  const { isPending, mutateAsync } = useWalletSignIn({ account, cluster, signIn })

  return (
    <ToolsUiActionCard
      actionLabel="Sign In"
      defaultText="We hope you enjoy your stay!"
      description="Create and sign a Solana Sign-In payload."
      isLoading={isPending}
      onSubmit={async (statement) => {
        const result = await mutateAsync(statement)

        return {
          description: `Signed in as ${result.account.address.toString()}. Signature: ${getBase64Decoder().decode(result.signature)}`,
          status: 'success',
          title: 'Signed in',
        }
      }}
      title="Sign In"
    />
  )
}
