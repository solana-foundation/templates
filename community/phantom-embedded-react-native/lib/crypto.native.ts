import 'react-native-get-random-values'
import { install, subtle } from 'react-native-quick-crypto'

install()
Object.defineProperty(globalThis.crypto, 'subtle', { value: subtle, configurable: true })
