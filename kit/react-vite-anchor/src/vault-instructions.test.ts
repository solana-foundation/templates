import { address, createNoopSigner, AccountRole } from "@solana/kit";
import { describe, expect, it } from "vitest";
import {
  findVaultPda,
  getDepositInstruction,
  getWithdrawInstruction,
  getDepositInstructionDataDecoder,
  VAULT_PROGRAM_ADDRESS,
} from "./generated/vault";

describe("generated vault instructions with Kit 8", () => {
  const signer = createNoopSigner(address("11111111111111111111111111111112"));
  it("derives a distinct vault for each owner", async () => {
    const first = await findVaultPda({ signer: signer.address });
    const second = await findVaultPda({
      signer: address("11111111111111111111111111111113"),
    });
    expect(first[0]).not.toBe(second[0]);
  });
  it("retains exact amounts and the owner signer", async () => {
    const [vault] = await findVaultPda({ signer: signer.address });
    const amount = 9_007_199_254_740_993n;
    const ix = getDepositInstruction({ signer, vault, amount });
    expect(ix.programAddress).toBe(VAULT_PROGRAM_ADDRESS);
    expect(ix.accounts[0]).toMatchObject({
      address: signer.address,
      role: AccountRole.WRITABLE_SIGNER,
      signer,
    });
    expect(ix.accounts[1]).toMatchObject({
      address: vault,
      role: AccountRole.WRITABLE,
    });
    expect(getDepositInstructionDataDecoder().decode(ix.data).amount).toBe(
      amount
    );
  });
  it("withdraws with the same owner and vault", async () => {
    const [vault] = await findVaultPda({ signer: signer.address });
    const ix = getWithdrawInstruction({ signer, vault });
    expect(ix.accounts[0]).toMatchObject({
      address: signer.address,
      role: AccountRole.WRITABLE_SIGNER,
      signer,
    });
    expect(ix.accounts[1].address).toBe(vault);
    expect(ix.data.length).toBe(8);
  });
});
