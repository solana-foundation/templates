import { Connection, type ConnectionConfig } from '@solana/web3.js'
import React, { createContext, type ReactNode, useContext, useMemo } from 'react'
import { useCluster } from '../cluster/cluster-provider'

export interface SolanaProviderState {
  connection: Connection
}

export interface SolanaProviderProps {
  children: ReactNode
  config?: ConnectionConfig
}

const ConnectionContext = createContext<SolanaProviderState>({} as SolanaProviderState)

export function SolanaProvider({ children, config = { commitment: 'confirmed' } }: SolanaProviderProps) {
  const { selectedCluster } = useCluster()
  const connection = useMemo(() => new Connection(selectedCluster.endpoint, config), [selectedCluster, config])

  return <ConnectionContext.Provider value={{ connection }}>{children}</ConnectionContext.Provider>
}

export function useSolana(): SolanaProviderState {
  return useContext(ConnectionContext)
}

export function useConnection(): Connection {
  return useSolana().connection
}
