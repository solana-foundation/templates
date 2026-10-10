import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { copyTemplate, EXCLUDED_DIRS, isPrivateEnvFile } from './checks.js'
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

test('excluded dirs cover installs, build output and git metadata', () => {
  for (const name of ['node_modules', '.git', '.next', 'dist', 'target', '.turbo'])
    assert.ok(EXCLUDED_DIRS.includes(name))
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
