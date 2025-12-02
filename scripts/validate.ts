#!/usr/bin/env tsx
/**
 * Validate generated output matches expected format
 *
 * Compares generated templates.json with expected structure
 * to ensure compatibility with create-solana-dapp and templates-site
 *
 * Usage: tsx scripts/validate.ts
 */

import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { readJsonFile, fileExists } from './shared/fs-utils.js'
import type { TemplateGroup } from './shared/types.js'
import { type Result, ok, err } from './shared/result.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = join(__dirname, '..')
const TEMPLATES_JSON_PATH = join(ROOT_DIR, 'templates.json')
const TEMPLATES_MD_PATH = join(ROOT_DIR, 'TEMPLATES.md')

// Constants
const GIGET_PREFIX = 'gh:' as const

type ValidationIssue = {
  readonly severity: 'error' | 'warning'
  readonly message: string
}

// Check if required files exist
const checkFilesExist = (): ValidationIssue[] => {
  const issues: ValidationIssue[] = []

  if (!fileExists(TEMPLATES_JSON_PATH)) {
    issues.push({
      severity: 'error',
      message: 'templates.json does not exist',
    })
  }

  if (!fileExists(TEMPLATES_MD_PATH)) {
    issues.push({
      severity: 'error',
      message: 'TEMPLATES.md does not exist',
    })
  }

  return issues
}

// Validate templates.json structure
const validateTemplatesJson = (): ValidationIssue[] => {
  const issues: ValidationIssue[] = []

  const jsonResult = readJsonFile<TemplateGroup[]>(TEMPLATES_JSON_PATH)
  if (!jsonResult.ok) {
    issues.push({
      severity: 'error',
      message: `Failed to parse templates.json: ${jsonResult.error}`,
    })
    return issues
  }

  const groups = jsonResult.value

  if (!Array.isArray(groups)) {
    issues.push({
      severity: 'error',
      message: 'templates.json must be an array',
    })
    return issues
  }

  if (groups.length === 0) {
    issues.push({
      severity: 'warning',
      message: 'templates.json contains no groups',
    })
  }

  // Validate each group
  groups.forEach((group, groupIndex) => {
    if (!group.name) {
      issues.push({
        severity: 'error',
        message: `Group at index ${groupIndex} is missing name`,
      })
    }

    if (!group.description) {
      issues.push({
        severity: 'error',
        message: `Group "${group.name}" is missing description`,
      })
    }

    if (!group.path) {
      issues.push({
        severity: 'error',
        message: `Group "${group.name}" is missing path`,
      })
    }

    if (!Array.isArray(group.templates)) {
      issues.push({
        severity: 'error',
        message: `Group "${group.name}" templates is not an array`,
      })
      return
    }

    // Validate each template in the group
    group.templates.forEach((template, templateIndex) => {
      const templateId = template.name || `index ${templateIndex}`

      if (!template.name) {
        issues.push({
          severity: 'error',
          message: `Template at ${group.name}[${templateIndex}] is missing name`,
        })
      }

      if (!template.description) {
        issues.push({
          severity: 'error',
          message: `Template "${templateId}" is missing description`,
        })
      }

      if (!template.id) {
        issues.push({
          severity: 'error',
          message: `Template "${templateId}" is missing id`,
        })
      } else if (!template.id.startsWith(GIGET_PREFIX)) {
        issues.push({
          severity: 'error',
          message: `Template "${templateId}" id must start with "${GIGET_PREFIX}"`,
        })
      }

      if (!template.path) {
        issues.push({
          severity: 'error',
          message: `Template "${templateId}" is missing path`,
        })
      }

      if (!Array.isArray(template.keywords)) {
        issues.push({
          severity: 'error',
          message: `Template "${templateId}" keywords must be an array`,
        })
      } else if (template.keywords.length === 0) {
        issues.push({
          severity: 'warning',
          message: `Template "${templateId}" has no keywords`,
        })
      }
    })
  })

  return issues
}

// Check for duplicate template IDs
const checkDuplicateIds = (): ValidationIssue[] => {
  const issues: ValidationIssue[] = []

  const jsonResult = readJsonFile<TemplateGroup[]>(TEMPLATES_JSON_PATH)
  if (!jsonResult.ok) return issues

  const groups = jsonResult.value
  const idMap = new Map<string, string[]>()

  groups.forEach((group) => {
    group.templates.forEach((template) => {
      const existing = idMap.get(template.id) || []
      idMap.set(template.id, [...existing, template.name])
    })
  })

  Array.from(idMap.entries())
    .filter(([, names]) => names.length > 1)
    .forEach(([id, names]) => {
      issues.push({
        severity: 'error',
        message: `Duplicate template ID "${id}" found in: ${names.join(', ')}`,
      })
    })

  return issues
}

// Main validation pipeline
const validate = (): Result<void> => {
  const allIssues: ValidationIssue[] = [...checkFilesExist(), ...validateTemplatesJson(), ...checkDuplicateIds()]

  const errors = allIssues.filter((issue) => issue.severity === 'error')
  const warnings = allIssues.filter((issue) => issue.severity === 'warning')

  if (warnings.length > 0) {
    console.log('\nWarnings:')
    warnings.forEach((warning) => {
      console.log(`  - ${warning.message}`)
    })
  }

  if (errors.length > 0) {
    console.log('\nErrors:')
    errors.forEach((error) => {
      console.log(`  - ${error.message}`)
    })
    return err(`Found ${errors.length} error(s)`)
  }

  return ok(undefined)
}

const main = () => {
  console.log('Validating generated files...')

  const result = validate()

  if (!result.ok) {
    console.error(`\nValidation failed: ${result.error}`)
    process.exit(1)
  }

  console.log('\nValidation passed')
}

main()
