import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateKeyPairSigner,
  blockhash,
  getBase64EncodedWireTransaction,
  signTransaction,
  getCompiledTransactionMessageDecoder,
  getTransactionEncoder,
  partiallySignTransaction,
  decompileTransactionMessage,
  compileTransaction,
  setTransactionMessageConfig,
} from '@solana/kit';
import { createSponsoredPayment, validateSponsoredPayment } from '../src/lib/sponsored-payment.ts';
import { AuthorizationPayload, PaymentRequest } from '../src/lib/payment-request.ts';
import { NonceDatabase } from '../src/lib/nonce-database.ts';
import { X402Middleware } from '../src/lib/x402-middleware.ts';
import { appendTransactionMessageInstruction } from '@solana/kit';

async function fixture(amount = 10_000_000n) {
  const client = await generateKeyPairSigner();
  const facilitator = await generateKeyPairSigner();
  const merchant = await generateKeyPairSigner();
  const transaction = await createSponsoredPayment({
    client,
    facilitator: facilitator.address,
    recipient: merchant.address,
    amount,
    lifetime: { blockhash: blockhash('11111111111111111111111111111111'), lastValidBlockHeight: 1n },
  });
  const expected = { clientPublicKey: client.address, recipient: merchant.address, amount: amount.toString() };
  return {
    client,
    facilitator,
    merchant,
    transaction,
    expected,
    serialized: getBase64EncodedWireTransaction(transaction),
  };
}

test('client partial signature survives facilitator co-signing of an executable V1 payment', async () => {
  const f = await fixture(9_007_199_254_740_993n);
  const parsed = validateSponsoredPayment(f.serialized, f.facilitator.address, f.expected);
  const signed = await signTransaction([f.facilitator.keyPair], parsed);
  assert.deepEqual(signed.signatures[f.client.address], f.transaction.signatures[f.client.address]);
  assert.ok(signed.signatures[f.facilitator.address]);
  const decoded = getCompiledTransactionMessageDecoder().decode(signed.messageBytes);
  assert.equal(decoded.version, 1);
  const message = decompileTransactionMessage(decoded);
  assert.equal(message.config.computeUnitLimit, 200_000);
  assert.equal(message.config.loadedAccountsDataSizeLimit, 65_536);
  assert.ok(getTransactionEncoder().encode(signed).length <= 1232);
});

for (const field of ['amount', 'recipient', 'clientPublicKey']) {
  test(`rejects a transaction with a mismatched ${field}`, async () => {
    const f = await fixture();
    const changed = field === 'amount' ? '1' : (await generateKeyPairSigner()).address;
    assert.throws(() =>
      validateSponsoredPayment(f.serialized, f.facilitator.address, { ...f.expected, [field]: changed })
    );
  });
}

test('rejects an invalid client signature before facilitator signing', async () => {
  const f = await fixture();
  const signature = new Uint8Array(64).fill(1);
  const tampered = { ...f.transaction, signatures: { ...f.transaction.signatures, [f.client.address]: signature } };
  assert.throws(
    () => validateSponsoredPayment(getBase64EncodedWireTransaction(tampered), f.facilitator.address, f.expected),
    /signature/
  );
});

test('rejects caller-selected priority fees before sponsoring them', async () => {
  const f = await fixture();
  const message = decompileTransactionMessage(
    getCompiledTransactionMessageDecoder().decode(f.transaction.messageBytes)
  );
  const changed = compileTransaction(setTransactionMessageConfig({ priorityFeeLamports: 1_000_000n }, message));
  const signed = await partiallySignTransaction([f.client.keyPair], changed);
  assert.throws(
    () => validateSponsoredPayment(getBase64EncodedWireTransaction(signed), f.facilitator.address, f.expected),
    /fee configuration/
  );
});

test('rejects a V0 payment rather than silently accepting an older transaction format', async () => {
  const f = await fixture();
  const message = decompileTransactionMessage(
    getCompiledTransactionMessageDecoder().decode(f.transaction.messageBytes)
  );
  const transaction = await partiallySignTransaction(
    [f.client.keyPair],
    compileTransaction({ ...message, version: 0 })
  );
  assert.throws(
    () => validateSponsoredPayment(getBase64EncodedWireTransaction(transaction), f.facilitator.address, f.expected),
    /must use V1/
  );
});

test('rejects additional instructions even when the first transfer matches the payment', async () => {
  const f = await fixture();
  const message = decompileTransactionMessage(
    getCompiledTransactionMessageDecoder().decode(f.transaction.messageBytes)
  );
  const transaction = await partiallySignTransaction(
    [f.client.keyPair],
    compileTransaction(appendTransactionMessageInstruction(message.instructions[0], message))
  );
  assert.throws(
    () => validateSponsoredPayment(getBase64EncodedWireTransaction(transaction), f.facilitator.address, f.expected),
    /single SOL transfer/
  );
});

test('rejects an unexpected facilitator fee payer', async () => {
  const f = await fixture();
  const other = await generateKeyPairSigner();
  assert.throws(() => validateSponsoredPayment(f.serialized, other.address, f.expected), /fee payer/);
});

test('reserves each verified nonce atomically and leaves uncertain submissions locked', async () => {
  const db = new NonceDatabase(':memory:');
  await db.initialize();
  try {
    const payload = {
      nonce: 'nonce',
      clientPublicKey: 'client',
      recipient: 'merchant',
      amount: '1',
      resourceId: '/resource',
      resourceUrl: '/resource',
      timestamp: Date.now(),
      expiry: Date.now() + 60_000,
    };
    await db.storeNonce(payload);
    await db.markNonceUsed(payload.nonce, null);
    const results = await Promise.allSettled([
      db.reserveSettlement('nonce', 'first'),
      db.reserveSettlement('nonce', 'second'),
    ]);
    assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);
    assert.equal(results.filter((r) => r.status === 'rejected').length, 1);
    assert.ok((await db.getNonceDetails('nonce')).transactionSignature);
    await assert.rejects(db.reserveSettlement('nonce', 'retry'));
  } finally {
    await db.close();
  }
});

for (const amount of ['-1', '0', '1.2', 'abc', '18446744073709551616']) {
  test(`rejects invalid exact payment amount ${amount}`, () => {
    const payload = AuthorizationPayload.create({
      amount,
      recipient: 'merchant',
      resourceId: '/resource',
      resourceUrl: '/resource',
      nonce: 'nonce',
    });
    assert.equal(payload.validate().isValid, false);
  });
}

function response() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test('an unpaid request returns HTTP 402 without contacting a facilitator', async () => {
  const middleware = new X402Middleware(
    {},
    { amount: '100', payTo: 'merchant', asset: 'SOL', network: 'solana-devnet' }
  );
  const res = response();
  await middleware.middleware()({ headers: {}, path: '/resource' }, res, () => assert.fail('must not grant access'));
  assert.equal(res.statusCode, 402);
  assert.equal(res.body.accepts[0].maxAmountRequired, '100');
});

for (const field of ['amount', 'recipient', 'resourceId', 'resourceUrl']) {
  test(`denies a mismatched resource ${field} before verification or settlement`, async () => {
    const middleware = new X402Middleware({}, { amount: '100', payTo: 'merchant' });
    middleware.verifyPayment = async () => assert.fail('must reject before verification');
    const payload = AuthorizationPayload.create({
      amount: '100',
      recipient: 'merchant',
      resourceId: '/resource',
      resourceUrl: '/resource',
      nonce: 'nonce',
    });
    payload[field] = field === 'amount' ? '1' : 'different';
    const payment = new PaymentRequest({ payload, signature: 'signature', clientPublicKey: 'client' });
    const res = response();
    await middleware.middleware()({ headers: { 'x-payment': payment.serialize() }, path: '/resource' }, res, () =>
      assert.fail('must not grant access')
    );
    assert.equal(res.statusCode, 402);
  });
}
