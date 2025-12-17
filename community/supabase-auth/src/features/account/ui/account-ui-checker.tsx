'use client'
import { useWalletSession } from '@solana/react-hooks'
import { AccountUiBalanceCheck } from './account-ui-balance-check'

export function AccountUiChecker() {
  const wallet = useWalletSession()
  if (!wallet) {
    return null
  }
  return <AccountUiBalanceCheck address={wallet.account.address.toString()} />
}
