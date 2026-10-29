import { Alert } from 'heroui-native'

import type { ToolsActionStatus } from '@/features/tools/ui/tools-ui-action-card'

export function ToolsUiStatusAlert({ description, status, title }: ToolsActionStatus) {
  return (
    <Alert status={status}>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{title}</Alert.Title>
        <Alert.Description>{description}</Alert.Description>
      </Alert.Content>
    </Alert>
  )
}
