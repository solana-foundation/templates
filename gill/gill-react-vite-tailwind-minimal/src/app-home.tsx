import { useSolana } from '@/components/solana/use-solana'
import { ClusterDropdown } from '@/components/cluster-dropdown'
import { WalletDisconnect } from '@/components/wallet-disconnect'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'

export default function AppHome() {
  const { account } = useSolana()
  return (
    <div className="flex flex-col  items-center my-12 gap-4">
      <div className=" text-2xl ">gm.</div>
      <ClusterDropdown />
      {account ? (
        <>
          <WalletDisconnect />
          <AppExplorerLink address={account.address} label={`Connected to ${ellipsify(account.address)}`} />
        </>
      ) : (
        <WalletDropdown />
      )}
    </div>
  )
}
