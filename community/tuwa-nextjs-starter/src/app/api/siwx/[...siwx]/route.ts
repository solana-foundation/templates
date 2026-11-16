import { getSolanaChainId } from '@tuwaio/sdk/orbit';
import { createStatelessDemoSiwxHandler } from '@tuwaio/sdk/siwx/server-next';

import { appConfig, solanaRPCUrls } from '@/configs/appConfig';
import { DEMO_SIGNING_SECRET } from '@/lib/authConfig';

const appUrl = new URL(appConfig.appUrl);

// Serves /api/siwx/nonce, /verify, /session and /logout. The session is a signed token in an HttpOnly cookie
// (stateless demo profile, see the README for its limits).
export const { GET, POST, DELETE } = createStatelessDemoSiwxHandler({
  signingSecret: DEMO_SIGNING_SECRET,
  policy: {
    expectedDomain: appUrl.host,
    expectedUri: appUrl.origin,
    // CAIP-2 chain IDs of the app clusters, in their genesis-hash form (`solana:EtWTRABZ…` for devnet)
    allowedChainIds: Object.keys(solanaRPCUrls).flatMap((cluster) => getSolanaChainId(cluster) ?? []),
    requireExpirationTime: true,
    maxIssuedAtAgeSeconds: 300,
    maxSessionLifetimeSeconds: 1800, // 30 minutes
    clockSkewSeconds: 60,
  },
  // HTTPS-only cookie in production; `next dev` serves http://localhost
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
});
