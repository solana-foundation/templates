import { Stack } from 'expo-router/stack'

import { useTheme } from '@/features/shell/data-access/use-theme'
import { ShellUiHeaderTitle } from '@/features/shell/ui/shell-ui-page-header'

export default function ToolsLayout() {
  const { foregroundColor, navigationHeaderOptions, tintColor } = useTheme()

  return (
    <Stack
      screenOptions={{
        gestureEnabled: true,
        ...navigationHeaderOptions,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => (
            <ShellUiHeaderTitle
              foregroundColor={foregroundColor}
              icon="construct-outline"
              tintColor={tintColor}
              title="Tools"
            />
          ),
          title: 'Tools',
        }}
      />
      <Stack.Screen name="network" options={{ title: 'Network tools' }} />
      <Stack.Screen name="transaction" options={{ title: 'Transaction tools' }} />
      <Stack.Screen
        name="wallet-actions"
        options={{
          headerTitle: () => (
            <ShellUiHeaderTitle
              foregroundColor={foregroundColor}
              icon="wallet-outline"
              tintColor={tintColor}
              title="Wallet actions"
            />
          ),
          title: 'Wallet actions',
        }}
      />
    </Stack>
  )
}
