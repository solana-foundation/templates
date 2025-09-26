import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { AppHero } from '@/components/app-hero'
import { CounterUiButtonInitialize } from './ui/counter-ui-button-initialize'
import { CounterUiList } from './ui/counter-ui-list'
import { CounterUiProgramExplorerLink } from './ui/counter-ui-program-explorer-link'
import { CounterUiProgramGuard } from './ui/counter-ui-program-guard'

export default function CounterFeature() {
  const { account } = useSolana()

  return (
    <CounterUiProgramGuard>
      <AppHero
        title="Counter"
        subtitle={
          account
            ? "Initialize a new counter onchain by clicking the button. Use the program's methods (increment, decrement, set, and close) to change the state of the account."
            : 'Select a wallet to run the program.'
        }
      >
        <p className="mb-6">
          <CounterUiProgramExplorerLink />
        </p>
        {account ? (
          <CounterUiButtonInitialize account={account} />
        ) : (
          <div style={{ display: 'inline-block' }}>
            <WalletDropdown />
          </div>
        )}
      </AppHero>
      {account ? <CounterUiList account={account} /> : null}
    </CounterUiProgramGuard>
  )
}
