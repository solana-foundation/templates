import { useState } from 'react'
import { Button, View } from 'react-native'
import { AppStatus, AppStatusProps } from '@/components/app-status'
import { appStyles } from '@/constants/app-styles'
import { formatError } from '@/utils/format-error'

/**
 * A Button that runs an async action, keeps it from floating as an unhandled
 * rejection, disables itself while in flight, and shows the outcome inline.
 */
export function AppActionButton({
  disabled,
  onPress,
  title,
}: {
  disabled?: boolean
  onPress: () => Promise<AppStatusProps | void>
  title: string
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<AppStatusProps | null>(null)

  async function submit() {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    setStatus(null)
    try {
      setStatus((await onPress()) ?? null)
    } catch (error) {
      setStatus({ description: formatError(error), status: 'danger', title: `${title} failed` })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={appStyles.stack}>
      <Button disabled={disabled || isLoading} onPress={() => void submit()} title={isLoading ? 'Working...' : title} />
      {status ? <AppStatus {...status} /> : null}
    </View>
  )
}
