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

/**
 * Variable names that look like they hold a credential. Applied to prefix-allowlisted names
 * (NODE_AUTH_TOKEN, npm_config_//registry.npmjs.org/:_authToken, ...) so a prefix never
 * smuggles a token through, and to forwarded keys to decide what gets redacted.
 */
export const SENSITIVE_NAME_PATTERN =
  /(AUTH|TOKEN|SECRET|PASSWORD|PASSWD|_KEY$|API_?KEY|CREDENTIAL|PRIVATE_?KEY|(^|_)SK$)/i

/** Framework conventions for values that are shipped to browsers: the only forwarded values we leave readable in reports. */
export const PUBLIC_NAME_PATTERN = /^(NEXT_PUBLIC_|VITE_|PUBLIC_|EXPO_PUBLIC_|REACT_APP_|NUXT_PUBLIC_)/

/** Known registry/toolchain auth variables, excluded by name on top of the pattern. */
export const ENV_EXCLUDED: readonly string[] = [
  'NODE_AUTH_TOKEN',
  'NPM_TOKEN',
  'NPM_CONFIG__AUTH',
  'NPM_CONFIG__AUTHTOKEN',
  'NPM_CONFIG_USERCONFIG',
  'npm_config__auth',
  'npm_config__authToken',
  'npm_config_userconfig',
  'YARN_NPM_AUTH_TOKEN',
  'YARN_NPM_AUTH_IDENT',
  'YARN_NPM_REGISTRIES',
  'PNPM_NPM_AUTH_TOKEN',
  'COREPACK_NPM_TOKEN',
]

export const looksSecret = (name: string): boolean => ENV_EXCLUDED.includes(name) || SENSITIVE_NAME_PATTERN.test(name)

const allowedByName = (key: string): boolean =>
  ENV_ALLOWLIST.includes(key) || (ENV_ALLOWLIST_PREFIXES.some((prefix) => key.startsWith(prefix)) && !looksSecret(key))

/** The allowlisted subset of `source` (defaults to this process's env). */
export const sanitizedEnv = (source: NodeJS.ProcessEnv = process.env): Record<string, string> => {
  const env: Record<string, string> = {}
  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) continue
    if (allowedByName(key)) env[key] = value
  }
  return env
}

/**
 * Values of secret-looking variables in the parent env (NODE_AUTH_TOKEN, ...). They never
 * reach a child, but a tool could still print one it found elsewhere, so they join the
 * redaction set. Very short values are left alone: masking "1" would shred every report.
 */
export const parentSecretValues = (source: NodeJS.ProcessEnv = process.env): string[] =>
  Object.entries(source)
    .filter(([key, value]) => value !== undefined && value.length >= 8 && looksSecret(key))
    .map(([, value]) => value as string)

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
    const closing = quote === '"' || quote === "'" ? value.indexOf(quote, 1) : -1
    if (closing > 0) {
      // Quoted value: take what is inside the quotes and drop anything after the closing quote
      // (a trailing `# comment` is common and must not end up inside the credential).
      value = value.slice(1, closing)
      if (quote === '"') value = value.replace(/\\n/g, '\n')
    } else {
      value = value.replace(/\s+#.*$/, '').trim()
    }
    env[key] = value
  }
  return env
}

/**
 * The forwarded variables a given template may receive: only the keys it declares
 * (`declaredEnvKeys`, which covers public config like NEXT_PUBLIC_SUPABASE_URL as well as
 * `credentialKeys`). A template whose need for secrets was detected from prose and declares
 * nothing gets every forwarded key; a template that declares nothing and needs no secrets
 * gets none.
 */
export const credentialsForTemplate = (
  ref: Pick<TemplateRef, 'needsSecrets' | 'credentialKeys' | 'declaredEnvKeys'>,
  forwarded: Readonly<Record<string, string>>,
): Record<string, string> => {
  const declared = [...new Set([...ref.declaredEnvKeys, ...ref.credentialKeys])]
  if (declared.length === 0) return ref.needsSecrets ? { ...forwarded } : {}
  const env: Record<string, string> = {}
  for (const key of declared) {
    if (forwarded[key] !== undefined) env[key] = forwarded[key]
  }
  return env
}

/** Forwarded values that must never appear in a report: those under a secret-looking name. */
export const secretValues = (forwarded: Readonly<Record<string, string>>): string[] =>
  Object.entries(forwarded)
    // Conservative: every forwarded value is redacted unless its name follows a public-prefix
    // convention (NEXT_PUBLIC_, VITE_, ...) AND does not look like a secret. A template may name
    // its key anything (community/moneygram-onramp uses MONEYGRAM_SK), so names alone can't be trusted.
    .filter(([key]) => looksSecret(key) || !PUBLIC_NAME_PATTERN.test(key))
    .map(([, value]) => value)

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
