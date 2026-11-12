import { type Address, type Base58EncodedBytes, getBase58Decoder, parseBase64RpcAccount } from '@solana/kit';
import type { SolanaClient } from '@tuwaio/solana-sdk/orbit';

import { decodeSolanatest, SOLANATEST_DISCRIMINATOR } from './solanatest/generated';

export * from './solanatest/generated';

/**
 * Fetches and decodes the counter accounts of the program: the accounts whose data starts with the discriminator of
 * the `Solanatest` account.
 */
export async function getSolanatestProgramAccounts(rpc: SolanaClient['rpc'], programAddress: Address) {
  const accounts = await rpc
    .getProgramAccounts(programAddress, {
      encoding: 'base64',
      filters: [
        {
          memcmp: {
            offset: 0n,
            bytes: getBase58Decoder().decode(SOLANATEST_DISCRIMINATOR) as Base58EncodedBytes,
            encoding: 'base58',
          },
        },
      ],
    })
    .send();

  return accounts.map(({ pubkey, account }) => decodeSolanatest(parseBase64RpcAccount(pubkey, account)));
}
