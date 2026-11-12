import { beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  idl: { address: '11111111111111111111111111111112' },
  writes: [] as [string, string][],
  render: vi.fn(),
  convert: vi.fn(),
}))
vi.mock('fs', () => ({
  existsSync: () => true,
  readFileSync: (file: string) =>
    file.endsWith('lib.rs') ? `declare_id!("${state.idl.address}");` : JSON.stringify(state.idl),
  writeFileSync: (file: string, value: string) => state.writes.push([file, value]),
}))
vi.mock('codama', () => ({ createFromRoot: () => ({ getRoot: () => ({}) }) }))
vi.mock('@codama/nodes-from-anchor', () => ({ rootNodeFromAnchor: state.convert }))
vi.mock('@codama/renderers-js', () => ({ renderVisitor: () => ({}) }))
vi.mock('@codama/visitors-core', () => ({ visit: state.render }))

beforeEach(() => {
  vi.resetModules()
  state.writes.length = 0
  state.convert.mockReset()
  state.render.mockReset()
})

describe('setup client generation', () => {
  it('reads the current IDL on each run and synchronizes the browser IDL', async () => {
    const { default: generate } = await import('../anchor/codama.config')
    await generate()
    const updated = { address: '11111111111111111111111111111113' }
    state.idl = updated
    await generate()
    expect(state.convert).toHaveBeenLastCalledWith(updated)
    expect(JSON.parse(state.writes.at(-1)![1])).toEqual(updated)
    expect(state.writes.at(-1)![0].replaceAll('\\', '/')).toMatch(/src\/lib\/idl.json$/)
  })

  it('propagates generation failures instead of reporting success', async () => {
    const { default: generate } = await import('../anchor/codama.config')
    state.render.mockRejectedValueOnce(new Error('renderer failed'))
    await expect(generate()).rejects.toThrow('renderer failed')
    expect(state.writes).toHaveLength(0)
  })
})
