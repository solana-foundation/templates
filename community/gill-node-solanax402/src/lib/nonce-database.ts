/**
 * Nonce Database Manager
 * Handles nonce storage and validation to prevent replay attacks
 */

import sqlite3 from 'sqlite3';
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
  private db: sqlite3.Database | null = null;
  private dbPath: string;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
  }

  /**
   * Initialize the database and create tables
   */
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err);
          reject(new DatabaseError(`Failed to open database: ${err.message}`));
          return;
        }

        this.createTables()
          .then(() => {
            console.log('Nonce database initialized successfully');
            // Verify the table structure
            this.db!.all('PRAGMA table_info(nonces)', (err, columns) => {
              if (err) {
                console.error('Error checking table structure:', err);
              } else {
                console.log(
                  'Table columns:',
                  (columns as any[]).map((col) => col.name)
                );
              }
            });
            resolve();
          })
          .catch(reject);
      });
    });
  }

  /**
   * Create necessary tables
   */
  private async createTables(): Promise<void> {
    return new Promise((resolve, reject) => {
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

      this.db!.serialize(() => {
        this.db!.run(createNoncesTable, (err) => {
          if (err) {
            reject(new DatabaseError(`Failed to create nonces table: ${err.message}`));
            return;
          }
          console.log('Created nonces table with resource_url column');
        });

        this.db!.run(createTransactionsTable, (err) => {
          if (err) {
            reject(new DatabaseError(`Failed to create transactions table: ${err.message}`));
            return;
          }
          console.log('Created transactions table');
          resolve();
        });
      });
    });
  }

  /**
   * Store a new nonce
   */
  async storeNonce(nonceData: NonceData): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO nonces (
          nonce, client_public_key, amount, recipient, 
          resource_id, resource_url, timestamp, expiry
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      this.db!.run(
        sql,
        [
          nonceData.nonce,
          nonceData.clientPublicKey,
          nonceData.amount,
          nonceData.recipient,
          nonceData.resourceId,
          nonceData.resourceUrl,
          nonceData.timestamp,
          nonceData.expiry,
        ],
        function (err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              reject(new NonceError('Nonce already exists'));
            } else {
              reject(new DatabaseError(`Failed to store nonce: ${err.message}`));
            }
            return;
          }
          resolve(this.lastID);
        }
      );
    });
  }

  /**
   * Check if a nonce has been used
   */
  async isNonceUsed(nonce: string): Promise<NonceUsedStatus> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT used_at, transaction_signature 
        FROM nonces 
        WHERE nonce = ?
      `;

      this.db!.get(sql, [nonce], (err, row: any) => {
        if (err) {
          reject(new DatabaseError(`Failed to check nonce: ${err.message}`));
          return;
        }

        if (!row) {
          resolve({ used: false, data: null });
          return;
        }

        resolve({
          used: row.used_at !== null,
          data: {
            usedAt: row.used_at,
            transactionSignature: row.transaction_signature,
          },
        });
      });
    });
  }

  /**
   * Mark a nonce as used
   */
  async markNonceUsed(nonce: string, transactionSignature: string | null): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE nonces 
        SET used_at = ?, transaction_signature = ?
        WHERE nonce = ? AND used_at IS NULL
      `;

      this.db!.run(sql, [Date.now(), transactionSignature, nonce], function (err) {
        if (err) {
          reject(new DatabaseError(`Failed to mark nonce as used: ${err.message}`));
          return;
        }

        if (this.changes === 0) {
          reject(new NonceError('Nonce not found or already used'));
          return;
        }

        resolve(this.changes);
      });
    });
  }

  /**
   * Get nonce details
   */
  async getNonceDetails(nonce: string): Promise<NonceDetails | null> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM nonces WHERE nonce = ?
      `;

      this.db!.get(sql, [nonce], (err, row: any) => {
        if (err) {
          reject(new DatabaseError(`Failed to get nonce details: ${err.message}`));
          return;
        }

        if (!row) {
          resolve(null);
          return;
        }

        resolve({
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
        });
      });
    });
  }

  /**
   * Update transaction signature for a nonce
   */
  async updateTransactionSignature(nonce: string, transactionSignature: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE nonces 
        SET transaction_signature = ?
        WHERE nonce = ?
      `;

      this.db!.run(sql, [transactionSignature, nonce], function (err) {
        if (err) {
          reject(new DatabaseError(`Failed to update transaction signature: ${err.message}`));
          return;
        }

        if (this.changes === 0) {
          reject(new NonceError('Nonce not found'));
          return;
        }

        resolve(this.changes);
      });
    });
  }

  /**
   * Clean up expired nonces
   */
  async cleanupExpiredNonces(): Promise<number> {
    return new Promise((resolve, reject) => {
      const currentTime = Date.now();
      const sql = `
        DELETE FROM nonces 
        WHERE expiry < ? AND used_at IS NULL
      `;

      this.db!.run(sql, [currentTime], function (err) {
        if (err) {
          reject(new DatabaseError(`Failed to cleanup expired nonces: ${err.message}`));
          return;
        }

        console.log(`Cleaned up ${this.changes} expired nonces`);
        resolve(this.changes);
      });
    });
  }

  /**
   * Get statistics about nonces
   */
  async getNonceStats(): Promise<NonceStats> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          COUNT(*) as total_nonces,
          COUNT(CASE WHEN used_at IS NOT NULL THEN 1 END) as used_nonces,
          COUNT(CASE WHEN used_at IS NULL AND expiry > ? THEN 1 END) as active_nonces,
          COUNT(CASE WHEN used_at IS NULL AND expiry <= ? THEN 1 END) as expired_nonces
        FROM nonces
      `;

      const currentTime = Date.now();

      this.db!.get(sql, [currentTime, currentTime], (err, row: any) => {
        if (err) {
          reject(new DatabaseError(`Failed to get nonce stats: ${err.message}`));
          return;
        }

        resolve({
          totalNonces: row.total_nonces,
          usedNonces: row.used_nonces,
          activeNonces: row.active_nonces,
          expiredNonces: row.expired_nonces,
        });
      });
    });
  }

  /**
   * Store transaction record
   */
  async storeTransaction(transactionData: TransactionData): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO transactions (
          nonce, transaction_signature, status, error_message
        ) VALUES (?, ?, ?, ?)
      `;

      this.db!.run(
        sql,
        [
          transactionData.nonce,
          transactionData.transactionSignature,
          transactionData.status,
          transactionData.errorMessage ?? null,
        ],
        function (err) {
          if (err) {
            reject(new DatabaseError(`Failed to store transaction: ${err.message}`));
            return;
          }
          resolve(this.lastID);
        }
      );
    });
  }

  /**
   * Update transaction status
   */
  async updateTransactionStatus(
    transactionSignature: string,
    status: string,
    errorMessage: string | null = null
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE transactions 
        SET status = ?, error_message = ?, updated_at = CURRENT_TIMESTAMP
        WHERE transaction_signature = ?
      `;

      this.db!.run(sql, [status, errorMessage, transactionSignature], function (err) {
        if (err) {
          reject(new DatabaseError(`Failed to update transaction status: ${err.message}`));
          return;
        }
        resolve(this.changes);
      });
    });
  }

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            reject(new DatabaseError(`Failed to close database: ${err.message}`));
          } else {
            console.log('Database connection closed');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}
