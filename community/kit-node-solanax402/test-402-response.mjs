#!/usr/bin/env node

/**
 * Test HTTP 402 Payment Required Response
 *
 * This test verifies that the server correctly returns HTTP 402
 * when no payment is provided.
 */

import { config } from 'dotenv';

// Load environment variables
config();

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
const PROTECTED_RESOURCE = '/api/premium-data';

console.log(' Testing HTTP 402 Payment Required Response\n');
console.log('='.repeat(70));
console.log();

async function testNoPayment() {
  console.log(' Sending request WITHOUT X-Payment header...');
  console.log(`   URL: ${SERVER_URL}${PROTECTED_RESOURCE}`);
  console.log();

  try {
    const response = await fetch(`${SERVER_URL}${PROTECTED_RESOURCE}`, {
      method: 'GET',
      headers: {
        // No X-Payment header!
      },
    });

    console.log(' Response received:');
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log();

    if (response.status === 402) {
      console.log(' SUCCESS! Server returned HTTP 402 Payment Required');
      console.log();

      const data = await response.json();
      console.log(' Response body:');
      console.log(JSON.stringify(data, null, 2));
      console.log();

      console.log(' Payment requirements:');
      if (data.accepts && data.accepts.length > 0) {
        const paymentInfo = data.accepts[0];
        console.log(
          `   Amount: ${paymentInfo.maxAmountRequired} lamports (${Number(paymentInfo.maxAmountRequired) / 1_000_000_000} SOL)`
        );
        console.log(`   Asset: ${paymentInfo.asset}`);
        console.log(`   Pay To: ${paymentInfo.payTo}`);
        console.log(`   Network: ${paymentInfo.network}`);
        console.log(`   Resource: ${paymentInfo.resource}`);
      }
      console.log();
      console.log('='.repeat(70));
      console.log(' HTTP 402 middleware is working correctly!');
      console.log('   The server properly rejects requests without payment.');
    } else if (response.status === 200) {
      console.log(' ERROR! Server returned HTTP 200 OK');
      console.log('   This resource should require payment!');
      console.log('   The x402 middleware may not be configured correctly.');
    } else {
      console.log(`  Unexpected status: ${response.status}`);
      const text = await response.text();
      console.log('Response:', text);
    }
  } catch (error) {
    console.error(' Request failed:', error.message);
    console.error();
    console.error('Make sure the server is running:');
    console.error('  npm start');
    process.exit(1);
  }
}

testNoPayment();
