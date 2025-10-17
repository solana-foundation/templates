'use client'

import { WalletDropdown } from '@/components/wallet-dropdown'
import { WalletDisconnect } from '@/components/wallet-disconnect'
import { useSolana } from '@/components/solana/use-solana'
import { ellipsify } from '@wallet-ui/react'

export function WalletInfo() {
  const { account } = useSolana()

  return (
    <div className="flex flex-col gap-2 items-end">
      {account ? (
        <>
          <div className="text-sm text-muted-foreground">{ellipsify(account.address)}</div>
          <WalletDisconnect />
        </>
      ) : (
        <WalletDropdown />
      )}
    </div>
  )
}
