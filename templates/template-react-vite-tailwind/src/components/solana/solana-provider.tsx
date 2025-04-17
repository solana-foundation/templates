import { ReactNode } from 'react'
import {
  createSolanaDevnet,
  createSolanaLocalnet,
  createWalletUiConfig,
  WalletUi,
  WalletUiClusterDropdown,
  WalletUiDropdown,
} from '@wallet-ui/react'
import '@wallet-ui/tailwind/index.css'

export { WalletUiDropdown as WalletButton, WalletUiClusterDropdown as ClusterButton }

const config = createWalletUiConfig({
  clusters: [createSolanaDevnet(), createSolanaLocalnet()],
})

export function SolanaProvider({ children }: { children: ReactNode }) {
  return <WalletUi config={config}>{children}</WalletUi>
}
