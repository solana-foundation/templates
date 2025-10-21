/**
 * Facilitator Context - Gill template pattern
 * Centralized dependency injection for the facilitator
 */

import { createKeyPairSignerFromBytes } from 'gill';
import type { Address, KeyPairSigner } from 'gill';
import bs58 from 'bs58';
import { SolanaUtils } from './solana-utils.js';
import { NonceDatabase } from './nonce-database.js';
import { FacilitatorConfig, getFacilitatorConfig } from './get-facilitator-config.js';
import { ApiLogger, log } from './api-logger.js';

export interface FacilitatorContext {
  config: FacilitatorConfig;
  log: ApiLogger;
  facilitatorKeypair: KeyPairSigner;
  facilitatorAddress: Address;
  solanaUtils: SolanaUtils;
  nonceDb: NonceDatabase;
}

let context: FacilitatorContext | undefined;

export async function getFacilitatorContext(): Promise<FacilitatorContext> {
  if (context) {
    return context;
  }

  const config = getFacilitatorConfig();

  // Initialize facilitator keypair
  const privateKeyBytes = bs58.decode(config.facilitatorPrivateKey);
  const facilitatorKeypair = await createKeyPairSignerFromBytes(privateKeyBytes);
  const facilitatorAddress = facilitatorKeypair.address;

  // Initialize Solana utilities
  const solanaUtils = new SolanaUtils({
    rpcEndpoint: config.solanaRpcUrl,
    rpcSubscriptionsEndpoint: config.solanaWsUrl,
  });

  // Initialize nonce database
  const nonceDb = new NonceDatabase(config.databasePath);

  context = {
    config,
    log,
    facilitatorKeypair,
    facilitatorAddress,
    solanaUtils,
    nonceDb,
  };

  return context;
}
