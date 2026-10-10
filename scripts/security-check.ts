import { mkdirSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { readSecurityBaseline } from './security/baseline.js'
import { createSecurityReport, renderSecurityReport } from './security/report.js'
import { scanRepository } from './security/scanner.js'

const options = readOptions(process.argv.slice(2))
const outputDir = resolve(options.outputDir)
const baseline = readSecurityBaseline(resolve(options.baselinePath))
const report = createSecurityReport(scanRepository(process.cwd()), baseline)
const markdown = renderSecurityReport(report)

mkdirSync(outputDir, { recursive: true })
writeFileSync(resolve(outputDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
writeFileSync(resolve(outputDir, 'report.md'), markdown)

console.log(markdown)
console.log(`Reports written to ${outputDir}`)

type CliOptions = { readonly baselinePath: string; readonly outputDir: string }

function readOptions(args: readonly string[]): CliOptions {
  let baselinePath = '.github/template-security-baseline.json'
  let outputDir = 'security-reports'

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === '--') continue
    if (argument === '--help') {
      console.log('Usage: pnpm security:check -- [--baseline <file>] [--output-dir <directory>]')
      process.exit(0)
    }
    if (argument === '--baseline' || argument === '--output-dir') {
      const value = args[index + 1]
      if (!value || value.startsWith('--')) throw new Error(`${argument} requires a value`)
      if (argument === '--baseline') baselinePath = value
      else outputDir = value
      index += 1
      continue
    }
    throw new Error(`Unknown argument: ${argument}`)
  }

  return { baselinePath, outputDir }
}
