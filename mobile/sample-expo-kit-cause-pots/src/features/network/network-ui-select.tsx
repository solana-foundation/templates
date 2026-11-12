import { Pressable, Text, View } from 'react-native'
import { useNetwork } from './use-network'

// A segmented control for switching between the configured networks.
export function NetworkUiSelect() {
  const { networks, selectedNetwork, setSelectedNetwork } = useNetwork()

  return (
    <View className="flex-row bg-gray-200 dark:bg-gray-800 rounded-full p-1">
      {networks.map((network) => {
        const isSelected = network.id === selectedNetwork.id
        return (
          <Pressable
            key={network.id}
            onPress={() => setSelectedNetwork(network)}
            className={`px-5 py-2 rounded-full ${isSelected ? 'bg-white dark:bg-black' : ''}`}
          >
            <Text
              className={`text-sm font-semibold ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
            >
              {network.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
