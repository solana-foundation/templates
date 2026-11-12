import { Alert } from 'heroui-native'

type WalletUiStatusAlertProps = {
  description: string
  status: 'danger' | 'success'
  title: string
}

export function WalletUiStatusAlert({ description, status, title }: WalletUiStatusAlertProps) {
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
