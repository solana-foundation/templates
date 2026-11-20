import { afterEach, expect, test } from 'vitest'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createKeyPairSignerFromBytes } from '@solana/kit'
import { generateGillProgramId } from '../anchor/lib/program-manager'
import { generateGillWallet } from '../anchor/lib/wallet-manager'

const directories: string[] = []
function workspace() {
  const directory = mkdtempSync(path.join(tmpdir(), 'merkle-program-id-'))
  directories.push(directory)
  return directory
}
afterEach(() => {
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

test('every new-ID request generates a distinct address without overwriting earlier keys', async () => {
  const directory = workspace()
  const first = await generateGillProgramId(directory)
  const original = readFileSync(first.keypairPath, 'utf8')
  const second = await generateGillProgramId(directory)
  expect(second.programId).not.toBe(first.programId)
  expect(readFileSync(first.keypairPath, 'utf8')).toBe(original)
  for (const result of [first, second]) {
    const bytes = new Uint8Array(JSON.parse(readFileSync(result.keypairPath, 'utf8')))
    expect((await createKeyPairSignerFromBytes(bytes)).address).toBe(result.programId)
  }
})

test('backs up the active deployment key before another address can replace it', async () => {
  const directory = workspace()
  const previous = await generateGillWallet('previous-program')
  const target = path.join(directory, 'target/deploy')
  mkdirSync(target, { recursive: true })
  const activeKey = path.join(target, 'solana_distributor-keypair.json')
  const original = JSON.stringify(previous.secretKey.array)
  writeFileSync(activeKey, original, { mode: 0o600 })
  const generated = await generateGillProgramId(directory)
  expect(generated.programId).not.toBe(previous.address)
  expect(readFileSync(activeKey, 'utf8')).toBe(original)
  expect(readFileSync(path.join(directory, 'program-keypairs', `${previous.address}-keypair.json`), 'utf8')).toBe(
    original,
  )
  await generateGillProgramId(directory)
  expect(readFileSync(activeKey, 'utf8')).toBe(original)
  expect(readFileSync(generated.keypairPath, 'utf8')).toBeTruthy()
})
