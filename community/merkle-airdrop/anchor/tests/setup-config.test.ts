import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { GillWalletInfo } from '../lib/types'

const files = vi.hoisted(() => new Map<string, string>())
vi.mock('fs', () => ({
  existsSync: (file: string) => files.has(file),
  readFileSync: (file: string) => {
    if (!files.has(file)) throw new Error(`Missing file: ${file}`)
    return files.get(file)
  },
  writeFileSync: (file: string, value: string) => {
    files.set(file, value)
  },
}))
import {
  generateGillRecipientsJson,
  getGillCodamaProgramId,
  updateGillAnchorConfig,
  updateGillEnvironmentFile,
} from '../lib/file-manager'

const wallet = {
  keypairFile: 'local-wallet.json',
  address: 'public-address',
  secretKey: { base58: 'NEVER_EXPORT_THIS' },
} as GillWalletInfo

beforeEach(() => files.clear())

describe('setup configuration (offline)', () => {
  it('updates program, network and amount when recipients are reused', () => {
    const recipient = { ...wallet, name: 'recipient', funded: true }
    generateGillRecipientsJson([recipient], 'old-program', 100, { workingDir: '.' })
    generateGillRecipientsJson([recipient], 'new-program', 200, { workingDir: '.', network: 'testnet' })
    const result = JSON.parse(files.get('./recipients.json')!)
    expect(result.programId).toBe('new-program')
    expect(result.network).toBe('testnet')
    expect(result.totalAmount).toBe('200')
    expect(result.recipients[0].amount).toBe('200')
  })

  it.each(["'", '"'])('reads a generated program address using %s quotes', (quote) => {
    files.set(
      'generated/clients/ts/programs/solanaDistributor.ts',
      `export const SOLANA_DISTRIBUTOR_PROGRAM_ADDRESS =\n  ${quote}program-address${quote} as Address;`,
    )
    expect(getGillCodamaProgramId({ workingDir: '.' })).toBe('program-address')
  })

  it('preserves the current Anchor version, scripts, and unrelated sections', () => {
    files.set(
      'Anchor.toml',
      '[toolchain]\nanchor_version = "1.1.2"\n[scripts]\ntest = "pnpm exec vitest run"\n[programs.devnet]\nsolana_distributor = "old"\n[provider]\ncluster = "devnet"\nwallet = "old.json"\n[hooks]\n',
    )
    updateGillAnchorConfig(wallet, 'new-public-id', { workingDir: '.', network: 'testnet' })
    const result = files.get('Anchor.toml')!
    expect(result).toContain('anchor_version = "1.1.2"')
    expect(result).toContain('test = "pnpm exec vitest run"')
    expect(result).toContain('[hooks]')
    expect(result).toContain('[programs.testnet]\nsolana_distributor = "new-public-id"')
    expect(result).toContain('wallet = "local-wallet.json"')
    expect(result).toContain('cluster = "testnet"')
  })

  it('exports public configuration only', () => {
    updateGillEnvironmentFile('new-public-id', [wallet], { workingDir: '.', network: 'testnet' })
    const result = files.get('../.env.local')!
    expect(result).toContain('NEXT_PUBLIC_PROGRAM_ID=new-public-id')
    expect(result).toContain('NEXT_PUBLIC_SOLANA_NETWORK=testnet')
    expect(result).not.toContain('PRIVATE_KEY')
    expect(result).not.toContain('NEVER_EXPORT_THIS')
  })

  it('removes old leaked wallet keys without changing unrelated settings', () => {
    files.set('../.env.local', 'USER_PRIVATE_KEY=old-secret\nNEXT_PUBLIC_USER_PRIVATE_KEY=old-secret\nKEEP=yes\n')
    updateGillEnvironmentFile('new-public-id', [wallet], { workingDir: '.' })
    const result = files.get('../.env.local')!
    expect(result).not.toContain('PRIVATE_KEY')
    expect(result).not.toContain('secret')
    expect(result).toContain('KEEP=yes')
  })
})
