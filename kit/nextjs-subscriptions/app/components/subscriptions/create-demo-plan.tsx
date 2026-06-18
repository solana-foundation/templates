"use client";

import { useState } from "react";
import { generateKeyPairSigner } from "@solana/kit";
import { getCreateAccountInstruction } from "@solana-program/system";
import {
  getCreateAssociatedTokenIdempotentInstructionAsync,
  getInitializeMint2Instruction,
  getMintSize,
  getMintToInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { useWallet } from "../../lib/wallet/context";
import { useSolanaClient } from "../../lib/solana-client-context";
import { useSubscriptionsClient } from "../../lib/hooks/use-subscriptions-client";
import { useSendTransaction } from "../../lib/hooks/use-send-transaction";
import { useMerchant } from "../../lib/hooks/use-merchant";
import { getAtaAddress } from "../../lib/subscriptions/pdas";
import { DEFAULT_DECIMALS } from "../../lib/subscriptions/constants";
import { parseTransactionError } from "../../lib/errors";

const D = 10n ** BigInt(DEFAULT_DECIMALS);

export function CreateDemoPlan() {
  const { signer } = useWallet();
  const solana = useSolanaClient();
  const client = useSubscriptionsClient();
  const { send } = useSendTransaction();
  const { setMerchant } = useMerchant();
  const { mutate } = useSWRConfig();
  const [busy, setBusy] = useState(false);

  const handleCreate = async () => {
    if (!signer || !client) return;
    setBusy(true);
    try {
      const mint = await generateKeyPairSigner();
      const space = BigInt(getMintSize());
      const rent = await solana.rpc
        .getMinimumBalanceForRentExemption(space)
        .send();
      const ataIx = await getCreateAssociatedTokenIdempotentInstructionAsync({
        payer: signer,
        owner: signer.address,
        mint: mint.address,
      });
      const ata = await getAtaAddress(signer.address, mint.address);
      await send({
        instructions: [
          getCreateAccountInstruction({
            payer: signer,
            newAccount: mint,
            lamports: rent,
            space,
            programAddress: TOKEN_PROGRAM_ADDRESS,
          }),
          getInitializeMint2Instruction({
            mint: mint.address,
            decimals: DEFAULT_DECIMALS,
            mintAuthority: signer.address,
          }),
          ataIx,
          getMintToInstruction({
            mint: mint.address,
            token: ata,
            mintAuthority: signer,
            amount: 1000n * D,
          }),
        ],
      });

      await client.subscriptions.instructions
        .createPlan({
          planId: BigInt(Date.now()),
          mint: mint.address,
          amount: 10n * D,
          periodHours: 720n,
          endTs: 0n,
          destinations: [],
          pullers: [],
          metadataUri: "",
        })
        .sendTransaction();

      setMerchant(signer.address);
      mutate((key) => Array.isArray(key) && key[0] === "plans");
      toast.success("Demo plan created — you can subscribe now");
    } catch (err) {
      console.error("Create demo plan failed:", err);
      toast.error(parseTransactionError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-border-low bg-card p-6">
      <h2 className="text-sm font-semibold">No plans yet</h2>
      <p className="mt-1 max-w-md text-xs text-muted">
        Create a demo plan with your connected wallet as the merchant. This
        mints test tokens to you and sets you as the active merchant so you can
        try subscribing. For a real app, set{" "}
        <code className="font-mono text-foreground">
          NEXT_PUBLIC_MERCHANT_ADDRESS
        </code>{" "}
        instead. Needs devnet SOL —{" "}
        <a
          href="https://faucet.solana.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline transition hover:text-foreground"
        >
          get some
        </a>
        .
      </p>
      <button
        onClick={handleCreate}
        disabled={busy}
        className="mt-4 cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
      >
        {busy ? "Creating..." : "Create demo plan"}
      </button>
    </div>
  );
}
