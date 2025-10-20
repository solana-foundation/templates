#!/usr/bin/env tsx
/**
 * Generate OG image for a template
 *
 * Usage:
 *   pnpm create-image "Next.js + Tailwind" gill/gill-next-tailwind
 *   pnpm create-image "React + Vite + Anchor" community/my-template
 *   pnpm create-image "x402" community/my-template --logo ./assets/x402-logo.png
 */

import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { writeFile } from 'fs/promises'
import { generateOgImage, optimizeImage, validateImage } from './shared/image-utils.tsx'
import { fileExists } from './shared/fs-utils.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = join(__dirname, '..')

// Constants
const OG_IMAGE_FILENAME = 'og-image.png' as const

/**
 * Parse command line arguments
 */
const parseArgs = (): { text: string; templatePath: string; logoPath?: string; screenshotUrl?: string } | null => {
  const args = process.argv.slice(2)

  if (args.length < 2) {
    console.error('Error: Missing required arguments')
    console.error('')
    console.error('Usage:')
    console.error('  pnpm create-image <text> <template-path> [--logo <path>] [--screenshot <url>]')
    console.error('')
    console.error('Example:')
    console.error('  pnpm create-image "Next.js + Tailwind" gill/gill-next-tailwind')
    console.error('  pnpm create-image "React + Vite + Anchor" community/my-template')
    console.error('  pnpm create-image "Anchor" gill/gill-next-tailwind --logo ./assets/anchor-logo.svg')
    console.error('  pnpm create-image "x402" community/my-template --logo ./assets/x402-logo.png')
    console.error('  pnpm create-image "Next.js" gill/gill-next-tailwind --screenshot https://nextjs.org')
    return null
  }

  const [text, templatePath, ...rest] = args

  // Parse optional --logo flag
  let logoPath: string | undefined
  const logoIndex = rest.indexOf('--logo')
  if (logoIndex !== -1 && rest[logoIndex + 1]) {
    logoPath = rest[logoIndex + 1]
  }

  // Parse optional --screenshot flag
  let screenshotUrl: string | undefined
  const screenshotIndex = rest.indexOf('--screenshot')
  if (screenshotIndex !== -1 && rest[screenshotIndex + 1]) {
    screenshotUrl = rest[screenshotIndex + 1]
  }

  return { text, templatePath, logoPath, screenshotUrl }
}

/**
 * Main image generation
 */
const main = async () => {
  const args = parseArgs()
  if (!args) {
    process.exit(1)
  }

  const { text, templatePath, logoPath, screenshotUrl } = args
  const templateDir = join(ROOT_DIR, templatePath)
  const outputPath = join(templateDir, OG_IMAGE_FILENAME)

  console.log(`Generating OG image for: ${templatePath}`)

  if (screenshotUrl) {
    console.log(`Screenshot URL: "${screenshotUrl}"`)
  } else if (logoPath) {
    console.log(`Custom logo: "${logoPath}"`)
    const absoluteLogoPath = logoPath.startsWith('/') ? logoPath : join(ROOT_DIR, logoPath)
    if (!fileExists(absoluteLogoPath)) {
      console.error(`Error: Custom logo file does not exist: ${logoPath}`)
      process.exit(1)
    }
  } else {
    console.log(`Text: "${text}"`)
  }

  if (!fileExists(templateDir)) {
    console.error(`Error: Template directory does not exist: ${templatePath}`)
    process.exit(1)
  }

  console.log('Generating image...')
  const absoluteLogoPath = logoPath ? (logoPath.startsWith('/') ? logoPath : join(ROOT_DIR, logoPath)) : undefined
  const imageResult = await generateOgImage(text, absoluteLogoPath, screenshotUrl)
  if (!imageResult.ok) {
    console.error(`Error generating image: ${imageResult.error}`)
    process.exit(1)
  }

  console.log('Optimizing image...')
  const optimizedResult = await optimizeImage(imageResult.value)
  if (!optimizedResult.ok) {
    console.error(`Error optimizing image: ${optimizedResult.error}`)
    process.exit(1)
  }

  console.log(`Writing to: ${outputPath}`)
  try {
    await writeFile(outputPath, optimizedResult.value)
  } catch (error) {
    console.error(`Error writing file: ${error}`)
    process.exit(1)
  }

  console.log('Validating image...')
  const validationResult = await validateImage(outputPath)
  if (!validationResult.ok) {
    console.error(`Warning: ${validationResult.error}`)
  }

  console.log(`Successfully created: ${outputPath}`)
  console.log(`Image: 1200×630 pixels, ${Math.round(optimizedResult.value.length / 1024)}KB`)
}

main()
