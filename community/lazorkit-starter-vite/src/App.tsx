import { LazorkitProvider } from '@lazorkit/wallet'
import './App.css'
import WalletDemo from './components/WalletDemo'

function App() {
  return (
    <LazorkitProvider
      rpcUrl={import.meta.env.VITE_LAZORKIT_RPC_URL}
      portalUrl={import.meta.env.VITE_LAZORKIT_PORTAL_URL}
      paymasterConfig={{
        paymasterUrl: import.meta.env.VITE_LAZORKIT_PAYMASTER_URL,
      }}
    >
      <WalletDemo />
    </LazorkitProvider>
  )
}

export default App
