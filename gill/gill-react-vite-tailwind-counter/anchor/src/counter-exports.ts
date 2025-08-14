// Here we export some useful types and functions for interacting with the Anchor program.
import { Account, address, getBase58Decoder, SolanaClient } from 'gill'
import { SolanaClusterId } from '@wallet-ui/react'
import { getProgramAccountsDecoded } from './helpers/get-program-accounts-decoded'
import { Counter, COUNTER_DISCRIMINATOR, COUNTER_PROGRAM_ADDRESS, getCounterDecoder } from './client/js'
import CounterIDL from '../target/idl/counter.json'

export type CounterAccount = Account<Counter, string>

// Re-export the generated IDL and type
export { CounterIDL }

// This is a helper function to get the program ID for the Counter program depending on the cluster.
export function getCounterProgramId(cluster: SolanaClusterId) {
  switch (cluster) {
    case 'solana:devnet':
    case 'solana:testnet':
      // This is the program ID for the Counter program on devnet and testnet.
      return address('6z68wfurCMYkZG51s1Et9BJEd9nJGUusjHXNt4dGbNNF')
    case 'solana:mainnet':
    default:
      return COUNTER_PROGRAM_ADDRESS
  }
}

export * from './client/js'

export function getCounterProgramAccounts(rpc: SolanaClient['rpc']) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getCounterDecoder(),
    filter: getBase58Decoder().decode(COUNTER_DISCRIMINATOR),
    programAddress: COUNTER_PROGRAM_ADDRESS,
  })
}
