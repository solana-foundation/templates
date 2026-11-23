// Swap amounts are `amount × 10^decimals`, so a wrong decimals value sizes the swap wrong.
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const path = require('node:path')
const { test } = require('node:test')
const ts = require('typescript')

// Load the production module without a build step, a network connection or an RPC endpoint.
function loadModule(relativePath) {
  const filename = path.join(__dirname, '..', relativePath)
  const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), {
    fileName: filename,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  })
  const module = { exports: {} }
  new Function('module', 'exports', 'require', outputText)(module, module.exports, require)
  return module.exports
}

const { createMintDecimalsReader } = loadModule('lib/mint-decimals.ts')

const USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
const ZERO_DECIMAL_MINT = 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'
const TOKEN_ACCOUNT = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'

const parsedAccount = (type, info) => ({ value: { data: { program: 'spl-token', parsed: { type, info }, space: 82 } } })

// A stand-in for `connection.getParsedAccountInfo` that records which addresses were read.
function fakeChain(accounts) {
  const reads = []
  const getParsedAccountInfo = async (address) => {
    reads.push(address.toBase58())
    return accounts[address.toBase58()] ?? { value: null }
  }
  return { getParsedAccountInfo, reads }
}

test('a known 6-decimal mint returns 6 without a chain read', async () => {
  const chain = fakeChain({})
  const readMintDecimals = createMintDecimalsReader(chain.getParsedAccountInfo, { [USDC]: 6 })
  assert.equal(await readMintDecimals(USDC), 6)
  assert.deepEqual(chain.reads, [])
})

test('an on-chain mint with 0 decimals returns 0, not a fallback', async () => {
  const chain = fakeChain({ [ZERO_DECIMAL_MINT]: parsedAccount('mint', { decimals: 0 }) })
  const readMintDecimals = createMintDecimalsReader(chain.getParsedAccountInfo)
  assert.equal(await readMintDecimals(ZERO_DECIMAL_MINT), 0)
})

test('a missing account is refused', async () => {
  const readMintDecimals = createMintDecimalsReader(fakeChain({}).getParsedAccountInfo)
  await assert.rejects(readMintDecimals(ZERO_DECIMAL_MINT), /Could not read decimals/)
})

test('an account that is not a mint is refused', async () => {
  const chain = fakeChain({
    [TOKEN_ACCOUNT]: parsedAccount('account', { tokenAmount: { decimals: 6 } }),
    [USDC]: { value: { data: Buffer.alloc(82) } }, // unparsed account data
  })
  const readMintDecimals = createMintDecimalsReader(chain.getParsedAccountInfo)
  await assert.rejects(readMintDecimals(TOKEN_ACCOUNT), /Could not read decimals/)
  await assert.rejects(readMintDecimals(USDC), /Could not read decimals/)
})

test('a non-mint account is refused even if it carries a decimals field', async () => {
  const chain = fakeChain({ [TOKEN_ACCOUNT]: parsedAccount('account', { decimals: 6 }) })
  const readMintDecimals = createMintDecimalsReader(chain.getParsedAccountInfo)
  await assert.rejects(readMintDecimals(TOKEN_ACCOUNT), /Could not read decimals/)
})

test('an invalid address is refused before any chain read', async () => {
  const chain = fakeChain({})
  const readMintDecimals = createMintDecimalsReader(chain.getParsedAccountInfo)
  await assert.rejects(readMintDecimals('z'.repeat(44)), /Not a valid token mint address/)
  assert.deepEqual(chain.reads, [])
})

test('each mint is read from the chain only once', async () => {
  const chain = fakeChain({ [ZERO_DECIMAL_MINT]: parsedAccount('mint', { decimals: 5 }) })
  const readMintDecimals = createMintDecimalsReader(chain.getParsedAccountInfo)
  assert.equal(await readMintDecimals(ZERO_DECIMAL_MINT), 5)
  assert.equal(await readMintDecimals(ZERO_DECIMAL_MINT), 5)
  assert.equal(chain.reads.length, 1)
})
