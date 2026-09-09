import assert from 'node:assert/strict'
import { exponentialBackoffDelay, waitForDelay } from '../lib/retry'
import { isNotificationNewerThanSnapshot } from '../lib/slots'

async function main() {
  const snapshotSlot = 105n

  assert.equal(isNotificationNewerThanSnapshot(104n, snapshotSlot), false)
  assert.equal(isNotificationNewerThanSnapshot(105n, snapshotSlot), false)
  assert.equal(isNotificationNewerThanSnapshot(106n, snapshotSlot), true)

  const withoutJitter = { random: () => 0 }
  assert.equal(exponentialBackoffDelay(1, withoutJitter), 1_000)
  assert.equal(exponentialBackoffDelay(2, withoutJitter), 2_000)
  assert.equal(exponentialBackoffDelay(3, withoutJitter), 4_000)
  assert.equal(exponentialBackoffDelay(100, withoutJitter), 30_000)
  assert.equal(exponentialBackoffDelay(100, { random: () => 0.999 }), 30_000)

  const shutdown = new AbortController()
  const pendingDelay = waitForDelay(30_000, shutdown.signal)
  shutdown.abort()
  await Promise.race([
    pendingDelay,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Abort did not cancel reconnect delay')), 100)),
  ])

  console.log('PASS: only notifications newer than the backfill snapshot are applied')
  console.log('PASS: reconnect backoff grows exponentially, is capped, and stops on shutdown')
}

void main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
