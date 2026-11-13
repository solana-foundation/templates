/**
 * Locate and read health reports. The latest `health-reports/*.json` is the default
 * input; `--report <file>` overrides it and `--baseline <file>` marks regressions using
 * the same diff the health check itself prints.
 */

import { existsSync, readdirSync } from 'fs'
import { join } from 'path'
import { diffReports } from '../health/report.js'
import type { HealthReport } from '../health/types.js'
import { readJsonFile } from '../shared/fs-utils.js'
import { err, ok, type Result } from '../shared/result.js'

const STAMP_RE = /^(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})\.json$/

/** The newest timestamped report JSON in a directory, or null when there is none. */
export const latestReportPath = (dir: string): string | null => {
  if (!existsSync(dir)) return null
  const stamps = readdirSync(dir)
    .map((file) => file.match(STAMP_RE)?.[1])
    .filter((stamp): stamp is string => Boolean(stamp))
    .sort()
  const newest = stamps.at(-1)
  return newest ? join(dir, `${newest}.json`) : null
}

export const loadHealthReport = (path: string): Result<HealthReport> => {
  if (!existsSync(path)) return err(`health report not found: ${path}`)
  const parsed = readJsonFile<HealthReport>(path)
  if (!parsed.ok) return err(`could not parse ${path}: ${parsed.error}`)
  if (parsed.value.schemaVersion !== 1 || !Array.isArray(parsed.value.templates))
    return err(`${path} is not a schemaVersion 1 health report`)
  return ok(parsed.value)
}

/** Template ids that went pass/warn (or skip) to fail between baseline and current. */
export const regressionIds = (current: HealthReport, baseline: HealthReport | null): Set<string> =>
  new Set(baseline ? diffReports(current, baseline).regressions : [])
