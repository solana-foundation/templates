/**
 * Server Context - Gill template pattern
 * Centralized dependency injection for the server
 */

import { ServerConfig, getServerConfig } from './get-server-config.js';
import { ApiLogger, log } from './api-logger.js';

export interface ServerContext {
  config: ServerConfig;
  log: ApiLogger;
}

let context: ServerContext | undefined;

export function getServerContext(): ServerContext {
  if (context) {
    return context;
  }

  const config = getServerConfig();

  context = {
    config,
    log,
  };

  return context;
}
