"use client";

import { useState } from "react";
import { BN } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useAnchorProgram } from "../../hooks/useAnchorProgram";
import { useSolBalance } from "../../hooks/useSolBalance";
import { findStakeAccountPda, findVaultPda, findMintAuthorityPda } from "../../lib/pdas";
import { parseAnchorError } from "../../lib/types";

interface StakeFormProps {
  receiptMint: PublicKey;
  stakedAmount?: number;
  onSuccess?: () => void;
}

export function StakeForm({ receiptMint, stakedAmount = 0, onSuccess }: StakeFormProps) {
  const { publicKey } = useWallet();
  const program = useAnchorProgram();
  const { balance, refresh: refreshBalance } = useSolBalance();
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onMax = () => {
    if (balance != null) setAmount(String(Math.max(0, Math.floor(balance - 0.01))));
  };

  const onSubmit = async () => {
    if (!publicKey || !program) { toast.error("Connect your wallet first"); return; }
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) { toast.error("Enter a valid amount > 0"); return; }
    if (!Number.isInteger(parsed)) {
      toast.error("Only whole SOL amounts are supported right now");
      return;
    }
    if (balance != null && parsed > balance) { toast.error("Insufficient SOL balance"); return; }

    setSubmitting(true);
    const toastId = toast.loading("Submitting stake transaction…");
    try {
      const stakeAccount = findStakeAccountPda(publicKey);
      const vault = findVaultPda(publicKey);
      const mintAuthority = findMintAuthorityPda();
      const associatedTokenAccount = getAssociatedTokenAddressSync(receiptMint, publicKey);

      await (program as any).methods
        .stake(new BN(parsed))
        .accountsStrict({
          signer: publicKey,
          stakeAccount,
          mintAccount: receiptMint,
          associatedTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          vault,
          mintAuthority,
          systemProgram: SystemProgram.programId
        })
        .rpc();

      toast.success(`Staked ${parsed} SOL successfully!`, { id: toastId });
      setAmount("");
      await refreshBalance();
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
        <span>Wallet balance</span>
        <span className="text-slate-950 font-medium">
          {balance != null ? `${balance.toFixed(4)} SOL` : "—"}
        </span>
      </div>
      <div className="flex justify-between text-xs text-slate-600">
        <span>Currently staked</span>
        <span className="text-slate-950 font-medium">{stakedAmount} SOL</span>
      </div>

      <div className="relative">
        <input
          type="number"
          min={1}
          step={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-16 text-sm text-slate-950 outline-none focus:ring-2 focus:ring-slate-900/20 transition"
        />
        <button
          onClick={onMax}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-slate-900 px-2 py-0.5 text-xs text-slate-950 hover:bg-slate-100 transition"
        >
          Max
        </button>
      </div>

      <button
        onClick={onSubmit}
        disabled={submitting || !publicKey}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <span className="flex items-center gap-2 justify-center">
            <span className="h-3 w-3 rounded-full border-2 border-t-transparent border-white animate-spin" />
            Staking…
          </span>
        ) : "Stake SOL"}
      </button>
    </div>
  );
}
