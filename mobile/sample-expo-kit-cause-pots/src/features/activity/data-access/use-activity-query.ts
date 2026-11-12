import {
  CAUSE_POTS_PROGRAM_ADDRESS,
  CausePotsInstruction,
  getAddContributorInstructionDataDecoder,
  getContributeInstructionDataDecoder,
  identifyCausePotsInstruction,
} from '@project/anchor'
import { getBase58Encoder, type Address, type Signature } from '@solana/kit'
import { useQuery } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { usePotsQuery, type PotAccount } from '../../pots/data-access/use-pots-query'

export interface ActivityItem {
  actor?: Address
  amount?: bigint
  // Position of the instruction in its transaction; with the signature it
  // uniquely identifies the item.
  instructionIndex: number
  newContributor?: Address
  pot: Address
  potName: string
  recipient?: Address
  signature: Signature
  // Block time in seconds, when the cluster reports one.
  timestamp: number | null
  type: 'add-contributor' | 'contribute' | 'create-pot' | 'release-funds' | 'sign-release'
}

// Keep the scan bounded: the feed is derived on the fly from RPC history.
const MAX_POTS = 10
const MAX_SIGNATURES_PER_POT = 20

// The activity feed, reconstructed from each pot's transaction history. Every
// event the original app kept in a database is recoverable from the chain: the
// signature list gives the timeline, and the generated instruction parser
// identifies what happened in each transaction.
export function useActivityQuery() {
  const { account, chain, client } = useMobileWallet()
  const potsQuery = usePotsQuery()
  const pots = potsQuery.data

  return useQuery({
    enabled: !!account && !!pots,
    queryKey: ['activity', chain, account?.address, pots?.length],
    queryFn: async (): Promise<ActivityItem[]> => {
      const items = await Promise.all((pots ?? []).slice(0, MAX_POTS).map((pot) => getPotActivity(client.rpc, pot)))
      return items.flat().sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0))
    },
  })
}

type SolanaRpc = ReturnType<typeof useMobileWallet>['client']['rpc']

async function getPotActivity(rpc: SolanaRpc, pot: PotAccount): Promise<ActivityItem[]> {
  const signatures = await rpc.getSignaturesForAddress(pot.address, { limit: MAX_SIGNATURES_PER_POT }).send()
  const items = await Promise.all(
    signatures
      .filter(({ err }) => !err)
      .map(async ({ blockTime, signature }) => {
        const transaction = await rpc
          .getTransaction(signature, { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 })
          .send()
        const instructions = transaction?.transaction.message.instructions ?? []
        // One transaction can hold several instructions (creating a pot adds
        // each selected friend in the same transaction), so the index keeps
        // every activity item unique.
        return instructions.flatMap((instruction, instructionIndex) => {
          // Every instruction takes its pot as the first account; a transaction touching two pots
          // appears in both pots' histories, so each keeps only its own instructions.
          if (
            instruction.programId !== CAUSE_POTS_PROGRAM_ADDRESS ||
            !('data' in instruction) ||
            !('accounts' in instruction) ||
            instruction.accounts[0] !== pot.address
          ) {
            return []
          }
          const item = parseInstruction(instruction.data, instruction.accounts as Address[])
          if (!item) {
            return []
          }
          return [
            {
              ...item,
              instructionIndex,
              pot: pot.address,
              potName: pot.data.name,
              signature,
              timestamp: blockTime === null ? null : Number(blockTime),
            },
          ]
        })
      }),
  )
  return items.flat()
}

// Instruction account orders match the program's account structs; the amounts
// and arguments come from the generated instruction data decoders.
function parseInstruction(
  data: string,
  accounts: Address[],
): Pick<ActivityItem, 'actor' | 'amount' | 'newContributor' | 'recipient' | 'type'> | null {
  const bytes = getBase58Encoder().encode(data)
  // The identifier throws on instruction data it does not recognize; skip
  // those instead of failing the whole feed.
  switch (tryIdentifyInstruction(bytes)) {
    case CausePotsInstruction.AddContributor:
      return {
        actor: accounts[1],
        newContributor: getAddContributorInstructionDataDecoder().decode(bytes).newContributor,
        type: 'add-contributor',
      }
    case CausePotsInstruction.Contribute:
      return {
        actor: accounts[3],
        amount: getContributeInstructionDataDecoder().decode(bytes).amount,
        type: 'contribute',
      }
    case CausePotsInstruction.CreatePot:
      return { actor: accounts[2], type: 'create-pot' }
    case CausePotsInstruction.ReleaseFunds:
      return { actor: accounts[2], recipient: accounts[3], type: 'release-funds' }
    case CausePotsInstruction.SignRelease:
      return { actor: accounts[1], type: 'sign-release' }
    default:
      return null
  }
}

function tryIdentifyInstruction(bytes: Parameters<typeof identifyCausePotsInstruction>[0]) {
  try {
    return identifyCausePotsInstruction(bytes)
  } catch {
    return null
  }
}
