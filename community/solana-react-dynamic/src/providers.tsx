import { DynamicProvider } from '@dynamic-labs-sdk/react-hooks'
import { dynamicClient } from './dynamicClient'

export function Providers({ children }: { children: React.ReactNode }) {
  return <DynamicProvider client={dynamicClient}>{children}</DynamicProvider>
}
