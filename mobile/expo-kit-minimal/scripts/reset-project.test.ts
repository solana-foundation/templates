import { execFile } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const run = promisify(execFile)

/** The real project, which the tests copy rather than reset. */
const projectRoot = fileURLToPath(new URL('..', import.meta.url))

/** Copying the whole project is pointless and slow — skip what a reset never looks at. */
const skipped = new Set(['.expo', 'android', 'coverage', 'dist', 'ios', 'node_modules'])

/**
 * Lockfiles are left out so the package manager tests start from a known state. CI installs the
 * project with bun, npm, pnpm or yarn before running this suite, and the lockfile that leaves behind
 * would otherwise be what the fallback detects.
 */
const lockfiles = new Set(['bun.lock', 'bun.lockb', 'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock'])

let tmp: string

beforeEach(async () => {
  tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'reset-project-'))
})

afterEach(async () => {
  await fs.rm(tmp, { force: true, recursive: true })
})

/**
 * A throwaway copy of the project, safe to reset.
 *
 * `node_modules` is symlinked rather than copied, which costs nothing and lets the copy run the
 * project's own tsc, prettier and vitest. `fs.rm` unlinks the symlink instead of following it, so the
 * cleanup cannot reach the real directory.
 */
async function copyProject(name = 'app') {
  const dest = path.join(tmp, name)

  await fs.cp(projectRoot, dest, {
    filter: (src) => {
      const name = path.basename(src)

      return !skipped.has(name) && !lockfiles.has(name)
    },
    recursive: true,
  })

  await fs.symlink(path.join(projectRoot, 'node_modules'), path.join(dest, 'node_modules'), 'dir')

  return dest
}

/** The package each dev tool ships in, for reading its entrypoint out of the package's own manifest. */
const toolPackages: Record<string, string> = { prettier: 'prettier', tsc: 'typescript', vitest: 'vitest' }

/**
 * Run one of the project's own dev tools inside `project`.
 *
 * The tool's JavaScript entrypoint is resolved from its package manifest and handed to the node
 * binary running this test, rather than executing the `node_modules/.bin` shim. The shims are shell
 * scripts on POSIX and `.cmd` files on Windows, and `execFile` cannot launch the Windows ones without
 * a shell — so going through them would make these tests Linux and macOS only.
 */
async function runTool(project: string, tool: string, args: string[]) {
  const pkgDir = path.join(project, 'node_modules', toolPackages[tool])
  const { bin } = JSON.parse(await fs.readFile(path.join(pkgDir, 'package.json'), 'utf8'))
  const entrypoint = typeof bin === 'string' ? bin : bin[tool]

  return run(process.execPath, [path.join(pkgDir, entrypoint), ...args], { cwd: project })
}

/**
 * Run the script inside `project`. `cwd` deliberately defaults to somewhere else, because the script
 * must work off its own location rather than the working directory.
 */
function reset(project: string, { args = ['--yes'], cwd = tmp, env = {}, stdin = '' } = {}) {
  const child = run('node', [path.join(project, 'scripts/reset-project.js'), ...args], {
    cwd,
    env: { ...process.env, npm_config_user_agent: '', ...env },
  })

  child.child.stdin?.end(stdin)

  return child
}

async function exists(target: string) {
  try {
    await fs.stat(target)
    return true
  } catch {
    return false
  }
}

async function readPackageJson(project: string) {
  return JSON.parse(await fs.readFile(path.join(project, 'package.json'), 'utf8'))
}

describe('reset-project', () => {
  describe('with --yes', () => {
    it('deletes the demo features and keeps the SDK wiring', async () => {
      const project = await copyProject()

      await reset(project)

      const gone = [
        'components/app-action-button.tsx',
        'components/app-status.tsx',
        'e2e',
        'features',
        'scripts',
        'test',
        'utils',
      ]
      for (const target of gone) {
        expect(await exists(path.join(project, target)), `${target} should be gone`).toBe(false)
      }

      const kept = [
        'app/_layout.tsx',
        'components/app-providers.tsx',
        'constants/app-config.ts',
        'constants/app-styles.ts',
        'index.js',
        'polyfill.js',
        'vitest.config.mts',
      ]
      for (const target of kept) {
        expect(await exists(path.join(project, target)), `${target} should be kept`).toBe(true)
      }
    })

    it('drops the network switcher and hardcodes the cluster', async () => {
      const project = await copyProject()

      await reset(project)

      const appConfig = await fs.readFile(path.join(project, 'constants/app-config.ts'), 'utf8')
      expect(appConfig).toContain('static cluster: SolanaCluster = createSolanaDevnet(')
      expect(appConfig).not.toContain('networks')
      expect(appConfig).not.toContain('createSolanaTestnet')

      const providers = await fs.readFile(path.join(project, 'components/app-providers.tsx'), 'utf8')
      expect(providers).toContain('cluster={AppConfig.cluster}')
      expect(providers).not.toContain('NetworkProvider')
    })

    it('carries over a cluster and identity the project had already changed', async () => {
      const project = await copyProject()
      await fs.writeFile(
        path.join(project, 'constants/app-config.ts'),
        [
          "import { DappIdentity } from '@solana-mobile/seeker-connect-react-native'",
          "import { createSolanaMainnet, SolanaCluster } from '@wallet-ui/react-native-kit'",
          '',
          'export class AppConfig {',
          "  static identity: DappIdentity = { name: 'my-app', uri: 'https://example.com' }",
          "  static networks: SolanaCluster[] = [createSolanaMainnet({ url: 'https://example.com/rpc' })]",
          '}',
          '',
        ].join('\n'),
      )

      await reset(project)

      const appConfig = await fs.readFile(path.join(project, 'constants/app-config.ts'), 'utf8')
      expect(appConfig).toContain(
        "static cluster: SolanaCluster = createSolanaMainnet({ url: 'https://example.com/rpc' })",
      )
      expect(appConfig).toContain("static identity: DappIdentity = { name: 'my-app', uri: 'https://example.com' }")
      expect(appConfig).toContain('import { createSolanaMainnet, SolanaCluster } from')
    })

    it('leaves a test suite that still covers the wiring', async () => {
      const project = await copyProject()

      await reset(project)

      expect(await exists(path.join(project, 'components/app-providers.test.tsx'))).toBe(true)
    })

    it('keeps the Seeker wallet provider', async () => {
      const project = await copyProject()
      const before = await fs.readFile(path.join(project, 'components/seeker-wallet-provider.tsx'), 'utf8')

      await reset(project)

      expect(await fs.readFile(path.join(project, 'components/seeker-wallet-provider.tsx'), 'utf8')).toBe(before)
      const after = await readPackageJson(project)
      expect(after.dependencies['@solana-mobile/seeker-connect-react-native']).toBeDefined()
    })

    it('leaves an empty home screen behind', async () => {
      const project = await copyProject()

      await reset(project)

      const index = await fs.readFile(path.join(project, 'app/index.tsx'), 'utf8')
      expect(index).toContain('export default function HomeScreen()')
      expect(index).not.toContain('AccountFeatureIndex')
      expect(index).not.toContain('NetworkFeatureIndex')
    })

    it('drops the demo dependency and the stale script entries, and keeps the rest of package.json', async () => {
      const project = await copyProject()
      const before = await readPackageJson(project)

      await reset(project)

      const after = await readPackageJson(project)
      expect(after.scripts['reset-project']).toBeUndefined()
      // The harness drives the demo screens and is deleted with them, so its script would point at
      // a file that is gone.
      expect(after.scripts['e2e']).toBeUndefined()
      expect(after.dependencies['@solana-program/memo']).toBeUndefined()
      expect(after.name).toBe(before.name)
      expect(after.dependencies['@wallet-ui/react-native-kit']).toBe(before.dependencies['@wallet-ui/react-native-kit'])
      const dropped = ['e2e', 'reset-project']
      expect(Object.keys(after.scripts)).toEqual(Object.keys(before.scripts).filter((key) => !dropped.includes(key)))
    })

    /**
     * A demo helper that lives outside `features` is the easy one to forget: it survives the reset and
     * keeps importing something that no longer exists. `components` is deleted whole for that reason,
     * so a file added there tomorrow cannot reintroduce it.
     */
    it('takes demo support files outside features with it', async () => {
      const project = await copyProject()
      await fs.writeFile(
        path.join(project, 'components/app-demo-helper.tsx'),
        "import { ellipsify } from '@/utils/ellipsify'\n\nexport const helper = ellipsify\n",
      )

      await reset(project)

      expect(await exists(path.join(project, 'components/app-demo-helper.tsx'))).toBe(false)
      expect(await exists(path.join(project, 'components/app-providers.tsx'))).toBe(true)
      await runTool(project, 'tsc', ['--noEmit'])
    }, 180_000)

    it('leaves no import pointing at a file it deleted', async () => {
      const project = await copyProject()

      await reset(project)

      const deleted = ['@/features/', '@/test/', '@/utils/', 'useNetwork']
      for (const file of await sourceFiles(project)) {
        const source = await fs.readFile(file, 'utf8')

        for (const specifier of deleted) {
          expect(source, `${path.relative(project, file)} still references ${specifier}`).not.toContain(specifier)
        }
      }
    })
  })

  /**
   * Everything above asserts on filenames and substrings, which a file that does not compile passes
   * just as happily. These run the real tools over the generated project instead, so a typo in one of
   * the templates the script writes fails here rather than in someone's fresh app.
   */
  describe('the project it leaves behind', () => {
    it('type checks', { timeout: 180_000 }, async () => {
      const project = await copyProject()

      await reset(project)

      await runTool(project, 'tsc', ['--noEmit'])
    })

    it('is formatted the way its own format:check wants', { timeout: 180_000 }, async () => {
      const project = await copyProject()

      await reset(project)

      await runTool(project, 'prettier', ['--check', '.'])
    })

    it('passes its own test suite', { timeout: 180_000 }, async () => {
      const project = await copyProject()
      const results = path.join(tmp, 'vitest-results.json')

      await reset(project)

      // The reset deletes `scripts`, so this suite is gone from the copy and cannot recurse. Read the
      // JSON reporter rather than stdout, which vitest colours whenever it decides the terminal can
      // take it — a run that reports `1 passed` on a terminal writes `1[22m passed` on CI.
      await runTool(project, 'vitest', ['run', '--reporter=json', `--outputFile=${results}`])

      const summary = JSON.parse(await fs.readFile(results, 'utf8'))

      // `vitest run` already fails on an empty suite; this catches a pass with nothing in it.
      expect(summary.numFailedTests).toBe(0)
      expect(summary.numPassedTests).toBeGreaterThan(0)
    })
  })

  describe('when the working directory is somewhere else', () => {
    it('resets its own project and leaves the working directory alone', async () => {
      const project = await copyProject()
      const elsewhere = path.join(tmp, 'elsewhere')
      await fs.mkdir(path.join(elsewhere, 'scripts'), { recursive: true })
      await fs.writeFile(path.join(elsewhere, 'README.md'), '# Not the template\n')
      await fs.writeFile(path.join(elsewhere, 'scripts/build.sh'), 'echo hi\n')
      await fs.writeFile(path.join(elsewhere, 'package.json'), '{ "name": "elsewhere" }\n')

      await reset(project, { cwd: elsewhere })

      expect(await exists(path.join(elsewhere, 'README.md'))).toBe(true)
      expect(await exists(path.join(elsewhere, 'scripts/build.sh'))).toBe(true)
      expect(JSON.parse(await fs.readFile(path.join(elsewhere, 'package.json'), 'utf8')).name).toBe('elsewhere')
      expect(await exists(path.join(project, 'features'))).toBe(false)
    })
  })

  describe('when the host project does not declare the script', () => {
    it('refuses and deletes nothing', async () => {
      const stranger = path.join(tmp, 'stranger')
      await fs.mkdir(path.join(stranger, 'utils'), { recursive: true })
      await fs.cp(path.join(projectRoot, 'scripts'), path.join(stranger, 'scripts'), { recursive: true })
      await fs.writeFile(path.join(stranger, 'package.json'), '{ "name": "stranger", "scripts": {} }\n')
      await fs.writeFile(path.join(stranger, 'README.md'), '# Stranger\n')
      await fs.writeFile(path.join(stranger, 'utils/keep.ts'), 'export const keep = true\n')

      await expect(reset(stranger)).rejects.toThrow(/does not declare a "reset-project" script/)

      expect(await exists(path.join(stranger, 'README.md'))).toBe(true)
      expect(await exists(path.join(stranger, 'utils/keep.ts'))).toBe(true)
      expect(await exists(path.join(stranger, 'scripts'))).toBe(true)
    })
  })

  describe('without --yes', () => {
    it('deletes nothing when the answer is no', async () => {
      const project = await copyProject()

      const { stdout } = await reset(project, { args: [], stdin: 'n\n' })

      expect(stdout).toContain('Nothing was deleted.')
      expect(await exists(path.join(project, 'features'))).toBe(true)
      expect(await exists(path.join(project, 'utils'))).toBe(true)
    })

    /**
     * The summary is what someone reads while deciding to approve something irreversible, so it has to
     * match what the reset does rather than an earlier version of it.
     */
    it('describes what it will delete, write and keep', async () => {
      const project = await copyProject()

      const { stdout } = await reset(project, { args: [], stdin: 'n\n' })

      for (const target of ['features', 'test', 'utils', 'scripts']) {
        expect(stdout, `${target} should be listed as deleted`).toMatch(
          new RegExp(`Deleted:[\\s\\S]*^ {2}${target}$`, 'm'),
        )
      }

      for (const target of ['constants/app-config.ts', 'components/app-providers.tsx', 'app/index.tsx', 'README.md']) {
        expect(stdout, `${target} should be listed as written`).toMatch(
          new RegExp(`Written:[\\s\\S]*^ {2}${target.replace('.', '\\.')}$`, 'm'),
        )
      }

      // The network provider lives in `features`, so claiming it survives would be a lie.
      expect(stdout).not.toMatch(/network provider/i)
      expect(stdout).toContain('Kept: the crypto polyfill')
    })

    it('deletes nothing when there is no answer at all', async () => {
      const project = await copyProject()

      const { stdout } = await reset(project, { args: [] })

      expect(stdout).toContain('Nothing was deleted.')
      expect(await exists(path.join(project, 'features'))).toBe(true)
    })

    it('deletes when the answer is yes', async () => {
      const project = await copyProject()

      await reset(project, { args: [], stdin: 'y\n' })

      expect(await exists(path.join(project, 'features'))).toBe(false)
    })
  })

  describe('package manager', () => {
    it.for([
      ['bun/1.2.0 npm/? node/v22.13.0 darwin arm64', 'bun'],
      ['pnpm/10.0.0 npm/? node/v22.13.0 darwin arm64', 'pnpm'],
      ['yarn/1.22.22 npm/? node/v22.13.0 darwin arm64', 'yarn'],
    ])('writes %s instructions as `%s`', async ([userAgent, pm]) => {
      const project = await copyProject()

      const { stdout } = await reset(project, { env: { npm_config_user_agent: userAgent } })

      const readme = await fs.readFile(path.join(project, 'README.md'), 'utf8')
      expect(readme).toContain(`${pm} install`)
      expect(readme).toContain(`${pm} run android`)
      // Anchored, because `pnpm install` contains `npm install`.
      expect(readme).not.toMatch(/(^|\s)npm /m)
      expect(stdout).toContain(`\`${pm} install\``)
    })

    it('falls back to the lockfile when there is no user agent', async () => {
      const project = await copyProject()
      await fs.writeFile(path.join(project, 'pnpm-lock.yaml'), "lockfileVersion: '9.0'\n")

      await reset(project)

      expect(await fs.readFile(path.join(project, 'README.md'), 'utf8')).toContain('pnpm install')
    })

    it('falls back to npm with neither a user agent nor a lockfile', async () => {
      const project = await copyProject()

      await reset(project)

      expect(await fs.readFile(path.join(project, 'README.md'), 'utf8')).toContain('npm install')
    })
  })
})

/** Every TypeScript source file left in the project. */
async function sourceFiles(project: string): Promise<string[]> {
  const entries = await fs.readdir(project, { withFileTypes: true })

  const files: string[][] = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(project, entry.name)

      // A recursive `readdir` follows the `node_modules` symlink and returns every `.d.ts` in the
      // dependency tree, which is both slow and a false positive waiting for a dependency to ship
      // one of the strings below.
      if (entry.isSymbolicLink() || entry.name === 'node_modules') {
        return []
      }

      if (entry.isDirectory()) {
        return sourceFiles(target)
      }

      return /\.tsx?$/.test(entry.name) ? [target] : []
    }),
  )

  return files.flat()
}
