import { assertIsAddress } from 'gill'
import { useMemo } from 'react'
import { useParams } from 'react-router'
import { AppHero } from '@/components/app-hero'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@/lib/utils'
import { AccountUiBalance } from './ui/account-ui-balance.tsx'
import { AccountUiButtons } from './ui/account-ui-buttons.tsx'
import { AccountUiTokens } from './ui/account-ui-tokens.tsx'
import { AccountUiTransactions } from './ui/account-ui-transactions'

export default function AccountFeatureDetail() {
  const params = useParams() as { address: string }
  const address = useMemo(() => {
    if (!params.address || typeof params.address !== 'string') {
      return
    }
    assertIsAddress(params.address)
    return params.address
  }, [params])
  if (!address) {
    return <div>Error loading account</div>
  }

  return (
    <div>
      <AppHero
        title={<AccountUiBalance address={address} />}
        subtitle={
          <div className="my-4">
            <AppExplorerLink address={address.toString()} label={ellipsify(address.toString())} />
          </div>
        }
      >
        <div className="my-4">
          <AccountUiButtons address={address} />
        </div>
      </AppHero>
      <div className="space-y-8">
        <AccountUiTokens address={address} />
        <AccountUiTransactions address={address} />
      </div>
    </div>
  )
}
