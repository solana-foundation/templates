import { useConnection, useWallet } from "@solana/wallet-adapter";
import { isPublicMainnetEndpoint } from "../../lib/cluster";
import { useCluster } from "../../lib/cluster-context";
import { SignMessageCard } from "./sign-message-card";
import { TokenCard } from "./token-card";
import { TransferSolCard } from "./transfer-sol-card";
import { WalletCard } from "./wallet-card";

const RESTORING_STATUSES = new Set(["pending", "reconnecting"]);

export function ActionsPanel() {
  const { publicKey, signer, status } = useWallet();
  const { connection } = useConnection();
  const { cluster } = useCluster();

  if (!publicKey && RESTORING_STATUSES.has(status)) {
    return (
      <div
        className="mt-8 rounded-2xl border border-border-low bg-card p-6 text-sm text-muted"
        role="status"
      >
        Restoring wallet connection...
      </div>
    );
  }

  if (!publicKey) {
    return (
      <div className="mt-8 rounded-2xl border border-border-low bg-card p-6 text-sm text-muted">
        Connect a wallet to try the on-chain actions.
      </div>
    );
  }

  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2">
      {cluster === "mainnet" && (
        <p className="rounded-lg border border-border-low bg-card px-4 py-3 text-sm text-muted sm:col-span-2">
          Mainnet transactions use real SOL and tokens. Review every wallet
          prompt before signing.
          {isPublicMainnetEndpoint(connection.rpcEndpoint) && (
            <>
              {" "}
              The public mainnet RPC rejects most browser requests — set{" "}
              <code className="font-mono">VITE_MAINNET_RPC_URL</code> in{" "}
              <code className="font-mono">.env</code> to a private endpoint.
            </>
          )}
        </p>
      )}
      <WalletCard />
      {signer && <TransferSolCard />}
      <SignMessageCard key={publicKey.toBase58()} />
      {signer ? (
        <TokenCard
          key={`${cluster}:${publicKey.toBase58()}`}
          owner={publicKey}
          signer={signer}
        />
      ) : (
        <p className="rounded-lg border border-border-low bg-card px-4 py-3 text-sm text-muted">
          This wallet account is connected in read-only mode and cannot sign
          transactions. Connect a signing-capable account to transfer SOL or use
          the token actions.
        </p>
      )}
    </section>
  );
}
