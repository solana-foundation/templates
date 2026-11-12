import { getBase58Decoder } from '@solana/kit'
import { useAction, useSignMessage } from '@solana/react'
import { createSignInMessageText } from '@solana/wallet-standard-util'
import type { UiWallet, UiWalletAccount } from '@wallet-standard/ui'

import { Button } from '@/components/ui/button'
import { useAppClient } from '@/features/core/data-access/use-app-client'
import { WalletUiActionCard } from '@/features/wallet/ui/wallet-ui-action-card'
import { WalletUiUnsupportedCard } from '@/features/wallet/ui/wallet-ui-unsupported-card'

const SIGN_IN_FEATURE = 'solana:signIn'

export function WalletFeatureSignIn({ account, wallet }: { account: UiWalletAccount; wallet: UiWallet }) {
  if (!wallet.features.includes(SIGN_IN_FEATURE)) {
    return <WalletUiUnsupportedCard feature={SIGN_IN_FEATURE} title="Sign in" walletName={wallet.name} />
  }
  return <SignIn account={account} wallet={wallet} />
}

/**
 * Sign In With Solana.
 *
 * Unlike the other cards this is a connection operation, not just a signature — the wallet returns
 * the account it signed in with, and the plugin adopts it as the active connection. That primary
 * path goes through `client.wallet.signIn`, the same operation the plugin's `useSignIn` hook
 * dispatches, so the adoption behavior is unchanged.
 *
 * The catch block is a Mobile Wallet Adapter workaround. SIWS support is optional for MWA wallets,
 * but the MWA wallet-standard shim advertises `solana:signIn` unconditionally — it cannot know
 * which wallet will answer until association time — and throws once a wallet (Solflare, for one)
 * returns an authorization without a sign-in result. The MWA spec's own remedy is for the dapp to
 * build the identical SIWS message and request a plain message signature instead, which is what
 * the fallback does; the signed output verifies the same way. Two trade-offs: the fallback signs
 * with the already-connected account rather than one the wallet picks, and until the shim does
 * this internally (https://gist.github.com/beeman/dc248652209c7ea159b8626dd7fc0cce) the trigger is
 * a string match on its error message.
 */
function SignIn({ account, wallet }: { account: UiWalletAccount; wallet: UiWallet }) {
  const client = useAppClient()
  const signMessage = useSignMessage(account)

  const { data, dispatch, error, isRunning } = useAction(async (abortSignal) => {
    const input = {
      domain: window.location.host,
      // A real deployment mints this server-side and verifies it there. Generating it in the
      // browser proves nothing — an attacker replaying a captured signature would supply their
      // own — so treat this as a placeholder for a server-issued value.
      nonce: crypto.randomUUID(),
      statement: 'Sign in to the React Kit Privy sample.',
      uri: window.location.origin,
    }
    try {
      const { signature } = await client.wallet.signIn(wallet, input, { abortSignal })
      return getBase58Decoder().decode(signature)
    } catch (cause) {
      if (!isMissingSignInResult(cause)) throw cause
      const message = createSignInMessageText({ ...input, address: account.address })
      const { signature } = await signMessage({ message: new TextEncoder().encode(message) })
      return getBase58Decoder().decode(signature)
    }
  })

  return (
    <WalletUiActionCard
      description="Signs a Sign In With Solana message. Wallets that support sign-in pick the account and the app adopts it; other wallets sign with the already-connected account."
      error={error}
      result={data}
      title="Sign in"
    >
      <div className="flex flex-col gap-2">
        <Button disabled={isRunning} onClick={() => dispatch()} variant="outline">
          {isRunning ? 'Waiting for wallet…' : 'Sign in'}
        </Button>
        <p className="text-muted-foreground text-xs">
          The nonce is generated in the browser here. Issue and verify it on a server before using this to authenticate
          anyone.
        </p>
      </div>
    </WalletUiActionCard>
  )
}

function isMissingSignInResult(error: unknown): boolean {
  for (let cause: unknown = error; cause instanceof Error; cause = cause.cause) {
    if (cause.message.includes('no sign in result returned by wallet')) return true
  }
  return false
}
