'use client'

import { WalletDropdown } from '@/components/wallet-dropdown'
import { WalletDisconnect } from '@/components/wallet-disconnect'
import { useWalletSession } from '@solana/react-hooks'
import { ellipsify } from '@/lib/utils'

export function WalletInfo() {
  const wallet = useWalletSession()

  return (
    <div className="flex flex-col gap-2 items-end">
      {wallet?.account ? (
        <>
          <div className="text-sm text-muted-foreground">{ellipsify(wallet.account.address.toString())}</div>
          <WalletDisconnect />
        </>
      ) : (
        <WalletDropdown />
      )}
    </div>
  )
}
