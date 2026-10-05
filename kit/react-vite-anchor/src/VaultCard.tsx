import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  useClient,
  usePayer,
  useRequest,
  useSendTransaction,
} from "@solana/react";
import {
  findVaultPda,
  getDepositInstruction,
  getWithdrawInstruction,
} from "./generated/vault";
import type { AppClient } from "./solana-client";
import { parseSolAmount } from "./amount";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";

export function VaultCard() {
  const client = useClient<AppClient>();
  const payer = usePayer(client);
  const connectedWallet = useConnectedWallet(client);
  const supportsV1 =
    connectedWallet?.supportedTransactionVersions.has(1) ?? false;
  const walletAddress = payer?.address;
  const { dispatchAsync: send, isRunning } = useSendTransaction(client);
  const pending = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const [isPreparing, setIsPreparing] = useState(false);
  const isSending = isRunning || isPreparing;
  const [amount, setAmount] = useState("");
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const pdaSource = useMemo(
    () =>
      walletAddress ? () => findVaultPda({ signer: walletAddress }) : null,
    [walletAddress]
  );
  const pda = useRequest(pdaSource);
  const vaultAddress = pda.data?.[0];
  const balanceSource = useMemo(
    () =>
      vaultAddress
        ? client.rpc.getBalance(vaultAddress, { commitment: "confirmed" })
        : null,
    [client, vaultAddress]
  );
  const balance = useRequest(balanceSource);
  const refreshBalance = balance.refresh;
  const vaultLamports = balance.data?.value ?? 0n;
  const vaultSol = Number(vaultLamports) / 1_000_000_000;
  const balanceReady = balance.status === "success";
  let depositAmount: bigint | null = null;
  try {
    depositAmount = parseSolAmount(amount);
  } catch {
    /* Invalid input keeps Deposit disabled. */
  }

  const handleDeposit = useCallback(async () => {
    if (
      !payer ||
      !supportsV1 ||
      !vaultAddress ||
      !balanceReady ||
      pending.current
    )
      return;
    pending.current = true;
    setIsPreparing(true);
    try {
      const lamports = parseSolAmount(amount);
      const rent = await client.rpc
        .getMinimumBalanceForRentExemption(0n)
        .send();
      // Preparation may finish after the user changes or disconnects accounts.
      const currentWallet = client.wallet.getState().connected;
      if (
        !mounted.current ||
        currentWallet?.signer !== payer ||
        !currentWallet.supportedTransactionVersions.has(1)
      )
        return;
      if (lamports <= rent)
        throw new Error("Deposit must exceed the vault's rent-exempt minimum.");
      setTxStatus("Awaiting signature and confirmation...");
      const result = await send([
        getDepositInstruction({
          signer: payer,
          vault: vaultAddress,
          amount: lamports,
        }),
      ]);
      setTxStatus(`Deposited! Signature: ${result.context.signature}`);
      setAmount("");
      refreshBalance();
    } catch (err) {
      if (mounted.current) refreshBalance();
      setTxStatus(
        `Error: ${err instanceof Error ? err.message : "Deposit failed"}`
      );
    } finally {
      pending.current = false;
      setIsPreparing(false);
    }
  }, [
    payer,
    supportsV1,
    vaultAddress,
    balanceReady,
    amount,
    client,
    send,
    refreshBalance,
  ]);

  const handleWithdraw = useCallback(async () => {
    if (
      !payer ||
      !supportsV1 ||
      !vaultAddress ||
      !balanceReady ||
      pending.current
    )
      return;
    pending.current = true;
    setIsPreparing(true);
    try {
      setTxStatus("Awaiting signature and confirmation...");
      const result = await send([
        getWithdrawInstruction({ signer: payer, vault: vaultAddress }),
      ]);
      setTxStatus(`Withdrawn! Signature: ${result.context.signature}`);
      refreshBalance();
    } catch (err) {
      if (mounted.current) refreshBalance();
      setTxStatus(
        `Error: ${err instanceof Error ? err.message : "Withdrawal failed"}`
      );
    } finally {
      pending.current = false;
      setIsPreparing(false);
    }
  }, [payer, supportsV1, vaultAddress, balanceReady, send, refreshBalance]);

  if (!payer) {
    return (
      <section className="w-full max-w-3xl space-y-4 rounded-2xl border border-border-low bg-card p-6 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.35)]">
        <div className="space-y-1">
          <p className="text-lg font-semibold">SOL Vault</p>
          <p className="text-sm text-muted">
            Connect your wallet to interact with the vault program.
          </p>
        </div>
        <div className="rounded-lg bg-cream/50 p-4 text-center text-sm text-muted">
          Wallet not connected
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-3xl space-y-4 rounded-2xl border border-border-low bg-card p-6 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.35)]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-lg font-semibold">SOL Vault</p>
          <p className="text-sm text-muted">
            Deposit SOL into your personal vault PDA and withdraw anytime.
          </p>
        </div>
        <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground/80">
          {!balanceReady
            ? "Loading"
            : vaultLamports > 0n
              ? "Has funds"
              : "Empty"}
        </span>
      </div>

      {/* Vault Balance */}
      <div className="rounded-xl border border-border-low bg-cream/30 p-4">
        <p className="text-xs uppercase tracking-wide text-muted">
          Vault Balance
        </p>
        <button
          type="button"
          aria-label="Refresh vault balance"
          disabled={isSending || !vaultAddress || balance.status === "fetching"}
          onClick={() => refreshBalance()}
          className="text-sm underline disabled:cursor-not-allowed disabled:opacity-40"
        >
          Refresh
        </button>
        <p className="mt-1 text-3xl font-bold tabular-nums">
          {balanceReady ? vaultSol.toFixed(9) : "..."}{" "}
          <span className="text-lg font-normal text-muted">SOL</span>
        </p>
        {vaultAddress && (
          <p className="mt-2 truncate font-mono text-xs text-muted">
            {vaultAddress}
          </p>
        )}
      </div>

      {/* Deposit Form */}
      {!supportsV1 && (
        <p role="alert" className="text-sm text-red-600">
          This wallet does not support Version 1 transactions. Connect a
          V1-capable wallet to deposit or withdraw.
        </p>
      )}
      <div className="space-y-3">
        <div className="flex gap-3">
          <input
            type="text"
            inputMode="decimal"
            aria-label="Amount in SOL"
            placeholder="Amount in SOL"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isSending}
            className="min-w-0 flex-1 rounded-lg border border-border-low bg-card px-4 py-2.5 text-sm outline-none transition placeholder:text-muted focus:border-foreground/30 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <button
            onClick={handleDeposit}
            disabled={
              isSending ||
              !supportsV1 ||
              !balanceReady ||
              depositAmount === null ||
              vaultLamports > 0n
            }
            className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSending ? "Confirming..." : "Deposit"}
          </button>
        </div>
        {vaultLamports > 0n && (
          <p className="text-xs text-muted">
            Vault already has funds. Withdraw first before depositing again.
          </p>
        )}
      </div>

      {/* Withdraw Button */}
      <button
        onClick={handleWithdraw}
        disabled={
          isSending || !supportsV1 || !balanceReady || vaultLamports === 0n
        }
        className="w-full rounded-lg border border-border-low bg-card px-4 py-2.5 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSending ? "Confirming..." : "Withdraw All"}
      </button>

      {pda.error || balance.error ? (
        <div role="alert" className="text-sm text-red-600">
          Unable to load vault data.
          <button
            onClick={() => {
              pda.refresh();
              balance.refresh();
            }}
            className="ml-2 underline"
          >
            Retry
          </button>
        </div>
      ) : null}

      {/* Status */}
      {txStatus && (
        <div
          role="status"
          className="break-all rounded-lg border border-border-low bg-cream/50 px-4 py-3 text-sm"
        >
          {txStatus}
        </div>
      )}

      {/* Educational Footer */}
      <div className="border-t border-border-low pt-4 text-xs text-muted">
        <p className="mb-2">
          This vault is an{" "}
          <a
            href="https://www.anchor-lang.com/docs"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-2"
          >
            Anchor program
          </a>{" "}
          deployed on devnet. Want to deploy your own?
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.anchor-lang.com/docs/quickstart"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md bg-cream px-2 py-1 font-medium transition hover:bg-cream/70"
          >
            Anchor Quickstart
          </a>
          <a
            href="https://solana.com/docs/programs/deploying"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md bg-cream px-2 py-1 font-medium transition hover:bg-cream/70"
          >
            Deploy Programs
          </a>
          <a
            href="https://github.com/ZYJLiu/anchor-vault-template"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md bg-cream px-2 py-1 font-medium transition hover:bg-cream/70"
          >
            Reference Repo
          </a>
        </div>
      </div>
    </section>
  );
}
