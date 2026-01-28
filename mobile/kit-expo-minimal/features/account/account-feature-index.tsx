import { Text, View } from 'react-native'
import React from 'react'
import { AccountFeatureGetBalance } from '@/features/account/account-feature-get-balance'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { appStyles } from '@/constants/app-styles'
import { AccountFeatureSignMessage } from '@/features/account/account-feature-sign-message'
import { AccountFeatureSignTransaction } from '@/features/account/account-feature-sign-transaction'
import { AccountFeatureSignIn } from '@/features/account/account-feature-sign-in'
import { AccountFeatureDisconnect } from '@/features/account/account-feature-disconnect'
import { AccountFeatureConnect } from '@/features/account/account-feature-connect'

export function AccountFeatureIndex() {
  const { account } = useMobileWallet()

  return (
    <View style={appStyles.stack}>
      <Text style={appStyles.title}>Account</Text>
      {account ? (
        <View style={appStyles.stack}>
          <View style={appStyles.card}>
            <Text>Connected to {account.label}</Text>
            <AccountFeatureGetBalance address={account.address} />
          </View>
          <AccountFeatureSignIn account={account} />
          <AccountFeatureSignMessage address={account.address} />
          <AccountFeatureSignTransaction address={account.address} />
          <AccountFeatureDisconnect />
        </View>
      ) : (
        <View style={appStyles.stack}>
          <AccountFeatureConnect />
          <AccountFeatureSignIn />
        </View>
      )}
    </View>
  )
}
