import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { NonceDatabase } from '../src/lib/nonce-database.ts';

const payload = (nonce, expiry = Date.now() + 60_000) => ({
  nonce,
  clientPublicKey: 'client',
  recipient: 'merchant',
  amount: '1',
  resourceId: '/resource',
  resourceUrl: '/resource',
  timestamp: Date.now(),
  expiry,
});

test('settlement reservation rejects missing, unverified and expired nonces', async () => {
  const db = new NonceDatabase(':memory:');
  await db.initialize();
  try {
    await assert.rejects(db.reserveSettlement('missing', 'signature'), /nonce unavailable/);
    await db.storeNonce(payload('unverified'));
    await assert.rejects(db.reserveSettlement('unverified', 'signature'), /nonce unavailable/);
    assert.equal((await db.getNonceDetails('unverified')).transactionSignature, null);
    await db.storeNonce(payload('expired', Date.now() - 1));
    await db.markNonceUsed('expired', null);
    await assert.rejects(db.reserveSettlement('expired', 'signature'), /nonce unavailable/);
    assert.equal((await db.getNonceDetails('expired')).transactionSignature, null);
  } finally {
    await db.close();
  }
});

test('reserved signatures survive database reopen and prevent another settlement', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'x402-nonce-'));
  const file = path.join(dir, 'nonces.db');
  let db = new NonceDatabase(file);
  let open = false;
  try {
    await db.initialize();
    open = true;
    await db.storeNonce(payload('reserved'));
    await db.markNonceUsed('reserved', null);
    await db.reserveSettlement('reserved', 'original-signature');
    await db.close();
    open = false;
    db = new NonceDatabase(file);
    await db.initialize();
    open = true;
    assert.equal((await db.getNonceDetails('reserved')).transactionSignature, 'original-signature');
    await assert.rejects(db.reserveSettlement('reserved', 'replacement-signature'), /already submitted/);
    assert.equal((await db.getNonceDetails('reserved')).transactionSignature, 'original-signature');
  } finally {
    if (open) await db.close();
    await rm(dir, { recursive: true, force: true });
  }
});
