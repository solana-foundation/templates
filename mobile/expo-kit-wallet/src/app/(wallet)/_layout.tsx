import { Stack } from 'expo-router/stack'

import { ClusterUiSelect } from '@/features/cluster/ui/cluster-ui-select'
import { useTheme } from '@/features/shell/data-access/use-theme'
import { ShellUiHeaderTitle } from '@/features/shell/ui/shell-ui-page-header'

export default function WalletLayout() {
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
          headerRight: () => <ClusterUiSelect contentWidth={280} triggerClassName="min-w-36 rounded-xl px-3 py-2" />,
          headerTitle: () => (
            <ShellUiHeaderTitle
              foregroundColor={foregroundColor}
              icon="wallet-outline"
              tintColor={tintColor}
              title="Wallet"
            />
          ),
          title: 'Wallet',
        }}
      />
      <Stack.Screen
        name="activity"
        options={{
          headerRight: () => <ClusterUiSelect contentWidth={280} triggerClassName="min-w-36 rounded-xl px-3 py-2" />,
          headerTitle: () => (
            <ShellUiHeaderTitle
              foregroundColor={foregroundColor}
              icon="time-outline"
              tintColor={tintColor}
              title="Activity"
            />
          ),
          title: 'Activity',
        }}
      />
    </Stack>
  )
}
