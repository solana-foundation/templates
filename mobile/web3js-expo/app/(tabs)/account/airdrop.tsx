import { AppView } from '@/components/app-view'
import { useRouter } from 'expo-router'
import { useWalletUi } from '@/components/solana/use-wallet-ui'
import { AccountFeatureAirdrop } from '@/components/account/account-feature-airdrop'

export default function Airdrop() {
  const router = useRouter()
  const { account } = useWalletUi()

  if (!account) {
    return router.replace('/(tabs)/account')
  }

  return (
    <AppView style={{ flex: 1, padding: 16 }}>
      <AccountFeatureAirdrop back={() => router.navigate('/(tabs)/account')} />
    </AppView>
  )
}
