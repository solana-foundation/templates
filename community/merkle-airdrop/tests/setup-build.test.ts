import { beforeEach, describe, expect, it, vi } from 'vitest'

const calls = vi.hoisted(() => [] as string[])
vi.mock('fs', () => ({
  existsSync: () => true,
  readFileSync: () => 'source',
  mkdirSync: () => calls.push('mkdir'),
  copyFileSync: () => calls.push('copy-keypair'),
}))
vi.mock('child_process', () => ({
  execSync: (command: string) => {
    calls.push(command)
    return ''
  },
  execFileSync: (_command: string, args: string[]) => {
    calls.push(JSON.stringify(args))
    return 'Program Id: 11111111111111111111111111111111'
  },
}))

beforeEach(() => {
  calls.length = 0
  vi.resetModules()
})

describe('setup deployment ordering', () => {
  it('installs the selected keypair before building and uses the configured RPC', async () => {
    const { deployGillProgram } = await import('../anchor/lib/build-coordinator')
    const result = await deployGillProgram('program-keypair.json', {
      workingDir: '.',
      rpcUrl: 'http://127.0.0.1:8899',
    })
    expect(result.success).toBe(true)
    expect(calls.indexOf('copy-keypair')).toBeLessThan(calls.indexOf('anchor build'))
    expect(calls).toContain(JSON.stringify(['deploy', '--provider.cluster', 'http://127.0.0.1:8899']))
  })
})
