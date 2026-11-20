import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { NonceDatabase } from '../src/lib/nonce-database.ts';
import { PaymentRequest } from '../src/lib/payment-request.ts';
import { X402Middleware } from '../src/lib/x402-middleware.ts';
import { getNonceRoute } from '../src/routes/nonce.ts';

async function listen(app) {
  const server = await new Promise((resolve) => {
    const server = app.listen(0, '127.0.0.1', () => resolve(server));
  });
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    close: () =>
      new Promise((resolve) => {
        server.close(resolve);
        server.closeAllConnections();
      }),
  };
}

for (const [header, status] of [
  ['{', 400],
  ['{}', 400],
  ['null', 400],
  ['[]', 400],
  ['42', 400],
  ['"text"', 400],
  ['{"payload":null}', 400],
  ['{"payload":{}}', 402],
]) {
  test(`invalid payment header ${header} returns ${status} without contacting the facilitator`, async () => {
    const middleware = new X402Middleware({}, { amount: '1', payTo: 'merchant' });
    middleware.verifyPayment = async () => assert.fail('Invalid input must not reach verification');
    middleware.settlePayment = async () => assert.fail('Invalid input must not reach settlement');
    const app = express();
    app.get('/resource', middleware.middleware(), () => assert.fail('Invalid input must not grant access'));
    const server = await listen(app);
    try {
      const response = await fetch(`${server.url}/resource`, { headers: { 'X-Payment': header } });
      assert.equal(response.status, status);
      assert.equal(
        (await response.json()).code,
        status === 400 ? 'INVALID_PAYMENT_FORMAT' : 'PAYMENT_REQUIREMENTS_MISMATCH'
      );
    } finally {
      await server.close();
    }
  });
}

for (const failure of [
  'timeout',
  'response body timeout',
  'connection loss',
  'unavailable status',
  'status timeout',
  'status body timeout',
  'unreserved status',
  'mismatched status',
]) {
  test(`settlement ${failure} stays uncertain and never resubmits the payment`, async () => {
    const db = new NonceDatabase(':memory:');
    await db.initialize();
    const payment = PaymentRequest.create({
      amount: '1',
      recipient: 'merchant',
      resourceId: '/resource',
      resourceUrl: '/resource',
      nonce: 'transport-test',
      signature: 'authorization',
      clientPublicKey: 'client',
    });
    const servers = [];
    let settlements = 0;
    let reads = 0;
    let grants = 0;
    const facilitatorApp = express();
    facilitatorApp.use(express.json());
    facilitatorApp.post('/verify', async (_req, res) => {
      await db.storeNonce({ ...payment.payload, clientPublicKey: payment.clientPublicKey });
      await db.markNonceUsed(payment.payload.nonce, null);
      res.json({ isValid: true });
    });
    facilitatorApp.post('/settle', async (_req, res) => {
      settlements++;
      if (failure !== 'unreserved status') await db.reserveSettlement(payment.payload.nonce, 'reserved-signature');
      if (failure === 'response body timeout') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write('{"status":');
      } else if (failure !== 'timeout') res.destroy();
    });
    facilitatorApp.get('/nonce/:nonce', async (req, res) => {
      reads++;
      if (failure === 'status timeout') return;
      if (failure === 'status body timeout') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write('{"success":');
        return;
      }
      if (failure === 'unavailable status') return res.status(503).json({ error: 'Unavailable' });
      if (failure === 'mismatched status') {
        const details = await db.getNonceDetails(payment.payload.nonce);
        return res.json({ success: true, data: { ...details, recipient: 'other-merchant' } });
      }
      await getNonceRoute({ nonceDb: db })(req, res);
    });
    try {
      const facilitator = await listen(facilitatorApp);
      servers.push(facilitator);
      const middleware = new X402Middleware(
        { facilitatorUrl: facilitator.url, timeout: 500 },
        { amount: '1', payTo: 'merchant' }
      );
      const app = express();
      app.get('/resource', middleware.middleware(), (_req, res) => {
        grants++;
        res.json({ paid: true });
      });
      const merchant = await listen(app);
      servers.push(merchant);
      const response = await fetch(`${merchant.url}/resource`, { headers: { 'X-Payment': payment.serialize() } });
      assert.equal(response.status, 402);
      const body = await response.json();
      assert.equal(body.code, 'PAYMENT_SETTLEMENT_FAILED');
      assert.match(body.message, /Do not submit another payment/);
      assert.equal(
        body.transactionSignature,
        ['timeout', 'response body timeout', 'connection loss'].includes(failure) ? 'reserved-signature' : undefined
      );
      assert.equal(settlements, 1);
      assert.equal(reads, 1);
      assert.equal(grants, 0);
      if (failure !== 'unreserved status')
        assert.equal((await db.getNonceDetails(payment.payload.nonce)).transactionSignature, 'reserved-signature');
    } finally {
      await Promise.all(servers.reverse().map((server) => server.close()));
      await db.close();
    }
  });
}
