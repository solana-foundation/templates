import { signAndSendSolanaTx } from '@tuwaio/solana-sdk/pulsar';

import { PROGRAM_ID } from '@/constants';
import { getIncrementInstruction } from '@/programs';
import { BaseTxParams } from '@/transactions';

export function increment({ client, signer, contractAddress }: BaseTxParams) {
  return signAndSendSolanaTx({
    client,
    signer,
    instruction: getIncrementInstruction({ solanatest: contractAddress }, { programAddress: PROGRAM_ID }),
  });
}
