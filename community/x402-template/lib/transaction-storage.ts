/**
 * Transaction Storage Utility
 *
 * Simple storage for verified transactions to prevent replay attacks.
 * In production, replace this with Redis, database, or a distributed cache.
 *
 * Current implementation uses in-memory storage with optional file-based persistence.
 */

import fs from 'fs/promises'
import path from 'path'

const STORAGE_FILE = path.join(process.cwd(), '.verified-transactions.json')
const MAX_AGE_MS = 24 * 60 * 60 * 1000 // 24 hours

interface TransactionRecord {
  signature: string
  timestamp: number
  metadata?: {
    from?: string
    to?: string
    amount?: string
  }
}

class TransactionStorage {
  private cache: Map<string, TransactionRecord> = new Map()
  private initialized = false

  async init() {
    if (this.initialized) return

    try {
      const data = await fs.readFile(STORAGE_FILE, 'utf-8')
      const records: TransactionRecord[] = JSON.parse(data)

      const now = Date.now()
      for (const record of records) {
        if (now - record.timestamp < MAX_AGE_MS) {
          this.cache.set(record.signature, record)
        }
      }
    } catch {
      // File doesn't exist or is invalid, start fresh
    }

    this.initialized = true
  }

  async has(signature: string): Promise<boolean> {
    await this.init()

    const record = this.cache.get(signature)
    if (!record) return false

    // Check if expired
    if (Date.now() - record.timestamp > MAX_AGE_MS) {
      this.cache.delete(signature)
      await this.persist()
      return false
    }

    return true
  }

  async add(signature: string, metadata?: TransactionRecord['metadata']): Promise<void> {
    await this.init()

    const record: TransactionRecord = {
      signature,
      timestamp: Date.now(),
      metadata,
    }

    this.cache.set(signature, record)
    await this.persist()
  }

  private async persist(): Promise<void> {
    try {
      const records = Array.from(this.cache.values())
      await fs.writeFile(STORAGE_FILE, JSON.stringify(records, null, 2), 'utf-8')
    } catch {
      // Failed to persist (non-critical)
    }
  }

  async cleanup(): Promise<void> {
    await this.init()

    const now = Date.now()
    let cleaned = 0

    for (const [signature, record] of this.cache.entries()) {
      if (now - record.timestamp > MAX_AGE_MS) {
        this.cache.delete(signature)
        cleaned++
      }
    }

    if (cleaned > 0) {
      await this.persist()
    }
  }

  getSize(): number {
    return this.cache.size
  }
}

const transactionStorage = new TransactionStorage()

if (typeof setInterval !== 'undefined') {
  setInterval(
    () => {
      transactionStorage.cleanup().catch(console.error)
    },
    60 * 60 * 1000,
  )
}

export default transactionStorage
