import { readFileSync } from 'node:fs'
import { expect, test, vi, afterEach } from 'vitest'
import { isAddress } from '@solana/kit'
import idl from '../src/lib/idl.json'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

test('checked-in program ID is valid and matches Rust and Anchor configuration', () => {
  expect(isAddress(idl.address)).toBe(true)
  const rust = readFileSync('anchor/programs/solana-distributor/src/lib.rs', 'utf8')
  const toml = readFileSync('anchor/Anchor.toml', 'utf8')
  expect(rust).toContain(`declare_id!("${idl.address}")`)
  expect(toml).toContain(`solana_distributor = "${idl.address}"`)
})

test('Next configuration does not export environment variables', async () => {
  const { default: config } = await import('../next.config')
  expect(config.env).toBeUndefined()
})

test.each(['devnet', 'testnet', 'mainnet'])('accepts supported network %s', async (network) => {
  vi.stubEnv('NEXT_PUBLIC_SOLANA_NETWORK', network)
  const { AIRDROP_CONFIG } = await import('../src/lib/config')
  expect(AIRDROP_CONFIG.NETWORK).toBe(network)
})

test('rejects an unknown network instead of silently selecting devnet', async () => {
  vi.stubEnv('NEXT_PUBLIC_SOLANA_NETWORK', 'invalid')
  await expect(import('../src/lib/config')).rejects.toThrow('must be devnet')
})
