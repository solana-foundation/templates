import { useState } from 'react'
import { Portal, Snackbar } from 'react-native-paper'
import { formatError } from '@/utils/format-error'

/** Collects a failure message so a failed wallet or RPC action is visible to the user. */
export function useErrorSnackbar() {
  const [message, setMessage] = useState<string | null>(null)

  return {
    dismiss: () => setMessage(null),
    message,
    showError: (title: string, error: unknown) => setMessage(`${title}: ${formatError(error)}`),
  }
}

export function AppErrorSnackbar({ message, onDismiss }: { message: string | null; onDismiss: () => void }) {
  return (
    <Portal>
      <Snackbar duration={5000} onDismiss={onDismiss} visible={!!message}>
        {message ?? ''}
      </Snackbar>
    </Portal>
  )
}
