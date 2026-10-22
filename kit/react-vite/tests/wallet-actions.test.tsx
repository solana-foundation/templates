// @vitest-environment jsdom
import { toAddress, type WalletSession } from "@solana/client";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { WalletActions } from "../src/wallet-actions";

const mocks = vi.hoisted(() => ({
  balance: {
    lamports: 1_000_000_000n as bigint | null,
    error: null as unknown,
  },
  requestAirdrop: vi.fn(),
  send: vi.fn(),
}));
vi.mock("@solana/react-hooks", () => ({
  useBalance: () => mocks.balance,
  useWalletActions: () => ({ requestAirdrop: mocks.requestAirdrop }),
  useSolTransfer: () => ({ send: mocks.send }),
}));

const address = "11111111111111111111111111111111";
const wallet: WalletSession = {
  account: { address: toAddress(address), publicKey: new Uint8Array(32) },
  connector: { id: "test", name: "Test wallet" },
  disconnect: vi.fn(),
  signTransaction: vi.fn(),
};
let container: HTMLDivElement;
let root: Root;

beforeEach(async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.resetAllMocks();
  mocks.balance.lamports = 1_000_000_000n;
  mocks.balance.error = null;
  mocks.requestAirdrop.mockResolvedValue("airdrop-signature");
  mocks.send.mockResolvedValue("transfer-signature");
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(() => root.render(<WalletActions wallet={wallet} />));
});
afterEach(async () => {
  await act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
});

async function submit(amount: string, recipient = address) {
  container.querySelector<HTMLInputElement>("#sol-amount")!.value = amount;
  container.querySelector<HTMLInputElement>("#sol-recipient")!.value =
    recipient;
  await act(() => {
    container
      .querySelector("form")!
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
}

it("requests an airdrop and links to the devnet transaction", async () => {
  await act(() =>
    container.querySelector<HTMLButtonElement>("button")!.click()
  );
  expect(mocks.requestAirdrop).toHaveBeenCalledWith(
    wallet.account.address,
    1_000_000_000n
  );
  expect(container.textContent).toContain("Airdrop requested.");
  expect(container.querySelector('a[href*="/tx/"]')?.getAttribute("href")).toBe(
    "https://explorer.solana.com/tx/airdrop-signature?cluster=devnet"
  );
});

it("sends when the balance covers the transfer and exact base fee", async () => {
  mocks.balance.lamports = 10_005_000n;
  await submit("0.01", ` ${address} `);
  expect(mocks.send).toHaveBeenCalledWith({
    amount: 10_000_000n,
    authority: wallet,
    commitment: "confirmed",
    destination: toAddress(address),
  });
  expect(container.textContent).toContain("SOL transfer submitted.");
});

it.each([
  [1_000_000_000n, "1"],
  [10_004_999n, "0.01"],
  [0n, "0.01"],
])(
  "rejects insufficient funds (%s lamports, %s SOL) before approval",
  async (balance, amount) => {
    mocks.balance.lamports = balance;
    await submit(amount);
    expect(mocks.send).not.toHaveBeenCalled();
    expect(container.querySelector('[role="alert"]')?.textContent).toContain(
      "Insufficient SOL balance"
    );
  }
);

it.each(["loading", "error"])(
  "rejects a balance in the %s state before approval",
  async (state) => {
    if (state === "loading") mocks.balance.lamports = null;
    else mocks.balance.error = new Error("RPC unavailable");
    await submit("0.01");
    expect(mocks.send).not.toHaveBeenCalled();
    expect(container.textContent).toContain(
      "Wait for the balance to load successfully"
    );
  }
);

it("rejects invalid addresses and sub-lamport amounts before approval", async () => {
  await submit("0.01", "invalid-address");
  expect(container.querySelector('[role="alert"]')).not.toBeNull();
  // Exercise the precision guard even if native step validation is bypassed.
  vi.spyOn(container.querySelector("form")!, "reportValidity").mockReturnValue(
    true
  );
  await submit("0.0000000011");
  expect(container.querySelector('[role="alert"]')?.textContent).toContain(
    "9 decimal places"
  );
  expect(mocks.send).not.toHaveBeenCalled();
});

it("shows airdrop failures and re-enables the actions", async () => {
  mocks.requestAirdrop.mockRejectedValue(new Error("Rate limited"));
  await act(() =>
    container.querySelector<HTMLButtonElement>("button")!.click()
  );
  expect(container.querySelector('[role="alert"]')?.textContent).toContain(
    "Airdrop failed"
  );
  expect(container.querySelector<HTMLButtonElement>("button")!.disabled).toBe(
    false
  );
});
