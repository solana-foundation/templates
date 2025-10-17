#!/usr/bin/env tsx
/**
 * Clean generated files
 *
 * Removes templates.json and TEMPLATES.md
 *
 * Usage: tsx scripts/clean.ts
 */

import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { deleteFile } from './shared/fs-utils.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = join(__dirname, '..')

const GENERATED_FILES = ['templates.json', 'TEMPLATES.md']

const main = () => {
  console.log('Cleaning generated files...')

  const results = GENERATED_FILES.map((file) => {
    const path = join(ROOT_DIR, file)
    const result = deleteFile(path)

    if (!result.ok) {
      console.error(`Failed to delete ${file}: ${result.error}`)
      return false
    }

    if (result.value) {
      console.log(`Deleted ${file}`)
    } else {
      console.log(`${file} not found`)
    }

    return true
  })

  const allSuccess = results.every((success) => success)

  if (!allSuccess) {
    process.exit(1)
  }

  console.log('Clean complete')
}

main()
