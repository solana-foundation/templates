import type { KeyPairSigner } from '@solana/kit';
import { signAndSendSolanaTx } from '@tuwaio/solana-sdk/pulsar';

import { PROGRAM_ID } from '@/constants';
import { getInitializeInstruction } from '@/programs';
import { BaseTxParams } from '@/transactions';

export async function initialize({
  client,
  signer,
  contractAddress,
}: Omit<BaseTxParams, 'contractAddress'> & { contractAddress: KeyPairSigner<string> }) {
  return signAndSendSolanaTx({
    client,
    signer,
    instruction: getInitializeInstruction(
      { payer: signer, solanatest: contractAddress },
      { programAddress: PROGRAM_ID },
    ),
  });
}
