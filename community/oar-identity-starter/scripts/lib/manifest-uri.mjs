// Manifest URI policy for `oar:prepare`. Mirrors `checkManifestUri` in @open-app-registry/sdk, which SDK
// releases up to 0.1.1-rc.2 do not export; prepare-oar.mjs prefers the SDK's version when it exists.
const MAX_URI_LEN = 256
const COMMIT_SHA = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/

function forgeRef(u) {
  const parts = u.pathname
    .split('/')
    .filter(Boolean)
    .map((p) => {
      try {
        return decodeURIComponent(p)
      } catch {
        return p
      }
    })
  if (u.hostname === 'raw.githubusercontent.com') return parts[2] ?? ''
  if (u.hostname === 'github.com' || u.hostname === 'www.github.com')
    return ['raw', 'blob'].includes(parts[2]) ? (parts[3] ?? '') : ''
  if (u.hostname === 'gitlab.com') {
    const i = parts.indexOf('-')
    return i >= 0 && ['raw', 'blob'].includes(parts[i + 1]) ? (parts[i + 2] ?? '') : undefined
  }
  if (u.hostname === 'cdn.jsdelivr.net' && parts[0] === 'gh') {
    const at = (parts[2] ?? '').indexOf('@')
    return at >= 0 ? parts[2].slice(at + 1) : ''
  }
  return undefined
}

/** @returns {{ ok: true } | { ok: false, detail: string }} */
export function checkManifestUri(uri) {
  if (new TextEncoder().encode(uri).length > MAX_URI_LEN)
    return { ok: false, detail: `manifest URI is longer than ${MAX_URI_LEN} bytes` }
  if (uri.startsWith('ar://') || uri.startsWith('ipfs://')) {
    return uri.length > (uri.startsWith('ar://') ? 5 : 7)
      ? { ok: true }
      : { ok: false, detail: 'manifest URI has no content identifier' }
  }
  if (!uri.startsWith('https://'))
    return { ok: false, detail: `unsupported manifest URI scheme (use https://, ar:// or ipfs://): ${uri}` }
  let u
  try {
    u = new URL(uri)
  } catch {
    return { ok: false, detail: `not a valid URL: ${uri}` }
  }
  if (u.username || u.password) return { ok: false, detail: 'manifest URI must not embed credentials' }
  const file = u.pathname.split('/').filter(Boolean).pop() ?? ''
  if (file.toLowerCase() === 'oar.json') {
    return {
      ok: false,
      detail:
        '`oar.json` is reserved for domain and repository proofs; host the manifest as a separate file such as oar-manifest.json',
    }
  }
  const ref = forgeRef(u)
  if (ref !== undefined && !COMMIT_SHA.test(ref)) {
    return {
      ok: false,
      detail: `${uri} ${ref ? `follows the mutable reference "${ref}"` : 'does not name a commit'}; pin the manifest to a full commit SHA (or use ar:// or ipfs://)`,
    }
  }
  return { ok: true }
}
