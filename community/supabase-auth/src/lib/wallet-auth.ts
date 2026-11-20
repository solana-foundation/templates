import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { AppClient } from './solana-client'
import { createSignInMessage } from '@solana/wallet-standard-util'

type WalletAuth = SupabaseClient['auth']
const pendingAuth = new WeakMap<WalletAuth, Promise<void>>()

// Session writes and their cleanup must finish before another component can log in.
function serializeAuth<T>(auth: WalletAuth, operation: () => Promise<T>): Promise<T> {
  const result = (pendingAuth.get(auth) ?? Promise.resolve()).then(operation)
  pendingAuth.set(
    auth,
    result.then(
      () => {},
      () => {},
    ),
  )
  return result
}

export function signOutWalletSession(auth: WalletAuth, expectedAccessToken?: string): Promise<void> {
  return serializeAuth(auth, async () => {
    if (expectedAccessToken !== undefined) {
      const { data, error } = await auth.getSession()
      if (error) throw error
      if (data.session?.access_token !== expectedAccessToken) return
    }
    const { error } = await auth.signOut({ scope: 'local' })
    if (error) throw error
  })
}

export function matchesWallet(user: User | null, address: string | undefined): boolean {
  return Boolean(
    address &&
      user?.identities?.some((identity) => {
        const claims = identity.identity_data?.custom_claims
        return identity.provider === 'web3' && claims?.chain === 'solana' && claims.address === address
      }),
  )
}

export async function signInWithWallet(auth: SupabaseClient['auth'], client: AppClient, signal: AbortSignal) {
  const connected = client.wallet.getState().connected
  if (!connected) throw new Error('Connect a wallet first.')
  const assertCurrent = () => {
    signal.throwIfAborted()
    if (client.wallet.getState().connected !== connected) throw new Error('Wallet changed. Please sign in again.')
  }
  assertCurrent()
  return serializeAuth(auth, async () => {
    assertCurrent()
    const message = createSignInMessage({
      domain: window.location.host,
      address: connected.account.address,
      statement: 'Please sign this message to authenticate with your wallet.',
      uri: window.location.href,
      version: '1',
      nonce: crypto.randomUUID().replaceAll('-', ''),
      issuedAt: new Date().toISOString(),
    })
    // Wallet prompts cannot be closed by the app, but an abandoned prompt must not hold the auth queue.
    const signature = await new Promise<Uint8Array>((resolve, reject) => {
      const onAbort = () => reject(signal.reason)
      signal.addEventListener('abort', onAbort, { once: true })
      Promise.resolve()
        .then(() => {
          assertCurrent()
          return client.wallet.signMessage(message)
        })
        .then(
          (value) => {
            signal.removeEventListener('abort', onAbort)
            resolve(value)
          },
          (error) => {
            signal.removeEventListener('abort', onAbort)
            reject(error)
          },
        )
    })
    assertCurrent()
    const result = await auth.signInWithWeb3({
      chain: 'solana',
      message: new TextDecoder().decode(message),
      signature: new Uint8Array(signature),
    })
    // Supabase may have saved a session while its HTTP response was in flight.
    try {
      assertCurrent()
    } catch (error) {
      const { error: cleanupError } = await auth.signOut({ scope: 'local' })
      if (cleanupError) throw cleanupError
      throw error
    }
    if (result.error) throw result.error
    return result.data
  })
}
