import { useWalletUi } from '@wallet-ui/react'
import { address } from 'gill'

import { AccountUiBalanceCheck } from './account-ui-balance-check'

export function AccountUiChecker() {
  const { account } = useWalletUi()
  if (!account) {
    return null
  }
  return <AccountUiBalanceCheck address={address(account.address)} />
}
