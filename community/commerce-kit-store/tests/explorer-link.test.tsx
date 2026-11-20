// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { AppExplorerLink } from '../src/components/app-explorer-link'

afterEach(() => {
  cleanup()
  vi.unstubAllEnvs()
})

it('uses devnet links when the network is inferred from the public RPC', () => {
  vi.stubEnv('NEXT_PUBLIC_RPC_URL', 'https://api.devnet.solana.com')
  vi.stubEnv('NEXT_PUBLIC_SOLANA_CLUSTER', '')
  render(<AppExplorerLink path="signature" type="tx" label="View transaction" />)
  expect(screen.getByRole('link').getAttribute('href')).toBe('https://explorer.solana.com/tx/signature?cluster=devnet')
})

it('uses the explicit devnet cluster with a custom RPC', () => {
  vi.stubEnv('NEXT_PUBLIC_RPC_URL', 'https://rpc.example.com')
  vi.stubEnv('NEXT_PUBLIC_SOLANA_CLUSTER', 'devnet')
  render(<AppExplorerLink path="account" type="address" label="View account" />)
  expect(screen.getByRole('link').getAttribute('href')).toBe(
    'https://explorer.solana.com/address/account?cluster=devnet',
  )
})

it('keeps mainnet links on the default network', () => {
  vi.stubEnv('NEXT_PUBLIC_RPC_URL', '')
  vi.stubEnv('NEXT_PUBLIC_SOLANA_CLUSTER', '')
  render(<AppExplorerLink path="signature" type="tx" label="View transaction" />)
  expect(screen.getByRole('link').getAttribute('href')).toBe('https://explorer.solana.com/tx/signature')
})
