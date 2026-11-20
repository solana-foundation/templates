import { test } from 'node:test';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

test('public middleware type accepts a signed wire transaction', () => {
  execFileSync(
    process.execPath,
    [
      fileURLToPath(new URL('../node_modules/typescript/bin/tsc', import.meta.url)),
      '--noEmit',
      '--strict',
      '--skipLibCheck',
      '--esModuleInterop',
      '--target',
      'ES2022',
      '--module',
      'NodeNext',
      '--moduleResolution',
      'NodeNext',
      fileURLToPath(new URL('./payment-contract.ts', import.meta.url)),
    ],
    { stdio: 'pipe' }
  );
});
