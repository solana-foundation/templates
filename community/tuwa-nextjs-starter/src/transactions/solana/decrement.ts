import { signAndSendSolanaTx } from '@tuwaio/solana-sdk/pulsar';

import { PROGRAM_ID } from '@/constants';
import { getDecrementInstruction } from '@/programs';
import { BaseTxParams } from '@/transactions';

export function decrement({ client, signer, contractAddress }: BaseTxParams) {
  return signAndSendSolanaTx({
    client,
    signer,
    instruction: getDecrementInstruction({ solanatest: contractAddress }, { programAddress: PROGRAM_ID }),
  });
}
