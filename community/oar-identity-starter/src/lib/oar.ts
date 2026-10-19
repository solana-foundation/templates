// Server-only Solana Kit adapter for the existing OAR resolver.
// The SDK checks both the canonical Program Metadata backlink and the app manifest.
import 'server-only'
import { address, createSolanaRpc } from '@solana/kit'
import { resolveProgram } from '@open-app-registry/sdk'

export const OAR_CLUSTER = 'solana:devnet' as const

/** Do not put API-key-bearing RPC URLs in NEXT_PUBLIC_ environment variables. */
function devnetRpcUrl(): string {
  const input = process.env.OAR_DEVNET_RPC_URL?.trim()
  if (!input && process.env.NODE_ENV === 'production') {
    throw new Error('Configure a dedicated OAR_DEVNET_RPC_URL on your server.')
  }
  const url = input ?? 'https://api.devnet.solana.com'
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error('Invalid Devnet RPC URL.')
  }
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.hash) {
    throw new Error('RPC must be an HTTPS URL without embedded credentials or fragments.')
  }
  return url
}

/**
 * What OAR can say about a deployed program. Only `verified` means both sides agree: the app's manifest claims the
 * program and the program's upgrade authority published a canonical backlink to that App ID.
 * - `unverified`: no matching proof was found. It does not mean the program is unsafe or inactive.
 * - `unavailable`: verification could not complete (RPC outage); retry. Never show this as a failure.
 * No state is a security audit or endorsement, and no global trust badge is issued.
 */
export type ProgramIdentity =
  | { state: 'verified'; appId: string; name: string; program: string; cluster: typeof OAR_CLUSTER }
  | { state: 'unverified'; program: string; cluster: typeof OAR_CLUSTER }
  | { state: 'unavailable'; program: string; cluster: typeof OAR_CLUSTER; detail: string }

export async function getProgramIdentity(programId: string): Promise<ProgramIdentity> {
  const program = address(programId)
  const rpc = createSolanaRpc(devnetRpcUrl())
  const result = await resolveProgram(rpc, program, {
    cluster: OAR_CLUSTER,
    trustedIssuers: [],
  })
  if (result && 'status' in result && result.status === 'unavailable') {
    // Written to compile against SDK releases before and after the typed `unavailable` result.
    const detail =
      'detail' in result && typeof result.detail === 'string' ? result.detail : 'OAR RPC read unavailable; retry'
    return { state: 'unavailable', program, cluster: OAR_CLUSTER, detail }
  }
  if (!result || !('app' in result) || result.link?.state !== 'verified' || !result.app.manifest.ok) {
    return { state: 'unverified', program, cluster: OAR_CLUSTER }
  }
  return {
    state: 'verified',
    appId: result.app.appId,
    name: result.app.manifest.manifest.name,
    program: result.program,
    cluster: OAR_CLUSTER,
  }
}
