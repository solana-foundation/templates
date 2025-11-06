/**
 * PM2 Ecosystem Configuration
 * Manages both facilitator and server processes
 *
 * Uses node_args to load dotenv which loads .env file
 */

module.exports = {
  apps: [
    {
      name: 'x402-facilitator',
      script: './dist/facilitator/index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      cwd: process.cwd(),
      node_args: '-r dotenv/config',
      error_file: './logs/facilitator-error.log',
      out_file: './logs/facilitator-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
    {
      name: 'x402-server',
      script: './dist/server/index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      cwd: process.cwd(),
      node_args: '-r dotenv/config',
      error_file: './logs/server-error.log',
      out_file: './logs/server-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
