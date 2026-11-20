import type { SignInPayload } from '@wallet-ui/react-native-kit'
import { Text, View } from 'react-native'

export function WalletUiSignInPayload({ data, label }: { data: SignInPayload; label: string }) {
  return (
    <View className="gap-2 rounded-md border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950">
      <Text className="text-sm font-semibold text-neutral-900 dark:text-white">{label}</Text>
      <Text className="font-mono text-xs leading-5 text-neutral-700 dark:text-neutral-300" selectable>
        {JSON.stringify(data, null, 2)}
      </Text>
    </View>
  )
}
