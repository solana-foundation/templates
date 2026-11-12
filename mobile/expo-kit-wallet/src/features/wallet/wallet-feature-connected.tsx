import Ionicons from '@expo/vector-icons/Ionicons'
import type { Account, useMobileWallet } from '@wallet-ui/react-native-kit'
import { Link } from 'expo-router'
import { Button } from 'heroui-native/button'
import { View } from 'react-native'

import { useTheme } from '@/features/shell/data-access/use-theme'
import { WalletFeatureAccount } from '@/features/wallet/wallet-feature-account'
import { WalletFeatureBalance } from '@/features/wallet/wallet-feature-balance'

export function WalletFeatureConnected({
  account,
  wallet,
}: {
  account: Account
  wallet: ReturnType<typeof useMobileWallet>
}) {
  const { tintColor } = useTheme()

  return (
    <View className="gap-6">
      <WalletFeatureAccount account={account} disconnect={wallet.disconnect} />
      <WalletFeatureBalance account={account} />
      <Link asChild href="./activity">
        <Button variant="outline">
          <View className="flex-row items-center justify-center gap-2">
            <Ionicons color={tintColor} name="time-outline" size={18} />
            <Button.Label>Activity</Button.Label>
          </View>
        </Button>
      </Link>
    </View>
  )
}
