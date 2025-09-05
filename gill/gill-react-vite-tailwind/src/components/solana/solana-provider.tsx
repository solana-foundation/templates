import { ReactNode } from 'react'
import {
  createSolanaDevnet,
  createSolanaLocalnet,
  createWalletUiConfig,
  WalletUi,
  WalletUiClusterDropdown,
  WalletUiDropdown,
} from '@wallet-ui/react'
import { solanaMobileWalletAdapter } from './solana-mobile-wallet-adapter'

export { WalletUiDropdown as WalletButton, WalletUiClusterDropdown as ClusterButton }

const config = createWalletUiConfig({
  clusters: [createSolanaDevnet(), createSolanaLocalnet()],
})

solanaMobileWalletAdapter({ clusters: config.clusters })

export function SolanaProvider({ children }: { children: ReactNode }) {
  return <WalletUi config={config}>{children}</WalletUi>
}
