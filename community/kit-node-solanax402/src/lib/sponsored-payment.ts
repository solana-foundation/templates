import {
  address,
  appendTransactionMessageInstruction,
  compileTransaction,
  createTransactionMessage,
  decompileTransactionMessage,
  getBase64Codec,
  getCompiledTransactionMessageDecoder,
  getTransactionDecoder,
  partiallySignTransaction,
  setTransactionMessageConfig,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  assertIsTransactionWithinSizeLimit,
  type Address,
  type KeyPairSigner,
  type BlockhashLifetimeConstraint,
} from '@solana/kit';
import { getTransferSolInstruction, parseTransferSolInstruction, SYSTEM_PROGRAM_ADDRESS } from '@solana-program/system';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

export interface ExpectedPayment {
  clientPublicKey: string;
  recipient: string;
  amount: string;
}

export async function createSponsoredPayment(params: {
  client: KeyPairSigner;
  facilitator: Address;
  recipient: Address;
  amount: bigint;
  lifetime: BlockhashLifetimeConstraint;
}) {
  if (params.amount <= 0n || params.amount > 0xffffffffffffffffn) throw new Error('Invalid payment amount');
  if (params.client.address === params.facilitator) throw new Error('Client and facilitator must be different');
  const message = appendTransactionMessageInstruction(
    getTransferSolInstruction({ source: params.client, destination: params.recipient, amount: params.amount }),
    setTransactionMessageConfig(
      { computeUnitLimit: 200_000, loadedAccountsDataSizeLimit: 65_536 },
      setTransactionMessageLifetimeUsingBlockhash(
        params.lifetime,
        setTransactionMessageFeePayer(params.facilitator, createTransactionMessage({ version: 1 }))
      )
    )
  );
  return partiallySignTransaction([params.client.keyPair], compileTransaction(message));
}

export function validateSponsoredPayment(serialized: string, facilitator: Address, expected: ExpectedPayment) {
  const transaction = getTransactionDecoder().decode(getBase64Codec().encode(serialized));
  assertIsTransactionWithinSizeLimit(transaction);
  const compiled = getCompiledTransactionMessageDecoder().decode(transaction.messageBytes);
  if (compiled.version !== 1) throw new Error('Payment transaction must use V1');
  const message = decompileTransactionMessage(compiled);
  const config = message.config;
  if (
    !config?.computeUnitLimit ||
    config.computeUnitLimit > 200_000 ||
    !config.loadedAccountsDataSizeLimit ||
    config.loadedAccountsDataSizeLimit > 65_536 ||
    (config.priorityFeeLamports ?? 0n) !== 0n ||
    config.heapSize !== undefined
  )
    throw new Error('Unsupported sponsored transaction resource or fee configuration');
  if (message.feePayer.address !== facilitator || expected.clientPublicKey === facilitator)
    throw new Error('Invalid sponsored transaction fee payer');
  const instruction = message.instructions[0];
  if (
    message.instructions.length !== 1 ||
    instruction?.programAddress !== SYSTEM_PROGRAM_ADDRESS ||
    instruction.accounts?.length !== 2 ||
    instruction.data?.length !== 12 ||
    new DataView(instruction.data.buffer, instruction.data.byteOffset, 4).getUint32(0, true) !== 2
  )
    throw new Error('Only a single SOL transfer is supported');
  const transfer = parseTransferSolInstruction({
    ...instruction,
    accounts: instruction.accounts,
    data: instruction.data,
  });
  if (
    transfer.accounts.source.address !== expected.clientPublicKey ||
    transfer.accounts.destination.address !== expected.recipient ||
    transfer.data.amount !== BigInt(expected.amount)
  )
    throw new Error('Transaction does not match the authorized payment');
  const client = address(expected.clientPublicKey);
  const signature = transaction.signatures[client];
  if (
    Object.keys(transaction.signatures).length !== 2 ||
    !Object.hasOwn(transaction.signatures, facilitator) ||
    !signature ||
    !nacl.sign.detached.verify(new Uint8Array(transaction.messageBytes), new Uint8Array(signature), bs58.decode(client))
  )
    throw new Error('Invalid client transaction signature');
  return transaction;
}
