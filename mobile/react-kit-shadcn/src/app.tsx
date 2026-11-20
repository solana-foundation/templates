import { ClusterUiOfflineAlert } from '@/features/cluster/ui/cluster-ui-offline-alert'
import { AppProviders } from '@/features/core/data-access/app-providers'
import { ShellUiPage } from '@/features/shell/ui/shell-ui-page'
import { WalletFeatureEntry } from '@/features/wallet/wallet-feature-entry'

export function App() {
  return (
    <AppProviders>
      <ShellUiPage>
        <ClusterUiOfflineAlert />
        <WalletFeatureEntry />
      </ShellUiPage>
    </AppProviders>
  )
}
