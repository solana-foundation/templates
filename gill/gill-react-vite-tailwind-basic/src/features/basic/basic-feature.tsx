import { useWalletUi } from '@wallet-ui/react'
import { WalletButton } from '@/components/solana/solana-provider'
import { AppHero } from '@/components/app-hero'
import { BasicUiProgramExplorerLink } from './ui/basic-ui-program-explorer-link'
import { BasicUiCreate } from './ui/basic-ui-create'
import { BasicUiProgram } from '@/features/basic/ui/basic-ui-program'

export default function BasicFeature() {
  const { account } = useWalletUi()

  if (!account) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="hero py-[64px]">
          <div className="hero-content text-center">
            <WalletButton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <AppHero title="Basic" subtitle={'Run the program by clicking the "Run program" button.'}>
        <p className="mb-6">
          <BasicUiProgramExplorerLink />
        </p>
        <BasicUiCreate />
      </AppHero>
      <BasicUiProgram />
    </div>
  )
}
