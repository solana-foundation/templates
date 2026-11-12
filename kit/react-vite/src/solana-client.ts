import { createClient } from "@solana/kit";
import { solanaRpc } from "@solana/kit-plugin-rpc";
import { walletSigner } from "@solana/kit-plugin-wallet";

export const client = createClient()
  .use(walletSigner({ chain: "solana:devnet" }))
  .use(
    solanaRpc({
      rpcUrl: "https://api.devnet.solana.com",
      rpcSubscriptionsUrl: "wss://api.devnet.solana.com",
      transactionConfig: { version: 1 },
    })
  );

export type AppClient = typeof client;
