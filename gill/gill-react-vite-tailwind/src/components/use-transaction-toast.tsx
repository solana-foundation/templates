import { toast } from 'sonner'
import { AppExplorerLink } from './app-explorer-link.tsx'

export function useTransactionToast() {
  return (signature: string) => {
    toast('Transaction sent', {
      description: <AppExplorerLink transaction={signature} label="View Transaction" />,
    })
  }
}
