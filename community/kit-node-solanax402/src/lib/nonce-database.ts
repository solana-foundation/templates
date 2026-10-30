/**
 * Nonce Database Manager
 * Handles nonce storage and validation to prevent replay attacks
 */

import { DatabaseSync } from 'node:sqlite';
import { DatabaseError, NonceError } from '../errors/index.js';

export interface NonceData {
  nonce: string;
  clientPublicKey: string;
  amount: string;
  recipient: string;
  resourceId: string;
  resourceUrl: string;
  timestamp: number;
  expiry: number;
}

export interface NonceDetails extends NonceData {
  usedAt: number | null;
  transactionSignature: string | null;
  createdAt: string;
}

export interface TransactionData {
  nonce: string;
  transactionSignature: string | null;
  status: 'pending' | 'confirmed' | 'failed';
  errorMessage?: string | null;
}

export interface NonceStats {
  totalNonces: number;
  usedNonces: number;
  activeNonces: number;
  expiredNonces: number;
}

export interface NonceUsedStatus {
  used: boolean;
  data: {
    usedAt: number;
    transactionSignature: string | null;
  } | null;
}

/**
 * Nonce Database Manager
 */
export class NonceDatabase {
  private db: DatabaseSync | null = null;
  private dbPath: string;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
  }

  /**
   * Initialize the database and create tables
   */
  async initialize(): Promise<void> {
    try {
      this.db = new DatabaseSync(this.dbPath);
    } catch (err) {
      console.error('Error opening database:', err);
      throw new DatabaseError(`Failed to open database: ${getErrorMessage(err)}`);
    }

    await this.createTables();
    console.log('Nonce database initialized successfully');
    // Verify the table structure
    try {
      const columns = this.db.prepare('PRAGMA table_info(nonces)').all();
      console.log(
        'Table columns:',
        (columns as any[]).map((col) => col.name)
      );
    } catch (err) {
      console.error('Error checking table structure:', err);
    }
  }

  /**
   * Create necessary tables
   */
  private async createTables(): Promise<void> {
    const createNoncesTable = `
      CREATE TABLE IF NOT EXISTS nonces (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nonce TEXT UNIQUE NOT NULL,
        client_public_key TEXT NOT NULL,
        amount TEXT NOT NULL,
        recipient TEXT NOT NULL,
        resource_id TEXT NOT NULL,
        resource_url TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        expiry INTEGER NOT NULL,
        used_at INTEGER,
        transaction_signature TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createTransactionsTable = `
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nonce TEXT NOT NULL,
        transaction_signature TEXT UNIQUE,
        status TEXT NOT NULL DEFAULT 'pending',
        error_message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (nonce) REFERENCES nonces (nonce)
      )
    `;

    try {
      this.db!.exec(createNoncesTable);
    } catch (err) {
      throw new DatabaseError(`Failed to create nonces table: ${getErrorMessage(err)}`);
    }
    console.log('Created nonces table with resource_url column');

    try {
      this.db!.exec(createTransactionsTable);
    } catch (err) {
      throw new DatabaseError(`Failed to create transactions table: ${getErrorMessage(err)}`);
    }
    console.log('Created transactions table');
  }

  /**
   * Store a new nonce
   */
  async storeNonce(nonceData: NonceData): Promise<number> {
    const sql = `
      INSERT INTO nonces (
        nonce, client_public_key, amount, recipient, 
        resource_id, resource_url, timestamp, expiry
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const result = this.db!.prepare(sql).run(
        nonceData.nonce,
        nonceData.clientPublicKey,
        nonceData.amount,
        nonceData.recipient,
        nonceData.resourceId,
        nonceData.resourceUrl,
        nonceData.timestamp,
        nonceData.expiry
      );
      return Number(result.lastInsertRowid);
    } catch (err) {
      if (getErrorMessage(err).includes('UNIQUE constraint failed')) {
        throw new NonceError('Nonce already exists');
      }
      throw new DatabaseError(`Failed to store nonce: ${getErrorMessage(err)}`);
    }
  }

  /**
   * Check if a nonce has been used
   */
  async isNonceUsed(nonce: string): Promise<NonceUsedStatus> {
    const sql = `
      SELECT used_at, transaction_signature 
      FROM nonces 
      WHERE nonce = ?
    `;

    let row: any;
    try {
      row = this.db!.prepare(sql).get(nonce);
    } catch (err) {
      throw new DatabaseError(`Failed to check nonce: ${getErrorMessage(err)}`);
    }

    if (!row) {
      return { used: false, data: null };
    }

    return {
      used: row.used_at !== null,
      data: {
        usedAt: row.used_at,
        transactionSignature: row.transaction_signature,
      },
    };
  }

  /**
   * Mark a nonce as used
   */
  async markNonceUsed(nonce: string, transactionSignature: string | null): Promise<number> {
    const sql = `
      UPDATE nonces 
      SET used_at = ?, transaction_signature = ?
      WHERE nonce = ? AND used_at IS NULL
    `;

    let changes: number;
    try {
      changes = Number(this.db!.prepare(sql).run(Date.now(), transactionSignature, nonce).changes);
    } catch (err) {
      throw new DatabaseError(`Failed to mark nonce as used: ${getErrorMessage(err)}`);
    }

    if (changes === 0) {
      throw new NonceError('Nonce not found or already used');
    }

    return changes;
  }

  /**
   * Get nonce details
   */
  async getNonceDetails(nonce: string): Promise<NonceDetails | null> {
    const sql = `
      SELECT * FROM nonces WHERE nonce = ?
    `;

    let row: any;
    try {
      row = this.db!.prepare(sql).get(nonce);
    } catch (err) {
      throw new DatabaseError(`Failed to get nonce details: ${getErrorMessage(err)}`);
    }

    if (!row) {
      return null;
    }

    return {
      nonce: row.nonce,
      clientPublicKey: row.client_public_key,
      amount: row.amount,
      recipient: row.recipient,
      resourceId: row.resource_id,
      resourceUrl: row.resource_url,
      timestamp: row.timestamp,
      expiry: row.expiry,
      usedAt: row.used_at,
      transactionSignature: row.transaction_signature,
      createdAt: row.created_at,
    };
  }

  /**
   * Update transaction signature for a nonce
   */
  async reserveSettlement(nonce: string, signature: string): Promise<void> {
    const db = this.db;
    if (!db) throw new DatabaseError('Nonce database is not initialized');
    let changes: number;
    try {
      changes = Number(
        db
          .prepare(
            'UPDATE nonces SET transaction_signature = ? WHERE nonce = ? AND used_at IS NOT NULL AND transaction_signature IS NULL AND expiry > ?'
          )
          .run(signature, nonce, Date.now()).changes
      );
    } catch {
      throw new DatabaseError('Failed to reserve settlement');
    }
    if (changes !== 1) throw new NonceError('Payment already submitted or nonce unavailable');
  }

  async updateTransactionSignature(nonce: string, transactionSignature: string): Promise<number> {
    const sql = `
      UPDATE nonces 
      SET transaction_signature = ?
      WHERE nonce = ?
    `;

    let changes: number;
    try {
      changes = Number(this.db!.prepare(sql).run(transactionSignature, nonce).changes);
    } catch (err) {
      throw new DatabaseError(`Failed to update transaction signature: ${getErrorMessage(err)}`);
    }

    if (changes === 0) {
      throw new NonceError('Nonce not found');
    }

    return changes;
  }

  /**
   * Clean up expired nonces
   */
  async cleanupExpiredNonces(): Promise<number> {
    const currentTime = Date.now();
    const sql = `
      DELETE FROM nonces 
      WHERE expiry < ? AND used_at IS NULL
    `;

    let changes: number;
    try {
      changes = Number(this.db!.prepare(sql).run(currentTime).changes);
    } catch (err) {
      throw new DatabaseError(`Failed to cleanup expired nonces: ${getErrorMessage(err)}`);
    }

    console.log(`Cleaned up ${changes} expired nonces`);
    return changes;
  }

  /**
   * Get statistics about nonces
   */
  async getNonceStats(): Promise<NonceStats> {
    const sql = `
      SELECT 
        COUNT(*) as total_nonces,
        COUNT(CASE WHEN used_at IS NOT NULL THEN 1 END) as used_nonces,
        COUNT(CASE WHEN used_at IS NULL AND expiry > ? THEN 1 END) as active_nonces,
        COUNT(CASE WHEN used_at IS NULL AND expiry <= ? THEN 1 END) as expired_nonces
      FROM nonces
    `;

    const currentTime = Date.now();

    let row: any;
    try {
      row = this.db!.prepare(sql).get(currentTime, currentTime);
    } catch (err) {
      throw new DatabaseError(`Failed to get nonce stats: ${getErrorMessage(err)}`);
    }

    return {
      totalNonces: row.total_nonces,
      usedNonces: row.used_nonces,
      activeNonces: row.active_nonces,
      expiredNonces: row.expired_nonces,
    };
  }

  /**
   * Store transaction record
   */
  async storeTransaction(transactionData: TransactionData): Promise<number> {
    const sql = `
      INSERT INTO transactions (
        nonce, transaction_signature, status, error_message
      ) VALUES (?, ?, ?, ?)
    `;

    try {
      const result = this.db!.prepare(sql).run(
        transactionData.nonce,
        transactionData.transactionSignature,
        transactionData.status,
        transactionData.errorMessage ?? null
      );
      return Number(result.lastInsertRowid);
    } catch (err) {
      throw new DatabaseError(`Failed to store transaction: ${getErrorMessage(err)}`);
    }
  }

  /**
   * Update transaction status
   */
  async updateTransactionStatus(
    transactionSignature: string,
    status: string,
    errorMessage: string | null = null
  ): Promise<number> {
    const sql = `
      UPDATE transactions 
      SET status = ?, error_message = ?, updated_at = CURRENT_TIMESTAMP
      WHERE transaction_signature = ?
    `;

    try {
      return Number(this.db!.prepare(sql).run(status, errorMessage, transactionSignature).changes);
    } catch (err) {
      throw new DatabaseError(`Failed to update transaction status: ${getErrorMessage(err)}`);
    }
  }

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      try {
        this.db.close();
      } catch (err) {
        throw new DatabaseError(`Failed to close database: ${getErrorMessage(err)}`);
      }
      console.log('Database connection closed');
    }
  }
}

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
