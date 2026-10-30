import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import {
  createKeyPairSignerFromBytes,
  generateKeyPairSigner,
  blockhash,
  getBase64EncodedWireTransaction,
  getSignatureFromTransaction,
  signTransaction,
} from '@solana/kit';
import { createSponsoredPayment, validateSponsoredPayment } from '../src/lib/sponsored-payment.ts';
import { AuthorizationPayload, PaymentRequest } from '../src/lib/payment-request.ts';
import { NonceDatabase } from '../src/lib/nonce-database.ts';
import { X402Middleware } from '../src/lib/x402-middleware.ts';
import { SolanaUtils } from '../src/lib/solana-utils.ts';
import { verifyPaymentRoute } from '../src/routes/verify.ts';
import { settlePaymentRoute } from '../src/routes/settle.ts';

async function listen(app) {
  const server = await new Promise((resolve, reject) => {
    const server = app.listen(0, '127.0.0.1', () => resolve(server));
    server.once('error', reject);
  });
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    close: () =>
      new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
        server.closeAllConnections();
      }),
  };
}

test('HTTP flow co-signs V1, confirms and rejects replay using only a local RPC stub', async (t) => {
  const clientSecret = nacl.sign.keyPair().secretKey;
  const facilitatorSecret = nacl.sign.keyPair().secretKey;
  const client = await createKeyPairSignerFromBytes(clientSecret);
  const facilitatorSigner = await createKeyPairSignerFromBytes(facilitatorSecret);
  const recipient = (await generateKeyPairSigner()).address;
  const expected = { clientPublicKey: client.address, recipient, amount: '10000000' };
  const transaction = await createSponsoredPayment({
    client,
    facilitator: facilitatorSigner.address,
    recipient,
    amount: 10000000n,
    lifetime: { blockhash: blockhash('11111111111111111111111111111111'), lastValidBlockHeight: 1n },
  });
  const db = new NonceDatabase(':memory:');
  await db.initialize();
  const servers = [];
  let broadcasts = 0;
  let rpcFailure = null;
  const rpcApp = express();
  rpcApp.use(express.json());
  rpcApp.post('/', (req, res) => {
    const { method, params, id } = req.body;
    if (method === rpcFailure) {
      return res.json({ jsonrpc: '2.0', id, error: { code: -32603, message: 'Injected RPC failure' } });
    }
    let result;
    if (method === 'getBalance') result = { context: { slot: 1 }, value: 100000000 };
    else if (method === 'getSignatureStatuses')
      result = {
        context: { slot: 1 },
        value: [{ slot: 1, confirmations: 1, err: null, confirmationStatus: 'confirmed', status: { Ok: null } }],
      };
    else if (method === 'sendTransaction') {
      const sent = validateSponsoredPayment(params[0], facilitatorSigner.address, expected);
      assert.ok(
        nacl.sign.detached.verify(
          new Uint8Array(sent.messageBytes),
          new Uint8Array(sent.signatures[facilitatorSigner.address]),
          bs58.decode(facilitatorSigner.address)
        )
      );
      broadcasts++;
      result = getSignatureFromTransaction(sent);
    } else return res.status(500).json({ error: 'Unexpected RPC method' });
    return res.json({ jsonrpc: '2.0', id, result });
  });
  try {
    const rpc = await listen(rpcApp);
    servers.push(rpc);
    const utils = new SolanaUtils({ rpcEndpoint: rpc.url });
    const facilitatorApp = express();
    facilitatorApp.use(express.json());
    facilitatorApp.post(
      '/verify',
      verifyPaymentRoute({
        solanaUtils: utils,
        nonceDb: db,
        facilitatorAddress: facilitatorSigner.address,
        maxPaymentAmount: 1000000000n,
      })
    );
    facilitatorApp.post(
      '/settle',
      settlePaymentRoute({
        solanaUtils: utils,
        nonceDb: db,
        facilitatorAddress: facilitatorSigner.address,
        facilitatorKeypair: facilitatorSigner,
        simulateTransactions: false,
        config: { facilitatorPrivateKey: bs58.encode(facilitatorSecret) },
      })
    );
    const facilitator = await listen(facilitatorApp);
    servers.push(facilitator);
    const merchantApp = express();
    const middleware = new X402Middleware(
      { facilitatorUrl: facilitator.url },
      { amount: expected.amount, payTo: recipient, asset: 'SOL', network: 'solana-devnet' }
    );
    merchantApp.get('/resource', middleware.middleware(), (req, res) => res.json({ payment: req.payment }));
    const merchant = await listen(merchantApp);
    servers.push(merchant);
    const payload = AuthorizationPayload.create({
      amount: expected.amount,
      recipient,
      resourceId: '/resource',
      resourceUrl: '/resource',
      nonce: 'http-test-nonce',
    });
    const payment = new PaymentRequest({
      payload,
      clientPublicKey: client.address,
      signedTransaction: getBase64EncodedWireTransaction(transaction),
      signature: utils.signStructuredData(payload.createStructuredData(), bs58.encode(clientSecret)),
    });
    const headers = { 'X-Payment': payment.serialize() };
    const pendingPayload = AuthorizationPayload.create({
      amount: expected.amount,
      recipient,
      resourceId: '/resource',
      resourceUrl: '/resource',
      nonce: 'reserved-but-not-broadcast',
    });
    const pendingPayment = new PaymentRequest({
      payload: pendingPayload,
      clientPublicKey: client.address,
      signature: utils.signStructuredData(pendingPayload.createStructuredData(), bs58.encode(clientSecret)),
    });
    const pendingBody = { paymentRequest: pendingPayment.serialize() };
    const verified = await fetch(`${facilitator.url}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pendingBody),
    });
    assert.equal((await verified.json()).isValid, true);
    const reservedSignature = getSignatureFromTransaction(
      await signTransaction([facilitatorSigner.keyPair], transaction)
    );
    await db.reserveSettlement(pendingPayload.nonce, reservedSignature);
    const pending = await fetch(`${facilitator.url}/settle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pendingBody),
    });
    const pendingResult = await pending.json();
    assert.equal(pendingResult.status, 'error');
    assert.match(pendingResult.error, /submitted or reserved/);
    assert.equal(pendingResult.transactionSignature, reservedSignature);
    assert.equal(broadcasts, 0);
    const paid = await fetch(`${merchant.url}/resource`, { headers });
    assert.equal(paid.status, 200);
    assert.ok((await paid.json()).payment.transactionSignature);
    assert.equal(broadcasts, 1);
    const replay = await fetch(`${merchant.url}/resource`, { headers });
    assert.equal(replay.status, 402);
    assert.equal(broadcasts, 1);
    const timeoutPayload = AuthorizationPayload.create({
      amount: expected.amount,
      recipient,
      resourceId: '/resource',
      resourceUrl: '/resource',
      nonce: 'timeout-after-reservation',
    });
    const timeoutPayment = new PaymentRequest({
      payload: timeoutPayload,
      clientPublicKey: client.address,
      signedTransaction: getBase64EncodedWireTransaction(transaction),
      signature: utils.signStructuredData(timeoutPayload.createStructuredData(), bs58.encode(clientSecret)),
    });
    // A second authorization may carry the same wire transaction and candidate signature.
    const timeoutSignature = reservedSignature;
    utils.submitSponsoredTransaction = async (_key, _wire, _expected, reserve) => {
      await reserve(timeoutSignature);
      throw new Error('Confirmation timed out');
    };
    const timeout = await fetch(`${merchant.url}/resource`, { headers: { 'X-Payment': timeoutPayment.serialize() } });
    assert.equal(timeout.status, 402);
    const timeoutResult = await timeout.json();
    assert.match(timeoutResult.message, /Confirmation timed out/);
    assert.equal(timeoutResult.transactionSignature, timeoutSignature);
    assert.equal((await db.getNonceDetails(timeoutPayload.nonce)).transactionSignature, timeoutSignature);
    assert.equal(broadcasts, 1);
    const loggingPayload = AuthorizationPayload.create({
      amount: expected.amount,
      recipient,
      resourceId: '/resource',
      resourceUrl: '/resource',
      nonce: 'logging-failure',
    });
    const loggingPayment = new PaymentRequest({
      payload: loggingPayload,
      clientPublicKey: client.address,
      signedTransaction: getBase64EncodedWireTransaction(transaction),
      signature: utils.signStructuredData(loggingPayload.createStructuredData(), bs58.encode(clientSecret)),
    });
    const storeTransaction = db.storeTransaction.bind(db);
    db.storeTransaction = async () => {
      throw new Error('Database write unavailable');
    };
    const loggingResponse = await fetch(`${merchant.url}/resource`, {
      headers: { 'X-Payment': loggingPayment.serialize() },
      signal: AbortSignal.timeout(5000),
    });
    assert.equal(loggingResponse.status, 402);
    const loggingResult = await loggingResponse.json();
    assert.match(loggingResult.message, /Confirmation timed out/);
    assert.equal(loggingResult.transactionSignature, timeoutSignature);
    assert.equal((await db.getNonceDetails(loggingPayload.nonce)).transactionSignature, timeoutSignature);
    assert.equal(broadcasts, 1);
    db.storeTransaction = storeTransaction;
    for (const method of ['sendTransaction', 'getSignatureStatuses']) {
      await t.test(`real submission path retains its reserved signature when ${method} fails`, async () => {
        rpcFailure = method;
        const failurePayload = AuthorizationPayload.create({
          amount: expected.amount,
          recipient,
          resourceId: '/resource',
          resourceUrl: '/resource',
          nonce: `rpc-${method}`,
        });
        const failurePayment = new PaymentRequest({
          payload: failurePayload,
          clientPublicKey: client.address,
          signedTransaction: getBase64EncodedWireTransaction(transaction),
          signature: utils.signStructuredData(failurePayload.createStructuredData(), bs58.encode(clientSecret)),
        });
        // Use the real signing/reservation/submission method, not the timeout stub above.
        utils.submitSponsoredTransaction = SolanaUtils.prototype.submitSponsoredTransaction;
        const before = broadcasts;
        const response = await fetch(`${merchant.url}/resource`, {
          headers: { 'X-Payment': failurePayment.serialize() },
        });
        assert.equal(response.status, 402);
        const body = await response.json();
        assert.match(body.message, /Injected RPC failure/);
        assert.equal(body.transactionSignature, reservedSignature);
        assert.equal((await db.getNonceDetails(failurePayload.nonce)).transactionSignature, reservedSignature);
        assert.equal(broadcasts, before + (method === 'getSignatureStatuses' ? 1 : 0));
        rpcFailure = null;
      });
    }
  } finally {
    await Promise.all(servers.reverse().map((server) => server.close()));
    await db.close();
  }
});
