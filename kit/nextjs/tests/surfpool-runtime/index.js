import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  address,
  generateKeyPairSigner,
  getAddressEncoder,
  getProgramDerivedAddress,
} from "@solana/kit";

const RPC_URL = process.env.SOLANA_TEST_RPC_URL ?? "http://127.0.0.1:8899";
const WS_URL = process.env.SOLANA_TEST_WS_URL ?? "ws://127.0.0.1:8900";
const TOKEN_PROGRAM = address("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const ASSOCIATED_TOKEN_PROGRAM = address(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);
const MEMO_PROGRAM = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";

function getLocalWsUrl(rpcUrl) {
  const url = new URL(rpcUrl);
  const rpcPort = Number(url.port || (url.protocol === "https:" ? 443 : 80));
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.port = String(rpcPort + 1);
  return url.toString();
}

async function getFreePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const { port } = server.address();
  await new Promise((resolve) => server.close(resolve));
  return port;
}

async function isPortAvailable(port) {
  const server = createServer();
  return new Promise((resolve) => {
    const finish = (available) => {
      server.close(() => resolve(available));
    };
    server.once("error", () => finish(false));
    server.listen(port, "127.0.0.1", () => finish(true));
  });
}

async function getFreePortPair() {
  for (let attempt = 0; attempt < 20; attempt++) {
    const rpcPort = await getFreePort();
    if (rpcPort < 65535 && (await isPortAvailable(rpcPort + 1))) {
      return rpcPort;
    }
  }
  throw new Error("Could not find adjacent free RPC and WebSocket ports");
}

async function rpc(method, params, rpcUrl = RPC_URL) {
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const result = await response.json();
  if (result.error) throw new Error(JSON.stringify(result.error));
  return result.result;
}

export class Surfnet {
  static async start() {
    if (process.env.SOLANA_TEST_RPC_URL) {
      const runtime = new Surfnet(null, null, false);
      await runtime.waitForHealth();
      await runtime.assertMemoProgram();
      return runtime;
    }
    const ledgerDir =
      process.env.SOLANA_TEST_LEDGER_DIR ??
      mkdtempSync(join(tmpdir(), "kit-nextjs-validator-"));
    const rpcPort = await getFreePortPair();
    const rpcUrl = new URL(RPC_URL);
    rpcUrl.port = String(rpcPort);
    const localRpcUrl = rpcUrl.toString();
    const validator = spawn(
      process.env.SOLANA_TEST_VALIDATOR ?? "solana-test-validator",
      [
        "--reset",
        "--quiet",
        "--ledger",
        ledgerDir,
        "--rpc-port",
        String(rpcPort),
        "--bpf-program",
        MEMO_PROGRAM,
        resolve(process.cwd(), "tests/fixtures/spl_memo_v4.so"),
      ],
      { stdio: ["ignore", "ignore", "pipe"] }
    );
    const runtime = new Surfnet(
      validator,
      ledgerDir,
      true,
      getLocalWsUrl(localRpcUrl),
      localRpcUrl
    );
    await runtime.waitForHealth();
    return runtime;
  }

  async waitForHealth() {
    for (let attempt = 0; attempt < 60; attempt++) {
      try {
        await rpc("getHealth", [], this.rpcUrl);
        return;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }
    this.stop();
    throw new Error(
      `Agave test validator did not start${this.errorOutput ? `: ${this.errorOutput}` : ""}`
    );
  }

  async assertMemoProgram() {
    const account = await rpc(
      "getAccountInfo",
      [MEMO_PROGRAM, { encoding: "base64" }],
      this.rpcUrl
    );
    if (!account?.value) {
      throw new Error(
        "Configured test validator must preload the Memo v4 program"
      );
    }
  }

  constructor(
    process,
    ledgerDir,
    ownsValidator,
    wsUrl = WS_URL,
    rpcUrl = RPC_URL
  ) {
    this.process = process;
    this.ledgerDir = ledgerDir;
    this.ownsValidator = ownsValidator;
    this.errorOutput = "";
    process?.stderr?.on("data", (chunk) => {
      this.errorOutput = `${this.errorOutput}${chunk}`.trim().slice(-4000);
    });
    this.rpcUrl = rpcUrl;
    this.wsUrl = wsUrl;
  }

  async fundSol(owner, amount) {
    const signature = await rpc(
      "requestAirdrop",
      [owner, Number(amount)],
      this.rpcUrl
    );
    for (let attempt = 0; attempt < 40; attempt++) {
      const statuses = await rpc(
        "getSignatureStatuses",
        [[signature], { searchTransactionHistory: true }],
        this.rpcUrl
      );
      const status = statuses?.value?.[0];
      if (status?.err) throw new Error(JSON.stringify(status.err));
      if (
        status?.confirmationStatus === "confirmed" ||
        status?.confirmationStatus === "finalized"
      ) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    throw new Error(`Airdrop transaction was not confirmed: ${signature}`);
  }

  deploy() {}

  getAta(owner, mint) {
    return getProgramDerivedAddress({
      programAddress: ASSOCIATED_TOKEN_PROGRAM,
      seeds: [
        getAddressEncoder().encode(address(owner)),
        getAddressEncoder().encode(TOKEN_PROGRAM),
        getAddressEncoder().encode(address(mint)),
      ],
    }).then(([ata]) => ata);
  }

  static async newKeypair() {
    const signer = await generateKeyPairSigner();
    return { publicKey: signer.address, address: signer.address };
  }

  stop() {
    if (!this.ownsValidator) return;
    this.process?.kill();
    if (this.ledgerDir && !process.env.SOLANA_TEST_LEDGER_DIR) {
      rmSync(this.ledgerDir, { force: true, recursive: true });
    }
  }
}
