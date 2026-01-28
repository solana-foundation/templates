#!/usr/bin/env node

if (process.env.CI || process.env.PNPM_SCRIPT_SRC_DIR) {
  process.exit(0)
}

const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { execSync } = require('child_process')

// Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  dim: '\x1b[2m',
}

// ASCII Art Logo
const logo = `
${colors.cyan}${colors.bright}
              ░████     ░████    ░██████                                  ░██
             ░██ ██    ░██ ░██  ░██   ░██                                 ░██
░██    ░██  ░██  ██   ░██ ░████       ░██            ░███████   ░███████  ░██           ░██░████  ░███████
 ░██  ░██  ░██   ██   ░██░██░██   ░█████   ░██████  ░██        ░██    ░██ ░██  ░██████  ░███     ░██
  ░█████   ░█████████ ░████ ░██  ░██                 ░███████  ░██    ░██ ░██           ░██       ░███████
 ░██  ░██       ░██    ░██ ░██  ░██                        ░██ ░██    ░██ ░██           ░██             ░██
░██    ░██      ░██     ░████   ░████████            ░███████   ░███████  ░██           ░██       ░███████
${colors.reset}
${colors.dim}                           Solana x402 Payment Protocol - Rust Template${colors.reset}
`

// Get project name from parent directory, or fallback
const currentDir = path.basename(process.cwd())
var projectName

if (currentDir && currentDir !== '.' && currentDir !== '..') {
  projectName = currentDir
} else {
  projectName = 'x402-solana-backend'
}

// Use current directory instead of creating subdirectory
const targetDir = process.cwd()

// Only check for conflicts if we're NOT running from the template directory itself
// (i.e., if create.js is in a different location than the target directory)
const templateDir = __dirname
const isInTemplateDir = path.resolve(templateDir) === path.resolve(targetDir)

if (!isInTemplateDir) {
  // Check for conflicting files that would be overwritten
  const conflictingFiles = ['Cargo.toml', 'src', 'frontend', '.env']
  const conflicts = conflictingFiles.filter((file) => fs.existsSync(path.join(targetDir, file)))

  if (conflicts.length > 0) {
    console.error(
      `${colors.red}[ERROR]${colors.reset} The following files/directories already exist and would be overwritten:\n`,
    )
    conflicts.forEach((file) => console.error(`  - ${file}`))
    console.error(`\nPlease remove them or run this in a clean directory.\n`)
    process.exit(1)
  }
}

console.log(logo)
console.log(
  `${colors.bright}${colors.blue}┌─────────────────────────────────────────────────────────────────────────────┐${colors.reset}`,
)
console.log(
  `${colors.bright}${colors.blue}│${colors.reset}  ${colors.bright}Framework Selection${colors.reset}                                                    ${colors.bright}${colors.blue}    │${colors.reset}`,
)
console.log(
  `${colors.bright}${colors.blue}└─────────────────────────────────────────────────────────────────────────────┘${colors.reset}\n`,
)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const frameworkPrompt = `${colors.bright}Choose your framework:${colors.reset}

  ${colors.green}1)${colors.reset} ${colors.bright}Axum${colors.reset}   ${colors.dim}(recommended - modern, ergonomic)${colors.reset}
  ${colors.yellow}2)${colors.reset} ${colors.bright}Actix${colors.reset}  ${colors.dim}(high performance)${colors.reset}
  ${colors.magenta}3)${colors.reset} ${colors.bright}Rocket${colors.reset} ${colors.dim}(easy to use)${colors.reset}

${colors.bright}${colors.cyan}→${colors.reset} Selection ${colors.dim}(1-3)${colors.reset}: `

let timeoutId = null
let intervalId = null
let answered = false
let timeRemaining = 15

const setupProject = (answer) => {
  if (answered) return
  answered = true

  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  if (intervalId) {
    clearInterval(intervalId)
  }

  const frameworks = {
    1: 'axum',
    2: 'actix',
    3: 'rocket',
  }

  const framework = frameworks[answer.trim()] || 'axum'

  console.log(
    `\n${colors.bright}${colors.cyan}>>${colors.reset} Setting up with ${colors.bright}${framework}${colors.reset}...\n`,
  )

  try {
    const templateDir = __dirname
    const frameworkDir = path.join(templateDir, 'frameworks', framework)
    const srcDir = path.join(frameworkDir, 'src')

    // Create src directory and copy framework-specific files
    const targetSrcDir = path.join(targetDir, 'src')
    fs.mkdirSync(targetSrcDir, { recursive: true })
    fs.cpSync(srcDir, targetSrcDir, { recursive: true })

    // Copy shared files into src/shared
    const sharedDir = path.join(templateDir, 'shared')
    const targetSharedDir = path.join(targetSrcDir, 'shared')
    fs.mkdirSync(targetSharedDir, { recursive: true })
    fs.cpSync(sharedDir, targetSharedDir, { recursive: true })

    // Copy facilitator files into src/facilitator
    const facilitatorDir = path.join(templateDir, 'facilitator')
    const targetFacilitatorDir = path.join(targetSrcDir, 'facilitator')
    fs.mkdirSync(targetFacilitatorDir, { recursive: true })
    fs.cpSync(facilitatorDir, targetFacilitatorDir, { recursive: true })

    // Generate Cargo.toml from template + framework part
    const cargoTemplate = fs.readFileSync(path.join(templateDir, 'Cargo.toml.template'), 'utf8')
    const cargoPart = fs.readFileSync(path.join(frameworkDir, 'Cargo.toml.part'), 'utf8')

    const cargoToml = cargoTemplate.replace('{{FRAMEWORK_DEPS}}', cargoPart).replace(/{{name}}/g, projectName)

    fs.writeFileSync(path.join(targetDir, 'Cargo.toml'), cargoToml)

    // Copy framework-specific README with project name
    const frameworkReadme = path.join(frameworkDir, 'README.md')
    if (fs.existsSync(frameworkReadme)) {
      const readmeContent = fs.readFileSync(frameworkReadme, 'utf8')
      const customizedReadme = readmeContent.replace(/\{\{name\}\}/g, projectName)
      fs.writeFileSync(path.join(targetDir, 'README.md'), customizedReadme)
    }

    // Copy other root files
    const rootFiles = ['.env.example', '.gitignore', 'LICENSE']
    rootFiles.forEach((file) => {
      const srcFile = path.join(templateDir, file)
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, path.join(targetDir, file))
      }
    })

    // Setup frontend
    console.log(`${colors.bright}${colors.cyan}>>${colors.reset} Setting up frontend...`)
    const frontendSrcDir = path.join(templateDir, 'frontend')
    const frontendTargetDir = path.join(targetDir, 'frontend')

    if (fs.existsSync(frontendSrcDir)) {
      // Only copy if source and destination are different
      if (path.resolve(frontendSrcDir) !== path.resolve(frontendTargetDir)) {
        fs.cpSync(frontendSrcDir, frontendTargetDir, { recursive: true })
      }

      try {
        console.log(`${colors.dim}   Installing dependencies...${colors.reset}`)
        execSync('npm install', {
          cwd: frontendTargetDir,
          stdio: 'inherit',
        })

        // Copy .env.example to .env if it doesn't exist
        const frontendEnvExample = path.join(frontendTargetDir, '.env.example')
        const frontendEnv = path.join(frontendTargetDir, '.env')

        if (fs.existsSync(frontendEnvExample) && !fs.existsSync(frontendEnv)) {
          fs.copyFileSync(frontendEnvExample, frontendEnv)
          console.log(`${colors.green}   [OK]${colors.reset} Created frontend/.env from .env.example`)
        }

        console.log(`${colors.green}   [OK]${colors.reset} Frontend setup complete!\n`)
      } catch (error) {
        console.warn(
          `\n${colors.yellow}[WARN]${colors.reset} ${colors.bright}Warning:${colors.reset} Frontend setup failed: ${error.message}`,
        )
        console.warn(`${colors.dim}        You can manually set it up later by running:${colors.reset}`)
        console.warn(
          `${colors.dim}        cd ${projectName}/frontend && npm install && cp .env.example .env${colors.reset}\n`,
        )
      }
    }

    // Success message
    console.log(
      `\n${colors.bright}${colors.green}[SUCCESS]${colors.reset} ${colors.bright}Setup Complete!${colors.reset} Your ${colors.bright}${colors.cyan}${framework}${colors.reset} x402 server is ready.\n`,
    )

    console.log(
      `${colors.bright}${colors.blue}┌─────────────────────────────────────────────────────────────────────────────┐${colors.reset}`,
    )
    console.log(
      `${colors.bright}${colors.blue}│${colors.reset}  ${colors.bright}Backend Setup${colors.reset}                                                          ${colors.bright}${colors.blue}    │${colors.reset}`,
    )
    console.log(
      `${colors.bright}${colors.blue}└─────────────────────────────────────────────────────────────────────────────┘${colors.reset}\n`,
    )

    console.log(`  ${colors.cyan}1.${colors.reset} ${colors.dim}Configure environment${colors.reset}`)
    console.log(`     ${colors.dim}$${colors.reset} cd ${projectName}`)
    console.log(`     ${colors.dim}$${colors.reset} cp .env.example .env`)
    console.log(
      `     ${colors.dim}$${colors.reset} ${colors.dim}# Edit .env and add your Solana receiver wallet address${colors.reset}\n`,
    )

    console.log(`  ${colors.cyan}2.${colors.reset} ${colors.dim}Start the server${colors.reset}`)
    console.log(`     ${colors.dim}$${colors.reset} cargo run\n`)

    console.log(
      `     ${colors.green}>>${colors.reset} Server will start on ${colors.bright}${colors.cyan}http://localhost:3000${colors.reset}\n`,
    )

    console.log(
      `${colors.bright}${colors.blue}┌─────────────────────────────────────────────────────────────────────────────┐${colors.reset}`,
    )
    console.log(
      `${colors.bright}${colors.blue}│${colors.reset}  ${colors.bright}Frontend Setup${colors.reset} ${colors.dim}(Dependencies Already Installed)${colors.reset}                      ${colors.bright}${colors.blue}      │${colors.reset}`,
    )
    console.log(
      `${colors.bright}${colors.blue}└─────────────────────────────────────────────────────────────────────────────┘${colors.reset}\n`,
    )

    console.log(`  ${colors.cyan}1.${colors.reset} ${colors.dim}Generate a Solana keypair${colors.reset}`)
    console.log(`     ${colors.dim}$${colors.reset} solana-keygen new --no-bip39-passphrase --outfile keypair.json\n`)

    console.log(`  ${colors.cyan}2.${colors.reset} ${colors.dim}Configure frontend environment${colors.reset}`)
    console.log(`     ${colors.dim}$${colors.reset} ${colors.dim}# Edit ${projectName}/frontend/.env${colors.reset}`)
    console.log(`     ${colors.dim}# Copy the JSON array from keypair.json to VITE_SIGNER_KEYPAIR${colors.reset}\n`)

    console.log(`  ${colors.cyan}3.${colors.reset} ${colors.dim}Start the frontend${colors.reset}`)
    console.log(`     ${colors.dim}$${colors.reset} cd ${projectName}/frontend && npm run dev\n`)

    console.log(
      `     ${colors.green}>>${colors.reset} Frontend will start on ${colors.bright}${colors.cyan}http://localhost:5173${colors.reset}\n`,
    )

    console.log(`${colors.dim}  The frontend provides a web UI to test your APIs with Solana payments.${colors.reset}`)
    console.log(`${colors.dim}  Your wallet public key will be displayed automatically!${colors.reset}\n`)

    console.log(
      `${colors.bright}${colors.blue}─────────────────────────────────────────────────────────────────────────────${colors.reset}\n`,
    )
    console.log(
      `  ${colors.bright}Documentation:${colors.reset} ${colors.cyan}${projectName}/frontend/README.md${colors.reset}\n`,
    )

    // Clean up template scaffolding if running in-place
    if (path.resolve(templateDir) === path.resolve(targetDir)) {
      console.log(`${colors.dim}Cleaning up template files...${colors.reset}`)
      const filesToRemove = [
        'frameworks',
        'shared',
        'facilitator',
        'create.js',
        'package.json',
        'package-lock.json',
        'node_modules',
        'Cargo.toml.template',
        'og-image.png',
      ]

      filesToRemove.forEach((file) => {
        const filePath = path.join(targetDir, file)
        if (fs.existsSync(filePath)) {
          fs.rmSync(filePath, { recursive: true, force: true })
        }
      })
      console.log(`${colors.green}[OK]${colors.reset} Template files cleaned up\n`)
    }
  } catch (error) {
    console.error(`\n${colors.bright}${colors.red}[ERROR]${colors.reset} Error during setup: ${error.message}\n`)
    console.error(`${colors.yellow}[WARN]${colors.reset} Please manually clean up any partially created files.\n`)

    process.exit(1)
  }

  rl.close()
}

// Set up 15-second timeout
timeoutId = setTimeout(() => {
  if (!answered) {
    // Clear timer line
    process.stdout.write('\x1b[1A\x1b[2K')
    console.log(`${colors.dim}No selection made, defaulting to Axum...${colors.reset}\n`)
    rl.close()
    setupProject('1')
  }
}, 15000)

rl.question(frameworkPrompt, (answer) => {
  // Clear timer line on answer
  if (!answered) {
    process.stdout.write('\x1b[1A\x1b[2K\x1b[1A')
  }
  setupProject(answer)
})

// Display countdown timer on a new line after the prompt
console.log(`${colors.dim}[Auto-selecting Axum in ${timeRemaining}s]${colors.reset}`)

// Update timer every second
intervalId = setInterval(() => {
  timeRemaining--
  if (timeRemaining >= 0 && !answered) {
    // Move cursor up, clear line, print updated timer
    process.stdout.write(`\x1b[1A\x1b[2K${colors.dim}[Auto-selecting Axum in ${timeRemaining}s]${colors.reset}\n`)
  }
}, 1000)
