"use client";

import { useState } from "react";
import { BN } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useAnchorProgram } from "../../hooks/useAnchorProgram";
import { findStakeAccountPda, findVaultPda } from "../../lib/pdas";
import { parseAnchorError } from "../../lib/types";

interface UnstakeFormProps {
  receiptMint: PublicKey;
  stakedAmount: number;
  onSuccess?: () => void;
}

export function UnstakeForm({ receiptMint, stakedAmount, onSuccess }: UnstakeFormProps) {
  const { publicKey } = useWallet();
  const program = useAnchorProgram();
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onAll = () => setAmount(String(stakedAmount));

  const onSubmit = async () => {
    if (!publicKey || !program) { toast.error("Connect your wallet first"); return; }
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) { toast.error("Enter a valid amount > 0"); return; }
    if (!Number.isInteger(parsed)) {
      toast.error("Only whole SOL amounts are supported right now");
      return;
    }
    if (parsed > stakedAmount) { toast.error(`Cannot unstake more than ${stakedAmount} SOL`); return; }

    setSubmitting(true);
    const toastId = toast.loading("Submitting unstake transaction…");
    try {
      const stakeAccount = findStakeAccountPda(publicKey);
      const vault = findVaultPda(publicKey);
      const associatedTokenAccount = getAssociatedTokenAddressSync(receiptMint, publicKey);

      await (program as any).methods
        .unstake(new BN(parsed))
        .accountsStrict({
          signer: publicKey,
          stakeAccount,
          mintAccount: receiptMint,
          associatedTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          vault,
          systemProgram: SystemProgram.programId
        })
        .rpc();

      toast.success(`Unstaked ${parsed} SOL successfully!`, { id: toastId });
      setAmount("");
      onSuccess?.();
    } catch (e) {
      toast.error(parseAnchorError(e), { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-xs text-slate-600">
        <span>Currently staked</span>
        <span className="text-slate-950 font-medium">{stakedAmount} SOL</span>
      </div>
      <div className="flex justify-between text-xs text-slate-600">
        <span>You will receive</span>
        <span className="text-emerald-600 font-medium">
          {amount ? `~${amount} SOL` : "—"}
        </span>
      </div>

      <div className="relative">
        <input
          type="number"
          min={1}
          step={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-24 text-sm text-slate-950 outline-none focus:ring-2 focus:ring-slate-900/20 transition"
        />
        <button
          onClick={onAll}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-slate-900 px-2 py-0.5 text-xs text-slate-950 hover:bg-slate-100 transition"
        >
          All
        </button>
      </div>

      <button
        onClick={onSubmit}
        disabled={submitting || !publicKey || stakedAmount === 0}
        className="w-full inline-flex items-center justify-center rounded-lg border border-slate-900 bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border-2 border-t-transparent border-slate-900 animate-spin" />
            Unstaking…
          </span>
        ) : "Unstake SOL"}
      </button>
    </div>
  );
}
