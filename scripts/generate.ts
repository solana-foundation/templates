#!/usr/bin/env tsx
/**
 * Generate templates.json and TEMPLATES.md from template directories
 *
 * This script replaces the need for @beeman/repokit to generate template metadata.
 * It maintains 100% compatibility with the output format consumed by create-solana-dapp
 * and templates-site.
 *
 * Usage: tsx scripts/generate.ts
 */

import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import {
  readPackageJson,
  readDirs,
  writeJsonFile,
  writeFile,
  hasPackageJson,
  joinPath,
} from './shared/fs-utils.js'
import {
  type TemplateMetadata,
  type TemplateJson,
  type TemplateGroup,
  type GroupConfig,
  type RootConfig,
  isTemplatePackageJson,
} from './shared/types.js'
import { ok, err, type Result, unwrap } from './shared/result.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = join(__dirname, '..')
const TEMPLATES_JSON_PATH = join(ROOT_DIR, 'templates.json')
const TEMPLATES_MD_PATH = join(ROOT_DIR, 'TEMPLATES.md')

/**
 * Read configuration from root package.json
 */
const readRootConfig = (): Result<RootConfig> => {
  const pkgResult = readPackageJson(ROOT_DIR)
  if (!pkgResult.ok) {
    return err(`Failed to read root package.json: ${pkgResult.error}`)
  }

  const pkg = pkgResult.value
  const groups = pkg.repokit?.groups

  if (!groups || groups.length === 0) {
    return err('No repokit.groups configuration found in package.json')
  }

  const repositoryName = pkg.repository?.name || 'solana-foundation/templates'

  return ok({ groups, repositoryName })
}

/**
 * Generate template ID in giget format
 */
const generateTemplateId = (repositoryName: string, templatePath: string): string => {
  return `gh:${repositoryName}/${templatePath}`
}

/**
 * Extract template metadata from a template directory's package.json
 */
const extractTemplateMetadata = (
  dir: string,
  groupPath: string,
  directoryName: string,
): Result<TemplateMetadata> => {
  const pkgResult = readPackageJson(dir)
  if (!pkgResult.ok) {
    return err(`Failed to read package.json in ${dir}: ${pkgResult.error}`)
  }

  const pkg = pkgResult.value

  if (!isTemplatePackageJson(pkg)) {
    return err(`Invalid template package.json in ${dir}: missing required fields`)
  }

  const relativePath = join(groupPath, directoryName)

  return ok({
    name: pkg.name,
    description: pkg.description || '',
    keywords: [...(pkg.keywords || [])],
    path: relativePath,
  })
}

/**
 * Scan a group directory for templates
 */
const scanGroup = (
  groupPath: string,
  repositoryName: string,
): Result<readonly TemplateMetadata[]> => {
  const groupDir = join(ROOT_DIR, groupPath)
  const entriesResult = readDirs(groupDir)

  if (!entriesResult.ok) {
    return err(`Failed to read group directory ${groupPath}: ${entriesResult.error}`)
  }

  const templates: TemplateMetadata[] = []

  for (const entry of entriesResult.value) {
    const entryPath = join(groupDir, entry)

    if (!hasPackageJson(entryPath)) {
      continue
    }

    const metadataResult = extractTemplateMetadata(entryPath, groupPath, entry)
    if (metadataResult.ok) {
      templates.push(metadataResult.value)
    } else {
      console.warn(`Skipping ${entry}: ${metadataResult.error}`)
    }
  }

  return ok(templates)
}

/**
 * Scan all groups and collect all templates
 */
const scanAllGroups = (
  groups: readonly GroupConfig[],
  repositoryName: string,
): Result<Map<string, readonly TemplateMetadata[]>> => {
  const groupMap = new Map<string, readonly TemplateMetadata[]>()

  for (const group of groups) {
    const templatesResult = scanGroup(group.path, repositoryName)
    if (!templatesResult.ok) {
      return err(templatesResult.error)
    }
    groupMap.set(group.path, templatesResult.value)
  }

  return ok(groupMap)
}

/**
 * Transform template metadata to JSON format
 */
const toTemplateJson = (
  metadata: TemplateMetadata,
  repositoryName: string,
): TemplateJson => ({
  description: metadata.description,
  id: generateTemplateId(repositoryName, metadata.path),
  keywords: [...metadata.keywords],
  name: metadata.name,
  path: metadata.path,
})

/**
 * Build template groups for JSON output
 */
const buildTemplateGroups = (
  groups: readonly GroupConfig[],
  groupMap: Map<string, readonly TemplateMetadata[]>,
  repositoryName: string,
): readonly TemplateGroup[] => {
  return groups
    .map((group) => {
      const templates = groupMap.get(group.path) || []
      const templateJsons = templates
        .map((t) => toTemplateJson(t, repositoryName))
        .sort((a, b) => a.name.localeCompare(b.name))

      return {
        description: group.description,
        name: group.name,
        path: group.path,
        templates: templateJsons,
      }
    })
    .filter((group) => group.templates.length > 0)
}

/**
 * Generate markdown for a single template
 */
const templateToMarkdown = (template: TemplateJson): string => {
  const lines = [
    `### [${template.name}](${template.path})`,
    '',
    `\`${template.id}\``,
    '',
    `> ${template.description}`,
    '',
    template.keywords.map((k) => `\`${k}\``).join(' '),
  ]
  return lines.join('\n')
}

/**
 * Generate TEMPLATES.md content
 */
const generateTemplatesMd = (groups: readonly TemplateGroup[]): string => {
  const sections = groups.map((group) => {
    const groupHeader = [`# ${group.name}`, '', group.description, ''].join('\n')

    const templatesSection = group.templates
      .map((template) => templateToMarkdown(template))
      .join('\n\n')

    return `${groupHeader}\n${templatesSection}`
  })

  return sections.join('\n\n')
}

/**
 * Write generated files to disk
 */
const writeGeneratedFiles = (
  groups: readonly TemplateGroup[],
): Result<void> => {
  // Write templates.json
  const jsonResult = writeJsonFile(TEMPLATES_JSON_PATH, groups)
  if (!jsonResult.ok) {
    return err(`Failed to write templates.json: ${jsonResult.error}`)
  }

  // Write TEMPLATES.md
  const markdown = generateTemplatesMd(groups)
  const mdResult = writeFile(TEMPLATES_MD_PATH, markdown)
  if (!mdResult.ok) {
    return err(`Failed to write TEMPLATES.md: ${mdResult.error}`)
  }

  return ok(undefined)
}

/**
 * Main generation pipeline
 */
const generate = (): Result<void> => {
  // Read configuration
  const configResult = readRootConfig()
  if (!configResult.ok) {
    return configResult
  }

  const { groups, repositoryName } = configResult.value

  // Scan all template groups
  const groupMapResult = scanAllGroups(groups, repositoryName)
  if (!groupMapResult.ok) {
    return groupMapResult
  }

  // Build template groups
  const templateGroups = buildTemplateGroups(groups, groupMapResult.value, repositoryName)

  // Write generated files
  return writeGeneratedFiles(templateGroups)
}

const main = () => {
  console.log('Generating template metadata...')

  const result = generate()

  if (!result.ok) {
    console.error(`Error: ${result.error}`)
    process.exit(1)
  }

  console.log('Generated templates.json')
  console.log('Generated TEMPLATES.md')
  console.log('Run "automd" to update README.md')
}

main()
