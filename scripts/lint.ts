#!/usr/bin/env tsx
/**
 * Lint template structure and metadata
 *
 * Validates:
 * - Each template has required package.json fields
 * - No duplicate template names
 * - Keywords are consistent
 * - All templates are discoverable
 *
 * Usage: tsx scripts/lint.ts
 */

import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { readPackageJson, readDirs, hasPackageJson, fileExists } from './shared/fs-utils.js'
import { type GroupConfig, type PackageJson, isTemplatePackageJson } from './shared/types.js'
import { type Result, ok, err } from './shared/result.js'
import { validateImage } from './shared/image-utils.tsx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = join(__dirname, '..')

// Constants
const CONFIG_KEY = 'repokit' as const
const OG_IMAGE_FILENAME = 'og-image.png' as const

type ValidationError = {
  readonly path: string
  readonly message: string
}

// Read root configuration
const readRootConfig = (): Result<readonly GroupConfig[]> => {
  const pkgResult = readPackageJson(ROOT_DIR)
  if (!pkgResult.ok) {
    return err(`Failed to read root package.json: ${pkgResult.error}`)
  }

  const groups = pkgResult.value[CONFIG_KEY]?.groups
  if (!groups || groups.length === 0) {
    return err(`No ${CONFIG_KEY}.groups configuration found`)
  }

  return ok(groups)
}

// Check if a template has all required fields
const validateTemplatePackageJson = (pkg: PackageJson, templatePath: string): ValidationError[] => {
  const errors: ValidationError[] = []

  if (!pkg.name) {
    errors.push({ path: templatePath, message: 'Missing name' })
  }

  if (!pkg.description) {
    errors.push({ path: templatePath, message: 'Missing description' })
  }

  if (!pkg.keywords || pkg.keywords.length === 0) {
    errors.push({ path: templatePath, message: 'Missing or empty keywords' })
  }

  return errors
}

// Scan a single group for validation errors
const lintGroup = async (groupPath: string): Promise<ValidationError[]> => {
  const groupDir = join(ROOT_DIR, groupPath)
  const entriesResult = readDirs(groupDir)

  if (!entriesResult.ok) {
    return [{ path: groupPath, message: `Failed to read directory: ${entriesResult.error}` }]
  }

  const errors: ValidationError[] = []

  for (const entry of entriesResult.value) {
    const entryPath = join(groupDir, entry)
    const templatePath = join(groupPath, entry)

    if (!hasPackageJson(entryPath)) {
      errors.push({ path: templatePath, message: 'Missing package.json' })
      continue
    }

    const pkgResult = readPackageJson(entryPath)
    if (!pkgResult.ok) {
      errors.push({ path: templatePath, message: `Failed to read package.json: ${pkgResult.error}` })
      continue
    }

    const pkgErrors = validateTemplatePackageJson(pkgResult.value, templatePath)
    errors.push(...pkgErrors)

    const imagePath = join(entryPath, OG_IMAGE_FILENAME)
    if (!fileExists(imagePath)) {
      errors.push({ path: templatePath, message: `Missing ${OG_IMAGE_FILENAME}` })
      continue
    }

    const imageValidation = await validateImage(imagePath)
    if (!imageValidation.ok) {
      errors.push({ path: templatePath, message: `Invalid image: ${imageValidation.error}` })
    }
  }

  return errors
}

// Check for duplicate template names across all groups
const checkDuplicateNames = (groups: readonly GroupConfig[]): ValidationError[] => {
  const nameMap = new Map<string, string[]>()

  for (const group of groups) {
    const groupDir = join(ROOT_DIR, group.path)
    const entriesResult = readDirs(groupDir)

    if (!entriesResult.ok) continue

    for (const entry of entriesResult.value) {
      const entryPath = join(groupDir, entry)
      if (!hasPackageJson(entryPath)) continue

      const pkgResult = readPackageJson(entryPath)
      if (!pkgResult.ok) continue

      const name = pkgResult.value.name
      const templatePath = join(group.path, entry)

      const existing = nameMap.get(name) || []
      nameMap.set(name, [...existing, templatePath])
    }
  }

  const duplicates = Array.from(nameMap.entries())
    .filter(([, paths]) => paths.length > 1)
    .flatMap(([name, paths]) =>
      paths.map((path) => ({
        path,
        message: `Duplicate template name "${name}" found in: ${paths.join(', ')}`,
      })),
    )

  return duplicates
}

// Main linting pipeline
const lint = async (): Promise<Result<void>> => {
  const configResult = readRootConfig()
  if (!configResult.ok) {
    return configResult
  }

  const groups = configResult.value
  const allErrors: ValidationError[] = []

  // Lint each group
  for (const group of groups) {
    const groupErrors = await lintGroup(group.path)
    allErrors.push(...groupErrors)
  }

  // Check for duplicates
  const duplicateErrors = checkDuplicateNames(groups)
  allErrors.push(...duplicateErrors)

  if (allErrors.length > 0) {
    allErrors.forEach((error) => {
      console.error(`  ${error.path}: ${error.message}`)
    })
    return err(`Found ${allErrors.length} validation error(s)`)
  }

  return ok(undefined)
}

const main = async () => {
  console.log('Linting template structure...')

  const result = await lint()

  if (!result.ok) {
    console.error(`\nValidation failed: ${result.error}\n`)
    process.exit(1)
  }

  console.log('All templates are valid')
}

main()
