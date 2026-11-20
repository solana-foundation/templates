import { useContext } from 'react'
import { NetworkProviderContext } from './network-provider'

export function useNetwork() {
  return useContext(NetworkProviderContext)
}
