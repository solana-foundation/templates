import type { Address, KeyPairSigner, TransactionSendingSigner } from '@solana/kit';
import { Transaction } from '@tuwaio/sdk/pulsar';
import type { SolanaClient } from '@tuwaio/solana-sdk/orbit';

import { close } from '@/transactions/solana/close';
import { decrement } from '@/transactions/solana/decrement';
import { increment as incrementSolana } from '@/transactions/solana/increment';
import { initialize } from '@/transactions/solana/initialize';

export type BaseTxParams = {
  client: SolanaClient;
  signer: TransactionSendingSigner;
  contractAddress: Address;
};

export const txActions = {
  incrementSolana: ({ client, signer, contractAddress }: BaseTxParams) =>
    incrementSolana({ client, signer, contractAddress }),
  decrementSolana: ({ client, signer, contractAddress }: BaseTxParams) =>
    decrement({ client, signer, contractAddress }),
  closeSolana: ({ client, signer, contractAddress }: BaseTxParams) => close({ client, signer, contractAddress }),
  initializeSolana: ({
    client,
    signer,
    contractAddress,
  }: Omit<BaseTxParams, 'contractAddress'> & { contractAddress: KeyPairSigner<string> }) =>
    initialize({ client, signer, contractAddress }),
};

export enum TxType {
  initialize = 'initialize',
  increment = 'increment',
  decrement = 'decrement',
  close = 'close',
}

type InitializeTx = Transaction & {
  type: TxType.initialize;
  payload: {
    contractAddress: string;
  };
};

type IncrementTx = Transaction & {
  type: TxType.increment;
  payload: {
    contractAddress: string;
    value: number;
  };
};

type DecrementTx = Transaction & {
  type: TxType.decrement;
  payload: {
    contractAddress: string;
    value: number;
  };
};

type CloseTx = Transaction & {
  type: TxType.close;
  payload: {
    contractAddress: string;
  };
};

export type TransactionUnion = InitializeTx | IncrementTx | DecrementTx | CloseTx;
