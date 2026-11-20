import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { Text, View, Pressable } from 'react-native'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { formatError } from '../utils/format-error'

export default function App() {
  const { account, connect, disconnect } = useMobileWallet()
  const [error, setError] = useState<string | null>(null)
  const [isBusy, setIsBusy] = useState(false)

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
    <View className="flex-1 bg-white dark:bg-black items-center justify-center px-8">
      {/* Heading */}
      <Text className="text-4xl font-extrabold text-gray-800 dark:text-white mb-3 tracking-tight">🚀 Welcome</Text>

      {/* Subheading */}
      <Text className="text-xl dark:text-white text-gray-700 mb-8 text-center leading-relaxed">
        Build beautiful apps with <Text className="text-blue-500 font-semibold">Expo + Uniwind + @solana/kit 🔥</Text>
      </Text>

      <View className="mb-8 items-center">
        {account ? (
          <View className="items-center">
            <Text className="text-gray-600 dark:text-gray-400 mb-2">
              Connected: {account.address.toString().slice(0, 8)}...
            </Text>
            <Pressable
              disabled={isBusy}
              onPress={() => void run(disconnect)}
              className={`bg-red-500 px-6 py-3 rounded-xl active:bg-red-600 ${isBusy ? 'opacity-50' : ''}`}
            >
              <Text className="text-white font-bold">{isBusy ? 'Working...' : 'Disconnect Wallet'}</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            disabled={isBusy}
            onPress={() => void run(connect)}
            className={`bg-blue-600 px-6 py-3 rounded-xl active:bg-blue-700 ${isBusy ? 'opacity-50' : ''}`}
          >
            <Text className="text-white font-bold text-lg">{isBusy ? 'Working...' : 'Connect Wallet'}</Text>
          </Pressable>
        )}
        {error ? <Text className="text-red-500 mt-3 text-center max-w-sm">{error}</Text> : null}
      </View>

      {/* Instruction text */}
      <Text className="text-base text-gray-600 dark:text-white text-center max-w-sm">
        Start customizing your app by editing{' '}
        <Text className="font-semibold text-gray-800 dark:text-white">app/index.tsx</Text>
      </Text>

      <StatusBar style="auto" />
    </View>
  )
}
