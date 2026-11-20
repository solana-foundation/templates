// Creates the program keypair (once) and writes its address into `declare_id!`, like `anchor keys sync`.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = import.meta.dirname
const keypair = join(root, 'target/deploy/hello_world-keypair.json')
const lib = join(root, 'programs/hello_world/src/lib.rs')

if (!existsSync(keypair)) {
  execFileSync('solana-keygen', ['new', '--no-bip39-passphrase', '--silent', '--outfile', keypair], {
    stdio: 'inherit',
  })
}
const address = execFileSync('solana-keygen', ['pubkey', keypair], { encoding: 'utf8' }).trim()

const source = readFileSync(lib, 'utf8')
const updated = source.replace(/declare_id!\("[^"]*"\)/, `declare_id!("${address}")`)
if (updated === source && !source.includes(address)) {
  throw new Error(`Could not find declare_id!(...) in ${lib}`)
}
writeFileSync(lib, updated)
console.log(`Program ID: ${address}`)
