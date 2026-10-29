import { useConnectedWallet } from '@solana/kit-plugin-wallet/react'
import { WalletIcon } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppClient } from '@/features/core/data-access/use-app-client'

import { WalletUiSeekerButton } from './ui/wallet-ui-seeker-button'
import { WalletFeatureAccount } from './wallet-feature-account'
import { WalletFeaturePrivySignIn } from './wallet-feature-privy-sign-in'
import { WalletFeatureSendMemo } from './wallet-feature-send-memo'
import { WalletFeatureSignIn } from './wallet-feature-sign-in'
import { WalletFeatureSignMessage } from './wallet-feature-sign-message'
import { WalletFeatureSignTransaction } from './wallet-feature-sign-transaction'

/**
 * The page's content: the account card plus one card per wallet operation, or a pointer to the
 * connect menu while nothing is connected. Each card receives the connected account or wallet as a
 * prop rather than reading the connection itself, so every example stays readable on its own.
 */
export function WalletFeatureEntry() {
  const client = useAppClient()
  const connected = useConnectedWallet(client)

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WalletIcon className="size-4" />
            No wallet connected
          </CardTitle>
          <CardDescription>
            Connect a wallet to sign in with Privy and run the examples below it. In Chrome on Android, or in a Solana
            Mobile web shell, the list includes any wallet installed on this device, over Mobile Wallet Adapter.
          </CardDescription>
        </CardHeader>
        {/*
          Seeker Connect ships two entry points: the wallet-standard registration that puts it in the
          connect menu (top right), and this branded button. Both drive the same connection — the
          button is the first-class surface for reaching a Seeker directly.
        */}
        <CardContent>
          <WalletUiSeekerButton variant="connect" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <WalletFeatureAccount account={connected.account} />
      <div className="grid gap-6 lg:grid-cols-2">
        <WalletFeaturePrivySignIn account={connected.account} />
        <WalletFeatureSignIn account={connected.account} wallet={connected.wallet} />
        <WalletFeatureSignMessage />
        <WalletFeatureSignTransaction account={connected.account} walletName={connected.wallet.name} />
        <WalletFeatureSendMemo />
      </div>
    </div>
  )
}
