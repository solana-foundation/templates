import Snackbar from 'react-native-snackbar'
import { formatError } from '@/utils/format-error'

/** Surface a failed wallet or RPC action to the user instead of leaving it in the console. */
export function showError(title: string, error: unknown) {
  Snackbar.show({ duration: Snackbar.LENGTH_LONG, text: `${title}: ${formatError(error)}` })
}
