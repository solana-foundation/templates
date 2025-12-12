import { Router, Request, Response } from "express";
import { express as middleware } from "@faremeter/middleware";
import { solana } from "@faremeter/info";
import { PublicKey } from "@solana/web3.js";
import { payToAddress, network, asset, amount } from "../config.js";
import type { Network, Asset } from "../types.js";

const router: Router = Router();

(async () => {
  // Standard API route
  router.get("/", (_req: Request, res: Response) => {
    res.json({
      message: "Welcome to X402 API",
      version: "1.0.0",
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  });

  // Validate the address format
  try {
    new PublicKey(payToAddress);
    console.log("Using payTo address:", payToAddress);
  } catch (error: any) {
    throw new Error(
      `Invalid PAY_TO_ADDRESS: ${payToAddress}. Error: ${error.message}`
    );
  }

  const usdcExtract = solana.x402Exact({
    network: network as Network,
    asset: asset as Asset,
    amount: amount as string,
    payTo: payToAddress,
  });

  router.use((req, _res, next) => {
    console.log("request received", req.url);
    console.log("request method", req.method);
    console.log("request headers", req.headers);
    next();
  });

  router.get(
    "/protected",
    await middleware.createMiddleware({
      facilitatorURL: "https://facilitator.corbits.io",
      accepts: [usdcExtract],
    }),
    (_, res) => {
      return res.json({
        msg: "success",
      });
    }
  );
})();

export default router;
