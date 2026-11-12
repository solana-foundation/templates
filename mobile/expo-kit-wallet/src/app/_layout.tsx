import '../global.css'

import Ionicons from '@expo/vector-icons/Ionicons'
import { Tabs } from 'expo-router/js-tabs'
import { AppProviders } from '@/features/core/data-access/app-providers'
import { useTheme } from '@/features/shell/data-access/use-theme'

export default function Layout() {
  return (
    <AppProviders>
      <AppTabs />
    </AppProviders>
  )
}

function AppTabs() {
  const { backgroundColor, isDark, mutedColor, tintColor } = useTheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor },
        tabBarActiveTintColor: tintColor,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: mutedColor,
        tabBarStyle: {
          backgroundColor,
          borderTopColor: isDark ? '#1F2937' : '#E5E7EB',
        },
      }}
    >
      <Tabs.Screen
        name="(wallet)"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons color={color as string} name={focused ? 'wallet' : 'wallet-outline'} size={size} />
          ),
          title: 'Wallet',
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons color={color as string} name={focused ? 'construct' : 'construct-outline'} size={size} />
          ),
          title: 'Tools',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons color={color as string} name={focused ? 'settings' : 'settings-outline'} size={size} />
          ),
          title: 'Settings',
        }}
      />
    </Tabs>
  )
}
