module.exports = [
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/common.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "chunks",
    ()=>chunks,
    "isBrowser",
    ()=>isBrowser,
    "isVersionedTransaction",
    ()=>isVersionedTransaction
]);
var _a;
const isBrowser = process.env.ANCHOR_BROWSER || "undefined" !== "undefined" && !((_a = window.process) === null || _a === void 0 ? void 0 : _a.hasOwnProperty("type"));
function chunks(array, size) {
    return Array.apply(0, new Array(Math.ceil(array.length / size))).map((_, index)=>array.slice(index * size, (index + 1) * size));
}
const isVersionedTransaction = (tx)=>{
    return "version" in tx;
}; //# sourceMappingURL=common.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/bytes/hex.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decode",
    ()=>decode,
    "encode",
    ()=>encode
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/buffer [external] (buffer, cjs)");
;
function encode(data) {
    return data.reduce((str, byte)=>str + byte.toString(16).padStart(2, "0"), "0x");
}
function decode(data) {
    if (data.indexOf("0x") === 0) {
        data = data.substr(2);
    }
    if (data.length % 2 === 1) {
        data = "0" + data;
    }
    let key = data.match(/.{2}/g);
    if (key === null) {
        return __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].from([]);
    }
    return __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].from(key.map((byte)=>parseInt(byte, 16)));
} //# sourceMappingURL=hex.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/bytes/utf8.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decode",
    ()=>decode,
    "encode",
    ()=>encode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/common.js [app-ssr] (ecmascript)");
;
function decode(array) {
    const decoder = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isBrowser"] ? new TextDecoder("utf-8") // Browser https://caniuse.com/textencoder.
     : new (__turbopack_context__.r("[externals]/util [external] (util, cjs)")).TextDecoder("utf-8"); // Node.
    return decoder.decode(array);
}
function encode(input) {
    const encoder = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isBrowser"] ? new TextEncoder() // Browser.
     : new (__turbopack_context__.r("[externals]/util [external] (util, cjs)")).TextEncoder("utf-8"); // Node.
    return encoder.encode(input);
} //# sourceMappingURL=utf8.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/bytes/bs58.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decode",
    ()=>decode,
    "encode",
    ()=>encode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bs58$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/bs58/index.js [app-ssr] (ecmascript)");
;
function encode(data) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bs58$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].encode(data);
}
function decode(data) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bs58$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].decode(data);
} //# sourceMappingURL=bs58.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/bytes/base64.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decode",
    ()=>decode,
    "encode",
    ()=>encode
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/buffer [external] (buffer, cjs)");
;
function encode(data) {
    return data.toString("base64");
}
function decode(data) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].from(data, "base64");
} //# sourceMappingURL=base64.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/bytes/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$bytes$2f$hex$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/bytes/hex.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$bytes$2f$utf8$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/bytes/utf8.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$bytes$2f$bs58$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/bytes/bs58.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$bytes$2f$base64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/bytes/base64.js [app-ssr] (ecmascript)"); //# sourceMappingURL=index.js.map
;
;
;
;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/bytes/bs58.js [app-ssr] (ecmascript) <export * as bs58>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "bs58",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$bytes$2f$bs58$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$bytes$2f$bs58$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/bytes/bs58.js [app-ssr] (ecmascript)");
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/idl.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "convertIdlToCamelCase",
    ()=>convertIdlToCamelCase,
    "decodeIdlAccount",
    ()=>decodeIdlAccount,
    "encodeIdlAccount",
    ()=>encodeIdlAccount,
    "handleDefinedFields",
    ()=>handleDefinedFields,
    "idlAddress",
    ()=>idlAddress,
    "isCompositeAccounts",
    ()=>isCompositeAccounts,
    "seed",
    ()=>seed
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$camelcase$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/camelcase/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/buffer [external] (buffer, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/web3.js/lib/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/borsh/dist/index.js [app-ssr] (ecmascript)");
;
;
;
;
function isCompositeAccounts(accountItem) {
    return "accounts" in accountItem;
}
async function idlAddress(programId) {
    const base = (await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"].findProgramAddress([], programId))[0];
    return await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"].createWithSeed(base, seed(), programId);
}
function seed() {
    return "anchor:idl";
}
const IDL_ACCOUNT_LAYOUT = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["publicKey"]("authority"),
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["vecU8"]("data")
]);
function decodeIdlAccount(data) {
    return IDL_ACCOUNT_LAYOUT.decode(data);
}
function encodeIdlAccount(acc) {
    const buffer = __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].alloc(1000); // TODO: use a tighter buffer.
    const len = IDL_ACCOUNT_LAYOUT.encode(acc, buffer);
    return buffer.slice(0, len);
}
function convertIdlToCamelCase(idl) {
    const KEYS_TO_CONVERT = [
        "name",
        "path",
        "account",
        "relations",
        "generic"
    ];
    // `my_account.field` is getting converted to `myAccountField` but we
    // need `myAccount.field`.
    const toCamelCase = (s)=>s.split(".").map(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$camelcase$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]).join(".");
    const recursivelyConvertNamesToCamelCase = (obj)=>{
        for(const key in obj){
            const val = obj[key];
            if (KEYS_TO_CONVERT.includes(key)) {
                obj[key] = Array.isArray(val) ? val.map(toCamelCase) : toCamelCase(val);
            } else if (typeof val === "object") {
                recursivelyConvertNamesToCamelCase(val);
            }
        }
    };
    const camelCasedIdl = structuredClone(idl);
    recursivelyConvertNamesToCamelCase(camelCasedIdl);
    return camelCasedIdl;
}
function handleDefinedFields(fields, unitCb, namedCb, tupleCb) {
    // Unit
    if (!(fields === null || fields === void 0 ? void 0 : fields.length)) return unitCb();
    // Named
    if (fields[0].name) {
        return namedCb(fields);
    }
    // Tuple
    return tupleCb(fields);
} //# sourceMappingURL=idl.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/common.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parseIdlErrors",
    ()=>parseIdlErrors,
    "toInstruction",
    ()=>toInstruction,
    "translateAddress",
    ()=>translateAddress,
    "validateAccounts",
    ()=>validateAccounts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/web3.js/lib/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/idl.js [app-ssr] (ecmascript)");
;
;
function parseIdlErrors(idl) {
    const errors = new Map();
    if (idl.errors) {
        idl.errors.forEach((e)=>{
            var _a;
            let msg = (_a = e.msg) !== null && _a !== void 0 ? _a : e.name;
            errors.set(e.code, msg);
        });
    }
    return errors;
}
function toInstruction(idlIx, ...args) {
    if (idlIx.args.length != args.length) {
        throw new Error("Invalid argument length");
    }
    const ix = {};
    let idx = 0;
    idlIx.args.forEach((ixArg)=>{
        ix[ixArg.name] = args[idx];
        idx += 1;
    });
    return ix;
}
function validateAccounts(ixAccounts, accounts = {}) {
    ixAccounts.forEach((acc)=>{
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isCompositeAccounts"])(acc)) {
            validateAccounts(acc.accounts, accounts[acc.name]);
        } else {
            if (!accounts[acc.name]) {
                throw new Error(`Account \`${acc.name}\` not provided.`);
            }
        }
    });
}
function translateAddress(address) {
    return address instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"] ? address : new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"](address);
} //# sourceMappingURL=common.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/rpc.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getMultipleAccounts",
    ()=>getMultipleAccounts,
    "getMultipleAccountsAndContext",
    ()=>getMultipleAccountsAndContext,
    "invoke",
    ()=>invoke,
    "simulateTransaction",
    ()=>simulateTransaction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/web3.js/lib/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/common.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/common.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/superstruct/lib/index.es.js [app-ssr] (ecmascript)");
;
;
;
;
;
async function invoke(programId, accounts, data, provider) {
    programId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translateAddress"])(programId);
    if (!provider) {
        provider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProvider"])();
    }
    const tx = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Transaction"]();
    tx.add(new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TransactionInstruction"]({
        programId,
        keys: accounts !== null && accounts !== void 0 ? accounts : [],
        data
    }));
    if (provider.sendAndConfirm === undefined) {
        throw new Error("This function requires 'Provider.sendAndConfirm' to be implemented.");
    }
    return await provider.sendAndConfirm(tx, []);
}
const GET_MULTIPLE_ACCOUNTS_LIMIT = 99;
async function getMultipleAccounts(connection, publicKeys, commitment) {
    const results = await getMultipleAccountsAndContext(connection, publicKeys, commitment);
    return results.map((result)=>{
        return result ? {
            publicKey: result.publicKey,
            account: result.account
        } : null;
    });
}
async function getMultipleAccountsAndContext(connection, publicKeys, commitment) {
    if (publicKeys.length <= GET_MULTIPLE_ACCOUNTS_LIMIT) {
        return await getMultipleAccountsAndContextCore(connection, publicKeys, commitment);
    } else {
        const batches = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chunks"])(publicKeys, GET_MULTIPLE_ACCOUNTS_LIMIT);
        const results = await Promise.all(batches.map((batch)=>getMultipleAccountsAndContextCore(connection, batch, commitment)));
        return results.flat();
    }
}
async function getMultipleAccountsAndContextCore(connection, publicKeys, commitmentOverride) {
    const commitment = commitmentOverride !== null && commitmentOverride !== void 0 ? commitmentOverride : connection.commitment;
    const { value: accountInfos, context } = await connection.getMultipleAccountsInfoAndContext(publicKeys, commitment);
    const accounts = accountInfos.map((account, idx)=>{
        if (account === null) {
            return null;
        }
        return {
            publicKey: publicKeys[idx],
            account,
            context
        };
    });
    return accounts;
}
async function simulateTransaction(connection, transaction, signers, commitment, includeAccounts) {
    var _a;
    if (signers && signers.length > 0) {
        transaction.sign(...signers);
    }
    // @ts-expect-error
    const message = transaction._compile();
    const signData = message.serialize();
    // @ts-expect-error
    const wireTransaction = transaction._serialize(signData);
    const encodedTransaction = wireTransaction.toString("base64");
    const config = {
        encoding: "base64",
        commitment: commitment !== null && commitment !== void 0 ? commitment : connection.commitment
    };
    if (includeAccounts) {
        const addresses = (Array.isArray(includeAccounts) ? includeAccounts : message.nonProgramIds()).map((key)=>key.toBase58());
        config["accounts"] = {
            encoding: "base64",
            addresses
        };
    }
    if (signers && signers.length > 0) {
        config.sigVerify = true;
    }
    const args = [
        encodedTransaction,
        config
    ];
    // @ts-expect-error
    const unsafeRes = await connection._rpcRequest("simulateTransaction", args);
    const res = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])(unsafeRes, SimulatedTransactionResponseStruct);
    if ("error" in res) {
        let logs;
        if ("data" in res.error) {
            logs = (_a = res.error.data) === null || _a === void 0 ? void 0 : _a.logs;
            if (logs && Array.isArray(logs)) {
                const traceIndent = "\n    ";
                const logTrace = traceIndent + logs.join(traceIndent);
                console.error(res.error.message, logTrace);
            }
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SendTransactionError"]("failed to simulate transaction: " + res.error.message, logs);
    }
    return res.result;
}
// copy from @solana/web3.js
function jsonRpcResult(schema) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["coerce"])(createRpcResult(schema), UnknownRpcResult, (value)=>{
        if ("error" in value) {
            return value;
        } else {
            return {
                ...value,
                result: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])(value.result, schema)
            };
        }
    });
}
// copy from @solana/web3.js
const UnknownRpcResult = createRpcResult((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unknown"])());
// copy from @solana/web3.js
function createRpcResult(result) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["union"])([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["type"])({
            jsonrpc: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["literal"])("2.0"),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])(),
            result
        }),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["type"])({
            jsonrpc: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["literal"])("2.0"),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])(),
            error: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["type"])({
                code: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unknown"])(),
                message: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])(),
                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["optional"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["any"])())
            })
        })
    ]);
}
// copy from @solana/web3.js
function jsonRpcResultAndContext(value) {
    return jsonRpcResult((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["type"])({
        context: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["type"])({
            slot: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["number"])()
        }),
        value
    }));
}
// copy from @solana/web3.js
const SimulatedTransactionResponseStruct = jsonRpcResultAndContext((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["type"])({
    err: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nullable"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["union"])([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["type"])({}),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])()
    ])),
    logs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nullable"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["array"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])())),
    accounts: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["optional"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nullable"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["array"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nullable"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["type"])({
        executable: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["boolean"])(),
        owner: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])(),
        lamports: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["number"])(),
        data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["array"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["string"])()),
        rentEpoch: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["optional"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["number"])())
    }))))),
    unitsConsumed: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["optional"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$superstruct$2f$lib$2f$index$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["number"])())
})); //# sourceMappingURL=rpc.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/nodewallet.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NodeWallet
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/buffer [external] (buffer, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/web3.js/lib/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/common.js [app-ssr] (ecmascript)");
;
;
;
class NodeWallet {
    constructor(payer){
        this.payer = payer;
    }
    static local() {
        const process = __turbopack_context__.r("[externals]/process [external] (process, cjs)");
        if (!process.env.ANCHOR_WALLET || process.env.ANCHOR_WALLET === "") {
            throw new Error("expected environment variable `ANCHOR_WALLET` is not set.");
        }
        const payer = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Keypair"].fromSecretKey(__TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].from(JSON.parse(__turbopack_context__.r("[externals]/fs [external] (fs, cjs)").readFileSync(process.env.ANCHOR_WALLET, {
            encoding: "utf-8"
        }))));
        return new NodeWallet(payer);
    }
    async signTransaction(tx) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isVersionedTransaction"])(tx)) {
            tx.sign([
                this.payer
            ]);
        } else {
            tx.partialSign(this.payer);
        }
        return tx;
    }
    async signAllTransactions(txs) {
        return txs.map((t)=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isVersionedTransaction"])(t)) {
                t.sign([
                    this.payer
                ]);
            } else {
                t.partialSign(this.payer);
            }
            return t;
        });
    }
    get publicKey() {
        return this.payer.publicKey;
    }
} //# sourceMappingURL=nodewallet.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/provider.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnchorProvider",
    ()=>AnchorProvider,
    "getProvider",
    ()=>getProvider,
    "setProvider",
    ()=>setProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/web3.js/lib/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$bytes$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/bytes/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$bytes$2f$bs58$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__bs58$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/bytes/bs58.js [app-ssr] (ecmascript) <export * as bs58>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/common.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$rpc$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/rpc.js [app-ssr] (ecmascript)");
;
;
;
;
class AnchorProvider {
    /**
     * @param connection The cluster connection where the program is deployed.
     * @param wallet     The wallet used to pay for and sign all transactions.
     * @param opts       Transaction confirmation options to use by default.
     */ constructor(connection, wallet, opts = AnchorProvider.defaultOptions()){
        this.connection = connection;
        this.wallet = wallet;
        this.opts = opts;
        this.publicKey = wallet === null || wallet === void 0 ? void 0 : wallet.publicKey;
    }
    static defaultOptions() {
        return {
            preflightCommitment: "processed",
            commitment: "processed"
        };
    }
    /**
     * Returns a `Provider` with a wallet read from the local filesystem.
     *
     * @param url  The network cluster url.
     * @param opts The default transaction confirmation options.
     *
     * (This api is for Node only.)
     */ static local(url, opts = AnchorProvider.defaultOptions()) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isBrowser"]) {
            throw new Error(`Provider local is not available on browser.`);
        }
        const connection = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Connection"](url !== null && url !== void 0 ? url : "http://127.0.0.1:8899", opts.preflightCommitment);
        const NodeWallet = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/nodewallet.js [app-ssr] (ecmascript)").default;
        const wallet = NodeWallet.local();
        return new AnchorProvider(connection, wallet, opts);
    }
    /**
     * Returns a `Provider` read from the `ANCHOR_PROVIDER_URL` environment
     * variable
     *
     * (This api is for Node only.)
     */ static env() {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isBrowser"]) {
            throw new Error(`Provider env is not available on browser.`);
        }
        const process = __turbopack_context__.r("[externals]/process [external] (process, cjs)");
        const url = process.env.ANCHOR_PROVIDER_URL;
        if (url === undefined) {
            throw new Error("ANCHOR_PROVIDER_URL is not defined");
        }
        const options = AnchorProvider.defaultOptions();
        const connection = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Connection"](url, options.commitment);
        const NodeWallet = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/nodewallet.js [app-ssr] (ecmascript)").default;
        const wallet = NodeWallet.local();
        return new AnchorProvider(connection, wallet, options);
    }
    /**
     * Sends the given transaction, paid for and signed by the provider's wallet.
     *
     * @param tx      The transaction to send.
     * @param signers The signers of the transaction.
     * @param opts    Transaction confirmation options.
     */ async sendAndConfirm(tx, signers, opts) {
        var _a, _b, _c, _d;
        if (opts === undefined) {
            opts = this.opts;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isVersionedTransaction"])(tx)) {
            if (signers) {
                tx.sign(signers);
            }
        } else {
            tx.feePayer = (_a = tx.feePayer) !== null && _a !== void 0 ? _a : this.wallet.publicKey;
            tx.recentBlockhash = (await this.connection.getLatestBlockhash(opts.preflightCommitment)).blockhash;
            if (signers) {
                for (const signer of signers){
                    tx.partialSign(signer);
                }
            }
        }
        tx = await this.wallet.signTransaction(tx);
        const rawTx = tx.serialize();
        try {
            return await sendAndConfirmRawTransaction(this.connection, rawTx, opts);
        } catch (err) {
            // thrown if the underlying 'confirmTransaction' encounters a failed tx
            // the 'confirmTransaction' error does not return logs so we make another rpc call to get them
            if (err instanceof ConfirmError) {
                // choose the shortest available commitment for 'getTransaction'
                // (the json RPC does not support any shorter than "confirmed" for 'getTransaction')
                // because that will see the tx sent with `sendAndConfirmRawTransaction` no matter which
                // commitment `sendAndConfirmRawTransaction` used
                const txSig = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$bytes$2f$bs58$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__bs58$3e$__["bs58"].encode((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isVersionedTransaction"])(tx) ? ((_b = tx.signatures) === null || _b === void 0 ? void 0 : _b[0]) || new Uint8Array() : (_c = tx.signature) !== null && _c !== void 0 ? _c : new Uint8Array());
                const maxVer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isVersionedTransaction"])(tx) ? 0 : undefined;
                const failedTx = await this.connection.getTransaction(txSig, {
                    commitment: "confirmed",
                    maxSupportedTransactionVersion: maxVer
                });
                if (!failedTx) {
                    throw err;
                } else {
                    const logs = (_d = failedTx.meta) === null || _d === void 0 ? void 0 : _d.logMessages;
                    throw !logs ? err : new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SendTransactionError"](err.message, logs);
                }
            } else {
                throw err;
            }
        }
    }
    /**
     * Similar to `send`, but for an array of transactions and signers.
     * All transactions need to be of the same type, it doesn't support a mix of `VersionedTransaction`s and `Transaction`s.
     *
     * @param txWithSigners Array of transactions and signers.
     * @param opts          Transaction confirmation options.
     */ async sendAll(txWithSigners, opts) {
        var _a, _b, _c;
        if (opts === undefined) {
            opts = this.opts;
        }
        const recentBlockhash = (await this.connection.getLatestBlockhash(opts.preflightCommitment)).blockhash;
        let txs = txWithSigners.map((r)=>{
            var _a, _b;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isVersionedTransaction"])(r.tx)) {
                let tx = r.tx;
                if (r.signers) {
                    tx.sign(r.signers);
                }
                return tx;
            } else {
                let tx = r.tx;
                let signers = (_a = r.signers) !== null && _a !== void 0 ? _a : [];
                tx.feePayer = (_b = tx.feePayer) !== null && _b !== void 0 ? _b : this.wallet.publicKey;
                tx.recentBlockhash = recentBlockhash;
                signers.forEach((kp)=>{
                    tx.partialSign(kp);
                });
                return tx;
            }
        });
        const signedTxs = await this.wallet.signAllTransactions(txs);
        const sigs = [];
        for(let k = 0; k < txs.length; k += 1){
            const tx = signedTxs[k];
            const rawTx = tx.serialize();
            try {
                sigs.push(await sendAndConfirmRawTransaction(this.connection, rawTx, opts));
            } catch (err) {
                // thrown if the underlying 'confirmTransaction' encounters a failed tx
                // the 'confirmTransaction' error does not return logs so we make another rpc call to get them
                if (err instanceof ConfirmError) {
                    // choose the shortest available commitment for 'getTransaction'
                    // (the json RPC does not support any shorter than "confirmed" for 'getTransaction')
                    // because that will see the tx sent with `sendAndConfirmRawTransaction` no matter which
                    // commitment `sendAndConfirmRawTransaction` used
                    const txSig = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$bytes$2f$bs58$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__bs58$3e$__["bs58"].encode((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isVersionedTransaction"])(tx) ? ((_a = tx.signatures) === null || _a === void 0 ? void 0 : _a[0]) || new Uint8Array() : (_b = tx.signature) !== null && _b !== void 0 ? _b : new Uint8Array());
                    const maxVer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isVersionedTransaction"])(tx) ? 0 : undefined;
                    const failedTx = await this.connection.getTransaction(txSig, {
                        commitment: "confirmed",
                        maxSupportedTransactionVersion: maxVer
                    });
                    if (!failedTx) {
                        throw err;
                    } else {
                        const logs = (_c = failedTx.meta) === null || _c === void 0 ? void 0 : _c.logMessages;
                        throw !logs ? err : new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SendTransactionError"](err.message, logs);
                    }
                } else {
                    throw err;
                }
            }
        }
        return sigs;
    }
    /**
     * Simulates the given transaction, returning emitted logs from execution.
     *
     * @param tx      The transaction to send.
     * @param signers The signers of the transaction. If unset, the transaction
     *                will be simulated with the "sigVerify: false" option. This
     *                allows for simulation of transactions without asking the
     *                wallet for a signature.
     * @param opts    Transaction confirmation options.
     */ async simulate(tx, signers, commitment, includeAccounts) {
        let recentBlockhash = (await this.connection.getLatestBlockhash(commitment !== null && commitment !== void 0 ? commitment : this.connection.commitment)).blockhash;
        let result;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isVersionedTransaction"])(tx)) {
            if (signers && signers.length > 0) {
                tx.sign(signers);
                tx = await this.wallet.signTransaction(tx);
            }
            // Doesn't support includeAccounts which has been changed to something
            // else in later versions of this function.
            result = await this.connection.simulateTransaction(tx, {
                commitment
            });
        } else {
            tx.feePayer = tx.feePayer || this.wallet.publicKey;
            tx.recentBlockhash = recentBlockhash;
            if (signers && signers.length > 0) {
                tx = await this.wallet.signTransaction(tx);
            }
            result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$rpc$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["simulateTransaction"])(this.connection, tx, signers, commitment, includeAccounts);
        }
        if (result.value.err) {
            throw new SimulateError(result.value);
        }
        return result.value;
    }
}
class SimulateError extends Error {
    constructor(simulationResponse, message){
        super(message);
        this.simulationResponse = simulationResponse;
    }
}
// Copy of Connection.sendAndConfirmRawTransaction that throws
// a better error if 'confirmTransaction` returns an error status
async function sendAndConfirmRawTransaction(connection, rawTransaction, options) {
    const sendOptions = options ? {
        skipPreflight: options.skipPreflight,
        preflightCommitment: options.preflightCommitment || options.commitment,
        maxRetries: options.maxRetries,
        minContextSlot: options.minContextSlot
    } : {};
    let status;
    const startTime = Date.now();
    while(Date.now() - startTime < 60000){
        try {
            const signature = await connection.sendRawTransaction(rawTransaction, sendOptions);
            if (options === null || options === void 0 ? void 0 : options.blockhash) {
                if (sendOptions.maxRetries === 0) {
                    const abortSignal = AbortSignal.timeout(15000);
                    status = (await connection.confirmTransaction({
                        abortSignal,
                        signature,
                        ...options.blockhash
                    }, options && options.commitment)).value;
                } else {
                    status = (await connection.confirmTransaction({
                        signature,
                        ...options.blockhash
                    }, options && options.commitment)).value;
                }
            } else {
                status = (await connection.confirmTransaction(signature, options && options.commitment)).value;
            }
            if (status.err) {
                throw new ConfirmError(`Raw transaction ${signature} failed (${JSON.stringify(status)})`);
            }
            return signature;
        } catch (err) {
            if (err.name === "TimeoutError") {
                continue;
            }
            throw err;
        }
    }
    throw Error("Transaction failed to confirm in 60s");
}
class ConfirmError extends Error {
    constructor(message){
        super(message);
    }
}
function setProvider(provider) {
    _provider = provider;
}
function getProvider() {
    if (_provider === null) {
        return AnchorProvider.local();
    }
    return _provider;
}
// Global provider used as the default when a provider is not given.
let _provider = null; //# sourceMappingURL=provider.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/features.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isSet",
    ()=>isSet,
    "set",
    ()=>set
]);
const _AVAILABLE_FEATURES = new Set([
    "debug-logs"
]);
const _FEATURES = new Map();
function set(key) {
    if (!_AVAILABLE_FEATURES.has(key)) {
        throw new Error("Invalid feature");
    }
    _FEATURES.set(key, true);
}
function isSet(key) {
    return _FEATURES.get(key) !== undefined;
} //# sourceMappingURL=features.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/error.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnchorError",
    ()=>AnchorError,
    "IdlError",
    ()=>IdlError,
    "LangErrorCode",
    ()=>LangErrorCode,
    "LangErrorMessage",
    ()=>LangErrorMessage,
    "ProgramError",
    ()=>ProgramError,
    "ProgramErrorStack",
    ()=>ProgramErrorStack,
    "translateError",
    ()=>translateError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/web3.js/lib/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor-errors/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$features$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/features.js [app-ssr] (ecmascript)");
;
;
;
class IdlError extends Error {
    constructor(message){
        super(message);
        this.name = "IdlError";
    }
}
class ProgramErrorStack {
    constructor(stack){
        this.stack = stack;
    }
    static parse(logs) {
        var _a;
        const programKeyRegex = /^Program (\w*) invoke/;
        const successRegex = /^Program \w* success/;
        const programStack = [];
        for(let i = 0; i < logs.length; i++){
            if (successRegex.exec(logs[i])) {
                programStack.pop();
                continue;
            }
            const programKey = (_a = programKeyRegex.exec(logs[i])) === null || _a === void 0 ? void 0 : _a[1];
            if (!programKey) {
                continue;
            }
            programStack.push(new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"](programKey));
        }
        return new ProgramErrorStack(programStack);
    }
}
class AnchorError extends Error {
    constructor(errorCode, errorMessage, errorLogs, logs, origin, comparedValues){
        super(errorLogs.join("\n").replace("Program log: ", ""));
        this.errorLogs = errorLogs;
        this.logs = logs;
        this.error = {
            errorCode,
            errorMessage,
            comparedValues,
            origin
        };
        this._programErrorStack = ProgramErrorStack.parse(logs);
    }
    static parse(logs) {
        if (!logs) {
            return null;
        }
        const anchorErrorLogIndex = logs.findIndex((log)=>log.startsWith("Program log: AnchorError"));
        if (anchorErrorLogIndex === -1) {
            return null;
        }
        const anchorErrorLog = logs[anchorErrorLogIndex];
        const errorLogs = [
            anchorErrorLog
        ];
        let comparedValues;
        if (anchorErrorLogIndex + 1 < logs.length) {
            // This catches the comparedValues where the following is logged
            // <AnchorError>
            // Left:
            // <Pubkey>
            // Right:
            // <Pubkey>
            if (logs[anchorErrorLogIndex + 1] === "Program log: Left:") {
                const pubkeyRegex = /^Program log: (.*)$/;
                const leftPubkey = pubkeyRegex.exec(logs[anchorErrorLogIndex + 2])[1];
                const rightPubkey = pubkeyRegex.exec(logs[anchorErrorLogIndex + 4])[1];
                comparedValues = [
                    new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"](leftPubkey),
                    new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"](rightPubkey)
                ];
                errorLogs.push(...logs.slice(anchorErrorLogIndex + 1, anchorErrorLogIndex + 5));
            } else if (logs[anchorErrorLogIndex + 1].startsWith("Program log: Left:")) {
                const valueRegex = /^Program log: (Left|Right): (.*)$/;
                const leftValue = valueRegex.exec(logs[anchorErrorLogIndex + 1])[2];
                const rightValue = valueRegex.exec(logs[anchorErrorLogIndex + 2])[2];
                errorLogs.push(...logs.slice(anchorErrorLogIndex + 1, anchorErrorLogIndex + 3));
                comparedValues = [
                    leftValue,
                    rightValue
                ];
            }
        }
        const regexNoInfo = /^Program log: AnchorError occurred\. Error Code: (.*)\. Error Number: (\d*)\. Error Message: (.*)\./;
        const noInfoAnchorErrorLog = regexNoInfo.exec(anchorErrorLog);
        const regexFileLine = /^Program log: AnchorError thrown in (.*):(\d*)\. Error Code: (.*)\. Error Number: (\d*)\. Error Message: (.*)\./;
        const fileLineAnchorErrorLog = regexFileLine.exec(anchorErrorLog);
        const regexAccountName = /^Program log: AnchorError caused by account: (.*)\. Error Code: (.*)\. Error Number: (\d*)\. Error Message: (.*)\./;
        const accountNameAnchorErrorLog = regexAccountName.exec(anchorErrorLog);
        if (noInfoAnchorErrorLog) {
            const [errorCodeString, errorNumber, errorMessage] = noInfoAnchorErrorLog.slice(1, 4);
            const errorCode = {
                code: errorCodeString,
                number: parseInt(errorNumber)
            };
            return new AnchorError(errorCode, errorMessage, errorLogs, logs, undefined, comparedValues);
        } else if (fileLineAnchorErrorLog) {
            const [file, line, errorCodeString, errorNumber, errorMessage] = fileLineAnchorErrorLog.slice(1, 6);
            const errorCode = {
                code: errorCodeString,
                number: parseInt(errorNumber)
            };
            const fileLine = {
                file,
                line: parseInt(line)
            };
            return new AnchorError(errorCode, errorMessage, errorLogs, logs, fileLine, comparedValues);
        } else if (accountNameAnchorErrorLog) {
            const [accountName, errorCodeString, errorNumber, errorMessage] = accountNameAnchorErrorLog.slice(1, 5);
            const origin = accountName;
            const errorCode = {
                code: errorCodeString,
                number: parseInt(errorNumber)
            };
            return new AnchorError(errorCode, errorMessage, errorLogs, logs, origin, comparedValues);
        } else {
            return null;
        }
    }
    get program() {
        return this._programErrorStack.stack[this._programErrorStack.stack.length - 1];
    }
    get programErrorStack() {
        return this._programErrorStack.stack;
    }
    toString() {
        return this.message;
    }
}
class ProgramError extends Error {
    constructor(code, msg, logs){
        super();
        this.code = code;
        this.msg = msg;
        this.logs = logs;
        if (logs) {
            this._programErrorStack = ProgramErrorStack.parse(logs);
        }
    }
    static parse(err, idlErrors) {
        const errString = err.toString();
        // TODO: don't rely on the error string. web3.js should preserve the error
        //       code information instead of giving us an untyped string.
        let unparsedErrorCode;
        if (errString.includes("custom program error:")) {
            let components = errString.split("custom program error: ");
            if (components.length !== 2) {
                return null;
            } else {
                unparsedErrorCode = components[1];
            }
        } else {
            const matches = errString.match(/"Custom":([0-9]+)}/g);
            if (!matches || matches.length > 1) {
                return null;
            }
            unparsedErrorCode = matches[0].match(/([0-9]+)/g)[0];
        }
        let errorCode;
        try {
            errorCode = parseInt(unparsedErrorCode);
        } catch (parseErr) {
            return null;
        }
        // Parse user error.
        let errorMsg = idlErrors.get(errorCode);
        if (errorMsg !== undefined) {
            return new ProgramError(errorCode, errorMsg, err.logs);
        }
        // Parse framework internal error.
        errorMsg = LangErrorMessage.get(errorCode);
        if (errorMsg !== undefined) {
            return new ProgramError(errorCode, errorMsg, err.logs);
        }
        // Unable to parse the error. Just return the untranslated error.
        return null;
    }
    get program() {
        var _a;
        return (_a = this._programErrorStack) === null || _a === void 0 ? void 0 : _a.stack[this._programErrorStack.stack.length - 1];
    }
    get programErrorStack() {
        var _a;
        return (_a = this._programErrorStack) === null || _a === void 0 ? void 0 : _a.stack;
    }
    toString() {
        return this.msg;
    }
}
function translateError(err, idlErrors) {
    if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$features$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isSet"]("debug-logs")) {
        console.log("Translating error:", err);
    }
    const anchorError = AnchorError.parse(err.logs);
    if (anchorError) {
        return anchorError;
    }
    const programError = ProgramError.parse(err, idlErrors);
    if (programError) {
        return programError;
    }
    if (err.logs) {
        const handler = {
            get: function(target, prop) {
                if (prop === "programErrorStack") {
                    return target.programErrorStack.stack;
                } else if (prop === "program") {
                    return target.programErrorStack.stack[err.programErrorStack.stack.length - 1];
                } else {
                    // this is the normal way to return all other props
                    // without modifying them.
                    // @ts-expect-error
                    return Reflect.get(...arguments);
                }
            }
        };
        err.programErrorStack = ProgramErrorStack.parse(err.logs);
        return new Proxy(err, handler);
    }
    return err;
}
const LangErrorCode = {
    // Instructions.
    InstructionMissing: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__INSTRUCTION_MISSING"],
    InstructionFallbackNotFound: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__INSTRUCTION_FALLBACK_NOT_FOUND"],
    InstructionDidNotDeserialize: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__INSTRUCTION_DID_NOT_DESERIALIZE"],
    InstructionDidNotSerialize: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__INSTRUCTION_DID_NOT_SERIALIZE"],
    // IDL instructions.
    IdlInstructionStub: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__IDL_INSTRUCTION_STUB"],
    IdlInstructionInvalidProgram: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__IDL_INSTRUCTION_INVALID_PROGRAM"],
    IdlAccountNotEmpty: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__IDL_ACCOUNT_NOT_EMPTY"],
    // Event instructions.
    EventInstructionStub: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__EVENT_INSTRUCTION_STUB"],
    // Constraints.
    ConstraintMut: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_MUT"],
    ConstraintHasOne: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_HAS_ONE"],
    ConstraintSigner: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_SIGNER"],
    ConstraintRaw: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_RAW"],
    ConstraintOwner: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_OWNER"],
    ConstraintRentExempt: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_RENT_EXEMPT"],
    ConstraintSeeds: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_SEEDS"],
    ConstraintExecutable: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_EXECUTABLE"],
    ConstraintState: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_STATE"],
    ConstraintAssociated: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_ASSOCIATED"],
    ConstraintAssociatedInit: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_ASSOCIATED_INIT"],
    ConstraintClose: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_CLOSE"],
    ConstraintAddress: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_ADDRESS"],
    ConstraintZero: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_ZERO"],
    ConstraintTokenMint: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_TOKEN_MINT"],
    ConstraintTokenOwner: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_TOKEN_OWNER"],
    ConstraintMintMintAuthority: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_MINT_MINT_AUTHORITY"],
    ConstraintMintFreezeAuthority: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_MINT_FREEZE_AUTHORITY"],
    ConstraintMintDecimals: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_MINT_DECIMALS"],
    ConstraintSpace: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_SPACE"],
    ConstraintAccountIsNone: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_ACCOUNT_IS_NONE"],
    ConstraintTokenTokenProgram: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_TOKEN_TOKEN_PROGRAM"],
    ConstraintMintTokenProgram: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_MINT_TOKEN_PROGRAM"],
    ConstraintAssociatedTokenTokenProgram: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_ASSOCIATED_TOKEN_TOKEN_PROGRAM"],
    ConstraintMintGroupPointerExtension: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION"],
    ConstraintMintGroupPointerExtensionAuthority: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION_AUTHORITY"],
    ConstraintMintGroupPointerExtensionGroupAddress: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION_GROUP_ADDRESS"],
    ConstraintMintGroupMemberPointerExtension: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION"],
    ConstraintMintGroupMemberPointerExtensionAuthority: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION_AUTHORITY"],
    ConstraintMintGroupMemberPointerExtensionMemberAddress: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION_MEMBER_ADDRESS"],
    ConstraintMintMetadataPointerExtension: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION"],
    ConstraintMintMetadataPointerExtensionAuthority: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION_AUTHORITY"],
    ConstraintMintMetadataPointerExtensionMetadataAddress: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION_METADATA_ADDRESS"],
    ConstraintMintCloseAuthorityExtension: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_MINT_CLOSE_AUTHORITY_EXTENSION"],
    ConstraintMintCloseAuthorityExtensionAuthority: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_MINT_CLOSE_AUTHORITY_EXTENSION_AUTHORITY"],
    ConstraintMintPermanentDelegateExtension: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_MINT_PERMANENT_DELEGATE_EXTENSION"],
    ConstraintMintPermanentDelegateExtensionDelegate: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_MINT_PERMANENT_DELEGATE_EXTENSION_DELEGATE"],
    ConstraintMintTransferHookExtension: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION"],
    ConstraintMintTransferHookExtensionAuthority: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION_AUTHORITY"],
    ConstraintMintTransferHookExtensionProgramId: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION_PROGRAM_ID"],
    // Require.
    RequireViolated: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__REQUIRE_VIOLATED"],
    RequireEqViolated: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__REQUIRE_EQ_VIOLATED"],
    RequireKeysEqViolated: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__REQUIRE_KEYS_EQ_VIOLATED"],
    RequireNeqViolated: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__REQUIRE_NEQ_VIOLATED"],
    RequireKeysNeqViolated: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__REQUIRE_KEYS_NEQ_VIOLATED"],
    RequireGtViolated: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__REQUIRE_GT_VIOLATED"],
    RequireGteViolated: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__REQUIRE_GTE_VIOLATED"],
    // Accounts.
    AccountDiscriminatorAlreadySet: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_ALREADY_SET"],
    AccountDiscriminatorNotFound: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_NOT_FOUND"],
    AccountDiscriminatorMismatch: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_MISMATCH"],
    AccountDidNotDeserialize: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__ACCOUNT_DID_NOT_DESERIALIZE"],
    AccountDidNotSerialize: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__ACCOUNT_DID_NOT_SERIALIZE"],
    AccountNotEnoughKeys: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__ACCOUNT_NOT_ENOUGH_KEYS"],
    AccountNotMutable: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__ACCOUNT_NOT_MUTABLE"],
    AccountOwnedByWrongProgram: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__ACCOUNT_OWNED_BY_WRONG_PROGRAM"],
    InvalidProgramId: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__INVALID_PROGRAM_ID"],
    InvalidProgramExecutable: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__INVALID_PROGRAM_EXECUTABLE"],
    AccountNotSigner: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__ACCOUNT_NOT_SIGNER"],
    AccountNotSystemOwned: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__ACCOUNT_NOT_SYSTEM_OWNED"],
    AccountNotInitialized: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__ACCOUNT_NOT_INITIALIZED"],
    AccountNotProgramData: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__ACCOUNT_NOT_PROGRAM_DATA"],
    AccountNotAssociatedTokenAccount: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__ACCOUNT_NOT_ASSOCIATED_TOKEN_ACCOUNT"],
    AccountSysvarMismatch: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__ACCOUNT_SYSVAR_MISMATCH"],
    AccountReallocExceedsLimit: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__ACCOUNT_REALLOC_EXCEEDS_LIMIT"],
    AccountDuplicateReallocs: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__ACCOUNT_DUPLICATE_REALLOCS"],
    // Miscellaneous
    DeclaredProgramIdMismatch: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__DECLARED_PROGRAM_ID_MISMATCH"],
    TryingToInitPayerAsProgramAccount: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__TRYING_TO_INIT_PAYER_AS_PROGRAM_ACCOUNT"],
    InvalidNumericConversion: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__INVALID_NUMERIC_CONVERSION"],
    // Used for APIs that shouldn't be used anymore.
    Deprecated: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2d$errors$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_ERROR__DEPRECATED"]
};
const LangErrorMessage = new Map([
    // Instructions.
    [
        LangErrorCode.InstructionMissing,
        "Instruction discriminator not provided"
    ],
    [
        LangErrorCode.InstructionFallbackNotFound,
        "Fallback functions are not supported"
    ],
    [
        LangErrorCode.InstructionDidNotDeserialize,
        "The program could not deserialize the given instruction"
    ],
    [
        LangErrorCode.InstructionDidNotSerialize,
        "The program could not serialize the given instruction"
    ],
    // Idl instructions.
    [
        LangErrorCode.IdlInstructionStub,
        "The program was compiled without idl instructions"
    ],
    [
        LangErrorCode.IdlInstructionInvalidProgram,
        "The transaction was given an invalid program for the IDL instruction"
    ],
    [
        LangErrorCode.IdlAccountNotEmpty,
        "IDL account must be empty in order to resize, try closing first"
    ],
    // Event instructions.
    [
        LangErrorCode.EventInstructionStub,
        "The program was compiled without `event-cpi` feature"
    ],
    // Constraints.
    [
        LangErrorCode.ConstraintMut,
        "A mut constraint was violated"
    ],
    [
        LangErrorCode.ConstraintHasOne,
        "A has one constraint was violated"
    ],
    [
        LangErrorCode.ConstraintSigner,
        "A signer constraint was violated"
    ],
    [
        LangErrorCode.ConstraintRaw,
        "A raw constraint was violated"
    ],
    [
        LangErrorCode.ConstraintOwner,
        "An owner constraint was violated"
    ],
    [
        LangErrorCode.ConstraintRentExempt,
        "A rent exemption constraint was violated"
    ],
    [
        LangErrorCode.ConstraintSeeds,
        "A seeds constraint was violated"
    ],
    [
        LangErrorCode.ConstraintExecutable,
        "An executable constraint was violated"
    ],
    [
        LangErrorCode.ConstraintState,
        "Deprecated Error, feel free to replace with something else"
    ],
    [
        LangErrorCode.ConstraintAssociated,
        "An associated constraint was violated"
    ],
    [
        LangErrorCode.ConstraintAssociatedInit,
        "An associated init constraint was violated"
    ],
    [
        LangErrorCode.ConstraintClose,
        "A close constraint was violated"
    ],
    [
        LangErrorCode.ConstraintAddress,
        "An address constraint was violated"
    ],
    [
        LangErrorCode.ConstraintZero,
        "Expected zero account discriminant"
    ],
    [
        LangErrorCode.ConstraintTokenMint,
        "A token mint constraint was violated"
    ],
    [
        LangErrorCode.ConstraintTokenOwner,
        "A token owner constraint was violated"
    ],
    [
        LangErrorCode.ConstraintMintMintAuthority,
        "A mint mint authority constraint was violated"
    ],
    [
        LangErrorCode.ConstraintMintFreezeAuthority,
        "A mint freeze authority constraint was violated"
    ],
    [
        LangErrorCode.ConstraintMintDecimals,
        "A mint decimals constraint was violated"
    ],
    [
        LangErrorCode.ConstraintSpace,
        "A space constraint was violated"
    ],
    [
        LangErrorCode.ConstraintAccountIsNone,
        "A required account for the constraint is None"
    ],
    [
        LangErrorCode.ConstraintTokenTokenProgram,
        "A token account token program constraint was violated"
    ],
    [
        LangErrorCode.ConstraintMintTokenProgram,
        "A mint token program constraint was violated"
    ],
    [
        LangErrorCode.ConstraintAssociatedTokenTokenProgram,
        "An associated token account token program constraint was violated"
    ],
    [
        LangErrorCode.ConstraintMintGroupPointerExtension,
        "A group pointer extension constraint was violated"
    ],
    [
        LangErrorCode.ConstraintMintGroupPointerExtensionAuthority,
        "A group pointer extension authority constraint was violated"
    ],
    [
        LangErrorCode.ConstraintMintGroupPointerExtensionGroupAddress,
        "A group pointer extension group address constraint was violated"
    ],
    [
        LangErrorCode.ConstraintMintGroupMemberPointerExtension,
        "A group member pointer extension constraint was violated"
    ],
    [
        LangErrorCode.ConstraintMintGroupMemberPointerExtensionAuthority,
        "A group member pointer extension authority constraint was violated"
    ],
    [
        LangErrorCode.ConstraintMintGroupMemberPointerExtensionMemberAddress,
        "A group member pointer extension group address constraint was violated"
    ],
    [
        LangErrorCode.ConstraintMintMetadataPointerExtension,
        "A metadata pointer extension constraint was violated"
    ],
    [
        LangErrorCode.ConstraintMintMetadataPointerExtensionAuthority,
        "A metadata pointer extension authority constraint was violated"
    ],
    [
        LangErrorCode.ConstraintMintMetadataPointerExtensionMetadataAddress,
        "A metadata pointer extension metadata address constraint was violated"
    ],
    [
        LangErrorCode.ConstraintMintCloseAuthorityExtension,
        "A close authority constraint was violated"
    ],
    [
        LangErrorCode.ConstraintMintCloseAuthorityExtensionAuthority,
        "A close authority extension authority constraint was violated"
    ],
    [
        LangErrorCode.ConstraintMintPermanentDelegateExtension,
        "A permanent delegate extension constraint was violated"
    ],
    [
        LangErrorCode.ConstraintMintPermanentDelegateExtensionDelegate,
        "A permanent delegate extension delegate constraint was violated"
    ],
    [
        LangErrorCode.ConstraintMintTransferHookExtension,
        "A transfer hook extension constraint was violated"
    ],
    [
        LangErrorCode.ConstraintMintTransferHookExtensionAuthority,
        "A transfer hook extension authority constraint was violated"
    ],
    [
        LangErrorCode.ConstraintMintTransferHookExtensionProgramId,
        "A transfer hook extension transfer hook program id constraint was violated"
    ],
    // Require.
    [
        LangErrorCode.RequireViolated,
        "A require expression was violated"
    ],
    [
        LangErrorCode.RequireEqViolated,
        "A require_eq expression was violated"
    ],
    [
        LangErrorCode.RequireKeysEqViolated,
        "A require_keys_eq expression was violated"
    ],
    [
        LangErrorCode.RequireNeqViolated,
        "A require_neq expression was violated"
    ],
    [
        LangErrorCode.RequireKeysNeqViolated,
        "A require_keys_neq expression was violated"
    ],
    [
        LangErrorCode.RequireGtViolated,
        "A require_gt expression was violated"
    ],
    [
        LangErrorCode.RequireGteViolated,
        "A require_gte expression was violated"
    ],
    // Accounts.
    [
        LangErrorCode.AccountDiscriminatorAlreadySet,
        "The account discriminator was already set on this account"
    ],
    [
        LangErrorCode.AccountDiscriminatorNotFound,
        "No discriminator was found on the account"
    ],
    [
        LangErrorCode.AccountDiscriminatorMismatch,
        "Account discriminator did not match what was expected"
    ],
    [
        LangErrorCode.AccountDidNotDeserialize,
        "Failed to deserialize the account"
    ],
    [
        LangErrorCode.AccountDidNotSerialize,
        "Failed to serialize the account"
    ],
    [
        LangErrorCode.AccountNotEnoughKeys,
        "Not enough account keys given to the instruction"
    ],
    [
        LangErrorCode.AccountNotMutable,
        "The given account is not mutable"
    ],
    [
        LangErrorCode.AccountOwnedByWrongProgram,
        "The given account is owned by a different program than expected"
    ],
    [
        LangErrorCode.InvalidProgramId,
        "Program ID was not as expected"
    ],
    [
        LangErrorCode.InvalidProgramExecutable,
        "Program account is not executable"
    ],
    [
        LangErrorCode.AccountNotSigner,
        "The given account did not sign"
    ],
    [
        LangErrorCode.AccountNotSystemOwned,
        "The given account is not owned by the system program"
    ],
    [
        LangErrorCode.AccountNotInitialized,
        "The program expected this account to be already initialized"
    ],
    [
        LangErrorCode.AccountNotProgramData,
        "The given account is not a program data account"
    ],
    [
        LangErrorCode.AccountNotAssociatedTokenAccount,
        "The given account is not the associated token account"
    ],
    [
        LangErrorCode.AccountSysvarMismatch,
        "The given public key does not match the required sysvar"
    ],
    [
        LangErrorCode.AccountReallocExceedsLimit,
        "The account reallocation exceeds the MAX_PERMITTED_DATA_INCREASE limit"
    ],
    [
        LangErrorCode.AccountDuplicateReallocs,
        "The account was duplicated for more than one reallocation"
    ],
    // Miscellaneous
    [
        LangErrorCode.DeclaredProgramIdMismatch,
        "The declared program id does not match the actual program id"
    ],
    [
        LangErrorCode.TryingToInitPayerAsProgramAccount,
        "You cannot/should not initialize the payer account as a program account"
    ],
    [
        LangErrorCode.InvalidNumericConversion,
        "The program could not perform the numeric conversion, out of range integral type conversion attempted"
    ],
    // Deprecated
    [
        LangErrorCode.Deprecated,
        "The API being used is deprecated and should no longer be used"
    ]
]); //# sourceMappingURL=error.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/idl.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IdlCoder",
    ()=>IdlCoder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/borsh/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/idl.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/error.js [app-ssr] (ecmascript)");
;
;
;
class IdlCoder {
    static fieldLayout(field, types = [], genericArgs) {
        const fieldName = field.name;
        switch(field.type){
            case "bool":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bool"](fieldName);
                }
            case "u8":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u8"](fieldName);
                }
            case "i8":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i8"](fieldName);
                }
            case "u16":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u16"](fieldName);
                }
            case "i16":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i16"](fieldName);
                }
            case "u32":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u32"](fieldName);
                }
            case "i32":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i32"](fieldName);
                }
            case "f32":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["f32"](fieldName);
                }
            case "u64":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u64"](fieldName);
                }
            case "i64":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i64"](fieldName);
                }
            case "f64":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["f64"](fieldName);
                }
            case "u128":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u128"](fieldName);
                }
            case "i128":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i128"](fieldName);
                }
            case "u256":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u256"](fieldName);
                }
            case "i256":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i256"](fieldName);
                }
            case "bytes":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["vecU8"](fieldName);
                }
            case "string":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["str"](fieldName);
                }
            case "pubkey":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["publicKey"](fieldName);
                }
            default:
                {
                    if ("option" in field.type) {
                        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["option"](IdlCoder.fieldLayout({
                            type: field.type.option
                        }, types, genericArgs), fieldName);
                    }
                    if ("vec" in field.type) {
                        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["vec"](IdlCoder.fieldLayout({
                            type: field.type.vec
                        }, types, genericArgs), fieldName);
                    }
                    if ("array" in field.type) {
                        let [type, len] = field.type.array;
                        len = IdlCoder.resolveArrayLen(len, genericArgs);
                        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["array"](IdlCoder.fieldLayout({
                            type
                        }, types, genericArgs), len, fieldName);
                    }
                    if ("defined" in field.type) {
                        if (!types) {
                            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IdlError"]("User defined types not provided");
                        }
                        const definedName = field.type.defined.name;
                        const typeDef = types.find((t)=>t.name === definedName);
                        if (!typeDef) {
                            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IdlError"](`Type not found: ${field.name}`);
                        }
                        return IdlCoder.typeDefLayout({
                            typeDef,
                            types,
                            genericArgs: genericArgs !== null && genericArgs !== void 0 ? genericArgs : field.type.defined.generics,
                            name: fieldName
                        });
                    }
                    if ("generic" in field.type) {
                        const genericArg = genericArgs === null || genericArgs === void 0 ? void 0 : genericArgs.at(0);
                        if ((genericArg === null || genericArg === void 0 ? void 0 : genericArg.kind) !== "type") {
                            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IdlError"](`Invalid generic field: ${field.name}`);
                        }
                        return IdlCoder.fieldLayout({
                            ...field,
                            type: genericArg.type
                        }, types);
                    }
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IdlError"](`Not yet implemented: ${JSON.stringify(field.type)}`);
                }
        }
    }
    /**
     * Get the type layout of the given defined type(struct or enum).
     */ static typeDefLayout({ typeDef, types, name, genericArgs }) {
        switch(typeDef.type.kind){
            case "struct":
                {
                    const fieldLayouts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleDefinedFields"])(typeDef.type.fields, ()=>[], (fields)=>fields.map((f)=>{
                            const genArgs = genericArgs ? IdlCoder.resolveGenericArgs({
                                type: f.type,
                                typeDef,
                                genericArgs
                            }) : genericArgs;
                            return IdlCoder.fieldLayout(f, types, genArgs);
                        }), (fields)=>fields.map((f, i)=>{
                            const genArgs = genericArgs ? IdlCoder.resolveGenericArgs({
                                type: f,
                                typeDef,
                                genericArgs
                            }) : genericArgs;
                            return IdlCoder.fieldLayout({
                                name: i.toString(),
                                type: f
                            }, types, genArgs);
                        }));
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"](fieldLayouts, name);
                }
            case "enum":
                {
                    const variants = typeDef.type.variants.map((variant)=>{
                        const fieldLayouts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleDefinedFields"])(variant.fields, ()=>[], (fields)=>fields.map((f)=>{
                                const genArgs = genericArgs ? IdlCoder.resolveGenericArgs({
                                    type: f.type,
                                    typeDef,
                                    genericArgs
                                }) : genericArgs;
                                return IdlCoder.fieldLayout(f, types, genArgs);
                            }), (fields)=>fields.map((f, i)=>{
                                const genArgs = genericArgs ? IdlCoder.resolveGenericArgs({
                                    type: f,
                                    typeDef,
                                    genericArgs
                                }) : genericArgs;
                                return IdlCoder.fieldLayout({
                                    name: i.toString(),
                                    type: f
                                }, types, genArgs);
                            }));
                        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"](fieldLayouts, variant.name);
                    });
                    if (name !== undefined) {
                        // Buffer-layout lib requires the name to be null (on construction)
                        // when used as a field.
                        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rustEnum"](variants).replicate(name);
                    }
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rustEnum"](variants, name);
                }
            case "type":
                {
                    return IdlCoder.fieldLayout({
                        type: typeDef.type.alias,
                        name
                    }, types);
                }
        }
    }
    /**
     * Get the type of the size in bytes. Returns `1` for variable length types.
     */ static typeSize(ty, idl, genericArgs) {
        var _a;
        switch(ty){
            case "bool":
                return 1;
            case "u8":
                return 1;
            case "i8":
                return 1;
            case "i16":
                return 2;
            case "u16":
                return 2;
            case "u32":
                return 4;
            case "i32":
                return 4;
            case "f32":
                return 4;
            case "u64":
                return 8;
            case "i64":
                return 8;
            case "f64":
                return 8;
            case "u128":
                return 16;
            case "i128":
                return 16;
            case "u256":
                return 32;
            case "i256":
                return 32;
            case "bytes":
                return 1;
            case "string":
                return 1;
            case "pubkey":
                return 32;
            default:
                if ("option" in ty) {
                    return 1 + IdlCoder.typeSize(ty.option, idl, genericArgs);
                }
                if ("coption" in ty) {
                    return 4 + IdlCoder.typeSize(ty.coption, idl, genericArgs);
                }
                if ("vec" in ty) {
                    return 1;
                }
                if ("array" in ty) {
                    let [type, len] = ty.array;
                    len = IdlCoder.resolveArrayLen(len, genericArgs);
                    return IdlCoder.typeSize(type, idl, genericArgs) * len;
                }
                if ("defined" in ty) {
                    const typeDef = (_a = idl.types) === null || _a === void 0 ? void 0 : _a.find((t)=>t.name === ty.defined.name);
                    if (!typeDef) {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IdlError"](`Type not found: ${JSON.stringify(ty)}`);
                    }
                    const typeSize = (type)=>{
                        const genArgs = genericArgs !== null && genericArgs !== void 0 ? genericArgs : ty.defined.generics;
                        const args = genArgs ? IdlCoder.resolveGenericArgs({
                            type,
                            typeDef,
                            genericArgs: genArgs
                        }) : genArgs;
                        return IdlCoder.typeSize(type, idl, args);
                    };
                    switch(typeDef.type.kind){
                        case "struct":
                            {
                                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleDefinedFields"])(typeDef.type.fields, ()=>[
                                        0
                                    ], (fields)=>fields.map((f)=>typeSize(f.type)), (fields)=>fields.map((f)=>typeSize(f))).reduce((acc, size)=>acc + size, 0);
                            }
                        case "enum":
                            {
                                const variantSizes = typeDef.type.variants.map((variant)=>{
                                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleDefinedFields"])(variant.fields, ()=>[
                                            0
                                        ], (fields)=>fields.map((f)=>typeSize(f.type)), (fields)=>fields.map((f)=>typeSize(f))).reduce((acc, size)=>acc + size, 0);
                                });
                                return Math.max(...variantSizes) + 1;
                            }
                        case "type":
                            {
                                return IdlCoder.typeSize(typeDef.type.alias, idl, genericArgs);
                            }
                    }
                }
                if ("generic" in ty) {
                    const genericArg = genericArgs === null || genericArgs === void 0 ? void 0 : genericArgs.at(0);
                    if ((genericArg === null || genericArg === void 0 ? void 0 : genericArg.kind) !== "type") {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IdlError"](`Invalid generic: ${ty.generic}`);
                    }
                    return IdlCoder.typeSize(genericArg.type, idl, genericArgs);
                }
                throw new Error(`Invalid type ${JSON.stringify(ty)}`);
        }
    }
    /**
     * Resolve the generic array length or return the constant-sized array length.
     */ static resolveArrayLen(len, genericArgs) {
        if (typeof len === "number") return len;
        if (genericArgs) {
            const genericLen = genericArgs.find((g)=>g.kind === "const");
            if ((genericLen === null || genericLen === void 0 ? void 0 : genericLen.kind) === "const") {
                len = +genericLen.value;
            }
        }
        if (typeof len !== "number") {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IdlError"]("Generic array length did not resolve");
        }
        return len;
    }
    /**
     * Recursively resolve generic arguments i.e. replace all generics with the
     * actual type that they hold based on the initial `genericArgs` given.
     */ static resolveGenericArgs({ type, typeDef, genericArgs, isDefined }) {
        if (typeof type !== "object") return null;
        for(const index in typeDef.generics){
            const defGeneric = typeDef.generics[index];
            if ("generic" in type && defGeneric.name === type.generic) {
                return [
                    genericArgs[index]
                ];
            }
            if ("option" in type) {
                const args = IdlCoder.resolveGenericArgs({
                    type: type.option,
                    typeDef,
                    genericArgs,
                    isDefined
                });
                if (!args || !isDefined) return args;
                if (args[0].kind === "type") {
                    return [
                        {
                            kind: "type",
                            type: {
                                option: args[0].type
                            }
                        }
                    ];
                }
            }
            if ("vec" in type) {
                const args = IdlCoder.resolveGenericArgs({
                    type: type.vec,
                    typeDef,
                    genericArgs,
                    isDefined
                });
                if (!args || !isDefined) return args;
                if (args[0].kind === "type") {
                    return [
                        {
                            kind: "type",
                            type: {
                                vec: args[0].type
                            }
                        }
                    ];
                }
            }
            if ("array" in type) {
                const [elTy, len] = type.array;
                const isGenericLen = typeof len === "object";
                const args = IdlCoder.resolveGenericArgs({
                    type: elTy,
                    typeDef,
                    genericArgs,
                    isDefined
                }) || [];
                // Check all generics for matching const generic length
                if (isGenericLen) {
                    const matchingGeneric = typeDef.generics.findIndex((g)=>g.name === len.generic);
                    if (matchingGeneric !== -1) {
                        args.push(genericArgs[matchingGeneric]);
                    }
                }
                if (args.length > 0) {
                    if (!isDefined) return args;
                    if (args[0].kind === "type" && args[1].kind === "const") {
                        return [
                            {
                                kind: "type",
                                type: {
                                    array: [
                                        args[0].type,
                                        +args[1].value
                                    ]
                                }
                            }
                        ];
                    }
                }
                // Only generic len
                if (isGenericLen && defGeneric.name === len.generic) {
                    const arg = genericArgs[index];
                    if (!isDefined) return [
                        arg
                    ];
                    return [
                        {
                            kind: "type",
                            type: {
                                array: [
                                    elTy,
                                    +arg.value
                                ]
                            }
                        }
                    ];
                }
                // Non-generic
                return null;
            }
            if ("defined" in type) {
                if (!type.defined.generics) return null;
                return type.defined.generics.flatMap((g)=>{
                    switch(g.kind){
                        case "type":
                            return IdlCoder.resolveGenericArgs({
                                type: g.type,
                                typeDef,
                                genericArgs,
                                isDefined: true
                            });
                        case "const":
                            return [
                                g
                            ];
                    }
                }).filter((g)=>g !== null);
            }
        }
        return null;
    }
} //# sourceMappingURL=idl.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/instruction.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BorshInstructionCoder",
    ()=>BorshInstructionCoder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bs58$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/bs58/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/buffer [external] (buffer, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/borsh/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/idl.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/idl.js [app-ssr] (ecmascript)");
;
;
;
;
;
class BorshInstructionCoder {
    constructor(idl){
        this.idl = idl;
        const ixLayouts = idl.instructions.map((ix)=>{
            const name = ix.name;
            const fieldLayouts = ix.args.map((arg)=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IdlCoder"].fieldLayout(arg, idl.types));
            const layout = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"](fieldLayouts, name);
            return [
                name,
                {
                    discriminator: ix.discriminator,
                    layout
                }
            ];
        });
        this.ixLayouts = new Map(ixLayouts);
    }
    /**
     * Encodes a program instruction.
     */ encode(ixName, ix) {
        const buffer = __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].alloc(1000); // TODO: use a tighter buffer.
        const encoder = this.ixLayouts.get(ixName);
        if (!encoder) {
            throw new Error(`Unknown method: ${ixName}`);
        }
        const len = encoder.layout.encode(ix, buffer);
        const data = buffer.slice(0, len);
        return __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].concat([
            __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].from(encoder.discriminator),
            data
        ]);
    }
    /**
     * Decodes a program instruction.
     */ decode(ix, encoding = "hex") {
        if (typeof ix === "string") {
            ix = encoding === "hex" ? __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].from(ix, "hex") : __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bs58$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].decode(ix);
        }
        for (const [name, layout] of this.ixLayouts){
            const givenDisc = ix.subarray(0, layout.discriminator.length);
            const matches = givenDisc.equals(__TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].from(layout.discriminator));
            if (matches) {
                return {
                    name,
                    data: layout.layout.decode(ix.subarray(givenDisc.length))
                };
            }
        }
        return null;
    }
    /**
     * Returns a formatted table of all the fields in the given instruction data.
     */ format(ix, accountMetas) {
        return InstructionFormatter.format(ix, accountMetas, this.idl);
    }
}
class InstructionFormatter {
    static format(ix, accountMetas, idl) {
        const idlIx = idl.instructions.find((i)=>ix.name === i.name);
        if (!idlIx) {
            console.error("Invalid instruction given");
            return null;
        }
        const args = idlIx.args.map((idlField)=>{
            return {
                name: idlField.name,
                type: InstructionFormatter.formatIdlType(idlField.type),
                data: InstructionFormatter.formatIdlData(idlField, ix.data[idlField.name], idl.types)
            };
        });
        const flatIdlAccounts = InstructionFormatter.flattenIdlAccounts(idlIx.accounts);
        const accounts = accountMetas.map((meta, idx)=>{
            if (idx < flatIdlAccounts.length) {
                return {
                    name: flatIdlAccounts[idx].name,
                    ...meta
                };
            } else {
                return {
                    name: undefined,
                    ...meta
                };
            }
        });
        return {
            args,
            accounts
        };
    }
    static formatIdlType(idlType) {
        if (typeof idlType === "string") {
            return idlType;
        }
        if ("option" in idlType) {
            return `Option<${this.formatIdlType(idlType.option)}>`;
        }
        if ("coption" in idlType) {
            return `COption<${this.formatIdlType(idlType.coption)}>`;
        }
        if ("vec" in idlType) {
            return `Vec<${this.formatIdlType(idlType.vec)}>`;
        }
        if ("array" in idlType) {
            return `Array<${idlType.array[0]}; ${idlType.array[1]}>`;
        }
        if ("defined" in idlType) {
            const name = idlType.defined.name;
            if (idlType.defined.generics) {
                const generics = idlType.defined.generics.map((g)=>{
                    switch(g.kind){
                        case "type":
                            return InstructionFormatter.formatIdlType(g.type);
                        case "const":
                            return g.value;
                    }
                }).join(", ");
                return `${name}<${generics}>`;
            }
            return name;
        }
        throw new Error(`Unknown IDL type: ${idlType}`);
    }
    static formatIdlData(idlField, data, types) {
        if (typeof idlField.type === "string") {
            return data.toString();
        }
        if ("vec" in idlField.type) {
            return "[" + data.map((d)=>this.formatIdlData({
                    name: "",
                    type: idlField.type.vec
                }, d, types)).join(", ") + "]";
        }
        if ("option" in idlField.type) {
            return data === null ? "null" : this.formatIdlData({
                name: "",
                type: idlField.type.option
            }, data, types);
        }
        if ("defined" in idlField.type) {
            if (!types) {
                throw new Error("User defined types not provided");
            }
            const definedName = idlField.type.defined.name;
            const typeDef = types.find((t)=>t.name === definedName);
            if (!typeDef) {
                throw new Error(`Type not found: ${definedName}`);
            }
            return InstructionFormatter.formatIdlDataDefined(typeDef, data, types);
        }
        return "unknown";
    }
    static formatIdlDataDefined(typeDef, data, types) {
        switch(typeDef.type.kind){
            case "struct":
                {
                    return "{ " + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleDefinedFields"])(typeDef.type.fields, ()=>"", (fields)=>{
                        return Object.entries(data).map(([key, val])=>{
                            const field = fields.find((f)=>f.name === key);
                            if (!field) {
                                throw new Error(`Field not found: ${key}`);
                            }
                            return key + ": " + InstructionFormatter.formatIdlData(field, val, types);
                        }).join(", ");
                    }, (fields)=>{
                        return Object.entries(data).map(([key, val])=>{
                            return key + ": " + InstructionFormatter.formatIdlData({
                                name: "",
                                type: fields[key]
                            }, val, types);
                        }).join(", ");
                    }) + " }";
                }
            case "enum":
                {
                    const variantName = Object.keys(data)[0];
                    const variant = typeDef.type.variants.find((v)=>v.name === variantName);
                    if (!variant) {
                        throw new Error(`Unable to find variant: ${variantName}`);
                    }
                    const enumValue = data[variantName];
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleDefinedFields"])(variant.fields, ()=>variantName, (fields)=>{
                        const namedFields = Object.keys(enumValue).map((f)=>{
                            const fieldData = enumValue[f];
                            const idlField = fields.find((v)=>v.name === f);
                            if (!idlField) {
                                throw new Error(`Field not found: ${f}`);
                            }
                            return f + ": " + InstructionFormatter.formatIdlData(idlField, fieldData, types);
                        }).join(", ");
                        return `${variantName} { ${namedFields} }`;
                    }, (fields)=>{
                        const tupleFields = Object.entries(enumValue).map(([key, val])=>{
                            return key + ": " + InstructionFormatter.formatIdlData({
                                name: "",
                                type: fields[key]
                            }, val, types);
                        }).join(", ");
                        return `${variantName} { ${tupleFields} }`;
                    });
                }
            case "type":
                {
                    return InstructionFormatter.formatIdlType(typeDef.type.alias);
                }
        }
    }
    static flattenIdlAccounts(accounts, prefix) {
        return accounts.map((account)=>{
            const accName = sentenceCase(account.name);
            if (account.hasOwnProperty("accounts")) {
                const newPrefix = prefix ? `${prefix} > ${accName}` : accName;
                return InstructionFormatter.flattenIdlAccounts(account.accounts, newPrefix);
            } else {
                return {
                    ...account,
                    name: prefix ? `${prefix} > ${accName}` : accName
                };
            }
        }).flat();
    }
}
function sentenceCase(field) {
    const result = field.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
} //# sourceMappingURL=instruction.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/accounts.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BorshAccountsCoder",
    ()=>BorshAccountsCoder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bs58$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/bs58/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/buffer [external] (buffer, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/idl.js [app-ssr] (ecmascript)");
;
;
;
class BorshAccountsCoder {
    constructor(idl){
        this.idl = idl;
        if (!idl.accounts) {
            this.accountLayouts = new Map();
            return;
        }
        const types = idl.types;
        if (!types) {
            throw new Error("Accounts require `idl.types`");
        }
        const layouts = idl.accounts.map((acc)=>{
            const typeDef = types.find((ty)=>ty.name === acc.name);
            if (!typeDef) {
                throw new Error(`Account not found: ${acc.name}`);
            }
            return [
                acc.name,
                {
                    discriminator: acc.discriminator,
                    layout: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IdlCoder"].typeDefLayout({
                        typeDef,
                        types
                    })
                }
            ];
        });
        this.accountLayouts = new Map(layouts);
    }
    async encode(accountName, account) {
        const buffer = __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].alloc(1000); // TODO: use a tighter buffer.
        const layout = this.accountLayouts.get(accountName);
        if (!layout) {
            throw new Error(`Unknown account: ${accountName}`);
        }
        const len = layout.layout.encode(account, buffer);
        const accountData = buffer.slice(0, len);
        const discriminator = this.accountDiscriminator(accountName);
        return __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].concat([
            discriminator,
            accountData
        ]);
    }
    decode(accountName, data) {
        // Assert the account discriminator is correct.
        const discriminator = this.accountDiscriminator(accountName);
        if (discriminator.compare(data.slice(0, discriminator.length))) {
            throw new Error("Invalid account discriminator");
        }
        return this.decodeUnchecked(accountName, data);
    }
    decodeAny(data) {
        for (const [name, layout] of this.accountLayouts){
            const givenDisc = data.subarray(0, layout.discriminator.length);
            const matches = givenDisc.equals(__TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].from(layout.discriminator));
            if (matches) return this.decodeUnchecked(name, data);
        }
        throw new Error("Account not found");
    }
    decodeUnchecked(accountName, acc) {
        // Chop off the discriminator before decoding.
        const discriminator = this.accountDiscriminator(accountName);
        const data = acc.subarray(discriminator.length);
        const layout = this.accountLayouts.get(accountName);
        if (!layout) {
            throw new Error(`Unknown account: ${accountName}`);
        }
        return layout.layout.decode(data);
    }
    memcmp(accountName, appendData) {
        const discriminator = this.accountDiscriminator(accountName);
        return {
            offset: 0,
            bytes: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bs58$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].encode(appendData ? __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].concat([
                discriminator,
                appendData
            ]) : discriminator)
        };
    }
    size(accountName) {
        return this.accountDiscriminator(accountName).length + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IdlCoder"].typeSize({
            defined: {
                name: accountName
            }
        }, this.idl);
    }
    /**
     * Get the unique discriminator prepended to all anchor accounts.
     *
     * @param name The name of the account to get the discriminator of.
     */ accountDiscriminator(name) {
        var _a;
        const account = (_a = this.idl.accounts) === null || _a === void 0 ? void 0 : _a.find((acc)=>acc.name === name);
        if (!account) {
            throw new Error(`Account not found: ${name}`);
        }
        return __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].from(account.discriminator);
    }
} //# sourceMappingURL=accounts.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/event.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BorshEventCoder",
    ()=>BorshEventCoder
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/buffer [external] (buffer, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$bytes$2f$base64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/bytes/base64.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/idl.js [app-ssr] (ecmascript)");
;
;
;
class BorshEventCoder {
    constructor(idl){
        if (!idl.events) {
            this.layouts = new Map();
            return;
        }
        const types = idl.types;
        if (!types) {
            throw new Error("Events require `idl.types`");
        }
        const layouts = idl.events.map((ev)=>{
            const typeDef = types.find((ty)=>ty.name === ev.name);
            if (!typeDef) {
                throw new Error(`Event not found: ${ev.name}`);
            }
            return [
                ev.name,
                {
                    discriminator: ev.discriminator,
                    layout: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IdlCoder"].typeDefLayout({
                        typeDef,
                        types
                    })
                }
            ];
        });
        this.layouts = new Map(layouts);
    }
    decode(log) {
        let logArr;
        // This will throw if log length is not a multiple of 4.
        try {
            logArr = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$bytes$2f$base64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decode"](log);
        } catch (e) {
            return null;
        }
        for (const [name, layout] of this.layouts){
            const givenDisc = logArr.subarray(0, layout.discriminator.length);
            const matches = givenDisc.equals(__TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].from(layout.discriminator));
            if (matches) {
                return {
                    name,
                    data: layout.layout.decode(logArr.subarray(givenDisc.length))
                };
            }
        }
        return null;
    }
} //# sourceMappingURL=event.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/types.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BorshTypesCoder",
    ()=>BorshTypesCoder
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/buffer [external] (buffer, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/idl.js [app-ssr] (ecmascript)");
;
;
class BorshTypesCoder {
    constructor(idl){
        const types = idl.types;
        if (!types) {
            this.typeLayouts = new Map();
            return;
        }
        const layouts = types.filter((ty)=>!ty.generics).map((ty)=>[
                ty.name,
                __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IdlCoder"].typeDefLayout({
                    typeDef: ty,
                    types
                })
            ]);
        this.typeLayouts = new Map(layouts);
    }
    encode(name, type) {
        const buffer = __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].alloc(1000); // TODO: use a tighter buffer.
        const layout = this.typeLayouts.get(name);
        if (!layout) {
            throw new Error(`Unknown type: ${name}`);
        }
        const len = layout.encode(type, buffer);
        return buffer.slice(0, len);
    }
    decode(name, data) {
        const layout = this.typeLayouts.get(name);
        if (!layout) {
            throw new Error(`Unknown type: ${name}`);
        }
        return layout.decode(data);
    }
} //# sourceMappingURL=types.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BorshCoder",
    ()=>BorshCoder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$instruction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/instruction.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$accounts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/accounts.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/event.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/types.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
class BorshCoder {
    constructor(idl){
        this.instruction = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$instruction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BorshInstructionCoder"](idl);
        this.accounts = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$accounts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BorshAccountsCoder"](idl);
        this.events = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BorshEventCoder"](idl);
        this.types = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BorshTypesCoder"](idl);
    }
} //# sourceMappingURL=index.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/system/instruction.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SystemInstructionCoder",
    ()=>SystemInstructionCoder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/bn.js/lib/bn.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/buffer-layout/lib/Layout.js [app-ssr] (ecmascript)");
;
;
class SystemInstructionCoder {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor(_){}
    encode(ixName, ix) {
        switch(ixName){
            case "createAccount":
                {
                    return encodeCreateAccount(ix);
                }
            case "assign":
                {
                    return encodeAssign(ix);
                }
            case "transfer":
                {
                    return encodeTransfer(ix);
                }
            case "createAccountWithSeed":
                {
                    return encodeCreateAccountWithSeed(ix);
                }
            case "advanceNonceAccount":
                {
                    return encodeAdvanceNonceAccount(ix);
                }
            case "withdrawNonceAccount":
                {
                    return encodeWithdrawNonceAccount(ix);
                }
            case "initializeNonceAccount":
                {
                    return encodeInitializeNonceAccount(ix);
                }
            case "authorizeNonceAccount":
                {
                    return encodeAuthorizeNonceAccount(ix);
                }
            case "allocate":
                {
                    return encodeAllocate(ix);
                }
            case "allocateWithSeed":
                {
                    return encodeAllocateWithSeed(ix);
                }
            case "assignWithSeed":
                {
                    return encodeAssignWithSeed(ix);
                }
            case "transferWithSeed":
                {
                    return encodeTransferWithSeed(ix);
                }
            default:
                {
                    throw new Error(`Invalid instruction: ${ixName}`);
                }
        }
    }
    encodeState(_ixName, _ix) {
        throw new Error("System does not have state");
    }
}
class RustStringLayout extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Layout"] {
    constructor(property){
        super(-1, property);
        this.property = property;
        this.layout = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u32"]("length"),
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u32"]("lengthPadding"),
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["blob"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["offset"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u32"](), -8), "chars")
        ], this.property);
    }
    encode(src, b, offset = 0) {
        if (src === null || src === undefined) {
            return this.layout.span;
        }
        const data = {
            chars: Buffer.from(src, "utf8")
        };
        return this.layout.encode(data, b, offset);
    }
    decode(b, offset = 0) {
        const data = this.layout.decode(b, offset);
        return data["chars"].toString();
    }
    getSpan(b, offset = 0) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u32"]().span + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u32"]().span + new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](new Uint8Array(b).slice(offset, offset + 4), 10, "le").toNumber();
    }
}
function rustStringLayout(property) {
    return new RustStringLayout(property);
}
function publicKey(property) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["blob"](32, property);
}
function encodeCreateAccount({ lamports, space, owner }) {
    return encodeData({
        createAccount: {
            lamports,
            space,
            owner: owner.toBuffer()
        }
    });
}
function encodeAssign({ owner }) {
    return encodeData({
        assign: {
            owner: owner.toBuffer()
        }
    });
}
function encodeTransfer({ lamports }) {
    return encodeData({
        transfer: {
            lamports
        }
    });
}
function encodeCreateAccountWithSeed({ base, seed, lamports, space, owner }) {
    return encodeData({
        createAccountWithSeed: {
            base: base.toBuffer(),
            seed,
            lamports,
            space,
            owner: owner.toBuffer()
        }
    }, LAYOUT.getVariant(3).span + seed.length);
}
function encodeInitializeNonceAccount({ authorized }) {
    return encodeData({
        initializeNonceAccount: {
            authorized: authorized.toBuffer()
        }
    });
}
function encodeAdvanceNonceAccount({ authorized }) {
    return encodeData({
        advanceNonceAccount: {
            authorized: authorized.toBuffer()
        }
    });
}
function encodeWithdrawNonceAccount({ lamports }) {
    return encodeData({
        withdrawNonceAccount: {
            lamports
        }
    });
}
function encodeAuthorizeNonceAccount({ authorized }) {
    return encodeData({
        authorizeNonceAccount: {
            authorized: authorized.toBuffer()
        }
    });
}
function encodeAllocate({ space }) {
    return encodeData({
        allocate: {
            space
        }
    });
}
function encodeAllocateWithSeed({ base, seed, space, owner }) {
    return encodeData({
        allocateWithSeed: {
            base: base.toBuffer(),
            seed,
            space,
            owner: owner.toBuffer()
        }
    }, LAYOUT.getVariant(9).span + seed.length);
}
function encodeAssignWithSeed({ base, seed, owner }) {
    return encodeData({
        assignWithSeed: {
            base: base.toBuffer(),
            seed,
            owner: owner.toBuffer()
        }
    }, LAYOUT.getVariant(10).span + seed.length);
}
function encodeTransferWithSeed({ lamports, seed, owner }) {
    return encodeData({
        transferWithSeed: {
            lamports,
            seed,
            owner: owner.toBuffer()
        }
    }, LAYOUT.getVariant(11).span + seed.length);
}
const LAYOUT = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["union"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u32"]("instruction"));
LAYOUT.addVariant(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ns64"]("lamports"),
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ns64"]("space"),
    publicKey("owner")
]), "createAccount");
LAYOUT.addVariant(1, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([
    publicKey("owner")
]), "assign");
LAYOUT.addVariant(2, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ns64"]("lamports")
]), "transfer");
LAYOUT.addVariant(3, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([
    publicKey("base"),
    rustStringLayout("seed"),
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ns64"]("lamports"),
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ns64"]("space"),
    publicKey("owner")
]), "createAccountWithSeed");
LAYOUT.addVariant(4, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([
    publicKey("authorized")
]), "advanceNonceAccount");
LAYOUT.addVariant(5, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ns64"]("lamports")
]), "withdrawNonceAccount");
LAYOUT.addVariant(6, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([
    publicKey("authorized")
]), "initializeNonceAccount");
LAYOUT.addVariant(7, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([
    publicKey("authorized")
]), "authorizeNonceAccount");
LAYOUT.addVariant(8, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ns64"]("space")
]), "allocate");
LAYOUT.addVariant(9, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([
    publicKey("base"),
    rustStringLayout("seed"),
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ns64"]("space"),
    publicKey("owner")
]), "allocateWithSeed");
LAYOUT.addVariant(10, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([
    publicKey("base"),
    rustStringLayout("seed"),
    publicKey("owner")
]), "assignWithSeed");
LAYOUT.addVariant(11, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ns64"]("lamports"),
    rustStringLayout("seed"),
    publicKey("owner")
]), "transferWithSeed");
function encodeData(instruction, maxSpan) {
    const b = Buffer.alloc(maxSpan !== null && maxSpan !== void 0 ? maxSpan : instructionMaxSpan);
    const span = LAYOUT.encode(instruction, b);
    if (maxSpan === undefined) {
        return b.slice(0, span);
    }
    return b;
}
const instructionMaxSpan = Math.max(...Object.values(LAYOUT.registry).map((r)=>r.span)); //# sourceMappingURL=instruction.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/system/accounts.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SystemAccountsCoder",
    ()=>SystemAccountsCoder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/buffer-layout/lib/Layout.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/web3.js/lib/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/idl.js [app-ssr] (ecmascript)");
;
;
;
class SystemAccountsCoder {
    constructor(idl){
        this.idl = idl;
    }
    async encode(accountName, account) {
        switch(accountName){
            case "nonce":
                {
                    const buffer = Buffer.alloc(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NONCE_ACCOUNT_LENGTH"]);
                    const len = NONCE_ACCOUNT_LAYOUT.encode(account, buffer);
                    return buffer.slice(0, len);
                }
            default:
                {
                    throw new Error(`Invalid account name: ${accountName}`);
                }
        }
    }
    decode(accountName, ix) {
        return this.decodeUnchecked(accountName, ix);
    }
    decodeUnchecked(accountName, ix) {
        switch(accountName){
            case "nonce":
                {
                    return decodeNonceAccount(ix);
                }
            default:
                {
                    throw new Error(`Invalid account name: ${accountName}`);
                }
        }
    }
    // TODO: this won't use the appendData.
    memcmp(accountName, _appendData) {
        switch(accountName){
            case "nonce":
                {
                    return {
                        dataSize: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NONCE_ACCOUNT_LENGTH"]
                    };
                }
            default:
                {
                    throw new Error(`Invalid account name: ${accountName}`);
                }
        }
    }
    size(accountName) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IdlCoder"].typeSize({
            defined: {
                name: accountName
            }
        }, this.idl);
    }
}
function decodeNonceAccount(ix) {
    return NONCE_ACCOUNT_LAYOUT.decode(ix);
}
class WrappedLayout extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Layout"] {
    constructor(layout, decoder, encoder, property){
        super(layout.span, property);
        this.layout = layout;
        this.decoder = decoder;
        this.encoder = encoder;
    }
    decode(b, offset) {
        return this.decoder(this.layout.decode(b, offset));
    }
    encode(src, b, offset) {
        return this.layout.encode(this.encoder(src), b, offset);
    }
    getSpan(b, offset) {
        return this.layout.getSpan(b, offset);
    }
}
function publicKey(property) {
    return new WrappedLayout(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["blob"](32), (b)=>new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"](b), (key)=>key.toBuffer(), property);
}
const NONCE_ACCOUNT_LAYOUT = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u32"]("version"),
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u32"]("state"),
    publicKey("authorizedPubkey"),
    publicKey("nonce"),
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nu64"]("lamportsPerSignature")
    ], "feeCalculator")
]); //# sourceMappingURL=accounts.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/system/events.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SystemEventsCoder",
    ()=>SystemEventsCoder
]);
class SystemEventsCoder {
    constructor(_idl){}
    decode(_log) {
        throw new Error("System program does not have events");
    }
} //# sourceMappingURL=events.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/system/types.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SystemTypesCoder",
    ()=>SystemTypesCoder
]);
class SystemTypesCoder {
    constructor(_idl){}
    encode(_name, _type) {
        throw new Error("System does not have user-defined types");
    }
    decode(_name, _typeData) {
        throw new Error("System does not have user-defined types");
    }
} //# sourceMappingURL=types.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/system/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SystemCoder",
    ()=>SystemCoder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$system$2f$instruction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/system/instruction.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$system$2f$accounts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/system/accounts.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$system$2f$events$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/system/events.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$system$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/system/types.js [app-ssr] (ecmascript)");
;
;
;
;
class SystemCoder {
    constructor(idl){
        this.instruction = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$system$2f$instruction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SystemInstructionCoder"](idl);
        this.accounts = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$system$2f$accounts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SystemAccountsCoder"](idl);
        this.events = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$system$2f$events$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SystemEventsCoder"](idl);
        this.types = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$system$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SystemTypesCoder"](idl);
    }
} //# sourceMappingURL=index.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$system$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/system/index.js [app-ssr] (ecmascript)"); //# sourceMappingURL=index.js.map
;
;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/sha256.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hash",
    ()=>hash
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha256$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@noble/hashes/esm/sha256.js [app-ssr] (ecmascript)");
;
function hash(data) {
    return new TextDecoder().decode((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha256$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sha256"])(data));
} //# sourceMappingURL=sha256.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/pubkey.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createWithSeedSync",
    ()=>createWithSeedSync
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/buffer [external] (buffer, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/web3.js/lib/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha256$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@noble/hashes/esm/sha256.js [app-ssr] (ecmascript)");
;
;
;
function createWithSeedSync(fromPublicKey, seed, programId) {
    const buffer = __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].concat([
        fromPublicKey.toBuffer(),
        __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].from(seed),
        programId.toBuffer()
    ]);
    return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"]((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha256$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sha256"])(buffer));
} //# sourceMappingURL=pubkey.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/token.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ASSOCIATED_PROGRAM_ID",
    ()=>ASSOCIATED_PROGRAM_ID,
    "TOKEN_PROGRAM_ID",
    ()=>TOKEN_PROGRAM_ID,
    "associatedAddress",
    ()=>associatedAddress
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/web3.js/lib/index.esm.js [app-ssr] (ecmascript)");
;
const TOKEN_PROGRAM_ID = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"]("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const ASSOCIATED_PROGRAM_ID = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"]("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
function associatedAddress({ mint, owner }) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"].findProgramAddressSync([
        owner.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mint.toBuffer()
    ], ASSOCIATED_PROGRAM_ID)[0];
} //# sourceMappingURL=token.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/registry.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decodeUpgradeableLoaderState",
    ()=>decodeUpgradeableLoaderState,
    "fetchData",
    ()=>fetchData,
    "verifiedBuild",
    ()=>verifiedBuild
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$cross$2d$fetch$2f$dist$2f$node$2d$ponyfill$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/cross-fetch/dist/node-ponyfill.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/borsh/dist/index.js [app-ssr] (ecmascript)");
;
;
async function verifiedBuild(connection, programId, limit = 5) {
    const url = `https://api.apr.dev/api/v0/program/${programId.toString()}/latest?limit=${limit}`;
    const [programData, latestBuildsResp] = await Promise.all([
        fetchData(connection, programId),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$cross$2d$fetch$2f$dist$2f$node$2d$ponyfill$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(url)
    ]);
    // Filter out all non successful builds.
    const latestBuilds = (await latestBuildsResp.json()).filter((b)=>!b.aborted && b.state === "Built" && b.verified === "Verified");
    if (latestBuilds.length === 0) {
        return null;
    }
    // Get the latest build.
    const build = latestBuilds[0];
    // Has the program been upgraded since the last build?
    if (programData.slot.toNumber() !== build.verified_slot) {
        return null;
    }
    // Success.
    return build;
}
async function fetchData(connection, programId) {
    const accountInfo = await connection.getAccountInfo(programId);
    if (accountInfo === null) {
        throw new Error("program account not found");
    }
    const { program } = decodeUpgradeableLoaderState(accountInfo.data);
    const programdataAccountInfo = await connection.getAccountInfo(program.programdataAddress);
    if (programdataAccountInfo === null) {
        throw new Error("program data account not found");
    }
    const { programData } = decodeUpgradeableLoaderState(programdataAccountInfo.data);
    return programData;
}
const UPGRADEABLE_LOADER_STATE_LAYOUT = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rustEnum"]([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([], "uninitialized"),
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["option"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["publicKey"](), "authorityAddress")
    ], "buffer"),
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["publicKey"]("programdataAddress")
    ], "program"),
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u64"]("slot"),
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["option"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["publicKey"](), "upgradeAuthorityAddress")
    ], "programData")
], undefined, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u32"]());
function decodeUpgradeableLoaderState(data) {
    return UPGRADEABLE_LOADER_STATE_LAYOUT.decode(data);
} //# sourceMappingURL=registry.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$sha256$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/sha256.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$rpc$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/rpc.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$pubkey$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/pubkey.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$bytes$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/bytes/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$token$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/token.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$features$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/features.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$registry$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/registry.js [app-ssr] (ecmascript)"); //# sourceMappingURL=index.js.map
;
;
;
;
;
;
;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BorshAccountsCoder",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$accounts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BorshAccountsCoder"],
    "BorshCoder",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BorshCoder"],
    "BorshEventCoder",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BorshEventCoder"],
    "BorshInstructionCoder",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$instruction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BorshInstructionCoder"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$instruction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/instruction.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$accounts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/accounts.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/event.js [app-ssr] (ecmascript)");
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/bytes/utf8.js [app-ssr] (ecmascript) <export * as utf8>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "utf8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$bytes$2f$utf8$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$bytes$2f$utf8$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/bytes/utf8.js [app-ssr] (ecmascript)");
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/event.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EventManager",
    ()=>EventManager,
    "EventParser",
    ()=>EventParser
]);
const PROGRAM_LOG = "Program log: ";
const PROGRAM_DATA = "Program data: ";
const PROGRAM_LOG_START_INDEX = PROGRAM_LOG.length;
const PROGRAM_DATA_START_INDEX = PROGRAM_DATA.length;
class EventManager {
    constructor(programId, provider, coder){
        this._programId = programId;
        this._provider = provider;
        this._eventParser = new EventParser(programId, coder);
        this._eventCallbacks = new Map();
        this._eventListeners = new Map();
        this._listenerIdCount = 0;
    }
    addEventListener(eventName, callback, commitment) {
        var _a;
        let listener = this._listenerIdCount;
        this._listenerIdCount += 1;
        // Store the listener into the event map.
        if (!this._eventListeners.has(eventName)) {
            this._eventListeners.set(eventName, []);
        }
        this._eventListeners.set(eventName, ((_a = this._eventListeners.get(eventName)) !== null && _a !== void 0 ? _a : []).concat(listener));
        // Store the callback into the listener map.
        this._eventCallbacks.set(listener, [
            eventName,
            callback
        ]);
        // Create the subscription singleton, if needed.
        if (this._onLogsSubscriptionId !== undefined) {
            return listener;
        }
        this._onLogsSubscriptionId = this._provider.connection.onLogs(this._programId, (logs, ctx)=>{
            if (logs.err) {
                return;
            }
            for (const event of this._eventParser.parseLogs(logs.logs)){
                const allListeners = this._eventListeners.get(event.name);
                if (allListeners) {
                    allListeners.forEach((listener)=>{
                        const listenerCb = this._eventCallbacks.get(listener);
                        if (listenerCb) {
                            const [, callback] = listenerCb;
                            callback(event.data, ctx.slot, logs.signature);
                        }
                    });
                }
            }
        }, commitment);
        return listener;
    }
    async removeEventListener(listener) {
        // Get the callback.
        const callback = this._eventCallbacks.get(listener);
        if (!callback) {
            throw new Error(`Event listener ${listener} doesn't exist!`);
        }
        const [eventName] = callback;
        // Get the listeners.
        let listeners = this._eventListeners.get(eventName);
        if (!listeners) {
            throw new Error(`Event listeners don't exist for ${eventName}!`);
        }
        // Update both maps.
        this._eventCallbacks.delete(listener);
        listeners = listeners.filter((l)=>l !== listener);
        this._eventListeners.set(eventName, listeners);
        if (listeners.length === 0) {
            this._eventListeners.delete(eventName);
        }
        // Kill the websocket connection if all listeners have been removed.
        if (this._eventCallbacks.size === 0) {
            if (this._eventListeners.size !== 0) {
                throw new Error(`Expected event listeners size to be 0 but got ${this._eventListeners.size}`);
            }
            if (this._onLogsSubscriptionId !== undefined) {
                await this._provider.connection.removeOnLogsListener(this._onLogsSubscriptionId);
                this._onLogsSubscriptionId = undefined;
            }
        }
    }
}
class EventParser {
    constructor(programId, coder){
        this.coder = coder;
        this.programId = programId;
    }
    // Each log given, represents an array of messages emitted by
    // a single transaction, which can execute many different programs across
    // CPI boundaries. However, the subscription is only interested in the
    // events emitted by *this* program. In achieving this, we keep track of the
    // program execution context by parsing each log and looking for a CPI
    // `invoke` call. If one exists, we know a new program is executing. So we
    // push the programId onto a stack and switch the program context. This
    // allows us to track, for a given log, which program was executing during
    // its emission, thereby allowing us to know if a given log event was
    // emitted by *this* program. If it was, then we parse the raw string and
    // emit the event if the string matches the event being subscribed to.
    *parseLogs(logs, errorOnDecodeFailure = false) {
        const logScanner = new LogScanner(logs);
        const execution = new ExecutionContext();
        let log = logScanner.next();
        while(log !== null){
            let [event, newProgram, didPop] = this.handleLog(execution, log, errorOnDecodeFailure);
            if (event) {
                yield event;
            }
            if (newProgram) {
                execution.push(newProgram);
            }
            if (didPop) {
                execution.pop();
            }
            log = logScanner.next();
        }
    }
    // Main log handler. Returns a three element array of the event, the
    // next program that was invoked for CPI, and a boolean indicating if
    // a program has completed execution (and thus should be popped off the
    // execution stack).
    handleLog(execution, log, errorOnDecodeFailure) {
        // Executing program is this program.
        if (execution.stack.length > 0 && execution.program() === this.programId.toString()) {
            return this.handleProgramLog(log, errorOnDecodeFailure);
        } else {
            return [
                null,
                ...this.handleSystemLog(log)
            ];
        }
    }
    // Handles logs from *this* program.
    handleProgramLog(log, errorOnDecodeFailure) {
        // This is a `msg!` log or a `sol_log_data` log.
        if (log.startsWith(PROGRAM_LOG) || log.startsWith(PROGRAM_DATA)) {
            const logStr = log.startsWith(PROGRAM_LOG) ? log.slice(PROGRAM_LOG_START_INDEX) : log.slice(PROGRAM_DATA_START_INDEX);
            const event = this.coder.events.decode(logStr);
            if (errorOnDecodeFailure && event === null) {
                throw new Error(`Unable to decode event ${logStr}`);
            }
            return [
                event,
                null,
                false
            ];
        } else {
            return [
                null,
                ...this.handleSystemLog(log)
            ];
        }
    }
    // Handles logs when the current program being executing is *not* this.
    handleSystemLog(log) {
        // System component.
        const logStart = log.split(":")[0];
        // Did the program finish executing?
        if (logStart.match(/^Program (.*) success/g) !== null) {
            return [
                null,
                true
            ];
        // Recursive call.
        } else if (logStart.startsWith(`Program ${this.programId.toString()} invoke`)) {
            return [
                this.programId.toString(),
                false
            ];
        } else if (logStart.includes("invoke")) {
            return [
                "cpi",
                false
            ]; // Any string will do.
        } else {
            return [
                null,
                false
            ];
        }
    }
}
// Stack frame execution context, allowing one to track what program is
// executing for a given log.
class ExecutionContext {
    constructor(){
        this.stack = [];
    }
    program() {
        if (!this.stack.length) {
            throw new Error("Expected the stack to have elements");
        }
        return this.stack[this.stack.length - 1];
    }
    push(newProgram) {
        this.stack.push(newProgram);
    }
    pop() {
        if (!this.stack.length) {
            throw new Error("Expected the stack to have elements");
        }
        this.stack.pop();
    }
}
class LogScanner {
    constructor(logs){
        this.logs = logs;
    }
    next() {
        if (this.logs.length === 0) {
            return null;
        }
        let l = this.logs[0];
        this.logs = this.logs.slice(1);
        return l;
    }
} //# sourceMappingURL=event.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/context.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "splitArgsAndCtx",
    ()=>splitArgsAndCtx
]);
function splitArgsAndCtx(idlIx, args) {
    var _a, _b;
    let options = {};
    const inputLen = idlIx.args ? idlIx.args.length : 0;
    if (args.length > inputLen) {
        if (args.length !== inputLen + 1) {
            throw new Error(`provided too many arguments ${args} to instruction ${idlIx === null || idlIx === void 0 ? void 0 : idlIx.name} expecting: ${(_b = (_a = idlIx.args) === null || _a === void 0 ? void 0 : _a.map((a)=>a.name)) !== null && _b !== void 0 ? _b : []}`);
        }
        options = args.pop();
    }
    return [
        args,
        options
    ];
} //# sourceMappingURL=context.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/namespace/instruction.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InstructionNamespaceFactory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/web3.js/lib/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/idl.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/error.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/common.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/context.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$features$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/features.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
class InstructionNamespaceFactory {
    static build(idlIx, encodeFn, programId) {
        if (idlIx.name === "_inner") {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IdlError"]("the _inner name is reserved");
        }
        const ix = (...args)=>{
            const [ixArgs, ctx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["splitArgsAndCtx"])(idlIx, [
                ...args
            ]);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateAccounts"])(idlIx.accounts, ctx.accounts);
            validateInstruction(idlIx, ...args);
            const keys = ix.accounts(ctx.accounts);
            if (ctx.remainingAccounts !== undefined) {
                keys.push(...ctx.remainingAccounts);
            }
            if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$features$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isSet"]("debug-logs")) {
                console.log("Outgoing account metas:", keys);
            }
            return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TransactionInstruction"]({
                keys,
                programId,
                data: encodeFn(idlIx.name, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toInstruction"])(idlIx, ...ixArgs))
            });
        };
        // Utility fn for ordering the accounts for this instruction.
        ix["accounts"] = (accs)=>{
            return InstructionNamespaceFactory.accountsArray(accs, idlIx.accounts, programId, idlIx.name);
        };
        return ix;
    }
    static accountsArray(ctx, accounts, programId, ixName) {
        if (!ctx) {
            return [];
        }
        return accounts.map((acc)=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isCompositeAccounts"])(acc)) {
                const rpcAccs = ctx[acc.name];
                return InstructionNamespaceFactory.accountsArray(rpcAccs, acc.accounts, programId, ixName).flat();
            }
            let pubkey;
            try {
                pubkey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translateAddress"])(ctx[acc.name]);
            } catch (err) {
                throw new Error(`Wrong input type for account "${acc.name}" in the instruction accounts object${ixName !== undefined ? ' for instruction "' + ixName + '"' : ""}. Expected PublicKey or string.`);
            }
            const isOptional = acc.optional && pubkey.equals(programId);
            const isWritable = Boolean(acc.writable && !isOptional);
            const isSigner = Boolean(acc.signer && !isOptional);
            return {
                pubkey,
                isWritable,
                isSigner
            };
        }).flat();
    }
}
// Throws error if any argument required for the `ix` is not given.
function validateInstruction(ix, ...args) {
// todo
} //# sourceMappingURL=instruction.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/namespace/transaction.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TransactionFactory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/web3.js/lib/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/context.js [app-ssr] (ecmascript)");
;
;
class TransactionFactory {
    static build(idlIx, ixFn) {
        const txFn = (...args)=>{
            var _a, _b, _c;
            const [, ctx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["splitArgsAndCtx"])(idlIx, [
                ...args
            ]);
            const tx = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Transaction"]();
            if (ctx.preInstructions && ctx.instructions) {
                throw new Error("instructions is deprecated, use preInstructions");
            }
            (_a = ctx.preInstructions) === null || _a === void 0 ? void 0 : _a.forEach((ix)=>tx.add(ix));
            (_b = ctx.instructions) === null || _b === void 0 ? void 0 : _b.forEach((ix)=>tx.add(ix));
            tx.add(ixFn(...args));
            (_c = ctx.postInstructions) === null || _c === void 0 ? void 0 : _c.forEach((ix)=>tx.add(ix));
            return tx;
        };
        return txFn;
    }
} //# sourceMappingURL=transaction.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/namespace/rpc.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RpcFactory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/context.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/error.js [app-ssr] (ecmascript)");
;
;
class RpcFactory {
    static build(idlIx, txFn, idlErrors, provider) {
        const rpc = async (...args)=>{
            var _a;
            const tx = txFn(...args);
            const [, ctx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["splitArgsAndCtx"])(idlIx, [
                ...args
            ]);
            if (provider.sendAndConfirm === undefined) {
                throw new Error("This function requires 'Provider.sendAndConfirm' to be implemented.");
            }
            try {
                return await provider.sendAndConfirm(tx, (_a = ctx.signers) !== null && _a !== void 0 ? _a : [], ctx.options);
            } catch (err) {
                throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translateError"])(err, idlErrors);
            }
        };
        return rpc;
    }
} //# sourceMappingURL=rpc.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/namespace/account.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccountClient",
    ()=>AccountClient,
    "default",
    ()=>AccountFactory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$eventemitter3$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/eventemitter3/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/web3.js/lib/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/common.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$rpc$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/rpc.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
class AccountFactory {
    static build(idl, coder, programId, provider) {
        var _a;
        return ((_a = idl.accounts) !== null && _a !== void 0 ? _a : []).reduce((accountFns, acc)=>{
            accountFns[acc.name] = new AccountClient(idl, acc, programId, provider, coder);
            return accountFns;
        }, {});
    }
}
class AccountClient {
    /**
     * Returns the number of bytes in this account.
     */ get size() {
        return this._size;
    }
    /**
     * Returns the program ID owning all accounts.
     */ get programId() {
        return this._programId;
    }
    /**
     * Returns the client's wallet and network provider.
     */ get provider() {
        return this._provider;
    }
    /**
     * Returns the coder.
     */ get coder() {
        return this._coder;
    }
    constructor(idl, idlAccount, programId, provider, coder){
        this._idlAccount = idlAccount;
        this._programId = programId;
        this._provider = provider !== null && provider !== void 0 ? provider : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProvider"])();
        this._coder = coder !== null && coder !== void 0 ? coder : new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BorshCoder"](idl);
        this._size = this._coder.accounts.size(idlAccount.name);
    }
    /**
     * Returns a deserialized account, returning null if it doesn't exist.
     *
     * @param address The address of the account to fetch.
     */ async fetchNullable(address, commitment) {
        const { data } = await this.fetchNullableAndContext(address, commitment);
        return data;
    }
    /**
     * Returns a deserialized account along with the associated rpc response context, returning null if it doesn't exist.
     *
     * @param address The address of the account to fetch.
     */ async fetchNullableAndContext(address, commitment) {
        const accountInfo = await this.getAccountInfoAndContext(address, commitment);
        const { value, context } = accountInfo;
        return {
            data: value && value.data.length !== 0 ? this._coder.accounts.decode(this._idlAccount.name, value.data) : null,
            context
        };
    }
    /**
     * Returns a deserialized account.
     *
     * @param address The address of the account to fetch.
     */ async fetch(address, commitment) {
        const { data } = await this.fetchNullableAndContext(address, commitment);
        if (data === null) {
            throw new Error(`Account does not exist or has no data ${address.toString()}`);
        }
        return data;
    }
    /**
     * Returns a deserialized account along with the associated rpc response context.
     *
     * @param address The address of the account to fetch.
     */ async fetchAndContext(address, commitment) {
        const { data, context } = await this.fetchNullableAndContext(address, commitment);
        if (data === null) {
            throw new Error(`Account does not exist ${address.toString()}`);
        }
        return {
            data,
            context
        };
    }
    /**
     * Returns multiple deserialized accounts.
     * Accounts not found or with wrong discriminator are returned as null.
     *
     * @param addresses The addresses of the accounts to fetch.
     */ async fetchMultiple(addresses, commitment) {
        const accounts = await this.fetchMultipleAndContext(addresses, commitment);
        return accounts.map((account)=>account ? account.data : null);
    }
    /**
     * Returns multiple deserialized accounts.
     * Accounts not found or with wrong discriminator are returned as null.
     *
     * @param addresses The addresses of the accounts to fetch.
     */ async fetchMultipleAndContext(addresses, commitment) {
        const accounts = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$rpc$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMultipleAccountsAndContext"](this._provider.connection, addresses.map((address)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translateAddress"])(address)), commitment);
        // Decode accounts where discriminator is correct, null otherwise
        return accounts.map((result)=>{
            if (result == null) {
                return null;
            }
            const { account, context } = result;
            return {
                data: this._coder.accounts.decode(this._idlAccount.name, account.data),
                context
            };
        });
    }
    /**
     * Returns all instances of this account type for the program.
     *
     * @param filters User-provided filters to narrow the results from `connection.getProgramAccounts`.
     *
     *                When filters are not defined this method returns all
     *                the account instances.
     *
     *                When filters are of type `Buffer`, the filters are appended
     *                after the discriminator.
     *
     *                When filters are of type `GetProgramAccountsFilter[]`,
     *                filters are appended after the discriminator filter.
     */ async all(filters) {
        const filter = this.coder.accounts.memcmp(this._idlAccount.name, filters instanceof Buffer ? filters : undefined);
        const coderFilters = [];
        if ((filter === null || filter === void 0 ? void 0 : filter.offset) != undefined && (filter === null || filter === void 0 ? void 0 : filter.bytes) != undefined) {
            coderFilters.push({
                memcmp: {
                    offset: filter.offset,
                    bytes: filter.bytes
                }
            });
        }
        if ((filter === null || filter === void 0 ? void 0 : filter.dataSize) != undefined) {
            coderFilters.push({
                dataSize: filter.dataSize
            });
        }
        let resp = await this._provider.connection.getProgramAccounts(this._programId, {
            commitment: this._provider.connection.commitment,
            filters: [
                ...coderFilters,
                ...Array.isArray(filters) ? filters : []
            ]
        });
        return resp.map(({ pubkey, account })=>{
            return {
                publicKey: pubkey,
                account: this._coder.accounts.decode(this._idlAccount.name, account.data)
            };
        });
    }
    /**
     * Returns an `EventEmitter` emitting a "change" event whenever the account
     * changes.
     */ subscribe(address, commitment) {
        const sub = subscriptions.get(address.toString());
        if (sub) {
            return sub.ee;
        }
        const ee = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$eventemitter3$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]();
        address = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translateAddress"])(address);
        const listener = this._provider.connection.onAccountChange(address, (acc)=>{
            const account = this._coder.accounts.decode(this._idlAccount.name, acc.data);
            ee.emit("change", account);
        }, commitment);
        subscriptions.set(address.toString(), {
            ee,
            listener
        });
        return ee;
    }
    /**
     * Unsubscribes from the account at the given address.
     */ async unsubscribe(address) {
        let sub = subscriptions.get(address.toString());
        if (!sub) {
            console.warn("Address is not subscribed");
            return;
        }
        if (subscriptions) {
            await this._provider.connection.removeAccountChangeListener(sub.listener).then(()=>{
                subscriptions.delete(address.toString());
            }).catch(console.error);
        }
    }
    /**
     * Returns an instruction for creating this account.
     */ async createInstruction(signer, sizeOverride) {
        const size = this.size;
        if (this._provider.publicKey === undefined) {
            throw new Error("This function requires the Provider interface implementor to have a 'publicKey' field.");
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SystemProgram"].createAccount({
            fromPubkey: this._provider.publicKey,
            newAccountPubkey: signer.publicKey,
            space: sizeOverride !== null && sizeOverride !== void 0 ? sizeOverride : size,
            lamports: await this._provider.connection.getMinimumBalanceForRentExemption(sizeOverride !== null && sizeOverride !== void 0 ? sizeOverride : size),
            programId: this._programId
        });
    }
    async getAccountInfo(address, commitment) {
        return await this._provider.connection.getAccountInfo((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translateAddress"])(address), commitment);
    }
    async getAccountInfoAndContext(address, commitment) {
        return await this._provider.connection.getAccountInfoAndContext((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translateAddress"])(address), commitment);
    }
}
// Tracks all subscriptions.
const subscriptions = new Map(); //# sourceMappingURL=account.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/namespace/simulate.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SimulateFactory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/context.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/event.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/error.js [app-ssr] (ecmascript)");
;
;
;
class SimulateFactory {
    static build(idlIx, txFn, idlErrors, provider, coder, programId, idl) {
        const simulate = async (...args)=>{
            var _a;
            const tx = txFn(...args);
            const [, ctx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["splitArgsAndCtx"])(idlIx, [
                ...args
            ]);
            let resp = undefined;
            if (provider.simulate === undefined) {
                throw new Error("This function requires 'Provider.simulate' to be implemented.");
            }
            try {
                resp = await provider.simulate(tx, ctx.signers, (_a = ctx.options) === null || _a === void 0 ? void 0 : _a.commitment);
            } catch (err) {
                throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translateError"])(err, idlErrors);
            }
            if (resp === undefined) {
                throw new Error("Unable to simulate transaction");
            }
            const logs = resp.logs;
            if (!logs) {
                throw new Error("Simulated logs not found");
            }
            const events = [];
            if (idl.events) {
                let parser = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EventParser"](programId, coder);
                for (const event of parser.parseLogs(logs)){
                    events.push(event);
                }
            }
            return {
                events,
                raw: logs
            };
        };
        return simulate;
    }
} //# sourceMappingURL=simulate.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/token-account-layout.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decodeTokenAccount",
    ()=>decodeTokenAccount
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/bn.js/lib/bn.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/buffer-layout/lib/Layout.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/web3.js/lib/index.esm.js [app-ssr] (ecmascript)");
;
;
;
;
function uint64(property) {
    return new WrappedLayout(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["blob"](8), (b)=>u64.fromBuffer(b), (n)=>n.toBuffer(), property);
}
function publicKey(property) {
    return new WrappedLayout(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["blob"](32), (b)=>new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"](b), (key)=>key.toBuffer(), property);
}
function coption(layout, property) {
    return new COptionLayout(layout, property);
}
class WrappedLayout extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Layout"] {
    constructor(layout, decoder, encoder, property){
        super(layout.span, property);
        this.layout = layout;
        this.decoder = decoder;
        this.encoder = encoder;
    }
    decode(b, offset) {
        return this.decoder(this.layout.decode(b, offset));
    }
    encode(src, b, offset) {
        return this.layout.encode(this.encoder(src), b, offset);
    }
    getSpan(b, offset) {
        return this.layout.getSpan(b, offset);
    }
}
class COptionLayout extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Layout"] {
    constructor(layout, property){
        super(-1, property);
        this.layout = layout;
        this.discriminator = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u32"]();
    }
    encode(src, b, offset = 0) {
        if (src === null || src === undefined) {
            return this.layout.span + this.discriminator.encode(0, b, offset);
        }
        this.discriminator.encode(1, b, offset);
        return this.layout.encode(src, b, offset + 4) + 4;
    }
    decode(b, offset = 0) {
        const discriminator = this.discriminator.decode(b, offset);
        if (discriminator === 0) {
            return null;
        } else if (discriminator === 1) {
            return this.layout.decode(b, offset + 4);
        }
        throw new Error("Invalid coption " + this.layout.property);
    }
    getSpan(b, offset = 0) {
        return this.layout.getSpan(b, offset + 4) + 4;
    }
}
class u64 extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"] {
    /**
     * Convert to Buffer representation
     */ toBuffer() {
        const a = super.toArray().reverse();
        const b = Buffer.from(a);
        if (b.length === 8) {
            return b;
        }
        if (b.length >= 8) {
            throw new Error("u64 too large");
        }
        const zeroPad = Buffer.alloc(8);
        b.copy(zeroPad);
        return zeroPad;
    }
    /**
     * Construct a u64 from Buffer representation
     */ static fromBuffer(buffer) {
        if (buffer.length !== 8) {
            throw new Error(`Invalid buffer length: ${buffer.length}`);
        }
        return new u64([
            ...buffer
        ].reverse().map((i)=>`00${i.toString(16)}`.slice(-2)).join(""), 16);
    }
}
const TOKEN_ACCOUNT_LAYOUT = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([
    publicKey("mint"),
    publicKey("owner"),
    uint64("amount"),
    coption(publicKey(), "delegate"),
    ((p)=>{
        const U = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["union"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u8"]("discriminator"), null, p);
        U.addVariant(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([]), "uninitialized");
        U.addVariant(1, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([]), "initialized");
        U.addVariant(2, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2d$layout$2f$lib$2f$Layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["struct"]([]), "frozen");
        return U;
    })("state"),
    coption(uint64(), "isNative"),
    uint64("delegatedAmount"),
    coption(publicKey(), "closeAuthority")
]);
function decodeTokenAccount(b) {
    return TOKEN_ACCOUNT_LAYOUT.decode(b);
} //# sourceMappingURL=token-account-layout.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/accounts-resolver.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccountsResolver",
    ()=>AccountsResolver,
    "isAccountsGeneric",
    ()=>isAccountsGeneric
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/bn.js/lib/bn.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/web3.js/lib/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/idl.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$token$2d$account$2d$layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/token-account-layout.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/common.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$methods$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/namespace/methods.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
function isAccountsGeneric(accounts) {
    return !(accounts instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"]);
}
class AccountsResolver {
    constructor(_args, _accounts, _provider, _programId, _idlIx, accountNamespace, _idlTypes, _customResolver){
        this._args = _args;
        this._accounts = _accounts;
        this._provider = _provider;
        this._programId = _programId;
        this._idlIx = _idlIx;
        this._idlTypes = _idlTypes;
        this._customResolver = _customResolver;
        this._accountStore = new AccountStore(_provider, accountNamespace, _programId);
    }
    args(args) {
        this._args = args;
    }
    // Note: We serially resolve PDAs one by one rather than doing them
    //       in parallel because there can be dependencies between
    //       addresses. That is, one PDA can be used as a seed in another.
    async resolve() {
        this.resolveEventCpi(this._idlIx.accounts);
        this.resolveConst(this._idlIx.accounts);
        // Auto populate pdas and relations until we stop finding new accounts
        let depth = 0;
        while(await this.resolvePdasAndRelations(this._idlIx.accounts) + await this.resolveCustom() > 0){
            depth++;
            if (depth === 16) {
                const isResolvable = (acc)=>{
                    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isCompositeAccounts"])(acc)) {
                        return !!(acc.address || acc.pda || acc.relations);
                    }
                    return acc.accounts.some(isResolvable);
                };
                const getPaths = (accs, path = [], paths = [])=>{
                    for (const acc of accs){
                        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isCompositeAccounts"])(acc)) {
                            paths.push(...getPaths(acc.accounts, [
                                ...path,
                                acc.name
                            ]));
                        } else {
                            paths.push([
                                ...path,
                                acc.name
                            ]);
                        }
                    }
                    return paths;
                };
                const resolvableAccs = this._idlIx.accounts.filter(isResolvable);
                const unresolvedAccs = getPaths(resolvableAccs).filter((path)=>!this.get(path)).map((path)=>path.reduce((acc, p)=>acc + "." + p)).map((acc)=>`\`${acc}\``).join(", ");
                throw new Error([
                    `Reached maximum depth for account resolution.`,
                    `Unresolved accounts: ${unresolvedAccs}`
                ].join(" "));
            }
        }
    }
    resolveOptionals(accounts) {
        Object.assign(this._accounts, this.resolveOptionalsHelper(accounts, this._idlIx.accounts));
    }
    get(path) {
        // Only return if pubkey
        const ret = path.reduce((acc, subPath)=>acc && acc[subPath], this._accounts);
        if (ret && ret.toBase58) {
            return ret;
        }
    }
    set(path, value) {
        let cur = this._accounts;
        path.forEach((p, i)=>{
            var _a;
            const isLast = i === path.length - 1;
            if (isLast) {
                cur[p] = value;
            }
            cur[p] = (_a = cur[p]) !== null && _a !== void 0 ? _a : {};
            cur = cur[p];
        });
    }
    resolveOptionalsHelper(partialAccounts, accounts) {
        const nestedAccountsGeneric = {};
        // Looping through accountItem array instead of on partialAccounts, so
        // we only traverse array once
        for (const accountItem of accounts){
            const accountName = accountItem.name;
            const partialAccount = partialAccounts[accountName];
            // Skip if the account isn't included (thus would be undefined)
            if (partialAccount === undefined) continue;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$methods$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isPartialAccounts"])(partialAccount)) {
                // is compound accounts, recurse one level deeper
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isCompositeAccounts"])(accountItem)) {
                    nestedAccountsGeneric[accountName] = this.resolveOptionalsHelper(partialAccount, accountItem["accounts"]);
                } else {
                    // Here we try our best to recover gracefully. If there are optionals we can't check, we will fail then.
                    nestedAccountsGeneric[accountName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$methods$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["flattenPartialAccounts"])(partialAccount, true);
                }
            } else {
                // if not compound accounts, do null/optional check and proceed
                if (partialAccount !== null) {
                    nestedAccountsGeneric[accountName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translateAddress"])(partialAccount);
                } else if (accountItem["optional"]) {
                    nestedAccountsGeneric[accountName] = this._programId;
                }
            }
        }
        return nestedAccountsGeneric;
    }
    async resolveCustom() {
        if (this._customResolver) {
            const { accounts, resolved } = await this._customResolver({
                args: this._args,
                accounts: this._accounts,
                provider: this._provider,
                programId: this._programId,
                idlIx: this._idlIx
            });
            this._accounts = accounts;
            return resolved;
        }
        return 0;
    }
    /**
     * Resolve event CPI accounts `eventAuthority` and `program`.
     *
     * Accounts will only be resolved if they are declared next to each other to
     * reduce the chance of name collision.
     */ resolveEventCpi(accounts, path = []) {
        for(const i in accounts){
            const accountOrAccounts = accounts[i];
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isCompositeAccounts"])(accountOrAccounts)) {
                this.resolveEventCpi(accountOrAccounts.accounts, [
                    ...path,
                    accountOrAccounts.name
                ]);
            }
            // Validate next index exists
            const nextIndex = +i + 1;
            if (nextIndex === accounts.length) return;
            const currentName = accounts[i].name;
            const nextName = accounts[nextIndex].name;
            // Populate event CPI accounts if they exist
            if (currentName === "eventAuthority" && nextName === "program") {
                const currentPath = [
                    ...path,
                    currentName
                ];
                const nextPath = [
                    ...path,
                    nextName
                ];
                if (!this.get(currentPath)) {
                    this.set(currentPath, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"].findProgramAddressSync([
                        Buffer.from("__event_authority")
                    ], this._programId)[0]);
                }
                if (!this.get(nextPath)) {
                    this.set(nextPath, this._programId);
                }
                return;
            }
        }
    }
    resolveConst(accounts, path = []) {
        for (const accountOrAccounts of accounts){
            const name = accountOrAccounts.name;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isCompositeAccounts"])(accountOrAccounts)) {
                this.resolveConst(accountOrAccounts.accounts, [
                    ...path,
                    name
                ]);
            } else {
                const account = accountOrAccounts;
                if ((account.signer || account.address) && !this.get([
                    ...path,
                    name
                ])) {
                    // Default signers to the provider
                    if (account.signer) {
                        if (!this._provider.publicKey) {
                            throw new Error("This function requires the `Provider` interface implementor to have a `publicKey` field.");
                        }
                        this.set([
                            ...path,
                            name
                        ], this._provider.publicKey);
                    }
                    // Set based on `address` field
                    if (account.address) {
                        this.set([
                            ...path,
                            name
                        ], (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translateAddress"])(account.address));
                    }
                }
            }
        }
    }
    async resolvePdasAndRelations(accounts, path = []) {
        let found = 0;
        for (const accountOrAccounts of accounts){
            const name = accountOrAccounts.name;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isCompositeAccounts"])(accountOrAccounts)) {
                found += await this.resolvePdasAndRelations(accountOrAccounts.accounts, [
                    ...path,
                    name
                ]);
            } else {
                const account = accountOrAccounts;
                if ((account.pda || account.relations) && !this.get([
                    ...path,
                    name
                ])) {
                    found++;
                    // Accounts might not get resolved successfully if a seed depends on
                    // another seed to be resolved *and* the accounts for resolution are
                    // out of order. In this case, skip the accounts that throw in order
                    // to resolve those accounts later.
                    try {
                        if (account.pda) {
                            const seeds = await Promise.all(account.pda.seeds.map((seed)=>this.toBuffer(seed, path)));
                            if (seeds.some((seed)=>!seed)) {
                                continue;
                            }
                            const programId = await this.parseProgramId(account, path);
                            const [pubkey] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"].findProgramAddressSync(seeds, programId);
                            this.set([
                                ...path,
                                name
                            ], pubkey);
                        }
                    } catch  {}
                    try {
                        if (account.relations) {
                            const accountKey = this.get([
                                ...path,
                                account.relations[0]
                            ]);
                            if (accountKey) {
                                const account = await this._accountStore.fetchAccount({
                                    publicKey: accountKey
                                });
                                this.set([
                                    ...path,
                                    name
                                ], account[name]);
                            }
                        }
                    } catch  {}
                }
            }
        }
        return found;
    }
    async parseProgramId(account, path = []) {
        var _a;
        if (!((_a = account.pda) === null || _a === void 0 ? void 0 : _a.program)) {
            return this._programId;
        }
        const buf = await this.toBuffer(account.pda.program, path);
        if (!buf) {
            throw new Error(`Program seed not resolved: ${account.name}`);
        }
        return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"](buf);
    }
    async toBuffer(seed, path = []) {
        switch(seed.kind){
            case "const":
                return this.toBufferConst(seed);
            case "arg":
                return await this.toBufferArg(seed);
            case "account":
                return await this.toBufferAccount(seed, path);
            default:
                throw new Error(`Unexpected seed: ${seed}`);
        }
    }
    toBufferConst(seed) {
        return this.toBufferValue("bytes", seed.value);
    }
    async toBufferArg(seed) {
        const [name, ...path] = seed.path.split(".");
        const index = this._idlIx.args.findIndex((arg)=>arg.name === name);
        if (index === -1) {
            throw new Error(`Unable to find argument for seed: ${name}`);
        }
        const value = path.reduce((acc, path)=>(acc !== null && acc !== void 0 ? acc : {})[path], this._args[index]);
        if (value === undefined) {
            return;
        }
        const type = this.getType(this._idlIx.args[index].type, path);
        return this.toBufferValue(type, value);
    }
    async toBufferAccount(seed, path = []) {
        const [name, ...paths] = seed.path.split(".");
        const fieldPubkey = this.get([
            ...path,
            name
        ]);
        if (!fieldPubkey) return;
        // The seed is a pubkey of the account.
        if (!paths.length) {
            return this.toBufferValue("pubkey", fieldPubkey);
        }
        if (!seed.account) {
            throw new Error(`Seed account is required in order to resolve type: ${seed.path}`);
        }
        // The key is account data.
        //
        // Fetch and deserialize it.
        const account = await this._accountStore.fetchAccount({
            publicKey: fieldPubkey,
            name: seed.account
        });
        // Dereference all fields in the path to get the field value
        // used in the seed.
        let accountValue = account;
        let currentPaths = paths;
        while(currentPaths.length > 0){
            accountValue = accountValue[currentPaths[0]];
            currentPaths = currentPaths.slice(1);
        }
        if (accountValue === undefined) return;
        const type = this.getType({
            defined: {
                name: seed.account
            }
        }, paths);
        return this.toBufferValue(type, accountValue);
    }
    /**
     * Converts the given idl valaue into a Buffer. The values here must be
     * primitives, e.g. no structs.
     */ toBufferValue(type, value) {
        switch(type){
            case "u8":
            case "i8":
                return Buffer.from([
                    value
                ]);
            case "u16":
            case "i16":
                return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](value).toArrayLike(Buffer, "le", 2);
            case "u32":
            case "i32":
                return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](value).toArrayLike(Buffer, "le", 4);
            case "u64":
            case "i64":
                return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](value).toArrayLike(Buffer, "le", 8);
            case "u128":
            case "i128":
                return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](value).toArrayLike(Buffer, "le", 16);
            case "u256":
            case "i256":
                return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](value).toArrayLike(Buffer, "le", 32);
            case "string":
                return Buffer.from(value);
            case "pubkey":
                return value.toBuffer();
            case "bytes":
                return Buffer.from(value);
            default:
                if (type === null || type === void 0 ? void 0 : type.array) {
                    return Buffer.from(value);
                }
                throw new Error(`Unexpected seed type: ${type}`);
        }
    }
    /**
     * Recursively get the type at some path of either a primitive or a user
     * defined struct.
     */ getType(type, path = []) {
        var _a;
        const typeName = (_a = type === null || type === void 0 ? void 0 : type.defined) === null || _a === void 0 ? void 0 : _a.name;
        if (typeName) {
            // Handle token account separately
            if (typeName === "tokenAccount") {
                switch(path.at(0)){
                    case "mint":
                    case "owner":
                        return "pubkey";
                    case "amount":
                    case "delagatedAmount":
                        return "u64";
                    default:
                        throw new Error(`Unknown token account path: ${path}`);
                }
            }
            const definedType = this._idlTypes.find((t)=>t.name === typeName);
            if (!definedType) {
                throw new Error(`Type not found: ${typeName}`);
            }
            // Only named structs are supported
            const [fieldName, ...subPath] = path;
            const fields = definedType.type.fields;
            const field = fields.find((field)=>field.name === fieldName);
            if (!field) {
                throw new Error(`Field not found: ${fieldName}`);
            }
            return this.getType(field.type, subPath);
        }
        return type;
    }
}
// TODO: this should be configurable to avoid unnecessary requests.
class AccountStore {
    constructor(_provider, accounts, programId){
        this._provider = _provider;
        this._cache = new Map();
        this._idls = {};
        this._idls[programId.toBase58()] = accounts;
    }
    async fetchAccount({ publicKey, name }) {
        const address = publicKey.toBase58();
        if (!this._cache.has(address)) {
            const accountInfo = await this._provider.connection.getAccountInfo(publicKey);
            if (accountInfo === null) {
                throw new Error(`Account not found: ${address}`);
            }
            if (name === "tokenAccount") {
                const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$token$2d$account$2d$layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decodeTokenAccount"])(accountInfo.data);
                this._cache.set(address, account);
            } else {
                const accounts = await this.getAccountsNs(accountInfo.owner);
                if (accounts) {
                    const accountNs = Object.values(accounts)[0];
                    if (accountNs) {
                        const account = accountNs.coder.accounts.decodeAny(accountInfo.data);
                        this._cache.set(address, account);
                    }
                }
            }
        }
        return this._cache.get(address);
    }
    async getAccountsNs(programId) {
        const programIdStr = programId.toBase58();
        if (!this._idls[programIdStr]) {
            const idl = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Program"].fetchIdl(programId, this._provider);
            if (idl) {
                const program = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Program"](idl, this._provider);
                this._idls[programIdStr] = program.account;
            }
        }
        return this._idls[programIdStr];
    }
} //# sourceMappingURL=accounts-resolver.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/namespace/methods.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MethodsBuilder",
    ()=>MethodsBuilder,
    "MethodsBuilderFactory",
    ()=>MethodsBuilderFactory,
    "flattenPartialAccounts",
    ()=>flattenPartialAccounts,
    "isPartialAccounts",
    ()=>isPartialAccounts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$accounts$2d$resolver$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/accounts-resolver.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/common.js [app-ssr] (ecmascript)");
;
;
class MethodsBuilderFactory {
    static build(provider, programId, idlIx, ixFn, txFn, rpcFn, simulateFn, viewFn, accountNamespace, idlTypes, customResolver) {
        return (...args)=>new MethodsBuilder(args, ixFn, txFn, rpcFn, simulateFn, viewFn, provider, programId, idlIx, accountNamespace, idlTypes, customResolver);
    }
}
function isPartialAccounts(partialAccount) {
    return typeof partialAccount === "object" && partialAccount !== null && !("_bn" in partialAccount) // Ensures not a pubkey
    ;
}
function flattenPartialAccounts(partialAccounts, throwOnNull) {
    const toReturn = {};
    for(const accountName in partialAccounts){
        const account = partialAccounts[accountName];
        if (account === null) {
            if (throwOnNull) throw new Error("Failed to resolve optionals due to IDL type mismatch with input accounts!");
            continue;
        }
        toReturn[accountName] = isPartialAccounts(account) ? flattenPartialAccounts(account, true) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translateAddress"])(account);
    }
    return toReturn;
}
class MethodsBuilder {
    constructor(_args, _ixFn, _txFn, _rpcFn, _simulateFn, _viewFn, provider, programId, idlIx, accountNamespace, idlTypes, customResolver){
        this._args = _args;
        this._ixFn = _ixFn;
        this._txFn = _txFn;
        this._rpcFn = _rpcFn;
        this._simulateFn = _simulateFn;
        this._viewFn = _viewFn;
        this._accounts = {};
        this._remainingAccounts = [];
        this._signers = [];
        this._preInstructions = [];
        this._postInstructions = [];
        this._resolveAccounts = true;
        this._accountsResolver = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$accounts$2d$resolver$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AccountsResolver"](_args, this._accounts, provider, programId, idlIx, accountNamespace, idlTypes, customResolver);
    }
    args(args) {
        this._args = args;
        this._accountsResolver.args(args);
    }
    /**
     * Set instruction accounts with account resolution.
     *
     * This method only accepts accounts that cannot be resolved.
     *
     * See {@link accountsPartial} for overriding the account resolution or
     * {@link accountsStrict} for strictly specifying all accounts.
     */ accounts(accounts) {
        // @ts-ignore
        return this.accountsPartial(accounts);
    }
    /**
     * Set instruction accounts with account resolution.
     *
     * There is no functional difference between this method and {@link accounts}
     * method, the only difference is this method allows specifying all accounts
     * even if they can be resolved. On the other hand, {@link accounts} method
     * doesn't accept accounts that can be resolved.
     */ accountsPartial(accounts) {
        this._resolveAccounts = true;
        this._accountsResolver.resolveOptionals(accounts);
        return this;
    }
    /**
     * Set instruction accounts without account resolution.
     *
     * All accounts strictly need to be specified when this method is used.
     *
     * See {@link accounts} and {@link accountsPartial} methods for automatically
     * resolving accounts.
     *
     * @param accounts instruction accounts
     */ accountsStrict(accounts) {
        this._resolveAccounts = false;
        this._accountsResolver.resolveOptionals(accounts);
        return this;
    }
    /**
     * Set instruction signers.
     *
     * Note that calling this method appends the given signers to the existing
     * signers (instead of overriding them).
     *
     * @param signers signers to append
     */ signers(signers) {
        this._signers = this._signers.concat(signers);
        return this;
    }
    /**
     * Set remaining accounts.
     *
     * Note that calling this method appends the given accounts to the existing
     * remaining accounts (instead of overriding them).
     *
     * @param accounts remaining accounts
     */ remainingAccounts(accounts) {
        this._remainingAccounts = this._remainingAccounts.concat(accounts);
        return this;
    }
    /**
     * Set previous instructions.
     *
     * See {@link postInstructions} to set the post instructions instead.
     *
     * @param ixs instructions
     * @param prepend whether to prepend to the existing previous instructions
     */ preInstructions(ixs, prepend = false) {
        if (prepend) {
            this._preInstructions = ixs.concat(this._preInstructions);
        } else {
            this._preInstructions = this._preInstructions.concat(ixs);
        }
        return this;
    }
    /**
     * Set post instructions.
     *
     * See {@link preInstructions} to set the previous instructions instead.
     *
     * @param ixs instructions
     */ postInstructions(ixs) {
        this._postInstructions = this._postInstructions.concat(ixs);
        return this;
    }
    /**
     * Get the public keys of the instruction accounts.
     *
     * The return type is an object with account names as keys and their public
     * keys as their values.
     *
     * Note that an account key is `undefined` if the account hasn't yet been
     * specified or resolved.
     */ async pubkeys() {
        if (this._resolveAccounts) {
            await this._accountsResolver.resolve();
        }
        // @ts-ignore
        return this._accounts;
    }
    /**
     * Create an instruction based on the current configuration.
     *
     * See {@link transaction} to create a transaction instead.
     *
     * @returns the transaction instruction
     */ async instruction() {
        if (this._resolveAccounts) {
            await this._accountsResolver.resolve();
        }
        // @ts-ignore
        return this._ixFn(...this._args, {
            accounts: this._accounts,
            signers: this._signers,
            remainingAccounts: this._remainingAccounts,
            preInstructions: this._preInstructions,
            postInstructions: this._postInstructions
        });
    }
    /**
     * Create a transaction based on the current configuration.
     *
     * This method doesn't send the created transaction. Use {@link rpc} method
     * to conveniently send an confirm the configured transaction.
     *
     * See {@link instruction} to only create an instruction instead.
     *
     * @returns the transaction
     */ async transaction() {
        if (this._resolveAccounts) {
            await this._accountsResolver.resolve();
        }
        // @ts-ignore
        return this._txFn(...this._args, {
            accounts: this._accounts,
            signers: this._signers,
            remainingAccounts: this._remainingAccounts,
            preInstructions: this._preInstructions,
            postInstructions: this._postInstructions
        });
    }
    /**
     * Simulate the configured transaction.
     *
     * @param options confirmation options
     * @returns the simulation response
     */ async simulate(options) {
        if (this._resolveAccounts) {
            await this._accountsResolver.resolve();
        }
        // @ts-ignore
        return this._simulateFn(...this._args, {
            accounts: this._accounts,
            signers: this._signers,
            remainingAccounts: this._remainingAccounts,
            preInstructions: this._preInstructions,
            postInstructions: this._postInstructions,
            options
        });
    }
    /**
     * View the configured transaction.
     *
     * Note that to use this method, the instruction needs to return a value and
     * all its accounts must be read-only.
     *
     * @param options confirmation options
     * @returns the return value of the instruction
     */ async view(options) {
        if (this._resolveAccounts) {
            await this._accountsResolver.resolve();
        }
        if (!this._viewFn) {
            throw new Error([
                "Method does not support views.",
                "The instruction should return a value, and its accounts must be read-only"
            ].join(" "));
        }
        // @ts-ignore
        return this._viewFn(...this._args, {
            accounts: this._accounts,
            signers: this._signers,
            remainingAccounts: this._remainingAccounts,
            preInstructions: this._preInstructions,
            postInstructions: this._postInstructions,
            options
        });
    }
    /**
     * Send and confirm the configured transaction.
     *
     * See {@link rpcAndKeys} to both send the transaction and get the resolved
     * account public keys.
     *
     * @param options confirmation options
     * @returns the transaction signature
     */ async rpc(options) {
        if (this._resolveAccounts) {
            await this._accountsResolver.resolve();
        }
        // @ts-ignore
        return this._rpcFn(...this._args, {
            accounts: this._accounts,
            signers: this._signers,
            remainingAccounts: this._remainingAccounts,
            preInstructions: this._preInstructions,
            postInstructions: this._postInstructions,
            options
        });
    }
    /**
     * Conveniently call both {@link rpc} and {@link pubkeys} methods.
     *
     * @param options confirmation options
     * @returns the transaction signature and account public keys
     */ async rpcAndKeys(options) {
        return {
            signature: await this.rpc(options),
            pubkeys: await this.pubkeys()
        };
    }
    /**
     * Get instruction information necessary to include the instruction inside a
     * transaction.
     *
     * # Example
     *
     * ```ts
     * const { instruction, signers, pubkeys } = await method.prepare();
     * ```
     */ async prepare() {
        return {
            instruction: await this.instruction(),
            signers: this._signers,
            pubkeys: await this.pubkeys()
        };
    }
} //# sourceMappingURL=methods.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/namespace/views.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ViewFactory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/idl.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$bytes$2f$base64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/bytes/base64.js [app-ssr] (ecmascript)");
;
;
class ViewFactory {
    static build(programId, idlIx, simulateFn, idl) {
        const isWritable = idlIx.accounts.find((a)=>a.writable);
        const hasReturn = !!idlIx.returns;
        if (isWritable || !hasReturn) return;
        const view = async (...args)=>{
            let simulationResult = await simulateFn(...args);
            const returnPrefix = `Program return: ${programId} `;
            let returnLog = simulationResult.raw.find((l)=>l.startsWith(returnPrefix));
            if (!returnLog) {
                throw new Error("View expected return log");
            }
            let returnData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$bytes$2f$base64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decode"])(returnLog.slice(returnPrefix.length));
            let returnType = idlIx.returns;
            if (!returnType) {
                throw new Error("View expected return type");
            }
            const coder = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IdlCoder"].fieldLayout({
                type: returnType
            }, idl.types);
            return coder.decode(returnData);
        };
        return view;
    }
} //# sourceMappingURL=views.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/namespace/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NamespaceFactory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$instruction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/namespace/instruction.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$transaction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/namespace/transaction.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$rpc$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/namespace/rpc.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$account$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/namespace/account.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$simulate$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/namespace/simulate.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/common.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$methods$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/namespace/methods.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$views$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/namespace/views.js [app-ssr] (ecmascript)");
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
class NamespaceFactory {
    /**
     * Generates all namespaces for a given program.
     */ static build(idl, coder, programId, provider, getCustomResolver) {
        const rpc = {};
        const instruction = {};
        const transaction = {};
        const simulate = {};
        const methods = {};
        const view = {};
        const idlErrors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseIdlErrors"])(idl);
        const account = idl.accounts ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$account$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].build(idl, coder, programId, provider) : {};
        idl.instructions.forEach((idlIx)=>{
            const ixItem = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$instruction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].build(idlIx, (ixName, ix)=>coder.instruction.encode(ixName, ix), programId);
            const txItem = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$transaction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].build(idlIx, ixItem);
            const rpcItem = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$rpc$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].build(idlIx, txItem, idlErrors, provider);
            const simulateItem = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$simulate$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].build(idlIx, txItem, idlErrors, provider, coder, programId, idl);
            const viewItem = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$views$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].build(programId, idlIx, simulateItem, idl);
            const methodItem = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$methods$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MethodsBuilderFactory"].build(provider, programId, idlIx, ixItem, txItem, rpcItem, simulateItem, viewItem, account, idl.types || [], getCustomResolver === null || getCustomResolver === void 0 ? void 0 : getCustomResolver(idlIx));
            const name = idlIx.name;
            instruction[name] = ixItem;
            transaction[name] = txItem;
            rpc[name] = rpcItem;
            simulate[name] = simulateItem;
            methods[name] = methodItem;
            if (viewItem) {
                view[name] = viewItem;
            }
        });
        return [
            rpc,
            instruction,
            transaction,
            account,
            simulate,
            methods,
            view
        ];
    }
} //# sourceMappingURL=index.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Program",
    ()=>Program
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$pako$2f$dist$2f$pako$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/pako/dist/pako.esm.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/borsh/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/idl.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$bytes$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/bytes/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$bytes$2f$utf8$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__utf8$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/bytes/utf8.js [app-ssr] (ecmascript) <export * as utf8>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/common.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/event.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/namespace/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/context.js [app-ssr] (ecmascript)");
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
class Program {
    /**
     * Address of the program.
     */ get programId() {
        return this._programId;
    }
    /**
     * IDL in camelCase format to work in TypeScript.
     *
     * See {@link rawIdl} field if you need the original IDL.
     */ get idl() {
        return this._idl;
    }
    /**
     * Raw IDL i.e. the original IDL without camelCase conversion.
     *
     * See {@link idl} field if you need the camelCased version of the IDL.
     */ get rawIdl() {
        return this._rawIdl;
    }
    /**
     * Coder for serializing requests.
     */ get coder() {
        return this._coder;
    }
    /**
     * Wallet and network provider.
     */ get provider() {
        return this._provider;
    }
    /**
     * @param idl       The interface definition.
     * @param provider  The network and wallet context to use. If not provided
     *                  then uses [[getProvider]].
     * @param getCustomResolver A function that returns a custom account resolver
     *                          for the given instruction. This is useful for resolving
     *                          public keys of missing accounts when building instructions
     */ constructor(idl, provider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProvider"])(), coder, getCustomResolver){
        // Fields.
        this._idl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["convertIdlToCamelCase"])(idl);
        this._rawIdl = idl;
        this._provider = provider;
        this._programId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translateAddress"])(idl.address);
        this._coder = coder !== null && coder !== void 0 ? coder : new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$borsh$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BorshCoder"](this._idl);
        this._events = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EventManager"](this._programId, provider, this._coder);
        // Dynamic namespaces.
        const [rpc, instruction, transaction, account, simulate, methods, views] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].build(this._idl, this._coder, this._programId, provider, getCustomResolver);
        this.rpc = rpc;
        this.instruction = instruction;
        this.transaction = transaction;
        this.account = account;
        this.simulate = simulate;
        this.methods = methods;
        this.views = views;
    }
    /**
     * Generates a Program client by fetching the IDL from the network.
     *
     * In order to use this method, an IDL must have been previously initialized
     * via the anchor CLI's `anchor idl init` command.
     *
     * @param programId The on-chain address of the program.
     * @param provider  The network and wallet context.
     */ static async at(address, provider) {
        const programId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translateAddress"])(address);
        const idl = await Program.fetchIdl(programId, provider);
        if (!idl) {
            throw new Error(`IDL not found for program: ${address.toString()}`);
        }
        return new Program(idl, provider);
    }
    /**
     * Fetches an idl from the blockchain.
     *
     * In order to use this method, an IDL must have been previously initialized
     * via the anchor CLI's `anchor idl init` command.
     *
     * @param programId The on-chain address of the program.
     * @param provider  The network and wallet context.
     */ static async fetchIdl(address, provider) {
        provider = provider !== null && provider !== void 0 ? provider : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProvider"])();
        const programId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translateAddress"])(address);
        const idlAddr = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["idlAddress"])(programId);
        const accountInfo = await provider.connection.getAccountInfo(idlAddr);
        if (!accountInfo) {
            return null;
        }
        // Chop off account discriminator.
        let idlAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$idl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decodeIdlAccount"])(accountInfo.data.slice(8));
        const inflatedIdl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$pako$2f$dist$2f$pako$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inflate"])(idlAccount.data);
        return JSON.parse(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$bytes$2f$utf8$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__utf8$3e$__["utf8"].decode(inflatedIdl));
    }
    /**
     * Invokes the given callback every time the given event is emitted.
     *
     * @param eventName The PascalCase name of the event, provided by the IDL.
     * @param callback  The function to invoke whenever the event is emitted from
     *                  program logs.
     */ addEventListener(eventName, callback, commitment) {
        return this._events.addEventListener(eventName, callback, commitment);
    }
    /**
     * Unsubscribes from the given eventName.
     */ async removeEventListener(listener) {
        return await this._events.removeEventListener(listener);
    }
} //# sourceMappingURL=index.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/native/system.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IDL",
    ()=>IDL,
    "SYSTEM_PROGRAM_ID",
    ()=>SYSTEM_PROGRAM_ID,
    "coder",
    ()=>coder,
    "program",
    ()=>program
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/web3.js/lib/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$system$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/system/index.js [app-ssr] (ecmascript)");
;
;
;
const SYSTEM_PROGRAM_ID = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"]("11111111111111111111111111111111");
function program(provider) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Program"](IDL, provider, coder());
}
function coder() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$system$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SystemCoder"](IDL);
}
const IDL = {
    address: "11111111111111111111111111111111",
    metadata: {
        name: "systemProgram",
        version: "0.1.0",
        spec: "0.1.0"
    },
    instructions: [
        {
            name: "advanceNonceAccount",
            discriminator: [
                4,
                0,
                0,
                0
            ],
            accounts: [
                {
                    name: "nonce",
                    writable: true
                },
                {
                    name: "recentBlockhashes"
                },
                {
                    name: "authorized",
                    signer: true
                }
            ],
            args: [
                {
                    name: "authorized",
                    type: "pubkey"
                }
            ]
        },
        {
            name: "allocate",
            discriminator: [
                8,
                0,
                0,
                0
            ],
            accounts: [
                {
                    name: "pubkey",
                    writable: true,
                    signer: true
                }
            ],
            args: [
                {
                    name: "space",
                    type: "u64"
                }
            ]
        },
        {
            name: "allocateWithSeed",
            discriminator: [
                9,
                0,
                0,
                0
            ],
            accounts: [
                {
                    name: "account",
                    writable: true
                },
                {
                    name: "base",
                    signer: true
                }
            ],
            args: [
                {
                    name: "base",
                    type: "pubkey"
                },
                {
                    name: "seed",
                    type: "string"
                },
                {
                    name: "space",
                    type: "u64"
                },
                {
                    name: "owner",
                    type: "pubkey"
                }
            ]
        },
        {
            name: "assign",
            discriminator: [
                1,
                0,
                0,
                0
            ],
            accounts: [
                {
                    name: "pubkey",
                    writable: true,
                    signer: true
                }
            ],
            args: [
                {
                    name: "owner",
                    type: "pubkey"
                }
            ]
        },
        {
            name: "assignWithSeed",
            discriminator: [
                10,
                0,
                0,
                0
            ],
            accounts: [
                {
                    name: "account",
                    writable: true
                },
                {
                    name: "base",
                    signer: true
                }
            ],
            args: [
                {
                    name: "base",
                    type: "pubkey"
                },
                {
                    name: "seed",
                    type: "string"
                },
                {
                    name: "owner",
                    type: "pubkey"
                }
            ]
        },
        {
            name: "authorizeNonceAccount",
            discriminator: [
                7,
                0,
                0,
                0
            ],
            accounts: [
                {
                    name: "nonce",
                    writable: true
                },
                {
                    name: "authorized",
                    signer: true
                }
            ],
            args: [
                {
                    name: "authorized",
                    type: "pubkey"
                }
            ]
        },
        {
            name: "createAccount",
            discriminator: [
                0,
                0,
                0,
                0
            ],
            accounts: [
                {
                    name: "from",
                    writable: true,
                    signer: true
                },
                {
                    name: "to",
                    writable: true,
                    signer: true
                }
            ],
            args: [
                {
                    name: "lamports",
                    type: "u64"
                },
                {
                    name: "space",
                    type: "u64"
                },
                {
                    name: "owner",
                    type: "pubkey"
                }
            ]
        },
        {
            name: "createAccountWithSeed",
            discriminator: [
                3,
                0,
                0,
                0
            ],
            accounts: [
                {
                    name: "from",
                    writable: true,
                    signer: true
                },
                {
                    name: "to",
                    writable: true
                },
                {
                    name: "base",
                    signer: true
                }
            ],
            args: [
                {
                    name: "base",
                    type: "pubkey"
                },
                {
                    name: "seed",
                    type: "string"
                },
                {
                    name: "lamports",
                    type: "u64"
                },
                {
                    name: "space",
                    type: "u64"
                },
                {
                    name: "owner",
                    type: "pubkey"
                }
            ]
        },
        {
            name: "initializeNonceAccount",
            discriminator: [
                6,
                0,
                0,
                0
            ],
            accounts: [
                {
                    name: "nonce",
                    writable: true,
                    signer: true
                },
                {
                    name: "recentBlockhashes"
                },
                {
                    name: "rent",
                    address: "SysvarRent111111111111111111111111111111111"
                }
            ],
            args: [
                {
                    name: "authorized",
                    type: "pubkey"
                }
            ]
        },
        {
            name: "transfer",
            discriminator: [
                2,
                0,
                0,
                0
            ],
            accounts: [
                {
                    name: "from",
                    writable: true,
                    signer: true
                },
                {
                    name: "to",
                    writable: true
                }
            ],
            args: [
                {
                    name: "lamports",
                    type: "u64"
                }
            ]
        },
        {
            name: "transferWithSeed",
            discriminator: [
                11,
                0,
                0,
                0
            ],
            accounts: [
                {
                    name: "from",
                    writable: true
                },
                {
                    name: "base",
                    signer: true
                },
                {
                    name: "to",
                    writable: true
                }
            ],
            args: [
                {
                    name: "lamports",
                    type: "u64"
                },
                {
                    name: "seed",
                    type: "string"
                },
                {
                    name: "owner",
                    type: "pubkey"
                }
            ]
        },
        {
            name: "withdrawNonceAccount",
            discriminator: [
                5,
                0,
                0,
                0
            ],
            accounts: [
                {
                    name: "nonce",
                    writable: true
                },
                {
                    name: "to",
                    writable: true
                },
                {
                    name: "recentBlockhashes"
                },
                {
                    name: "rent",
                    address: "SysvarRent111111111111111111111111111111111"
                },
                {
                    name: "authorized",
                    signer: true
                }
            ],
            args: [
                {
                    name: "lamports",
                    type: "u64"
                }
            ]
        }
    ],
    accounts: [
        {
            name: "nonce",
            discriminator: []
        }
    ],
    types: [
        {
            name: "feeCalculator",
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "lamportsPerSignature",
                        type: "u64"
                    }
                ]
            }
        },
        {
            name: "nonce",
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "version",
                        type: "u32"
                    },
                    {
                        name: "state",
                        type: "u32"
                    },
                    {
                        name: "authorizedPubkey",
                        type: "pubkey"
                    },
                    {
                        name: "nonce",
                        type: "pubkey"
                    },
                    {
                        name: "feeCalculator",
                        type: {
                            defined: {
                                name: "feeCalculator"
                            }
                        }
                    }
                ]
            }
        }
    ]
}; //# sourceMappingURL=system.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/native/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Native",
    ()=>Native
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$native$2f$system$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/native/system.js [app-ssr] (ecmascript)");
;
class Native {
    static system(provider) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$native$2f$system$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["program"])(provider);
    }
} //# sourceMappingURL=index.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/workspace.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$toml$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/toml/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$camelcase$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/camelcase/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/common.js [app-ssr] (ecmascript)");
;
;
;
;
/**
 * The `workspace` namespace provides a convenience API to automatically
 * search for and deserialize [[Program]] objects defined by compiled IDLs
 * in an Anchor workspace.
 *
 * This API is for Node only.
 */ const workspace = new Proxy({}, {
    get (workspaceCache, programName) {
        var _a, _b;
        if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isBrowser"]) {
            throw new Error("Workspaces aren't available in the browser");
        }
        // Converting `programName` to camelCase enables the ability to use any
        // of the following to access the workspace program:
        // `workspace.myProgram`, `workspace.MyProgram`, `workspace["my-program"]`...
        programName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$camelcase$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(programName);
        // Return early if the program is in cache
        if (workspaceCache[programName]) return workspaceCache[programName];
        const fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
        const path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
        // Override the workspace programs if the user put them in the config.
        const anchorToml = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$toml$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parse"](fs.readFileSync("Anchor.toml"));
        const clusterId = anchorToml.provider.cluster;
        const programs = (_a = anchorToml.programs) === null || _a === void 0 ? void 0 : _a[clusterId];
        let programEntry;
        if (programs) {
            programEntry = (_b = Object.entries(programs).find(([key])=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$camelcase$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(key) === programName)) === null || _b === void 0 ? void 0 : _b[1];
        }
        let idlPath;
        let programId;
        if (typeof programEntry === "object" && programEntry.idl) {
            idlPath = programEntry.idl;
            programId = programEntry.address;
        } else {
            // Assuming the IDL file's name to be the snake_case name of the
            // `programName` with `.json` extension results in problems when
            // numbers are involved due to the nature of case conversion from
            // camelCase to snake_case being lossy.
            //
            // To avoid the above problem with numbers, read the `idl` directory and
            // compare the camelCased  version of both file names and `programName`.
            const idlDirPath = path.join("target", "idl");
            const fileName = fs.readdirSync(idlDirPath).find((name)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$camelcase$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(path.parse(name).name) === programName);
            if (!fileName) {
                throw new Error(`Failed to find IDL of program \`${programName}\``);
            }
            idlPath = path.join(idlDirPath, fileName);
        }
        if (!fs.existsSync(idlPath)) {
            throw new Error(`${idlPath} doesn't exist. Did you run \`anchor build\`?`);
        }
        const idl = JSON.parse(fs.readFileSync(idlPath));
        if (programId) {
            idl.address = programId;
        }
        workspaceCache[programName] = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Program"](idl);
        return workspaceCache[programName];
    }
});
const __TURBOPACK__default__export__ = workspace;
 //# sourceMappingURL=workspace.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/common.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/bn.js/lib/bn.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/web3.js/lib/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/error.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$coder$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/coder/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/utils/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$native$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/native/index.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
if (!__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$utils$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isBrowser"]) {
    exports.workspace = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/workspace.js [app-ssr] (ecmascript)").default;
    exports.Wallet = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/nodewallet.js [app-ssr] (ecmascript)").default;
} //# sourceMappingURL=index.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/namespace/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccountClient",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$account$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AccountClient"],
    "MethodsBuilderFactory",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$methods$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MethodsBuilderFactory"],
    "default",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/namespace/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$account$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/namespace/account.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$methods$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/namespace/methods.js [app-ssr] (ecmascript)");
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccountClient",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AccountClient"],
    "EventManager",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EventManager"],
    "EventParser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EventParser"],
    "MethodsBuilderFactory",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MethodsBuilderFactory"],
    "Program",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Program"],
    "parseIdlErrors",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseIdlErrors"],
    "splitArgsAndCtx",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["splitArgsAndCtx"],
    "toInstruction",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toInstruction"],
    "translateAddress",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translateAddress"],
    "validateAccounts",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateAccounts"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/common.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/context.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/event.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$namespace$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/esm/program/namespace/index.js [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=33bea_%40coral-xyz_anchor_dist_esm_c5320d98._.js.map