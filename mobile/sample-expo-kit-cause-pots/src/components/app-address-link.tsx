import * as Clipboard from 'expo-clipboard'
import { openURL } from 'expo-linking'
import { useState, type ReactNode } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useNetwork } from '../features/network/use-network'
import { ellipsify } from '../utils/ellipsify'

// A labeled address with an explorer link and a copy button. Tapping the
// address also copies it. `name` replaces the shortened address on screen.
export function AppAddressLink({ address, label, name }: { address: string; label: string; name?: ReactNode }) {
  const { getExplorerUrl } = useNetwork()
  const [copied, setCopied] = useState(false)

  async function copy() {
    await Clipboard.setStringAsync(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <View className="flex-row items-center gap-1">
      <Pressable onPress={() => void copy()}>
        <Text className="text-gray-600 dark:text-gray-400">
          {label}: {name ?? ellipsify(address)}
        </Text>
      </Pressable>
      <Pressable
        accessibilityLabel={`Open ${label} address in Solana Explorer`}
        accessibilityRole="button"
        onPress={() => void openURL(getExplorerUrl(`address/${address}`))}
        hitSlop={8}
      >
        <Text className="w-7 text-center text-base">🌐</Text>
      </Pressable>
      <Pressable
        accessibilityLabel={`Copy ${label} address`}
        accessibilityRole="button"
        onPress={() => void copy()}
        hitSlop={8}
      >
        <Text className="w-7 text-center text-base">{copied ? '✅' : '📋'}</Text>
      </Pressable>
    </View>
  )
}
