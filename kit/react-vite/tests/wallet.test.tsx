import { address, getAddressDecoder } from "@solana/kit";
import { ClientProvider } from "@solana/react";
import { registerWallet } from "@wallet-standard/wallet";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import App from "../src/App";
import { client } from "../src/solana-client";

const account = (lastByte: number) => {
  const publicKey = new Uint8Array(32);
  publicKey[31] = lastByte;
  return {
    address: getAddressDecoder().decode(publicKey),
    publicKey,
    chains: ["solana:devnet"] as const,
    features: ["solana:signTransaction"] as const,
  };
};
const first = account(1);
const second = account(2);
let accounts: readonly ReturnType<typeof account>[] = [];
let rejectConnection = false;
let rejectDisconnection = false;
const listeners = new Set<(change: { accounts: typeof accounts }) => void>();
function changeAccounts(next: typeof accounts) {
  accounts = next;
  for (const listener of listeners) listener({ accounts });
}
const wallet = {
  name: "Test Wallet",
  version: "1.0.0" as const,
  icon: "data:image/png;base64," as const,
  chains: ["solana:devnet"] as const,
  get accounts() {
    return accounts;
  },
  features: {
    "solana:signTransaction": {
      version: "1.0.0" as const,
      supportedTransactionVersions: ["legacy", 0, 1] as const,
      signTransaction: async () => {
        throw new Error(
          "This test wallet must not submit or sign transactions"
        );
      },
    },
    "standard:connect": {
      version: "1.0.0" as const,
      connect: async () => {
        if (rejectConnection) throw new Error("Connection rejected by user");
        changeAccounts([first]);
        return { accounts };
      },
    },
    "standard:disconnect": {
      version: "1.0.0" as const,
      disconnect: async () => {
        if (rejectDisconnection) throw new Error("Disconnection failed");
        changeAccounts([]);
      },
    },
    "standard:events": {
      version: "1.0.0" as const,
      on: (
        _event: "change",
        listener: (change: { accounts: typeof accounts }) => void
      ) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
    },
  },
};
registerWallet(wallet);
afterEach(() => {
  cleanup();
  act(() => changeAccounts([]));
  rejectConnection = false;
  rejectDisconnection = false;
  localStorage.clear();
});
function mount() {
  render(
    <ClientProvider client={client}>
      <App />
    </ClientProvider>
  );
}
async function connect() {
  const button = await screen.findByRole("button", { name: /Test Wallet/ });
  await waitFor(() =>
    expect((button as HTMLButtonElement).disabled).toBe(false)
  );
  fireEvent.click(button);
}
test("connects, updates the selected account, and disconnects", async () => {
  mount();
  await connect();
  await screen.findByText(first.address);
  act(() => changeAccounts([second]));
  await screen.findByText(second.address);
  expect(screen.queryByText(first.address)).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Disconnect" }));
  await screen.findByText("No wallet connected");
});
test("reports a rejected connection and permits retry", async () => {
  mount();
  rejectConnection = true;
  await connect();
  expect((await screen.findByRole("alert")).textContent).toContain(
    "Connection rejected by user"
  );
  expect(screen.queryByText(first.address)).toBeNull();
  rejectConnection = false;
  await connect();
  await screen.findByText(first.address);
  expect(screen.queryByRole("alert")).toBeNull();
});

test("shows the latest action error and clears it after recovery", async () => {
  mount();
  await connect();
  await screen.findByText(first.address);
  rejectDisconnection = true;
  fireEvent.click(screen.getByRole("button", { name: "Disconnect" }));
  await waitFor(() =>
    expect(screen.getByRole("alert").textContent).toContain(
      "Disconnection failed"
    )
  );
  rejectConnection = true;
  await connect();
  await waitFor(() =>
    expect(screen.getByRole("alert").textContent).toContain(
      "Connection rejected by user"
    )
  );
  rejectConnection = false;
  rejectDisconnection = false;
  await connect();
  await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
});
test("plans Version 1 transactions with the connected account as payer", async () => {
  mount();
  await connect();
  await screen.findByText(first.address);
  const message = await client.planTransaction([
    { programAddress: address("11111111111111111111111111111111") },
  ]);
  expect(message.version).toBe(1);
  expect(message.feePayer.address).toBe(first.address);
  act(() => changeAccounts([second]));
  await screen.findByText(second.address);
  const nextMessage = await client.planTransaction([
    { programAddress: address("11111111111111111111111111111111") },
  ]);
  expect(nextMessage.version).toBe(1);
  expect(nextMessage.feePayer.address).toBe(second.address);
});
