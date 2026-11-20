import { Redirect } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { NetworkUiSelect } from '../features/network/network-ui-select'
import { formatError } from '../utils/format-error'

// The connect screen. Everything else lives behind the tabs, which redirect
// back here when the wallet disconnects.
export default function App() {
  const insets = useSafeAreaInsets()
  const { account, connect } = useMobileWallet()
  const [error, setError] = useState<string | null>(null)
  const [isBusy, setIsBusy] = useState(false)

  if (account) {
    return <Redirect href="/(tabs)/pots" />
  }

  // Wallet actions can be declined or fail. Run them here so a rejection never
  // escapes as an unhandled promise and the reason ends up on screen.
  async function run(action: () => Promise<unknown>) {
    if (isBusy) {
      return
    }
    setIsBusy(true)
    setError(null)
    try {
      await action()
    } catch (e) {
      setError(formatError(e))
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <View
      className="flex-1 bg-white dark:bg-black items-center justify-center px-8"
      style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}
    >
      <Text className="text-5xl mb-4">🍯</Text>
      <Text className="text-4xl font-extrabold text-gray-800 dark:text-white mb-3 tracking-tight">Cause Pots</Text>
      <Text className="text-base text-gray-600 dark:text-gray-400 mb-8 text-center max-w-sm">
        Save together with friends. Pool funds into a shared pot that stays locked until the unlock date and only
        releases when enough contributors sign off.
      </Text>
      <Pressable
        disabled={isBusy}
        onPress={() => void run(connect)}
        className={`bg-blue-600 px-6 py-3 rounded-xl active:bg-blue-700 ${isBusy ? 'opacity-50' : ''}`}
      >
        <Text className="text-white font-bold text-lg">{isBusy ? 'Working...' : 'Connect Wallet'}</Text>
      </Pressable>
      {error ? <Text className="text-red-500 mt-3 text-center max-w-sm">{error}</Text> : null}
      <View className="mt-6">
        <NetworkUiSelect />
      </View>
      <StatusBar style="auto" />
    </View>
  )
}
