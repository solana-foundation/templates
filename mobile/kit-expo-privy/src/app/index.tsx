import { StatusBar } from 'expo-status-bar'
import { WalletFeatureEntry } from '../features/wallet/wallet-feature-entry'

export default function App() {
  return (
    <>
      <WalletFeatureEntry />
      <StatusBar style="auto" />
    </>
  )
}
