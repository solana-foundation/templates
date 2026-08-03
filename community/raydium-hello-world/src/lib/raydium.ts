/**
 * Raydium SDK integration lives here.
 *
 * TODO(raydium): the integration outline —
 *
 * 1. Install the SDK (web3.js v1 based):
 *      npm install @raydium-io/raydium-sdk-v2 bn.js
 *
 * 2. Init once per session. For devnet, the SDK needs explicit API hosts:
 *      Raydium.load({
 *        owner: walletPublicKey,
 *        connection,
 *        cluster: 'devnet',
 *        urlConfigs: { ...DEV_API_URLS, BASE_HOST: 'https://api-v3-devnet.raydium.io', ... },
 *      })
 *
 * 3. Quote: fetch rpc pool data, then CurveCalculator.swapBaseInput(...)
 *    (see raydium-sdk-V2-demo/src/cpmm/swap.ts for the exact call shape).
 *
 * 4. Build + send: raydium.cpmm.swap({ poolInfo, poolKeys, inputAmount, swapResult, slippage, baseIn })
 *    then sign with the wallet adapter and send via the connection.
 *
 * Pool to use on devnet: pick one from the devnet API (see use-pool.ts).
 */

export const POOL_ID = ""; // TODO(raydium): set a devnet CPMM pool id

export {};
