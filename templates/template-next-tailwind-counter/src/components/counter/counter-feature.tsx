import { WalletButton } from '../solana/solana-provider'
import { CounterButtonInitialize, CounterList, CounterProgramExplorerLink, CounterProgramGuard } from './counter-ui'
import { AppHero } from '../app-hero'
import { useWalletUi } from '@wallet-ui/react'

export default function CounterFeature() {
  const { account } = useWalletUi()

  return (
    <CounterProgramGuard>
      <AppHero
        title="Counter"
        subtitle={
          account
            ? "Initialize a new counter onchain by clicking the button. Use the program's methods (increment, decrement, set, and close) to change the state of the account."
            : 'Select a wallet to run the program.'
        }
      >
        <p className="mb-6">
          <CounterProgramExplorerLink />
        </p>
        {account ? (
          <CounterButtonInitialize />
        ) : (
          <div style={{ display: 'inline-block' }}>
            <WalletButton />
          </div>
        )}
      </AppHero>
      {account ? <CounterList /> : null}
    </CounterProgramGuard>
  )
}
