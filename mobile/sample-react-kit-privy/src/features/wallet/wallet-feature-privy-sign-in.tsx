import { useLoginWithSiws, usePrivy } from '@privy-io/react-auth'
import { getBase64Decoder } from '@solana/kit'
import { useAction, useSignMessage } from '@solana/react'
import type { UiWalletAccount } from '@wallet-standard/ui'

import { Button } from '@/components/ui/button'
import { WalletUiActionCard } from '@/features/wallet/ui/wallet-ui-action-card'

/**
 * Exchanges a wallet signature for a Privy session.
 *
 * This is the headless Sign-In With Solana flow: Privy generates the SIWS message (with a nonce it
 * issued and will verify server-side), the already-connected wallet signs it through the same
 * wallet-standard path every other card uses, and `loginWithSiws` trades the signature for a
 * session. None of Privy's own connect UI is involved, which is what lets a wallet reached over
 * Mobile Wallet Adapter sign in exactly like a browser extension.
 *
 * Privy expects the signature as base64 — the same encoding its own connect flow produces.
 *
 * Signing in again with a different account links that account to a session of its own. Logging out
 * here only ends the Privy session; the wallet stays connected. Disconnecting from the wallet menu
 * does both.
 */
export function WalletFeaturePrivySignIn({ account }: { account: UiWalletAccount }) {
  const { authenticated, logout, ready, user } = usePrivy()
  const { generateSiwsMessage, loginWithSiws } = useLoginWithSiws()
  const signMessage = useSignMessage(account)

  const signIn = useAction(async () => {
    const message = await generateSiwsMessage({ address: account.address })
    const { signature } = await signMessage({ message: new TextEncoder().encode(message) })
    await loginWithSiws({ message, signature: getBase64Decoder().decode(signature) })
  })
  const signOut = useAction(async () => {
    await logout()
  })

  return (
    <WalletUiActionCard
      description="Signs a Sign-In With Solana message issued by Privy and exchanges it for a Privy session."
      error={signIn.error ?? signOut.error}
      title="Privy authentication"
    >
      {authenticated && user ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs">Privy user</span>
            <code className="font-mono text-xs break-all">{user.id}</code>
          </div>
          <Button disabled={signOut.isRunning} onClick={() => signOut.dispatch()} variant="outline">
            {signOut.isRunning ? 'Logging out…' : 'Log out'}
          </Button>
        </div>
      ) : (
        <Button disabled={!ready || signIn.isRunning} onClick={() => signIn.dispatch()} variant="outline">
          {!ready ? 'Preparing Privy…' : signIn.isRunning ? 'Waiting for wallet…' : 'Sign in with Privy'}
        </Button>
      )}
    </WalletUiActionCard>
  )
}
