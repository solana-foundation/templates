import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { AirdropExecutor } from '../src/features/airdrop/ui/airdrop-ui-executor'

vi.mock('@/components/solana/solana-provider', () => ({
  useSolana: () => ({ client: {}, cluster: { id: 'testnet' } }),
}))
vi.mock('@solana/kit-plugin-wallet/react', () => ({ useConnectedWallet: () => null }))
vi.mock('@/features/airdrop/data-access/use-airdrop', () => ({
  useAirdrop: () => ({
    executeAirdrop: vi.fn(),
    progressCluster: 'devnet',
    progress: { currentBatch: 1, totalBatches: 1, successfulMints: 1, failedMints: 0, signatures: ['saved-signature'] },
    isExecuting: false,
    requiresReview: true,
    error: null,
  }),
}))
afterEach(cleanup)

test('saved transaction and mint links keep their original network after switching networks', () => {
  render(
    <AirdropExecutor
      config={{
        network: 'https://api.devnet.solana.com',
        mintAddress: 'saved-mint',
        authority: 'authority',
        decimals: 9,
        name: 'Test',
        symbol: 'T',
      }}
      airdropData={{
        mint: 'saved-mint',
        decimals: 9,
        totalRecipients: 1,
        totalAmount: '1000000000',
        recipients: [{ recipient: 'recipient', amount: '1000000000', index: 0 }],
        generatedAt: 'test',
      }}
    />,
  )
  expect(screen.getByRole('link', { name: 'saved-signature' }).getAttribute('href')).toBe(
    'https://explorer.solana.com/tx/saved-signature?cluster=devnet',
  )
  expect(screen.getByRole('link', { name: 'saved-mint' }).getAttribute('href')).toBe(
    'https://explorer.solana.com/address/saved-mint?cluster=devnet',
  )
})
