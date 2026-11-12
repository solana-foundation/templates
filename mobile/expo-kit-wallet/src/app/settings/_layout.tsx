import { Stack } from 'expo-router/stack'

import { useTheme } from '@/features/shell/data-access/use-theme'
import { ShellUiHeaderTitle } from '@/features/shell/ui/shell-ui-page-header'

export default function SettingsLayout() {
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
              icon="settings-outline"
              tintColor={tintColor}
              title="Settings"
            />
          ),
          title: 'Settings',
        }}
      />
      <Stack.Screen
        name="cluster"
        options={{
          headerTitle: () => (
            <ShellUiHeaderTitle
              foregroundColor={foregroundColor}
              icon="server-outline"
              tintColor={tintColor}
              title="Cluster"
            />
          ),
          title: 'Cluster',
        }}
      />
    </Stack>
  )
}
