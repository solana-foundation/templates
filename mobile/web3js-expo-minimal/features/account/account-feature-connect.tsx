import { Button } from 'react-native'
import React from 'react'
import { useMobileWalletAdapter } from '@wallet-ui/react-native-web3js'

export function AccountFeatureConnect() {
  const { account, connect } = useMobileWalletAdapter()

  return <Button disabled={!!account} title="Connect" onPress={connect} />
}
