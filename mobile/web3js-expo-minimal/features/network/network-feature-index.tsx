import React from 'react'
import { Text, View } from 'react-native'
import { NetworkFeatureGetVersion } from './network-feature-get-version'
import { NetworkFeatureGetGenesisHash } from './network-feature-get-genesis-hash'
import { NetworkUiSelect } from './network-ui-select'
import { useNetwork } from './use-network'
import { appStyles } from '@/constants/app-styles'

export function NetworkFeatureIndex() {
  const { selectedNetwork, networks, setSelectedNetwork } = useNetwork()
  return (
    <View style={appStyles.stack}>
      <Text style={appStyles.title}>Network</Text>
      <NetworkUiSelect networks={networks} selectedNetwork={selectedNetwork} setSelectedNetwork={setSelectedNetwork} />
      <View style={appStyles.card}>
        <Text>Connected to {selectedNetwork.label}</Text>
        <NetworkFeatureGetVersion />
        <NetworkFeatureGetGenesisHash />
      </View>
    </View>
  )
}
