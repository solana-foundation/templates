#!/usr/bin/env node

/**
 * Replay Attack Test
 *
 * This test demonstrates that the x402 facilitator properly prevents
 * replay attacks by rejecting payment requests with reused nonces.
 */

import fs from 'fs';
import crypto from 'crypto';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { config } from 'dotenv';
import { Connection, PublicKey, SystemProgram, Transaction, Keypair } from '@solana/web3.js';

// Load environment variables
config();

// Configuration from environment variables
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
const RESOURCE_URL = '/api/premium-data';
const FACILITATOR_PUBLIC_KEY = process.env.FACILITATOR_PUBLIC_KEY || '';
const MERCHANT_ADDRESS = process.env.MERCHANT_SOLANA_ADDRESS || '';
const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';

// Load client keypair
const keypairData = JSON.parse(fs.readFileSync('./test-client-keypair.json', 'utf-8'));
const secretKeyBytes = bs58.decode(keypairData.secretKey);
const clientKeypair = Keypair.fromSecretKey(secretKeyBytes);

console.log(' Replay Attack Test\n');
console.log('='.repeat(70));
console.log();

/**
 * Create payment with sponsored transaction
 */
async function createPaymentRequest(nonce) {
  const timestamp = Date.now();
  const expiry = timestamp + 3600000; // 1 hour

  const payload = {
    amount: '10000000',
    recipient: MERCHANT_ADDRESS,
    resourceId: RESOURCE_URL,
    resourceUrl: RESOURCE_URL,
    nonce: nonce,
    timestamp: timestamp,
    expiry: expiry,
  };

  const structuredData = {
    domain: {
      name: 'x402-solana-protocol',
      version: '1',
      chainId: 'devnet',
      verifyingContract: 'x402-sol',
    },
    types: {
      AuthorizationPayload: [
        { name: 'amount', type: 'string' },
        { name: 'recipient', type: 'string' },
        { name: 'resourceId', type: 'string' },
        { name: 'resourceUrl', type: 'string' },
        { name: 'nonce', type: 'string' },
        { name: 'timestamp', type: 'uint64' },
        { name: 'expiry', type: 'uint64' },
      ],
    },
    primaryType: 'AuthorizationPayload',
    message: {
      amount: payload.amount,
      recipient: payload.recipient,
      resourceId: payload.resourceId,
      resourceUrl: payload.resourceUrl,
      nonce: payload.nonce,
      timestamp: payload.timestamp,
      expiry: payload.expiry,
    },
  };

  const messageToSign = JSON.stringify(structuredData);
  const messageBytes = Buffer.from(messageToSign, 'utf-8');
  const authSignature = nacl.sign.detached(messageBytes, clientKeypair.secretKey);

  // Create Solana transaction
  const connection = new Connection(RPC_URL, 'confirmed');
  const { blockhash } = await connection.getLatestBlockhash('confirmed');

  const transaction = new Transaction({
    feePayer: new PublicKey(FACILITATOR_PUBLIC_KEY),
    recentBlockhash: blockhash,
  });

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: clientKeypair.publicKey,
      toPubkey: new PublicKey(MERCHANT_ADDRESS),
      lamports: 10000000,
    })
  );

  transaction.sign(clientKeypair);

  const serializedTransaction = transaction
    .serialize({
      requireAllSignatures: false,
      verifySignatures: true,
    })
    .toString('base64');

  return {
    payload: payload,
    signature: bs58.encode(authSignature),
    clientPublicKey: clientKeypair.publicKey.toString(),
    signedTransaction: serializedTransaction,
  };
}

/**
 * Send payment request to server
 */
async function sendPaymentRequest(paymentRequest, attemptNumber) {
  console.log(` Attempt ${attemptNumber}: Sending payment request...`);
  console.log(`   Nonce: ${paymentRequest.payload.nonce.substring(0, 16)}...`);

  const response = await fetch(`${SERVER_URL}${RESOURCE_URL}`, {
    method: 'GET',
    headers: {
      'X-Payment': JSON.stringify(paymentRequest),
    },
  });

  return {
    status: response.status,
    data: await response.json(),
  };
}

/**
 * Main test
 */
async function runReplayAttackTest() {
  try {
    // Generate a nonce for this test
    const nonce = crypto.randomBytes(32).toString('hex');

    console.log('STEP 1: Create legitimate payment request');
    console.log('-'.repeat(70));
    const paymentRequest = await createPaymentRequest(nonce);
    console.log(' Payment request created');
    console.log(`   Nonce: ${nonce.substring(0, 16)}...`);
    console.log();

    console.log('STEP 2: First attempt (should succeed)');
    console.log('-'.repeat(70));
    const firstAttempt = await sendPaymentRequest(paymentRequest, 1);

    if (firstAttempt.status === 200) {
      console.log(' First attempt SUCCEEDED (expected)');
      console.log(`   Status: ${firstAttempt.status}`);
      console.log(`   Transaction: ${firstAttempt.data.data?.payment?.transactionSignature?.substring(0, 20)}...`);
    } else {
      console.log(` First attempt failed unexpectedly: ${firstAttempt.status}`);
      console.log(JSON.stringify(firstAttempt.data, null, 2));
      return;
    }
    console.log();

    console.log('STEP 3: Second attempt with SAME nonce (replay attack)');
    console.log('-'.repeat(70));
    console.log('  Attempting to reuse the same payment request...');
    console.log('   This should be REJECTED by the facilitator!');
    console.log();

    const secondAttempt = await sendPaymentRequest(paymentRequest, 2);

    if (secondAttempt.status === 402 || secondAttempt.status === 400) {
      console.log(' REPLAY ATTACK BLOCKED! (expected)');
      console.log(`   Status: ${secondAttempt.status}`);
      console.log(`   Error: ${secondAttempt.data.error?.message || secondAttempt.data.error}`);
      console.log();
      console.log('='.repeat(70));
      console.log(' SUCCESS! Nonce system prevents replay attacks!');
      console.log('='.repeat(70));
      console.log();
      console.log(' REPLAY PROTECTION VERIFIED:');
      console.log('   • First payment: Accepted and processed ');
      console.log('   • Second payment (same nonce): Rejected ');
      console.log('   • Nonce marked as "used" in database');
      console.log('   • Attacker cannot reuse payment authorization');
      console.log();
    } else {
      console.log('  WARNING: Replay attack was NOT blocked!');
      console.log(`   Status: ${secondAttempt.status}`);
      console.log(JSON.stringify(secondAttempt.data, null, 2));
      console.log();
      console.log(' SECURITY ISSUE: Nonce system may not be working correctly!');
    }
  } catch (error) {
    console.error('\n Test failed:', error.message);
    console.error();
    console.error('Make sure both facilitator and server are running:');
    console.error('  Terminal 1: npm run start:facilitator');
    console.error('  Terminal 2: npm run start:server');
    process.exit(1);
  }
}

runReplayAttackTest();
