#!/usr/bin/env node

/**
 * Generate a fixed client keypair for testing
 * Run this once to create the keypair, then fund it with devnet SOL
 */

import nacl from 'tweetnacl';
import bs58 from 'bs58';
import fs from 'fs';

const KEYPAIR_FILE = './test-client-keypair.json';

// Check if keypair already exists
if (fs.existsSync(KEYPAIR_FILE)) {
  console.log(' Client keypair already exists!\n');
  const saved = JSON.parse(fs.readFileSync(KEYPAIR_FILE, 'utf-8'));

  console.log('╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║  EXISTING CLIENT KEYPAIR                                             ║');
  console.log('╚══════════════════════════════════════════════════════════════════════╝');
  console.log();
  console.log('Public Key:', saved.publicKey);
  console.log();
  console.log('To fund this wallet with devnet SOL:');
  console.log();
  console.log('Option 1: Solana CLI');
  console.log(`  solana airdrop 1 ${saved.publicKey}`);
  console.log();
  console.log('Option 2: Web faucet');
  console.log(`  https://faucet.solana.com/?address=${saved.publicKey}`);
  console.log();
  console.log('Check balance:');
  console.log(`  solana balance ${saved.publicKey}`);
  console.log();
  console.log('Delete keypair and regenerate:');
  console.log('  rm test-client-keypair.json && node generate-test-client.mjs');
  console.log();
  process.exit(0);
}

// Generate new keypair
console.log(' Generating new client keypair...\n');

const clientKeypair = nacl.sign.keyPair();
const publicKeyBase58 = bs58.encode(clientKeypair.publicKey);
const secretKeyBase58 = bs58.encode(clientKeypair.secretKey);

// Save keypair
const keypairData = {
  publicKey: publicKeyBase58,
  secretKey: secretKeyBase58,
};

fs.writeFileSync(KEYPAIR_FILE, JSON.stringify(keypairData, null, 2));

console.log(' Client keypair generated and saved!\n');
console.log('╔══════════════════════════════════════════════════════════════════════╗');
console.log('║  NEW CLIENT KEYPAIR                                                  ║');
console.log('╚══════════════════════════════════════════════════════════════════════╝');
console.log();
console.log(' Public Key:', publicKeyBase58);
console.log();
console.log(' Saved to:', KEYPAIR_FILE);
console.log();
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log();
console.log(' FUND THIS WALLET WITH DEVNET SOL');
console.log();
console.log('This wallet needs SOL to make payments in tests.');
console.log();
console.log('Option 1: Use Solana CLI');
console.log(`  solana airdrop 1 ${publicKeyBase58}`);
console.log();
console.log('Option 2: Use web faucet');
console.log(`  https://faucet.solana.com/?address=${publicKeyBase58}`);
console.log();
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log();
console.log('Check balance:');
console.log(`  solana balance ${publicKeyBase58}`);
console.log();
console.log('After funding, run tests with:');
console.log('  node test-real-devnet.mjs');
console.log();
