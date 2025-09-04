import { ReactNode } from 'react'
import { useSolana } from '@/components/solana/use-solana'
import { WalletButton } from '@/components/solana/solana-provider'

export default function AccountFeatureIndex({ redirect }: { redirect: (path: string) => ReactNode }) {
  const { account } = useSolana()

  if (account) {
    return redirect(`/account/${account.address.toString()}`)
  }

  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <WalletButton />
      </div>
    </div>
  )
}
