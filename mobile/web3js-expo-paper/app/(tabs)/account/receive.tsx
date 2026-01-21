import { useRouter } from 'expo-router'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { AccountFeatureReceive } from '@/components/account/account-feature-receive'
import { AppView } from '@/components/app-view'

export default function Receive() {
  const router = useRouter()
  const { account } = useMobileWallet()

  if (!account) {
    return router.replace('/(tabs)/account')
  }

  return (
    <AppView style={{ flex: 1, padding: 16 }}>
      <AccountFeatureReceive address={account.address} />
    </AppView>
  )
}
