import { Text } from 'react-native'
import { appStyles } from '@/constants/app-styles'

export type AppStatusProps = {
  description: string
  status: 'danger' | 'success'
  title: string
}

export function AppStatus({ description, status, title }: AppStatusProps) {
  return (
    <Text style={status === 'danger' ? appStyles.textDanger : appStyles.textSuccess}>
      {title}: {description}
    </Text>
  )
}
