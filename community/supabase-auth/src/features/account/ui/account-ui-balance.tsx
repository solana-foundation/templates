'use client'

import { toAddress } from '@solana/client'
import { useBalance, useSolanaClient } from '@solana/react-hooks'
import { AccountUiBalanceSol } from './account-ui-balance-sol'

export function AccountUiBalance({ address }: { address: string }) {
  const client = useSolanaClient()
  const balance = useBalance(address ? toAddress(address) : undefined, { watch: true })

  return (
    <h1
      className="text-5xl font-bold cursor-pointer"
      onClick={() => {
        if (!address) return
        client.actions.fetchBalance(toAddress(address)).catch((err) => console.error(err))
      }}
    >
      {typeof balance.lamports === 'bigint' ? <AccountUiBalanceSol balance={balance.lamports} /> : '...'} SOL
    </h1>
  )
}
