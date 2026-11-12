'use client'

import { useAccountInfo } from '@/hooks/use-account-info'
import { useSolana } from '@/components/provider'
import { AppAlert } from '@/components/app-alert'
import { AccountUiModalAirdrop } from './account-ui-modal-airdrop'

export function AccountUiBalanceCheck({ address }: { address: string }) {
  const { cluster } = useSolana()
  const account = useAccountInfo(address)
  if (account.status === 'error')
    return <AppAlert action={undefined}>Could not check the account: {String(account.error)}</AppAlert>
  if (account.status !== 'success' || account.data?.value) return null
  return (
    <AppAlert action={cluster.id === 'mainnet-beta' ? undefined : <AccountUiModalAirdrop address={address} />}>
      You are connected to <strong>{cluster.label}</strong> but your account is not found on this cluster.
    </AppAlert>
  )
}
