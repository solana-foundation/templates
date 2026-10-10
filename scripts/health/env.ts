/**
 * Environment handling for child processes, kept pure so it can be unit-tested.
 *
 * Children (installs, builds, dev servers) get an ALLOWLIST over the parent env, never a
 * spread of all of it, so a developer's exported API keys or wallet secrets never reach a
 * template's scripts by accident. Credentials a template genuinely needs are passed in
 * deliberately (`--env-file`, `--allow-env`), only to templates that declare them, and are
 * redacted from everything that ends up in a report.
 */

import type { TemplateRef } from './types.js'

/** Exact env var names forwarded to child processes. */
export const ENV_ALLOWLIST: readonly string[] = [
  'PATH',
  'HOME',
  'TMPDIR',
  'TMP',
  'TEMP',
  'USER',
  'LOGNAME',
  'SHELL',
  'LANG',
  'TERM',
  'CI',
  'CARGO_HOME',
  'RUSTUP_HOME',
  'RUSTUP_TOOLCHAIN',
  'FORCE_COLOR',
  'NO_COLOR',
  'HTTP_PROXY',
  'HTTPS_PROXY',
  'NO_PROXY',
  'http_proxy',
  'https_proxy',
  'no_proxy',
  'SSL_CERT_FILE',
  'SSL_CERT_DIR',
]

/** Prefixes forwarded to child processes: locale, Node, and package-manager configuration. */
export const ENV_ALLOWLIST_PREFIXES: readonly string[] = [
  'LC_',
  'NODE_',
  'npm_config_',
  'NPM_CONFIG_',
  'PNPM_',
  'YARN_',
  'COREPACK_',
  'XDG_',
]

/** The allowlisted subset of `source` (defaults to this process's env). */
export const sanitizedEnv = (source: NodeJS.ProcessEnv = process.env): Record<string, string> => {
  const env: Record<string, string> = {}
  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) continue
    if (ENV_ALLOWLIST.includes(key) || ENV_ALLOWLIST_PREFIXES.some((prefix) => key.startsWith(prefix))) {
      env[key] = value
    }
  }
  return env
}

/**
 * Tiny dotenv parser for `--env-file`: `KEY=value` lines, optional `export`, `#` comments,
 * single/double quoted values (double quotes unescape `\n`). No interpolation, no dependency.
 */
export const parseDotenv = (text: string): Record<string, string> => {
  const env: Record<string, string> = {}
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (line === '' || line.startsWith('#')) continue
    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (!match) continue
    const [, key, rawValue] = match
    let value = rawValue.trim()
    const quote = value[0]
    if ((quote === '"' || quote === "'") && value.length >= 2 && value.endsWith(quote)) {
      value = value.slice(1, -1)
      if (quote === '"') value = value.replace(/\\n/g, '\n')
    } else {
      value = value.replace(/\s+#.*$/, '').trim()
    }
    env[key] = value
  }
  return env
}

/**
 * The forwarded credentials a given template may receive: only the keys it declares in
 * `credentialKeys`. A template whose need for secrets was detected from prose (no key
 * names) gets every forwarded key; a template that needs no secrets gets none.
 */
export const credentialsForTemplate = (
  ref: Pick<TemplateRef, 'needsSecrets' | 'credentialKeys'>,
  forwarded: Readonly<Record<string, string>>,
): Record<string, string> => {
  if (!ref.needsSecrets) return {}
  if (ref.credentialKeys.length === 0) return { ...forwarded }
  const env: Record<string, string> = {}
  for (const key of ref.credentialKeys) {
    if (forwarded[key] !== undefined) env[key] = forwarded[key]
  }
  return env
}

/** Replace every occurrence of a forwarded value in text with `***`. */
export const redactSecrets = (text: string, values: readonly string[]): string => {
  let out = text
  // Longest first, so a value that contains another is masked whole.
  for (const value of [...new Set(values.filter((value) => value.length > 0))].sort((a, b) => b.length - a.length)) {
    out = out.split(value).join('***')
  }
  return out
}

/** Deep-redact every string in a result object (tails, notes, commands, ...). */
export const redactDeep = <T>(value: T, values: readonly string[]): T => {
  if (values.length === 0) return value
  if (typeof value === 'string') return redactSecrets(value, values) as T
  if (Array.isArray(value)) return value.map((item) => redactDeep(item, values)) as T
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) out[key] = redactDeep(item, values)
    return out as T
  }
  return value
}
