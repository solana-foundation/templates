import { useRouter } from 'expo-router'
import { useWalletUi } from '@/components/solana/use-wallet-ui'
import { AccountFeatureSend } from '@/components/account/account-feature-send'
import { AppView } from '@/components/app-view'

export default function Send() {
  const router = useRouter()
  const { account } = useWalletUi()

  if (!account) {
    return router.replace('/(tabs)/account')
  }

  return (
    <AppView style={{ flex: 1, padding: 16 }}>
      <AccountFeatureSend address={account.publicKey} />
    </AppView>
  )
}
