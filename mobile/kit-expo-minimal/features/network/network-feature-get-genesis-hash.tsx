import { Text } from 'react-native'
import { ellipsify } from '@/utils/ellipsify'
import { useNetworkGetGenesisHash } from './use-network-get-genesis-hash'

export function NetworkFeatureGetGenesisHash() {
  const { data, isLoading } = useNetworkGetGenesisHash()

  return <Text>Genesis Hash: {isLoading ? 'Loading...' : `${ellipsify(data, 8)}`}</Text>
}
