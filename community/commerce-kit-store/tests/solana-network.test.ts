import { describe, expect, it } from 'vitest'
import { resolveWalletChain } from '../src/lib/solana-network'

describe('wallet network configuration', () => {
  it('preserves existing public devnet RPC configurations without a cluster', () => {
    expect(resolveWalletChain('https://api.devnet.solana.com')).toBe('solana:devnet')
  })
  it('recognizes the public mainnet endpoint', () => {
    expect(resolveWalletChain('https://api.mainnet-beta.solana.com')).toBe('solana:mainnet')
  })
  it('requires explicit cluster selection for custom endpoints', () => {
    expect(() => resolveWalletChain('https://rpc.example.com')).toThrow('explicitly')
    expect(resolveWalletChain('https://rpc.example.com', 'devnet')).toBe('solana:devnet')
  })
  it('rejects invalid clusters and known RPC mismatches', () => {
    expect(() => resolveWalletChain('https://api.devnet.solana.com', 'mainnet')).toThrow('does not match')
    expect(() => resolveWalletChain('https://api.mainnet-beta.solana.com', 'devnet')).toThrow('does not match')
    expect(() => resolveWalletChain('https://rpc.example.com', 'testnet')).toThrow('must be')
  })
})
