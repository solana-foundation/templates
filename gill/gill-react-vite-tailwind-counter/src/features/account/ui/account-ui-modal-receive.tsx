import { Address } from 'gill'
import { AppModal } from '@/components/app-modal'

export function AccountUiModalReceive({ address }: { address: Address }) {
  return (
    <AppModal title="Receive">
      <p>Receive assets by sending them to your public key:</p>
      <code>{address.toString()}</code>
    </AppModal>
  )
}
