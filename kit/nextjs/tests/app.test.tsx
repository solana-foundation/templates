import { address, createSolanaRpc } from "@solana/kit";
import { fetchMint, fetchToken } from "@solana-program/token";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Surfnet } from "@template-tests/surfpool-runtime";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useMemo } from "react";
import { Toaster } from "sonner";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  test,
} from "vitest";
import { AirdropCard } from "../app/components/actions/airdrop-card";
import { MemoCard } from "../app/components/actions/memo-card";
import { TokenCard } from "../app/components/actions/token-card";
import { TransferSolCard } from "../app/components/actions/transfer-sol-card";
import { ClusterProvider } from "../app/components/cluster-context";
import { WalletButton } from "../app/components/wallet-button";
import { AppClientProvider } from "../app/lib/client-provider";
import {
  mockWalletAddress,
  registerMockWallet,
  resetMockWallet,
} from "./mock-wallet";

const LAMPORTS_PER_SOL = 1_000_000_000;

let surfnet: Surfnet;
let rpc: ReturnType<typeof createSolanaRpc>;

beforeAll(async () => {
  surfnet = await Surfnet.start();
  // The Kit 8 plugin uses Memo v4, so the adapter preloads the pinned fixture.
  const memoBinary = readFileSync(
    resolve(process.cwd(), "tests/fixtures/spl_memo_v4.so")
  );
  expect(createHash("sha256").update(memoBinary).digest("hex")).toBe(
    "0c92063c6838d9ad8af50aaefea9a166b5bb41a2bfa2bc6327d7db320849bc78"
  );
  surfnet.deploy();
  rpc = createSolanaRpc(surfnet.rpcUrl);
  await surfnet.fundSol(mockWalletAddress, 5 * LAMPORTS_PER_SOL);
  registerMockWallet();
}, 60_000);

afterAll(() => {
  surfnet?.stop();
});

beforeEach(() => {
  localStorage.clear();
  resetMockWallet();
});

afterEach(cleanup);

function TestApp({ tokens = false }: { tokens?: boolean }) {
  const urls = useMemo(
    () => ({
      rpcUrl: surfnet.rpcUrl,
      rpcSubscriptionsUrl: surfnet.wsUrl,
    }),
    []
  );
  return (
    <ClusterProvider>
      <AppClientProvider urls={urls}>
        <WalletButton />
        {tokens ? (
          <TokenCard />
        ) : (
          <>
            <AirdropCard />
            <TransferSolCard />
            <MemoCard />
          </>
        )}
        <Toaster />
      </AppClientProvider>
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
  fireEvent.click(
    await screen.findByRole("button", { name: "Connect Wallet" })
  );
  fireEvent.click(await screen.findByRole("button", { name: "Mock Wallet" }));
  return await screen.findByRole("button", {
    name: `Wallet ${mockWalletAddress}`,
  });
}

test("connects the mock wallet and shows its on-chain balance", async () => {
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
  const recipient = (await Surfnet.newKeypair()).publicKey;
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
      maxSupportedTransactionVersion: 1,
    })
    .send();
  expect(transaction?.version).toBe(1);
  expect(transaction?.meta?.logMessages?.join("\n")).toContain(
    "gm from @solana/kit"
  );
});

test("creates a mint, mints tokens, and transfers to new and existing token accounts", async () => {
  render(<TestApp tokens />);
  await connectWallet();
  fireEvent.click(
    screen.getByRole("button", { name: "Create mint (9 decimals)" })
  );
  await screen.findByText("Token mint created", {}, { timeout: 15_000 });

  const mintLink = screen
    .getAllByRole("link")
    .find((link) => link.getAttribute("href")?.includes("/address/"));
  expect(mintLink).toBeTruthy();
  const mint = address(
    new URL(mintLink!.getAttribute("href")!).pathname.split("/").at(-1)!
  );
  const created = await fetchMint(rpc, mint);
  expect(created.data.decimals).toBe(9);
  expect(created.data.supply).toBe(0n);
  expect(created.data.mintAuthority).toEqual({
    __option: "Some",
    value: mockWalletAddress,
  });

  fireEvent.click(screen.getByRole("button", { name: "Mint to my wallet" }));
  await screen.findByText(
    "Tokens minted to your wallet",
    {},
    { timeout: 15_000 }
  );
  const senderAta = address(await surfnet.getAta(mockWalletAddress, mint));
  expect((await fetchToken(rpc, senderAta)).data.amount).toBe(100_000_000_000n);
  expect((await fetchMint(rpc, mint)).data.supply).toBe(100_000_000_000n);

  const recipient = (await Surfnet.newKeypair()).publicKey;
  const recipientAta = address(await surfnet.getAta(recipient, mint));
  expect(
    (await rpc.getAccountInfo(recipientAta, { encoding: "base64" }).send())
      .value
  ).toBeNull();
  fireEvent.change(screen.getByLabelText("Recipient address"), {
    target: { value: recipient },
  });
  fireEvent.click(screen.getByRole("button", { name: "Transfer tokens" }));
  await waitFor(
    async () => {
      const received = await fetchToken(rpc, recipientAta);
      expect(received.data.amount).toBe(10_000_000_000n);
      expect(received.data.owner).toBe(recipient);
      expect(received.data.mint).toBe(mint);
      expect((await fetchToken(rpc, senderAta)).data.amount).toBe(
        90_000_000_000n
      );
    },
    { timeout: 15_000 }
  );

  // Repeat with an existing ATA and a fractional amount to catch scaling errors.
  fireEvent.change(screen.getByLabelText("Amount to transfer"), {
    target: { value: "0.000000001" },
  });
  const transferButton = await screen.findByRole("button", {
    name: "Transfer tokens",
  });
  await waitFor(() =>
    expect((transferButton as HTMLButtonElement).disabled).toBe(false)
  );
  fireEvent.click(transferButton);
  await waitFor(
    async () => {
      expect((await fetchToken(rpc, recipientAta)).data.amount).toBe(
        10_000_000_001n
      );
      expect((await fetchToken(rpc, senderAta)).data.amount).toBe(
        89_999_999_999n
      );
      expect((await fetchMint(rpc, mint)).data.supply).toBe(100_000_000_000n);
    },
    { timeout: 15_000 }
  );
}, 60_000);
