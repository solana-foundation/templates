#!/usr/bin/env node

/**
 * TRUE x402 Protocol Test - Instant Finality with Sponsored Transactions
 *
 * This test demonstrates TRUE x402 instant finality:
 * 1. Client creates Solana transaction (transfer from client → merchant)
 * 2. Client signs the transaction (authorizes their SOL to move)
 * 3. Client sends signed transaction + authorization to facilitator
 * 4. Facilitator verifies authorization signature (replay protection)
 * 5. Facilitator adds their signature as fee payer (pays gas)
 * 6. Facilitator broadcasts to Solana blockchain
 * 7. INSTANT FINALITY: Client's funds move immediately
 *
 * Client's funds are committed instantly (true x402 spec compliance)!
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
const FACILITATOR_PUBLIC_KEY = process.env.FACILITATOR_PUBLIC_KEY || ''; // Fee payer
const MERCHANT_ADDRESS = process.env.MERCHANT_SOLANA_ADDRESS || ''; // Payment recipient
const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';

// Load client keypair
const keypairData = JSON.parse(fs.readFileSync('./test-client-keypair.json', 'utf-8'));
const secretKeyBytes = bs58.decode(keypairData.secretKey);
const clientKeypair = Keypair.fromSecretKey(secretKeyBytes);

console.log(' Loaded client keypair');
console.log(' Client Public Key:', clientKeypair.publicKey.toString());
console.log();

console.log(' Starting TRUE x402 Protocol Test (Instant Finality)\n');
console.log('='.repeat(70));
console.log();

/**
 * Create payment with sponsored transaction (true x402 with instant settlement)
 * Client creates and signs the transaction - their funds move immediately!
 */
async function createPaymentWithSponsoredTransaction(amount, recipient, resourceUrl) {
  const nonce = crypto.randomBytes(32).toString('hex');
  const timestamp = Date.now();
  const expiry = timestamp + 3600000; // 1 hour

  // 1. Create authorization payload (for nonce verification & replay protection)
  const payload = {
    amount: amount.toString(),
    recipient: recipient,
    resourceId: resourceUrl,
    resourceUrl: resourceUrl,
    nonce: nonce,
    timestamp: timestamp,
    expiry: expiry,
  };

  // 2. Create structured data to sign (for off-chain verification)
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

  // 3. Sign the structured data (off-chain signature for replay protection)
  console.log('  Client signing authorization payload (Ed25519)...');
  const messageToSign = JSON.stringify(structuredData);
  const messageBytes = Buffer.from(messageToSign, 'utf-8');
  const authSignature = nacl.sign.detached(messageBytes, clientKeypair.secretKey);
  console.log(' Authorization signed');
  console.log();

  // 4. Create actual Solana transaction (TRUE x402 INSTANT FINALITY!)
  console.log(' Client creating Solana transaction...');
  const connection = new Connection(RPC_URL, 'confirmed');

  // Get recent blockhash
  const { blockhash } = await connection.getLatestBlockhash('confirmed');

  // Create transaction
  const transaction = new Transaction({
    feePayer: new PublicKey(FACILITATOR_PUBLIC_KEY), // Facilitator pays gas!
    recentBlockhash: blockhash,
  });

  // Add transfer instruction: Client → Merchant
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: clientKeypair.publicKey, // CLIENT'S SOL WILL MOVE!
      toPubkey: new PublicKey(recipient), // Merchant receives
      lamports: Number(amount),
    })
  );

  // 5. Client signs the transaction (authorizes their SOL to move)
  console.log('  Client signing transaction (authorizing SOL transfer)...');
  transaction.sign(clientKeypair);

  // 6. Serialize the transaction (includes client's signature)
  const serializedTransaction = transaction
    .serialize({
      requireAllSignatures: false, // Facilitator hasn't signed yet
      verifySignatures: true, // Verify client's signature is valid
    })
    .toString('base64');

  console.log(' Transaction signed and serialized');
  console.log();

  return {
    payload: payload,
    signature: bs58.encode(authSignature),
    clientPublicKey: clientKeypair.publicKey.toString(),
    signedTransaction: serializedTransaction, // THIS TRIGGERS SPONSORED TX = INSTANT FINALITY!
  };
}

/**
 * Access protected resource with TRUE x402 payment (INSTANT FINALITY)
 */
async function accessProtectedResource(paymentRequest) {
  console.log('  Accessing protected resource with TRUE x402 instant finality...');
  console.log('   The middleware will:');
  console.log('   1. Verify the off-chain authorization signature ');
  console.log('   2. Check nonce (replay protection) ');
  console.log('   3. Verify client signed the transaction ');
  console.log('   4. Facilitator adds signature as fee payer ');
  console.log('   5. Facilitator broadcasts to Solana blockchain ');
  console.log("   6. CLIENT'S SOL moves to merchant (instant finality!) ");
  console.log('   7. Wait for confirmation ');
  console.log('   8. Grant access to the resource ');
  console.log();
  console.log("    Client's funds committed instantly");
  console.log();

  const response = await fetch(`${SERVER_URL}${RESOURCE_URL}`, {
    method: 'GET',
    headers: {
      'X-Payment': JSON.stringify(paymentRequest),
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Access failed: ${response.status} - ${error}`);
  }

  return await response.json();
}

/**
 * Main test flow
 */
async function runTest() {
  try {
    // Create payment with sponsored transaction (TRUE x402 instant finality!)
    const paymentRequest = await createPaymentWithSponsoredTransaction(
      10000000, // 0.01 SOL in lamports
      MERCHANT_ADDRESS, // Merchant address (where payment goes)
      RESOURCE_URL
    );

    console.log('Payment Request Created (TRUE x402 Instant Finality):');
    console.log('  Amount: 0.01 SOL (10,000,000 lamports)');
    console.log('  From (client):', clientKeypair.publicKey.toString());
    console.log('  To (merchant):', MERCHANT_ADDRESS);
    console.log('  Fee Payer (facilitator):', FACILITATOR_PUBLIC_KEY);
    console.log('  Nonce:', paymentRequest.payload.nonce.substring(0, 16) + '...');
    console.log('  Authorization Signature:  (Ed25519, replay protection)');
    console.log('  Transaction Signature:  (Client signed, their SOL will move!)');
    console.log();
    console.log('   Client signed the transaction - funds will move INSTANTLY!');
    console.log('     Facilitator just adds fee payer signature and broadcasts.');
    console.log();
    console.log('='.repeat(70));
    console.log();

    // Access protected resource (middleware handles everything)
    const resourceData = await accessProtectedResource(paymentRequest);

    console.log(' SUCCESS! Payment processed and access granted!');
    console.log();
    console.log('Response:', JSON.stringify(resourceData, null, 2));
    console.log();

    // Extract transaction signature from response
    if (resourceData.data?.payment?.transactionSignature) {
      const txSig = resourceData.data.payment.transactionSignature;
      console.log('='.repeat(70));
      console.log(' TRUE x402 INSTANT FINALITY COMPLETE!');
      console.log();
      console.log('Transaction Signature:', txSig);
      console.log('View on Solana Explorer:');
      console.log(`https://explorer.solana.com/tx/${txSig}?cluster=devnet`);
      console.log();
      console.log('='.repeat(70));
      console.log();
      console.log(' Summary (TRUE x402 Instant Finality):');
      console.log();
      console.log('  Client Side:');
      console.log('     Signed authorization payload (Ed25519, replay protection)');
      console.log('     Created Solana transaction (Client → Merchant transfer)');
      console.log('     Signed transaction (authorized their SOL to move)');
      console.log('     Sent signed transaction to facilitator');
      console.log();
      console.log('  Facilitator Side:');
      console.log('     Verified authorization signature');
      console.log('     Checked nonce (replay protection)');
      console.log('     Verified client transaction signature');
      console.log('     Added signature as fee payer (pays gas)');
      console.log('     Broadcast transaction to Solana');
      console.log('     Waited for confirmation');
      console.log();
      console.log('  Result:');
      console.log("     CLIENT'S SOL moved to merchant (instant finality!) ");
      console.log('     Facilitator paid gas fee ');
      console.log('     NO debt tracking (on-chain settlement) ');
      console.log('     Protected resource delivered ');
      console.log();
      console.log(' This IS TRUE x402 protocol!');
      console.log("   Client's funds committed instantly on-chain!");
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

runTest();
