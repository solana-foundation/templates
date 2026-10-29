import { expect, test, vi } from 'vitest'

const mocked = vi.hoisted(() => ({
  consistent: vi.fn().mockResolvedValue(true),
  deploy: vi.fn().mockResolvedValue({ success: true, programId: '11111111111111111111111111111112' }),
}))
vi.mock('../anchor/lib/build-coordinator', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../anchor/lib/build-coordinator')>()),
  ensureGillProgramIdConsistency: mocked.consistent,
  deployGillProgram: mocked.deploy,
}))
vi.mock('../anchor/lib/wallet-manager', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../anchor/lib/wallet-manager')>()),
  createGillWalletClient: () => ({ rpc: {} }),
  ensureGillWalletFunded: vi.fn(),
}))
import { deployGillProgram } from '../anchor/lib/program-manager'
import type { GillWalletInfo } from '../anchor/lib/types'

test('reuse mode lets consistency select the active deployment key instead of forcing the source ID', async () => {
  const result = await deployGillProgram({
    deployWallet: {} as GillWalletInfo,
    generateNewProgramId: false,
    config: { network: 'devnet', workingDir: '/isolated', rpcUrl: 'http://127.0.0.1:8899' },
  })
  expect(result.success).toBe(true)
  expect(mocked.consistent).toHaveBeenCalledWith(undefined, { workingDir: '/isolated', network: 'devnet' })
  expect(mocked.deploy).toHaveBeenCalledWith(undefined, {
    workingDir: '/isolated',
    network: 'devnet',
    rpcUrl: 'http://127.0.0.1:8899',
  })
})
