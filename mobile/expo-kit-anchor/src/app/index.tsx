import { StatusBar } from 'expo-status-bar'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { HELLO_WORLD_PROGRAM_ADDRESS } from '@project/anchor'
import { AppAddressLink } from '../components/app-address-link'
import { CounterFeature } from '../features/counter/counter-feature'
import { NetworkUiSelect } from '../features/network/network-ui-select'
import { useNetwork } from '../features/network/use-network'
import { formatError } from '../utils/format-error'
import { identity } from './_layout'

export default function App() {
  const insets = useSafeAreaInsets()
  const { account, connect, disconnect } = useMobileWallet()
  const { chain } = useNetwork()
  const walletMutation = useMutation({ mutationFn: (action: () => Promise<unknown>) => action() })
  const isBusy = walletMutation.isPending

  useEffect(() => {
    if (account) {
      console.log('Connected account:', account.address)
    }
  }, [account])

  return (
    // Anchor the content to the top so the layout stays put when content changes, and scroll when it
    // outgrows the screen.
    <ScrollView
      className="flex-1 bg-white dark:bg-black"
      contentContainerClassName="items-center px-8"
      contentContainerStyle={{ paddingBottom: insets.bottom, paddingTop: insets.top + 64 }}
    >
      {/* Heading */}
      <Text className="text-4xl font-extrabold text-gray-800 dark:text-white mb-3 tracking-tight">{identity.name}</Text>

      {/* Subheading */}
      <Text className="text-base text-gray-600 dark:text-gray-400 mb-8 text-center max-w-sm">
        Start customizing your app by editing{' '}
        <Text className="font-semibold text-gray-800 dark:text-white">src/app/index.tsx</Text>
      </Text>

      <View className="mb-4">
        <AppAddressLink address={HELLO_WORLD_PROGRAM_ADDRESS} label="Program" />
      </View>

      <View className="mb-8 items-center">
        {account ? (
          <View className="items-center">
            <View className="mb-2">
              <AppAddressLink address={account.address.toString()} label="Wallet" />
            </View>
            <Pressable
              disabled={isBusy}
              onPress={() => walletMutation.mutate(disconnect)}
              className={`bg-red-500 px-6 py-3 rounded-xl active:bg-red-600 ${isBusy ? 'opacity-50' : ''}`}
            >
              <Text className="text-white font-bold">{isBusy ? 'Working...' : 'Disconnect Wallet'}</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            disabled={isBusy}
            onPress={() => walletMutation.mutate(connect)}
            className={`bg-blue-600 px-6 py-3 rounded-xl active:bg-blue-700 ${isBusy ? 'opacity-50' : ''}`}
          >
            <Text className="text-white font-bold text-lg">{isBusy ? 'Working...' : 'Connect Wallet'}</Text>
          </Pressable>
        )}
        {walletMutation.error ? (
          <Text className="text-red-500 mt-3 text-center max-w-sm">{formatError(walletMutation.error)}</Text>
        ) : null}
        <View className="mt-4">
          <NetworkUiSelect />
        </View>
      </View>

      {account ? <CounterFeature key={chain} /> : null}

      <StatusBar style="auto" />
    </ScrollView>
  )
}
