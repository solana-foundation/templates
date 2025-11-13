'use client'

import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { WalletDisconnect } from '@/components/wallet-disconnect'
import { ClusterDropdown } from '@/components/cluster-dropdown'

function WalletUI() {
  const { account } = useSolana()
  return (
    <div className="relative flex gap-4">
      <ClusterDropdown />
      {account ? <WalletDisconnect /> : <WalletDropdown />}
    </div>
  )
}

export { WalletUI }
