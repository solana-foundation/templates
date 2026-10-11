import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  announcedUrls,
  CARGO_OUTPUT_PATTERN,
  copyFilterFor,
  copyTemplate,
  EXCLUDED_DIRS,
  isPrivateEnvFile,
} from './checks.js'
import { ENV_ALLOWLIST, parentSecretValues, sanitizedEnv } from './env.js'

const fixture = (): string => {
  const dir = mkdtempSync(join(tmpdir(), 'health-isolate-test-'))
  writeFileSync(join(dir, '.env'), 'SECRET_KEY=real\n')
  writeFileSync(join(dir, '.env.local'), 'SECRET_KEY=real\n')
  writeFileSync(join(dir, '.env.production.local'), 'SECRET_KEY=real\n')
  writeFileSync(join(dir, '.env.example'), 'SECRET_KEY=\n')
  writeFileSync(join(dir, 'package.json'), '{}\n')
  mkdirSync(join(dir, 'src'))
  writeFileSync(join(dir, 'src', 'index.ts'), 'export {}\n')
  mkdirSync(join(dir, 'node_modules', 'left-pad'), { recursive: true })
  writeFileSync(join(dir, 'node_modules', 'left-pad', 'index.js'), '')
  mkdirSync(join(dir, '.git'))
  writeFileSync(join(dir, '.git', 'HEAD'), 'ref: refs/heads/main\n')
  // nested app in a monorepo-style template: private env files are dropped at any depth
  mkdirSync(join(dir, 'apps', 'web'), { recursive: true })
  writeFileSync(join(dir, 'apps', 'web', '.env'), 'SECRET_KEY=real\n')
  writeFileSync(join(dir, 'apps', 'web', '.env.sample'), 'SECRET_KEY=\n')
  return dir
}

test('copyTemplate drops private env files and keeps the example', () => {
  const src = fixture()
  const dest = mkdtempSync(join(tmpdir(), 'health-isolate-dest-'))
  try {
    copyTemplate(src, dest)
    const envFiles = readdirSync(dest).filter((name) => name.startsWith('.env'))
    assert.deepEqual(envFiles, ['.env.example'])
    assert.ok(existsSync(join(dest, 'package.json')))
    assert.ok(existsSync(join(dest, 'src', 'index.ts')))
    assert.ok(!existsSync(join(dest, 'node_modules')))
    assert.ok(!existsSync(join(dest, '.git')))
    assert.ok(!existsSync(join(dest, 'apps', 'web', '.env')))
    assert.ok(existsSync(join(dest, 'apps', 'web', '.env.sample')))
  } finally {
    rmSync(src, { recursive: true, force: true })
    rmSync(dest, { recursive: true, force: true })
  }
})

test('private env file detection', () => {
  for (const name of ['.env', '.env.local', '.env.development', '.env.production.local', '.env.test'])
    assert.equal(isPrivateEnvFile(name), true, name)
  for (const name of ['.env.example', '.env.sample', '.env.template', '.envrc.example', 'env.ts', '.eslintrc'])
    assert.equal(isPrivateEnvFile(name), false, name)
})

test('excluded dirs cover installs, build output and git metadata, but not target wholesale', () => {
  for (const name of ['node_modules', '.git', '.next', 'dist', '.turbo']) assert.ok(EXCLUDED_DIRS.includes(name))
  assert.ok(!EXCLUDED_DIRS.includes('target'))
})

const targetFixture = (): string => {
  const dir = mkdtempSync(join(tmpdir(), 'health-target-test-'))
  mkdirSync(join(dir, 'anchor', 'target', 'idl'), { recursive: true })
  writeFileSync(join(dir, 'anchor', 'target', 'idl', 'x.json'), '{}\n')
  mkdirSync(join(dir, 'anchor', 'target', 'types'), { recursive: true })
  writeFileSync(join(dir, 'anchor', 'target', 'types', 'x.ts'), 'export {}\n')
  mkdirSync(join(dir, 'target', 'debug'), { recursive: true })
  writeFileSync(join(dir, 'target', 'debug', 'junk'), 'bin\n')
  mkdirSync(join(dir, 'target', 'deploy'), { recursive: true })
  writeFileSync(join(dir, 'target', 'deploy', 'x.so'), 'so\n')
  writeFileSync(join(dir, 'target', 'CACHEDIR.TAG'), 'tag\n')
  mkdirSync(join(dir, 'target', 'other'))
  writeFileSync(join(dir, 'target', 'other', 'untracked.txt'), 'x\n')
  writeFileSync(join(dir, 'package.json'), '{}\n')
  return dir
}

test('outside git, committed-looking target entries are kept and Cargo output is dropped', () => {
  const src = targetFixture()
  const dest = mkdtempSync(join(tmpdir(), 'health-target-dest-'))
  try {
    copyTemplate(src, dest)
    assert.ok(existsSync(join(dest, 'anchor', 'target', 'idl', 'x.json')))
    assert.ok(existsSync(join(dest, 'anchor', 'target', 'types', 'x.ts')))
    assert.ok(!existsSync(join(dest, 'target', 'debug')))
    assert.ok(!existsSync(join(dest, 'target', 'deploy')))
    assert.ok(!existsSync(join(dest, 'target', 'CACHEDIR.TAG')))
    // not Cargo output and no git to consult: kept
    assert.ok(existsSync(join(dest, 'target', 'other', 'untracked.txt')))
  } finally {
    rmSync(src, { recursive: true, force: true })
    rmSync(dest, { recursive: true, force: true })
  }
})

test('inside git, only tracked target entries are copied', () => {
  const src = targetFixture()
  const tracked = new Set(['package.json', 'anchor/target/idl/x.json', 'anchor/target/types/x.ts'])
  const keep = copyFilterFor(src, tracked)
  assert.equal(keep(src), true)
  assert.equal(keep(join(src, 'package.json')), true)
  assert.equal(keep(join(src, 'anchor')), true)
  assert.equal(keep(join(src, 'anchor', 'target')), true)
  assert.equal(keep(join(src, 'anchor', 'target', 'idl')), true)
  assert.equal(keep(join(src, 'anchor', 'target', 'idl', 'x.json')), true)
  assert.equal(keep(join(src, 'target')), false)
  assert.equal(keep(join(src, 'target', 'debug', 'junk')), false)
  assert.equal(keep(join(src, 'target', 'other', 'untracked.txt')), false)
  rmSync(src, { recursive: true, force: true })
  for (const rel of ['target/debug', 'anchor/target/deploy/x.so', 'target/.rustc_info.json', 'target/CACHEDIR.TAG'])
    assert.ok(CARGO_OUTPUT_PATTERN.test(rel), rel)
  for (const rel of ['anchor/target/idl/x.json', 'target/types/x.ts', 'src/target/index.ts'])
    assert.ok(!CARGO_OUTPUT_PATTERN.test(rel), rel)
})

test('announced URLs: web framework lines first, one per port, 127.0.0.1 normalised', () => {
  const output = [
    '[rust] listening on http://127.0.0.1:8080',
    '[next]   ▲ Next.js 15.0.0',
    '[next]   - Local:        http://localhost:3000',
    '[next]   - Network:      http://192.168.1.2:3000',
    '[next]  ✓ Ready in 1.2s',
    '[rust] also http://127.0.0.1:8080/health',
  ].join('\n')
  assert.deepEqual(announcedUrls(output), ['http://localhost:3000', 'http://localhost:8080'])
  assert.deepEqual(announcedUrls('  VITE v7  ready in 300 ms\n  ➜  Local:   http://localhost:5173/'), [
    'http://localhost:5173',
  ])
  assert.deepEqual(announcedUrls('compiling...'), [])
  // a plain URL on a non-framework line still counts, after any framework ones
  assert.deepEqual(announcedUrls('api at http://localhost:4000\n- Local: http://localhost:3000'), [
    'http://localhost:3000',
    'http://localhost:4000',
  ])
})

test('sanitized env drops secrets and keeps what tools need', () => {
  const env = sanitizedEnv({
    PATH: '/usr/bin',
    HOME: '/home/me',
    SECRET_KEY: 'hunter2',
    OPENAI_API_KEY: 'sk-live',
    AWS_SECRET_ACCESS_KEY: 'aws',
    LC_ALL: 'C',
    NODE_OPTIONS: '--max-old-space-size=4096',
    npm_config_registry: 'https://registry.npmjs.org/',
    CARGO_HOME: '/home/me/.cargo',
    UNDEFINED_ONE: undefined,
  })
  assert.equal(env.PATH, '/usr/bin')
  assert.equal(env.HOME, '/home/me')
  assert.equal(env.LC_ALL, 'C')
  assert.equal(env.NODE_OPTIONS, '--max-old-space-size=4096')
  assert.equal(env.npm_config_registry, 'https://registry.npmjs.org/')
  assert.equal(env.CARGO_HOME, '/home/me/.cargo')
  assert.ok(!('SECRET_KEY' in env))
  assert.ok(!('OPENAI_API_KEY' in env))
  assert.ok(!('AWS_SECRET_ACCESS_KEY' in env))
  assert.ok(!('UNDEFINED_ONE' in env))
  assert.ok(ENV_ALLOWLIST.includes('PATH'))
})

test('prefix-allowlisted registry and toolchain tokens never reach the child env', () => {
  const source = {
    NODE_OPTIONS: '--max-old-space-size=4096',
    NODE_ENV: 'test',
    npm_config_registry: 'https://registry.npmjs.org/',
    PNPM_HOME: '/home/me/.local/share/pnpm',
    NODE_AUTH_TOKEN: 'npm_abcdef123456',
    YARN_NPM_AUTH_TOKEN: 'yarn-token-123456',
    NPM_TOKEN: 'npm-token-123456',
    npm_config__authToken: 'legacy-auth-123456',
    'npm_config_//registry.npmjs.org/:_authToken': 'scoped-auth-123456',
    NODE_TLS_SECRET: 'tls-secret-123456',
    PNPM_API_KEY: 'pnpm-key-123456',
    XDG_CONFIG_HOME: '/home/me/.config',
  }
  const env = sanitizedEnv(source)
  assert.equal(env.NODE_OPTIONS, '--max-old-space-size=4096')
  assert.equal(env.NODE_ENV, 'test')
  assert.equal(env.npm_config_registry, 'https://registry.npmjs.org/')
  assert.equal(env.PNPM_HOME, '/home/me/.local/share/pnpm')
  assert.equal(env.XDG_CONFIG_HOME, '/home/me/.config')
  for (const key of [
    'NODE_AUTH_TOKEN',
    'YARN_NPM_AUTH_TOKEN',
    'NPM_TOKEN',
    'npm_config__authToken',
    'npm_config_//registry.npmjs.org/:_authToken',
    'NODE_TLS_SECRET',
    'PNPM_API_KEY',
  ])
    assert.ok(!(key in env), key)
  // and their values join the redaction set regardless
  const redacted = parentSecretValues(source)
  assert.ok(redacted.includes('npm_abcdef123456'))
  assert.ok(redacted.includes('yarn-token-123456'))
  assert.ok(!redacted.includes('https://registry.npmjs.org/'))
})
