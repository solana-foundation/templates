import { usePrivy } from '@privy-io/expo'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { ScrollView, Text, View } from 'react-native'

import { WalletFeatureBalance } from './wallet-feature-balance'
import { WalletFeatureConnect } from './wallet-feature-connect'
import { WalletFeatureDisconnect } from './wallet-feature-disconnect'
import { WalletFeaturePrivySignIn } from './wallet-feature-privy-sign-in'
import { WalletFeatureSignMessage } from './wallet-feature-sign-message'
import { WalletFeatureSignTransaction } from './wallet-feature-sign-transaction'
import { WalletUiAccountCard } from './ui/wallet-ui-account-card'
import { WalletUiStatusCard } from './ui/wallet-ui-status-card'

export function WalletFeatureEntry() {
  const { error: privyError, isReady, user } = usePrivy()
  const { account } = useMobileWallet()

  return (
    <ScrollView className="flex-1 bg-zinc-950" contentContainerClassName="gap-5 px-5 pb-10 pt-16">
      <View className="gap-3">
        <View className="self-start rounded-full bg-emerald-400/10 px-3 py-1">
          <Text className="text-xs font-bold uppercase text-emerald-300">Solana MWA</Text>
        </View>
        <Text className="text-5xl font-extrabold text-white">Privy & MWA</Text>
        <Text className="text-base leading-6 text-zinc-400">
          Connect a mobile wallet, authenticate with Privy, and run common Solana wallet actions.
        </Text>
      </View>

      {!isReady ? <WalletUiStatusCard description="Preparing Privy authentication." title="Loading..." /> : null}

      {privyError ? <WalletUiStatusCard description={privyError.message} tone="danger" title="Privy error" /> : null}

      {isReady && !privyError ? (
        <>
          {account ? (
            <WalletUiAccountCard
              address={account.address.toString()}
              label={account.label}
              privyUserId={user?.id ?? null}
            />
          ) : null}

          {!account ? <WalletFeatureConnect /> : null}

          {account && !user ? <WalletFeaturePrivySignIn address={account.address} /> : null}

          {account ? (
            <>
              <WalletFeatureBalance address={account.address} />
              <WalletFeatureSignMessage address={account.address} />
              <WalletFeatureSignTransaction address={account.address} />
              <WalletFeatureDisconnect />
            </>
          ) : null}
        </>
      ) : null}
    </ScrollView>
  )
}
