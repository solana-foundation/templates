/**
 * Image generation utilities
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { ImageResponse } from '@vercel/og'
import sharp from 'sharp'
import puppeteer from 'puppeteer'
import { Result, ok, err, tryCatch } from './result.js'
import React from 'react'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = join(__dirname, '..', '..')
const LOGO_PATH = join(ROOT_DIR, 'assets', 'solana-logo.svg')

export const IMAGE_WIDTH = 1200
export const IMAGE_HEIGHT = 630
export const MAX_FILE_SIZE = 500 * 1024 // 500KB

/**
 * Read SVG or PNG logo and convert to data URI
 * @param logoPath - Path to the SVG or PNG file (defaults to Solana logo)
 */
export const readLogoDataUri = (logoPath: string = LOGO_PATH): Result<string> => {
  return tryCatch(() => {
    const isPng = logoPath.toLowerCase().endsWith('.png')

    if (isPng) {
      // Read PNG as binary buffer
      const buffer = readFileSync(logoPath)
      const base64 = buffer.toString('base64')
      return `data:image/png;base64,${base64}`
    } else {
      // Read SVG as UTF-8
      const svg = readFileSync(logoPath, 'utf-8')

      // Validate it's an SVG file (with or without XML declaration)
      const trimmed = svg.trim()
      if (!trimmed.startsWith('<svg') && !trimmed.startsWith('<?xml')) {
        throw new Error('File is not a valid SVG')
      }

      const base64 = Buffer.from(svg).toString('base64')
      return `data:image/svg+xml;base64,${base64}`
    }
  })
}

/**
 * Capture screenshot of a website
 * @param url - Website URL to capture
 * @returns Buffer of the screenshot sized for OG image (1200x630)
 */
export const captureScreenshot = async (url: string): Promise<Result<Buffer>> => {
  let browser
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()

    // Set viewport to match OG image dimensions
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 2,
    })

    // Navigate to URL with timeout
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    })

    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'png',
      encoding: 'binary',
    })

    await browser.close()

    // Resize to exactly OG image dimensions
    const processed = await sharp(screenshot as Buffer)
      .resize(IMAGE_WIDTH, IMAGE_HEIGHT, {
        fit: 'cover',
        position: 'center',
      })
      .png()
      .toBuffer()

    return ok(processed)
  } catch (error) {
    if (browser) {
      await browser.close()
    }
    return err(error instanceof Error ? error.message : String(error))
  }
}

/**
 * Generate OG image with Solana logo and custom text/logo, or full screenshot
 * @param text - Text to display on the right side (ignored if customLogoPath or screenshotUrl is provided)
 * @param customLogoPath - Optional path to custom SVG or PNG logo to display on right side (with Solana logo + plus)
 * @param screenshotUrl - Optional URL to capture full-size screenshot from (replaces entire image)
 */
export const generateOgImage = async (
  text: string,
  customLogoPath?: string,
  screenshotUrl?: string,
): Promise<Result<ArrayBuffer>> => {
  // If screenshot URL provided, use it as the full image
  if (screenshotUrl) {
    const screenshotResult = await captureScreenshot(screenshotUrl)
    if (!screenshotResult.ok) {
      return err(`Failed to capture screenshot: ${screenshotResult.error}`)
    }
    // Return the screenshot buffer directly as ArrayBuffer
    return ok(
      screenshotResult.value.buffer.slice(
        screenshotResult.value.byteOffset,
        screenshotResult.value.byteOffset + screenshotResult.value.byteLength,
      ),
    )
  }

  // Otherwise, generate logo + text/custom logo image
  const logoResult = readLogoDataUri()
  if (!logoResult.ok) {
    return err(`Failed to read Solana logo: ${logoResult.error}`)
  }

  const solanaLogoDataUri = logoResult.value

  // If custom logo provided, read it
  let customLogoDataUri: string | undefined
  if (customLogoPath) {
    const customLogoResult = readLogoDataUri(customLogoPath)
    if (!customLogoResult.ok) {
      return err(`Failed to read custom logo: ${customLogoResult.error}`)
    }
    customLogoDataUri = customLogoResult.value
  }

  try {
    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '60px',
            }}
          >
            <img src={solanaLogoDataUri} width={200} height={175} alt="Solana" />

            <div
              style={{
                fontSize: '120px',
                fontWeight: 'bold',
                color: '#fff',
              }}
            >
              +
            </div>

            {customLogoDataUri ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '300px',
                  height: '300px',
                }}
              >
                <img
                  src={customLogoDataUri}
                  style={{
                    maxWidth: '300px',
                    maxHeight: '300px',
                    objectFit: 'contain',
                  }}
                  alt="Custom Logo"
                />
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: '600px',
                }}
              >
                <div
                  style={{
                    fontSize: '84px',
                    fontWeight: 'bold',
                    color: '#fff',
                    lineHeight: 1.2,
                  }}
                >
                  {text}
                </div>
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
      },
    )

    const buffer = await imageResponse.arrayBuffer()
    return ok(buffer)
  } catch (error) {
    return err(error instanceof Error ? error.message : String(error))
  }
}

/**
 * Convert image buffer to optimized PNG
 */
export const optimizeImage = async (buffer: ArrayBuffer): Promise<Result<Buffer>> => {
  try {
    const optimized = await sharp(Buffer.from(buffer)).png({ quality: 90, compressionLevel: 9 }).toBuffer()

    return ok(optimized)
  } catch (error) {
    return err(error instanceof Error ? error.message : String(error))
  }
}

/**
 * Validate image dimensions and size
 */
export const validateImage = async (imagePath: string): Promise<Result<void>> => {
  try {
    const metadata = await sharp(imagePath).metadata()

    if (metadata.width !== IMAGE_WIDTH || metadata.height !== IMAGE_HEIGHT) {
      return err(`Image dimensions are ${metadata.width}×${metadata.height}, must be ${IMAGE_WIDTH}×${IMAGE_HEIGHT}`)
    }

    const stats = await import('fs/promises').then((fs) => fs.stat(imagePath))
    if (stats.size > MAX_FILE_SIZE) {
      return err(
        `Image size is ${Math.round(stats.size / 1024)}KB, must be less than ${Math.round(MAX_FILE_SIZE / 1024)}KB`,
      )
    }

    return ok(undefined)
  } catch (error) {
    return err(error instanceof Error ? error.message : String(error))
  }
}
