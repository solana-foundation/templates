import { Account } from '@wallet-ui/react-native-kit'
import type { SolanaClient } from '@/features/cluster/data-access/create-solana-client'
import { Address, TransactionSendingSigner } from '@solana/kit'
import { useMutation } from '@tanstack/react-query'
import { executeWalletSignAndSendTransaction } from '@/features/wallet/util/execute-wallet-sign-and-send-transaction'

export interface UseWalletSignAndSendTransactionProps {
  account: Account
  client: SolanaClient
  getTransactionSigner: (address: Address, minContextSlot: bigint) => TransactionSendingSigner
}

export function useWalletSignAndSendTransaction({
  account,
  client,
  getTransactionSigner,
}: UseWalletSignAndSendTransactionProps) {
  return useMutation({
    mutationFn: (text: string) => executeWalletSignAndSendTransaction({ account, client, getTransactionSigner, text }),
  })
}
