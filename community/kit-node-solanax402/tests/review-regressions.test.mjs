import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ESLint } from 'eslint';
import { AuthorizationPayload } from '../src/lib/payment-request.ts';

test('allows bounded clock skew but rejects far-future, expired and unsafe timestamps', () => {
  const now = Date.now();
  const payload = AuthorizationPayload.create({
    amount: '1',
    recipient: 'merchant',
    resourceId: '/r',
    resourceUrl: '/r',
    nonce: 'clock-test',
  });
  payload.timestamp = now + 10_000;
  payload.expiry = now + 60_000;
  assert.equal(payload.validate().isValid, true);
  payload.timestamp = now + 120_000;
  assert.equal(payload.validate().isValid, false);
  payload.timestamp = now - 60_000;
  payload.expiry = now - 1;
  assert.equal(payload.validate().isValid, false);
  payload.timestamp = Number.MAX_SAFE_INTEGER + 1;
  assert.equal(payload.validate().isValid, false);
});

test('flat ESLint configuration preserves core recommended checks', async () => {
  const eslint = new ESLint();
  const [result] = await eslint.lintText(
    'function example() { return; console.log("unreachable"); }\nif (true) {}\nconst bad = typeof example === "strnig";',
    { filePath: 'src/review-lint-probe.ts' }
  );
  for (const rule of ['no-unreachable', 'no-constant-condition', 'valid-typeof']) {
    assert.ok(
      result.messages.some((message) => message.ruleId === rule),
      rule
    );
  }
});
