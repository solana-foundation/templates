"use client";

import { useState } from "react";
import { signTransactionMessageWithSigners, type Address } from "@solana/kit";
import { toast } from "sonner";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { useAppClient } from "../client-provider";
import { bytesToBase64, type SignedAuthProof } from "../auth";
import { parseTransactionError } from "../errors";

export function useHardwareSignIn(onSignedIn: () => void) {
  const client = useAppClient();
  const connected = useConnectedWallet(client);
  const [isSigningIn, setIsSigningIn] = useState(false);

  async function signIn() {
    if (!connected?.signer) return;
    const signer = connected.signer;
    const address = connected.account.address as Address;

    setIsSigningIn(true);
    try {
      const { nonce } = await getJson<{ nonce: string }>(
        await fetch("/api/nonce")
      );

      // Hardware wallets cannot sign arbitrary messages, so sign a memo
      // transaction carrying the nonce. planTransaction() builds it; it is never sent.
      const message = await client.memo.instructions
        .addMemo({ memo: nonce, signers: [signer] })
        .planTransaction();
      const signedTx = await signTransactionMessageWithSigners(message);

      const signature = signedTx.signatures[address];
      if (!signature) throw new Error("Wallet did not sign the transaction.");

      const proof: SignedAuthProof = {
        address,
        messageBytesBase64: bytesToBase64(signedTx.messageBytes),
        signatureBase64: bytesToBase64(signature),
      };

      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...proof, nonce }),
      });
      if (!res.ok) {
        const { error } = await getJson<{ error: string }>(res);
        throw new Error(error ?? "Verification failed.");
      }

      toast.success("Signed in with hardware wallet");
      onSignedIn();
    } catch (err) {
      console.error(err);
      toast.error(parseTransactionError(err));
    } finally {
      setIsSigningIn(false);
    }
  }

  return { signIn, isSigningIn };
}

async function getJson<T>(res: Response): Promise<T> {
  return (await res.json()) as T;
}
