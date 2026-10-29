import { Text } from 'react-native'
import { appStyles } from '@/constants/app-styles'
import { useNetworkGetVersion } from './use-network-get-version'

export function NetworkFeatureGetVersion() {
  const { data, isError } = useNetworkGetVersion()

  if (!data) {
    return <Text>Version: {isError ? 'Unable to load' : 'Loading...'}</Text>
  }

  // A failed refetch keeps the last known value, so label it instead of passing it off as current.
  return (
    <Text>
      Version: {data.core} ({data.features})
      {isError ? <Text style={appStyles.textDanger}> (refresh failed)</Text> : null}
    </Text>
  )
}
