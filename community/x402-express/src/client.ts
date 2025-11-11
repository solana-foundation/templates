import {
  Keypair,
  PublicKey,
  VersionedTransaction,
  Connection,
} from "@solana/web3.js";
import { exact as solanaExact } from "@faremeter/payment-solana";
import { wrap } from "@faremeter/fetch";
import { solana } from "@faremeter/info";
import dotenv from "dotenv";
import { ProxyAgent, setGlobalDispatcher } from "undici";
import type { Network, Asset } from "./types.js";
import { asset } from "./config.js";
dotenv.config();

const proxy = process.env.PROXY_URL;
if (proxy) {
  console.log(`using proxy ${proxy}`);
  const proxyAgent = new ProxyAgent(proxy);
  setGlobalDispatcher(proxyAgent);
}

// Load keypair from file
const keypairData = JSON.parse(process.env.SECRET_KEY as string);
const keypair = Keypair.fromSecretKey(Uint8Array.from(keypairData));

console.log(`current address ${keypair.publicKey.toBase58()}`);

const network = process.env.NETWORK || "mainnet-beta";
const connection = new Connection("https://api.mainnet-beta.solana.com");
const tokenInfo = solana.lookupKnownSPLToken(
  network as Network,
  asset as Asset
);
if (!tokenInfo) {
  throw new Error(`${asset} info not found`);
}
const tokenMint = new PublicKey(tokenInfo.address);
console.log(`token mint address ${tokenMint.toBase58()}`);

// Create wallet interface
const wallet = {
  network,
  publicKey: keypair.publicKey,
  updateTransaction: async (tx: VersionedTransaction) => {
    tx.sign([keypair]);
    return tx;
  },
};

const main = async () => {
  // Setup payment handler
  const handler = solanaExact.createPaymentHandler(
    wallet,
    tokenMint,
    connection
  );
  const fetchWithPayer = wrap(fetch, { handlers: [handler] });
  // const fetchWithoutPayer = fetch;

  // // Call the API - payment happens automatically
  // const response = await fetchWithPayer("https://helius.api.corbits.dev", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     jsonrpc: "2.0",
  //     id: 1,
  //     method: "getBlockHeight",
  //   }),
  // });

  const response = await fetchWithPayer(
    "https://x402-express.vercel.app/api/protected"
  ).catch((error) => {
    console.error(error);
    return null;
  });

  const data = await response.json();
  console.log(data);
};

main();
