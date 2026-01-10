import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { BaseButton } from '@/components/solana/base-button'
import React from 'react'

export function WalletUiButtonConnect({ label = 'Connect' }: { label?: string }) {
  const { connect } = useMobileWallet()

  return <BaseButton label={label} onPress={() => connect()} />
}
