import { Redirect, Tabs } from 'expo-router'
import { Text } from 'react-native'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { useNavColors } from '../../features/theme/use-nav-colors'

function tabIcon(emoji: string) {
  return function TabIcon({ focused }: { focused: boolean }) {
    return <Text className={`text-xl ${focused ? '' : 'opacity-40'}`}>{emoji}</Text>
  }
}

export default function TabsLayout() {
  const { account } = useMobileWallet()
  const colors = useNavColors()

  // Everything behind the tabs needs a connected wallet.
  if (!account) {
    return <Redirect href="/" />
  }

  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
      }}
    >
      {/* The pots tab hides the tab header because its nested stack brings its own. */}
      <Tabs.Screen name="pots" options={{ headerShown: false, tabBarIcon: tabIcon('🍯'), title: 'Pots' }} />
      <Tabs.Screen name="friends" options={{ tabBarIcon: tabIcon('👥'), title: 'Friends' }} />
      <Tabs.Screen name="activity" options={{ tabBarIcon: tabIcon('📜'), title: 'Activity' }} />
      <Tabs.Screen name="account" options={{ tabBarIcon: tabIcon('👛'), title: 'Account' }} />
    </Tabs>
  )
}
