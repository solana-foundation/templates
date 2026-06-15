import { Transaction } from '@mysten/sui/transactions'
import {
  IkaClient,
  IkaTransaction,
  Curve,
  Hash,
  SignatureAlgorithm,
  createRandomSessionIdentifier,
  publicKeyFromDWalletOutput,
  CoordinatorInnerModule,
  SessionsManagerModule,
  type ZeroTrustDWallet,
} from '@ika.xyz/sdk'
import type { UserShareEncryptionKeys } from '@ika.xyz/sdk'

import { suiClient, ikaConfig, feeCoins } from './sui'
import { pubkeyBytesToSolanaAddress } from './solana'
import { prepareDKGInWorker } from './ika-worker-client'

/**
 * The Ika dWallet lifecycle: DKG (create) -> global presign -> sign.
 *
 * We use:
 *   - Curve.ED25519            (so the dWallet's pubkey is a Solana address)
 *   - SignatureAlgorithm.EdDSA (so it produces 64-byte sigs Solana accepts)
 *   - Hash.SHA512              (the only hash valid for EdDSA)
 *
 * Every on-chain step is a Sui transaction signed + paid for by the generated
 * operator keypair. The caller supplies an `executeSui` function (see
 * lib/use-execute-sui.ts) that signs with that keypair.
 */

export const CURVE = Curve.ED25519
export const SIGNATURE_ALGORITHM = SignatureAlgorithm.EdDSA
export const HASH = Hash.SHA512

/** Executes a Sui transaction with the operator wallet and returns parsed events. */
export type ExecuteSui = (transaction: Transaction) => Promise<{
  digest: string
  events: { type: string; bcs?: string | number[] | Uint8Array }[]
}>

let clientPromise: Promise<IkaClient> | null = null

/** Lazily create + initialize a single IkaClient (also boots the WASM module). */
export async function getIkaClient(): Promise<IkaClient> {
  if (!clientPromise) {
    clientPromise = (async () => {
      // The @ika.xyz/sdk WASM module auto-initializes on first cryptographic
      // call, so there's no explicit init step needed here.
      const client = new IkaClient({
        suiClient,
        config: ikaConfig,
        cache: true,
        encryptionKeyOptions: { autoDetect: true },
      })
      await client.initialize()
      return client
    })()
  }
  return clientPromise
}

function decodeEventBcs(bcs: string | number[] | Uint8Array | undefined): Uint8Array {
  if (!bcs) return new Uint8Array()
  if (bcs instanceof Uint8Array) return bcs
  if (Array.isArray(bcs)) return new Uint8Array(bcs)
  // base64-encoded string
  const binary = atob(bcs)
  const out = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i)
  return out
}

function findEvent(events: { type: string; bcs?: string | number[] | Uint8Array }[], needle: string): Uint8Array {
  const event = events.find((e) => e.type.includes(needle) && e.type.includes('DWalletSessionEvent'))
  if (!event) throw new Error(`Expected event "${needle}" not found in transaction events`)
  return decodeEventBcs(event.bcs)
}

export interface DKGProgress {
  (stage: 'preparing' | 'requesting' | 'awaiting-network' | 'accepting' | 'activating' | 'done'): void
}

export interface CreatedDWallet {
  dWalletID: string
  dWalletCapID: string
  encryptedUserSecretKeyShareID: string
  solanaAddress: string
}

/**
 * Run a full DKG and return the new dWallet's IDs + Solana address.
 *
 * Steps (each `executeSui` call opens the operator wallet to sign + pay):
 *  1. prepareDKGAsync: local crypto, produces the user's DKG contribution
 *  2. requestDWalletDKG: Sui tx that kicks off DKG (operator pays IKA + SUI)
 *  3. wait for the network share, then acceptEncryptedUserShare: a Sui tx that
 *     authorizes the dWallet, moving it to Active
 */
export async function createDWallet(params: {
  userShareEncryptionKeys: UserShareEncryptionKeys
  operatorAddress: string
  executeSui: ExecuteSui
  onProgress?: DKGProgress
}): Promise<CreatedDWallet> {
  const { userShareEncryptionKeys, operatorAddress, executeSui, onProgress } = params
  const ikaClient = await getIkaClient()

  onProgress?.('preparing')

  const sessionIdentifier = createRandomSessionIdentifier()

  // prepareDKGAsync = fetch protocol params (network) + prepareDKG (heavy WASM).
  // We split them: fetch on the main thread, then run the WASM crypto in a Web
  // Worker so the UI doesn't freeze. (prepareDKG is synchronous WASM under the
  // hood, so calling it on the main thread blocks all interaction for seconds.)
  const protocolPublicParameters = await ikaClient.getProtocolPublicParameters(undefined, CURVE)
  const dkgRequestInput = await prepareDKGInWorker({
    protocolPublicParameters,
    curve: CURVE,
    encryptionKey: userShareEncryptionKeys.encryptionKey,
    bytesToHash: sessionIdentifier,
    senderAddress: operatorAddress,
  })

  const networkEncryptionKey = await ikaClient.getLatestNetworkEncryptionKey()

  onProgress?.('requesting')

  // --- Sui tx #1: request DKG ---
  const dkgTx = new Transaction()
  const ikaDkgTx = new IkaTransaction({ ikaClient, transaction: dkgTx, userShareEncryptionKeys })

  // Register the user's encryption key on this curve if it isn't already.
  await ikaDkgTx.registerEncryptionKey({ curve: CURVE })

  const dkgFees = feeCoins(dkgTx, operatorAddress)

  // requestDWalletDKG returns a Move call result. Without `signDuringDKGRequest`
  // the Move function returns just the dWalletCap, so we take element [0] of the
  // result (matching the SDK reference `const [dWalletCap] = await ...`).
  // Passing the whole TransactionResult to transferObjects causes a PTB arity
  // error (CommandArgumentError / InvalidResultArity).
  const [dWalletCap] = await ikaDkgTx.requestDWalletDKG({
    dkgRequestInput,
    curve: CURVE,
    dwalletNetworkEncryptionKeyId: networkEncryptionKey.id,
    sessionIdentifier: ikaDkgTx.registerSessionIdentifier(sessionIdentifier),
    ikaCoin: dkgFees.ikaCoin,
    suiCoin: dkgFees.suiCoin,
  })

  // Transfer the dWalletCap and the leftover fee-coin objects to the operator,
  // so no non-droppable value is left dangling in the PTB.
  dkgTx.transferObjects([dWalletCap], operatorAddress)
  dkgFees.transferChange()

  const dkgResult = await executeSui(dkgTx)

  const dkgEventBytes = findEvent(dkgResult.events, 'DWalletDKGRequestEvent')
  const parsedDkgEvent = SessionsManagerModule.DWalletSessionEvent(CoordinatorInnerModule.DWalletDKGRequestEvent).parse(
    dkgEventBytes,
  )

  const dWalletID = parsedDkgEvent.event_data.dwallet_id as string
  const userPublicOutput = parsedDkgEvent.event_data.user_public_output as number[]
  const encryptedUserSecretKeyShareID = parsedDkgEvent.event_data.user_secret_key_share.Encrypted
    ?.encrypted_user_secret_key_share_id as string

  if (!dWalletID || !encryptedUserSecretKeyShareID) {
    throw new Error('DKG request did not return the expected dWallet ids')
  }

  onProgress?.('awaiting-network')

  // Wait for the network to finish its half of the DKG.
  const awaitingDWallet = (await ikaClient.getDWalletInParticularState(dWalletID, 'AwaitingKeyHolderSignature', {
    timeout: 300_000,
    interval: 2_000,
  })) as ZeroTrustDWallet

  onProgress?.('accepting')

  // --- Sui tx #2: accept the encrypted user share (authorizes the dWallet) ---
  const acceptTx = new Transaction()
  const ikaAcceptTx = new IkaTransaction({ ikaClient, transaction: acceptTx, userShareEncryptionKeys })

  await ikaAcceptTx.acceptEncryptedUserShare({
    dWallet: awaitingDWallet,
    encryptedUserSecretKeyShareId: encryptedUserSecretKeyShareID,
    userPublicOutput: new Uint8Array(userPublicOutput),
  })

  await executeSui(acceptTx)

  onProgress?.('activating')

  const activeDWallet = (await ikaClient.getDWalletInParticularState(dWalletID, 'Active', {
    timeout: 120_000,
    interval: 2_000,
  })) as ZeroTrustDWallet

  const dWalletCapID = activeDWallet.dwallet_cap_id

  // The dWallet's ED25519 public key, derived from its DKG public output, IS a
  // Solana address.
  const publicOutput = new Uint8Array(activeDWallet.state.Active?.public_output ?? [])
  const pubkey = await publicKeyFromDWalletOutput(CURVE, publicOutput)
  const solanaAddress = pubkeyBytesToSolanaAddress(pubkey)

  onProgress?.('done')

  return { dWalletID, dWalletCapID, encryptedUserSecretKeyShareID, solanaAddress }
}

export interface SignProgress {
  (stage: 'presign' | 'awaiting-presign' | 'signing' | 'awaiting-signature' | 'done'): void
}

/**
 * Produce an EdDSA signature over `message` using an existing Active dWallet.
 *
 * EdDSA dWallets use a *global* presign (`requestGlobalPresign`), then a sign
 * request that references the verified presign + the encrypted user share. The
 * returned 64-byte signature is exactly what Solana expects.
 */
export async function signWithDWallet(params: {
  userShareEncryptionKeys: UserShareEncryptionKeys
  operatorAddress: string
  dWalletID: string
  encryptedUserSecretKeyShareID: string
  message: Uint8Array
  executeSui: ExecuteSui
  onProgress?: SignProgress
}): Promise<{ signature: Uint8Array; publicKey: Uint8Array }> {
  const {
    userShareEncryptionKeys,
    operatorAddress,
    dWalletID,
    encryptedUserSecretKeyShareID,
    message,
    executeSui,
    onProgress,
  } = params

  const ikaClient = await getIkaClient()

  const activeDWallet = (await ikaClient.getDWalletInParticularState(dWalletID, 'Active')) as ZeroTrustDWallet
  const networkEncryptionKey = await ikaClient.getLatestNetworkEncryptionKey()

  onProgress?.('presign')

  // --- Sui tx #1: request a global presign for EdDSA ---
  const presignTx = new Transaction()
  const ikaPresignTx = new IkaTransaction({ ikaClient, transaction: presignTx, userShareEncryptionKeys })
  const presignFees = feeCoins(presignTx, operatorAddress)

  const unverifiedPresignCap = ikaPresignTx.requestGlobalPresign({
    dwalletNetworkEncryptionKeyId: networkEncryptionKey.id,
    curve: CURVE,
    signatureAlgorithm: SIGNATURE_ALGORITHM,
    ikaCoin: presignFees.ikaCoin,
    suiCoin: presignFees.suiCoin,
  })
  presignTx.transferObjects([unverifiedPresignCap], operatorAddress)
  presignFees.transferChange()

  const presignResult = await executeSui(presignTx)
  const presignEventBytes = findEvent(presignResult.events, 'PresignRequestEvent')
  const parsedPresignEvent = SessionsManagerModule.DWalletSessionEvent(
    CoordinatorInnerModule.PresignRequestEvent,
  ).parse(presignEventBytes)

  const presignID = parsedPresignEvent.event_data.presign_id as string

  onProgress?.('awaiting-presign')

  const presign = await ikaClient.getPresignInParticularState(presignID, 'Completed', {
    timeout: 300_000,
    interval: 2_000,
  })

  onProgress?.('signing')

  const encryptedUserSecretKeyShare = await ikaClient.getEncryptedUserSecretKeyShare(encryptedUserSecretKeyShareID)

  // --- Sui tx #2: approve message + sign ---
  const signTx = new Transaction()
  const ikaSignTx = new IkaTransaction({ ikaClient, transaction: signTx, userShareEncryptionKeys })
  const signFees = feeCoins(signTx, operatorAddress)

  const messageApproval = ikaSignTx.approveMessage({
    dWalletCap: activeDWallet.dwallet_cap_id,
    curve: CURVE,
    signatureAlgorithm: SIGNATURE_ALGORITHM,
    hashScheme: HASH,
    message,
  })

  const verifiedPresignCap = ikaSignTx.verifyPresignCap({ presign })

  await ikaSignTx.requestSign({
    dWallet: activeDWallet,
    messageApproval,
    verifiedPresignCap,
    hashScheme: HASH,
    presign,
    encryptedUserSecretKeyShare,
    message,
    signatureScheme: SIGNATURE_ALGORITHM,
    ikaCoin: signFees.ikaCoin,
    suiCoin: signFees.suiCoin,
  })

  signFees.transferChange()

  const signResult = await executeSui(signTx)
  const signEventBytes = findEvent(signResult.events, 'SignRequestEvent')
  const parsedSignEvent = SessionsManagerModule.DWalletSessionEvent(CoordinatorInnerModule.SignRequestEvent).parse(
    signEventBytes,
  )

  const signID = parsedSignEvent.event_data.sign_id as string

  onProgress?.('awaiting-signature')

  const sign = await ikaClient.getSignInParticularState(signID, CURVE, SIGNATURE_ALGORITHM, 'Completed', {
    timeout: 300_000,
    interval: 2_000,
  })

  const signature = Uint8Array.from(sign.state.Completed?.signature ?? [])
  if (signature.length === 0) {
    throw new Error('Sign completed but no signature bytes were returned')
  }

  const publicOutput = new Uint8Array(activeDWallet.state.Active?.public_output ?? [])
  const publicKey = await publicKeyFromDWalletOutput(CURVE, publicOutput)

  onProgress?.('done')

  return { signature, publicKey }
}
