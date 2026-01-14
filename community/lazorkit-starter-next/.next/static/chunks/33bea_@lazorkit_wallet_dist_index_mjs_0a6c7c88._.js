(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@lazorkit/wallet/dist/index.mjs [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_ENDPOINTS",
    ()=>W,
    "CHUNK_SEED",
    ()=>Ct,
    "CREDENTIAL_HASH_SIZE",
    ()=>Y,
    "DEFAULTS",
    ()=>P,
    "DEFAULT_COMMITMENT",
    ()=>E,
    "DEFAULT_CONFIG",
    ()=>Se,
    "DefaultPolicyClient",
    ()=>kt,
    "DialogManager",
    ()=>te,
    "EMPTY_PDA_RENT_EXEMPT_BALANCE",
    ()=>_,
    "LazorkitClient",
    ()=>qt,
    "LazorkitProvider",
    ()=>oe,
    "LazorkitWalletAdapter",
    ()=>ke,
    "LazorkitWalletName",
    ()=>be,
    "Logger",
    ()=>R,
    "PASSKEY_PUBLIC_KEY_SIZE",
    ()=>Z,
    "Paymaster",
    ()=>T,
    "SIGNATURE_SIZE",
    ()=>X,
    "SMART_WALLET_CONFIG_SEED",
    ()=>vt,
    "SMART_WALLET_SEED",
    ()=>It,
    "STORAGE_KEYS",
    ()=>B,
    "SmartWalletAction",
    ()=>M,
    "StorageManager",
    ()=>U,
    "StorageUtil",
    ()=>we,
    "ValidationError",
    ()=>q,
    "WALLET_DEVICE_SEED",
    ()=>Dt,
    "asCredentialHash",
    ()=>L,
    "asPasskeyPublicKey",
    ()=>F,
    "asSignature",
    ()=>j,
    "assertByteArrayLength",
    ()=>et,
    "assertDefined",
    ()=>$,
    "assertNonEmptyArray",
    ()=>ut,
    "assertNonEmptyByteArray",
    ()=>at,
    "assertNonEmptyString",
    ()=>At,
    "assertPositiveBN",
    ()=>ct,
    "assertPositiveInteger",
    ()=>yt,
    "assertPositiveNumber",
    ()=>dt,
    "assertValidBase64",
    ()=>ht,
    "assertValidCredentialHash",
    ()=>it,
    "assertValidPasskeyPublicKey",
    ()=>nt,
    "assertValidPasskeySignature",
    ()=>St,
    "assertValidPublicKey",
    ()=>tt,
    "assertValidPublicKeyArray",
    ()=>ft,
    "assertValidSignature",
    ()=>ot,
    "assertValidTransactionInstruction",
    ()=>pt,
    "assertValidTransactionInstructionArray",
    ()=>wt,
    "base64ToBytes",
    ()=>le,
    "buildCreateChunkMessage",
    ()=>zt,
    "buildExecuteMessage",
    ()=>Ot,
    "buildPasskeyVerificationInstruction",
    ()=>Lt,
    "buildTransaction",
    ()=>Xt,
    "byteArrayEquals",
    ()=>N,
    "calculateVerifyInstructionIndex",
    ()=>Yt,
    "combineInstructionsWithAuth",
    ()=>_t,
    "combineInstructionsWithAuthAndCU",
    ()=>Zt,
    "computeMultipleCpiHashes",
    ()=>Kt,
    "convertPasskeySignatureToInstructionArgs",
    ()=>jt,
    "createComputeUnitLimitInstruction",
    ()=>Jt,
    "credentialHashFromBase64",
    ()=>O,
    "deriveChunkPda",
    ()=>xt,
    "deriveSmartWalletConfigPda",
    ()=>Wt,
    "deriveSmartWalletPda",
    ()=>Pt,
    "deriveWalletDevicePda",
    ()=>Bt,
    "detectPlatform",
    ()=>ue,
    "ensureChunkExist",
    ()=>V,
    "getBlockchainTimestamp",
    ()=>z,
    "getRandomBytes",
    ()=>K,
    "importP256PublicKey",
    ()=>ce,
    "instructionToAccountMetas",
    ()=>Q,
    "isAndroid",
    ()=>me,
    "isIOS",
    ()=>ge,
    "isSafari",
    ()=>pe,
    "normalizePublicKey",
    ()=>mt,
    "prependComputeUnitLimit",
    ()=>Gt,
    "registerLazorkitWallet",
    ()=>Ie,
    "toNumberArray",
    ()=>gt,
    "toNumberArraySafe",
    ()=>bt,
    "useWallet",
    ()=>Ae,
    "useWalletStore",
    ()=>se,
    "validateCredentialHash",
    ()=>st,
    "validatePasskeyPublicKey",
    ()=>rt,
    "validateSignature",
    ()=>lt,
    "verifySignatureBrowser",
    ()=>de
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/web3.js/lib/index.browser.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$browser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/browser/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BN$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/bn.js/lib/bn.js [app-client] (ecmascript) <export default as BN>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/web3.js/lib/index.browser.esm.js [app-client] (ecmascript) <export * as web3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/buffer/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$js$2d$sha256$2f$src$2f$sha256$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/js-sha256/src/sha256.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$lazorkit$2f$wallet$2f$node_modules$2f$bs58$2f$src$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@lazorkit/wallet/node_modules/bs58/src/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$lazorkit$2f$wallet$2f$node_modules$2f$eventemitter3$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@lazorkit/wallet/node_modules/eventemitter3/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$lazorkit$2f$wallet$2f$node_modules$2f$eventemitter3$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EventEmitter$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@lazorkit/wallet/node_modules/eventemitter3/index.js [app-client] (ecmascript) <export default as EventEmitter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$base$2f$lib$2f$esm$2f$adapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/wallet-adapter-base/lib/esm/adapter.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$base$2f$lib$2f$esm$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/wallet-adapter-base/lib/esm/errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$kora$2f$dist$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/kora/dist/src/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$kora$2f$dist$2f$src$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/kora/dist/src/client.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$wallet$2d$standard$2f$wallet$2f$lib$2f$esm$2f$register$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@wallet-standard/wallet/lib/esm/register.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function v(t, e) {
    let a;
    try {
        a = t();
    } catch (t) {
        return;
    }
    return {
        getItem: (t)=>{
            var e;
            const n = (t)=>null === t ? null : JSON.parse(t, void 0), r = null != (e = a.getItem(t)) ? e : null;
            return r instanceof Promise ? r.then(n) : n(r);
        },
        setItem: (t, e)=>a.setItem(t, JSON.stringify(e, void 0)),
        removeItem: (t)=>a.removeItem(t)
    };
}
const D = (t)=>(e)=>{
        try {
            const a = t(e);
            return a instanceof Promise ? a : {
                then: (t)=>D(t)(a),
                catch (t) {
                    return this;
                }
            };
        } catch (t) {
            return {
                then (t) {
                    return this;
                },
                catch: (e)=>D(e)(t)
            };
        }
    }, C = (t, e)=>(a, n, r)=>{
        let i = {
            storage: v(()=>localStorage),
            partialize: (t)=>t,
            version: 0,
            merge: (t, e)=>({
                    ...e,
                    ...t
                }),
            ...e
        }, s = !1;
        const o = new Set, l = new Set;
        let c = i.storage;
        if (!c) return t(function() {
            for(var _len = arguments.length, t = new Array(_len), _key = 0; _key < _len; _key++){
                t[_key] = arguments[_key];
            }
            console.warn("[zustand persist middleware] Unable to update item '".concat(i.name, "', the given storage is currently unavailable.")), a(...t);
        }, n, r);
        const d = ()=>{
            const t = i.partialize({
                ...n()
            });
            return c.setItem(i.name, {
                state: t,
                version: i.version
            });
        }, A = r.setState;
        r.setState = (t, e)=>(A(t, e), d());
        const u = t(function() {
            for(var _len = arguments.length, t = new Array(_len), _key = 0; _key < _len; _key++){
                t[_key] = arguments[_key];
            }
            return a(...t), d();
        }, n, r);
        let p;
        r.getInitialState = ()=>u;
        const g = ()=>{
            var t, e;
            if (!c) return;
            s = !1, o.forEach((t)=>{
                var e;
                return t(null != (e = n()) ? e : u);
            });
            const r = (null == (e = i.onRehydrateStorage) ? void 0 : e.call(i, null != (t = n()) ? t : u)) || void 0;
            return D(c.getItem.bind(c))(i.name).then((t)=>{
                if (t) {
                    if ("number" != typeof t.version || t.version === i.version) return [
                        !1,
                        t.state
                    ];
                    if (i.migrate) {
                        const e = i.migrate(t.state, t.version);
                        return e instanceof Promise ? e.then((t)=>[
                                !0,
                                t
                            ]) : [
                            !0,
                            e
                        ];
                    }
                    console.error("State loaded from storage couldn't be migrated since no migrate function was provided");
                }
                return [
                    !1,
                    void 0
                ];
            }).then((t)=>{
                var e;
                const [r, s] = t;
                if (p = i.merge(s, null != (e = n()) ? e : u), a(p, !0), r) return d();
            }).then(()=>{
                null == r || r(p, void 0), p = n(), s = !0, l.forEach((t)=>t(p));
            }).catch((t)=>{
                null == r || r(void 0, t);
            });
        };
        return r.persist = {
            setOptions: (t)=>{
                i = {
                    ...i,
                    ...t
                }, t.storage && (c = t.storage);
            },
            clearStorage: ()=>{
                null == c || c.removeItem(i.name);
            },
            getOptions: ()=>i,
            rehydrate: ()=>g(),
            hasHydrated: ()=>s,
            onHydrate: (t)=>(o.add(t), ()=>{
                    o.delete(t);
                }),
            onFinishHydration: (t)=>(l.add(t), ()=>{
                    l.delete(t);
                })
        }, i.skipHydration || g(), p || u;
    }, P = {
    PORTAL_URL: "https://portal.lazor.sh",
    PAYMASTER_URL: "https://lazorkit-paymaster.onrender.com",
    RPC_ENDPOINT: "https://api.devnet.solana.com"
}, W = {
    CONNECT: "connect",
    SIGN: "sign"
}, E = "confirmed", B = {
    WALLET: "lazorkit-wallet",
    CREDENTIALS: "lazorkit-credentials",
    PUBLIC_KEY: "PUBLIC_KEY",
    CREDENTIAL_ID: "CREDENTIAL_ID",
    SMART_WALLET_ADDRESS: "SMART_WALLET_ADDRESS"
}, x = {
    getItem: async (t)=>{
        try {
            if ("undefined" == typeof window) return null;
            return localStorage.getItem(t);
        } catch (e) {
            return console.error("Error reading from localStorage:", e, {
                key: t
            }), null;
        }
    },
    setItem: async (t, e)=>{
        try {
            if ("undefined" == typeof window) return;
            localStorage.setItem(t, e);
        } catch (a) {
            console.error("Error writing to localStorage:", a, {
                key: t,
                valueLength: e.length
            });
        }
    },
    removeItem: async (t)=>{
        try {
            if ("undefined" == typeof window) return;
            localStorage.removeItem(t);
        } catch (e) {
            console.error("Error removing from localStorage:", e, {
                key: t
            });
        }
    }
};
class U {
    static async saveWallet(t) {
        try {
            await x.setItem(B.WALLET, JSON.stringify(t)), await x.setItem(B.CREDENTIAL_ID, t.credentialId), await x.setItem(B.SMART_WALLET_ADDRESS, t.smartWallet), await x.setItem(B.PUBLIC_KEY, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(t.passkeyPubkey).toString("base64"));
        } catch (t) {
            throw console.error("Failed to save wallet to storage:", t), t;
        }
    }
    static async getWallet() {
        try {
            const t = await x.getItem(B.WALLET);
            return t ? JSON.parse(t) : null;
        } catch (t) {
            return console.error("Failed to get wallet from storage:", t), null;
        }
    }
    static async saveConfig(t) {
        try {
            await x.setItem("lazorkit-config", JSON.stringify(t));
        } catch (t) {
            throw console.error("Failed to save config to storage:", t), t;
        }
    }
    static async getConfig() {
        try {
            const t = await x.getItem("lazorkit-config");
            return t ? JSON.parse(t) : null;
        } catch (t) {
            return console.error("Failed to get config from storage:", t), null;
        }
    }
    static async clearWallet() {
        try {
            await x.removeItem(B.WALLET), await x.removeItem(B.CREDENTIAL_ID), await x.removeItem(B.SMART_WALLET_ADDRESS), await x.removeItem(B.PUBLIC_KEY), await x.removeItem("CREDENTIALS_TIMESTAMP");
        } catch (t) {
            throw console.error("Failed to clear wallet from storage:", t), t;
        }
    }
    static async getItem(t) {
        return await x.getItem(t);
    }
    static async setItem(t, e) {
        await x.setItem(t, e);
    }
    static async removeItem(t) {
        await x.removeItem(t);
    }
}
class R {
    debug(t, e) {
        this.enabled && console.debug("[".concat(this.context, "] ").concat(t), e);
    }
    info(t, e) {
        console.info("[".concat(this.context, "] ").concat(t), e);
    }
    warn(t, e) {
        console.warn("[".concat(this.context, "] ").concat(t), e);
    }
    error(t, e) {
        console.error("[".concat(this.context, "] ").concat(t), e);
    }
    constructor(t){
        this.context = t, this.enabled = "production" !== ("TURBOPACK compile-time value", "development");
    }
}
class T {
    getHeaders() {
        const t = {
            "Content-Type": "application/json"
        };
        return this.apiKey && (t["x-api-key"] = this.apiKey), t;
    }
    async getPayer() {
        try {
            const t = await fetch("".concat(this.endpoint), {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    id: 1,
                    method: "getPayerSigner",
                    params: []
                })
            });
            if (!t.ok) throw new Error("Failed to get payer: ".concat(t.statusText));
            const e = await t.json();
            return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"](e.result.signer_address);
        } catch (t) {
            throw this.logger.error("Failed to get payer", t), t;
        }
    }
    async getBlockhash() {
        try {
            const t = await fetch("".concat(this.endpoint), {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "getBlockhash",
                    id: 1,
                    params: []
                })
            });
            if (!t.ok) throw new Error("Failed to get blockhash: ".concat(t.statusText));
            return (await t.json()).result.blockhash;
        } catch (t) {
            throw this.logger.error("Failed to get blockhash", t), t;
        }
    }
    async attemptSign(t) {
        let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
        try {
            const e = t.serialize({
                verifySignatures: !1,
                requireAllSignatures: !1
            }), a = await fetch("".concat(this.endpoint), {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "signTransaction",
                    id: 1,
                    params: [
                        e.toString("base64")
                    ]
                })
            });
            if (!a.ok) throw new Error("Failed to sign transaction: ".concat(a.statusText));
            const n = await a.json();
            if (n.error) throw new Error(n.error.message || "Unknown paymaster error");
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transaction"].from(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(n.result.signed_transaction, "base64"));
        } catch (t) {
            throw this.logger.error("Sign attempt ".concat(e, " failed:"), t), t;
        }
    }
    async sign(t) {
        let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 3, a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1e3;
        for(let n = 1; n <= e; n++)try {
            return await this.attemptSign(t, n);
        } catch (t) {
            if (n === e) throw this.logger.error("All sign retry attempts failed", t), t;
            const r = a * Math.pow(2, n - 1);
            this.logger.info("Retrying sign in ".concat(r, "ms (attempt ").concat(n, "/").concat(e, ")")), await new Promise((t)=>setTimeout(t, r));
        }
        throw new Error("Failed to sign transaction after all retries");
    }
    async attemptSignAndSend(t) {
        let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
        try {
            const e = t.serialize({
                verifySignatures: !1,
                requireAllSignatures: !1
            }), a = await fetch("".concat(this.endpoint), {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "signAndSendTransaction",
                    id: 1,
                    params: [
                        e.toString("base64")
                    ]
                })
            });
            if (!a.ok) throw new Error("Failed to sign and send transaction: ".concat(a.statusText));
            const n = await a.json();
            if (n.error) throw new Error(n.error.message || "Unknown paymaster error");
            return n.result.signature;
        } catch (t) {
            throw this.logger.error("Attempt ".concat(e, " failed:"), t), t;
        }
    }
    async signAndSend(t) {
        let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 3, a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1e3;
        for(let n = 1; n <= e; n++)try {
            return await this.attemptSignAndSend(t, n);
        } catch (t) {
            if (n === e) throw this.logger.error("All retry attempts failed", t), t;
            const r = a * Math.pow(2, n - 1);
            this.logger.info("Retrying in ".concat(r, "ms (attempt ").concat(n, "/").concat(e, ")")), await new Promise((t)=>setTimeout(t, r));
        }
        throw new Error("Failed to sign and send transaction after all retries");
    }
    async attemptSignAndSendVersionedTransaction(t) {
        let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
        try {
            const e = await fetch("".concat(this.endpoint), {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "signAndSendTransaction",
                    id: 1,
                    params: [
                        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(t.serialize()).toString("base64")
                    ]
                })
            });
            if (!e.ok) throw new Error("Failed to sign and send transaction: ".concat(e.statusText));
            const a = await e.json();
            if (a.error) throw new Error(a.error.message || "Unknown paymaster error");
            return a.result.signature;
        } catch (t) {
            throw this.logger.error("Attempt ".concat(e, " failed:"), t), t;
        }
    }
    async signAndSendVersionedTransaction(t) {
        let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 3, a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1e3;
        for(let n = 1; n <= e; n++)try {
            return await this.attemptSignAndSendVersionedTransaction(t, n);
        } catch (t) {
            if (n === e) throw this.logger.error("All retry attempts failed", t), t;
            const r = a * Math.pow(2, n - 1);
            this.logger.info("Retrying in ".concat(r, "ms (attempt ").concat(n, "/").concat(e, ")")), await new Promise((t)=>setTimeout(t, r));
        }
        throw new Error("Failed to sign and send transaction after all retries");
    }
    constructor(t){
        this.logger = new R("Paymaster"), this.endpoint = t.paymasterUrl, this.apiKey = t.apiKey;
    }
}
var M, H = {
    address: "Gsuz7YcA5sbMGVRXT3xSYhJBessW4xFC4xYsihNCqMFh",
    metadata: {
        name: "lazorkit",
        version: "0.1.0",
        spec: "0.1.0",
        description: "Created with Anchor"
    },
    docs: [
        "LazorKit: Smart Wallet with WebAuthn Passkey Authentication"
    ],
    instructions: [
        {
            name: "create_chunk",
            discriminator: [
                83,
                226,
                15,
                219,
                9,
                19,
                186,
                90
            ],
            accounts: [
                {
                    name: "payer",
                    writable: !0,
                    signer: !0
                },
                {
                    name: "smart_wallet",
                    writable: !0,
                    pda: {
                        seeds: [
                            {
                                kind: "const",
                                value: [
                                    115,
                                    109,
                                    97,
                                    114,
                                    116,
                                    95,
                                    119,
                                    97,
                                    108,
                                    108,
                                    101,
                                    116
                                ]
                            },
                            {
                                kind: "account",
                                path: "wallet_state.wallet_id",
                                account: "WalletState"
                            }
                        ]
                    }
                },
                {
                    name: "wallet_state",
                    pda: {
                        seeds: [
                            {
                                kind: "const",
                                value: [
                                    119,
                                    97,
                                    108,
                                    108,
                                    101,
                                    116,
                                    95,
                                    115,
                                    116,
                                    97,
                                    116,
                                    101
                                ]
                            },
                            {
                                kind: "account",
                                path: "smart_wallet"
                            }
                        ]
                    }
                },
                {
                    name: "wallet_device"
                },
                {
                    name: "policy_program"
                },
                {
                    name: "chunk",
                    writable: !0,
                    pda: {
                        seeds: [
                            {
                                kind: "const",
                                value: [
                                    99,
                                    104,
                                    117,
                                    110,
                                    107
                                ]
                            },
                            {
                                kind: "account",
                                path: "smart_wallet"
                            },
                            {
                                kind: "account",
                                path: "wallet_state.last_nonce",
                                account: "WalletState"
                            }
                        ]
                    }
                },
                {
                    name: "ix_sysvar",
                    address: "Sysvar1nstructions1111111111111111111111111"
                },
                {
                    name: "system_program",
                    address: "11111111111111111111111111111111"
                }
            ],
            args: [
                {
                    name: "args",
                    type: {
                        defined: {
                            name: "CreateChunkArgs"
                        }
                    }
                }
            ]
        },
        {
            name: "create_smart_wallet",
            discriminator: [
                129,
                39,
                235,
                18,
                132,
                68,
                203,
                19
            ],
            accounts: [
                {
                    name: "payer",
                    writable: !0,
                    signer: !0
                },
                {
                    name: "smart_wallet",
                    writable: !0,
                    pda: {
                        seeds: [
                            {
                                kind: "const",
                                value: [
                                    115,
                                    109,
                                    97,
                                    114,
                                    116,
                                    95,
                                    119,
                                    97,
                                    108,
                                    108,
                                    101,
                                    116
                                ]
                            },
                            {
                                kind: "arg",
                                path: "args.wallet_id"
                            }
                        ]
                    }
                },
                {
                    name: "wallet_state",
                    writable: !0,
                    pda: {
                        seeds: [
                            {
                                kind: "const",
                                value: [
                                    119,
                                    97,
                                    108,
                                    108,
                                    101,
                                    116,
                                    95,
                                    115,
                                    116,
                                    97,
                                    116,
                                    101
                                ]
                            },
                            {
                                kind: "account",
                                path: "smart_wallet"
                            }
                        ]
                    }
                },
                {
                    name: "wallet_device",
                    writable: !0
                },
                {
                    name: "policy_program"
                },
                {
                    name: "system_program",
                    address: "11111111111111111111111111111111"
                }
            ],
            args: [
                {
                    name: "args",
                    type: {
                        defined: {
                            name: "CreateSmartWalletArgs"
                        }
                    }
                }
            ]
        },
        {
            name: "execute",
            discriminator: [
                130,
                221,
                242,
                154,
                13,
                193,
                189,
                29
            ],
            accounts: [
                {
                    name: "payer",
                    writable: !0,
                    signer: !0
                },
                {
                    name: "smart_wallet",
                    writable: !0,
                    pda: {
                        seeds: [
                            {
                                kind: "const",
                                value: [
                                    115,
                                    109,
                                    97,
                                    114,
                                    116,
                                    95,
                                    119,
                                    97,
                                    108,
                                    108,
                                    101,
                                    116
                                ]
                            },
                            {
                                kind: "account",
                                path: "wallet_state.wallet_id",
                                account: "WalletState"
                            }
                        ]
                    }
                },
                {
                    name: "wallet_state",
                    writable: !0,
                    pda: {
                        seeds: [
                            {
                                kind: "const",
                                value: [
                                    119,
                                    97,
                                    108,
                                    108,
                                    101,
                                    116,
                                    95,
                                    115,
                                    116,
                                    97,
                                    116,
                                    101
                                ]
                            },
                            {
                                kind: "account",
                                path: "smart_wallet"
                            }
                        ]
                    }
                },
                {
                    name: "wallet_device"
                },
                {
                    name: "policy_program"
                },
                {
                    name: "cpi_program"
                },
                {
                    name: "ix_sysvar",
                    address: "Sysvar1nstructions1111111111111111111111111"
                },
                {
                    name: "system_program",
                    address: "11111111111111111111111111111111"
                }
            ],
            args: [
                {
                    name: "args",
                    type: {
                        defined: {
                            name: "ExecuteArgs"
                        }
                    }
                }
            ]
        },
        {
            name: "execute_chunk",
            discriminator: [
                106,
                83,
                113,
                47,
                89,
                243,
                39,
                220
            ],
            accounts: [
                {
                    name: "payer",
                    writable: !0,
                    signer: !0
                },
                {
                    name: "smart_wallet",
                    writable: !0,
                    pda: {
                        seeds: [
                            {
                                kind: "const",
                                value: [
                                    115,
                                    109,
                                    97,
                                    114,
                                    116,
                                    95,
                                    119,
                                    97,
                                    108,
                                    108,
                                    101,
                                    116
                                ]
                            },
                            {
                                kind: "account",
                                path: "wallet_state.wallet_id",
                                account: "WalletState"
                            }
                        ]
                    }
                },
                {
                    name: "wallet_state",
                    writable: !0,
                    pda: {
                        seeds: [
                            {
                                kind: "const",
                                value: [
                                    119,
                                    97,
                                    108,
                                    108,
                                    101,
                                    116,
                                    95,
                                    115,
                                    116,
                                    97,
                                    116,
                                    101
                                ]
                            },
                            {
                                kind: "account",
                                path: "smart_wallet"
                            }
                        ]
                    }
                },
                {
                    name: "chunk",
                    writable: !0,
                    pda: {
                        seeds: [
                            {
                                kind: "const",
                                value: [
                                    99,
                                    104,
                                    117,
                                    110,
                                    107
                                ]
                            },
                            {
                                kind: "account",
                                path: "smart_wallet"
                            },
                            {
                                kind: "account",
                                path: "chunk.authorized_nonce",
                                account: "Chunk"
                            }
                        ]
                    }
                },
                {
                    name: "session_refund",
                    writable: !0
                },
                {
                    name: "system_program",
                    address: "11111111111111111111111111111111"
                }
            ],
            args: [
                {
                    name: "instruction_data_list",
                    type: {
                        vec: "bytes"
                    }
                },
                {
                    name: "split_index",
                    type: "bytes"
                }
            ]
        }
    ],
    accounts: [
        {
            name: "Chunk",
            discriminator: [
                134,
                67,
                80,
                65,
                135,
                143,
                156,
                196
            ]
        },
        {
            name: "WalletDevice",
            discriminator: [
                35,
                85,
                31,
                31,
                179,
                48,
                136,
                123
            ]
        },
        {
            name: "WalletState",
            discriminator: [
                126,
                186,
                0,
                158,
                92,
                223,
                167,
                68
            ]
        }
    ],
    errors: [
        {
            code: 6e3,
            name: "PasskeyMismatch",
            msg: "Passkey public key mismatch with stored authenticator"
        },
        {
            code: 6001,
            name: "InvalidPolicyDataSize",
            msg: "Invalid policy data size"
        },
        {
            code: 6002,
            name: "Secp256r1InvalidLength",
            msg: "Secp256r1 instruction has invalid data length"
        },
        {
            code: 6003,
            name: "Secp256r1HeaderMismatch",
            msg: "Secp256r1 instruction header validation failed"
        },
        {
            code: 6004,
            name: "Secp256r1DataMismatch",
            msg: "Secp256r1 signature data validation failed"
        },
        {
            code: 6005,
            name: "InvalidSignature",
            msg: "Invalid signature provided for passkey verification"
        },
        {
            code: 6006,
            name: "ClientDataInvalidUtf8",
            msg: "Client data JSON is not valid UTF-8"
        },
        {
            code: 6007,
            name: "ClientDataJsonParseError",
            msg: "Client data JSON parsing failed"
        },
        {
            code: 6008,
            name: "ChallengeMissing",
            msg: "Challenge field missing from client data JSON"
        },
        {
            code: 6009,
            name: "ChallengeBase64DecodeError",
            msg: "Challenge base64 decoding failed"
        },
        {
            code: 6010,
            name: "ChallengeDeserializationError",
            msg: "Challenge message deserialization failed"
        },
        {
            code: 6011,
            name: "HashMismatch",
            msg: "Message hash mismatch: expected different value"
        },
        {
            code: 6012,
            name: "InvalidInstructionDiscriminator",
            msg: "Invalid instruction discriminator"
        },
        {
            code: 6013,
            name: "InsufficientCpiAccounts",
            msg: "Insufficient remaining accounts for CPI instruction"
        },
        {
            code: 6014,
            name: "AccountSliceOutOfBounds",
            msg: "Account slice index out of bounds"
        },
        {
            code: 6015,
            name: "InvalidAccountOwner",
            msg: "Account owner verification failed"
        },
        {
            code: 6016,
            name: "ProgramNotExecutable",
            msg: "Program not executable"
        },
        {
            code: 6017,
            name: "CredentialIdEmpty",
            msg: "Credential ID cannot be empty"
        },
        {
            code: 6018,
            name: "PolicyDataTooLarge",
            msg: "Policy data exceeds maximum allowed size"
        },
        {
            code: 6019,
            name: "TransactionTooOld",
            msg: "Transaction is too old"
        },
        {
            code: 6020,
            name: "InvalidInstructionData",
            msg: "Invalid instruction data"
        },
        {
            code: 6021,
            name: "InvalidInstruction",
            msg: "Invalid instruction"
        },
        {
            code: 6022,
            name: "InsufficientBalanceForFee",
            msg: "Insufficient balance for fee"
        },
        {
            code: 6023,
            name: "InvalidSequenceNumber",
            msg: "Invalid sequence number"
        },
        {
            code: 6024,
            name: "InvalidPasskeyFormat",
            msg: "Invalid passkey format"
        },
        {
            code: 6025,
            name: "ReentrancyDetected",
            msg: "Reentrancy detected"
        },
        {
            code: 6026,
            name: "UnauthorizedAdmin",
            msg: "Unauthorized admin"
        }
    ],
    types: [
        {
            name: "Chunk",
            docs: [
                "Transaction chunk for deferred execution",
                "",
                "Created after full passkey and policy verification. Contains all bindings",
                "necessary to execute the transaction later without re-verification.",
                "Used for large transactions that need to be split into manageable chunks."
            ],
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "owner_wallet_address",
                        docs: [
                            "Smart wallet address that authorized this chunk session"
                        ],
                        type: "pubkey"
                    },
                    {
                        name: "cpi_hash",
                        docs: [
                            "Combined SHA256 hash of all cpi transaction instruction data"
                        ],
                        type: {
                            array: [
                                "u8",
                                32
                            ]
                        }
                    },
                    {
                        name: "authorized_nonce",
                        docs: [
                            "The nonce that was authorized at chunk creation (bound into data hash)"
                        ],
                        type: "u64"
                    },
                    {
                        name: "authorized_timestamp",
                        docs: [
                            "Timestamp from the original message hash for expiration validation"
                        ],
                        type: "i64"
                    },
                    {
                        name: "rent_refund_address",
                        docs: [
                            "Address to receive rent refund when closing the chunk session"
                        ],
                        type: "pubkey"
                    }
                ]
            }
        },
        {
            name: "CreateChunkArgs",
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "passkey_public_key",
                        type: {
                            array: [
                                "u8",
                                33
                            ]
                        }
                    },
                    {
                        name: "signature",
                        type: {
                            array: [
                                "u8",
                                64
                            ]
                        }
                    },
                    {
                        name: "client_data_json_raw",
                        type: "bytes"
                    },
                    {
                        name: "authenticator_data_raw",
                        type: "bytes"
                    },
                    {
                        name: "verify_instruction_index",
                        type: "u8"
                    },
                    {
                        name: "policy_data",
                        type: "bytes"
                    },
                    {
                        name: "timestamp",
                        type: "i64"
                    },
                    {
                        name: "cpi_hash",
                        type: {
                            array: [
                                "u8",
                                32
                            ]
                        }
                    }
                ]
            }
        },
        {
            name: "CreateSmartWalletArgs",
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "passkey_public_key",
                        type: {
                            array: [
                                "u8",
                                33
                            ]
                        }
                    },
                    {
                        name: "credential_hash",
                        type: {
                            array: [
                                "u8",
                                32
                            ]
                        }
                    },
                    {
                        name: "init_policy_data",
                        type: "bytes"
                    },
                    {
                        name: "wallet_id",
                        type: "u64"
                    },
                    {
                        name: "amount",
                        type: "u64"
                    },
                    {
                        name: "policy_data_size",
                        type: "u16"
                    }
                ]
            }
        },
        {
            name: "ExecuteArgs",
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "passkey_public_key",
                        type: {
                            array: [
                                "u8",
                                33
                            ]
                        }
                    },
                    {
                        name: "signature",
                        type: {
                            array: [
                                "u8",
                                64
                            ]
                        }
                    },
                    {
                        name: "client_data_json_raw",
                        type: "bytes"
                    },
                    {
                        name: "authenticator_data_raw",
                        type: "bytes"
                    },
                    {
                        name: "verify_instruction_index",
                        type: "u8"
                    },
                    {
                        name: "split_index",
                        type: "u16"
                    },
                    {
                        name: "policy_data",
                        type: "bytes"
                    },
                    {
                        name: "cpi_data",
                        type: "bytes"
                    },
                    {
                        name: "timestamp",
                        type: "i64"
                    }
                ]
            }
        },
        {
            name: "WalletDevice",
            docs: [
                "Wallet device account linking a passkey to a smart wallet"
            ],
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "passkey_pubkey",
                        docs: [
                            "Secp256r1 compressed public key (33 bytes)"
                        ],
                        type: {
                            array: [
                                "u8",
                                33
                            ]
                        }
                    },
                    {
                        name: "credential_hash",
                        docs: [
                            "SHA256 hash of the credential ID"
                        ],
                        type: {
                            array: [
                                "u8",
                                32
                            ]
                        }
                    },
                    {
                        name: "smart_wallet",
                        docs: [
                            "Associated smart wallet address"
                        ],
                        type: "pubkey"
                    },
                    {
                        name: "bump",
                        docs: [
                            "PDA bump seed"
                        ],
                        type: "u8"
                    }
                ]
            }
        },
        {
            name: "WalletState",
            docs: [
                "Wallet state account storing wallet configuration and execution state"
            ],
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "bump",
                        docs: [
                            "PDA bump seed for smart wallet"
                        ],
                        type: "u8"
                    },
                    {
                        name: "wallet_id",
                        docs: [
                            "Unique wallet identifier"
                        ],
                        type: "u64"
                    },
                    {
                        name: "last_nonce",
                        docs: [
                            "Last used nonce for anti-replay protection"
                        ],
                        type: "u64"
                    },
                    {
                        name: "policy_program",
                        docs: [
                            "Policy program that validates transactions"
                        ],
                        type: "pubkey"
                    },
                    {
                        name: "policy_data",
                        docs: [
                            "Serialized policy data returned from policy initialization"
                        ],
                        type: "bytes"
                    }
                ]
            }
        }
    ]
};
function Q(t, e) {
    return t.keys.map((t)=>({
            pubkey: t.pubkey,
            isWritable: t.isWritable,
            isSigner: !!e && e.some((e)=>e.toString() === t.pubkey.toString())
        }));
}
function K(t) {
    var _globalThis_crypto;
    if ("function" == typeof ((_globalThis_crypto = globalThis.crypto) === null || _globalThis_crypto === void 0 ? void 0 : _globalThis_crypto.getRandomValues)) {
        const e = new Uint8Array(t);
        return globalThis.crypto.getRandomValues(e), e;
    }
    try {
        const { randomBytes: e } = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/next/dist/compiled/crypto-browserify/index.js [app-client] (ecmascript)");
        return e(t);
    } catch (e) {
        throw new Error("No CSPRNG available");
    }
}
function N(t, e) {
    if (t.length !== e.length) return !1;
    for(let a = 0; a < t.length; a++)if (t[a] !== e[a]) return !1;
    return !0;
}
function O(t) {
    const e = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(t, "base64");
    return Array.from(new Uint8Array(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$js$2d$sha256$2f$src$2f$sha256$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha256"].arrayBuffer(e)));
}
async function z(t) {
    const e = await t.getSlot(), a = await t.getBlockTime(e);
    if (null === a) throw new Error("Failed to get blockchain timestamp");
    return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BN$3e$__["BN"](a);
}
async function V(t, e, a) {
    let n = 0;
    for(; n < 3;){
        try {
            const n = await e.getWalletStateData(a), r = e.getChunkPubkey(a, n.lastNonce);
            if (await t.getAccountInfo(r)) return;
        } catch (t) {
            console.warn("Attempt ".concat(n + 1, " failed to find chunk:"), t);
        }
        n++, n < 3 && await new Promise((t)=>setTimeout(t, 3e3));
    }
    throw new Error("Chunk not found");
}
function F(t) {
    return t;
}
function L(t) {
    return t;
}
function j(t) {
    return t;
}
!function(t) {
    t.CreateChunk = "create_chunk", t.ExecuteChunk = "execute_chunk";
}(M || (M = {}));
var J = {
    address: "BiE9vSdz9MidUiyjVYsu3PG4C1fbPZ8CVPADA9jRfXw7",
    metadata: {
        name: "default_policy",
        version: "0.1.0",
        spec: "0.1.0",
        description: "Created with Anchor"
    },
    instructions: [
        {
            name: "check_policy",
            discriminator: [
                28,
                88,
                170,
                179,
                239,
                136,
                25,
                35
            ],
            accounts: [
                {
                    name: "policy_signer",
                    signer: !0
                },
                {
                    name: "smart_wallet"
                }
            ],
            args: [
                {
                    name: "wallet_id",
                    type: "u64"
                },
                {
                    name: "passkey_public_key",
                    type: {
                        array: [
                            "u8",
                            33
                        ]
                    }
                },
                {
                    name: "credential_hash",
                    type: {
                        array: [
                            "u8",
                            32
                        ]
                    }
                },
                {
                    name: "policy_data",
                    type: "bytes"
                }
            ]
        },
        {
            name: "init_policy",
            discriminator: [
                45,
                234,
                110,
                100,
                209,
                146,
                191,
                86
            ],
            accounts: [
                {
                    name: "policy_signer",
                    signer: !0
                },
                {
                    name: "smart_wallet",
                    writable: !0
                },
                {
                    name: "wallet_state",
                    writable: !0
                }
            ],
            args: [
                {
                    name: "wallet_id",
                    type: "u64"
                },
                {
                    name: "passkey_public_key",
                    type: {
                        array: [
                            "u8",
                            33
                        ]
                    }
                },
                {
                    name: "credential_hash",
                    type: {
                        array: [
                            "u8",
                            32
                        ]
                    }
                }
            ],
            returns: {
                defined: {
                    name: "PolicyStruct"
                }
            }
        }
    ],
    errors: [
        {
            code: 6e3,
            name: "InvalidPasskey",
            msg: "Invalid passkey format"
        },
        {
            code: 6001,
            name: "Unauthorized",
            msg: "Unauthorized to access smart wallet"
        }
    ],
    types: [
        {
            name: "DeviceSlot",
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "passkey_pubkey",
                        type: {
                            array: [
                                "u8",
                                33
                            ]
                        }
                    },
                    {
                        name: "credential_hash",
                        type: {
                            array: [
                                "u8",
                                32
                            ]
                        }
                    }
                ]
            }
        },
        {
            name: "PolicyStruct",
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "bump",
                        type: "u8"
                    },
                    {
                        name: "smart_wallet",
                        type: "pubkey"
                    },
                    {
                        name: "device_slots",
                        type: {
                            vec: {
                                defined: {
                                    name: "DeviceSlot"
                                }
                            }
                        }
                    }
                ]
            }
        }
    ]
};
const G = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from("policy");
const _ = 890880, Z = 33, Y = 32, X = 64;
class q extends Error {
    constructor(t, e){
        super(t), this.field = e, this.name = "ValidationError";
    }
}
function $(t, e) {
    if (null == t || void 0 === t) {
        throw new q("".concat(e, " is required but was ").concat(null === t ? "null" : "undefined"), e);
    }
}
function tt(t, e) {
    $(t, e);
    try {
        if ("string" == typeof t) {
            if (0 === t.trim().length) throw new q("".concat(e, " cannot be an empty string"), e);
            new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].PublicKey(t);
        } else {
            if (!(t instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].PublicKey || t && "object" == typeof t && "toBase58" in t && "function" == typeof t.toBase58 && "toBytes" in t && "function" == typeof t.toBytes)) throw new q("".concat(e, " must be a PublicKey instance or valid base58 string"), e);
        }
    } catch (t) {
        if (t instanceof q) throw t;
        throw new q("".concat(e, " is not a valid PublicKey: ").concat(t instanceof Error ? t.message : "Invalid format"), e);
    }
}
function et(t, e, a) {
    let n;
    if ($(t, a), Array.isArray(t)) n = t;
    else if (t instanceof Uint8Array) n = Array.from(t);
    else {
        if (!t || "object" != typeof t || "number" != typeof t.length) throw new q("".concat(a, " must be an array or Uint8Array"), a);
        n = Array.from(t);
    }
    if (n.length !== e) throw new q("".concat(a, " must be exactly ").concat(e, " bytes, got ").concat(n.length), a);
    for(let t = 0; t < n.length; t++){
        const e = n[t];
        if ("number" != typeof e || !Number.isFinite(e) || !Number.isInteger(e) || e < 0 || e > 255) throw new q("".concat(a, "[").concat(t, "] must be a valid byte (0-255), got ").concat("number" == typeof e ? e : typeof e), a);
    }
}
function at(t, e) {
    $(t, e);
    if (0 === (Array.isArray(t) ? t : Array.from(t)).length) throw new q("".concat(e, " cannot be empty"), e);
}
function nt(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "passkeyPublicKey";
    et(t, 33, e);
}
function rt(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "passkeyPublicKey";
    return nt(t, e), Array.isArray(t) ? t : Array.from(t);
}
function it(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "credentialHash";
    et(t, 32, e);
}
function st(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "credentialHash";
    return it(t, e), Array.isArray(t) ? t : Array.from(t);
}
function ot(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "signature";
    et(t, 64, e);
}
function lt(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "signature";
    return ot(t, e), Array.isArray(t) ? t : Array.from(t);
}
function ct(t, e) {
    $(t, e);
    if (!(t instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BN$3e$__["BN"] || t && "object" == typeof t && "lt" in t && "function" == typeof t.lt && "toString" in t && "function" == typeof t.toString)) throw new q("".concat(e, " must be a BN instance"), e);
    if (t.lt(new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BN$3e$__["BN"](0))) throw new q("".concat(e, " must be non-negative, got ").concat(t.toString()), e);
}
function dt(t, e) {
    if ($(t, e), "number" != typeof t || !Number.isFinite(t) || Number.isNaN(t)) throw new q("".concat(e, " must be a finite number (got ").concat(Number.isNaN(t) ? "NaN" : Number.isFinite(t) ? typeof t : t === 1 / 0 ? "Infinity" : "-Infinity", ")"), e);
    if (t < 0) throw new q("".concat(e, " must be non-negative, got ").concat(t), e);
}
function At(t, e) {
    if ($(t, e), "string" != typeof t) throw new q("".concat(e, " must be a string (got ").concat(typeof t, ")"), e);
    if (0 === String(t).trim().length) throw new q("".concat(e, " cannot be empty"), e);
}
function ut(t, e) {
    var _t_constructor;
    if ($(t, e), !Array.isArray(t)) throw new q("".concat(e, " must be an array (got ").concat(typeof t).concat(t && "object" == typeof t ? " with constructor ".concat(((_t_constructor = t.constructor) === null || _t_constructor === void 0 ? void 0 : _t_constructor.name) || "unknown") : "", ")"), e);
    if (0 === t.length) throw new q("".concat(e, " cannot be empty"), e);
}
function pt(t, e) {
    $(t, e);
    if (!(t instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].TransactionInstruction || t && "object" == typeof t && "programId" in t && "keys" in t && Array.isArray(t.keys) && "data" in t)) throw new q("".concat(e, " must be a TransactionInstruction instance"), e);
    if (tt(t.programId, "".concat(e, ".programId")), !t.keys || !Array.isArray(t.keys) || 0 === t.keys.length) throw new q("".concat(e, " must have at least one account key"), e);
}
function gt(t) {
    return Array.isArray(t) ? t : Array.from(t);
}
function mt(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "publicKey";
    return tt(t, e), "string" == typeof t ? new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].PublicKey(t) : t;
}
function ht(t, e) {
    At(t, e);
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(t)) throw new q("".concat(e, " is not a valid base64 string (invalid characters)"), e);
    try {
        "undefined" != typeof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"] && __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(t, "base64") : "undefined" != typeof atob && atob(t);
    } catch (t) {
        throw new q("".concat(e, " is not a valid base64 string: ").concat(t instanceof Error ? t.message : "Invalid format"), e);
    }
}
function yt(t, e) {
    if ($(t, e), "number" != typeof t || !Number.isFinite(t) || Number.isNaN(t)) throw new q("".concat(e, " must be a finite number (got ").concat(Number.isNaN(t) ? "NaN" : Number.isFinite(t) ? typeof t : t === 1 / 0 ? "Infinity" : "-Infinity", ")"), e);
    if (!Number.isInteger(t)) throw new q("".concat(e, " must be an integer, got ").concat(t), e);
    if (t <= 0) throw new q("".concat(e, " must be a positive integer, got ").concat(t), e);
}
function ft(t, e) {
    if ($(t, e), !Array.isArray(t)) throw new q("".concat(e, " must be an array (got ").concat(typeof t, ")"), e);
    t.forEach((t, a)=>{
        tt(t, "".concat(e, "[").concat(a, "]"));
    });
}
function wt(t, e) {
    ut(t, e), t.forEach((t, a)=>{
        pt(t, "".concat(e, "[").concat(a, "]"));
    });
}
function bt(t) {
    return Array.isArray(t) ? [
        ...t
    ] : Array.from(t);
}
function St(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "passkeySignature";
    if ($(t, e), "object" != typeof t || null === t) throw new q("".concat(e, " must be an object"), e);
    nt(t.passkeyPublicKey, "".concat(e, ".passkeyPublicKey")), ht(t.signature64, "".concat(e, ".signature64")), ht(t.clientDataJsonRaw64, "".concat(e, ".clientDataJsonRaw64")), ht(t.authenticatorDataRaw64, "".concat(e, ".authenticatorDataRaw64"));
}
class kt {
    policyPda(t) {
        return tt(t, "smartWallet"), function(t, e) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].PublicKey.findProgramAddressSync([
                G,
                e.toBuffer()
            ], t)[0];
        }(this.programId, t);
    }
    getPolicyDataSize() {
        return 102;
    }
    validateInitPolicyParams(t) {
        $(t, "params"), ct(t.walletId, "params.walletId"), nt(t.passkeyPublicKey, "params.passkeyPublicKey"), it(t.credentialHash, "params.credentialHash"), tt(t.policySigner, "params.policySigner"), tt(t.smartWallet, "params.smartWallet"), tt(t.walletState, "params.walletState");
    }
    async buildInitPolicyIx(t) {
        return this.validateInitPolicyParams(t), await this.program.methods.initPolicy(t.walletId, bt(t.passkeyPublicKey), bt(t.credentialHash)).accountsPartial({
            smartWallet: t.smartWallet,
            walletState: t.walletState,
            policySigner: t.policySigner
        }).instruction();
    }
    validateCheckPolicyParams(t) {
        if ($(t, "params"), ct(t.walletId, "params.walletId"), nt(t.passkeyPublicKey, "params.passkeyPublicKey"), tt(t.policySigner, "params.policySigner"), tt(t.smartWallet, "params.smartWallet"), it(t.credentialHash, "params.credentialHash"), $(t.policyData, "params.policyData"), !__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].isBuffer(t.policyData)) throw new q("params.policyData must be a Buffer instance", "params.policyData");
    }
    async buildCheckPolicyIx(t) {
        return this.validateCheckPolicyParams(t), await this.program.methods.checkPolicy(t.walletId, bt(t.passkeyPublicKey), bt(t.credentialHash), t.policyData).accountsPartial({
            smartWallet: t.smartWallet,
            policySigner: t.policySigner
        }).instruction();
    }
    constructor(t){
        $(t, "connection"), this.connection = t, this.program = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$browser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Program"](J, {
            connection: t
        }), this.programId = this.program.programId;
    }
}
const It = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from("smart_wallet"), vt = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from("wallet_state"), Dt = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from("wallet_device"), Ct = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from("chunk");
function Pt(t, e) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].PublicKey.findProgramAddressSync([
        It,
        e.toArrayLike(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"], "le", 8)
    ], t)[0];
}
function Wt(t, e) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].PublicKey.findProgramAddressSync([
        vt,
        e.toBuffer()
    ], t)[0];
}
function Et(t, e) {
    const a = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].concat([
        t.toBuffer(),
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(e)
    ]), n = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$js$2d$sha256$2f$src$2f$sha256$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha256"].arrayBuffer(a);
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(n).subarray(0, 32);
}
function Bt(t, e, a) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].PublicKey.findProgramAddressSync([
        Dt,
        Et(e, a)
    ], t);
}
function xt(t, e, a) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].PublicKey.findProgramAddressSync([
        Ct,
        e.toBuffer(),
        a.toArrayLike(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"], "le", 8)
    ], t)[0];
}
class Ut {
    smartWallet(t) {
        return ct(t, "walletId"), Pt(this.programId, t);
    }
    walletState(t) {
        return tt(t, "smartWallet"), Wt(this.programId, t);
    }
    walletDevice(t, e) {
        return tt(t, "smartWallet"), it(e, "credentialHash"), Bt(this.programId, t, e)[0];
    }
    chunk(t, e) {
        return tt(t, "smartWallet"), xt(this.programId, t, e);
    }
    constructor(t){
        this.programId = t;
    }
}
class Rt {
    async resolveForExecute(param) {
        let { provided: t, smartWallet: e, credentialHash: a, passkeyPublicKey: n, walletStateData: r } = param;
        if (void 0 !== t) return t;
        const i = this.walletPdas.walletDevice(e, a);
        return this.policyClient.buildCheckPolicyIx({
            walletId: r.walletId,
            passkeyPublicKey: n,
            policySigner: i,
            smartWallet: e,
            credentialHash: a,
            policyData: r.policyData
        });
    }
    async resolveForCreate(param) {
        let { provided: t, smartWalletId: e, smartWallet: a, walletState: n, passkeyPublicKey: r, credentialHash: i } = param;
        if (void 0 !== t) return t;
        const s = this.walletPdas.walletDevice(a, i);
        return this.policyClient.buildInitPolicyIx({
            walletId: e,
            passkeyPublicKey: r,
            credentialHash: i,
            policySigner: s,
            smartWallet: a,
            walletState: n
        });
    }
    constructor(t, e){
        this.policyClient = t, this.walletPdas = e;
    }
}
let Tt = null;
const Mt = (t)=>new Uint8Array(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$js$2d$sha256$2f$src$2f$sha256$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha256"].arrayBuffer(t)), Ht = (t, e, a)=>{
    const n = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$js$2d$sha256$2f$src$2f$sha256$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha256"].create();
    n.update(t.toBytes());
    for (const t of e)n.update(t.pubkey.toBytes()), n.update(Uint8Array.from([
        t.isSigner ? 1 : 0
    ])), n.update(Uint8Array.from([
        t.pubkey.toString() === a.toString() || t.isWritable ? 1 : 0
    ]));
    return new Uint8Array(n.arrayBuffer());
}, Qt = (t, e)=>{
    const a = Q(t), n = Ht(t.programId, a, e);
    return {
        policyDataHash: Mt(t.data),
        policyAccountsHash: n
    };
}, Kt = (t, e, a)=>{
    const n = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].alloc(4);
    n.writeUInt32LE(t.length, 0);
    const r = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].concat([
        n,
        ...t.map((t)=>{
            const e = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(t.data), a = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].alloc(4);
            return a.writeUInt32LE(e.length, 0), __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].concat([
                a,
                e
            ]);
        })
    ]), i = Mt(r), s = ((t, e)=>{
        const a = new Map;
        for (const e of t){
            const t = e.pubkey.toString(), n = a.get(t);
            n ? (n.isSigner = n.isSigner || e.isSigner, n.isWritable = n.isWritable || e.isWritable) : a.set(t, {
                isSigner: e.isSigner,
                isWritable: e.isWritable
            });
        }
        const n = t.map((t)=>{
            const e = t.pubkey.toString(), n = a.get(e);
            return {
                pubkey: t.pubkey,
                isSigner: n.isSigner,
                isWritable: n.isWritable
            };
        }), r = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$js$2d$sha256$2f$src$2f$sha256$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha256"].create();
        for (const t of n)r.update(t.pubkey.toBytes()), r.update(Uint8Array.from([
            t.isSigner ? 1 : 0
        ])), r.update(Uint8Array.from([
            t.pubkey.toString() === e.toString() || t.isWritable ? 1 : 0
        ]));
        return new Uint8Array(r.arrayBuffer());
    })(t.flatMap((t)=>[
            {
                pubkey: t.programId,
                isSigner: !1,
                isWritable: !1
            },
            ...Q(t, a)
        ]), e);
    return {
        cpiDataHash: i,
        cpiAccountsHash: s
    };
}, Nt = (t, e)=>{
    try {
        const a = (Tt || (Tt = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$browser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BorshCoder"]({
            version: "0.1.0",
            name: "lazorkit_msgs",
            instructions: [],
            accounts: [],
            types: [
                {
                    name: "SimpleMessage",
                    type: {
                        kind: "struct",
                        fields: [
                            {
                                name: "dataHash",
                                type: {
                                    array: [
                                        "u8",
                                        32
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        })), Tt).types.encode(t, e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(a);
    } catch (e) {
        throw new Error("Failed to encode ".concat(t, ": ").concat(e instanceof Error ? e.message : "Unknown error"));
    }
};
function Ot(t, e, a, n, r, i) {
    const s = Qt(n, t), o = ((t, e, a)=>{
        const n = Q(t, a), r = Ht(t.programId, n, e);
        return {
            cpiDataHash: Mt(t.data),
            cpiAccountsHash: r
        };
    })(r, t, i !== null && i !== void 0 ? i : []), l = new Uint8Array(64);
    l.set(s.policyDataHash, 0), l.set(s.policyAccountsHash, 32);
    const c = Mt(l), d = new Uint8Array(64);
    d.set(o.cpiDataHash, 0), d.set(o.cpiAccountsHash, 32);
    const A = Mt(d), p = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].alloc(8);
    p.writeBigUInt64LE(BigInt(e.toString()), 0);
    const g = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].alloc(8);
    g.writeBigInt64LE(BigInt(a.toString()), 0);
    const m = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].concat([
        p,
        g,
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(c),
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(A)
    ]), h = Mt(m);
    return Nt("SimpleMessage", {
        dataHash: Array.from(h)
    });
}
function zt(t, e, a, n, r, i) {
    const s = Qt(n, t), o = Kt(r, t, i), l = new Uint8Array(64);
    l.set(s.policyDataHash, 0), l.set(s.policyAccountsHash, 32);
    const c = Mt(l), d = new Uint8Array(64);
    d.set(o.cpiDataHash, 0), d.set(o.cpiAccountsHash, 32);
    const A = Mt(d), p = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].alloc(8);
    p.writeBigUInt64LE(BigInt(e.toString()), 0);
    const g = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].alloc(8);
    g.writeBigInt64LE(BigInt(a.toString()), 0);
    const m = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].concat([
        p,
        g,
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(c),
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(A)
    ]), h = Mt(m);
    return Nt("SimpleMessage", {
        dataHash: Array.from(h)
    });
}
const Vt = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].PublicKey("Secp256r1SigVerify1111111111111111111111111");
function Ft(t) {
    if (t instanceof Uint8Array) return t;
    if (Array.isArray(t)) return new Uint8Array(t);
    {
        const e = new ArrayBuffer(2 * Object.values(t).length), a = new DataView(e);
        return Object.values(t).forEach((t, e)=>{
            a.setUint16(2 * e, t, !0);
        }), new Uint8Array(e);
    }
}
function Lt(t) {
    nt(t.passkeyPublicKey, "passkeySignature.passkeyPublicKey"), ht(t.signature64, "passkeySignature.signature64"), ht(t.clientDataJsonRaw64, "passkeySignature.clientDataJsonRaw64"), ht(t.authenticatorDataRaw64, "passkeySignature.authenticatorDataRaw64");
    const e = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(t.authenticatorDataRaw64, "base64"), a = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(t.clientDataJsonRaw64, "base64"), n = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(t.signature64, "base64");
    ot(gt(n), "passkeySignature.signature64 (decoded)");
    return function(t, e, a) {
        if (33 !== e.length || 64 !== a.length) throw new Error("Invalid key or signature length");
        const n = 113 + t.length, r = new Uint8Array(n);
        r.set(Ft([
            1,
            0
        ]), 0);
        const i = {
            signature_offset: 49,
            signature_instruction_index: 65535,
            public_key_offset: 16,
            public_key_instruction_index: 65535,
            message_data_offset: 113,
            message_data_size: t.length,
            message_instruction_index: 65535
        };
        return r.set(Ft(i), 2), r.set(e, 16), r.set(a, 49), r.set(t, 113), new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].TransactionInstruction({
            keys: [],
            programId: Vt,
            data: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(r)
        });
    }(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].concat([
        e,
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$js$2d$sha256$2f$src$2f$sha256$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha256"].arrayBuffer(a))
    ]), t.passkeyPublicKey, n);
}
function jt(t) {
    const e = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(t.signature64, "base64");
    return ot(gt(e), "passkeySignature.signature64 (decoded)"), {
        passkeyPublicKey: t.passkeyPublicKey,
        signature: gt(e),
        clientDataJsonRaw: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(t.clientDataJsonRaw64, "base64"),
        authenticatorDataRaw: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(t.authenticatorDataRaw64, "base64")
    };
}
function Jt(t) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].ComputeBudgetProgram.setComputeUnitLimit({
        units: t
    });
}
function Gt(t, e) {
    return void 0 === e ? t : [
        Jt(e),
        ...t
    ];
}
function _t(t, e) {
    return [
        t,
        ...e
    ];
}
function Zt(t, e, a) {
    return Gt([
        t,
        ...e
    ], a);
}
function Yt(t) {
    return void 0 !== t ? 1 : 0;
}
async function Xt(t, e, a) {
    let n = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const { addressLookupTables: r, recentBlockhash: i, computeUnitLimit: s } = n, o = Gt(a, s), l = void 0 !== r && r.length > 0, c = i || (await t.getLatestBlockhash()).blockhash;
    if (l) {
        const t = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].TransactionMessage({
            payerKey: e,
            recentBlockhash: c,
            instructions: o
        }).compileToV0Message([
            ...r
        ]);
        return {
            transaction: new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].VersionedTransaction(t),
            isVersioned: !0,
            recentBlockhash: c
        };
    }
    {
        const t = (new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].Transaction).add(...o);
        return t.feePayer = e, t.recentBlockhash = c, {
            transaction: t,
            isVersioned: !1,
            recentBlockhash: c
        };
    }
}
/*TURBOPACK member replacement*/ __turbopack_context__.g.Buffer = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"], __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].prototype.subarray = function(t, e) {
    const a = Uint8Array.prototype.subarray.apply(this, [
        t,
        e
    ]);
    return Object.setPrototypeOf(a, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].prototype), a;
};
class qt {
    getSmartWalletPubkey(t) {
        return this.walletPdas.smartWallet(t);
    }
    getWalletStatePubkey(t) {
        return this.walletPdas.walletState(t);
    }
    getWalletDevicePubkey(t, e) {
        return this.walletPdas.walletDevice(t, e);
    }
    getChunkPubkey(t, e) {
        return this.walletPdas.chunk(t, e);
    }
    generateWalletId() {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BN$3e$__["BN"](K(8), "le");
    }
    async fetchWalletStateContext(t) {
        const e = this.getWalletStatePubkey(t);
        return {
            walletState: e,
            data: await this.program.account.walletState.fetch(e)
        };
    }
    async fetchChunkContext(t, e) {
        const a = this.getChunkPubkey(t, e);
        return {
            chunk: a,
            data: await this.program.account.chunk.fetch(a)
        };
    }
    validateCreateSmartWalletParams(t) {
        $(t, "params"), tt(t.payer, "params.payer"), nt(t.passkeyPublicKey, "params.passkeyPublicKey"), ht(t.credentialIdBase64, "params.credentialIdBase64"), void 0 !== t.amount && ct(t.amount, "params.amount"), void 0 !== t.smartWalletId && ct(t.smartWalletId, "params.smartWalletId"), void 0 !== t.policyDataSize && yt(t.policyDataSize, "params.policyDataSize"), void 0 !== t.policyInstruction && pt(t.policyInstruction, "params.policyInstruction");
    }
    validateExecuteParams(t) {
        $(t, "params"), tt(t.payer, "params.payer"), tt(t.smartWallet, "params.smartWallet"), St(t.passkeySignature, "params.passkeySignature"), it(t.credentialHash, "params.credentialHash"), pt(t.cpiInstruction, "params.cpiInstruction"), ct(t.timestamp, "params.timestamp"), void 0 !== t.policyInstruction && pt(t.policyInstruction, "params.policyInstruction"), void 0 !== t.cpiSigners && ft(t.cpiSigners, "params.cpiSigners");
    }
    validateCreateChunkParams(t) {
        $(t, "params"), tt(t.payer, "params.payer"), tt(t.smartWallet, "params.smartWallet"), St(t.passkeySignature, "params.passkeySignature"), it(t.credentialHash, "params.credentialHash"), wt(t.cpiInstructions, "params.cpiInstructions"), ct(t.timestamp, "params.timestamp"), void 0 !== t.policyInstruction && pt(t.policyInstruction, "params.policyInstruction"), void 0 !== t.cpiSigners && ft(t.cpiSigners, "params.cpiSigners");
    }
    validateExecuteChunkParams(t) {
        $(t, "params"), tt(t.payer, "params.payer"), tt(t.smartWallet, "params.smartWallet"), wt(t.cpiInstructions, "params.cpiInstructions"), void 0 !== t.cpiSigners && ft(t.cpiSigners, "params.cpiSigners");
    }
    async getWalletStateData(t) {
        const { data: e } = await this.fetchWalletStateContext(t);
        return e;
    }
    async getChunkData(t) {
        return await this.program.account.chunk.fetch(t);
    }
    async getSmartWalletByCredentialHash(t) {
        var _H_accounts_find, _H_accounts;
        it(t, "credentialHash");
        const e = (_H_accounts = H.accounts) === null || _H_accounts === void 0 ? void 0 : (_H_accounts_find = _H_accounts.find((t)=>"WalletDevice" === t.name)) === null || _H_accounts_find === void 0 ? void 0 : _H_accounts_find.discriminator;
        if (!e) throw new q("WalletDevice discriminator not found in IDL", "credentialHash");
        const a = await this.connection.getProgramAccounts(this.programId, {
            filters: [
                {
                    memcmp: {
                        offset: 0,
                        bytes: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$lazorkit$2f$wallet$2f$node_modules$2f$bs58$2f$src$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].encode(e)
                    }
                },
                {
                    memcmp: {
                        offset: 41,
                        bytes: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$lazorkit$2f$wallet$2f$node_modules$2f$bs58$2f$src$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].encode(t)
                    }
                }
            ]
        });
        if (0 === a.length) return null;
        for (const t of a){
            const e = await this.program.account.walletDevice.fetch(t.pubkey);
            return {
                smartWallet: e.smartWallet,
                walletState: this.getWalletStatePubkey(e.smartWallet),
                walletDevice: t.pubkey,
                passkeyPublicKey: e.passkeyPubkey
            };
        }
        return null;
    }
    async buildCreateSmartWalletIns(t, e, a, n) {
        return tt(t, "payer"), tt(e, "smartWallet"), pt(a, "policyInstruction"), $(n, "args"), nt(n.passkeyPublicKey, "args.passkeyPublicKey"), it(n.credentialHash, "args.credentialHash"), ct(n.walletId, "args.walletId"), ct(n.amount, "args.amount"), await this.program.methods.createSmartWallet(n).accountsPartial({
            payer: t,
            smartWallet: e,
            walletState: this.getWalletStatePubkey(e),
            walletDevice: this.getWalletDevicePubkey(e, n.credentialHash),
            policyProgram: a.programId,
            systemProgram: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].SystemProgram.programId
        }).remainingAccounts([
            ...Q(a)
        ]).instruction();
    }
    async buildExecuteIns(t, e, a, n, r, i, s) {
        return tt(t, "payer"), tt(e, "smartWallet"), tt(a, "walletDevice"), $(n, "args"), pt(r, "policyInstruction"), pt(i, "cpiInstruction"), void 0 !== s && ft(s, "cpiSigners"), await this.program.methods.execute(n).accountsPartial({
            payer: t,
            smartWallet: e,
            walletState: this.getWalletStatePubkey(e),
            walletDevice: a,
            policyProgram: r.programId,
            cpiProgram: i.programId,
            ixSysvar: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].SYSVAR_INSTRUCTIONS_PUBKEY,
            systemProgram: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].SystemProgram.programId
        }).remainingAccounts([
            ...Q(r),
            ...Q(i, s)
        ]).instruction();
    }
    async buildCreateChunkIns(t, e, a, n, r) {
        tt(t, "payer"), tt(e, "smartWallet"), tt(a, "walletDevice"), $(n, "args"), pt(r, "policyInstruction");
        const { walletState: i, data: s } = await this.fetchWalletStateContext(e), o = this.getChunkPubkey(e, s.lastNonce);
        return await this.program.methods.createChunk(n).accountsPartial({
            payer: t,
            smartWallet: e,
            walletState: i,
            walletDevice: a,
            policyProgram: r.programId,
            chunk: o,
            ixSysvar: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].SYSVAR_INSTRUCTIONS_PUBKEY,
            systemProgram: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].SystemProgram.programId
        }).remainingAccounts([
            ...Q(r)
        ]).instruction();
    }
    async buildExecuteChunkIns(t, e, a, n) {
        tt(t, "payer"), tt(e, "smartWallet"), wt(a, "cpiInstructions"), void 0 !== n && ft(n, "cpiSigners");
        const { data: r, walletState: i } = await this.fetchWalletStateContext(e), { chunk: s, data: o } = await this.fetchChunkContext(e, r.lastNonce), l = a.map((t)=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(t.data)), c = function(t) {
            const e = [];
            let a = 0;
            for(let n = 0; n < t.length - 1; n++)a += t[n].keys.length + 1, e.push(a);
            return e;
        }(a), d = function(t, e) {
            return t.flatMap((t)=>[
                    {
                        pubkey: t.programId,
                        isSigner: !1,
                        isWritable: !1
                    },
                    ...Q(t, e)
                ]);
        }(a, n);
        return await this.program.methods.executeChunk(l, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(c)).accountsStrict({
            payer: t,
            smartWallet: e,
            walletState: i,
            chunk: s,
            sessionRefund: o.rentRefundAddress,
            systemProgram: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].SystemProgram.programId
        }).remainingAccounts(d).instruction();
    }
    async createSmartWalletTxn(t) {
        let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        this.validateCreateSmartWalletParams(t);
        var _t_smartWalletId, _t_amount, _t_policyDataSize;
        const a = (_t_smartWalletId = t.smartWalletId) !== null && _t_smartWalletId !== void 0 ? _t_smartWalletId : this.generateWalletId(), n = this.getSmartWalletPubkey(a), r = this.getWalletStatePubkey(n), i = (_t_amount = t.amount) !== null && _t_amount !== void 0 ? _t_amount : new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BN$3e$__["BN"](_), s = (_t_policyDataSize = t.policyDataSize) !== null && _t_policyDataSize !== void 0 ? _t_policyDataSize : this.defaultPolicyProgram.getPolicyDataSize(), o = O(t.credentialIdBase64), l = await this.policyResolver.resolveForCreate({
            provided: t.policyInstruction,
            smartWalletId: a,
            smartWallet: n,
            walletState: r,
            passkeyPublicKey: t.passkeyPublicKey,
            credentialHash: o
        }), c = {
            passkeyPublicKey: t.passkeyPublicKey,
            credentialHash: o,
            initPolicyData: l.data,
            walletId: a,
            amount: i,
            policyDataSize: s
        }, d = await this.buildCreateSmartWalletIns(t.payer, n, l, c);
        return {
            transaction: (await Xt(this.connection, t.payer, [
                d
            ], e)).transaction,
            smartWalletId: a,
            smartWallet: n
        };
    }
    async executeTxn(t) {
        let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        this.validateExecuteParams(t);
        var _t_cpiSigners;
        const a = Lt(t.passkeySignature), n = await this.getWalletStateData(t.smartWallet), r = this.getWalletDevicePubkey(t.smartWallet, t.credentialHash), i = await this.policyResolver.resolveForExecute({
            provided: t.policyInstruction,
            smartWallet: t.smartWallet,
            credentialHash: t.credentialHash,
            passkeyPublicKey: t.passkeySignature.passkeyPublicKey,
            walletStateData: n
        }), s = jt(t.passkeySignature), o = _t(a, [
            await this.buildExecuteIns(t.payer, t.smartWallet, r, {
                ...s,
                verifyInstructionIndex: Yt(e.computeUnitLimit),
                splitIndex: i.keys.length,
                policyData: i.data,
                cpiData: t.cpiInstruction.data,
                timestamp: t.timestamp
            }, i, t.cpiInstruction, [
                ...(_t_cpiSigners = t.cpiSigners) !== null && _t_cpiSigners !== void 0 ? _t_cpiSigners : [],
                t.payer
            ])
        ]);
        return (await Xt(this.connection, t.payer, o, e)).transaction;
    }
    async createChunkTxn(t) {
        let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        this.validateCreateChunkParams(t);
        var _t_cpiSigners;
        const a = Lt(t.passkeySignature), n = await this.getWalletStateData(t.smartWallet), r = this.getWalletDevicePubkey(t.smartWallet, t.credentialHash), i = await this.policyResolver.resolveForExecute({
            provided: t.policyInstruction,
            smartWallet: t.smartWallet,
            credentialHash: t.credentialHash,
            passkeyPublicKey: t.passkeySignature.passkeyPublicKey,
            walletStateData: n
        }), s = jt(t.passkeySignature), o = function(t, e, a) {
            const n = Kt(t, e, a), r = new Uint8Array(64);
            return r.set(n.cpiDataHash, 0), r.set(n.cpiAccountsHash, 32), Array.from(new Uint8Array(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$js$2d$sha256$2f$src$2f$sha256$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha256"].arrayBuffer(r)));
        }(t.cpiInstructions, t.smartWallet, [
            ...(_t_cpiSigners = t.cpiSigners) !== null && _t_cpiSigners !== void 0 ? _t_cpiSigners : [],
            t.payer
        ]), l = _t(a, [
            await this.buildCreateChunkIns(t.payer, t.smartWallet, r, {
                ...s,
                policyData: i.data,
                verifyInstructionIndex: Yt(e.computeUnitLimit),
                timestamp: t.timestamp,
                cpiHash: Array.from(o)
            }, i)
        ]);
        return (await Xt(this.connection, t.payer, l, e)).transaction;
    }
    async executeChunkTxn(t) {
        let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        this.validateExecuteChunkParams(t);
        const a = await this.buildExecuteChunkIns(t.payer, t.smartWallet, t.cpiInstructions, t.cpiSigners);
        return (await Xt(this.connection, t.payer, [
            a
        ], e)).transaction;
    }
    async buildAuthorizationMessage(t) {
        let e;
        const { action: a, smartWallet: n, passkeyPublicKey: r, timestamp: i } = t;
        switch(a.type){
            case M.CreateChunk:
                {
                    const { policyInstruction: s, cpiInstructions: o, cpiSigners: l } = a.args, c = await this.getWalletStateData(t.smartWallet), d = await this.policyResolver.resolveForExecute({
                        provided: s,
                        smartWallet: t.smartWallet,
                        credentialHash: t.credentialHash,
                        passkeyPublicKey: r,
                        walletStateData: c
                    });
                    e = zt(n, (await this.getWalletStateData(n)).lastNonce, i, d, o, [
                        ...l !== null && l !== void 0 ? l : [],
                        t.payer
                    ]);
                    break;
                }
            default:
                throw new q("Unsupported SmartWalletAction: ".concat(a.type), "action.type");
        }
        return e;
    }
    constructor(t){
        this.connection = t, this.program = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$browser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Program"](H, {
            connection: t
        }), this.programId = this.program.programId, this.defaultPolicyProgram = new kt(t), this.walletPdas = new Ut(this.programId), this.policyResolver = new Rt(this.defaultPolicyProgram, this.walletPdas);
    }
}
"function" != typeof globalThis.structuredClone && (globalThis.structuredClone = (t)=>JSON.parse(JSON.stringify(t)));
class $t extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$lazorkit$2f$wallet$2f$node_modules$2f$eventemitter3$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EventEmitter$3e$__["EventEmitter"] {
    setIframeRef(t) {
        this.iframeRef = t;
    }
    notifyCredentialsUpdated(t) {
        this.emit("credentials-updated", t);
        const e = new CustomEvent("lazorkit:credentials-updated", {
            detail: t,
            bubbles: !0,
            cancelable: !0
        });
        window.dispatchEvent(e);
    }
    syncCredentials() {
        let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !1;
        this.iframeRef && this.iframeRef.contentWindow ? this.performCredentialSync(t) : setTimeout(()=>this.syncCredentials(t), 500);
    }
    performCredentialSync(t) {
        var _this_iframeRef;
        if (!((_this_iframeRef = this.iframeRef) === null || _this_iframeRef === void 0 ? void 0 : _this_iframeRef.contentWindow)) throw new Error("Cannot sync credentials: iframe reference not available");
        const e = localStorage.getItem("CREDENTIAL_ID") || "", a = localStorage.getItem("PUBLIC_KEY") || "", n = localStorage.getItem("SMART_WALLET_ADDRESS") || "";
        if (!(t || e && a)) return;
        const r = {
            type: "SYNC_CREDENTIALS",
            data: {
                credentialId: e,
                publickey: a,
                smartWalletAddress: n,
                timestamp: Date.now()
            }
        };
        try {
            this.iframeRef.contentWindow.postMessage(r, "*"), this.retryDelays.forEach((t)=>{
                setTimeout(()=>{
                    try {
                        var _this_iframeRef;
                        ((_this_iframeRef = this.iframeRef) === null || _this_iframeRef === void 0 ? void 0 : _this_iframeRef.contentWindow) && this.iframeRef.contentWindow.postMessage(r, "*");
                    } catch (t) {}
                }, t);
            });
        } catch (t) {}
    }
    storeCredential(t) {
        t.credentialId && localStorage.setItem("CREDENTIAL_ID", t.credentialId), t.publickey && localStorage.setItem("PUBLIC_KEY", t.publickey), t.smartWalletAddress && localStorage.setItem("SMART_WALLET_ADDRESS", t.smartWalletAddress), localStorage.setItem("CREDENTIALS_TIMESTAMP", (new Date).toISOString());
    }
    destroy() {
        this.removeAllListeners(), this.iframeRef = null;
    }
    constructor(){
        super(), this.iframeRef = null, this.retryDelays = [
            200,
            400,
            800,
            1500,
            3e3
        ];
    }
}
class te extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$lazorkit$2f$wallet$2f$node_modules$2f$eventemitter3$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EventEmitter$3e$__["EventEmitter"] {
    async openConnect() {
        return new Promise((t, e)=>{
            const a = ()=>{
                this.off("connect-result", n), this.off("error", r);
            }, n = (e)=>{
                a(), t(e);
            }, r = (t)=>{
                a(), e(t);
            };
            this.on("connect-result", n), this.on("error", r);
            const i = setTimeout(()=>{
                a(), e(new Error("Connection timed out after 60 seconds"));
            }, 6e4), s = t, o = e;
            t = (t)=>{
                clearTimeout(i), s(t);
            }, e = (t)=>{
                clearTimeout(i), o(t);
            }, this._currentAction = W.CONNECT;
            if (this.shouldUsePopup("connect")) {
                const t = "".concat(this.config.portalUrl, "?action=").concat(W.CONNECT);
                this.openPopup(t).catch(e);
            } else this.openConnectDialog().catch(e);
        });
    }
    async openSign(t, e, a, n) {
        return new Promise((r, i)=>{
            const s = ()=>{
                this.off("sign-result", o), this.off("error", l);
            }, o = (t)=>{
                s(), r(t);
            }, l = (t)=>{
                s(), i(t);
            };
            this.on("sign-result", o), this.on("error", l);
            const c = setTimeout(()=>{
                s(), i(new Error("Signing timed out after 60 seconds"));
            }, 6e4), d = r, A = i;
            r = (t)=>{
                clearTimeout(c), d(t);
            }, i = (t)=>{
                clearTimeout(c), A(t);
            }, this._currentAction = W.SIGN;
            const u = this.shouldUsePopup("sign"), p = encodeURIComponent(t);
            let g = "".concat(this.config.portalUrl, "?action=").concat(W.SIGN, "&message=").concat(p, "&transaction=").concat(encodeURIComponent(e), "&credentialId=").concat(encodeURIComponent(a));
            n && (g += "&clusterSimulation=".concat(n)), u ? this.openPopup(g).catch(i) : this.openSignDialog(g).catch(i);
        });
    }
    async openSignMessage(t, e) {
        return new Promise((a, n)=>{
            const r = ()=>{
                this.off("sign-result", i), this.off("error", s);
            }, i = (t)=>{
                r(), a(t);
            }, s = (t)=>{
                r(), n(t);
            };
            this.on("sign-result", i), this.on("error", s);
            const o = setTimeout(()=>{
                r(), n(new Error("Signing timed out after 60 seconds"));
            }, 6e4), l = a, c = n;
            a = (t)=>{
                clearTimeout(o), l(t);
            }, n = (t)=>{
                clearTimeout(o), c(t);
            }, this._currentAction = W.SIGN;
            const d = encodeURIComponent(t), A = "".concat(this.config.portalUrl, "?action=").concat(W.SIGN, "&message=").concat(d, "&credentialId=").concat(encodeURIComponent(e));
            this.shouldUsePopup("sign") ? this.openPopup(A).catch(n) : this.openSignDialog(A).catch(n);
        });
    }
    async openConnectDialog() {
        const t = "".concat(this.config.portalUrl, "?action=").concat(W.CONNECT);
        await this.openModal(t);
    }
    ensureFonts() {
        const t = "lazorkit-font-roboto-flex";
        if (document.getElementById(t)) return;
        const e = document.createElement("link");
        e.id = t, e.rel = "stylesheet", e.href = "https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap", document.head.appendChild(e);
    }
    ensureDialogBackdropCSS() {
        const t = "lazorkit-dialog-backdrop-style";
        if (document.getElementById(t)) return;
        const e = document.createElement("style");
        e.id = t, e.textContent = '\n    /* ===== Backdrop (overlay nhẹ) ===== */\n    dialog#lazorkit-dialog::backdrop {\n      background: rgba(0,0,0,0);\n      animation: lazor-backdrop-in 160ms ease-out forwards;\n    }\n\n    dialog#lazorkit-dialog[data-state="closing"]::backdrop {\n      animation: lazor-backdrop-out 140ms ease-in forwards;\n    }\n\n    @keyframes lazor-backdrop-in {\n      from { background: rgba(0,0,0,0); }\n      to   { background: rgba(0,0,0,0.12); } /* ✅ overlay nhẹ */\n    }\n\n    @keyframes lazor-backdrop-out {\n      from { background: rgba(0,0,0,0.12); }\n      to   { background: rgba(0,0,0,0); }\n    }\n\n    /* ===== Panel animations ===== */\n    @keyframes lazor-drawer-in {\n      from { transform: translateY(16px); opacity: 0.98; }\n      to   { transform: translateY(0); opacity: 1; }\n    }\n\n    @keyframes lazor-drawer-out {\n      from { transform: translateY(0); opacity: 1; }\n      to   { transform: translateY(16px); opacity: 0.98; }\n    }\n\n    @keyframes lazor-float-in {\n      from { transform: scale(0.985) translateY(4px); opacity: 0; }\n      to   { transform: scale(1) translateY(0); opacity: 1; }\n    }\n\n    @keyframes lazor-float-out {\n      from { transform: scale(1) translateY(0); opacity: 1; }\n      to   { transform: scale(0.985) translateY(4px); opacity: 0; }\n    }\n\n    #lazorkit-panel {\n      will-change: transform, opacity;\n      transform-origin: center;\n    }\n\n    dialog#lazorkit-dialog[data-variant="drawer"][data-state="opening"] #lazorkit-panel {\n      animation: lazor-drawer-in 180ms cubic-bezier(.2,.9,.2,1) forwards;\n    }\n\n    dialog#lazorkit-dialog[data-variant="drawer"][data-state="closing"] #lazorkit-panel {\n      animation: lazor-drawer-out 150ms ease-in forwards;\n    }\n\n    dialog#lazorkit-dialog[data-variant="floating"][data-state="opening"] #lazorkit-panel {\n      animation: lazor-float-in 170ms cubic-bezier(.2,.9,.2,1) forwards;\n    }\n\n    dialog#lazorkit-dialog[data-variant="floating"][data-state="closing"] #lazorkit-panel {\n      animation: lazor-float-out 140ms ease-in forwards;\n    }\n\n    /* ===== Reduced motion ===== */\n    @media (prefers-reduced-motion: reduce) {\n      dialog#lazorkit-dialog::backdrop {\n        animation: none !important;\n        background: rgba(0,0,0,0.12) !important;\n      }\n      dialog#lazorkit-dialog[data-state="closing"]::backdrop {\n        background: rgba(0,0,0,0) !important;\n      }\n      dialog#lazorkit-dialog #lazorkit-panel {\n        animation: none !important;\n      }\n    }\n  ', document.head.appendChild(e);
    }
    createCloseButton(t) {
        const e = document.createElement("button");
        return e.type = "button", e.title = "Close Dialog", e.setAttribute("aria-label", "Close Dialog"), Object.assign(e.style, {
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0",
            color: "rgba(255, 255, 255, 0.6)",
            outline: "none",
            webkitTapHighlightColor: "transparent"
        }), e.addEventListener("mouseenter", ()=>{
            e.style.background = "rgba(255,255,255,0.1)", e.style.color = "#ffffff";
        }), e.addEventListener("mouseleave", ()=>{
            e.style.background = "transparent", e.style.color = "rgba(255, 255, 255, 0.6)";
        }), e.onclick = t, e.innerHTML = '\n    <svg xmlns="http://www.w3.org/2000/svg"\n      width="20" height="20" viewBox="0 0 24 24"\n      fill="none" stroke="currentColor" stroke-width="2"\n      stroke-linecap="round" stroke-linejoin="round">\n      <line x1="18" y1="6" x2="6" y2="18" />\n      <line x1="6" y1="6" x2="18" y2="18" />\n    </svg>\n  ', e;
    }
    async openSignDialog(t) {
        await this.openModal(t), this.iframeRef && (this.credentialManager.setIframeRef(this.iframeRef), setTimeout(()=>{
            this.credentialManager.syncCredentials(!0);
        }, 500));
    }
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    isSafari() {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }
    shouldUsePopup(t) {
        const e = this.isMobileDevice();
        return !(!this.isSafari() || "connect" !== t) || !(!e || "connect" !== t) || !(!e && "sign" === t) && (!e || "sign" !== t);
    }
    getPopupDimensions() {
        if (!window.top) return {
            width: 450,
            height: 600,
            top: 0,
            left: 0
        };
        const t = window.top.outerWidth / 2 + window.top.screenX - 225;
        return {
            width: 450,
            height: 600,
            top: window.top.outerHeight / 2 + window.top.screenY - 300,
            left: t
        };
    }
    async openPopup(t) {
        if (this.popupWindow && !this.popupWindow.closed) try {
            this.popupWindow.close();
        } catch (t) {}
        const e = this.getPopupDimensions();
        if (this.popupWindow = window.open(t, "lazorkit-popup", "width=".concat(e.width, ",height=").concat(e.height, ",top=").concat(e.top, ",left=").concat(e.left, ",resizable,scrollbars,status")), this.startPopupMonitor(), !this.popupWindow) throw this.logger.error("Popup was blocked by browser"), new Error("Popup was blocked by browser");
    }
    startPopupMonitor() {
        this.popupCloseInterval && clearInterval(this.popupCloseInterval), this.popupCloseInterval = setInterval(()=>{
            var _this_popupWindow;
            ((_this_popupWindow = this.popupWindow) === null || _this_popupWindow === void 0 ? void 0 : _this_popupWindow.closed) && (this.popupWindow = null, this.popupCloseInterval && (clearInterval(this.popupCloseInterval), this.popupCloseInterval = null));
        }, 500);
    }
    async openModal(t) {
        this.dialogRef || this.createModal(), this.iframeRef && (this.iframeRef.src = t), this.dialogRef && !this.dialogRef.open && (this.dialogRef.setAttribute("data-state", "opening"), this.dialogRef.showModal(), window.setTimeout(()=>{
            var _this_dialogRef;
            ((_this_dialogRef = this.dialogRef) === null || _this_dialogRef === void 0 ? void 0 : _this_dialogRef.open) && this.dialogRef.setAttribute("data-state", "idle");
        }, 220));
    }
    createModal() {
        this.ensureFonts(), this.ensureDialogBackdropCSS();
        const t = document.createElement("dialog");
        t.id = "lazorkit-dialog", t.style.colorScheme = "dark", t.setAttribute("data-theme", "dark");
        const e = this.isMobileDevice(), a = ((t)=>({
                overlay: {
                    position: "fixed",
                    inset: 0,
                    padding: 0,
                    border: "none",
                    background: "transparent",
                    width: "100%",
                    height: "100%",
                    maxWidth: "none",
                    maxHeight: "none",
                    overflow: "visible",
                    zIndex: 2147483647,
                    display: "grid",
                    placeItems: t ? "end center" : "center"
                },
                panel: {
                    width: t ? "100%" : "360px",
                    maxWidth: t ? "100%" : "90vw",
                    height: t ? "55vh" : "650px",
                    maxHeight: t ? "55vh" : "90vh",
                    background: "white",
                    borderRadius: t ? "20px 20px 0 0" : "20px",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    overflow: "hidden",
                    position: "relative"
                },
                closeButton: {
                    zIndex: 10
                },
                iframeContainer: {
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    border: "none",
                    margin: 0,
                    padding: 0,
                    overflow: "hidden",
                    borderRadius: "inherit",
                    background: "white"
                },
                iframe: {
                    width: "100%",
                    height: "100%",
                    border: 0,
                    borderRadius: "inherit",
                    display: "block"
                }
            }))(e);
        Object.assign(t.style, a.overlay), Object.assign(t.style, {
            "--background-color-th_base": "#191919",
            "--background-color-th_frame": "#191919",
            "--text-color-th_base": "#eeeeee",
            "--border-color-th_frame": "rgba(255,255,255,0.10)"
        });
        const n = document.createElement("div"), r = e ? "drawer" : "floating";
        t.setAttribute("data-variant", r), t.setAttribute("data-state", "idle"), n.id = "lazorkit-panel", Object.assign(n.style, a.panel), Object.assign(n.style, {
            display: "flex",
            flexDirection: "column"
        }), Object.assign(n.style, {
            background: "var(--background-color-th_base, #fcfcfc)",
            color: "var(--text-color-th_base, #202020)",
            fontFamily: '"Roboto Flex", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        });
        const i = document.createElement("div");
        Object.assign(i.style, {
            height: "32px",
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 12px",
            boxSizing: "border-box",
            borderBottom: "1px solid rgba(0,0,0,0.08)"
        }), Object.assign(i.style, {
            background: "var(--background-color-th_frame, var(--background-color-th_base, #fcfcfc))",
            color: "var(--text-color-th_base, #202020)",
            borderBottom: "1px solid var(--border-color-th_frame, rgba(0,0,0,0.08))"
        });
        const s = document.createElement("div");
        Object.assign(s.style, a.iframeContainer), Object.assign(s.style, {
            flex: "1 1 auto"
        }), Object.assign(s.style, {
            background: "var(--background-color-th_base, #fcfcfc)"
        }), Object.assign(n.style, {
            background: "var(--background-color-th_base, #191919)",
            color: "var(--text-color-th_base, #eeeeee)"
        }), Object.assign(i.style, {
            background: "var(--background-color-th_frame, #191919)",
            color: "var(--text-color-th_base, #eeeeee)",
            borderBottom: "1px solid var(--border-color-th_frame, rgba(255,255,255,0.10))"
        }), Object.assign(s.style, {
            background: "var(--background-color-th_base, #191919)"
        });
        const o = this.createCloseButton(()=>{
            this.closeDialog(), this.emit("close");
        });
        Object.assign(o.style, {
            position: "static",
            top: "",
            right: ""
        }), o.id = "lazorkit-dialog-close", o.ariaLabel = "Close", Object.assign(o.style, a.closeButton);
        const l = document.createElement("iframe");
        l.id = "lazorkit-iframe", Object.assign(l.style, a.iframe), l.allow = "publickey-credentials-get ".concat(this.config.portalUrl, "; publickey-credentials-create ").concat(this.config.portalUrl, "; clipboard-write; camera; microphone");
        const c = l.sandbox;
        c.add("allow-forms"), c.add("allow-scripts"), c.add("allow-same-origin"), c.add("allow-popups"), c.add("allow-popups-to-escape-sandbox"), c.add("allow-modals"), l.setAttribute("aria-label", "Lazor Wallet"), l.tabIndex = 0, l.title = "Lazor", t.addEventListener("cancel", ()=>this.closeDialog()), t.addEventListener("click", (e)=>{
            e.target === t && this.closeDialog();
        }), i.appendChild(o), n.appendChild(i), s.appendChild(l), n.appendChild(s), t.appendChild(n), document.body.appendChild(t), this.dialogRef = t, this.iframeRef = l;
    }
    setupMessageListener() {
        window.addEventListener("message", (t)=>{
            if (!t.origin.includes(new URL(this.config.portalUrl).hostname)) return;
            const { type: e, data: a, error: n } = t.data;
            if (n) this.emit("error", new Error(n.message || "Portal error"));
            else switch(e){
                case "connect-result":
                case "WALLET_CONNECTED":
                    const t1 = {
                        publicKey: a.publickey || a.publicKey || "",
                        credentialId: a.credentialId,
                        isCreated: "create" === a.connectionType || !!a.publickey,
                        connectionType: a.connectionType || (a.publickey ? "create" : "get"),
                        timestamp: a.timestamp || Date.now(),
                        accountName: a.accountName
                    };
                    this.emit("connect-result", t1), this.closeDialog();
                    break;
                case "sign-result":
                case "SIGNATURE_CREATED":
                    const e1 = {
                        signature: a.normalized,
                        clientDataJsonBase64: a.clientDataJSONReturn,
                        authenticatorDataBase64: a.authenticatorDataReturn,
                        signedPayload: a.msg
                    };
                    this.emit("sign-result", e1), this.closeDialog();
                    break;
                case "error":
                    this.emit("error", new Error((a === null || a === void 0 ? void 0 : a.message) || "Unknown portal error"));
                    break;
                case "close":
                    this.closeDialog();
            }
        });
    }
    closeDialog() {
        if (this.isClosing) return;
        this.isClosing = !0;
        const t = this.dialogRef, e = this.iframeRef;
        try {
            t && t.setAttribute("data-state", "closing"), window.setTimeout(()=>{
                try {
                    if (e && (e.parentNode && e.parentNode.removeChild(e), this.iframeRef = null), t) {
                        try {
                            t.open && t.close();
                        } catch (e) {}
                        t.parentNode && t.parentNode.removeChild(t), this.dialogRef = null;
                    }
                    if (this.popupWindow) {
                        try {
                            this.popupWindow.close();
                        } catch (e) {}
                        this.popupWindow = null;
                    }
                    this.popupCloseInterval && (clearInterval(this.popupCloseInterval), this.popupCloseInterval = null), this.logger.debug("Closed dialog (animated)");
                } catch (t) {
                    this.logger.error("Error during animated close:", t);
                } finally{
                    this.isClosing = !1;
                }
            }, 170);
        } catch (t) {
            this.logger.error("Error closing dialog:", t), this.isClosing = !1;
        }
    }
    getIframeRef() {
        return this.iframeRef;
    }
    getDialogRef() {
        return this.dialogRef;
    }
    getPopupWindow() {
        return this.popupWindow;
    }
    getCurrentAction() {
        return this._currentAction;
    }
    destroy() {
        this.isDestroyed || (this.isDestroyed = !0, this.closeDialog(), this.credentialManager.destroy(), this.removeAllListeners(), this.logger.debug("Destroyed dialog manager"));
    }
    constructor(t){
        super(), this.dialogRef = null, this.iframeRef = null, this.popupWindow = null, this.popupCloseInterval = null, this.isClosing = !1, this.isDestroyed = !1, this.logger = new R("DialogManager"), this._currentAction = null, this.config = t, this.credentialManager = new $t, this.logger.debug("Created dialog manager"), this.setupMessageListener();
    }
}
const ee = (t)=>new te({
        portalUrl: t.portalUrl,
        rpcUrl: t.rpcUrl,
        paymasterUrl: t.paymasterConfig.paymasterUrl
    }), ae = (t)=>Array.from(new Uint8Array(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$js$2d$sha256$2f$src$2f$sha256$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha256"].arrayBuffer(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(t, "base64")))), ne = (t, e, a)=>{
    const n = t instanceof Error ? t : new Error(String(t));
    throw e({
        error: n
    }), a === null || a === void 0 ? void 0 : a(n), n;
}, re = (t)=>t ? Array.from(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(t, "base64")) : [], ie = async (t, e, a)=>{
    const { isConnecting: n, config: r } = t();
    if (n) throw new Error("Already connecting");
    e({
        isConnecting: !0,
        error: null
    });
    try {
        var _a_onSuccess;
        const n = await U.getWallet();
        if ((()=>{
            if ("undefined" == typeof window) return;
            const t = localStorage.getItem("lazorkit-wallet");
            if (t) try {
                const e = JSON.parse(t);
                e.state && void 0 !== e.version && localStorage.removeItem("lazorkit-wallet");
            } catch (t) {}
        })(), n) return e({
            wallet: n
        }), a === null || a === void 0 ? void 0 : (_a_onSuccess = a.onSuccess) === null || _a_onSuccess === void 0 ? void 0 : _a_onSuccess.call(a, n), n;
        const i = ee(r);
        try {
            var _a_onSuccess1;
            const n = await i.openConnect(), s = new T(r.paymasterConfig), o = new qt(t().connection), l = ae(n.credentialId), c = await o.getSmartWalletByCredentialHash(l);
            let d, A;
            if (!n.publicKey && c ? (A = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(c.passkeyPublicKey).toString("base64"), localStorage.setItem("PUBLIC_KEY", A)) : A = n.publicKey, c) d = c.smartWallet.toBase58();
            else {
                const t = await s.getPayer(), e = await o.createSmartWalletTxn({
                    passkeyPublicKey: re(A),
                    payer: t,
                    credentialIdBase64: n.credentialId
                });
                await s.signAndSend(e.transaction), d = e.smartWallet.toBase58();
            }
            const u = {
                credentialId: n.credentialId,
                passkeyPubkey: re(A),
                expo: "web",
                platform: navigator.platform,
                smartWallet: d,
                walletDevice: "",
                accountName: n.accountName
            };
            return await U.saveWallet(u), e({
                wallet: u
            }), a === null || a === void 0 ? void 0 : (_a_onSuccess1 = a.onSuccess) === null || _a_onSuccess1 === void 0 ? void 0 : _a_onSuccess1.call(a, u), u;
        } finally{
            i.destroy();
        }
    } catch (t) {
        return ne(t, e, a === null || a === void 0 ? void 0 : a.onFail);
    } finally{
        e({
            isConnecting: !1
        });
    }
}, se = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()(C((t, e)=>({
        wallet: null,
        config: {
            portalUrl: P.PORTAL_URL,
            paymasterConfig: {
                paymasterUrl: P.PAYMASTER_URL
            },
            rpcUrl: P.RPC_ENDPOINT
        },
        connection: new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Connection"](P.RPC_ENDPOINT, E),
        isLoading: !1,
        isConnecting: !1,
        isSigning: !1,
        error: null,
        setConfig: (e)=>{
            try {
                const a = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Connection"](e.rpcUrl || P.RPC_ENDPOINT, E);
                t({
                    config: e,
                    connection: a
                });
            } catch (t) {
                throw console.error("Failed to update wallet configuration:", t, {
                    config: e
                }), new Error("Failed to update configuration: ".concat(t));
            }
        },
        setWallet: (e)=>{
            try {
                t({
                    wallet: e
                });
            } catch (t) {
                throw console.error("Failed to set wallet:", t, {
                    wallet: e
                }), t;
            }
        },
        setLoading: (e)=>t({
                isLoading: e
            }),
        setConnecting: (e)=>t({
                isConnecting: e
            }),
        setSigning: (e)=>t({
                isSigning: e
            }),
        setConnection: (e)=>{
            try {
                t({
                    connection: e
                });
            } catch (t) {
                throw console.error("Failed to set connection:", t, {
                    endpoint: e === null || e === void 0 ? void 0 : e.rpcEndpoint
                }), t;
            }
        },
        setError: (e)=>{
            t({
                error: e
            }), e && console.error("Error state set:", e);
        },
        clearError: ()=>{
            t({
                error: null
            });
        },
        connect: (a)=>ie(e, t, a),
        disconnect: ()=>(async (t, e)=>{
                try {
                    var _e_onSuccess;
                    await U.clearWallet(), t({
                        wallet: null,
                        error: null,
                        isConnecting: !1,
                        isSigning: !1,
                        isLoading: !1
                    }), e === null || e === void 0 ? void 0 : (_e_onSuccess = e.onSuccess) === null || _e_onSuccess === void 0 ? void 0 : _e_onSuccess.call(e);
                } catch (a) {
                    return ne(a, t, e === null || e === void 0 ? void 0 : e.onFail);
                }
            })(t),
        signAndSendTransaction: (a)=>(async (t, e, a)=>{
                const { isSigning: n, connection: r, wallet: i, config: s } = t();
                if (n) throw new Error("Already signing");
                if (!i) throw new Error("No wallet connected");
                if (!r) throw new Error("No connection available");
                e({
                    isSigning: !0,
                    error: null
                });
                try {
                    var _a_transactionOptions;
                    const t = new T(s.paymasterConfig), e = new qt(r), n = await t.getPayer(), o = await z(r), l = await e.buildAuthorizationMessage({
                        action: {
                            type: M.CreateChunk,
                            args: {
                                cpiInstructions: a.instructions
                            }
                        },
                        payer: n,
                        smartWallet: new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].PublicKey(i.smartWallet),
                        passkeyPublicKey: i.passkeyPubkey,
                        timestamp: new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BN$3e$__["BN"](o),
                        credentialHash: ae(i.credentialId)
                    }), c = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(l).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""), d = await r.getLatestBlockhash(), u = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].TransactionMessage({
                        payerKey: n,
                        recentBlockhash: d.blockhash,
                        instructions: a.instructions
                    }).compileToV0Message(), p = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].VersionedTransaction(u), g = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(p.serialize()).toString("base64"), m = ee(s), h = i.credentialId, y = (_a_transactionOptions = a.transactionOptions) === null || _a_transactionOptions === void 0 ? void 0 : _a_transactionOptions.clusterSimulation;
                    try {
                        var _a_transactionOptions1, _a_transactionOptions2, _a_onSuccess;
                        const s = await m.openSign(c, g, h, y), l = {
                            msg: c,
                            normalized: s.signature,
                            clientDataJSONReturn: s.clientDataJsonBase64,
                            authenticatorDataReturn: s.authenticatorDataBase64
                        }, d = ae(i.credentialId), u = await e.createChunkTxn({
                            payer: n,
                            smartWallet: new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].PublicKey(i.smartWallet),
                            passkeySignature: {
                                passkeyPublicKey: i.passkeyPubkey,
                                signature64: l.normalized,
                                clientDataJsonRaw64: l.clientDataJSONReturn,
                                authenticatorDataRaw64: l.authenticatorDataReturn
                            },
                            cpiInstructions: a.instructions,
                            timestamp: o,
                            credentialHash: d
                        }), p = await t.signAndSend(u);
                        await r.confirmTransaction(p), await V(r, e, new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].PublicKey(i.smartWallet));
                        const f = ((_a_transactionOptions1 = a.transactionOptions) === null || _a_transactionOptions1 === void 0 ? void 0 : _a_transactionOptions1.addressLookupTableAccounts) || [], w = await e.executeChunkTxn({
                            payer: n,
                            smartWallet: new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].PublicKey(i.smartWallet),
                            cpiInstructions: a.instructions
                        }, {
                            addressLookupTables: f,
                            computeUnitLimit: (_a_transactionOptions2 = a.transactionOptions) === null || _a_transactionOptions2 === void 0 ? void 0 : _a_transactionOptions2.computeUnitLimit
                        });
                        let b;
                        return b = f.length > 0 ? await t.signAndSendVersionedTransaction(w) : await t.signAndSend(w), (_a_onSuccess = a.onSuccess) === null || _a_onSuccess === void 0 ? void 0 : _a_onSuccess.call(a, b), b;
                    } finally{
                        m.destroy();
                    }
                } catch (t) {
                    return ne(t, e, a.onFail);
                } finally{
                    e({
                        isSigning: !1
                    });
                }
            })(e, t, a),
        signMessage: (a)=>(async (t, e, a)=>{
                const { isSigning: n, wallet: r, config: i } = t();
                if (n) throw new Error("Already signing");
                if (!r) throw new Error("No wallet connected");
                e({
                    isSigning: !0,
                    error: null
                });
                try {
                    const t = ee(i);
                    try {
                        const e = await t.openSignMessage(a, r.credentialId);
                        return {
                            signature: e.signature,
                            signedPayload: e.signedPayload
                        };
                    } finally{
                        t.destroy();
                    }
                } catch (t) {
                    throw e({
                        error: t
                    }), t;
                } finally{
                    e({
                        isSigning: !1
                    });
                }
            })(e, t, a)
    }), {
    name: "lazorkit-wallet-store",
    storage: v(()=>x),
    partialize: (t)=>({
            wallet: t.wallet,
            config: t.config
        })
})), oe = (n)=>{
    const { children: r, rpcUrl: i = P.RPC_ENDPOINT, portalUrl: s = P.PORTAL_URL, paymasterConfig: o = {
        paymasterUrl: P.PAYMASTER_URL
    } } = n, { setConfig: l } = se();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        l({
            portalUrl: s,
            paymasterConfig: o,
            rpcUrl: i
        });
    }, [
        i,
        s,
        o,
        l
    ]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: r
    });
};
function le(t) {
    return Uint8Array.from(atob(t), (t)=>t.charCodeAt(0));
}
async function ce(t) {
    let e = t;
    if (64 === e.length) {
        const t = new Uint8Array(65);
        t[0] = 4, t.set(e, 1), e = t;
    }
    return crypto.subtle.importKey("raw", e, {
        name: "ECDSA",
        namedCurve: "P-256"
    }, !1, [
        "verify"
    ]);
}
async function de(param) {
    let { signedPayload: t, signature: e, publicKey: a } = param;
    const n = le(t), r = le(e), i = le(a), s = await ce(i);
    return crypto.subtle.verify({
        name: "ECDSA",
        hash: "SHA-256"
    }, s, r, n);
}
const Ae = ()=>{
    const { wallet: t, isLoading: e, isConnecting: a, isSigning: i, error: s, connect: o, disconnect: l, signAndSendTransaction: c, signMessage: d } = se(), A = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])(async (t)=>{
        try {
            return await o(t);
        } catch (t) {
            throw console.error("Failed to connect wallet:", t), t;
        }
    }, [
        o
    ]), u = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            await l();
        } catch (t) {
            throw console.error("Failed to disconnect wallet:", t), t;
        }
    }, [
        l
    ]), p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])(async (t)=>{
        try {
            return await c({
                instructions: t.instructions,
                transactionOptions: t.transactionOptions
            });
        } catch (t) {
            throw console.error("Failed to sign and send transaction:", t), t;
        }
    }, [
        c
    ]), g = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])(async (t)=>{
        try {
            return await d(t);
        } catch (t) {
            throw console.error("Failed to sign message:", t), t;
        }
    }, [
        d
    ]), m = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])(async (param)=>{
        let { signedPayload: t, signature: e, publicKey: a } = param;
        const n = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(t).toString("base64"), r = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(e).toString("base64"), i = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(a).toString("base64");
        return await de({
            signedPayload: n,
            signature: r,
            publicKey: i
        });
    }, []);
    return {
        smartWalletPubkey: (t === null || t === void 0 ? void 0 : t.smartWallet) ? new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"](t.smartWallet) : null,
        isConnected: !!t,
        isLoading: e || a || i,
        isConnecting: a,
        isSigning: i,
        error: s,
        wallet: t,
        connect: A,
        disconnect: u,
        signAndSendTransaction: p,
        signMessage: g,
        verifyMessage: m
    };
};
function ue() {
    if ("undefined" != typeof window && window.ReactNativeWebView) return "mobile";
    const t = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(t) ? "mobile" : "web";
}
function pe() {
    const t = navigator.userAgent.toLowerCase();
    return /^((?!chrome|android).)*safari/i.test(t);
}
function ge() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}
function me() {
    return /Android/i.test(navigator.userAgent);
}
const he = "CREDENTIAL_ID", ye = "PUBLIC_KEY", fe = "SMART_WALLET_ADDRESS";
class we {
    static saveCredentials(t) {
        try {
            t.credentialId && localStorage.setItem(he, t.credentialId), localStorage.setItem(ye, t.publickey), localStorage.setItem(fe, t.smartWalletAddress), localStorage.setItem("CREDENTIALS_TIMESTAMP", t.timestamp.toString());
        } catch (t) {
            console.error("Failed to save credentials to local storage:", t);
        }
    }
    static getCredentials() {
        try {
            const t = localStorage.getItem(he), e = localStorage.getItem(ye), a = localStorage.getItem(fe), n = localStorage.getItem("CREDENTIALS_TIMESTAMP");
            return e && a ? {
                credentialId: t || void 0,
                publickey: e,
                smartWalletAddress: a,
                timestamp: n ? parseInt(n) : Date.now()
            } : null;
        } catch (t) {
            return console.error("Failed to get credentials from local storage:", t), null;
        }
    }
    static updateSmartWalletAddress(t) {
        try {
            localStorage.setItem(fe, t);
        } catch (t) {
            console.error("Failed to update smart wallet address in local storage:", t);
        }
    }
    static clearCredentials() {
        try {
            localStorage.removeItem(he), localStorage.removeItem(ye), localStorage.removeItem(fe), localStorage.removeItem("CREDENTIALS_TIMESTAMP"), console.log("Credentials cleared from local storage");
        } catch (t) {
            console.error("Failed to clear credentials from local storage:", t);
        }
    }
    static getItem(t) {
        return localStorage.getItem(t);
    }
    static setItem(t, e) {
        localStorage.setItem(t, e);
    }
}
const be = "Lazorkit Wallet", Se = {
    rpcUrl: "https://api.devnet.solana.com",
    portalUrl: "https://portal.lazor.sh",
    paymasterConfig: {
        paymasterUrl: "https://kora.devnet.lazorkit.com"
    }
};
class ke extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$base$2f$lib$2f$esm$2f$adapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BaseWalletAdapter"] {
    get publicKey() {
        return this._publicKey;
    }
    get connecting() {
        return this._connecting;
    }
    get readyState() {
        return this._readyState;
    }
    async connect() {
        try {
            if (this.connected || this.connecting) return;
            if (this._readyState !== __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$base$2f$lib$2f$esm$2f$adapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WalletReadyState"].Installed) throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$base$2f$lib$2f$esm$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WalletWindowClosedError"];
            this._connecting = !0, this.emit("readyStateChange", this._readyState);
            const t = await U.getWallet();
            if (t) return void this._updateWalletState(t);
            const e = this._createDialogManager();
            try {
                const t = await e.openConnect(), a = await this._ensureWalletOnChain(t);
                await U.saveWallet(a), this._updateWalletState(a);
            } finally{
                e.destroy();
            }
        } catch (t) {
            throw this.emit("error", t), t;
        } finally{
            this._connecting = !1;
        }
    }
    _updateWalletState(t) {
        this._wallet = t, this._publicKey = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"](t.smartWallet), this.emit("connect", this._publicKey);
    }
    _createDialogManager() {
        return new te({
            portalUrl: this._config.portalUrl,
            rpcUrl: this._config.rpcUrl,
            paymasterUrl: this._config.paymasterConfig.paymasterUrl
        });
    }
    async _ensureWalletOnChain(t) {
        const e = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Connection"](this._config.rpcUrl), a = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$kora$2f$dist$2f$src$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KoraClient"]({
            rpcUrl: this._config.paymasterConfig.paymasterUrl,
            apiKey: this._config.paymasterConfig.apiKey
        }), n = new qt(e), r = ae(t.credentialId), i = await n.getSmartWalletByCredentialHash(r);
        let o, l;
        if (!t.publicKey && i ? (l = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(i.passkeyPublicKey).toString("base64"), localStorage.setItem("PUBLIC_KEY", l)) : l = t.publicKey, i) o = i.smartWallet.toBase58();
        else {
            const e = await a.getPayerSigner(), r = await n.createSmartWalletTxn({
                passkeyPublicKey: re(t.publicKey),
                payer: new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].PublicKey(e.signer_address),
                credentialIdBase64: t.credentialId
            });
            await a.signAndSendTransaction({
                transaction: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(r.transaction.serialize({
                    requireAllSignatures: !1
                })).toString("base64"),
                signer_key: e.signer_address
            }), o = r.smartWallet.toBase58();
        }
        return {
            credentialId: t.credentialId,
            passkeyPubkey: re(l),
            expo: "web",
            platform: navigator.platform,
            smartWallet: o,
            walletDevice: ""
        };
    }
    async disconnect() {
        await U.clearWallet(), this._wallet = null, this._publicKey = null, this.emit("disconnect");
    }
    async sendTransaction(t) {
        try {
            if (!this._wallet || !this._publicKey) throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$base$2f$lib$2f$esm$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WalletDisconnectedError"];
            const e = this._prepareInstructions(t);
            if (0 === e.length) throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$base$2f$lib$2f$esm$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WalletSignTransactionError"]("No instructions to sign");
            const a = this._initializeClients();
            let n = [];
            if ("version" in t) {
                const e = t.message.addressTableLookups;
                n = await Promise.all(e.map(async (t)=>{
                    const e = await a.connection.getAccountInfo(t.accountKey);
                    if (!e) throw new Error("Lookup table not found");
                    return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AddressLookupTableAccount"]({
                        key: t.accountKey,
                        state: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AddressLookupTableAccount"].deserialize(e.data)
                    });
                }));
            }
            const r = await a.paymaster.getPayerSigner(), i = await z(a.connection), s = ae(this._wallet.credentialId), l = await this._buildAuthorizationMessage(a.smartWallet, e, r.signer_address, i, s), c = await a.connection.getLatestBlockhash(), d = await this._signWithDialog(l, e, c.blockhash, r.signer_address);
            return await this._executeSmartWalletTransaction(a, e, d, r.signer_address, i, s, n);
        } catch (t) {
            throw this.emit("error", t), t;
        }
    }
    async signTransaction(t) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$base$2f$lib$2f$esm$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WalletSignTransactionError"]("Lazorkit Wallet does not support signTransaction. Please use sendTransaction or signAndSendTransaction.");
    }
    async signAllTransactions(t) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$base$2f$lib$2f$esm$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WalletSignTransactionError"]("Lazorkit Wallet does not support signAllTransactions. Please use sendTransaction or signAndSendTransaction.");
    }
    async signMessage(t) {
        const e = this._createDialogManager();
        try {
            if (!this._wallet || !this._publicKey) throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$base$2f$lib$2f$esm$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WalletDisconnectedError"];
            const a = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(t).toString("base64"), n = await e.openSign(a, "", this._wallet.credentialId, this._config.clusterSimulation), r = JSON.stringify({
                signature: n.signature,
                signedPayload: n.signedPayload
            });
            return new Uint8Array(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(r));
        } catch (t) {
            throw this.emit("error", t), t;
        } finally{
            e.destroy();
        }
    }
    _initializeClients() {
        const t = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Connection"](this._config.rpcUrl);
        return {
            connection: t,
            paymaster: new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$kora$2f$dist$2f$src$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KoraClient"]({
                rpcUrl: this._config.paymasterConfig.paymasterUrl,
                apiKey: this._config.paymasterConfig.apiKey
            }),
            smartWallet: new qt(t)
        };
    }
    _prepareInstructions(t) {
        return "version" in t ? t.message.compiledInstructions.map((e)=>new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransactionInstruction"]({
                keys: e.accountKeyIndexes.map((e)=>({
                        pubkey: t.message.staticAccountKeys[e],
                        isSigner: t.message.isAccountSigner(e),
                        isWritable: t.message.isAccountWritable(e)
                    })),
                programId: new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"](t.message.staticAccountKeys[e.programIdIndex]),
                data: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(e.data)
            })) : [
            ...t.instructions
        ];
    }
    async _buildAuthorizationMessage(t, e, a, n, r) {
        return await t.buildAuthorizationMessage({
            action: {
                type: M.CreateChunk,
                args: {
                    cpiInstructions: e
                }
            },
            payer: new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].PublicKey(a),
            smartWallet: this._publicKey,
            passkeyPublicKey: this._wallet.passkeyPubkey,
            timestamp: new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BN$3e$__["BN"](n),
            credentialHash: r
        });
    }
    async _signWithDialog(t, e, a, n) {
        const r = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(t).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, ""), i = this._createDialogManager();
        try {
            const t = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].TransactionMessage({
                payerKey: new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].PublicKey(n),
                recentBlockhash: a,
                instructions: e
            }).compileToV0Message(), s = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].VersionedTransaction(t), o = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(s.serialize()).toString("base64");
            return await i.openSign(r, o, this._wallet.credentialId, this._config.clusterSimulation);
        } finally{
            i.destroy();
        }
    }
    async _executeSmartWalletTransaction(t, e, a, n, r, i, s) {
        const o = await t.smartWallet.createChunkTxn({
            payer: new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].PublicKey(n),
            smartWallet: this._publicKey,
            passkeySignature: {
                passkeyPublicKey: this._wallet.passkeyPubkey,
                signature64: a.signature,
                clientDataJsonRaw64: a.clientDataJsonBase64,
                authenticatorDataRaw64: a.authenticatorDataBase64
            },
            cpiInstructions: e,
            timestamp: r,
            credentialHash: i
        }), l = await this._sendToPaymaster(t.paymaster, o, n);
        await t.connection.confirmTransaction(l, "confirmed"), await V(t.connection, t.smartWallet, this._publicKey);
        const c = await t.smartWallet.executeChunkTxn({
            payer: new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__web3$3e$__["web3"].PublicKey(n),
            smartWallet: this._publicKey,
            cpiInstructions: e
        }, {
            addressLookupTables: s
        });
        return await this._sendToPaymaster(t.paymaster, c, n);
    }
    async _sendToPaymaster(t, e, a) {
        let n;
        n = "version" in e ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(e.serialize()) : __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(e.serialize({
            requireAllSignatures: !1,
            verifySignatures: !1
        }));
        return (await t.signAndSendTransaction({
            transaction: n.toString("base64"),
            signer_key: a
        })).signature;
    }
    constructor(t){
        super(), this.name = be, this.url = "https://lazorkit.com", this.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGcAAABXCAAAAAA8UASIAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB+kMEAUXDRWPYLQAAAB3dEVYdFJhdyBwcm9maWxlIHR5cGUgOGJpbQAKOGJpbQogICAgICA0MAozODQyNDk0ZDA0MDQwMDAwMDAwMDAwMDAzODQyNDk0ZDA0MjUwMDAwMDAwMDAwMTBkNDFkOGNkOThmMDBiMjA0ZTk4MDA5OTgKZWNmODQyN2UKplPDjgAAAAFvck5UAc+id5oAAAg8SURBVGje7ZlNkFVHFcf/53T3ve/NmzcDBASBVCVAEhBC+AoYRciHAwSDliRllS5MlS50kY1WWeXGrSuLilVaxU5LF1bhB4pgCAmJkErkc6pgwghJDMQKhO9hhnkz797bfY6L92YYPmbefeM4btKLe2/fvn1+fU6f7j7dl+YTCAQQABAIVH9Ry4x4uutCNKKwLoCUuFZ4WxExJiEp1E4GB4pJ0QegSdFnsvoHmBy7KXRy9JlIP9Axymiy/O1Tzqec/ytneBQEE4hFUF9KbiutrSq1vHLgAA405gAaXZ8okAbEw4IVUFANpaogIiICwRuNKI3Ga7eMSGJKg9barQTUm1y7iIqIiLCxIUUhNOCMui7YYDBIzg+t57ct7fXlnQjwLok1aLDj5KQRYIy3AQCUbl1JSWsZIiJwHFITJU7HyYkgEtuQ2VsRBQ1FF7X+qsUhtrfFVceeRcfkZNLedz20Uz9GckBaD3i4fldO+rTY1j9eu5m4t+3HpXNJex2j9f4ZiqmknrVyfU5x+6UZaXOc4bESIlM5uHnRP9+8YtpDsCCpB2eBrQqp8WSVOVSmrF/wR3x3+U+gqrX23CvRqHGiOu3xj6ycd/1wFxXgvDGqRJBYUzZKviXT4sBg21NLut7qeGDauR3MPFqcCBqdQwpjJE3aVyyPzxy54MoizFAFgUmJKTjfN3XtmmOHl6w9cfibvwrMXBtl9+SYaaNwOAiRcAGnDl+Ys3Fpdj6FgVdDauGtTUA3XcdX+3/bulV2/P3Fsx8UmRR1n2xGH7EswkzieKDStmzF1FPHPzFFyoywUSVzs7Bm9b/3T996ec+llnnPvlwWACDm0KzdglpWJQNvo8EBN/Pxxb3HTg+4yGVa8APm82sv/nXalmTf+1NM/w/3/ovrQX3T/QOHTA0rB2KAkSUti1dPfa/zLJVsH69+8souu7Vl77uFcjawdtH26UGYoPXQsyl9RA2TKoMgzMoUqjJr5aPJka5sacfNHeGF6fuOx+XgY3np132mNryIWJrV5879D4GpmrnFK+7z4U/XXpj31tvWxamlK99O/vCZrC7hbruxNscBK6yKqejs9MZzyw69oZEzwYhMe3Fbi1BmMGb/5N8vkIowo4XOd6zv+tlAm0ZZML546XtvJKUsNg0q5+YQiDVA497v07br5ZJ4scLmxhPh0NSMk4Ifs3YTcXwAE8gOLiz/wk8hR84IMrYbdrV4YuMb1M7NIVWIEpIvH2gNIB+CkIuubzh7zhmBldHtgOb2CwRV0vSx4jvFOONgLFE2OGfpqzF55nRU+2utbm6OgogtpRv3lGTQeudJxFY3Hbnc5oUDy9i18+8bSYyKVtYMniqkThUMaLpgzutTErJhRIg3Sivz242Dso+/tDeGMULCmeXK1j/HeWvnxYgJzOmKgTOxiFgWcVJ56lq3m2gOp1Fgu253SQxSViJF/MzOQt76+fuHfHxt7eVzsWfDXlhN75bOnrhRHNo0x0eatqzb3RJcFuJAYm489Mgr5byYJvQJLX0b3r9gwUGVGMZ/ZX/WMNxtnsMYnLJqz1RI6qIEsD1fsO+UKMomilOLb1Vgbm5694pVw6LEUPfMzkhVJswPWAUSEAVMf/hgqSppIYETurrp/IdlCDWKq/PrwySwlLirG05dipyhpJgSJ3OX7ZoywCY0mghyc6DEBDLZ3M+90h5EnEhULdzccuwS29zeloujjEzj3ufeSWE8qc0Q9yy977WZA2zgTQ5GLo4weXXat2D2/rKohUfkEb72atA4ZTSap/NzCAAxpOOQD5RSBtKof13f8bbgC5kvNFpHc3Ocl5grfP9nXy9FaaRRnFFSXv+XsohNLWUTZreAKJHWnudfUyUV6yXYmxu7P46JhdVMnF9LnIZC7zIcbbNVR4EkSh9YtHta1YMhkns+adw/XuKqbD7g2ZOBN6Drz+/LfIGgSowJ8wPRKCTLwpG2VKOMLfoKP7h4sEzeqAKSF9M4HrU+RIMdfytYyhKTVmZ+Z9rR0qqTFEdgo4FdTodryKHg+lYnp8tVG9nLs74x62j3Svfw0x91fgwbG4S8AUZDThpT6Pid9U77+VsP/qN7Db/e1Tp7+dez905edq3G53S4xvsFe+XZhT+fIb2t61d3nlsf7T9ZiiittM5fMr/n+OmKK4zYFIxrP1f/xSPQH/3m2qB9csUHZ1bNOHg8skbBhMG0tGTV1LPd3ewKHJQRLIdgx7XPAhGZvs2zts14Yv0HpxYuePtwKLAlVYaylYqfuXRh6+kTF1C0SggUYg08Tk5mXtq+5JlznYseOnHAlwwyQwKCGmUrWcDcxQtD18keUzAg9VRMx8mpbPriR+6tB1acfLPamsU8EDEpiNSIGgaQiLv/8Qcvdp2uxJbEVe04OekvP9xZXv3RvqszMrjEOE8EECmYFMwAKBsoPvrYjPOdn0SF1I23f2zrlZ+u+v2ltmKlAG/rExoBYiiAoawgh2pl+srZp17ubwnj9TdN2uf6kqXA3rI3arQmw6qCSQVMEDU29FPpDJNgnPtgU/RdhjSw1WBIDBRMACnIqLBVgWEAYoWKGDUuGZNDgAqkdcR55a3dfv0cdiirBKjSaAtSjulJFapauwOKW1nUs/XnsVKe+HhICCnp0AWoHx0qQEoNz2FzTrf1BitGHJUPt0EbUnLpQ7c90u2vbh3O/Lf6DJ3y3iE8h+zmOKq4U+gdtpsYzrBEvftVfh7n+G4M+9NYfTOy7H/5P2ukH+bjaNMFdybO4TfDf8vuIbaZuDfnt3q3L+f3Oabmvm8qjRA71D/UqEZt5rn9YKrxBDpc/B9wB8PpHagItQAAECRlWElmTU0AKgAAAAgABgESAAMAAAABAAEAAAEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAAITAAMAAAABAAEAAIdpAAQAAAABAAAAZgAAAMAAAABIAAAAAQAAAEgAAAABAAeQAAAHAAAABDAyMjGRAQAHAAAABAECAwCgAAAHAAAABDAxMDCgAQADAAAAAQABAACgAgAEAAAAAQAAAvygAwAEAAAAAQAAAoikBgADAAAAAQAAAAAAAAAAAAYBAwADAAAAAQAGAAABGgAFAAAAAQAAAQ4BGwAFAAAAAQAAARYBKAADAAAAAQACAAACAQAEAAAAAQAAAR4CAgAEAAAAAQAADwQAAAAAAAAASAAAAAEAAABIAAAAAf/Y/9sAhAABAQEBAQECAQECAwICAgMEAwMDAwQFBAQEBAQFBgUFBQUFBQYGBgYGBgYGBwcHBwcHCAgICAgJCQkJCQkJCQkJAQEBAQICAgQCAgQJBgUGCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQn/3QAEAAr/wAARCACIAKADASIAAhEBAxEB/8QBogAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoLEAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+foBAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKCxEAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+SCIcVpx8DHpWZD0rTjoAsp6VpwHisuOtO36UAaydK0IutZ6dK0IutAGlEBxV+ICqMXar8NAGjDjgCtGHPes6LtWhDQBpRVp2wBYVlw1q2vUUAaqDmtJPu4rNTrWknSgCxGf0rSh/hrMjrTg6LQBrJ0rTjA4FZidK1I+1AGhD0q3HkNxVSHpVuP71AH//0P5IIelacdZkPStOOgCxHWnb9KzI607fpQBrJ0rQi61np0rQi60AacXar8NUIu1X4aANGLPGa0Iaz4u1aMNAGhDWra9RWXFWpbdRQBqp1rSTpWanWtJOlAE8dacHRazI604Oi0AaydK1I+1ZadK1I+1AGhD0q3H96qkPSrUf3qAP/9H+SCHpWnHWZD0rTjoAsR1p2/SsyOtO36UAaydK+vf2Xv2ePhx+0DPqeleLfijoPw+1K02GytdcjnUX4IO4QzovkK6kABJHRmz8ua+Qk6VfjAb5WGRQB+gnxB/Y/wDht8IryGx+JnxJbRGuc/Z3uvDWsLDcAfxQTCIxTL7xswriYvg5+zP/ANFotP8AwQat/wDGq84+GP7SXxl+FelP4X8OaubrQJ8CfRNTij1DS5gOz2V0skBx2IUMvVSDzXqf/CVfsmfFS1Y+LdCvvhprjYxd+H92o6M7eslhdS/arcevk3Eq9lRBxQBJF8HP2ascfGa0/wDBDq3/AMarQj+Dv7NfQfGW0/8ABDqv/wAbrG1f9kn4lf2NN4u+FVzp/wARNDt082a78NSm5mt09bqwdY723A7s8HlA8CQ184rG8MjQSja6cFSMEexHagD62j+D37NvX/hctp/4IdV/+N1fi+EH7N6kbfjHaf8Agh1X/wCNV85+BfAnjT4keI4PB/w+0m61rVLniK1sommlb32oDgDuTgAdcCvu34UfsjeGrfWZrXx7ct4u1bTo/Ou9F8OXMK2OngdTrOvy/wCg2ca/x+SZmH3QQ/AAMb4e/stfC/4p67/wjnw7+JY1i8SPzZEtvD2rMIoxwZJX8vbFGO7uVUetdbrf7A/ju98ayeFvghr+meP9MsbKW61LxBZFrTR7KS3R5Z7dr26CQSywxpucQPIFzt6giuy8dftFfCjwB4bk+H2kRWHiaKKQNH4e0BJ9P8IwuowJLudmTUtblXpmd0jP94p8lc/8R/jR8RtF+BME/jTUt3iX4h2nlWtjbolta6L4YRyBDbWkKpDbHUZU6RoP9Gj5z55wAfAqgAkAg47jp+FaUHRazI604Oi0AaydK1I+1ZadK1I+1AGhD0q3Hw1VIelW4/vcUAf/0v5IIelacdZkPStOOgCxHWnb9KzI607fpQBrJ0rQi61np0rQi60AacXar8NUIu1X4aAOn8O69rvhfWLbxD4YvbjTNQtGDwXVpK8E0TDo0ckZVkPupFfZ3gz48+Nfjx4osfBPxZ8FWXxT1O+/0e2lEZsdaLYzkX1j5TylQNxa5EowCWOK+G4s8Zr7O8AOnwP/AGeNU+Ke/wAvxL8QBc+H9EHSS20pAF1S9X0NxkWMZH8BuO+2gD6f8W/Fv4XfCDw3ceAdSlsJ7acDzfBXge4eLTWI6LrniEM93f8AP3ra3laPPWWMrtr4x+IXx++IvxQ0u28I6hNDpXhmxffZ6DpUS2mmwHs3kp/rZMf8tZi8n+1jivAYQoACjAA4ArUtgWYIgyx4AA5J9AKAPoz9nn4caB488Zz6r49ZoPCPhe1bV9elQhWNnCwVbaInjz7uUpbw+jPuI2o2Od+KXxK1z4v+P9S+IniFI4Z9QkGy3hG2G2giURW9tCvaOCJUjQei5POa9k+NYX4J/DzTv2YLJFXWWki1nxfKPvDUDGfsumZH8NhE580dDcyOMfugT8sx/doAnjrTg6LWZHWnB0WgDWTpWpH2rLTpWpH2oA0IelW4/vcVUh6Vaj+9QB//0/5IIelacdZkPStOOgCxHWnb9KzI607fpQBrJ0rQi61np0rQi60AacXar8NUIu1X4aAPXfgv8MNX+MnxM0j4b6PKls2oy/vrqX/VWlrEpkubqX0jt4UeV/ZcDnFd1+0J8T9K+KPxIe58IRNa+F9DtotH8PWr4zDplnlYSwHHmzEtPMR1lkftiu50OOD4H/szXHiidceKPimkljp3Z7Tw/azBbu5Hp9uuI/s0frHDP2K18oxHPtQBoxV9efs16Pp3gnT9V/ae8WQh7LwcyRaLDIBtvfEEyk2cQB4ZLUD7XOOgSNFODIlfM/gnwj4j8f8Ai3TPA3hG1a91XWLmKztIEHzSTTMERR+J+gHPSvof9ofxdoUeo6V8C/h1epfeFPASSWdvdRDCahqEpDahqA9VmmGyEnnyI4unQAHhmo6rqeu6pca3rdw93e3kjT3E8py8ksh3O7H1YnJp6dKzU61pJ0oAnjrTg6LWZHWnB0WgDWTpWpH2rLTpWpH2oA0IelW48buaqQ9KtR/eoA//1P5IIelacdZkPStOOgCxHWnb9KzI607fpQBrJ0rQi61np0rQi60AacXavaPgT8K5vjN8TdO8CtcjT7B/MutTvn/1dlp1ohnvLlz2WGBHb3ICjJIFeLR9Bivs9n/4UV+zFHYLG0Pir4tJ5srnhoPDNrN+7Re4+33kJZv70dunYnIB5t8d/ihb/Fv4nXviXRomtdDtlj07RLNuPsulWSCCzhwOAwiVS+Orlj3ryuGs2NlA3HAAr6++D37JHj74gJpfiPxk3/CLeG9TmWO3u7xHN3f8jdHpdhGr3N7KRwvlx+Upx5kiLzQB0nw18z4B/BG9+OErCLxN4yS50PwwpH7yCy/1eqanGf4Dj/QoW7s823/VnHypa9RX0J+1hf8Ajq6+L9xZ+NPDN74NtNLhj0rRtGvYXhaz06zGy3hG8Dc2MvKw+9KzseSa+e7XqKANVOtaSdKzU61pJ0oAnjrTg6LWZHWnB0WgDWTpWpH2rLTpWpH2oA0IelW4/vcVUh6Vbj+9xQB//9X+SCHpWnHWZD0rTjoAsR1p2/SsyOtO36UAaydK0IutZ6dK0IutAHvn7PXwx0v4sfE200HxRdNp3h2wil1PXb5ettplmvm3LL28xlHlQg9ZXQV79rfw6+K37VvjLUPj1qNta+D/AAZd3CWVjfam5t7C1s7ZVgtbCwjw092beFUjEVrHI2R82GbJd+xx+0H8M/hPp+rfDfx1o+nxReMr2yj1HxHqVrLqkenadZkzeWmlxPCLovOI3KySGMtHHuRlUqfs74lftC/Bi/1me6+Dfxk/sm6dBAPEepaLf3XiDyAMCG2mjjjttLgA+7Dp8MOwfKHxkUAYFn8O/wBnT9kdVv8AxoRFrSRCSO61qzjvdalJ6f2d4dZjb6cD1W41h/OCkMlvGwAPzb8TP22/iJ4qvbhPhn9o8Lw3Efkz6i1095r93EBgJc6s4WUR44Fvarb2y/wxDknjJfhL+ztfXMl7ffGmGaeVi7ySaFqbM7HklieST61Zh+DX7NnX/hclt/4INS/woAxvBP7UPxq8IadF4dm1Ya/ocQ2jSNfij1awC/3VgvFkWMf9c9uO1ehW3if9k34nyBfF+g3/AMNtTk/5fdAZtS0nd6vp10/2qFf7xhupQP4IQMCsaP4N/s2jj/hclr/4IdS/wq/D8Hf2cFwV+Mdr/wCCHUv8KANBv2UPHviCGbU/ghqGnfEaxh5xoMpa/wBoHU6ZMI73jvshfHevnu6sb3TLqTT9She2uIWKSRSqUdGHBVlYAgj0Ir6MsvhR+z5ZXMd5Z/GWCGWMgo6aHqaspHQggZH4V9U6d8UvhzqunJoPxh+Kei/ETT0QRp/wkPhzU5r2JRwBDqUZjvVwOFVpXjXslAH5jx1pwdFr7R+N3gH9haLwE/ir4EeO9T/4SSIru0C50+eW0mDMATb3siQvEEUltsqyE4wGFfF8P8NAGqnStSPtWWnStSPtQBoQ9Ktx/eqpD0q1H96gD//W/kgh6Vpx1mQ9K046ALEdadv0rMjrTt+lAGsnStCLrWenStCLrQBpxdqvw1Qi7VfhoA0YhjFaMNZ0WOMVow0AaMWe9alr1FZcWe9alr1FAGqnWtJOlZqda0k6UATx1pwdFrMjrTg6LQBrJ0rUj7Vlp0rUj7UAaEPSrcf3qqQ9Ktx/eoA//9f+SCLgVpx9M1lR9BWrF/qxQBZQVpwDis1Pu1qQfcoA006VoRdaz06VoRdaANKIjgVfiIFZ0XWr8dAGpFzjFaMII4NZ0H3R9K0060AX4hjitO2IDCs1OtaEH3hQBsJ1rST7tZcfatSP7goAsRitKH+Gs+PoK0Yuq0AaqdK04yOKzE6VoJ0oA1IelW4wd3FVIOhq7D94fhQB/9kAAO26j/EAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjUtMTItMTZUMDU6MjM6MTMrMDA6MDDRx6XwAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI1LTEyLTE2VDA1OjIzOjEzKzAwOjAwoJodTAAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNS0xMi0xNlQwNToyMzoxMyswMDowMPePPJMAAAARdEVYdGV4aWY6Q29sb3JTcGFjZQAxD5sCSQAAACB0RVh0ZXhpZjpDb21wb25lbnRzQ29uZmlndXJhdGlvbgAuLi5q8qFkAAAAE3RFWHRleGlmOkV4aWZPZmZzZXQAMTAyc0IppwAAABV0RVh0ZXhpZjpFeGlmVmVyc2lvbgAwMjIx5Fw1LQAAABl0RVh0ZXhpZjpGbGFzaFBpeFZlcnNpb24AMDEwMBLUKKwAAAAYdEVYdGV4aWY6UGl4ZWxYRGltZW5zaW9uADc2NBOIX0AAAAAYdEVYdGV4aWY6UGl4ZWxZRGltZW5zaW9uADY0OLTF+qgAAAAXdEVYdGV4aWY6U2NlbmVDYXB0dXJlVHlwZQAwIrQxYwAAABx0RVh0ZXhpZjp0aHVtYm5haWw6Q29tcHJlc3Npb24ANvllcFcAAAAodEVYdGV4aWY6dGh1bWJuYWlsOkpQRUdJbnRlcmNoYW5nZUZvcm1hdAAyODaLUk57AAAAL3RFWHRleGlmOnRodW1ibmFpbDpKUEVHSW50ZXJjaGFuZ2VGb3JtYXRMZW5ndGgAMzg0NI983bUAAAAfdEVYdGV4aWY6dGh1bWJuYWlsOlJlc29sdXRpb25Vbml0ADIlQF7TAAAAH3RFWHRleGlmOnRodW1ibmFpbDpYUmVzb2x1dGlvbgA3Mi8x2ocYLAAAAB90RVh0ZXhpZjp0aHVtYm5haWw6WVJlc29sdXRpb24ANzIvMXTvib0AAAAXdEVYdGV4aWY6WUNiQ3JQb3NpdGlvbmluZwAxrA+AYwAAAABJRU5ErkJggg==", this.supportedTransactionVersions = new Set([
            "legacy",
            0
        ]), this._publicKey = null, this._readyState = "undefined" == typeof window || "undefined" == typeof document ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$base$2f$lib$2f$esm$2f$adapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WalletReadyState"].Unsupported : __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$base$2f$lib$2f$esm$2f$adapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WalletReadyState"].Installed, this._connecting = !1, this._wallet = null, this._config = Se, t && (this._config = {
            ...this._config,
            ...t
        });
    }
}
function Ie(t) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$wallet$2d$standard$2f$wallet$2f$lib$2f$esm$2f$register$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerWallet"])(new ve(t));
}
class ve {
    get accounts() {
        return this._account ? [
            this._account
        ] : [];
    }
    get chains() {
        return [
            "solana:mainnet",
            "solana:devnet",
            "solana:testnet"
        ];
    }
    get features() {
        var _this = this;
        return {
            "standard:connect": {
                version: "1.0.0",
                connect: async ()=>(await this._adapter.connect(), {
                        accounts: this.accounts
                    })
            },
            "standard:disconnect": {
                version: "1.0.0",
                disconnect: async ()=>{
                    await this._adapter.disconnect();
                }
            },
            "standard:events": {
                version: "1.0.0",
                on: (t, e)=>(this._listeners[t] = this._listeners[t] || [], this._listeners[t].push(e), ()=>{
                        var _this__listeners_t;
                        this._listeners[t] = ((_this__listeners_t = this._listeners[t]) === null || _this__listeners_t === void 0 ? void 0 : _this__listeners_t.filter((t)=>t !== e)) || [];
                    })
            },
            "solana:signAndSendTransaction": {
                version: "1.0.0",
                supportedTransactionVersions: [
                    "legacy",
                    0
                ],
                signAndSendTransaction: async function() {
                    for(var _len = arguments.length, t = new Array(_len), _key = 0; _key < _len; _key++){
                        t[_key] = arguments[_key];
                    }
                    const e = [];
                    for (const a of t){
                        const t = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VersionedTransaction"].deserialize(a.transaction), n = await _this._adapter.sendTransaction(t);
                        e.push({
                            signature: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$lazorkit$2f$wallet$2f$node_modules$2f$bs58$2f$src$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].decode(n)
                        });
                    }
                    return e;
                }
            },
            "solana:signTransaction": {
                version: "1.0.0",
                supportedTransactionVersions: [
                    "legacy",
                    0
                ],
                signTransaction: async function() {
                    for(var _len = arguments.length, t = new Array(_len), _key = 0; _key < _len; _key++){
                        t[_key] = arguments[_key];
                    }
                    throw new Error("signTransaction not supported");
                }
            },
            "solana:signMessage": {
                version: "1.0.0",
                signMessage: async function() {
                    for(var _len = arguments.length, t = new Array(_len), _key = 0; _key < _len; _key++){
                        t[_key] = arguments[_key];
                    }
                    const e = [];
                    for (const a of t){
                        const t = await _this._adapter.signMessage(a.message);
                        e.push({
                            message: a.message,
                            signature: t,
                            signedMessage: a.message
                        });
                    }
                    return e;
                }
            }
        };
    }
    _emit(t) {
        for(var _len = arguments.length, e = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            e[_key - 1] = arguments[_key];
        }
        var _this__listeners_t;
        (_this__listeners_t = this._listeners[t]) === null || _this__listeners_t === void 0 ? void 0 : _this__listeners_t.forEach((t)=>t(...e));
    }
    constructor(t){
        this.version = "1.0.0", this.name = be, this.icon = "data:image/png;base64,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", this._account = null, this._listeners = {}, this._adapter = new ke(t), this._adapter.on("connect", (t)=>{
            this._account = {
                address: t.toBase58(),
                publicKey: t.toBytes(),
                chains: [
                    "solana:mainnet",
                    "solana:devnet",
                    "solana:testnet"
                ],
                features: [
                    "solana:signAndSendTransaction",
                    "solana:signTransaction",
                    "solana:signMessage"
                ]
            }, this._emit("change", {
                accounts: [
                    this._account
                ]
            });
        }), this._adapter.on("disconnect", ()=>{
            this._account = null, this._emit("change", {
                accounts: []
            });
        });
    }
}
;
 //# sourceMappingURL=index.mjs.map
}),
]);

//# sourceMappingURL=33bea_%40lazorkit_wallet_dist_index_mjs_0a6c7c88._.js.map