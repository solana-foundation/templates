import { AppConfig } from '@/constants/app-config'
import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { AppExternalLink, AppExternalLinkProps } from '@/components/app-external-link'

export function SettingsAppConfig() {
  return (
    <AppView>
      <AppText variant="titleMedium">App Config</AppText>
      <AppText>
        Name: <AppText>{AppConfig.name}</AppText>
      </AppText>
      <AppText>
        URL: <AppExternalLink href={AppConfig.uri as AppExternalLinkProps['href']}>{AppConfig.uri}</AppExternalLink>
      </AppText>
    </AppView>
  )
}
