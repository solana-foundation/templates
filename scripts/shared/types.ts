/**
 * Core type definitions for template generation
 *
 * These types represent the domain model for templates and must match
 * the output format consumed by create-solana-dapp and templates-site.
 */

/**
 * Configuration for a template group from package.json repokit config
 */
export type GroupConfig = {
  readonly name: string
  readonly description: string
  readonly path: string
}

/**
 * Package.json structure (subset of fields we care about)
 */
export type PackageJson = {
  readonly name: string
  readonly displayName?: string
  readonly description?: string
  readonly usecase?: string
  readonly keywords?: readonly string[]
  readonly repository?: {
    readonly name?: string
    readonly type?: string
    readonly url?: string
  }
  readonly repokit?: {
    readonly groups?: readonly GroupConfig[]
  }
}

/**
 * Template metadata extracted from a template's package.json
 */
export type TemplateMetadata = {
  readonly name: string
  readonly displayName?: string
  readonly description: string
  readonly usecase?: string
  readonly keywords: readonly string[]
  readonly path: string
}

/**
 * Template as it appears in templates.json output
 * MUST match format consumed by create-solana-dapp
 */
export type TemplateJson = {
  readonly description: string
  readonly displayName?: string
  readonly id: string
  readonly image: string
  readonly keywords: readonly string[]
  readonly name: string
  readonly path: string
  readonly usecase?: string
}

/**
 * A group of templates as it appears in templates.json
 * MUST match format consumed by create-solana-dapp
 */
export type TemplateGroup = {
  readonly description: string
  readonly name: string
  readonly path: string
  readonly templates: readonly TemplateJson[]
}

/**
 * Root package.json configuration needed for generation
 */
export type RootConfig = {
  readonly groups: readonly GroupConfig[]
  readonly repositoryName: string
}

/**
 * Check if value has required package.json fields
 */
export const isValidPackageJson = (value: unknown): value is PackageJson => {
  if (typeof value !== 'object' || value === null) return false

  const obj = value as Record<string, unknown>

  return (
    typeof obj.name === 'string' &&
    obj.name.length > 0 &&
    (obj.description === undefined || typeof obj.description === 'string') &&
    (obj.keywords === undefined || Array.isArray(obj.keywords))
  )
}

/**
 * Check if package.json represents a valid template
 */
export const isTemplatePackageJson = (pkg: PackageJson): boolean => {
  return !!(pkg.name && pkg.description && pkg.keywords && pkg.keywords.length > 0)
}

/**
 * Check if value is a valid group configuration
 */
export const isValidGroupConfig = (value: unknown): value is GroupConfig => {
  if (typeof value !== 'object' || value === null) return false

  const obj = value as Record<string, unknown>

  return typeof obj.name === 'string' && typeof obj.description === 'string' && typeof obj.path === 'string'
}
