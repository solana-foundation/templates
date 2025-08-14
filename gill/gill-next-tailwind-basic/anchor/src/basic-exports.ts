// Here we export some useful types and functions for interacting with the Anchor program.
import { address } from 'gill'
import { SolanaClusterId } from '@wallet-ui/react'
import { BASIC_PROGRAM_ADDRESS } from './client/js'
import BasicIDL from '../target/idl/basic.json'

// Re-export the generated IDL and type
export { BasicIDL }

// This is a helper function to get the program ID for the Basic program depending on the cluster.
export function getBasicProgramId(cluster: SolanaClusterId) {
  switch (cluster) {
    case 'solana:devnet':
    case 'solana:testnet':
      // This is the program ID for the Basic program on devnet and testnet.
      return address('6z68wfurCMYkZG51s1Et9BJEd9nJGUusjHXNt4dGbNNF')
    case 'solana:mainnet':
    default:
      return BASIC_PROGRAM_ADDRESS
  }
}

export * from './client/js'
