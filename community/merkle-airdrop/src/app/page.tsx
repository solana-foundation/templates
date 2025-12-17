import { ClaimButton } from '@/components/claim-button'
import { WalletButton } from '@/components/wallet-button'

export default function Home() {
  return (
    <>
      <WalletButton size="sm" />
      <ClaimButton />
    </>
  )
}
