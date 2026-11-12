import React from 'react'
import { useSeekerWallet } from '@/components/seeker-wallet-provider'
import { SeekerConnectButton } from '@solana-mobile/seeker-connect-react-native'

export function AccountFeatureConnect() {
  const { account, connect } = useSeekerWallet()

  return (
    <SeekerConnectButton
      enabled={!account}
      onPress={() => connect().catch(console.warn)}
      style={{ height: 56 }}
      testID="connect-with-seeker"
    />
  )
}
