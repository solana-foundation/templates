import { assertIsAddress } from 'gill'
import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { ellipsify } from '@/lib/utils'
import { ExplorerLink } from '@/components/cluster/cluster-ui'
import { AppHero } from '@/components/app-hero'

import { AccountUiTokenAccounts } from './account-ui-token-accounts'
import { AccountUiTransactions } from './account-ui-transactions'
import { AccountUiActionButtons } from './account-ui-action-buttons'
import { AccountUiBalance } from './account-ui-balance'

export default function AccountFeatureDetail() {
  const params = useParams()
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
            <ExplorerLink address={address.toString()} label={ellipsify(address.toString())} />
          </div>
        }
      >
        <div className="my-4">
          <AccountUiActionButtons address={address} />
        </div>
      </AppHero>
      <div className="space-y-8">
        <AccountUiTokenAccounts address={address} />
        <AccountUiTransactions address={address} />
      </div>
    </div>
  )
}
