/**
 * Application Constants
 * Configurable via environment variables with sensible defaults
 */

import 'dotenv/config';

/**
 * HTTP Request Configuration
 */
export const REQUEST_TIMEOUT = Number(process.env.REQUEST_TIMEOUT) || 30000; // 30 seconds
export const RETRY_ATTEMPTS = Number(process.env.RETRY_ATTEMPTS) || 3;
export const RETRY_DELAY = Number(process.env.RETRY_DELAY) || 1000; // 1 second
export const REQUEST_BODY_LIMIT = process.env.REQUEST_BODY_LIMIT || '10mb';

/**
 * Background Task Configuration
 */
export const CLEANUP_INTERVAL_HOURS = Number(process.env.CLEANUP_INTERVAL_HOURS) || 1;
export const CLEANUP_INTERVAL_MS = CLEANUP_INTERVAL_HOURS * 60 * 60 * 1000;

/**
 * Payment Tier Amounts (in lamports)
 * Default values can be overridden via environment variables
 */
export const PAYMENT_AMOUNTS = {
  PREMIUM_DATA: process.env.PREMIUM_DATA_AMOUNT || '10000000', // 0.01 SOL
  GENERATE_CONTENT: process.env.GENERATE_CONTENT_AMOUNT || '5000000', // 0.005 SOL
  DOWNLOAD_FILE: process.env.DOWNLOAD_FILE_AMOUNT || '20000000', // 0.02 SOL
  TIER_ACCESS: process.env.TIER_ACCESS_AMOUNT || '50000000', // 0.05 SOL
};
