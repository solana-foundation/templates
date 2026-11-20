import { Account, SignInOutput, type SignInPayload, type SolanaClusterId } from '@wallet-ui/react-native-kit'
import { createSignInPayload } from '@/features/wallet/util/create-sign-in-payload'

export type WalletSignInSession = {
  issuedAt: Date
  nonce: string
  requestId: string
}

export async function executeWalletSignIn({
  account,
  cluster,
  session,
  signIn,
  statement,
}: {
  account: Account
  cluster: SolanaClusterId
  session: WalletSignInSession
  signIn: (signInPayload: SignInPayload) => Promise<SignInOutput>
  statement: string
}) {
  const result = await signIn(createSignInPayload({ account, cluster, session, statement }))

  if (result.account.address !== account.address) {
    throw new Error('Signed-in account does not match the requested account.')
  }

  return result
}
