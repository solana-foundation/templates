#!/usr/bin/env node

/**
 * Reset the project to a minimal starting point.
 *
 * Keeps everything that wires up the SDK — the crypto polyfill, the providers and the app config —
 * and deletes the demo built on top of it: the account screens, the network switcher and its read
 * queries, the formatting helpers and the tests that cover them.
 *
 * The switcher goes because `SeekerWalletProvider` takes a single cluster, so the reset app holds one
 * in `constants/app-config.ts` instead of a list to pick from.
 *
 * Usage:
 *   npm run reset-project           # lists what it will delete, then asks
 *   npm run reset-project -- --yes  # skip the prompt
 */

const fs = require('node:fs/promises')
const path = require('node:path')
const readline = require('node:readline')

/**
 * The project is the directory this script lives in, never `process.cwd()`.
 *
 * Deriving it from the working directory would aim the deletions at wherever the caller happens to
 * stand — `node mobile/expo-kit-minimal/scripts/reset-project.js` from a repository root would take
 * out that repository's own README and scripts.
 */
const root = path.join(__dirname, '..')

/**
 * Demo code, relative to the project root. Directories are deleted whole.
 *
 * `features` goes entirely: the account screens are a demo, and so is the network switcher, because
 * `SeekerWalletProvider` takes a single cluster and the app config holds one after the reset.
 *
 * `components` goes the same way and is rebuilt from `writtenPaths` below, rather than naming the
 * demo's own components here. Everything in it exists to serve the demo screens except the providers,
 * which the reset writes anyway, and the Seeker wallet provider, which is read before the delete and
 * written back — so deleting the directory keeps this list correct as the demo grows instead of
 * leaving a new component behind importing something that is gone.
 *
 * `e2e` goes because it drives the demo screens: it presses Connect and Sign Message and asserts on
 * their labels, none of which survive the reset.
 *
 * `scripts` holds this file, so it goes last.
 */
const deletedPaths = ['components', 'e2e', 'features', 'test', 'utils', 'scripts']

/**
 * Files the reset writes, overwriting the demo versions where they exist.
 *
 * Listed here so the confirmation can tell them apart from the deletions — a file that comes back
 * with different contents is not the same thing as one that is gone.
 */
const writtenPaths = [
  'constants/app-config.ts',
  'components/app-providers.tsx',
  'components/app-providers.test.tsx',
  'components/seeker-wallet-provider.tsx',
  'app/index.tsx',
  'README.md',
]

/** Dependencies only the demo features imported. */
const demoDependencies = ['@solana-program/memo']

/** Lockfile to package manager, for when the script is run directly instead of through a script. */
const lockfiles = {
  'bun.lock': 'bun',
  'bun.lockb': 'bun',
  'package-lock.json': 'npm',
  'pnpm-lock.yaml': 'pnpm',
  'yarn.lock': 'yarn',
}

function appConfigContent({ cluster, creator, identity }) {
  return `import { DappIdentity } from '@solana-mobile/seeker-connect-react-native'
import { ${creator}, SolanaCluster } from '@wallet-ui/react-native-kit'

export class AppConfig {
  static cluster: SolanaCluster = ${cluster}
  static identity: DappIdentity = ${identity}
}
`
}

const appProvidersContent = `import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { SeekerWalletProvider } from '@/components/seeker-wallet-provider'
import { AppConfig } from '@/constants/app-config'

const queryClient = new QueryClient()

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <SeekerWalletProvider cluster={AppConfig.cluster} identity={AppConfig.identity}>
        {children}
      </SeekerWalletProvider>
    </QueryClientProvider>
  )
}
`

const appProvidersTestContent = `import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { describe, expect, it } from 'vitest'
import { AppProviders } from '@/components/app-providers'

describe('AppProviders', () => {
  it('renders its children', async () => {
    const screen = await render(
      <AppProviders>
        <Text>ready</Text>
      </AppProviders>,
    )

    expect(screen.getByText('ready')).toBeTruthy()
  })
})
`

const indexContent = `import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppConfig } from '@/constants/app-config'
import { appStyles } from '@/constants/app-styles'

export default function HomeScreen() {
  // Anywhere below \`AppProviders\`, \`useSeekerWallet()\` from '@/components/seeker-wallet-provider' gives you
  // the connected account, the RPC client and the sign and send methods.
  return (
    <SafeAreaView style={appStyles.screen}>
      <View style={appStyles.stack}>
        <Text style={appStyles.title}>{AppConfig.identity.name}</Text>
        <Text>Edit app/index.tsx to start building.</Text>
      </View>
    </SafeAreaView>
  )
}
`

function readmeContent({ name, pm }) {
  return `# ${name}

An [Expo](https://expo.dev) app wired up to the Seeker's wallet with
[\`@solana-mobile/seeker-connect-react-native\`](https://www.npmjs.com/package/@solana-mobile/seeker-connect-react-native).

Seeker Connect is Android only, so connecting a wallet needs an Android device or emulator with a
wallet app installed, and a development build: the native module cannot run in Expo Go.

## Getting started

\`\`\`bash
${pm} install
${pm} run android
\`\`\`

## What is wired up

- \`index.js\` installs the crypto polyfill, then hands off to \`expo-router\`.
- \`constants/app-config.ts\` holds the cluster the app talks to and the identity wallets show on
  approval. Change the cluster there to point somewhere else.
- \`components/app-providers.tsx\` sets up React Query and \`SeekerWalletProvider\`, the wrapper in
  \`components/seeker-wallet-provider.tsx\` that keeps the Seeker Connect authorization in React state.
- \`app/index.tsx\` is the home screen — empty, ready for your own code.

## Using the wallet

\`useSeekerWallet()\` works anywhere below \`AppProviders\`:

\`\`\`tsx
import { useSeekerWallet } from '@/components/seeker-wallet-provider'

const { account, chain, client, connect, disconnect, sendTransactions, signIn, signMessages } = useSeekerWallet()
\`\`\`

\`account\` is \`null\` until a wallet is connected, and \`client.rpc\` is a
[\`@solana/kit\`](https://www.npmjs.com/package/@solana/kit) RPC client pointed at the cluster from
\`app-config.ts\`.

Every call that touches the wallet — \`connect\`, \`signIn\`, \`signMessages\`, \`sendTransactions\` —
launches the wallet app for the user to approve, and rejects if they decline.

## Scripts

\`\`\`bash
${pm} run dev      # start the dev server
${pm} run android  # build and run on a device or emulator
${pm} run test     # run the test suite
${pm} run ci       # type check, lint, format check, test, prebuild
\`\`\`
`
}

async function main() {
  const pkg = await readProject()

  if (!pkg) {
    return
  }

  const present = []
  for (const target of deletedPaths) {
    if (await exists(path.join(root, target))) {
      present.push(target)
    }
  }

  if (present.length === 0) {
    console.log('Nothing to do — this project has already been reset.')
    return
  }

  if (!(await confirm(present))) {
    console.log('Nothing was deleted.')
    return
  }

  console.log()

  const seekerWalletProvider = await fs.readFile(path.join(root, 'components/seeker-wallet-provider.tsx'), 'utf8')

  for (const target of present) {
    await fs.rm(path.join(root, target), { force: true, recursive: true })
    console.log(`❌ ${target} deleted.`)
  }

  const pm = await detectPackageManager()

  await writePackageJson(pkg)

  await write('constants/app-config.ts', appConfigContent(await readNetwork(pkg)))
  await write('components/app-providers.tsx', appProvidersContent)
  await write('components/app-providers.test.tsx', appProvidersTestContent)
  await write('components/seeker-wallet-provider.tsx', seekerWalletProvider)
  await write('app/index.tsx', indexContent)
  await write('README.md', readmeContent({ name: pkg.name ?? path.basename(root), pm }))

  console.log(`
✅ Reset complete. Next:

  1. Run \`${pm} install\` so the dependencies match the trimmed package.json.
  2. Edit app/index.tsx to build your first screen.
  3. Reach for the wallet with \`useSeekerWallet()\`, and change the cluster in
     constants/app-config.ts.
`)
}

async function write(target, contents) {
  const file = path.join(root, target)

  // `components` is deleted above, so its directory has to come back before anything lands in it.
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, contents)
  console.log(`📄 ${target} written.`)
}

/**
 * The single cluster the reset app talks to, and the identity wallets show on approval.
 *
 * Both are carried over from the app config the template shipped, so a project that already pointed
 * at another cluster or renamed itself keeps that. The first of the configured networks wins — with
 * the switcher gone there is one cluster, and the provider selected the first network anyway.
 */
async function readNetwork(pkg) {
  const fallback = {
    cluster: `createSolanaDevnet({ url: 'https://api.devnet.solana.com' })`,
    creator: 'createSolanaDevnet',
    identity: `{ name: '${pkg.name ?? path.basename(root)}', uri: 'https://example.com' }`,
  }

  let source
  try {
    source = await fs.readFile(path.join(root, 'constants/app-config.ts'), 'utf8')
  } catch {
    console.log('ℹ️  No constants/app-config.ts to read, writing a devnet config.')
    return fallback
  }

  const cluster = /(create(Solana\w+)\(\{[^}]*\}\))/.exec(source)
  const identity = /static identity:\s*\w+\s*=\s*(\{[^}]*\})/.exec(source)

  if (!cluster || !identity) {
    console.log('ℹ️  constants/app-config.ts was not in its original shape, writing a devnet config.')
    return fallback
  }

  return { cluster: cluster[1], creator: `create${cluster[2]}`, identity: identity[1] }
}

/**
 * Read the package.json this script belongs to, and refuse to touch anything unless that project
 * asked for a reset by declaring the script. A copy of this file dropped into an unrelated project
 * should delete nothing.
 */
async function readProject() {
  const file = path.join(root, 'package.json')
  let pkg

  try {
    pkg = JSON.parse(await fs.readFile(file, 'utf8'))
  } catch {
    console.error(`No readable package.json in ${root}. This script only resets the project it ships with.`)
    process.exitCode = 1
    return null
  }

  if (!pkg.scripts?.['reset-project']) {
    console.error(
      `${file} does not declare a "reset-project" script, so this is not the project this script resets. Nothing was deleted.`,
    )
    process.exitCode = 1
    return null
  }

  return pkg
}

/** Show the project and what is about to happen, then ask. Deleting is irreversible, so silence is a no. */
async function confirm(targets) {
  console.log(`\nProject: ${root}\n\nDeleted:`)
  for (const target of targets) {
    console.log(`  ${target}`)
  }

  console.log('\nWritten:')
  for (const target of writtenPaths) {
    console.log(`  ${target}`)
  }

  console.log(
    '\nKept: the crypto polyfill, the app styles, the layout and the Expo config. The app config keeps' +
      '\nits identity and its first network, which becomes the single cluster the app talks to.\n',
  )

  if (process.argv.slice(2).includes('--yes')) {
    return true
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

  try {
    // A closed stdin — a CI job, a pipe that ended — resolves to an empty answer, which is a no.
    const answer = await new Promise((resolve) => {
      rl.question('Reset this project? (y/N): ', resolve)
      rl.once('close', () => resolve(''))
    })

    return answer.trim().toLowerCase().startsWith('y')
  } finally {
    rl.close()
  }
}

/** Drop the demo dependencies and the script entries that now point at files that are gone. */
async function writePackageJson(pkg) {
  delete pkg.scripts['reset-project']
  delete pkg.scripts['e2e']

  for (const dependency of demoDependencies) {
    if (pkg.dependencies?.[dependency]) {
      delete pkg.dependencies[dependency]
      console.log(`📦 ${dependency} removed from dependencies.`)
    }
  }

  await fs.writeFile(path.join(root, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`)
  console.log('📄 package.json updated.')
}

/**
 * The package manager to name in the instructions we leave behind.
 *
 * `npm_config_user_agent` is set by every manager when it runs a script, so it is right whenever the
 * reset went through `<pm> run reset-project`. A direct `node scripts/reset-project.js` has no user
 * agent, so fall back to whichever lockfile the project has.
 */
async function detectPackageManager() {
  const [fromUserAgent] = (process.env.npm_config_user_agent ?? '').split('/')

  if (['bun', 'npm', 'pnpm', 'yarn'].includes(fromUserAgent)) {
    return fromUserAgent
  }

  for (const [lockfile, pm] of Object.entries(lockfiles)) {
    if (await exists(path.join(root, lockfile))) {
      return pm
    }
  }

  return 'npm'
}

async function exists(target) {
  try {
    await fs.stat(target)
    return true
  } catch {
    return false
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
