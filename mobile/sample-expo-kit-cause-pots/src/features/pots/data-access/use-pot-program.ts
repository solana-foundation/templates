import {
  findPotPda,
  getAddContributorInstruction,
  getContributeInstructionAsync,
  getCreatePotInstructionAsync,
  getReleaseFundsInstructionAsync,
  getSignReleaseInstruction,
  type Currency,
  type PotCategory,
} from '@project/anchor'
import type { Address } from '@solana/kit'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { useSendInstructions } from './use-send-instructions'

// The write side of the pots feature: each mutation builds instructions with
// the generated client and sends them through the wallet.
export function usePotProgram() {
  const { account, chain } = useMobileWallet()
  const queryClient = useQueryClient()
  const sendInstructions = useSendInstructions()

  // Refresh pot data even when a mutation fails: the wallet may have submitted
  // the transaction after the app stopped waiting for it.
  const onSettled = () =>
    Promise.all(
      ['activity', 'balance', 'pot', 'pot-contributors', 'pots'].map((key) =>
        queryClient.invalidateQueries({ queryKey: [key] }),
      ),
    )

  return {
    // Creates the pot and adds the selected friends in the same transaction.
    createPotMutation: useMutation({
      mutationFn: async (params: {
        category: PotCategory
        contributors: Address[]
        currency: Currency
        description: string
        name: string
        signersRequired: number
        targetAmount: bigint
        unlockDays: bigint
      }) => {
        if (!account) {
          throw new Error('Wallet not connected')
        }
        const transactionSignature = await sendInstructions(async (authority) => {
          const [pot] = await findPotPda({ authority: authority.address, name: params.name })
          return [
            await getCreatePotInstructionAsync({
              authority,
              category: params.category,
              currency: params.currency,
              description: params.description,
              name: params.name,
              signersRequired: params.signersRequired,
              targetAmount: params.targetAmount,
              unlockDays: params.unlockDays,
            }),
            ...params.contributors.map((newContributor) =>
              getAddContributorInstruction({ authority, newContributor, pot }),
            ),
          ]
        })
        const [pot] = await findPotPda({ authority: account.address, name: params.name })
        return { pot, transactionSignature }
      },
      onSettled,
    }),
    addContributorMutation: useMutation({
      mutationFn: ({ newContributor, pot }: { newContributor: Address; pot: Address }) =>
        sendInstructions(async (authority) => [getAddContributorInstruction({ authority, newContributor, pot })]),
      onSettled,
    }),
    contributeMutation: useMutation({
      mutationFn: ({ amount, pot }: { amount: bigint; pot: Address }) =>
        sendInstructions(async (contributor) => [await getContributeInstructionAsync({ amount, contributor, pot })]),
      onSettled,
    }),
    signReleaseMutation: useMutation({
      mutationFn: ({ pot }: { pot: Address }) =>
        sendInstructions(async (signer) => [getSignReleaseInstruction({ pot, signer })]),
      onSettled,
    }),
    releaseFundsMutation: useMutation({
      mutationFn: ({ pot, recipient }: { pot: Address; recipient: Address }) =>
        sendInstructions(async (authority) => [await getReleaseFundsInstructionAsync({ authority, pot, recipient })]),
      onSettled,
    }),
    chain,
  }
}
