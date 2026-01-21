import { AppView } from '@/components/app-view'
import { AppText } from '@/components/app-text'
import { DemoFeatureSignMessage } from './demo-feature-sign-message'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { PublicKey } from '@solana/web3.js'
import * as React from 'react'

export function DemoFeature() {
  const { account } = useMobileWallet()
  return (
    <AppView>
      <AppText type="subtitle">Demo page</AppText>
      <AppText>Start building your features here.</AppText>
      <DemoFeatureSignMessage address={account?.address as PublicKey} />
    </AppView>
  )
}
