import Constants from 'expo-constants'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Link } from 'expo-router'
import { Card } from 'heroui-native/card'
import { Pressable, Text, View } from 'react-native'

import { useTheme } from '@/features/shell/data-access/use-theme'
import { ShellUiPage } from '@/features/shell/ui/shell-ui-page'
import { ShellUiThemeSwitcher } from '@/features/shell/ui/shell-ui-theme-switcher'
import packageJson from '../../../package.json'

export function SettingsFeatureEntry() {
  const { tintColor } = useTheme()
  const appName = Constants.expoConfig?.name ?? 'Expo Kit Wallet'
  const appVersion = packageJson.version

  return (
    <ShellUiPage contentClassName="flex-1 justify-between gap-0">
      <View className="gap-6">
        <Link asChild href="/settings/cluster">
          <Pressable accessibilityRole="button">
            <Card className="gap-2 p-5">
              <View className="flex-row items-center gap-2">
                <Ionicons color={tintColor} name="server-outline" size={22} />
                <Card.Title className="flex-1 text-xl font-bold">Cluster</Card.Title>
                <Ionicons color={tintColor} name="chevron-forward" size={18} />
              </View>
              <Card.Description className="leading-relaxed">RPC and wallet authorization target.</Card.Description>
            </Card>
          </Pressable>
        </Link>
        <ShellUiThemeSwitcher />
      </View>
      <Text className="w-full py-3 text-center text-muted">{`${appName} v${appVersion}`}</Text>
    </ShellUiPage>
  )
}
