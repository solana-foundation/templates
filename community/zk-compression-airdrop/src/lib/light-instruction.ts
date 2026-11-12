import { address, addSignersToInstruction, AccountRole, type TransactionSigner } from '@solana/kit'
import type { TransactionInstruction } from '@solana/web3.js'

// Light 0.22 supplies web3.js instructions; Kit owns transaction construction and signing.
export function toKitInstruction(instruction: TransactionInstruction, signers: readonly TransactionSigner[]) {
  return addSignersToInstruction([...signers], {
    programAddress: address(instruction.programId.toBase58()),
    accounts: instruction.keys.map((key) => ({
      address: address(key.pubkey.toBase58()),
      // Light uses its program ID as the placeholder for an absent writable SOL pool.
      // Executable program accounts themselves must remain readonly in Kit messages.
      role: key.pubkey.equals(instruction.programId)
        ? AccountRole.READONLY
        : key.isSigner
          ? key.isWritable
            ? AccountRole.WRITABLE_SIGNER
            : AccountRole.READONLY_SIGNER
          : key.isWritable
            ? AccountRole.WRITABLE
            : AccountRole.READONLY,
    })),
    data: new Uint8Array(instruction.data),
  })
}
