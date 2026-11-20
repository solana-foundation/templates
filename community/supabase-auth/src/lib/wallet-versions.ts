import type { WalletState } from '@solana/kit-plugin-wallet'
import { getWalletForHandle } from '@wallet-standard/ui-registry'

export function describeWalletVersions(connected: NonNullable<WalletState['connected']>) {
  const wallet = getWalletForHandle(connected.wallet)
  return (['solana:signTransaction', 'solana:signAndSendTransaction'] as const)
    .filter((name) => connected.account.features.includes(name))
    .map((name) => {
      const feature = wallet.features[name as `${string}:${string}`] as
        | { supportedTransactionVersions?: readonly (string | number)[] }
        | undefined
      return `${name.replace('solana:', '')}: ${feature?.supportedTransactionVersions?.join(', ') || 'none'}`
    })
    .join('; ')
}
