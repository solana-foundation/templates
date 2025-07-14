import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

type TemplateCategory = 'full-stack' | 'frontend' | 'programs' | 'mobile' | 'api'
type UseCaseTag = 'defi' | 'nfts' | 'gaming' | 'payments' | 'daos' | 'social' | 'identity'
type SolanaLibrary = 'web3.js' | '@solana/kit'
type WalletIntegration = 'wallet-adapter' | 'wallet-ui' | 'mobile-wallet'
type Framework = 'nextjs' | 'react-vite' | 'react-native' | 'node' | 'rust'
type ProgramExample = 'counter' | 'token' | 'nft' | 'custom'

interface SolanaTemplateConfig {
  slug?: string
  thumbnail?: string
  demoUrl?: string
  author?: string
  useCases?: UseCaseTag[]
  category?: TemplateCategory
  features?: {
    transactions?: string[]
    integrations?: string[]
  }
}

interface PackageJson {
  description?: string
  keywords?: string[]
  name?: string
  templateGroups?: { description: string; directory: string; name: string }[]
  solanaTemplate?: SolanaTemplateConfig
}

interface Template {
  name: string
  description: string
  keywords: string[]
  path: string
  slug: string
  author: string
  thumbnail?: string
  category: TemplateCategory
  useCases: UseCaseTag[]
  stack: {
    frontend?: {
      framework: Framework
      ui: string[]
    }
    backend?: {
      type: 'node' | 'rust' | 'anchor'
      framework?: string
    }
    solana: {
      library: SolanaLibrary
      wallet?: WalletIntegration
    }
  }
  features: {
    program?: {
      type: 'anchor' | 'native'
      example?: ProgramExample
    }
    transactions: string[]
    integrations: string[]
  }
  demoUrl?: string
  githubUrl: string
}

interface TemplateGroup {
  description: string
  directory: string
  name: string
  templates: Template[]
}

const FRAMEWORK_KEYWORDS: Record<string, Framework> = {
  'nextjs': 'nextjs',
  'react': 'react-vite',
  'vite': 'react-vite',
  'node': 'node',
}

const UI_KEYWORDS = ['tailwind', 'chakra-ui', 'material-ui', 'ant-design']

const WALLET_KEYWORDS: Record<string, WalletIntegration> = {
  'wallet-adapter': 'wallet-adapter',
  'wallet-ui': 'wallet-ui',
  'mobile-wallet': 'mobile-wallet',
}

const PROGRAM_EXAMPLE_KEYWORDS: Record<string, ProgramExample> = {
  'anchor-basic': 'custom',
  'anchor-counter': 'counter',
  'token': 'token',
  'nft': 'nft',
}

function main() {
  const groups = readTemplateGroups()
  
  const lines: string[] = []
  for (const group of groups) {
    lines.push(...createTemplateReadme(group))
  }
  writeFileSync(join(process.cwd(), 'TEMPLATES.md'), lines.join('\n'))
  
  createTemplateJson(groups)
  
  console.log('✅ Template metadata generated successfully!')
}

main()

function createTemplateReadme({ description, directory, name, templates }: TemplateGroup) {
  const tag = `[${directory}]`
  const lines: string[] = []

  console.log(`${tag} ${name}`)
  lines.push(`# ${name}\n`)
  lines.push(`${description}\n`)

  for (const template of templates) {
    const { description, name, keywords } = template
    lines.push(`### [${name}](${directory}/${name})\n`)
    lines.push(`> ${description}\n`)
    lines.push(`${keywords.map((keyword) => '`' + keyword + '`').join(' ')}\n`)
    console.log(`${tag} -> [${name}]`)
    console.log(`${tag} ->    ${description}`)
    console.log(`${tag} ->    [${keywords.join('|')}]`)
  }

  return lines
}

function createTemplateJson(groups: TemplateGroup[]) {
  const rootTemplatesJsonPath = join(process.cwd(), 'templates.json')
  writeFileSync(rootTemplatesJsonPath, JSON.stringify(groups, null, 2) + '\n')
}

function createTemplate(basicInfo: { name: string; description: string; keywords: string[]; path: string }, groupDirectory: string): Template {
  const packageJson = readPackageJson(basicInfo.path)
  const { solanaTemplate } = packageJson
  const { name, description, keywords, path } = basicInfo
  
  const slug = solanaTemplate?.slug || name.replace(/^template-/, '')
  const author = solanaTemplate?.author || 'Solana Foundation'
  const category = solanaTemplate?.category || inferCategory(keywords, name)
  const framework = inferFramework(keywords, name)
  const ui = keywords.filter(k => UI_KEYWORDS.includes(k))
  const solanaLibrary = inferSolanaLibrary(keywords)
  const walletIntegration = inferWalletIntegration(keywords)
  const hasProgram = keywords.some(k => k.includes('anchor') || k.includes('program'))
  const programExample = inferProgramExample(keywords)
  const useCases = solanaTemplate?.useCases || inferUseCases(keywords, name, description)
  
  return {
    name,
    description,
    keywords,
    path,
    slug,
    author,
    thumbnail: solanaTemplate?.thumbnail,
    category,
    useCases,
    stack: {
      frontend: framework !== 'node' ? {
        framework,
        ui
      } : undefined,
      backend: framework === 'node' ? {
        type: 'node',
        framework: keywords.includes('express') ? 'express' : undefined
      } : undefined,
      solana: {
        library: solanaLibrary,
        wallet: walletIntegration
      }
    },
    features: {
      program: hasProgram ? {
        type: 'anchor',
        example: programExample
      } : undefined,
      transactions: solanaTemplate?.features?.transactions || inferTransactions(keywords),
      integrations: solanaTemplate?.features?.integrations || []
    },
    demoUrl: solanaTemplate?.demoUrl,
    githubUrl: `https://github.com/solana-foundation/solana-templates/tree/main/${groupDirectory}/${name}`
  }
}

function inferCategory(keywords: string[], name: string): TemplateCategory {
  if (keywords.includes('express') || name.includes('api')) return 'api'
  if (keywords.includes('mobile') || keywords.includes('react-native')) return 'mobile'
  if (keywords.includes('node') && !keywords.includes('react') && !keywords.includes('nextjs')) return 'programs'
  if (keywords.some(k => k.includes('anchor') || k.includes('basic') || k.includes('counter'))) return 'full-stack'
  return 'frontend'
}

function inferFramework(keywords: string[], name: string): Framework {
  for (const [keyword, framework] of Object.entries(FRAMEWORK_KEYWORDS)) {
    if (keywords.includes(keyword) || name.includes(keyword)) {
      return framework
    }
  }
  return 'react-vite'
}

function inferSolanaLibrary(keywords: string[]): SolanaLibrary {
  if (keywords.includes('gill') || keywords.includes('solana-kit')) return '@solana/kit'
  return 'web3.js'
}

function inferWalletIntegration(keywords: string[]): WalletIntegration | undefined {
  for (const [keyword, integration] of Object.entries(WALLET_KEYWORDS)) {
    if (keywords.includes(keyword)) return integration
  }
  return undefined
}

function inferProgramExample(keywords: string[]): ProgramExample | undefined {
  for (const [keyword, example] of Object.entries(PROGRAM_EXAMPLE_KEYWORDS)) {
    if (keywords.includes(keyword)) return example
  }
  return undefined
}

function inferUseCases(keywords: string[], name: string, description: string): UseCaseTag[] {
  const useCases: UseCaseTag[] = []
  const allText = `${name} ${description} ${keywords.join(' ')}`.toLowerCase()
  
  if (allText.includes('defi') || allText.includes('amm') || allText.includes('lending')) useCases.push('defi')
  if (allText.includes('nft') || allText.includes('metaplex')) useCases.push('nfts')
  if (allText.includes('game') || allText.includes('gaming')) useCases.push('gaming')
  if (allText.includes('pay') || allText.includes('payment')) useCases.push('payments')
  if (allText.includes('dao') || allText.includes('governance')) useCases.push('daos')
  
  if (useCases.length === 0) {
    if (keywords.includes('anchor-counter') || keywords.includes('anchor-basic')) {
      useCases.push('defi')
    }
  }
  
  return useCases
}

function inferTransactions(keywords: string[]): string[] {
  const transactions: string[] = []
  
  if (keywords.includes('anchor-counter')) {
    transactions.push('initialize', 'increment', 'decrement')
  } else if (keywords.includes('anchor-basic')) {
    transactions.push('initialize', 'update')
  } else if (keywords.includes('transfer')) {
    transactions.push('transfer')
  }
  
  return transactions
}

function getDirectories(directory: string): string[] {
  return readdirSync(directory)
    .map((file) => join(directory, file))
    .filter((file) => statSync(file).isDirectory())
}

function getTemplates(directory: string, groupDirectory: string): Template[] {
  return getDirectories(directory).map((templatePath) => {
    const packageJson = readPackageJson(templatePath)
    const { description, name, keywords } = packageJson

    validateRequiredFields(packageJson, ['description', 'name'], `package.json at ${templatePath}`)
    
    if (!keywords || keywords.length === 0) {
      throw new Error(`No keywords found in package.json at ${templatePath}`)
    }

    return createTemplate({ description: description!, keywords, name: name!, path: templatePath }, groupDirectory)
  })
}

function readTemplateGroups(): TemplateGroup[] {
  const packageJson = readPackageJson(process.cwd())
  const items = packageJson.templateGroups

  if (!items || items.length === 0) {
    throw new Error(`No templateGroups found in package.json`)
  }

  return items.map((group: { description: string; directory: string; name: string }) => {
    validateRequiredFields(group, ['description', 'directory', 'name'], 'group')
    return { ...group, templates: getTemplates(group.directory, group.directory) }
  })
}

function validateRequiredFields(obj: any, fields: string[], context: string) {
  for (const field of fields) {
    if (!obj[field]) {
      throw new Error(`No ${field} found in ${context}`)
    }
  }
}

function readPackageJson(path: string): PackageJson {
  const packageJsonPath = join(path, 'package.json')
  if (!existsSync(packageJsonPath)) {
    throw new Error(`No package.json found at ${packageJsonPath}`)
  }
  const packageJson = readFileSync(packageJsonPath, 'utf-8')
  return JSON.parse(packageJson)
}