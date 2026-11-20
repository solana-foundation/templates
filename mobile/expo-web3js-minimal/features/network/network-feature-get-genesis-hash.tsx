import { Text } from 'react-native'
import { appStyles } from '@/constants/app-styles'
import { ellipsify } from '@/utils/ellipsify'
import { useNetworkGetGenesisHash } from './use-network-get-genesis-hash'

export function NetworkFeatureGetGenesisHash() {
  const { data, isError } = useNetworkGetGenesisHash()

  if (!data) {
    return <Text>Genesis Hash: {isError ? 'Unable to load' : 'Loading...'}</Text>
  }

  // A failed refetch keeps the last known value, so label it instead of passing it off as current.
  return (
    <Text>
      Genesis Hash: {ellipsify(data, 8)}
      {isError ? <Text style={appStyles.textDanger}> (refresh failed)</Text> : null}
    </Text>
  )
}
