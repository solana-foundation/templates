import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { PublicKey } from '@solana/web3.js'
import { createAppClient, type AppClient } from '../src/lib/solana-client'
import { CLUSTERS } from '../src/components/solana/clusters'
import { prepareAirdropBatch, validateAirdrop } from '../src/features/airdrop/data-access/airdrop-utils'
import { registerTestWallet, makeAccount } from './wallet-fixture'

const mocks = vi.hoisted(() => ({ genesis: vi.fn(), mint: vi.fn(), trees: vi.fn() }))
vi.mock('@lightprotocol/stateless.js', async (original) => ({
  ...(await original<typeof import('@lightprotocol/stateless.js')>()),
  createRpc: () => ({ getGenesisHash: mocks.genesis, getStateTreeInfos: mocks.trees }),
}))
vi.mock('@solana/spl-token', async (original) => ({
  ...(await original<typeof import('@solana/spl-token')>()),
  getMint: mocks.mint,
}))

const config = {
  mintAddress: makeAccount(4).address,
  authority: makeAccount(1).address,
  decimals: 9,
  name: 'Test',
  symbol: 'T',
  network: 'http://localhost:8899',
}
const data = {
  mint: config.mintAddress,
  decimals: 9,
  totalRecipients: 1,
  totalAmount: '1',
  recipients: [{ recipient: makeAccount(3).address, amount: '1', index: 0 }],
  generatedAt: 'test',
}
beforeEach(() => {
  mocks.genesis.mockReset().mockResolvedValue('devnet')
  mocks.mint.mockReset().mockResolvedValue({ mintAuthority: new PublicKey(config.authority), decimals: 9 })
  mocks.trees.mockReset()
})
afterEach(() => localStorage.clear())

test.each(['network', 'authority', 'account change', 'abort', 'V0 wallet'])(
  'rejects %s before preparing a mint instruction',
  async (reason) => {
    const fixture = registerTestWallet('Test', reason === 'V0 wallet' ? ['legacy', 0] : [1])
    const base = createAppClient(CLUSTERS[0])
    const client = { ...base, rpc: { getGenesisHash: () => ({ send: async () => 'devnet' }) } } as unknown as AppClient
    const controller = new AbortController()
    try {
      await vi.waitFor(() => expect(base.wallet.getState().wallets.length).toBe(1))
      await base.wallet.connect(base.wallet.getState().wallets[0])
      if (reason === 'network') mocks.genesis.mockResolvedValue('mainnet')
      if (reason === 'authority')
        mocks.mint.mockResolvedValue({ mintAuthority: new PublicKey(makeAccount(2).address), decimals: 9 })
      if (reason === 'account change')
        mocks.genesis.mockImplementation(async () => {
          fixture.change([fixture.second])
          return 'devnet'
        })
      if (reason === 'abort')
        mocks.genesis.mockImplementation(async () => {
          controller.abort()
          return 'devnet'
        })
      await expect(
        prepareAirdropBatch(client, config, validateAirdrop(config, data, 1), 0, 1, controller.signal),
      ).rejects.toThrow()
      expect(mocks.trees).not.toHaveBeenCalled()
    } finally {
      base[Symbol.dispose]()
      fixture.unregister()
    }
  },
)
