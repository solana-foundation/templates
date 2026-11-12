import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { getAddressDecoder } from '@solana/kit'
import type { KitNetwork } from '../anchor/lib/kit-client'

const commands = vi.hoisted(() => ({ builds: [] as string[], deployments: [] as string[] }))
function keyAddress(file: string) {
  return getAddressDecoder().decode(Uint8Array.from(JSON.parse(readFileSync(file, 'utf8'))).subarray(32))
}
vi.mock('child_process', () => ({
  execSync: (command: string, options?: { cwd: string }) => {
    if (command.startsWith('solana address -k ')) return keyAddress(command.slice('solana address -k '.length))
    if (command === 'anchor build') {
      commands.builds.push(readFileSync(path.join(options!.cwd, 'Anchor.toml'), 'utf8'))
      return ''
    }
    throw new Error(`Unexpected command: ${command}`)
  },
  execFileSync: (command: string, args: string[], options: { cwd: string }) => {
    if (command !== 'anchor' || args[0] !== 'deploy') throw new Error('Unexpected deployment command')
    commands.deployments.push(readFileSync(path.join(options.cwd, 'Anchor.toml'), 'utf8'))
    return `Program Id: ${keyAddress(path.join(options.cwd, 'target/deploy/solana_distributor-keypair.json'))}`
  },
}))
vi.mock('../anchor/lib/wallet-manager', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../anchor/lib/wallet-manager')>()),
  createGillWalletClient: () => ({ rpc: {} }),
  ensureGillWalletFunded: vi.fn(),
}))
import { generateGillWallet } from '../anchor/lib/wallet-manager'
import { deployGillProgram } from '../anchor/lib/program-manager'
import { checkGillProgramIdConsistency, getGillAnchorProgramId } from '../anchor/lib/build-coordinator'
import { getGillCurrentProgramId } from '../anchor/lib/file-manager'

const directories: string[] = []
beforeEach(() => {
  commands.builds.length = 0
  commands.deployments.length = 0
})
afterEach(() => {
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true })
})
async function workspace() {
  const directory = mkdtempSync(path.join(tmpdir(), 'merkle-network-'))
  directories.push(directory)
  mkdirSync(path.join(directory, 'target/deploy'), { recursive: true })
  mkdirSync(path.join(directory, 'programs/solana-distributor/src'), { recursive: true })
  const wallet = await generateGillWallet('deploy-wallet')
  writeFileSync(
    path.join(directory, 'target/deploy/solana_distributor-keypair.json'),
    JSON.stringify(wallet.secretKey.array),
  )
  writeFileSync(path.join(directory, 'programs/solana-distributor/src/lib.rs'), `declare_id!("${wallet.address}");`)
  const ids = {
    devnet: wallet.address,
    testnet: '11111111111111111111111111111112',
    mainnet: '11111111111111111111111111111113',
  }
  const toml = `[toolchain]\nanchor_version = "1.1.2"\n${Object.entries(ids)
    .map(([network, id]) => `[programs.${network}]\nsolana_distributor = "${id}"\n`)
    .join('')}[provider]\ncluster = "devnet"\nwallet = "deploy-wallet.json"\n`
  writeFileSync(path.join(directory, 'Anchor.toml'), toml)
  return { directory, wallet, ids }
}

test.each(['devnet', 'testnet', 'mainnet'] as KitNetwork[])(
  'new program ID updates only the selected %s section before build and deployment',
  async (network) => {
    const { directory, wallet, ids } = await workspace()
    const result = await deployGillProgram({
      deployWallet: wallet,
      generateNewProgramId: true,
      config: { workingDir: directory, network, rpcUrl: 'http://127.0.0.1:8899' },
    })
    expect(result.success).toBe(true)
    expect(result.programId).not.toBe(wallet.address)
    for (const selected of Object.keys(ids) as KitNetwork[]) {
      expect(getGillAnchorProgramId({ workingDir: directory, network: selected })).toBe(
        selected === network ? result.programId : ids[selected],
      )
    }
    expect(getGillCurrentProgramId({ workingDir: directory, network })).toBe(result.programId)
    expect(checkGillProgramIdConsistency({ workingDir: directory, network }).consistent).toBe(true)
    expect(commands.builds.length).toBeGreaterThan(0)
    expect(commands.deployments).toHaveLength(1)
    for (const toml of [...commands.builds, ...commands.deployments]) {
      expect(toml).toContain(`[programs.${network}]\nsolana_distributor = "${result.programId}"`)
    }
  },
)

test.each(['testnet', 'mainnet'] as KitNetwork[])(
  'detects a stale %s ID even when devnet matches the Rust declaration and key',
  async (network) => {
    const { directory, ids } = await workspace()
    expect(getGillCurrentProgramId({ workingDir: directory, network })).toBe(ids[network])
    expect(checkGillProgramIdConsistency({ workingDir: directory, network })).toMatchObject({
      consistent: false,
      anchorId: ids[network],
    })
  },
)

test('a missing selected network section is not considered consistent with devnet', async () => {
  const { directory, wallet } = await workspace()
  writeFileSync(path.join(directory, 'Anchor.toml'), `[programs.devnet]\nsolana_distributor = "${wallet.address}"\n`)
  expect(getGillAnchorProgramId({ workingDir: directory, network: 'testnet' })).toBeNull()
  expect(checkGillProgramIdConsistency({ workingDir: directory, network: 'testnet' }).consistent).toBe(false)
})

test.each(['devnet', 'testnet', 'mainnet'] as KitNetwork[])(
  'reuse mode synchronizes %s without replacing the deployment key',
  async (network) => {
    const { directory, wallet, ids } = await workspace()
    const keyFile = path.join(directory, 'target/deploy/solana_distributor-keypair.json')
    const previousKey = readFileSync(keyFile, 'utf8')
    const result = await deployGillProgram({
      deployWallet: wallet,
      generateNewProgramId: false,
      config: { workingDir: directory, network, rpcUrl: 'http://127.0.0.1:8899' },
    })
    expect(result).toMatchObject({ success: true, programId: wallet.address })
    expect(readFileSync(keyFile, 'utf8')).toBe(previousKey)
    expect(checkGillProgramIdConsistency({ workingDir: directory, network }).consistent).toBe(true)
    for (const selected of Object.keys(ids) as KitNetwork[]) {
      expect(getGillAnchorProgramId({ workingDir: directory, network: selected })).toBe(
        selected === network ? wallet.address : ids[selected],
      )
    }
  },
)
