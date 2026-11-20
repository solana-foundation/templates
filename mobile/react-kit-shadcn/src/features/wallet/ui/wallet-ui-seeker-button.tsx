import { defineSeekerConnectElements, type SeekerConnectButtonVariant } from '@solana-mobile/seeker-connect-ui'
import { SeekerConnectWalletName } from '@solana-mobile/seeker-connect-wallet-standard'
import { useConnect, useWallets } from '@solana/kit-plugin-wallet/react'

import { useAppClient } from '@/features/core/data-access/use-app-client'

// The element ships presentational-only, so it has to be registered before it can render. The call
// is idempotent and a no-op outside the browser.
defineSeekerConnectElements()

declare module 'react' {
  // Reopening the JSX namespace is the only way to type a custom element as an intrinsic tag.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'seeker-connect-button': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        disabled?: boolean
        variant?: SeekerConnectButtonVariant
      }
    }
  }
}

/**
 * The branded "Connect with Seeker" button — Seeker Connect's other surface, alongside the
 * wallet-standard registration that lists it in the connect menu. The Lit element is presentational:
 * it emits a click, and this wires that to a connect against the Seeker Connect wallet, which drives
 * the same flow — progress overlay and error dialog included — as picking it from the menu. It has
 * its own Shadow DOM, so it follows `prefers-color-scheme` rather than the app's theme override.
 */
export function WalletUiSeekerButton({ variant = 'connect' }: { variant?: SeekerConnectButtonVariant }) {
  const client = useAppClient()
  const wallets = useWallets(client)
  const connect = useConnect(client)
  const seeker = wallets.find((wallet) => wallet.name === SeekerConnectWalletName)

  return (
    <seeker-connect-button
      disabled={!seeker || connect.isRunning}
      onClick={() => seeker && connect.dispatch(seeker)}
      variant={variant}
    />
  )
}
