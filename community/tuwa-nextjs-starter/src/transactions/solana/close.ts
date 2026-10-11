import { signAndSendSolanaTx } from '@tuwaio/solana-sdk/pulsar';

import { PROGRAM_ID } from '@/constants';
import { getCloseInstruction } from '@/programs';
import { BaseTxParams } from '@/transactions';

export function close({ client, signer, contractAddress }: BaseTxParams) {
  return signAndSendSolanaTx({
    client,
    signer,
    instruction: getCloseInstruction({ payer: signer, solanatest: contractAddress }, { programAddress: PROGRAM_ID }),
  });
}
