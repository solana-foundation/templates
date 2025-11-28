import { Button } from 'react-native'
import React from 'react'
import { useMobileWalletAdapter } from '@wallet-ui/react-native-web3js'

export function AccountFeatureDisconnect() {
  const { account, disconnect } = useMobileWalletAdapter()

  return <Button disabled={!account} title="Disconnect" onPress={disconnect} />
}
