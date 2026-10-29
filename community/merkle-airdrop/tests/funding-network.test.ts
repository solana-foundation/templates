import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { address, createNoopSigner, type Rpc, type SolanaRpcApi } from '@solana/kit'
import type { GillWalletInfo } from '../anchor/lib/types'

const mocked = vi.hoisted(() => ({ send: vi.fn().mockResolvedValue('local-signature') }))
vi.mock('@solana/kit-plugin-rpc', () => ({
  solanaRpc: (options: unknown) => (client: object) => ({ ...client, rpcOptions: options }),
  solanaRpcConnection: () => (client: object) => client,
}))
vi.mock('../anchor/lib/kit-client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../anchor/lib/kit-client')>()),
  sendKitTransaction: mocked.send,
}))
import { distributeSolToWallets, setupEfficientWalletFunding } from '../anchor/lib/wallet-manager'

const signer = createNoopSigner(address('11111111111111111111111111111112'))
const primary = { signer, address: signer.address, keypairFile: 'local-wallet.json' } as GillWalletInfo
const recipient = { address: address('11111111111111111111111111111113') } as GillWalletInfo
const rpc = { getBalance: () => ({ send: async () => ({ value: 5_000_000_000n }) }) } as unknown as Rpc<SolanaRpcApi>
beforeEach(() => {
  vi.clearAllMocks()
  for (const network of ['DEVNET', 'TESTNET', 'MAINNET']) {
    vi.stubEnv(`${network}_RPC_URL`, `http://${network.toLowerCase()}.invalid`)
    vi.stubEnv(`${network}_RPC_WS_URL`, `ws://${network.toLowerCase()}.invalid`)
  }
})
afterEach(() => vi.unstubAllEnvs())

test.each(['devnet', 'testnet', 'mainnet'] as const)(
  'funding forwards %s HTTP and subscription settings',
  async (network) => {
    const result = await setupEfficientWalletFunding(rpc, primary, [recipient], 0.1, undefined, network)
    expect(result.testWallets[0].funded).toBe(true)
    expect(mocked.send.mock.calls[0][0].rpcOptions).toMatchObject({
      rpcUrl: `http://${network}.invalid`,
      rpcSubscriptionsUrl: `ws://${network}.invalid`,
      transactionConfig: { version: 1 },
    })
  },
)

test('an explicit HTTP URL retains the selected network subscription settings', async () => {
  await distributeSolToWallets(rpc, primary, [recipient], 0.1, 'http://127.0.0.1:9999', 'testnet')
  expect(mocked.send.mock.calls[0][0].rpcOptions).toMatchObject({
    rpcUrl: 'http://127.0.0.1:9999',
    rpcSubscriptionsUrl: 'ws://testnet.invalid',
  })
})
