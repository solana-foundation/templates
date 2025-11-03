import { Connection, PublicKey } from '@solana/web3.js'

function normalizeInput(input: string): string {
  return input.trim().toLowerCase()
}

export async function resolveAddressOrDomain(input: string, connection: Connection): Promise<PublicKey> {
  const raw = input.trim()
  const normalized = normalizeInput(raw)

  // 1) Try raw base58 address
  try {
    return new PublicKey(raw)
  } catch {}

  if (!normalized.includes('.')) {
    throw new Error('Invalid address or domain')
  }

  // 2) Try AllDomains (arbitrary TLDs like .superteam)
  try {
    const { TldParser } = await import('@onsol/tldparser')
    const parser = new TldParser(connection)
    const owner = await parser.getOwnerFromDomainTld(normalized)
    if (owner) {
      const ownerStr = typeof owner === 'string' ? owner : ((owner as PublicKey).toBase58?.() ?? String(owner))
      return new PublicKey(ownerStr)
    }
  } catch {}

  // 3) Fallback to Bonfida SNS (.sol + SOL record)
  try {
    const sns: any = await import('@bonfida/spl-name-service')

    // Prefer SOL record (if set)
    try {
      const solRecord = await sns.getRecordV2(connection, normalized, sns.Record.SOL)
      const recordStr = typeof solRecord === 'string' ? solRecord : (solRecord?.data ?? solRecord?.value)
      if (recordStr) {
        return new PublicKey(recordStr)
      }
    } catch {}

    // Generic domain key
    let pubkey: PublicKey | undefined
    if (typeof sns.getDomainKeyFromDomain === 'function') {
      const res = await sns.getDomainKeyFromDomain(normalized)
      pubkey = res?.pubkey
    }

    // Classic .sol fallback
    if (!pubkey && normalized.endsWith('.sol') && typeof sns.getDomainKey === 'function') {
      const nameOnly = normalized.replace(/\.sol$/i, '')
      const res = await sns.getDomainKey(nameOnly)
      pubkey = res?.pubkey
    }

    if (!pubkey) {
      throw new Error('Failed to resolve domain')
    }

    const registry = await sns.NameRegistryState.retrieve(connection, pubkey)
    const owner = registry?.owner ?? registry?.registry?.owner
    if (!owner) {
      throw new Error('Failed to resolve domain owner')
    }
    const ownerStr = typeof owner === 'string' ? owner : new PublicKey(owner).toBase58()
    return new PublicKey(ownerStr)
  } catch (e) {
    throw new Error('Failed to resolve domain')
  }
}
