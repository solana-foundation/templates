import { address, createSolanaRpc } from "@solana/kit";
import { ClientProvider } from "@solana/react";
import { Surfnet } from "@solana/surfpool";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useMemo } from "react";
import { Toaster } from "sonner";
import { afterAll, afterEach, beforeAll, expect, test } from "vitest";
import { AirdropCard } from "../app/components/actions/airdrop-card";
import { MemoCard } from "../app/components/actions/memo-card";
import { TransferSolCard } from "../app/components/actions/transfer-sol-card";
import { ClusterProvider } from "../app/components/cluster-context";
import { WalletButton } from "../app/components/wallet-button";
import { ellipsify } from "../app/lib/explorer";
import { createAppClient } from "../app/lib/solana-client";
import { mockWalletAddress, registerMockWallet } from "./mock-wallet";

const LAMPORTS_PER_SOL = 1_000_000_000;

let surfnet: Surfnet;
let rpc: ReturnType<typeof createSolanaRpc>;

beforeAll(() => {
  surfnet = Surfnet.start();
  rpc = createSolanaRpc(surfnet.rpcUrl);
  surfnet.fundSol(mockWalletAddress, 5 * LAMPORTS_PER_SOL);
  registerMockWallet();
}, 60_000);

afterAll(() => {
  surfnet?.stop();
});

afterEach(cleanup);

function TestApp() {
  const client = useMemo(
    () =>
      createAppClient("localnet", {
        rpcUrl: surfnet.rpcUrl,
        rpcSubscriptionsUrl: surfnet.wsUrl,
      }),
    []
  );
  return (
    <ClusterProvider>
      <ClientProvider client={client}>
        <WalletButton />
        <AirdropCard />
        <TransferSolCard />
        <MemoCard />
        <Toaster />
      </ClientProvider>
    </ClusterProvider>
  );
}

async function getBalance(owner: string): Promise<bigint> {
  const { value } = await rpc
    .getBalance(address(owner), { commitment: "confirmed" })
    .send();
  return value;
}

async function connectWallet() {
  fireEvent.click(screen.getByRole("button", { name: "Connect Wallet" }));
  fireEvent.click(await screen.findByRole("button", { name: "Mock Wallet" }));
  return await screen.findByRole("button", {
    name: ellipsify(mockWalletAddress),
  });
}

test("connects the mock wallet and shows its on-chain balance", async () => {
  // fundSol sets the absolute balance, pinning the displayed amount no matter
  // what the other tests have spent.
  surfnet.fundSol(mockWalletAddress, 5 * LAMPORTS_PER_SOL);
  render(<TestApp />);

  const walletButton = await connectWallet();
  fireEvent.click(walletButton);

  await screen.findByText(mockWalletAddress);
  await waitFor(
    () => {
      const balance = screen.getByText("Balance").nextElementSibling;
      expect(balance?.textContent).toBe("5 SOL");
    },
    { timeout: 10_000 }
  );
});

test("airdrop button funds the connected wallet", async () => {
  render(<TestApp />);
  await connectWallet();

  const before = await getBalance(mockWalletAddress);
  fireEvent.click(screen.getByRole("button", { name: "Airdrop 1 SOL" }));

  await screen.findByText("Airdropped 1 SOL");
  await waitFor(async () => {
    expect(await getBalance(mockWalletAddress)).toBe(
      before + BigInt(LAMPORTS_PER_SOL)
    );
  });
});

test("signs and sends a SOL transfer that moves lamports on-chain", async () => {
  const recipient = Surfnet.newKeypair().publicKey;
  render(<TestApp />);
  await connectWallet();

  expect(await getBalance(recipient)).toBe(0n);
  const senderBefore = await getBalance(mockWalletAddress);

  fireEvent.change(screen.getByPlaceholderText("Recipient address"), {
    target: { value: recipient },
  });
  fireEvent.change(screen.getByPlaceholderText("Amount (SOL)"), {
    target: { value: "1" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Send SOL" }));

  await screen.findByText("SOL transfer sent", {}, { timeout: 15_000 });
  expect(await getBalance(recipient)).toBe(BigInt(LAMPORTS_PER_SOL));
  // The sender pays the transferred lamports plus transaction fees.
  expect(await getBalance(mockWalletAddress)).toBeLessThan(
    senderBefore - BigInt(LAMPORTS_PER_SOL)
  );
});

test("posts a memo and records it in the transaction logs", async () => {
  render(<TestApp />);
  await connectWallet();

  fireEvent.click(screen.getByRole("button", { name: "Post memo" }));
  await screen.findByText("Memo posted", {}, { timeout: 15_000 });

  const signatures = await rpc
    .getSignaturesForAddress(address(mockWalletAddress), { limit: 1 })
    .send();
  expect(signatures.length).toBeGreaterThan(0);
  const transaction = await rpc
    .getTransaction(signatures[0].signature, {
      encoding: "json",
      maxSupportedTransactionVersion: 0,
    })
    .send();
  expect(transaction?.meta?.logMessages?.join("\n")).toContain(
    "gm from @solana/kit"
  );
});
