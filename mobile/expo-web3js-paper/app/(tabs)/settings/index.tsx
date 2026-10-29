import { AppText } from '@/components/app-text'
import { SettingsAppConfig } from '@/components/settings/settings-app-config'
import { SettingsUiAccount } from '@/components/settings/settings-ui-account'
import { SettingsUiCluster } from '@/components/settings/settings-ui-cluster'

import { AppPage } from '@/components/app-page'

export default function TabSettingsScreen() {
  return (
    <AppPage>
      <SettingsUiAccount />
      <SettingsAppConfig />
      <SettingsUiCluster />
      <AppText style={{ opacity: 0.5, fontSize: 14 }}>
        Configure app info and clusters in <AppText style={{ fontWeight: 'bold' }}>constants/app-config.tsx</AppText>.
      </AppText>
    </AppPage>
  )
}
