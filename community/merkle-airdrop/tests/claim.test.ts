import { createHash } from 'node:crypto'
import { beforeEach, expect, test, vi } from 'vitest'
import { address, createClient, createNoopSigner, getBase64Decoder, getBase64Encoder } from '@solana/kit'
import { solanaRpc } from '@solana/kit-plugin-rpc'
import { checkClaimStatus, claimAddresses, prepareClaim } from '../src/lib/airdrop-client'
import { createLeaf, getRootHex } from '../src/lib/merkle-tree'
import { RECIPIENTS_DATA } from '../src/lib/recipients'
import type { AppClient } from '../src/lib/solana-client'

vi.mock('../src/lib/config', () => ({
  AIRDROP_CONFIG: { AIRDROP_PROGRAM_ID: '11111111111111111111111111111113' },
  validateConfig: vi.fn(),
}))
vi.mock('../src/lib/recipients', () => ({
  RECIPIENTS_DATA: {
    merkleRoot: '',
    recipients: [{ publicKey: '11111111111111111111111111111112', amount: '9007199254740993', index: 0 }],
  },
}))

const program = address('11111111111111111111111111111113')
const signer = createNoopSigner(address('11111111111111111111111111111112'))
const real = createClient()
  .use((c) => ({ ...c, payer: signer }))
  .use(
    solanaRpc({
      rpcUrl: 'http://127.0.0.1:8899',
      transactionConfig: { version: 1 },
    }),
  )
const discriminator = (name: string) => createHash('sha256').update(`account:${name}`).digest().subarray(0, 8)
const account = (bytes: Uint8Array, owner: string = program) => ({
  owner,
  data: [getBase64Decoder().decode(bytes), 'base64'],
})
let connected: { signer: typeof signer; supportedTransactionVersions: Set<number> } | null
let stateBytes: Uint8Array
let stateOwner: string
let claimInfo: ReturnType<typeof account> | null
let rpcError: Error | undefined
let balance: bigint
let fee: bigint | null
let onFee: () => void
const rent = 946560n
const sendTransaction = vi.fn()
const getAccountInfo = vi.fn((key: string) => ({
  send: async () => {
    if (rpcError) throw rpcError
    const { claim } = await claimAddresses(program, signer.address)
    return { value: key === claim ? claimInfo : account(stateBytes, stateOwner) }
  },
}))
const getFeeForMessage = vi.fn((encoded: string) => ({
  send: async () => {
    expect(getBase64Encoder().encode(encoded)[0]).toBe(129)
    onFee()
    return { value: fee }
  },
}))
const getMinimumBalanceForRentExemption = vi.fn(() => ({ send: async () => rent }))
const client = {
  ...real,
  wallet: { getState: () => ({ connected }) },
  sendTransaction,
  rpc: {
    getAccountInfo,
    getMinimumBalanceForRentExemption,
    getFeeForMessage,
    getBalance: () => ({ send: async () => ({ value: balance }) }),
    getLatestBlockhash: () => ({
      send: async () => ({ value: { blockhash: '11111111111111111111111111111111', lastValidBlockHeight: 999n } }),
    }),
    simulateTransaction: () => ({
      send: async () => ({ value: { err: null, unitsConsumed: 500n, loadedAccountsDataSize: 128n } }),
    }),
  },
} as unknown as AppClient
const prepare = () => prepareClaim(client, new AbortController().signal)

beforeEach(() => {
  vi.clearAllMocks()
  connected = { signer, supportedTransactionVersions: new Set([1]) }
  const root = createLeaf(signer.address, '9007199254740993')
  RECIPIENTS_DATA.merkleRoot = getRootHex(root)
  stateBytes = new Uint8Array(89)
  stateBytes.set(discriminator('AirdropState'))
  stateBytes.set(root, 8)
  stateOwner = program
  claimInfo = null
  rpcError = undefined
  balance = rent + 7000n
  fee = 7000n
  onFee = () => {}
})

test('uses the actual Kit planner to prepare exact V1 bytes without signing or sending', async () => {
  const result = await prepare()
  expect(result.message.version).toBe(1)
  expect(result.message.feePayer.address).toBe(signer.address)
  expect(result.recipient).toBe(signer.address)
  expect(result.amount).toBe('9007199254740993')
  const instruction = result.message.instructions.find((ix) => ix.programAddress === program)!
  expect(new DataView(Uint8Array.from(instruction.data!).buffer).getBigUint64(8, true)).toBe(9007199254740993n)
  expect(getMinimumBalanceForRentExemption).toHaveBeenCalledWith(8n)
  expect(getFeeForMessage).toHaveBeenCalledOnce()
  expect(sendTransaction).not.toHaveBeenCalled()
})
test('missing eligibility stops before any RPC', async () => {
  connected!.signer = createNoopSigner(address('11111111111111111111111111111114'))
  await expect(prepare()).rejects.toThrow('not eligible')
  expect(getAccountInfo).not.toHaveBeenCalled()
})
test('RPC failure is never interpreted as unclaimed', async () => {
  rpcError = new Error('RPC unavailable')
  await expect(checkClaimStatus(client, program, signer.address)).rejects.toThrow('RPC unavailable')
  await expect(prepare()).rejects.toThrow('RPC unavailable')
})
test('only an absent claim account is unclaimed', async () => {
  expect(await checkClaimStatus(client, program, signer.address)).toBe(false)
  claimInfo = account(discriminator('ClaimStatus'))
  expect(await checkClaimStatus(client, program, signer.address)).toBe(true)
  await expect(prepare()).rejects.toThrow('Already claimed')
})
test('rejects claim accounts owned by another program', async () => {
  claimInfo = account(discriminator('ClaimStatus'), '11111111111111111111111111111111')
  await expect(prepare()).rejects.toThrow('unexpected owner')
})
test('rejects program-owned claim accounts with an invalid discriminator', async () => {
  claimInfo = account(new Uint8Array(8))
  await expect(checkClaimStatus(client, program, signer.address)).rejects.toThrow()
})
test('rejects state with an invalid discriminator even when its root matches', async () => {
  stateBytes.fill(0, 0, 8)
  await expect(prepare()).rejects.toThrow()
})
test('rejects wrong state owner, truncated state and mismatched root', async () => {
  stateOwner = '11111111111111111111111111111111'
  await expect(prepare()).rejects.toThrow('not initialized')
  stateOwner = program
  stateBytes = stateBytes.slice(0, 88)
  await expect(prepare()).rejects.toThrow('Invalid airdrop state')
  stateBytes = new Uint8Array(89)
  stateBytes.set(discriminator('AirdropState'))
  await expect(prepare()).rejects.toThrow('on-chain airdrop root')
})
test('checks rent before planning and the actual quoted fee afterward', async () => {
  balance = rent - 1n
  await expect(prepare()).rejects.toThrow('Insufficient SOL')
  expect(getFeeForMessage).not.toHaveBeenCalled()
  balance = rent + 6999n
  await expect(prepare()).rejects.toThrow('Insufficient SOL')
  expect(getFeeForMessage).toHaveBeenCalledOnce()
})
test('rechecks balance after quoting fees', async () => {
  onFee = () => {
    balance = rent
  }
  await expect(prepare()).rejects.toThrow('Insufficient SOL')
})
test('fails closed on a missing fee quote', async () => {
  fee = null
  await expect(prepare()).rejects.toThrow('Unable to estimate')
})
test.each([null, new Set([0]), new Set(['legacy'])])('never falls back to unsupported V0: %s', async (versions) => {
  if (versions === null) connected = null
  else connected!.supportedTransactionVersions = versions as Set<number>
  await expect(prepare()).rejects.toThrow('Version 1')
  expect(getAccountInfo).not.toHaveBeenCalled()
})
test('rejects a planner returning V0', async () => {
  const planTransaction = vi.fn(async () => ({ version: 0 }))
  await expect(
    prepareClaim({ ...client, planTransaction } as unknown as AppClient, new AbortController().signal),
  ).rejects.toThrow('Expected a Version 1')
})
test('detects replacement of the signer at the same address', async () => {
  onFee = () => {
    connected!.signer = createNoopSigner(signer.address)
  }
  await expect(prepare()).rejects.toThrow('Wallet changed')
})
test('cancellation after RPC work prevents returning a prepared claim', async () => {
  const controller = new AbortController()
  onFee = () => controller.abort()
  await expect(prepareClaim(client, controller.signal)).rejects.toThrow()
})
