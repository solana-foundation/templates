import { DappIdentity } from '@solana-mobile/seeker-connect-react-native'
import {
  createSolanaDevnet,
  createSolanaLocalnet,
  createSolanaTestnet,
  SolanaCluster,
} from '@wallet-ui/react-native-kit'

export class AppConfig {
  static identity: DappIdentity = { name: 'expo-kit-minimal', uri: 'https://expo-kit-minimal.example.com' }
  static networks: SolanaCluster[] = [
    createSolanaDevnet({ url: 'https://api.devnet.solana.com' }),
    createSolanaLocalnet({ url: 'http://localhost:8899' }),
    createSolanaTestnet({ url: 'https://api.testnet.solana.com' }),
  ]
}
