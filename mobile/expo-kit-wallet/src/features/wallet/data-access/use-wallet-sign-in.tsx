import { Account, SignInOutput, type SignInPayload, type SolanaClusterId } from '@wallet-ui/react-native-kit'
import { useMutation } from '@tanstack/react-query'
import { createSignInSession } from '@/features/wallet/util/create-sign-in-session'
import { executeWalletSignIn } from '@/features/wallet/util/execute-wallet-sign-in'

export function useWalletSignIn({
  account,
  cluster,
  signIn,
}: {
  account: Account
  cluster: SolanaClusterId
  signIn: (signInPayload: SignInPayload) => Promise<SignInOutput>
}) {
  return useMutation({
    mutationFn: (statement: string) => {
      const session = createSignInSession()

      return executeWalletSignIn({
        account,
        cluster,
        session,
        signIn,
        statement,
      })
    },
  })
}
