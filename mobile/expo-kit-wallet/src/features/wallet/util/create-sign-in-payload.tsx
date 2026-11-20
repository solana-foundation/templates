import { Account, type SignInPayload, type SolanaClusterId } from '@wallet-ui/react-native-kit'

import * as Linking from 'expo-linking'
import { WalletSignInSession } from '@/features/wallet/util/create-sign-in-session'

export const APP_DOMAIN = 'expo-kit-wallet'
export const APP_URI = Linking.createURL('/')
export const EXPIRES_AT_SECONDS = 60

export function createSignInPayload({
  account,
  cluster,
  session,
  statement,
}: {
  account: Account
  cluster: SolanaClusterId
  session: WalletSignInSession
  statement: string
}): SignInPayload {
  const issuedAt = session.issuedAt.toISOString()
  const uri = APP_URI

  return {
    address: account.address.toString(),
    chainId: cluster,
    domain: APP_DOMAIN,
    expirationTime: new Date(session.issuedAt.getTime() + EXPIRES_AT_SECONDS * 1000).toISOString(),
    issuedAt,
    nonce: session.nonce,
    notBefore: issuedAt,
    requestId: session.requestId,
    resources: [createAppResource('/settings'), createAppResource('/tools'), createAppResource('/wallet')].sort(),
    statement,
    uri,
    version: '1',
  }
}
function createAppResource(path: string) {
  return `${APP_URI.replace(/\/$/, '')}${path}`
}
