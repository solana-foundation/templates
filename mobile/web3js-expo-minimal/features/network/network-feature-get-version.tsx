import { Text } from 'react-native'
import { useNetworkGetVersion } from './use-network-get-version'

export function NetworkFeatureGetVersion() {
  const { data, isLoading } = useNetworkGetVersion()

  return <Text>Version: {isLoading ? 'Loading...' : `${data?.core} (${data?.features})`}</Text>
}
