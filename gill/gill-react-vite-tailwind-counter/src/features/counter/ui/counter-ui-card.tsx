import { CounterAccount } from '@project/anchor'
import { ellipsify, UiWalletAccount } from '@wallet-ui/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { CounterUiButtonClose } from './counter-ui-button-close'
import { CounterUiButtonDecrement } from './counter-ui-button-decrement'
import { CounterUiButtonIncrement } from './counter-ui-button-increment'
import { CounterUiButtonSet } from './counter-ui-button-set'

export function CounterUiCard({ account, counter }: { account: UiWalletAccount; counter: CounterAccount }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Counter: {counter.data.count}</CardTitle>
        <CardDescription>
          Account: <AppExplorerLink address={counter.address} label={ellipsify(counter.address)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-evenly">
          <CounterUiButtonIncrement account={account} counter={counter} />
          <CounterUiButtonSet account={account} counter={counter} />
          <CounterUiButtonDecrement account={account} counter={counter} />
          <CounterUiButtonClose account={account} counter={counter} />
        </div>
      </CardContent>
    </Card>
  )
}
