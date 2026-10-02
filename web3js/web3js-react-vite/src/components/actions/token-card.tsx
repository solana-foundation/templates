import { useState } from "react";
import type { TransactionSigner } from "@solana/kit";
import { useConnection } from "@solana/wallet-adapter";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  getInitializeMint2Instruction,
  getMintSize,
  getMintToATAInstructionPlanAsync,
  getTransferToATAInstructionPlanAsync,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { toast } from "sonner";
import { formatAmount, getAmountError, parseAmount } from "../../lib/amount";
import { useCluster } from "../../lib/cluster-context";
import { ellipsify, getExplorerUrl } from "../../lib/explorer";
import { useSendTransaction } from "../../lib/hooks/use-send-transaction";
import { useTokenAccount } from "../../lib/hooks/use-token-account";

const DECIMALS = 9;

type TokenCardProps = {
  owner: PublicKey;
  signer: TransactionSigner;
};

export function TokenCard({ owner, signer }: TokenCardProps) {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const { send, isSending } = useSendTransaction();
  const [mint, setMint] = useState<PublicKey | null>(null);
  const token = useTokenAccount(mint, owner);

  const [mintAmount, setMintAmount] = useState("100");
  const [recipient, setRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState("10");
  const mintAmountError = getAmountError(mintAmount, DECIMALS);
  const transferAmountError = getAmountError(transferAmount, DECIMALS);

  const handleCreateMint = async () => {
    const newMint = await Keypair.generate();
    const signature = await send(
      async () => {
        const space = getMintSize();
        const lamports =
          await connection.getMinimumBalanceForRentExemption(space);
        return new Transaction().add(
          SystemProgram.createAccount({
            fromPubkey: owner,
            newAccountPubkey: newMint.publicKey,
            lamports,
            space,
            programId: new PublicKey(TOKEN_PROGRAM_ADDRESS),
          }),
          getInitializeMint2Instruction({
            mint: newMint.publicKey,
            decimals: DECIMALS,
            mintAuthority: owner.toBase58(),
            freezeAuthority: null,
          }),
          await getMintToATAInstructionPlanAsync({
            payer: signer,
            owner: owner.toBase58(),
            mint: newMint.publicKey.toBase58(),
            mintAuthority: signer,
            amount: parseAmount(mintAmount, DECIMALS),
            decimals: DECIMALS,
          })
        );
      },
      "Token mint created",
      { signers: [newMint] }
    );
    if (signature) setMint(newMint.publicKey);
  };

  const handleMint = async () => {
    if (!mint) return;
    const signature = await send(
      async () =>
        new Transaction().add(
          await getMintToATAInstructionPlanAsync({
            payer: signer,
            owner: owner.toBase58(),
            mint: mint.toBase58(),
            mintAuthority: signer,
            amount: parseAmount(mintAmount, DECIMALS),
            decimals: DECIMALS,
          })
        ),
      "Tokens minted to your wallet"
    );
    if (signature) token.refresh();
  };

  const handleTransfer = async () => {
    if (!mint) return;

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
    if (signature) token.refresh();
  };

  return (
    <div className="rounded-2xl border border-border-low bg-card p-6 sm:col-span-2">
      <h2 className="text-sm font-semibold">SPL token</h2>
      <p className="mt-1 text-xs text-muted">
        <code className="font-mono">@solana-program/token</code> instructions
        and plans added straight to a web3.js{" "}
        <code className="font-mono">Transaction</code> — associated token
        accounts are created idempotently.
      </p>

      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <div className="space-y-3">
          {mint && (
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
              <dt className="text-muted">Mint</dt>
              <dd>
                <a
                  href={getExplorerUrl(`/address/${mint.toBase58()}`, cluster)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono underline"
                >
                  {ellipsify(mint.toBase58())}
                </a>
              </dd>
              <dt className="text-muted">Supply</dt>
              <dd className="tabular-nums">
                {token.data
                  ? formatAmount(token.data.supply, DECIMALS)
                  : token.error != null
                    ? "Unavailable"
                    : "..."}
              </dd>
              <dt className="text-muted">Your balance</dt>
              <dd className="tabular-nums">
                {token.data
                  ? formatAmount(token.data.balance, DECIMALS)
                  : token.error != null
                    ? "Unavailable"
                    : "..."}
              </dd>
            </dl>
          )}
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
                ? "Mint more to my wallet"
                : `Create mint (${DECIMALS} decimals) and mint`}
          </button>
          {mint && (
            <button
              onClick={() => setMint(null)}
              disabled={isSending}
              className="w-full cursor-pointer rounded-lg border border-border-low bg-card px-4 py-2 text-xs font-medium transition hover:bg-cream disabled:pointer-events-none disabled:opacity-50"
            >
              Start over with a new mint
            </button>
          )}
        </div>

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
            disabled={!mint}
            className="w-full rounded-lg border border-border-low bg-background px-3 py-2 font-mono text-xs outline-none focus:border-ring disabled:opacity-50"
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
            disabled={!mint}
            aria-describedby={
              transferAmountError ? "token-transfer-amount-error" : undefined
            }
            aria-invalid={transferAmountError != null}
            className="w-full rounded-lg border border-border-low bg-background px-3 py-2 text-sm outline-none focus:border-ring disabled:opacity-50"
          />
          {mint && transferAmountError && (
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
              !mint ||
              isSending ||
              !recipient.trim() ||
              transferAmountError != null
            }
            className="w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            {isSending
              ? "Working..."
              : mint
                ? "Transfer tokens"
                : "Create a mint first"}
          </button>
        </div>
      </div>
    </div>
  );
}
