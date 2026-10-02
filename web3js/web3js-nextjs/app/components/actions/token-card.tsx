"use client";

import { useCallback, useState } from "react";
import {
  TOKEN_PROGRAM_ADDRESS,
  findAssociatedTokenPda,
  getInitializeMint2Instruction,
  getMintDecoder,
  getMintSize,
  getMintToATAInstructionPlanAsync,
  getTokenDecoder,
  getTransferToATAInstructionPlanAsync,
} from "@solana-program/token";
import { useConnection, useWallet } from "@solana/wallet-adapter";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { toast } from "sonner";
import { formatAmount, getAmountError, parseAmount } from "../../lib/amount";
import { ellipsify } from "../../lib/explorer";
import { useSendTransaction } from "../../lib/hooks/use-send-transaction";
import { useCluster } from "../cluster-context";

const DECIMALS = 9;

type TokenState = { balance: bigint; supply: bigint };

export function TokenCard() {
  const { connection } = useConnection();
  const { publicKey, signer } = useWallet();
  const { getExplorerUrl } = useCluster();
  const { send, isSending } = useSendTransaction();

  const [mint, setMint] = useState<PublicKey | null>(null);
  const [token, setToken] = useState<TokenState | null>(null);
  const [mintAmount, setMintAmount] = useState("100");
  const [recipient, setRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState("10");
  const mintAmountError = getAmountError(mintAmount, DECIMALS);
  const transferAmountError = getAmountError(transferAmount, DECIMALS);

  const refresh = useCallback(
    async (mintKey: PublicKey) => {
      if (!publicKey) return;
      try {
        const [ata] = await findAssociatedTokenPda({
          mint: mintKey.toBase58(),
          owner: publicKey.toBase58(),
          tokenProgram: TOKEN_PROGRAM_ADDRESS,
        });
        const [mintAccount, tokenAccount] = await Promise.all([
          connection.getAccountInfo(mintKey),
          connection.getAccountInfo(new PublicKey(ata)),
        ]);
        setToken({
          supply: mintAccount
            ? getMintDecoder().decode(mintAccount.data).supply
            : 0n,
          balance: tokenAccount
            ? getTokenDecoder().decode(tokenAccount.data).amount
            : 0n,
        });
      } catch (err) {
        console.error(err);
        toast.error("Unable to load token balances.");
      }
    },
    [connection, publicKey]
  );

  const handleCreateMint = async () => {
    if (!publicKey || !signer || mintAmountError) return;

    const newMint = await Keypair.generate();
    const signature = await send(
      async () => {
        const space = getMintSize();
        return new Transaction().add(
          SystemProgram.createAccount({
            fromPubkey: publicKey,
            newAccountPubkey: newMint.publicKey,
            lamports: await connection.getMinimumBalanceForRentExemption(space),
            space,
            programId: new PublicKey(TOKEN_PROGRAM_ADDRESS),
          }),
          getInitializeMint2Instruction({
            mint: newMint.publicKey,
            decimals: DECIMALS,
            mintAuthority: publicKey.toBase58(),
            freezeAuthority: null,
          }),
          await getMintToATAInstructionPlanAsync({
            payer: signer,
            owner: publicKey.toBase58(),
            mint: newMint.publicKey.toBase58(),
            mintAuthority: signer,
            amount: parseAmount(mintAmount, DECIMALS),
            decimals: DECIMALS,
          })
        );
      },
      "Token mint created",
      [newMint]
    );
    if (signature) {
      setMint(newMint.publicKey);
      await refresh(newMint.publicKey);
    }
  };

  const handleMint = async () => {
    if (!publicKey || !signer || !mint || mintAmountError) return;

    const signature = await send(
      async () =>
        new Transaction().add(
          await getMintToATAInstructionPlanAsync({
            payer: signer,
            owner: publicKey.toBase58(),
            mint: mint.toBase58(),
            mintAuthority: signer,
            amount: parseAmount(mintAmount, DECIMALS),
            decimals: DECIMALS,
          })
        ),
      "Tokens minted to your wallet"
    );
    if (signature) {
      await refresh(mint);
    }
  };

  const handleTransfer = async () => {
    if (!signer || !mint || transferAmountError) return;

    let destination: PublicKey;
    try {
      destination = new PublicKey(recipient.trim());
    } catch {
      toast.error("Invalid recipient address");
      return;
    }

    const signature = await send(
      async () =>
        new Transaction().add(
          await getTransferToATAInstructionPlanAsync({
            payer: signer,
            mint: mint.toBase58(),
            authority: signer,
            recipient: destination.toBase58(),
            amount: parseAmount(transferAmount, DECIMALS),
            decimals: DECIMALS,
          })
        ),
      "Tokens transferred"
    );
    if (signature) {
      await refresh(mint);
    }
  };

  return (
    <div className="rounded-2xl border border-border-low bg-card p-6 sm:col-span-2">
      <h2 className="text-sm font-semibold">SPL token</h2>
      <p className="mt-1 text-xs text-muted">
        <code className="font-mono">@solana-program/token</code> instructions
        and plans added straight to a web3.js{" "}
        <code className="font-mono">Transaction</code>. Associated token
        accounts are created idempotently.
      </p>

      {mint && (
        <div className="mt-4 grid gap-2 rounded-lg border border-border-low bg-cream/50 px-3 py-2 text-xs sm:grid-cols-3">
          <p>
            <span className="text-muted">Mint </span>
            <a
              href={getExplorerUrl(`/address/${mint.toBase58()}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono underline"
            >
              {ellipsify(mint.toBase58())}
            </a>
          </p>
          <p>
            <span className="text-muted">Your balance </span>
            <span className="tabular-nums">
              {token ? formatAmount(token.balance, DECIMALS) : "..."}
            </span>
          </p>
          <p>
            <span className="text-muted">Supply </span>
            <span className="tabular-nums">
              {token ? formatAmount(token.supply, DECIMALS) : "..."}
            </span>
          </p>
        </div>
      )}

      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <div className="space-y-3">
          <label
            htmlFor="token-mint-amount"
            className="block text-xs font-medium"
          >
            Amount to mint
          </label>
          <input
            id="token-mint-amount"
            value={mintAmount}
            onChange={(e) => setMintAmount(e.target.value)}
            inputMode="decimal"
            placeholder="Amount to mint"
            aria-describedby={
              mintAmountError ? "token-mint-amount-error" : undefined
            }
            aria-invalid={mintAmountError != null}
            className="w-full rounded-lg border border-border-low bg-background px-3 py-2 text-sm outline-none focus:border-ring"
          />
          {mintAmountError && (
            <p
              id="token-mint-amount-error"
              className="text-xs text-destructive"
            >
              {mintAmountError}
            </p>
          )}
          <button
            onClick={mint ? handleMint : handleCreateMint}
            disabled={isSending || mintAmountError != null}
            className="w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            {isSending
              ? "Working..."
              : mint
                ? "Mint more"
                : `Create mint (${DECIMALS} decimals) + mint`}
          </button>
        </div>

        {mint && (
          <div className="space-y-3">
            <label
              htmlFor="token-recipient"
              className="block text-xs font-medium"
            >
              Recipient address
            </label>
            <input
              id="token-recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Recipient address"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="w-full rounded-lg border border-border-low bg-background px-3 py-2 font-mono text-xs outline-none focus:border-ring"
            />
            <label
              htmlFor="token-transfer-amount"
              className="block text-xs font-medium"
            >
              Amount to transfer
            </label>
            <input
              id="token-transfer-amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              inputMode="decimal"
              placeholder="Amount to transfer"
              aria-describedby={
                transferAmountError ? "token-transfer-amount-error" : undefined
              }
              aria-invalid={transferAmountError != null}
              className="w-full rounded-lg border border-border-low bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            />
            {transferAmountError && (
              <p
                id="token-transfer-amount-error"
                className="text-xs text-destructive"
              >
                {transferAmountError}
              </p>
            )}
            <button
              onClick={handleTransfer}
              disabled={
                isSending || !recipient.trim() || transferAmountError != null
              }
              className="w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
            >
              {isSending ? "Working..." : "Transfer tokens"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
