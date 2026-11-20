import { test } from 'node:test';
import assert from 'node:assert/strict';
import { waitForTransaction } from '../src/lib/wait-for-transaction.ts';

test('retries read-only indexing until transaction details arrive', async () => {
  let reads = 0;
  const transaction = { version: 1 };
  const result = await waitForTransaction(async () => (++reads === 3 ? transaction : null), 4, 0);
  assert.equal(result, transaction);
  assert.equal(reads, 3);
});

test('bounds indexing retries and returns pending without resubmitting', async () => {
  let reads = 0;
  assert.equal(
    await waitForTransaction(
      async () => {
        reads++;
        return null;
      },
      3,
      0
    ),
    null
  );
  assert.equal(reads, 3);
});

test('does not conceal RPC errors as successful verification', async () => {
  await assert.rejects(
    waitForTransaction(
      async () => {
        throw new Error('RPC unavailable');
      },
      3,
      0
    ),
    /RPC unavailable/
  );
});
