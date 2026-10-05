// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { address } from "@solana/kit";

const mocks = vi.hoisted(() => ({
  balance: 0n,
  failBalance: false,
  supportsV1: true,
  send: vi.fn(),
  rent: vi.fn(),
  reads: vi.fn(),
}));

vi.mock("@solana/react", async (importOriginal) => {
  const original = await importOriginal<typeof import("@solana/react")>();
  const payer = { address: "11111111111111111111111111111112" };
  const client = {
    payer,
    wallet: {
      getState: () => ({
        connected: {
          signer: payer,
          supportedTransactionVersions: new Set(mocks.supportsV1 ? [1] : [0]),
        },
      }),
    },
    rpc: {
      getBalance: () => async () => {
        mocks.reads();
        if (mocks.failBalance) throw new Error("RPC unavailable");
        return { value: mocks.balance };
      },
      getMinimumBalanceForRentExemption: () => ({ send: mocks.rent }),
    },
  };
  return {
    ...original,
    useClient: () => client,
    usePayer: () => payer,
    useSendTransaction: () => ({ dispatchAsync: mocks.send, isRunning: false }),
  };
});

vi.mock("@solana/kit-plugin-wallet/react", () => ({
  useConnectedWallet: () => ({
    supportedTransactionVersions: new Set(mocks.supportsV1 ? [1] : [0]),
  }),
}));

vi.mock("../src/generated/vault", () => ({
  findVaultPda: async () => [address("11111111111111111111111111111113"), 255],
  getDepositInstruction: vi.fn((input) => input),
  getWithdrawInstruction: vi.fn((input) => input),
}));

import { VaultCard } from "../src/VaultCard";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.balance = 0n;
  mocks.failBalance = false;
  mocks.supportsV1 = true;
  mocks.rent.mockResolvedValue(890880n);
  mocks.send.mockResolvedValue({ context: { signature: "test-signature" } });
});
afterEach(cleanup);

test.each([0n, 1000000000n])(
  "V0-only wallets cannot send from a vault with %s lamports",
  async (balance) => {
    mocks.supportsV1 = false;
    mocks.balance = balance;
    render(<VaultCard />);
    await screen.findByText(/This wallet does not support Version 1/);
    await waitFor(() => expect(mocks.reads).toHaveBeenCalled());
    fireEvent.change(screen.getByRole("textbox", { name: "Amount in SOL" }), {
      target: { value: "1" },
    });
    const deposit = screen.getByRole("button", { name: "Deposit" });
    const withdraw = screen.getByRole("button", { name: "Withdraw All" });
    expect(deposit.hasAttribute("disabled")).toBe(true);
    expect(withdraw.hasAttribute("disabled")).toBe(true);
    fireEvent.click(deposit);
    fireEvent.click(withdraw);
    expect(mocks.rent).not.toHaveBeenCalled();
    expect(mocks.send).not.toHaveBeenCalled();
  }
);

test("losing V1 support during preparation prevents signing", async () => {
  let finishRent!: (value: bigint) => void;
  mocks.rent.mockReturnValueOnce(
    new Promise<bigint>((resolve) => {
      finishRent = resolve;
    })
  );
  render(<VaultCard />);
  fireEvent.change(screen.getByRole("textbox", { name: "Amount in SOL" }), {
    target: { value: "1" },
  });
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Deposit" }).hasAttribute("disabled")
    ).toBe(false)
  );
  fireEvent.click(screen.getByRole("button", { name: "Deposit" }));
  mocks.supportsV1 = false;
  finishRent(890880n);
  await waitFor(() =>
    expect(
      screen.queryAllByRole("button", { name: "Confirming..." })
    ).toHaveLength(0)
  );
  expect(mocks.send).not.toHaveBeenCalled();
});

test("deposit preparation blocks duplicate submissions", async () => {
  let finishRent!: (value: bigint) => void;
  mocks.rent.mockReturnValueOnce(
    new Promise<bigint>((resolve) => {
      finishRent = resolve;
    })
  );
  render(<VaultCard />);
  fireEvent.change(screen.getByRole("textbox", { name: "Amount in SOL" }), {
    target: { value: "1" },
  });
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Deposit" }).hasAttribute("disabled")
    ).toBe(false)
  );
  const deposit = screen.getByRole("button", { name: "Deposit" });
  fireEvent.click(deposit);
  fireEvent.click(deposit);
  expect(mocks.rent).toHaveBeenCalledTimes(1);
  finishRent(890880n);
  await screen.findByText("Deposited! Signature: test-signature");
  expect(mocks.send).toHaveBeenCalledTimes(1);
});

test("unmounting during preparation does not open a wallet prompt", async () => {
  let finishRent!: (value: bigint) => void;
  mocks.rent.mockReturnValueOnce(
    new Promise<bigint>((resolve) => {
      finishRent = resolve;
    })
  );
  const view = render(<VaultCard />);
  fireEvent.change(screen.getByRole("textbox", { name: "Amount in SOL" }), {
    target: { value: "1" },
  });
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Deposit" }).hasAttribute("disabled")
    ).toBe(false)
  );
  fireEvent.click(screen.getByRole("button", { name: "Deposit" }));
  view.unmount();
  finishRent(890880n);
  await waitFor(() => expect(mocks.rent).toHaveResolved());
  expect(mocks.send).not.toHaveBeenCalled();
});

test("refresh discovers funds added elsewhere and enables withdrawal", async () => {
  render(<VaultCard />);
  await waitFor(() =>
    expect(
      screen
        .getByRole("button", { name: "Refresh vault balance" })
        .hasAttribute("disabled")
    ).toBe(false)
  );
  expect(
    screen
      .getByRole("button", { name: "Withdraw All" })
      .hasAttribute("disabled")
  ).toBe(true);
  mocks.balance = 1000000000n;
  fireEvent.click(
    screen.getByRole("button", { name: "Refresh vault balance" })
  );
  await waitFor(() =>
    expect(
      screen
        .getByRole("button", { name: "Withdraw All" })
        .hasAttribute("disabled")
    ).toBe(false)
  );
});

test("a failed confirmation refreshes the balance without resending", async () => {
  mocks.balance = 1000000000n;
  mocks.send.mockImplementationOnce(async () => {
    mocks.balance = 0n;
    throw new Error("Confirmation timed out");
  });
  render(<VaultCard />);
  await waitFor(() =>
    expect(
      screen
        .getByRole("button", { name: "Withdraw All" })
        .hasAttribute("disabled")
    ).toBe(false)
  );
  fireEvent.click(screen.getByRole("button", { name: "Withdraw All" }));
  await screen.findByText("Error: Confirmation timed out");
  await waitFor(() => expect(mocks.reads).toHaveBeenCalledTimes(2));
  expect(
    screen
      .getByRole("button", { name: "Withdraw All" })
      .hasAttribute("disabled")
  ).toBe(true);
  expect(mocks.send).toHaveBeenCalledTimes(1);
});

test("retry recovers from a balance RPC error", async () => {
  mocks.failBalance = true;
  render(<VaultCard />);
  await screen.findByRole("alert");
  mocks.failBalance = false;
  mocks.balance = 1000000000n;
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  expect(
    screen
      .getByRole("button", { name: "Withdraw All" })
      .hasAttribute("disabled")
  ).toBe(false);
});
