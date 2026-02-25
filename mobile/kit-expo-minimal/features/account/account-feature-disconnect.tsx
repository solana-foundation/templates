import { Button } from 'react-native'
import React from 'react'
import { useMobileWallet } from '@wallet-ui/react-native-kit'

export function AccountFeatureDisconnect() {
  const { account, disconnect } = useMobileWallet()

  return <Button disabled={!account} title="Disconnect" onPress={disconnect} />
}
