(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor/dist/browser/index.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccountClient",
    ()=>AccountClient,
    "AnchorError",
    ()=>AnchorError,
    "AnchorProvider",
    ()=>AnchorProvider,
    "BorshAccountsCoder",
    ()=>BorshAccountsCoder,
    "BorshCoder",
    ()=>BorshCoder,
    "BorshEventCoder",
    ()=>BorshEventCoder,
    "BorshInstructionCoder",
    ()=>BorshInstructionCoder,
    "EventManager",
    ()=>EventManager,
    "EventParser",
    ()=>EventParser,
    "IdlError",
    ()=>IdlError,
    "LangErrorCode",
    ()=>LangErrorCode,
    "LangErrorMessage",
    ()=>LangErrorMessage,
    "MethodsBuilderFactory",
    ()=>MethodsBuilderFactory,
    "Native",
    ()=>Native,
    "Program",
    ()=>Program,
    "ProgramError",
    ()=>ProgramError,
    "ProgramErrorStack",
    ()=>ProgramErrorStack,
    "SystemCoder",
    ()=>SystemCoder,
    "getProvider",
    ()=>getProvider,
    "parseIdlErrors",
    ()=>parseIdlErrors,
    "setProvider",
    ()=>setProvider,
    "splitArgsAndCtx",
    ()=>splitArgsAndCtx,
    "toInstruction",
    ()=>toInstruction,
    "translateAddress",
    ()=>translateAddress,
    "translateError",
    ()=>translateError,
    "utils",
    ()=>index,
    "validateAccounts",
    ()=>validateAccounts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/bn.js/lib/bn.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/web3.js/lib/index.browser.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/buffer/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bs58$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/bs58/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$camelcase$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/camelcase/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/borsh/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha256$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@noble/hashes/esm/sha256.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$pako$2f$dist$2f$pako$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/pako/dist/pako.esm.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$eventemitter3$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/eventemitter3/index.js [app-client] (ecmascript)");
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
/**
 * Splits an array into chunks
 *
 * @param array Array of objects to chunk.
 * @param size The max size of a chunk.
 * @returns A two dimensional array where each T[] length is < the provided size.
 */ function chunks(array, size) {
    return Array.apply(0, new Array(Math.ceil(array.length / size))).map((_, index)=>array.slice(index * size, (index + 1) * size));
}
/**
 * Check if a transaction object is a VersionedTransaction or not
 *
 * @param tx
 * @returns bool
 */ const isVersionedTransaction = (tx)=>{
    return "version" in tx;
};
function encode$3(data) {
    return data.reduce((str, byte)=>str + byte.toString(16).padStart(2, "0"), "0x");
}
function decode$3(data) {
    if (data.indexOf("0x") === 0) {
        data = data.substr(2);
    }
    if (data.length % 2 === 1) {
        data = "0" + data;
    }
    let key = data.match(/.{2}/g);
    if (key === null) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from([]);
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(key.map((byte)=>parseInt(byte, 16)));
}
var hex = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    encode: encode$3,
    decode: decode$3
});
function decode$2(array) {
    const decoder = new TextDecoder("utf-8") // Browser https://caniuse.com/textencoder.
    ; // Node.
    return decoder.decode(array);
}
function encode$2(input) {
    const encoder = new TextEncoder() // Browser.
    ; // Node.
    return encoder.encode(input);
}
var utf8 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    decode: decode$2,
    encode: encode$2
});
function encode$1(data) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bs58$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].encode(data);
}
function decode$1(data) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bs58$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].decode(data);
}
var bs58 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    encode: encode$1,
    decode: decode$1
});
function encode(data) {
    return data.toString("base64");
}
function decode(data) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(data, "base64");
}
var base64 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    encode: encode,
    decode: decode
});
var index$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    hex: hex,
    utf8: utf8,
    bs58: bs58,
    base64: base64
});
function isCompositeAccounts(accountItem) {
    return "accounts" in accountItem;
}
// Deterministic IDL address as a function of the program id.
async function idlAddress(programId) {
    const base = (await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"].findProgramAddress([], programId))[0];
    return await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"].createWithSeed(base, seed(), programId);
}
// Seed for generating the idlAddress.
function seed() {
    return "anchor:idl";
}
const IDL_ACCOUNT_LAYOUT = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["struct"]([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["publicKey"]("authority"),
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["vecU8"]("data")
]);
function decodeIdlAccount(data) {
    return IDL_ACCOUNT_LAYOUT.decode(data);
}
/**
 * Convert the given IDL to camelCase.
 *
 * The IDL is generated from Rust which has different conventions compared to
 * JS/TS, e.g. instruction names in Rust are snake_case.
 *
 * The conversion happens automatically for programs, however, if you are using
 * internals such as `BorshInstructionCoder` and you only have the original
 * (not camelCase) IDL, you might need to use this function.
 *
 * @param idl IDL to convert to camelCase
 * @returns camelCase version of the IDL
 */ function convertIdlToCamelCase(idl) {
    const KEYS_TO_CONVERT = [
        "name",
        "path",
        "account",
        "relations",
        "generic"
    ];
    // `my_account.field` is getting converted to `myAccountField` but we
    // need `myAccount.field`.
    const toCamelCase = (s)=>s.split(".").map(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$camelcase$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]).join(".");
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
/** Conveniently handle all defined field kinds with proper type support. */ function handleDefinedFields(fields, unitCb, namedCb, tupleCb) {
    // Unit
    if (!(fields === null || fields === void 0 ? void 0 : fields.length)) return unitCb();
    // Named
    if (fields[0].name) {
        return namedCb(fields);
    }
    // Tuple
    return tupleCb(fields);
}
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
function toInstruction(idlIx) {
    for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        args[_key - 1] = arguments[_key];
    }
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
// Throws error if any account required for the `ix` is not given.
function validateAccounts(ixAccounts) {
    let accounts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    ixAccounts.forEach((acc)=>{
        if (isCompositeAccounts(acc)) {
            validateAccounts(acc.accounts, accounts[acc.name]);
        } else {
            if (!accounts[acc.name]) {
                throw new Error("Account `".concat(acc.name, "` not provided."));
            }
        }
    });
}
// Translates an address to a Pubkey.
function translateAddress(address) {
    return address instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"] ? address : new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"](address);
}
/**
 * A `StructFailure` represents a single specific failure in validation.
 */ /**
 * `StructError` objects are thrown (or returned) when validation fails.
 *
 * Validation logic is design to exit early for maximum performance. The error
 * represents the first error encountered during validation. For more detail,
 * the `error.failures` property is a generator function that can be run to
 * continue validation and receive all the failures in the data.
 */ class StructError extends TypeError {
    constructor(failure, failures){
        let cached;
        const { message, ...rest } = failure;
        const { path } = failure;
        const msg = path.length === 0 ? message : "At path: " + path.join('.') + " -- " + message;
        super(msg);
        this.value = void 0;
        this.key = void 0;
        this.type = void 0;
        this.refinement = void 0;
        this.path = void 0;
        this.branch = void 0;
        this.failures = void 0;
        Object.assign(this, rest);
        this.name = this.constructor.name;
        this.failures = ()=>{
            var _cached;
            return (_cached = cached) != null ? _cached : cached = [
                failure,
                ...failures()
            ];
        };
    }
}
/**
 * Check if a value is an iterator.
 */ function isIterable(x) {
    return isObject(x) && typeof x[Symbol.iterator] === 'function';
}
/**
 * Check if a value is a plain object.
 */ function isObject(x) {
    return typeof x === 'object' && x != null;
}
/**
 * Return a value as a printable string.
 */ function print(value) {
    return typeof value === 'string' ? JSON.stringify(value) : "" + value;
}
/**
 * Shifts (removes and returns) the first value from the `input` iterator.
 * Like `Array.prototype.shift()` but for an `Iterator`.
 */ function shiftIterator(input) {
    const { done, value } = input.next();
    return done ? undefined : value;
}
/**
 * Convert a single validation result to a failure.
 */ function toFailure(result, context, struct, value) {
    if (result === true) {
        return;
    } else if (result === false) {
        result = {};
    } else if (typeof result === 'string') {
        result = {
            message: result
        };
    }
    const { path, branch } = context;
    const { type } = struct;
    const { refinement, message = "Expected a value of type `" + type + "`" + (refinement ? " with refinement `" + refinement + "`" : '') + ", but received: `" + print(value) + "`" } = result;
    return {
        value,
        type,
        refinement,
        key: path[path.length - 1],
        path,
        branch,
        ...result,
        message
    };
}
/**
 * Convert a validation result to an iterable of failures.
 */ function* toFailures(result, context, struct, value) {
    if (!isIterable(result)) {
        result = [
            result
        ];
    }
    for (const r of result){
        const failure = toFailure(r, context, struct, value);
        if (failure) {
            yield failure;
        }
    }
}
/**
 * Check a value against a struct, traversing deeply into nested values, and
 * returning an iterator of failures or success.
 */ function* run(value, struct, options) {
    if (options === void 0) {
        options = {};
    }
    const { path = [], branch = [
        value
    ], coerce = false, mask = false } = options;
    const ctx = {
        path,
        branch
    };
    if (coerce) {
        value = struct.coercer(value, ctx);
        if (mask && struct.type !== 'type' && isObject(struct.schema) && isObject(value) && !Array.isArray(value)) {
            for(const key in value){
                if (struct.schema[key] === undefined) {
                    delete value[key];
                }
            }
        }
    }
    let valid = true;
    for (const failure of struct.validator(value, ctx)){
        valid = false;
        yield [
            failure,
            undefined
        ];
    }
    for (let [k, v, s] of struct.entries(value, ctx)){
        const ts = run(v, s, {
            path: k === undefined ? path : [
                ...path,
                k
            ],
            branch: k === undefined ? branch : [
                ...branch,
                v
            ],
            coerce,
            mask
        });
        for (const t of ts){
            if (t[0]) {
                valid = false;
                yield [
                    t[0],
                    undefined
                ];
            } else if (coerce) {
                v = t[1];
                if (k === undefined) {
                    value = v;
                } else if (value instanceof Map) {
                    value.set(k, v);
                } else if (value instanceof Set) {
                    value.add(v);
                } else if (isObject(value)) {
                    value[k] = v;
                }
            }
        }
    }
    if (valid) {
        for (const failure of struct.refiner(value, ctx)){
            valid = false;
            yield [
                failure,
                undefined
            ];
        }
    }
    if (valid) {
        yield [
            undefined,
            value
        ];
    }
}
/**
 * `Struct` objects encapsulate the validation logic for a specific type of
 * values. Once constructed, you use the `assert`, `is` or `validate` helpers to
 * validate unknown input data against the struct.
 */ class Struct {
    /**
   * Assert that a value passes the struct's validation, throwing if it doesn't.
   */ assert(value) {
        return assert(value, this);
    }
    /**
   * Create a value with the struct's coercion logic, then validate it.
   */ create(value) {
        return create(value, this);
    }
    /**
   * Check if a value passes the struct's validation.
   */ is(value) {
        return is(value, this);
    }
    /**
   * Mask a value, coercing and validating it, but returning only the subset of
   * properties defined by the struct's schema.
   */ mask(value) {
        return mask(value, this);
    }
    /**
   * Validate a value with the struct's validation logic, returning a tuple
   * representing the result.
   *
   * You may optionally pass `true` for the `withCoercion` argument to coerce
   * the value before attempting to validate it. If you do, the result will
   * contain the coerced result when successful.
   */ validate(value, options) {
        if (options === void 0) {
            options = {};
        }
        return validate(value, this, options);
    }
    constructor(props){
        this.TYPE = void 0;
        this.type = void 0;
        this.schema = void 0;
        this.coercer = void 0;
        this.validator = void 0;
        this.refiner = void 0;
        this.entries = void 0;
        const { type, schema, validator, refiner, coercer = (value)=>value, entries = function*() {} } = props;
        this.type = type;
        this.schema = schema;
        this.entries = entries;
        this.coercer = coercer;
        if (validator) {
            this.validator = (value, context)=>{
                const result = validator(value, context);
                return toFailures(result, context, this, value);
            };
        } else {
            this.validator = ()=>[];
        }
        if (refiner) {
            this.refiner = (value, context)=>{
                const result = refiner(value, context);
                return toFailures(result, context, this, value);
            };
        } else {
            this.refiner = ()=>[];
        }
    }
}
/**
 * Assert that a value passes a struct, throwing if it doesn't.
 */ function assert(value, struct) {
    const result = validate(value, struct);
    if (result[0]) {
        throw result[0];
    }
}
/**
 * Create a value with the coercion logic of struct and validate it.
 */ function create(value, struct) {
    const result = validate(value, struct, {
        coerce: true
    });
    if (result[0]) {
        throw result[0];
    } else {
        return result[1];
    }
}
/**
 * Mask a value, returning only the subset of properties defined by a struct.
 */ function mask(value, struct) {
    const result = validate(value, struct, {
        coerce: true,
        mask: true
    });
    if (result[0]) {
        throw result[0];
    } else {
        return result[1];
    }
}
/**
 * Check if a value passes a struct.
 */ function is(value, struct) {
    const result = validate(value, struct);
    return !result[0];
}
/**
 * Validate a value against a struct, returning an error if invalid, or the
 * value (with potential coercion) if valid.
 */ function validate(value, struct, options) {
    if (options === void 0) {
        options = {};
    }
    const tuples = run(value, struct, options);
    const tuple = shiftIterator(tuples);
    if (tuple[0]) {
        const error = new StructError(tuple[0], function*() {
            for (const t of tuples){
                if (t[0]) {
                    yield t[0];
                }
            }
        });
        return [
            error,
            undefined
        ];
    } else {
        const v = tuple[1];
        return [
            undefined,
            v
        ];
    }
}
/**
 * Define a new struct type with a custom validation function.
 */ function define(name, validator) {
    return new Struct({
        type: name,
        schema: null,
        validator
    });
}
/**
 * Ensure that any value passes validation.
 */ function any() {
    return define('any', ()=>true);
}
function array(Element) {
    return new Struct({
        type: 'array',
        schema: Element,
        *entries (value) {
            if (Element && Array.isArray(value)) {
                for (const [i, v] of value.entries()){
                    yield [
                        i,
                        v,
                        Element
                    ];
                }
            }
        },
        coercer (value) {
            return Array.isArray(value) ? value.slice() : value;
        },
        validator (value) {
            return Array.isArray(value) || "Expected an array value, but received: " + print(value);
        }
    });
}
/**
 * Ensure that a value is a boolean.
 */ function boolean() {
    return define('boolean', (value)=>{
        return typeof value === 'boolean';
    });
}
function literal(constant) {
    const description = print(constant);
    const t = typeof constant;
    return new Struct({
        type: 'literal',
        schema: t === 'string' || t === 'number' || t === 'boolean' ? constant : null,
        validator (value) {
            return value === constant || "Expected the literal `" + description + "`, but received: " + print(value);
        }
    });
}
/**
 * Augment an existing struct to allow `null` values.
 */ function nullable(struct) {
    return new Struct({
        ...struct,
        validator: (value, ctx)=>value === null || struct.validator(value, ctx),
        refiner: (value, ctx)=>value === null || struct.refiner(value, ctx)
    });
}
/**
 * Ensure that a value is a number.
 */ function number() {
    return define('number', (value)=>{
        return typeof value === 'number' && !isNaN(value) || "Expected a number, but received: " + print(value);
    });
}
/**
 * Augment a struct to allow `undefined` values.
 */ function optional(struct) {
    return new Struct({
        ...struct,
        validator: (value, ctx)=>value === undefined || struct.validator(value, ctx),
        refiner: (value, ctx)=>value === undefined || struct.refiner(value, ctx)
    });
}
/**
 * Ensure that a value is a string.
 */ function string() {
    return define('string', (value)=>{
        return typeof value === 'string' || "Expected a string, but received: " + print(value);
    });
}
/**
 * Ensure that a value has a set of known properties of specific types.
 *
 * Note: Unrecognized properties are allowed and untouched. This is similar to
 * how TypeScript's structural typing works.
 */ function type(schema) {
    const keys = Object.keys(schema);
    return new Struct({
        type: 'type',
        schema,
        *entries (value) {
            if (isObject(value)) {
                for (const k of keys){
                    yield [
                        k,
                        value[k],
                        schema[k]
                    ];
                }
            }
        },
        validator (value) {
            return isObject(value) || "Expected an object, but received: " + print(value);
        }
    });
}
/**
 * Ensure that a value matches one of a set of types.
 */ function union$1(Structs) {
    const description = Structs.map((s)=>s.type).join(' | ');
    return new Struct({
        type: 'union',
        schema: null,
        coercer (value, ctx) {
            const firstMatch = Structs.find((s)=>{
                const [e] = s.validate(value, {
                    coerce: true
                });
                return !e;
            }) || unknown();
            return firstMatch.coercer(value, ctx);
        },
        validator (value, ctx) {
            const failures = [];
            for (const S of Structs){
                const [...tuples] = run(value, S, ctx);
                const [first] = tuples;
                if (!first[0]) {
                    return [];
                } else {
                    for (const [failure] of tuples){
                        if (failure) {
                            failures.push(failure);
                        }
                    }
                }
            }
            return [
                "Expected the value to satisfy a union of `" + description + "`, but received: " + print(value),
                ...failures
            ];
        }
    });
}
/**
 * Ensure that any value passes validation, without widening its type to `any`.
 */ function unknown() {
    return define('unknown', ()=>true);
}
/**
 * Augment a `Struct` to add an additional coercion step to its input.
 *
 * This allows you to transform input data before validating it, to increase the
 * likelihood that it passes validation—for example for default values, parsing
 * different formats, etc.
 *
 * Note: You must use `create(value, Struct)` on the value to have the coercion
 * take effect! Using simply `assert()` or `is()` will not use coercion.
 */ function coerce(struct, condition, coercer) {
    return new Struct({
        ...struct,
        coercer: (value, ctx)=>{
            return is(value, condition) ? struct.coercer(coercer(value, ctx), ctx) : struct.coercer(value, ctx);
        }
    });
}
/**
 * Sends a transaction to a program with the given accounts and instruction
 * data.
 */ async function invoke(programId, accounts, data, provider) {
    programId = translateAddress(programId);
    if (!provider) {
        provider = getProvider();
    }
    const tx = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transaction"]();
    tx.add(new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransactionInstruction"]({
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
        const batches = chunks(publicKeys, GET_MULTIPLE_ACCOUNTS_LIMIT);
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
// copy from @solana/web3.js that has a commitment param
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
    const res = create(unsafeRes, SimulatedTransactionResponseStruct);
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
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SendTransactionError"]("failed to simulate transaction: " + res.error.message, logs);
    }
    return res.result;
}
// copy from @solana/web3.js
function jsonRpcResult(schema) {
    return coerce(createRpcResult(schema), UnknownRpcResult, (value)=>{
        if ("error" in value) {
            return value;
        } else {
            return {
                ...value,
                result: create(value.result, schema)
            };
        }
    });
}
// copy from @solana/web3.js
const UnknownRpcResult = createRpcResult(unknown());
// copy from @solana/web3.js
function createRpcResult(result) {
    return union$1([
        type({
            jsonrpc: literal("2.0"),
            id: string(),
            result
        }),
        type({
            jsonrpc: literal("2.0"),
            id: string(),
            error: type({
                code: unknown(),
                message: string(),
                data: optional(any())
            })
        })
    ]);
}
// copy from @solana/web3.js
function jsonRpcResultAndContext(value) {
    return jsonRpcResult(type({
        context: type({
            slot: number()
        }),
        value
    }));
}
// copy from @solana/web3.js
const SimulatedTransactionResponseStruct = jsonRpcResultAndContext(type({
    err: nullable(union$1([
        type({}),
        string()
    ])),
    logs: nullable(array(string())),
    accounts: optional(nullable(array(nullable(type({
        executable: boolean(),
        owner: string(),
        lamports: number(),
        data: array(string()),
        rentEpoch: optional(number())
    }))))),
    unitsConsumed: optional(number())
}));
var rpc = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    invoke: invoke,
    getMultipleAccounts: getMultipleAccounts,
    getMultipleAccountsAndContext: getMultipleAccountsAndContext,
    simulateTransaction: simulateTransaction
});
/**
 * The network and wallet context used to send transactions paid for and signed
 * by the provider.
 */ class AnchorProvider {
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
     */ static local(url) {
        let opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : AnchorProvider.defaultOptions();
        {
            throw new Error("Provider local is not available on browser.");
        }
    }
    /**
     * Returns a `Provider` read from the `ANCHOR_PROVIDER_URL` environment
     * variable
     *
     * (This api is for Node only.)
     */ static env() {
        {
            throw new Error("Provider env is not available on browser.");
        }
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
        if (isVersionedTransaction(tx)) {
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
                const txSig = encode$1(isVersionedTransaction(tx) ? ((_b = tx.signatures) === null || _b === void 0 ? void 0 : _b[0]) || new Uint8Array() : (_c = tx.signature) !== null && _c !== void 0 ? _c : new Uint8Array());
                const maxVer = isVersionedTransaction(tx) ? 0 : undefined;
                const failedTx = await this.connection.getTransaction(txSig, {
                    commitment: "confirmed",
                    maxSupportedTransactionVersion: maxVer
                });
                if (!failedTx) {
                    throw err;
                } else {
                    const logs = (_d = failedTx.meta) === null || _d === void 0 ? void 0 : _d.logMessages;
                    throw !logs ? err : new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SendTransactionError"](err.message, logs);
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
            if (isVersionedTransaction(r.tx)) {
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
                    const txSig = encode$1(isVersionedTransaction(tx) ? ((_a = tx.signatures) === null || _a === void 0 ? void 0 : _a[0]) || new Uint8Array() : (_b = tx.signature) !== null && _b !== void 0 ? _b : new Uint8Array());
                    const maxVer = isVersionedTransaction(tx) ? 0 : undefined;
                    const failedTx = await this.connection.getTransaction(txSig, {
                        commitment: "confirmed",
                        maxSupportedTransactionVersion: maxVer
                    });
                    if (!failedTx) {
                        throw err;
                    } else {
                        const logs = (_c = failedTx.meta) === null || _c === void 0 ? void 0 : _c.logMessages;
                        throw !logs ? err : new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SendTransactionError"](err.message, logs);
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
        if (isVersionedTransaction(tx)) {
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
            result = await simulateTransaction(this.connection, tx, signers, commitment, includeAccounts);
        }
        if (result.value.err) {
            throw new SimulateError(result.value);
        }
        return result.value;
    }
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
                throw new ConfirmError("Raw transaction ".concat(signature, " failed (").concat(JSON.stringify(status), ")"));
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
/**
 * Sets the default provider on the client.
 */ function setProvider(provider) {
    _provider = provider;
}
/**
 * Returns the default provider being used by the client.
 */ function getProvider() {
    if (_provider === null) {
        return AnchorProvider.local();
    }
    return _provider;
}
// Global provider used as the default when a provider is not given.
let _provider = null;
var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : ("TURBOPACK compile-time truthy", 1) ? /*TURBOPACK member replacement*/ __turbopack_context__.g : "TURBOPACK unreachable";
function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}
var dist = {};
// Instruction errors.
Object.defineProperty(dist, "__esModule", {
    value: true
});
var ANCHOR_ERROR__REQUIRE_EQ_VIOLATED = dist.ANCHOR_ERROR__REQUIRE_EQ_VIOLATED = ANCHOR_ERROR__REQUIRE_VIOLATED = dist.ANCHOR_ERROR__REQUIRE_VIOLATED = ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION_PROGRAM_ID = dist.ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION_PROGRAM_ID = ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION_AUTHORITY = dist.ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION_AUTHORITY = ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION = dist.ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION = ANCHOR_ERROR__CONSTRAINT_MINT_PERMANENT_DELEGATE_EXTENSION_DELEGATE = dist.ANCHOR_ERROR__CONSTRAINT_MINT_PERMANENT_DELEGATE_EXTENSION_DELEGATE = ANCHOR_ERROR__CONSTRAINT_MINT_PERMANENT_DELEGATE_EXTENSION = dist.ANCHOR_ERROR__CONSTRAINT_MINT_PERMANENT_DELEGATE_EXTENSION = ANCHOR_ERROR__CONSTRAINT_MINT_CLOSE_AUTHORITY_EXTENSION_AUTHORITY = dist.ANCHOR_ERROR__CONSTRAINT_MINT_CLOSE_AUTHORITY_EXTENSION_AUTHORITY = ANCHOR_ERROR__CONSTRAINT_MINT_CLOSE_AUTHORITY_EXTENSION = dist.ANCHOR_ERROR__CONSTRAINT_MINT_CLOSE_AUTHORITY_EXTENSION = ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION_METADATA_ADDRESS = dist.ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION_METADATA_ADDRESS = ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION_AUTHORITY = dist.ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION_AUTHORITY = ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION = dist.ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION = ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION_MEMBER_ADDRESS = dist.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION_MEMBER_ADDRESS = ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION_AUTHORITY = dist.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION_AUTHORITY = ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION = dist.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION = ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION_GROUP_ADDRESS = dist.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION_GROUP_ADDRESS = ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION_AUTHORITY = dist.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION_AUTHORITY = ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION = dist.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION = ANCHOR_ERROR__CONSTRAINT_ASSOCIATED_TOKEN_TOKEN_PROGRAM = dist.ANCHOR_ERROR__CONSTRAINT_ASSOCIATED_TOKEN_TOKEN_PROGRAM = ANCHOR_ERROR__CONSTRAINT_MINT_TOKEN_PROGRAM = dist.ANCHOR_ERROR__CONSTRAINT_MINT_TOKEN_PROGRAM = ANCHOR_ERROR__CONSTRAINT_TOKEN_TOKEN_PROGRAM = dist.ANCHOR_ERROR__CONSTRAINT_TOKEN_TOKEN_PROGRAM = ANCHOR_ERROR__CONSTRAINT_ACCOUNT_IS_NONE = dist.ANCHOR_ERROR__CONSTRAINT_ACCOUNT_IS_NONE = ANCHOR_ERROR__CONSTRAINT_SPACE = dist.ANCHOR_ERROR__CONSTRAINT_SPACE = ANCHOR_ERROR__CONSTRAINT_MINT_DECIMALS = dist.ANCHOR_ERROR__CONSTRAINT_MINT_DECIMALS = ANCHOR_ERROR__CONSTRAINT_MINT_FREEZE_AUTHORITY = dist.ANCHOR_ERROR__CONSTRAINT_MINT_FREEZE_AUTHORITY = ANCHOR_ERROR__CONSTRAINT_MINT_MINT_AUTHORITY = dist.ANCHOR_ERROR__CONSTRAINT_MINT_MINT_AUTHORITY = ANCHOR_ERROR__CONSTRAINT_TOKEN_OWNER = dist.ANCHOR_ERROR__CONSTRAINT_TOKEN_OWNER = ANCHOR_ERROR__CONSTRAINT_TOKEN_MINT = dist.ANCHOR_ERROR__CONSTRAINT_TOKEN_MINT = ANCHOR_ERROR__CONSTRAINT_ZERO = dist.ANCHOR_ERROR__CONSTRAINT_ZERO = ANCHOR_ERROR__CONSTRAINT_ADDRESS = dist.ANCHOR_ERROR__CONSTRAINT_ADDRESS = ANCHOR_ERROR__CONSTRAINT_CLOSE = dist.ANCHOR_ERROR__CONSTRAINT_CLOSE = ANCHOR_ERROR__CONSTRAINT_ASSOCIATED_INIT = dist.ANCHOR_ERROR__CONSTRAINT_ASSOCIATED_INIT = ANCHOR_ERROR__CONSTRAINT_ASSOCIATED = dist.ANCHOR_ERROR__CONSTRAINT_ASSOCIATED = ANCHOR_ERROR__CONSTRAINT_STATE = dist.ANCHOR_ERROR__CONSTRAINT_STATE = ANCHOR_ERROR__CONSTRAINT_EXECUTABLE = dist.ANCHOR_ERROR__CONSTRAINT_EXECUTABLE = ANCHOR_ERROR__CONSTRAINT_SEEDS = dist.ANCHOR_ERROR__CONSTRAINT_SEEDS = ANCHOR_ERROR__CONSTRAINT_RENT_EXEMPT = dist.ANCHOR_ERROR__CONSTRAINT_RENT_EXEMPT = ANCHOR_ERROR__CONSTRAINT_OWNER = dist.ANCHOR_ERROR__CONSTRAINT_OWNER = ANCHOR_ERROR__CONSTRAINT_RAW = dist.ANCHOR_ERROR__CONSTRAINT_RAW = ANCHOR_ERROR__CONSTRAINT_SIGNER = dist.ANCHOR_ERROR__CONSTRAINT_SIGNER = ANCHOR_ERROR__CONSTRAINT_HAS_ONE = dist.ANCHOR_ERROR__CONSTRAINT_HAS_ONE = ANCHOR_ERROR__CONSTRAINT_MUT = dist.ANCHOR_ERROR__CONSTRAINT_MUT = ANCHOR_ERROR__EVENT_INSTRUCTION_STUB = dist.ANCHOR_ERROR__EVENT_INSTRUCTION_STUB = ANCHOR_ERROR__IDL_ACCOUNT_NOT_EMPTY = dist.ANCHOR_ERROR__IDL_ACCOUNT_NOT_EMPTY = ANCHOR_ERROR__IDL_INSTRUCTION_INVALID_PROGRAM = dist.ANCHOR_ERROR__IDL_INSTRUCTION_INVALID_PROGRAM = ANCHOR_ERROR__IDL_INSTRUCTION_STUB = dist.ANCHOR_ERROR__IDL_INSTRUCTION_STUB = ANCHOR_ERROR__INSTRUCTION_DID_NOT_SERIALIZE = dist.ANCHOR_ERROR__INSTRUCTION_DID_NOT_SERIALIZE = ANCHOR_ERROR__INSTRUCTION_DID_NOT_DESERIALIZE = dist.ANCHOR_ERROR__INSTRUCTION_DID_NOT_DESERIALIZE = ANCHOR_ERROR__INSTRUCTION_FALLBACK_NOT_FOUND = dist.ANCHOR_ERROR__INSTRUCTION_FALLBACK_NOT_FOUND = ANCHOR_ERROR__INSTRUCTION_MISSING = dist.ANCHOR_ERROR__INSTRUCTION_MISSING = void 0;
var ANCHOR_ERROR__DEPRECATED = dist.ANCHOR_ERROR__DEPRECATED = ANCHOR_ERROR__INVALID_NUMERIC_CONVERSION = dist.ANCHOR_ERROR__INVALID_NUMERIC_CONVERSION = ANCHOR_ERROR__TRYING_TO_INIT_PAYER_AS_PROGRAM_ACCOUNT = dist.ANCHOR_ERROR__TRYING_TO_INIT_PAYER_AS_PROGRAM_ACCOUNT = ANCHOR_ERROR__DECLARED_PROGRAM_ID_MISMATCH = dist.ANCHOR_ERROR__DECLARED_PROGRAM_ID_MISMATCH = ANCHOR_ERROR__ACCOUNT_DUPLICATE_REALLOCS = dist.ANCHOR_ERROR__ACCOUNT_DUPLICATE_REALLOCS = ANCHOR_ERROR__ACCOUNT_REALLOC_EXCEEDS_LIMIT = dist.ANCHOR_ERROR__ACCOUNT_REALLOC_EXCEEDS_LIMIT = ANCHOR_ERROR__ACCOUNT_SYSVAR_MISMATCH = dist.ANCHOR_ERROR__ACCOUNT_SYSVAR_MISMATCH = ANCHOR_ERROR__ACCOUNT_NOT_ASSOCIATED_TOKEN_ACCOUNT = dist.ANCHOR_ERROR__ACCOUNT_NOT_ASSOCIATED_TOKEN_ACCOUNT = ANCHOR_ERROR__ACCOUNT_NOT_PROGRAM_DATA = dist.ANCHOR_ERROR__ACCOUNT_NOT_PROGRAM_DATA = ANCHOR_ERROR__ACCOUNT_NOT_INITIALIZED = dist.ANCHOR_ERROR__ACCOUNT_NOT_INITIALIZED = ANCHOR_ERROR__ACCOUNT_NOT_SYSTEM_OWNED = dist.ANCHOR_ERROR__ACCOUNT_NOT_SYSTEM_OWNED = ANCHOR_ERROR__ACCOUNT_NOT_SIGNER = dist.ANCHOR_ERROR__ACCOUNT_NOT_SIGNER = ANCHOR_ERROR__INVALID_PROGRAM_EXECUTABLE = dist.ANCHOR_ERROR__INVALID_PROGRAM_EXECUTABLE = ANCHOR_ERROR__INVALID_PROGRAM_ID = dist.ANCHOR_ERROR__INVALID_PROGRAM_ID = ANCHOR_ERROR__ACCOUNT_OWNED_BY_WRONG_PROGRAM = dist.ANCHOR_ERROR__ACCOUNT_OWNED_BY_WRONG_PROGRAM = ANCHOR_ERROR__ACCOUNT_NOT_MUTABLE = dist.ANCHOR_ERROR__ACCOUNT_NOT_MUTABLE = ANCHOR_ERROR__ACCOUNT_NOT_ENOUGH_KEYS = dist.ANCHOR_ERROR__ACCOUNT_NOT_ENOUGH_KEYS = ANCHOR_ERROR__ACCOUNT_DID_NOT_SERIALIZE = dist.ANCHOR_ERROR__ACCOUNT_DID_NOT_SERIALIZE = ANCHOR_ERROR__ACCOUNT_DID_NOT_DESERIALIZE = dist.ANCHOR_ERROR__ACCOUNT_DID_NOT_DESERIALIZE = ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_MISMATCH = dist.ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_MISMATCH = ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_NOT_FOUND = dist.ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_NOT_FOUND = ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_ALREADY_SET = dist.ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_ALREADY_SET = ANCHOR_ERROR__REQUIRE_GTE_VIOLATED = dist.ANCHOR_ERROR__REQUIRE_GTE_VIOLATED = ANCHOR_ERROR__REQUIRE_GT_VIOLATED = dist.ANCHOR_ERROR__REQUIRE_GT_VIOLATED = ANCHOR_ERROR__REQUIRE_KEYS_NEQ_VIOLATED = dist.ANCHOR_ERROR__REQUIRE_KEYS_NEQ_VIOLATED = ANCHOR_ERROR__REQUIRE_NEQ_VIOLATED = dist.ANCHOR_ERROR__REQUIRE_NEQ_VIOLATED = ANCHOR_ERROR__REQUIRE_KEYS_EQ_VIOLATED = dist.ANCHOR_ERROR__REQUIRE_KEYS_EQ_VIOLATED = void 0;
/** 8 byte instruction identifier not provided. */ var ANCHOR_ERROR__INSTRUCTION_MISSING = dist.ANCHOR_ERROR__INSTRUCTION_MISSING = 100;
/** Fallback functions are not supported. */ var ANCHOR_ERROR__INSTRUCTION_FALLBACK_NOT_FOUND = dist.ANCHOR_ERROR__INSTRUCTION_FALLBACK_NOT_FOUND = 101;
/** The program could not deserialize the given instruction. */ var ANCHOR_ERROR__INSTRUCTION_DID_NOT_DESERIALIZE = dist.ANCHOR_ERROR__INSTRUCTION_DID_NOT_DESERIALIZE = 102;
/** The program could not serialize the given instruction. */ var ANCHOR_ERROR__INSTRUCTION_DID_NOT_SERIALIZE = dist.ANCHOR_ERROR__INSTRUCTION_DID_NOT_SERIALIZE = 103;
// IDL instruction errors.
/** The program was compiled without idl instructions. */ var ANCHOR_ERROR__IDL_INSTRUCTION_STUB = dist.ANCHOR_ERROR__IDL_INSTRUCTION_STUB = 1000;
/** The transaction was given an invalid program for the IDL instruction. */ var ANCHOR_ERROR__IDL_INSTRUCTION_INVALID_PROGRAM = dist.ANCHOR_ERROR__IDL_INSTRUCTION_INVALID_PROGRAM = 1001;
/** IDL account must be empty in order to resize, try closing first. */ var ANCHOR_ERROR__IDL_ACCOUNT_NOT_EMPTY = dist.ANCHOR_ERROR__IDL_ACCOUNT_NOT_EMPTY = 1002;
// Event instructions.
/** The program was compiled without `event-cpi` feature. */ var ANCHOR_ERROR__EVENT_INSTRUCTION_STUB = dist.ANCHOR_ERROR__EVENT_INSTRUCTION_STUB = 1500;
// Constraint errors.
/** A mut constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_MUT = dist.ANCHOR_ERROR__CONSTRAINT_MUT = 2000;
/** A has one constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_HAS_ONE = dist.ANCHOR_ERROR__CONSTRAINT_HAS_ONE = 2001;
/** A signer constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_SIGNER = dist.ANCHOR_ERROR__CONSTRAINT_SIGNER = 2002;
/** A raw constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_RAW = dist.ANCHOR_ERROR__CONSTRAINT_RAW = 2003;
/** An owner constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_OWNER = dist.ANCHOR_ERROR__CONSTRAINT_OWNER = 2004;
/** A rent exemption constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_RENT_EXEMPT = dist.ANCHOR_ERROR__CONSTRAINT_RENT_EXEMPT = 2005;
/** A seeds constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_SEEDS = dist.ANCHOR_ERROR__CONSTRAINT_SEEDS = 2006;
/** An executable constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_EXECUTABLE = dist.ANCHOR_ERROR__CONSTRAINT_EXECUTABLE = 2007;
/** Deprecated Error, feel free to replace with something else. */ var ANCHOR_ERROR__CONSTRAINT_STATE = dist.ANCHOR_ERROR__CONSTRAINT_STATE = 2008;
/** An associated constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_ASSOCIATED = dist.ANCHOR_ERROR__CONSTRAINT_ASSOCIATED = 2009;
/** An associated init constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_ASSOCIATED_INIT = dist.ANCHOR_ERROR__CONSTRAINT_ASSOCIATED_INIT = 2010;
/** A close constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_CLOSE = dist.ANCHOR_ERROR__CONSTRAINT_CLOSE = 2011;
/** An address constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_ADDRESS = dist.ANCHOR_ERROR__CONSTRAINT_ADDRESS = 2012;
/** Expected zero account discriminant. */ var ANCHOR_ERROR__CONSTRAINT_ZERO = dist.ANCHOR_ERROR__CONSTRAINT_ZERO = 2013;
/** A token mint constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_TOKEN_MINT = dist.ANCHOR_ERROR__CONSTRAINT_TOKEN_MINT = 2014;
/** A token owner constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_TOKEN_OWNER = dist.ANCHOR_ERROR__CONSTRAINT_TOKEN_OWNER = 2015;
/** A mint mint authority constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_MINT_MINT_AUTHORITY = dist.ANCHOR_ERROR__CONSTRAINT_MINT_MINT_AUTHORITY = 2016;
/** A mint freeze authority constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_MINT_FREEZE_AUTHORITY = dist.ANCHOR_ERROR__CONSTRAINT_MINT_FREEZE_AUTHORITY = 2017;
/** A mint decimals constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_MINT_DECIMALS = dist.ANCHOR_ERROR__CONSTRAINT_MINT_DECIMALS = 2018;
/** A space constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_SPACE = dist.ANCHOR_ERROR__CONSTRAINT_SPACE = 2019;
/** A required account for the constraint is None. */ var ANCHOR_ERROR__CONSTRAINT_ACCOUNT_IS_NONE = dist.ANCHOR_ERROR__CONSTRAINT_ACCOUNT_IS_NONE = 2020;
/** A token account token program constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_TOKEN_TOKEN_PROGRAM = dist.ANCHOR_ERROR__CONSTRAINT_TOKEN_TOKEN_PROGRAM = 2021;
/** A mint token program constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_MINT_TOKEN_PROGRAM = dist.ANCHOR_ERROR__CONSTRAINT_MINT_TOKEN_PROGRAM = 2022;
/** An associated token account token program constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_ASSOCIATED_TOKEN_TOKEN_PROGRAM = dist.ANCHOR_ERROR__CONSTRAINT_ASSOCIATED_TOKEN_TOKEN_PROGRAM = 2023;
/** A group pointer extension constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION = dist.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION = 2024;
/** A group pointer extension authority constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION_AUTHORITY = dist.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION_AUTHORITY = 2025;
/** A group pointer extension group address constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION_GROUP_ADDRESS = dist.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION_GROUP_ADDRESS = 2026;
/** A group member pointer extension constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION = dist.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION = 2027;
/** A group member pointer extension authority constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION_AUTHORITY = dist.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION_AUTHORITY = 2028;
/** A group member pointer extension group address constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION_MEMBER_ADDRESS = dist.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION_MEMBER_ADDRESS = 2029;
/** A metadata pointer extension constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION = dist.ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION = 2030;
/** A metadata pointer extension authority constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION_AUTHORITY = dist.ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION_AUTHORITY = 2031;
/** A metadata pointer extension metadata address constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION_METADATA_ADDRESS = dist.ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION_METADATA_ADDRESS = 2032;
/** A close authority constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_MINT_CLOSE_AUTHORITY_EXTENSION = dist.ANCHOR_ERROR__CONSTRAINT_MINT_CLOSE_AUTHORITY_EXTENSION = 2033;
/** A close authority extension authority constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_MINT_CLOSE_AUTHORITY_EXTENSION_AUTHORITY = dist.ANCHOR_ERROR__CONSTRAINT_MINT_CLOSE_AUTHORITY_EXTENSION_AUTHORITY = 2034;
/** A permanent delegate extension constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_MINT_PERMANENT_DELEGATE_EXTENSION = dist.ANCHOR_ERROR__CONSTRAINT_MINT_PERMANENT_DELEGATE_EXTENSION = 2035;
/** A permanent delegate extension delegate constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_MINT_PERMANENT_DELEGATE_EXTENSION_DELEGATE = dist.ANCHOR_ERROR__CONSTRAINT_MINT_PERMANENT_DELEGATE_EXTENSION_DELEGATE = 2036;
/** A transfer hook extension constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION = dist.ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION = 2037;
/** A transfer hook extension authority constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION_AUTHORITY = dist.ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION_AUTHORITY = 2038;
/** A transfer hook extension transfer hook program id constraint was violated. */ var ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION_PROGRAM_ID = dist.ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION_PROGRAM_ID = 2039;
// Require errors.
/** A require expression was violated. */ var ANCHOR_ERROR__REQUIRE_VIOLATED = dist.ANCHOR_ERROR__REQUIRE_VIOLATED = 2500;
/** A require_eq expression was violated. */ ANCHOR_ERROR__REQUIRE_EQ_VIOLATED = dist.ANCHOR_ERROR__REQUIRE_EQ_VIOLATED = 2501;
/** A require_keys_eq expression was violated. */ var ANCHOR_ERROR__REQUIRE_KEYS_EQ_VIOLATED = dist.ANCHOR_ERROR__REQUIRE_KEYS_EQ_VIOLATED = 2502;
/** A require_neq expression was violated. */ var ANCHOR_ERROR__REQUIRE_NEQ_VIOLATED = dist.ANCHOR_ERROR__REQUIRE_NEQ_VIOLATED = 2503;
/** A require_keys_neq expression was violated. */ var ANCHOR_ERROR__REQUIRE_KEYS_NEQ_VIOLATED = dist.ANCHOR_ERROR__REQUIRE_KEYS_NEQ_VIOLATED = 2504;
/** A require_gt expression was violated. */ var ANCHOR_ERROR__REQUIRE_GT_VIOLATED = dist.ANCHOR_ERROR__REQUIRE_GT_VIOLATED = 2505;
/** A require_gte expression was violated. */ var ANCHOR_ERROR__REQUIRE_GTE_VIOLATED = dist.ANCHOR_ERROR__REQUIRE_GTE_VIOLATED = 2506;
// Account errors.
/** The account discriminator was already set on this account. */ var ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_ALREADY_SET = dist.ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_ALREADY_SET = 3000;
/** No 8 byte discriminator was found on the account. */ var ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_NOT_FOUND = dist.ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_NOT_FOUND = 3001;
/** 8 byte discriminator did not match what was expected. */ var ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_MISMATCH = dist.ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_MISMATCH = 3002;
/** Failed to deserialize the account. */ var ANCHOR_ERROR__ACCOUNT_DID_NOT_DESERIALIZE = dist.ANCHOR_ERROR__ACCOUNT_DID_NOT_DESERIALIZE = 3003;
/** Failed to serialize the account. */ var ANCHOR_ERROR__ACCOUNT_DID_NOT_SERIALIZE = dist.ANCHOR_ERROR__ACCOUNT_DID_NOT_SERIALIZE = 3004;
/** Not enough account keys given to the instruction. */ var ANCHOR_ERROR__ACCOUNT_NOT_ENOUGH_KEYS = dist.ANCHOR_ERROR__ACCOUNT_NOT_ENOUGH_KEYS = 3005;
/** The given account is not mutable. */ var ANCHOR_ERROR__ACCOUNT_NOT_MUTABLE = dist.ANCHOR_ERROR__ACCOUNT_NOT_MUTABLE = 3006;
/** The given account is owned by a different program than expected. */ var ANCHOR_ERROR__ACCOUNT_OWNED_BY_WRONG_PROGRAM = dist.ANCHOR_ERROR__ACCOUNT_OWNED_BY_WRONG_PROGRAM = 3007;
/** Program ID was not as expected. */ var ANCHOR_ERROR__INVALID_PROGRAM_ID = dist.ANCHOR_ERROR__INVALID_PROGRAM_ID = 3008;
/** Program account is not executable. */ var ANCHOR_ERROR__INVALID_PROGRAM_EXECUTABLE = dist.ANCHOR_ERROR__INVALID_PROGRAM_EXECUTABLE = 3009;
/** The given account did not sign. */ var ANCHOR_ERROR__ACCOUNT_NOT_SIGNER = dist.ANCHOR_ERROR__ACCOUNT_NOT_SIGNER = 3010;
/** The given account is not owned by the system program. */ var ANCHOR_ERROR__ACCOUNT_NOT_SYSTEM_OWNED = dist.ANCHOR_ERROR__ACCOUNT_NOT_SYSTEM_OWNED = 3011;
/** The program expected this account to be already initialized. */ var ANCHOR_ERROR__ACCOUNT_NOT_INITIALIZED = dist.ANCHOR_ERROR__ACCOUNT_NOT_INITIALIZED = 3012;
/** The given account is not a program data account. */ var ANCHOR_ERROR__ACCOUNT_NOT_PROGRAM_DATA = dist.ANCHOR_ERROR__ACCOUNT_NOT_PROGRAM_DATA = 3013;
/** The given account is not the associated token account. */ var ANCHOR_ERROR__ACCOUNT_NOT_ASSOCIATED_TOKEN_ACCOUNT = dist.ANCHOR_ERROR__ACCOUNT_NOT_ASSOCIATED_TOKEN_ACCOUNT = 3014;
/** The given public key does not match the required sysvar. */ var ANCHOR_ERROR__ACCOUNT_SYSVAR_MISMATCH = dist.ANCHOR_ERROR__ACCOUNT_SYSVAR_MISMATCH = 3015;
/** The account reallocation exceeds the MAX_PERMITTED_DATA_INCREASE limit. */ var ANCHOR_ERROR__ACCOUNT_REALLOC_EXCEEDS_LIMIT = dist.ANCHOR_ERROR__ACCOUNT_REALLOC_EXCEEDS_LIMIT = 3016;
/** The account was duplicated for more than one reallocation. */ var ANCHOR_ERROR__ACCOUNT_DUPLICATE_REALLOCS = dist.ANCHOR_ERROR__ACCOUNT_DUPLICATE_REALLOCS = 3017;
// Miscellaneous errors.
/** The declared program id does not match the actual program id. */ var ANCHOR_ERROR__DECLARED_PROGRAM_ID_MISMATCH = dist.ANCHOR_ERROR__DECLARED_PROGRAM_ID_MISMATCH = 4100;
/** You cannot/should not initialize the payer account as a program account. */ var ANCHOR_ERROR__TRYING_TO_INIT_PAYER_AS_PROGRAM_ACCOUNT = dist.ANCHOR_ERROR__TRYING_TO_INIT_PAYER_AS_PROGRAM_ACCOUNT = 4101;
/** The program could not perform the numeric conversion, out of range integral type conversion attempted. */ var ANCHOR_ERROR__INVALID_NUMERIC_CONVERSION = dist.ANCHOR_ERROR__INVALID_NUMERIC_CONVERSION = 4102;
// Deprecated errors.
/** The API being used is deprecated and should no longer be used. */ ANCHOR_ERROR__DEPRECATED = dist.ANCHOR_ERROR__DEPRECATED = 5000;
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
}
var features = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    set: set,
    isSet: isSet
});
class IdlError extends Error {
    constructor(message){
        super(message);
        this.name = "IdlError";
    }
}
class ProgramErrorStack {
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
            programStack.push(new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"](programKey));
        }
        return new ProgramErrorStack(programStack);
    }
    constructor(stack){
        this.stack = stack;
    }
}
class AnchorError extends Error {
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
                    new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"](leftPubkey),
                    new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"](rightPubkey)
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
}
// An error from a user defined program.
class ProgramError extends Error {
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
    constructor(code, msg, logs){
        super();
        this.code = code;
        this.msg = msg;
        this.logs = logs;
        if (logs) {
            this._programErrorStack = ProgramErrorStack.parse(logs);
        }
    }
}
function translateError(err, idlErrors) {
    if (isSet("debug-logs")) {
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
    InstructionMissing: ANCHOR_ERROR__INSTRUCTION_MISSING,
    InstructionFallbackNotFound: ANCHOR_ERROR__INSTRUCTION_FALLBACK_NOT_FOUND,
    InstructionDidNotDeserialize: ANCHOR_ERROR__INSTRUCTION_DID_NOT_DESERIALIZE,
    InstructionDidNotSerialize: ANCHOR_ERROR__INSTRUCTION_DID_NOT_SERIALIZE,
    // IDL instructions.
    IdlInstructionStub: ANCHOR_ERROR__IDL_INSTRUCTION_STUB,
    IdlInstructionInvalidProgram: ANCHOR_ERROR__IDL_INSTRUCTION_INVALID_PROGRAM,
    IdlAccountNotEmpty: ANCHOR_ERROR__IDL_ACCOUNT_NOT_EMPTY,
    // Event instructions.
    EventInstructionStub: ANCHOR_ERROR__EVENT_INSTRUCTION_STUB,
    // Constraints.
    ConstraintMut: ANCHOR_ERROR__CONSTRAINT_MUT,
    ConstraintHasOne: ANCHOR_ERROR__CONSTRAINT_HAS_ONE,
    ConstraintSigner: ANCHOR_ERROR__CONSTRAINT_SIGNER,
    ConstraintRaw: ANCHOR_ERROR__CONSTRAINT_RAW,
    ConstraintOwner: ANCHOR_ERROR__CONSTRAINT_OWNER,
    ConstraintRentExempt: ANCHOR_ERROR__CONSTRAINT_RENT_EXEMPT,
    ConstraintSeeds: ANCHOR_ERROR__CONSTRAINT_SEEDS,
    ConstraintExecutable: ANCHOR_ERROR__CONSTRAINT_EXECUTABLE,
    ConstraintState: ANCHOR_ERROR__CONSTRAINT_STATE,
    ConstraintAssociated: ANCHOR_ERROR__CONSTRAINT_ASSOCIATED,
    ConstraintAssociatedInit: ANCHOR_ERROR__CONSTRAINT_ASSOCIATED_INIT,
    ConstraintClose: ANCHOR_ERROR__CONSTRAINT_CLOSE,
    ConstraintAddress: ANCHOR_ERROR__CONSTRAINT_ADDRESS,
    ConstraintZero: ANCHOR_ERROR__CONSTRAINT_ZERO,
    ConstraintTokenMint: ANCHOR_ERROR__CONSTRAINT_TOKEN_MINT,
    ConstraintTokenOwner: ANCHOR_ERROR__CONSTRAINT_TOKEN_OWNER,
    ConstraintMintMintAuthority: ANCHOR_ERROR__CONSTRAINT_MINT_MINT_AUTHORITY,
    ConstraintMintFreezeAuthority: ANCHOR_ERROR__CONSTRAINT_MINT_FREEZE_AUTHORITY,
    ConstraintMintDecimals: ANCHOR_ERROR__CONSTRAINT_MINT_DECIMALS,
    ConstraintSpace: ANCHOR_ERROR__CONSTRAINT_SPACE,
    ConstraintAccountIsNone: ANCHOR_ERROR__CONSTRAINT_ACCOUNT_IS_NONE,
    ConstraintTokenTokenProgram: ANCHOR_ERROR__CONSTRAINT_TOKEN_TOKEN_PROGRAM,
    ConstraintMintTokenProgram: ANCHOR_ERROR__CONSTRAINT_MINT_TOKEN_PROGRAM,
    ConstraintAssociatedTokenTokenProgram: ANCHOR_ERROR__CONSTRAINT_ASSOCIATED_TOKEN_TOKEN_PROGRAM,
    ConstraintMintGroupPointerExtension: ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION,
    ConstraintMintGroupPointerExtensionAuthority: ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION_AUTHORITY,
    ConstraintMintGroupPointerExtensionGroupAddress: ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION_GROUP_ADDRESS,
    ConstraintMintGroupMemberPointerExtension: ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION,
    ConstraintMintGroupMemberPointerExtensionAuthority: ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION_AUTHORITY,
    ConstraintMintGroupMemberPointerExtensionMemberAddress: ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION_MEMBER_ADDRESS,
    ConstraintMintMetadataPointerExtension: ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION,
    ConstraintMintMetadataPointerExtensionAuthority: ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION_AUTHORITY,
    ConstraintMintMetadataPointerExtensionMetadataAddress: ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION_METADATA_ADDRESS,
    ConstraintMintCloseAuthorityExtension: ANCHOR_ERROR__CONSTRAINT_MINT_CLOSE_AUTHORITY_EXTENSION,
    ConstraintMintCloseAuthorityExtensionAuthority: ANCHOR_ERROR__CONSTRAINT_MINT_CLOSE_AUTHORITY_EXTENSION_AUTHORITY,
    ConstraintMintPermanentDelegateExtension: ANCHOR_ERROR__CONSTRAINT_MINT_PERMANENT_DELEGATE_EXTENSION,
    ConstraintMintPermanentDelegateExtensionDelegate: ANCHOR_ERROR__CONSTRAINT_MINT_PERMANENT_DELEGATE_EXTENSION_DELEGATE,
    ConstraintMintTransferHookExtension: ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION,
    ConstraintMintTransferHookExtensionAuthority: ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION_AUTHORITY,
    ConstraintMintTransferHookExtensionProgramId: ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION_PROGRAM_ID,
    // Require.
    RequireViolated: ANCHOR_ERROR__REQUIRE_VIOLATED,
    RequireEqViolated: ANCHOR_ERROR__REQUIRE_EQ_VIOLATED,
    RequireKeysEqViolated: ANCHOR_ERROR__REQUIRE_KEYS_EQ_VIOLATED,
    RequireNeqViolated: ANCHOR_ERROR__REQUIRE_NEQ_VIOLATED,
    RequireKeysNeqViolated: ANCHOR_ERROR__REQUIRE_KEYS_NEQ_VIOLATED,
    RequireGtViolated: ANCHOR_ERROR__REQUIRE_GT_VIOLATED,
    RequireGteViolated: ANCHOR_ERROR__REQUIRE_GTE_VIOLATED,
    // Accounts.
    AccountDiscriminatorAlreadySet: ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_ALREADY_SET,
    AccountDiscriminatorNotFound: ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_NOT_FOUND,
    AccountDiscriminatorMismatch: ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_MISMATCH,
    AccountDidNotDeserialize: ANCHOR_ERROR__ACCOUNT_DID_NOT_DESERIALIZE,
    AccountDidNotSerialize: ANCHOR_ERROR__ACCOUNT_DID_NOT_SERIALIZE,
    AccountNotEnoughKeys: ANCHOR_ERROR__ACCOUNT_NOT_ENOUGH_KEYS,
    AccountNotMutable: ANCHOR_ERROR__ACCOUNT_NOT_MUTABLE,
    AccountOwnedByWrongProgram: ANCHOR_ERROR__ACCOUNT_OWNED_BY_WRONG_PROGRAM,
    InvalidProgramId: ANCHOR_ERROR__INVALID_PROGRAM_ID,
    InvalidProgramExecutable: ANCHOR_ERROR__INVALID_PROGRAM_EXECUTABLE,
    AccountNotSigner: ANCHOR_ERROR__ACCOUNT_NOT_SIGNER,
    AccountNotSystemOwned: ANCHOR_ERROR__ACCOUNT_NOT_SYSTEM_OWNED,
    AccountNotInitialized: ANCHOR_ERROR__ACCOUNT_NOT_INITIALIZED,
    AccountNotProgramData: ANCHOR_ERROR__ACCOUNT_NOT_PROGRAM_DATA,
    AccountNotAssociatedTokenAccount: ANCHOR_ERROR__ACCOUNT_NOT_ASSOCIATED_TOKEN_ACCOUNT,
    AccountSysvarMismatch: ANCHOR_ERROR__ACCOUNT_SYSVAR_MISMATCH,
    AccountReallocExceedsLimit: ANCHOR_ERROR__ACCOUNT_REALLOC_EXCEEDS_LIMIT,
    AccountDuplicateReallocs: ANCHOR_ERROR__ACCOUNT_DUPLICATE_REALLOCS,
    // Miscellaneous
    DeclaredProgramIdMismatch: ANCHOR_ERROR__DECLARED_PROGRAM_ID_MISMATCH,
    TryingToInitPayerAsProgramAccount: ANCHOR_ERROR__TRYING_TO_INIT_PAYER_AS_PROGRAM_ACCOUNT,
    InvalidNumericConversion: ANCHOR_ERROR__INVALID_NUMERIC_CONVERSION,
    // Used for APIs that shouldn't be used anymore.
    Deprecated: ANCHOR_ERROR__DEPRECATED
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
]);
class IdlCoder {
    static fieldLayout(field) {
        let types = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [], genericArgs = arguments.length > 2 ? arguments[2] : void 0;
        const fieldName = field.name;
        switch(field.type){
            case "bool":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bool"](fieldName);
                }
            case "u8":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["u8"](fieldName);
                }
            case "i8":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i8"](fieldName);
                }
            case "u16":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["u16"](fieldName);
                }
            case "i16":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i16"](fieldName);
                }
            case "u32":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["u32"](fieldName);
                }
            case "i32":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i32"](fieldName);
                }
            case "f32":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["f32"](fieldName);
                }
            case "u64":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["u64"](fieldName);
                }
            case "i64":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i64"](fieldName);
                }
            case "f64":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["f64"](fieldName);
                }
            case "u128":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["u128"](fieldName);
                }
            case "i128":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i128"](fieldName);
                }
            case "u256":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["u256"](fieldName);
                }
            case "i256":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i256"](fieldName);
                }
            case "bytes":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["vecU8"](fieldName);
                }
            case "string":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["str"](fieldName);
                }
            case "pubkey":
                {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["publicKey"](fieldName);
                }
            default:
                {
                    if ("option" in field.type) {
                        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["option"](IdlCoder.fieldLayout({
                            type: field.type.option
                        }, types, genericArgs), fieldName);
                    }
                    if ("vec" in field.type) {
                        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["vec"](IdlCoder.fieldLayout({
                            type: field.type.vec
                        }, types, genericArgs), fieldName);
                    }
                    if ("array" in field.type) {
                        let [type, len] = field.type.array;
                        len = IdlCoder.resolveArrayLen(len, genericArgs);
                        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["array"](IdlCoder.fieldLayout({
                            type
                        }, types, genericArgs), len, fieldName);
                    }
                    if ("defined" in field.type) {
                        if (!types) {
                            throw new IdlError("User defined types not provided");
                        }
                        const definedName = field.type.defined.name;
                        const typeDef = types.find((t)=>t.name === definedName);
                        if (!typeDef) {
                            throw new IdlError("Type not found: ".concat(field.name));
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
                            throw new IdlError("Invalid generic field: ".concat(field.name));
                        }
                        return IdlCoder.fieldLayout({
                            ...field,
                            type: genericArg.type
                        }, types);
                    }
                    throw new IdlError("Not yet implemented: ".concat(JSON.stringify(field.type)));
                }
        }
    }
    /**
     * Get the type layout of the given defined type(struct or enum).
     */ static typeDefLayout(param) {
        let { typeDef, types, name, genericArgs } = param;
        switch(typeDef.type.kind){
            case "struct":
                {
                    const fieldLayouts = handleDefinedFields(typeDef.type.fields, ()=>[], (fields)=>fields.map((f)=>{
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
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["struct"](fieldLayouts, name);
                }
            case "enum":
                {
                    const variants = typeDef.type.variants.map((variant)=>{
                        const fieldLayouts = handleDefinedFields(variant.fields, ()=>[], (fields)=>fields.map((f)=>{
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
                        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["struct"](fieldLayouts, variant.name);
                    });
                    if (name !== undefined) {
                        // Buffer-layout lib requires the name to be null (on construction)
                        // when used as a field.
                        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rustEnum"](variants).replicate(name);
                    }
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rustEnum"](variants, name);
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
                        throw new IdlError("Type not found: ".concat(JSON.stringify(ty)));
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
                                return handleDefinedFields(typeDef.type.fields, ()=>[
                                        0
                                    ], (fields)=>fields.map((f)=>typeSize(f.type)), (fields)=>fields.map((f)=>typeSize(f))).reduce((acc, size)=>acc + size, 0);
                            }
                        case "enum":
                            {
                                const variantSizes = typeDef.type.variants.map((variant)=>{
                                    return handleDefinedFields(variant.fields, ()=>[
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
                        throw new IdlError("Invalid generic: ".concat(ty.generic));
                    }
                    return IdlCoder.typeSize(genericArg.type, idl, genericArgs);
                }
                throw new Error("Invalid type ".concat(JSON.stringify(ty)));
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
            throw new IdlError("Generic array length did not resolve");
        }
        return len;
    }
    /**
     * Recursively resolve generic arguments i.e. replace all generics with the
     * actual type that they hold based on the initial `genericArgs` given.
     */ static resolveGenericArgs(param) {
        let { type, typeDef, genericArgs, isDefined } = param;
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
}
/**
 * Encodes and decodes program instructions.
 */ class BorshInstructionCoder {
    /**
     * Encodes a program instruction.
     */ encode(ixName, ix) {
        const buffer = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].alloc(1000); // TODO: use a tighter buffer.
        const encoder = this.ixLayouts.get(ixName);
        if (!encoder) {
            throw new Error("Unknown method: ".concat(ixName));
        }
        const len = encoder.layout.encode(ix, buffer);
        const data = buffer.slice(0, len);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].concat([
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(encoder.discriminator),
            data
        ]);
    }
    /**
     * Decodes a program instruction.
     */ decode(ix) {
        let encoding = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "hex";
        if (typeof ix === "string") {
            ix = encoding === "hex" ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(ix, "hex") : __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bs58$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].decode(ix);
        }
        for (const [name, layout] of this.ixLayouts){
            const givenDisc = ix.subarray(0, layout.discriminator.length);
            const matches = givenDisc.equals(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(layout.discriminator));
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
    constructor(idl){
        this.idl = idl;
        const ixLayouts = idl.instructions.map((ix)=>{
            const name = ix.name;
            const fieldLayouts = ix.args.map((arg)=>IdlCoder.fieldLayout(arg, idl.types));
            const layout = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["struct"](fieldLayouts, name);
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
            return "Option<".concat(this.formatIdlType(idlType.option), ">");
        }
        if ("coption" in idlType) {
            return "COption<".concat(this.formatIdlType(idlType.coption), ">");
        }
        if ("vec" in idlType) {
            return "Vec<".concat(this.formatIdlType(idlType.vec), ">");
        }
        if ("array" in idlType) {
            return "Array<".concat(idlType.array[0], "; ").concat(idlType.array[1], ">");
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
                return "".concat(name, "<").concat(generics, ">");
            }
            return name;
        }
        throw new Error("Unknown IDL type: ".concat(idlType));
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
                throw new Error("Type not found: ".concat(definedName));
            }
            return InstructionFormatter.formatIdlDataDefined(typeDef, data, types);
        }
        return "unknown";
    }
    static formatIdlDataDefined(typeDef, data, types) {
        switch(typeDef.type.kind){
            case "struct":
                {
                    return "{ " + handleDefinedFields(typeDef.type.fields, ()=>"", (fields)=>{
                        return Object.entries(data).map((param)=>{
                            let [key, val] = param;
                            const field = fields.find((f)=>f.name === key);
                            if (!field) {
                                throw new Error("Field not found: ".concat(key));
                            }
                            return key + ": " + InstructionFormatter.formatIdlData(field, val, types);
                        }).join(", ");
                    }, (fields)=>{
                        return Object.entries(data).map((param)=>{
                            let [key, val] = param;
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
                        throw new Error("Unable to find variant: ".concat(variantName));
                    }
                    const enumValue = data[variantName];
                    return handleDefinedFields(variant.fields, ()=>variantName, (fields)=>{
                        const namedFields = Object.keys(enumValue).map((f)=>{
                            const fieldData = enumValue[f];
                            const idlField = fields.find((v)=>v.name === f);
                            if (!idlField) {
                                throw new Error("Field not found: ".concat(f));
                            }
                            return f + ": " + InstructionFormatter.formatIdlData(idlField, fieldData, types);
                        }).join(", ");
                        return "".concat(variantName, " { ").concat(namedFields, " }");
                    }, (fields)=>{
                        const tupleFields = Object.entries(enumValue).map((param)=>{
                            let [key, val] = param;
                            return key + ": " + InstructionFormatter.formatIdlData({
                                name: "",
                                type: fields[key]
                            }, val, types);
                        }).join(", ");
                        return "".concat(variantName, " { ").concat(tupleFields, " }");
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
                const newPrefix = prefix ? "".concat(prefix, " > ").concat(accName) : accName;
                return InstructionFormatter.flattenIdlAccounts(account.accounts, newPrefix);
            } else {
                return {
                    ...account,
                    name: prefix ? "".concat(prefix, " > ").concat(accName) : accName
                };
            }
        }).flat();
    }
}
function sentenceCase(field) {
    const result = field.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}
/**
 * Encodes and decodes account objects.
 */ class BorshAccountsCoder {
    async encode(accountName, account) {
        const buffer = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].alloc(1000); // TODO: use a tighter buffer.
        const layout = this.accountLayouts.get(accountName);
        if (!layout) {
            throw new Error("Unknown account: ".concat(accountName));
        }
        const len = layout.layout.encode(account, buffer);
        const accountData = buffer.slice(0, len);
        const discriminator = this.accountDiscriminator(accountName);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].concat([
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
            const matches = givenDisc.equals(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(layout.discriminator));
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
            throw new Error("Unknown account: ".concat(accountName));
        }
        return layout.layout.decode(data);
    }
    memcmp(accountName, appendData) {
        const discriminator = this.accountDiscriminator(accountName);
        return {
            offset: 0,
            bytes: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bs58$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].encode(appendData ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].concat([
                discriminator,
                appendData
            ]) : discriminator)
        };
    }
    size(accountName) {
        return this.accountDiscriminator(accountName).length + IdlCoder.typeSize({
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
            throw new Error("Account not found: ".concat(name));
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(account.discriminator);
    }
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
                throw new Error("Account not found: ".concat(acc.name));
            }
            return [
                acc.name,
                {
                    discriminator: acc.discriminator,
                    layout: IdlCoder.typeDefLayout({
                        typeDef,
                        types
                    })
                }
            ];
        });
        this.accountLayouts = new Map(layouts);
    }
}
class BorshEventCoder {
    decode(log) {
        let logArr;
        // This will throw if log length is not a multiple of 4.
        try {
            logArr = decode(log);
        } catch (e) {
            return null;
        }
        for (const [name, layout] of this.layouts){
            const givenDisc = logArr.subarray(0, layout.discriminator.length);
            const matches = givenDisc.equals(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(layout.discriminator));
            if (matches) {
                return {
                    name,
                    data: layout.layout.decode(logArr.subarray(givenDisc.length))
                };
            }
        }
        return null;
    }
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
                throw new Error("Event not found: ".concat(ev.name));
            }
            return [
                ev.name,
                {
                    discriminator: ev.discriminator,
                    layout: IdlCoder.typeDefLayout({
                        typeDef,
                        types
                    })
                }
            ];
        });
        this.layouts = new Map(layouts);
    }
}
/**
 * Encodes and decodes user-defined types.
 */ class BorshTypesCoder {
    encode(name, type) {
        const buffer = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].alloc(1000); // TODO: use a tighter buffer.
        const layout = this.typeLayouts.get(name);
        if (!layout) {
            throw new Error("Unknown type: ".concat(name));
        }
        const len = layout.encode(type, buffer);
        return buffer.slice(0, len);
    }
    decode(name, data) {
        const layout = this.typeLayouts.get(name);
        if (!layout) {
            throw new Error("Unknown type: ".concat(name));
        }
        return layout.decode(data);
    }
    constructor(idl){
        const types = idl.types;
        if (!types) {
            this.typeLayouts = new Map();
            return;
        }
        const layouts = types.filter((ty)=>!ty.generics).map((ty)=>[
                ty.name,
                IdlCoder.typeDefLayout({
                    typeDef: ty,
                    types
                })
            ]);
        this.typeLayouts = new Map(layouts);
    }
}
/**
 * BorshCoder is the default Coder for Anchor programs implementing the
 * borsh based serialization interface.
 */ class BorshCoder {
    constructor(idl){
        this.instruction = new BorshInstructionCoder(idl);
        this.accounts = new BorshAccountsCoder(idl);
        this.events = new BorshEventCoder(idl);
        this.types = new BorshTypesCoder(idl);
    }
}
/* The MIT License (MIT)
 *
 * Copyright 2015-2018 Peter A. Bigot
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */ /**
 * Base class for layout objects.
 *
 * **NOTE** This is an abstract base class; you can create instances
 * if it amuses you, but they won't support the {@link
 * Layout#encode|encode} or {@link Layout#decode|decode} functions.
 *
 * @param {Number} span - Initializer for {@link Layout#span|span}.  The
 * parameter must be an integer; a negative value signifies that the
 * span is {@link Layout#getSpan|value-specific}.
 *
 * @param {string} [property] - Initializer for {@link
 * Layout#property|property}.
 *
 * @abstract
 */ class Layout {
    /** Function to create an Object into which decoded properties will
   * be written.
   *
   * Used only for layouts that {@link Layout#decode|decode} to Object
   * instances, which means:
   * * {@link Structure}
   * * {@link Union}
   * * {@link VariantLayout}
   * * {@link BitStructure}
   *
   * If left undefined the JavaScript representation of these layouts
   * will be Object instances.
   *
   * See {@link bindConstructorLayout}.
   */ makeDestinationObject() {
        return {};
    }
    /**
   * Decode from a Buffer into an JavaScript value.
   *
   * @param {Buffer} b - the buffer from which encoded data is read.
   *
   * @param {Number} [offset] - the offset at which the encoded data
   * starts.  If absent a zero offset is inferred.
   *
   * @returns {(Number|Array|Object)} - the value of the decoded data.
   *
   * @abstract
   */ decode(b, offset) {
        throw new Error('Layout is abstract');
    }
    /**
   * Encode a JavaScript value into a Buffer.
   *
   * @param {(Number|Array|Object)} src - the value to be encoded into
   * the buffer.  The type accepted depends on the (sub-)type of {@link
   * Layout}.
   *
   * @param {Buffer} b - the buffer into which encoded data will be
   * written.
   *
   * @param {Number} [offset] - the offset at which the encoded data
   * starts.  If absent a zero offset is inferred.
   *
   * @returns {Number} - the number of bytes encoded, including the
   * space skipped for internal padding, but excluding data such as
   * {@link Sequence#count|lengths} when stored {@link
   * ExternalLayout|externally}.  This is the adjustment to `offset`
   * producing the offset where data for the next layout would be
   * written.
   *
   * @abstract
   */ encode(src, b, offset) {
        throw new Error('Layout is abstract');
    }
    /**
   * Calculate the span of a specific instance of a layout.
   *
   * @param {Buffer} b - the buffer that contains an encoded instance.
   *
   * @param {Number} [offset] - the offset at which the encoded instance
   * starts.  If absent a zero offset is inferred.
   *
   * @return {Number} - the number of bytes covered by the layout
   * instance.  If this method is not overridden in a subclass the
   * definition-time constant {@link Layout#span|span} will be
   * returned.
   *
   * @throws {RangeError} - if the length of the value cannot be
   * determined.
   */ getSpan(b, offset) {
        if (0 > this.span) {
            throw new RangeError('indeterminate span');
        }
        return this.span;
    }
    /**
   * Replicate the layout using a new property.
   *
   * This function must be used to get a structurally-equivalent layout
   * with a different name since all {@link Layout} instances are
   * immutable.
   *
   * **NOTE** This is a shallow copy.  All fields except {@link
   * Layout#property|property} are strictly equal to the origin layout.
   *
   * @param {String} property - the value for {@link
   * Layout#property|property} in the replica.
   *
   * @returns {Layout} - the copy with {@link Layout#property|property}
   * set to `property`.
   */ replicate(property) {
        const rv = Object.create(this.constructor.prototype);
        Object.assign(rv, this);
        rv.property = property;
        return rv;
    }
    /**
   * Create an object from layout properties and an array of values.
   *
   * **NOTE** This function returns `undefined` if invoked on a layout
   * that does not return its value as an Object.  Objects are
   * returned for things that are a {@link Structure}, which includes
   * {@link VariantLayout|variant layouts} if they are structures, and
   * excludes {@link Union}s.  If you want this feature for a union
   * you must use {@link Union.getVariant|getVariant} to select the
   * desired layout.
   *
   * @param {Array} values - an array of values that correspond to the
   * default order for properties.  As with {@link Layout#decode|decode}
   * layout elements that have no property name are skipped when
   * iterating over the array values.  Only the top-level properties are
   * assigned; arguments are not assigned to properties of contained
   * layouts.  Any unused values are ignored.
   *
   * @return {(Object|undefined)}
   */ fromArray(values) {
        return undefined;
    }
    constructor(span, property){
        if (!Number.isInteger(span)) {
            throw new TypeError('span must be an integer');
        }
        /** The span of the layout in bytes.
     *
     * Positive values are generally expected.
     *
     * Zero will only appear in {@link Constant}s and in {@link
     * Sequence}s where the {@link Sequence#count|count} is zero.
     *
     * A negative value indicates that the span is value-specific, and
     * must be obtained using {@link Layout#getSpan|getSpan}. */ this.span = span;
        /** The property name used when this layout is represented in an
     * Object.
     *
     * Used only for layouts that {@link Layout#decode|decode} to Object
     * instances.  If left undefined the span of the unnamed layout will
     * be treated as padding: it will not be mutated by {@link
     * Layout#encode|encode} nor represented as a property in the
     * decoded Object. */ this.property = property;
    }
}
var Layout_2 = Layout;
/* Provide text that carries a name (such as for a function that will
 * be throwing an error) annotated with the property of a given layout
 * (such as one for which the value was unacceptable).
 *
 * @ignore */ function nameWithProperty(name, lo) {
    if (lo.property) {
        return name + '[' + lo.property + ']';
    }
    return name;
}
/**
 * An object that behaves like a layout but does not consume space
 * within its containing layout.
 *
 * This is primarily used to obtain metadata about a member, such as a
 * {@link OffsetLayout} that can provide data about a {@link
 * Layout#getSpan|value-specific span}.
 *
 * **NOTE** This is an abstract base class; you can create instances
 * if it amuses you, but they won't support {@link
 * ExternalLayout#isCount|isCount} or other {@link Layout} functions.
 *
 * @param {Number} span - initializer for {@link Layout#span|span}.
 * The parameter can range from 1 through 6.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @abstract
 * @augments {Layout}
 */ class ExternalLayout extends Layout {
    /**
   * Return `true` iff the external layout decodes to an unsigned
   * integer layout.
   *
   * In that case it can be used as the source of {@link
   * Sequence#count|Sequence counts}, {@link Blob#length|Blob lengths},
   * or as {@link UnionLayoutDiscriminator#layout|external union
   * discriminators}.
   *
   * @abstract
   */ isCount() {
        throw new Error('ExternalLayout is abstract');
    }
}
/**
 * An {@link ExternalLayout} that supports accessing a {@link Layout}
 * at a fixed offset from the start of another Layout.  The offset may
 * be before, within, or after the base layout.
 *
 * *Factory*: {@link module:Layout.offset|offset}
 *
 * @param {Layout} layout - initializer for {@link
 * OffsetLayout#layout|layout}, modulo `property`.
 *
 * @param {Number} [offset] - Initializes {@link
 * OffsetLayout#offset|offset}.  Defaults to zero.
 *
 * @param {string} [property] - Optional new property name for a
 * {@link Layout#replicate| replica} of `layout` to be used as {@link
 * OffsetLayout#layout|layout}.  If not provided the `layout` is used
 * unchanged.
 *
 * @augments {Layout}
 */ class OffsetLayout extends ExternalLayout {
    /** @override */ isCount() {
        return this.layout instanceof UInt || this.layout instanceof UIntBE;
    }
    /** @override */ decode(b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        return this.layout.decode(b, offset + this.offset);
    }
    /** @override */ encode(src, b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        return this.layout.encode(src, b, offset + this.offset);
    }
    constructor(layout, offset, property){
        if (!(layout instanceof Layout)) {
            throw new TypeError('layout must be a Layout');
        }
        if (undefined === offset) {
            offset = 0;
        } else if (!Number.isInteger(offset)) {
            throw new TypeError('offset must be integer or undefined');
        }
        super(layout.span, property || layout.property);
        /** The subordinated layout. */ this.layout = layout;
        /** The location of {@link OffsetLayout#layout} relative to the
     * start of another layout.
     *
     * The value may be positive or negative, but an error will thrown
     * if at the point of use it goes outside the span of the Buffer
     * being accessed.  */ this.offset = offset;
    }
}
/**
 * Represent an unsigned integer in little-endian format.
 *
 * *Factory*: {@link module:Layout.u8|u8}, {@link
 *  module:Layout.u16|u16}, {@link module:Layout.u24|u24}, {@link
 *  module:Layout.u32|u32}, {@link module:Layout.u40|u40}, {@link
 *  module:Layout.u48|u48}
 *
 * @param {Number} span - initializer for {@link Layout#span|span}.
 * The parameter can range from 1 through 6.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */ class UInt extends Layout {
    /** @override */ decode(b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        return b.readUIntLE(offset, this.span);
    }
    /** @override */ encode(src, b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        b.writeUIntLE(src, offset, this.span);
        return this.span;
    }
    constructor(span, property){
        super(span, property);
        if (6 < this.span) {
            throw new RangeError('span must not exceed 6 bytes');
        }
    }
}
/**
 * Represent an unsigned integer in big-endian format.
 *
 * *Factory*: {@link module:Layout.u8be|u8be}, {@link
 * module:Layout.u16be|u16be}, {@link module:Layout.u24be|u24be},
 * {@link module:Layout.u32be|u32be}, {@link
 * module:Layout.u40be|u40be}, {@link module:Layout.u48be|u48be}
 *
 * @param {Number} span - initializer for {@link Layout#span|span}.
 * The parameter can range from 1 through 6.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */ class UIntBE extends Layout {
    /** @override */ decode(b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        return b.readUIntBE(offset, this.span);
    }
    /** @override */ encode(src, b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        b.writeUIntBE(src, offset, this.span);
        return this.span;
    }
    constructor(span, property){
        super(span, property);
        if (6 < this.span) {
            throw new RangeError('span must not exceed 6 bytes');
        }
    }
}
const V2E32 = Math.pow(2, 32);
/* True modulus high and low 32-bit words, where low word is always
 * non-negative. */ function divmodInt64(src) {
    const hi32 = Math.floor(src / V2E32);
    const lo32 = src - hi32 * V2E32;
    return {
        hi32,
        lo32
    };
}
/* Reconstruct Number from quotient and non-negative remainder */ function roundedInt64(hi32, lo32) {
    return hi32 * V2E32 + lo32;
}
/**
 * Represent an unsigned 64-bit integer in little-endian format when
 * encoded and as a near integral JavaScript Number when decoded.
 *
 * *Factory*: {@link module:Layout.nu64|nu64}
 *
 * **NOTE** Values with magnitude greater than 2^52 may not decode to
 * the exact value of the encoded representation.
 *
 * @augments {Layout}
 */ class NearUInt64 extends Layout {
    /** @override */ decode(b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        const lo32 = b.readUInt32LE(offset);
        const hi32 = b.readUInt32LE(offset + 4);
        return roundedInt64(hi32, lo32);
    }
    /** @override */ encode(src, b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        const split = divmodInt64(src);
        b.writeUInt32LE(split.lo32, offset);
        b.writeUInt32LE(split.hi32, offset + 4);
        return 8;
    }
    constructor(property){
        super(8, property);
    }
}
/**
 * Represent a signed 64-bit integer in little-endian format when
 * encoded and as a near integral JavaScript Number when decoded.
 *
 * *Factory*: {@link module:Layout.ns64|ns64}
 *
 * **NOTE** Values with magnitude greater than 2^52 may not decode to
 * the exact value of the encoded representation.
 *
 * @augments {Layout}
 */ class NearInt64 extends Layout {
    /** @override */ decode(b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        const lo32 = b.readUInt32LE(offset);
        const hi32 = b.readInt32LE(offset + 4);
        return roundedInt64(hi32, lo32);
    }
    /** @override */ encode(src, b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        const split = divmodInt64(src);
        b.writeUInt32LE(split.lo32, offset);
        b.writeInt32LE(split.hi32, offset + 4);
        return 8;
    }
    constructor(property){
        super(8, property);
    }
}
/**
 * Represent a contiguous sequence of arbitrary layout elements as an
 * Object.
 *
 * *Factory*: {@link module:Layout.struct|struct}
 *
 * **NOTE** The {@link Layout#span|span} of the structure is variable
 * if any layout in {@link Structure#fields|fields} has a variable
 * span.  When {@link Layout#encode|encoding} we must have a value for
 * all variable-length fields, or we wouldn't be able to figure out
 * how much space to use for storage.  We can only identify the value
 * for a field when it has a {@link Layout#property|property}.  As
 * such, although a structure may contain both unnamed fields and
 * variable-length fields, it cannot contain an unnamed
 * variable-length field.
 *
 * @param {Layout[]} fields - initializer for {@link
 * Structure#fields|fields}.  An error is raised if this contains a
 * variable-length field for which a {@link Layout#property|property}
 * is not defined.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @param {Boolean} [decodePrefixes] - initializer for {@link
 * Structure#decodePrefixes|property}.
 *
 * @throws {Error} - if `fields` contains an unnamed variable-length
 * layout.
 *
 * @augments {Layout}
 */ class Structure extends Layout {
    /** @override */ getSpan(b, offset) {
        if (0 <= this.span) {
            return this.span;
        }
        if (undefined === offset) {
            offset = 0;
        }
        let span = 0;
        try {
            span = this.fields.reduce((span, fd)=>{
                const fsp = fd.getSpan(b, offset);
                offset += fsp;
                return span + fsp;
            }, 0);
        } catch (e) {
            throw new RangeError('indeterminate span');
        }
        return span;
    }
    /** @override */ decode(b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        const dest = this.makeDestinationObject();
        for (const fd of this.fields){
            if (undefined !== fd.property) {
                dest[fd.property] = fd.decode(b, offset);
            }
            offset += fd.getSpan(b, offset);
            if (this.decodePrefixes && b.length === offset) {
                break;
            }
        }
        return dest;
    }
    /** Implement {@link Layout#encode|encode} for {@link Structure}.
   *
   * If `src` is missing a property for a member with a defined {@link
   * Layout#property|property} the corresponding region of the buffer is
   * left unmodified. */ encode(src, b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        const firstOffset = offset;
        let lastOffset = 0;
        let lastWrote = 0;
        for (const fd of this.fields){
            let span = fd.span;
            lastWrote = 0 < span ? span : 0;
            if (undefined !== fd.property) {
                const fv = src[fd.property];
                if (undefined !== fv) {
                    lastWrote = fd.encode(fv, b, offset);
                    if (0 > span) {
                        /* Read the as-encoded span, which is not necessarily the
             * same as what we wrote. */ span = fd.getSpan(b, offset);
                    }
                }
            }
            lastOffset = offset;
            offset += span;
        }
        /* Use (lastOffset + lastWrote) instead of offset because the last
     * item may have had a dynamic length and we don't want to include
     * the padding between it and the end of the space reserved for
     * it. */ return lastOffset + lastWrote - firstOffset;
    }
    /** @override */ fromArray(values) {
        const dest = this.makeDestinationObject();
        for (const fd of this.fields){
            if (undefined !== fd.property && 0 < values.length) {
                dest[fd.property] = values.shift();
            }
        }
        return dest;
    }
    /**
   * Get access to the layout of a given property.
   *
   * @param {String} property - the structure member of interest.
   *
   * @return {Layout} - the layout associated with `property`, or
   * undefined if there is no such property.
   */ layoutFor(property) {
        if ('string' !== typeof property) {
            throw new TypeError('property must be string');
        }
        for (const fd of this.fields){
            if (fd.property === property) {
                return fd;
            }
        }
    }
    /**
   * Get the offset of a structure member.
   *
   * @param {String} property - the structure member of interest.
   *
   * @return {Number} - the offset in bytes to the start of `property`
   * within the structure, or undefined if `property` is not a field
   * within the structure.  If the property is a member but follows a
   * variable-length structure member a negative number will be
   * returned.
   */ offsetOf(property) {
        if ('string' !== typeof property) {
            throw new TypeError('property must be string');
        }
        let offset = 0;
        for (const fd of this.fields){
            if (fd.property === property) {
                return offset;
            }
            if (0 > fd.span) {
                offset = -1;
            } else if (0 <= offset) {
                offset += fd.span;
            }
        }
    }
    constructor(fields, property, decodePrefixes){
        if (!(Array.isArray(fields) && fields.reduce((acc, v)=>acc && v instanceof Layout, true))) {
            throw new TypeError('fields must be array of Layout instances');
        }
        if ('boolean' === typeof property && undefined === decodePrefixes) {
            decodePrefixes = property;
            property = undefined;
        }
        /* Verify absence of unnamed variable-length fields. */ for (const fd of fields){
            if (0 > fd.span && undefined === fd.property) {
                throw new Error('fields cannot contain unnamed variable-length layout');
            }
        }
        let span = -1;
        try {
            span = fields.reduce((span, fd)=>span + fd.getSpan(), 0);
        } catch (e) {}
        super(span, property);
        /** The sequence of {@link Layout} values that comprise the
     * structure.
     *
     * The individual elements need not be the same type, and may be
     * either scalar or aggregate layouts.  If a member layout leaves
     * its {@link Layout#property|property} undefined the
     * corresponding region of the buffer associated with the element
     * will not be mutated.
     *
     * @type {Layout[]} */ this.fields = fields;
        /** Control behavior of {@link Layout#decode|decode()} given short
     * buffers.
     *
     * In some situations a structure many be extended with additional
     * fields over time, with older installations providing only a
     * prefix of the full structure.  If this property is `true`
     * decoding will accept those buffers and leave subsequent fields
     * undefined, as long as the buffer ends at a field boundary.
     * Defaults to `false`. */ this.decodePrefixes = !!decodePrefixes;
    }
}
/**
 * An object that can provide a {@link
 * Union#discriminator|discriminator} API for {@link Union}.
 *
 * **NOTE** This is an abstract base class; you can create instances
 * if it amuses you, but they won't support the {@link
 * UnionDiscriminator#encode|encode} or {@link
 * UnionDiscriminator#decode|decode} functions.
 *
 * @param {string} [property] - Default for {@link
 * UnionDiscriminator#property|property}.
 *
 * @abstract
 */ class UnionDiscriminator {
    /** Analog to {@link Layout#decode|Layout decode} for union discriminators.
   *
   * The implementation of this method need not reference the buffer if
   * variant information is available through other means. */ decode() {
        throw new Error('UnionDiscriminator is abstract');
    }
    /** Analog to {@link Layout#decode|Layout encode} for union discriminators.
   *
   * The implementation of this method need not store the value if
   * variant information is maintained through other means. */ encode() {
        throw new Error('UnionDiscriminator is abstract');
    }
    constructor(property){
        /** The {@link Layout#property|property} to be used when the
     * discriminator is referenced in isolation (generally when {@link
     * Union#decode|Union decode} cannot delegate to a specific
     * variant). */ this.property = property;
    }
}
/**
 * An object that can provide a {@link
 * UnionDiscriminator|discriminator API} for {@link Union} using an
 * unsigned integral {@link Layout} instance located either inside or
 * outside the union.
 *
 * @param {ExternalLayout} layout - initializes {@link
 * UnionLayoutDiscriminator#layout|layout}.  Must satisfy {@link
 * ExternalLayout#isCount|isCount()}.
 *
 * @param {string} [property] - Default for {@link
 * UnionDiscriminator#property|property}, superseding the property
 * from `layout`, but defaulting to `variant` if neither `property`
 * nor layout provide a property name.
 *
 * @augments {UnionDiscriminator}
 */ class UnionLayoutDiscriminator extends UnionDiscriminator {
    /** Delegate decoding to {@link UnionLayoutDiscriminator#layout|layout}. */ decode(b, offset) {
        return this.layout.decode(b, offset);
    }
    /** Delegate encoding to {@link UnionLayoutDiscriminator#layout|layout}. */ encode(src, b, offset) {
        return this.layout.encode(src, b, offset);
    }
    constructor(layout, property){
        if (!(layout instanceof ExternalLayout && layout.isCount())) {
            throw new TypeError('layout must be an unsigned integer ExternalLayout');
        }
        super(property || layout.property || 'variant');
        /** The {@link ExternalLayout} used to access the discriminator
     * value. */ this.layout = layout;
    }
}
/**
 * Represent any number of span-compatible layouts.
 *
 * *Factory*: {@link module:Layout.union|union}
 *
 * If the union has a {@link Union#defaultLayout|default layout} that
 * layout must have a non-negative {@link Layout#span|span}.  The span
 * of a fixed-span union includes its {@link
 * Union#discriminator|discriminator} if the variant is a {@link
 * Union#usesPrefixDiscriminator|prefix of the union}, plus the span
 * of its {@link Union#defaultLayout|default layout}.
 *
 * If the union does not have a default layout then the encoded span
 * of the union depends on the encoded span of its variant (which may
 * be fixed or variable).
 *
 * {@link VariantLayout#layout|Variant layout}s are added through
 * {@link Union#addVariant|addVariant}.  If the union has a default
 * layout, the span of the {@link VariantLayout#layout|layout
 * contained by the variant} must not exceed the span of the {@link
 * Union#defaultLayout|default layout} (minus the span of a {@link
 * Union#usesPrefixDiscriminator|prefix disriminator}, if used).  The
 * span of the variant will equal the span of the union itself.
 *
 * The variant for a buffer can only be identified from the {@link
 * Union#discriminator|discriminator} {@link
 * UnionDiscriminator#property|property} (in the case of the {@link
 * Union#defaultLayout|default layout}), or by using {@link
 * Union#getVariant|getVariant} and examining the resulting {@link
 * VariantLayout} instance.
 *
 * A variant compatible with a JavaScript object can be identified
 * using {@link Union#getSourceVariant|getSourceVariant}.
 *
 * @param {(UnionDiscriminator|ExternalLayout|Layout)} discr - How to
 * identify the layout used to interpret the union contents.  The
 * parameter must be an instance of {@link UnionDiscriminator}, an
 * {@link ExternalLayout} that satisfies {@link
 * ExternalLayout#isCount|isCount()}, or {@link UInt} (or {@link
 * UIntBE}).  When a non-external layout element is passed the layout
 * appears at the start of the union.  In all cases the (synthesized)
 * {@link UnionDiscriminator} instance is recorded as {@link
 * Union#discriminator|discriminator}.
 *
 * @param {(Layout|null)} defaultLayout - initializer for {@link
 * Union#defaultLayout|defaultLayout}.  If absent defaults to `null`.
 * If `null` there is no default layout: the union has data-dependent
 * length and attempts to decode or encode unrecognized variants will
 * throw an exception.  A {@link Layout} instance must have a
 * non-negative {@link Layout#span|span}, and if it lacks a {@link
 * Layout#property|property} the {@link
 * Union#defaultLayout|defaultLayout} will be a {@link
 * Layout#replicate|replica} with property `content`.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */ class Union extends Layout {
    /** @override */ getSpan(b, offset) {
        if (0 <= this.span) {
            return this.span;
        }
        if (undefined === offset) {
            offset = 0;
        }
        /* Default layouts always have non-negative span, so we don't have
     * one and we have to recognize the variant which will in turn
     * determine the span. */ const vlo = this.getVariant(b, offset);
        if (!vlo) {
            throw new Error('unable to determine span for unrecognized variant');
        }
        return vlo.getSpan(b, offset);
    }
    /**
   * Method to infer a registered Union variant compatible with `src`.
   *
   * The first satisified rule in the following sequence defines the
   * return value:
   * * If `src` has properties matching the Union discriminator and
   *   the default layout, `undefined` is returned regardless of the
   *   value of the discriminator property (this ensures the default
   *   layout will be used);
   * * If `src` has a property matching the Union discriminator, the
   *   value of the discriminator identifies a registered variant, and
   *   either (a) the variant has no layout, or (b) `src` has the
   *   variant's property, then the variant is returned (because the
   *   source satisfies the constraints of the variant it identifies);
   * * If `src` does not have a property matching the Union
   *   discriminator, but does have a property matching a registered
   *   variant, then the variant is returned (because the source
   *   matches a variant without an explicit conflict);
   * * An error is thrown (because we either can't identify a variant,
   *   or we were explicitly told the variant but can't satisfy it).
   *
   * @param {Object} src - an object presumed to be compatible with
   * the content of the Union.
   *
   * @return {(undefined|VariantLayout)} - as described above.
   *
   * @throws {Error} - if `src` cannot be associated with a default or
   * registered variant.
   */ defaultGetSourceVariant(src) {
        if (src.hasOwnProperty(this.discriminator.property)) {
            if (this.defaultLayout && src.hasOwnProperty(this.defaultLayout.property)) {
                return undefined;
            }
            const vlo = this.registry[src[this.discriminator.property]];
            if (vlo && (!vlo.layout || src.hasOwnProperty(vlo.property))) {
                return vlo;
            }
        } else {
            for(const tag in this.registry){
                const vlo = this.registry[tag];
                if (src.hasOwnProperty(vlo.property)) {
                    return vlo;
                }
            }
        }
        throw new Error('unable to infer src variant');
    }
    /** Implement {@link Layout#decode|decode} for {@link Union}.
   *
   * If the variant is {@link Union#addVariant|registered} the return
   * value is an instance of that variant, with no explicit
   * discriminator.  Otherwise the {@link Union#defaultLayout|default
   * layout} is used to decode the content. */ decode(b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        let dest;
        const dlo = this.discriminator;
        const discr = dlo.decode(b, offset);
        let clo = this.registry[discr];
        if (undefined === clo) {
            let contentOffset = 0;
            clo = this.defaultLayout;
            if (this.usesPrefixDiscriminator) {
                contentOffset = dlo.layout.span;
            }
            dest = this.makeDestinationObject();
            dest[dlo.property] = discr;
            dest[clo.property] = this.defaultLayout.decode(b, offset + contentOffset);
        } else {
            dest = clo.decode(b, offset);
        }
        return dest;
    }
    /** Implement {@link Layout#encode|encode} for {@link Union}.
   *
   * This API assumes the `src` object is consistent with the union's
   * {@link Union#defaultLayout|default layout}.  To encode variants
   * use the appropriate variant-specific {@link VariantLayout#encode}
   * method. */ encode(src, b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        const vlo = this.getSourceVariant(src);
        if (undefined === vlo) {
            const dlo = this.discriminator;
            const clo = this.defaultLayout;
            let contentOffset = 0;
            if (this.usesPrefixDiscriminator) {
                contentOffset = dlo.layout.span;
            }
            dlo.encode(src[dlo.property], b, offset);
            return contentOffset + clo.encode(src[clo.property], b, offset + contentOffset);
        }
        return vlo.encode(src, b, offset);
    }
    /** Register a new variant structure within a union.  The newly
   * created variant is returned.
   *
   * @param {Number} variant - initializer for {@link
   * VariantLayout#variant|variant}.
   *
   * @param {Layout} layout - initializer for {@link
   * VariantLayout#layout|layout}.
   *
   * @param {String} property - initializer for {@link
   * Layout#property|property}.
   *
   * @return {VariantLayout} */ addVariant(variant, layout, property) {
        const rv = new VariantLayout(this, variant, layout, property);
        this.registry[variant] = rv;
        return rv;
    }
    /**
   * Get the layout associated with a registered variant.
   *
   * If `vb` does not produce a registered variant the function returns
   * `undefined`.
   *
   * @param {(Number|Buffer)} vb - either the variant number, or a
   * buffer from which the discriminator is to be read.
   *
   * @param {Number} offset - offset into `vb` for the start of the
   * union.  Used only when `vb` is an instance of {Buffer}.
   *
   * @return {({VariantLayout}|undefined)}
   */ getVariant(vb, offset) {
        let variant = vb;
        if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].isBuffer(vb)) {
            if (undefined === offset) {
                offset = 0;
            }
            variant = this.discriminator.decode(vb, offset);
        }
        return this.registry[variant];
    }
    constructor(discr, defaultLayout, property){
        const upv = discr instanceof UInt || discr instanceof UIntBE;
        if (upv) {
            discr = new UnionLayoutDiscriminator(new OffsetLayout(discr));
        } else if (discr instanceof ExternalLayout && discr.isCount()) {
            discr = new UnionLayoutDiscriminator(discr);
        } else if (!(discr instanceof UnionDiscriminator)) {
            throw new TypeError('discr must be a UnionDiscriminator ' + 'or an unsigned integer layout');
        }
        if (undefined === defaultLayout) {
            defaultLayout = null;
        }
        if (!(null === defaultLayout || defaultLayout instanceof Layout)) {
            throw new TypeError('defaultLayout must be null or a Layout');
        }
        if (null !== defaultLayout) {
            if (0 > defaultLayout.span) {
                throw new Error('defaultLayout must have constant span');
            }
            if (undefined === defaultLayout.property) {
                defaultLayout = defaultLayout.replicate('content');
            }
        }
        /* The union span can be estimated only if there's a default
     * layout.  The union spans its default layout, plus any prefix
     * variant layout.  By construction both layouts, if present, have
     * non-negative span. */ let span = -1;
        if (defaultLayout) {
            span = defaultLayout.span;
            if (0 <= span && upv) {
                span += discr.layout.span;
            }
        }
        super(span, property);
        /** The interface for the discriminator value in isolation.
     *
     * This a {@link UnionDiscriminator} either passed to the
     * constructor or synthesized from the `discr` constructor
     * argument.  {@link
     * Union#usesPrefixDiscriminator|usesPrefixDiscriminator} will be
     * `true` iff the `discr` parameter was a non-offset {@link
     * Layout} instance. */ this.discriminator = discr;
        /** `true` if the {@link Union#discriminator|discriminator} is the
     * first field in the union.
     *
     * If `false` the discriminator is obtained from somewhere
     * else. */ this.usesPrefixDiscriminator = upv;
        /** The layout for non-discriminator content when the value of the
     * discriminator is not recognized.
     *
     * This is the value passed to the constructor.  It is
     * structurally equivalent to the second component of {@link
     * Union#layout|layout} but may have a different property
     * name. */ this.defaultLayout = defaultLayout;
        /** A registry of allowed variants.
     *
     * The keys are unsigned integers which should be compatible with
     * {@link Union.discriminator|discriminator}.  The property value
     * is the corresponding {@link VariantLayout} instances assigned
     * to this union by {@link Union#addVariant|addVariant}.
     *
     * **NOTE** The registry remains mutable so that variants can be
     * {@link Union#addVariant|added} at any time.  Users should not
     * manipulate the content of this property. */ this.registry = {};
        /* Private variable used when invoking getSourceVariant */ let boundGetSourceVariant = this.defaultGetSourceVariant.bind(this);
        /** Function to infer the variant selected by a source object.
     *
     * Defaults to {@link
     * Union#defaultGetSourceVariant|defaultGetSourceVariant} but may
     * be overridden using {@link
     * Union#configGetSourceVariant|configGetSourceVariant}.
     *
     * @param {Object} src - as with {@link
     * Union#defaultGetSourceVariant|defaultGetSourceVariant}.
     *
     * @returns {(undefined|VariantLayout)} The default variant
     * (`undefined`) or first registered variant that uses a property
     * available in `src`. */ this.getSourceVariant = function(src) {
            return boundGetSourceVariant(src);
        };
        /** Function to override the implementation of {@link
     * Union#getSourceVariant|getSourceVariant}.
     *
     * Use this if the desired variant cannot be identified using the
     * algorithm of {@link
     * Union#defaultGetSourceVariant|defaultGetSourceVariant}.
     *
     * **NOTE** The provided function will be invoked bound to this
     * Union instance, providing local access to {@link
     * Union#registry|registry}.
     *
     * @param {Function} gsv - a function that follows the API of
     * {@link Union#defaultGetSourceVariant|defaultGetSourceVariant}. */ this.configGetSourceVariant = function(gsv) {
            boundGetSourceVariant = gsv.bind(this);
        };
    }
}
/**
 * Represent a specific variant within a containing union.
 *
 * **NOTE** The {@link Layout#span|span} of the variant may include
 * the span of the {@link Union#discriminator|discriminator} used to
 * identify it, but values read and written using the variant strictly
 * conform to the content of {@link VariantLayout#layout|layout}.
 *
 * **NOTE** User code should not invoke this constructor directly.  Use
 * the union {@link Union#addVariant|addVariant} helper method.
 *
 * @param {Union} union - initializer for {@link
 * VariantLayout#union|union}.
 *
 * @param {Number} variant - initializer for {@link
 * VariantLayout#variant|variant}.
 *
 * @param {Layout} [layout] - initializer for {@link
 * VariantLayout#layout|layout}.  If absent the variant carries no
 * data.
 *
 * @param {String} [property] - initializer for {@link
 * Layout#property|property}.  Unlike many other layouts, variant
 * layouts normally include a property name so they can be identified
 * within their containing {@link Union}.  The property identifier may
 * be absent only if `layout` is is absent.
 *
 * @augments {Layout}
 */ class VariantLayout extends Layout {
    /** @override */ getSpan(b, offset) {
        if (0 <= this.span) {
            /* Will be equal to the containing union span if that is not
       * variable. */ return this.span;
        }
        if (undefined === offset) {
            offset = 0;
        }
        let contentOffset = 0;
        if (this.union.usesPrefixDiscriminator) {
            contentOffset = this.union.discriminator.layout.span;
        }
        /* Span is defined solely by the variant (and prefix discriminator) */ return contentOffset + this.layout.getSpan(b, offset + contentOffset);
    }
    /** @override */ decode(b, offset) {
        const dest = this.makeDestinationObject();
        if (undefined === offset) {
            offset = 0;
        }
        if (this !== this.union.getVariant(b, offset)) {
            throw new Error('variant mismatch');
        }
        let contentOffset = 0;
        if (this.union.usesPrefixDiscriminator) {
            contentOffset = this.union.discriminator.layout.span;
        }
        if (this.layout) {
            dest[this.property] = this.layout.decode(b, offset + contentOffset);
        } else if (this.property) {
            dest[this.property] = true;
        } else if (this.union.usesPrefixDiscriminator) {
            dest[this.union.discriminator.property] = this.variant;
        }
        return dest;
    }
    /** @override */ encode(src, b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        let contentOffset = 0;
        if (this.union.usesPrefixDiscriminator) {
            contentOffset = this.union.discriminator.layout.span;
        }
        if (this.layout && !src.hasOwnProperty(this.property)) {
            throw new TypeError('variant lacks property ' + this.property);
        }
        this.union.discriminator.encode(this.variant, b, offset);
        let span = contentOffset;
        if (this.layout) {
            this.layout.encode(src[this.property], b, offset + contentOffset);
            span += this.layout.getSpan(b, offset + contentOffset);
            if (0 <= this.union.span && span > this.union.span) {
                throw new Error('encoded variant overruns containing union');
            }
        }
        return span;
    }
    /** Delegate {@link Layout#fromArray|fromArray} to {@link
   * VariantLayout#layout|layout}. */ fromArray(values) {
        if (this.layout) {
            return this.layout.fromArray(values);
        }
    }
    constructor(union, variant, layout, property){
        if (!(union instanceof Union)) {
            throw new TypeError('union must be a Union');
        }
        if (!Number.isInteger(variant) || 0 > variant) {
            throw new TypeError('variant must be a (non-negative) integer');
        }
        if ('string' === typeof layout && undefined === property) {
            property = layout;
            layout = null;
        }
        if (layout) {
            if (!(layout instanceof Layout)) {
                throw new TypeError('layout must be a Layout');
            }
            if (null !== union.defaultLayout && 0 <= layout.span && layout.span > union.defaultLayout.span) {
                throw new Error('variant span exceeds span of containing union');
            }
            if ('string' !== typeof property) {
                throw new TypeError('variant must have a String property');
            }
        }
        let span = union.span;
        if (0 > union.span) {
            span = layout ? layout.span : 0;
            if (0 <= span && union.usesPrefixDiscriminator) {
                span += union.discriminator.layout.span;
            }
        }
        super(span, property);
        /** The {@link Union} to which this variant belongs. */ this.union = union;
        /** The unsigned integral value identifying this variant within
     * the {@link Union#discriminator|discriminator} of the containing
     * union. */ this.variant = variant;
        /** The {@link Layout} to be used when reading/writing the
     * non-discriminator part of the {@link
     * VariantLayout#union|union}.  If `null` the variant carries no
     * data. */ this.layout = layout || null;
    }
}
/* eslint-enable no-extend-native */ /**
 * Contain a fixed-length block of arbitrary data, represented as a
 * Buffer.
 *
 * *Factory*: {@link module:Layout.blob|blob}
 *
 * @param {(Number|ExternalLayout)} length - initializes {@link
 * Blob#length|length}.
 *
 * @param {String} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */ class Blob$1 extends Layout {
    /** @override */ getSpan(b, offset) {
        let span = this.span;
        if (0 > span) {
            span = this.length.decode(b, offset);
        }
        return span;
    }
    /** @override */ decode(b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        let span = this.span;
        if (0 > span) {
            span = this.length.decode(b, offset);
        }
        return b.slice(offset, offset + span);
    }
    /** Implement {@link Layout#encode|encode} for {@link Blob}.
   *
   * **NOTE** If {@link Layout#count|count} is an instance of {@link
   * ExternalLayout} then the length of `src` will be encoded as the
   * count after `src` is encoded. */ encode(src, b, offset) {
        let span = this.length;
        if (this.length instanceof ExternalLayout) {
            span = src.length;
        }
        if (!(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].isBuffer(src) && span === src.length)) {
            throw new TypeError(nameWithProperty('Blob.encode', this) + ' requires (length ' + span + ') Buffer as src');
        }
        if (offset + span > b.length) {
            throw new RangeError('encoding overruns Buffer');
        }
        b.write(src.toString('hex'), offset, span, 'hex');
        if (this.length instanceof ExternalLayout) {
            this.length.encode(span, b, offset);
        }
        return span;
    }
    constructor(length, property){
        if (!(length instanceof ExternalLayout && length.isCount() || Number.isInteger(length) && 0 <= length)) {
            throw new TypeError('length must be positive integer ' + 'or an unsigned integer ExternalLayout');
        }
        let span = -1;
        if (!(length instanceof ExternalLayout)) {
            span = length;
        }
        super(span, property);
        /** The number of bytes in the blob.
     *
     * This may be a non-negative integer, or an instance of {@link
     * ExternalLayout} that satisfies {@link
     * ExternalLayout#isCount|isCount()}. */ this.length = length;
    }
}
/** Factory for {@link OffsetLayout}. */ var offset = (layout, offset, property)=>new OffsetLayout(layout, offset, property);
/** Factory for {@link UInt|unsigned int layouts} spanning one
 * byte. */ var u8 = (property)=>new UInt(1, property);
/** Factory for {@link UInt|little-endian unsigned int layouts}
 * spanning four bytes. */ var u32 = (property)=>new UInt(4, property);
/** Factory for {@link NearUInt64|little-endian unsigned int
 * layouts} interpreted as Numbers. */ var nu64 = (property)=>new NearUInt64(property);
/** Factory for {@link NearInt64|little-endian signed int layouts}
 * interpreted as Numbers. */ var ns64 = (property)=>new NearInt64(property);
/** Factory for {@link Structure} values. */ var struct = (fields, property, decodePrefixes)=>new Structure(fields, property, decodePrefixes);
/** Factory for {@link Union} values. */ var union = (discr, defaultLayout, property)=>new Union(discr, defaultLayout, property);
/** Factory for {@link Blob} values. */ var blob = (length, property)=>new Blob$1(length, property);
class SystemInstructionCoder {
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
                    throw new Error("Invalid instruction: ".concat(ixName));
                }
        }
    }
    encodeState(_ixName, _ix) {
        throw new Error("System does not have state");
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor(_){}
}
class RustStringLayout extends Layout_2 {
    encode(src, b) {
        let offset = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
        if (src === null || src === undefined) {
            return this.layout.span;
        }
        const data = {
            chars: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(src, "utf8")
        };
        return this.layout.encode(data, b, offset);
    }
    decode(b) {
        let offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
        const data = this.layout.decode(b, offset);
        return data["chars"].toString();
    }
    getSpan(b) {
        let offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
        return u32().span + u32().span + new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](new Uint8Array(b).slice(offset, offset + 4), 10, "le").toNumber();
    }
    constructor(property){
        super(-1, property);
        this.property = property;
        this.layout = struct([
            u32("length"),
            u32("lengthPadding"),
            blob(offset(u32(), -8), "chars")
        ], this.property);
    }
}
function rustStringLayout(property) {
    return new RustStringLayout(property);
}
function publicKey$2(property) {
    return blob(32, property);
}
function encodeCreateAccount(param) {
    let { lamports, space, owner } = param;
    return encodeData({
        createAccount: {
            lamports,
            space,
            owner: owner.toBuffer()
        }
    });
}
function encodeAssign(param) {
    let { owner } = param;
    return encodeData({
        assign: {
            owner: owner.toBuffer()
        }
    });
}
function encodeTransfer(param) {
    let { lamports } = param;
    return encodeData({
        transfer: {
            lamports
        }
    });
}
function encodeCreateAccountWithSeed(param) {
    let { base, seed, lamports, space, owner } = param;
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
function encodeInitializeNonceAccount(param) {
    let { authorized } = param;
    return encodeData({
        initializeNonceAccount: {
            authorized: authorized.toBuffer()
        }
    });
}
function encodeAdvanceNonceAccount(param) {
    let { authorized } = param;
    return encodeData({
        advanceNonceAccount: {
            authorized: authorized.toBuffer()
        }
    });
}
function encodeWithdrawNonceAccount(param) {
    let { lamports } = param;
    return encodeData({
        withdrawNonceAccount: {
            lamports
        }
    });
}
function encodeAuthorizeNonceAccount(param) {
    let { authorized } = param;
    return encodeData({
        authorizeNonceAccount: {
            authorized: authorized.toBuffer()
        }
    });
}
function encodeAllocate(param) {
    let { space } = param;
    return encodeData({
        allocate: {
            space
        }
    });
}
function encodeAllocateWithSeed(param) {
    let { base, seed, space, owner } = param;
    return encodeData({
        allocateWithSeed: {
            base: base.toBuffer(),
            seed,
            space,
            owner: owner.toBuffer()
        }
    }, LAYOUT.getVariant(9).span + seed.length);
}
function encodeAssignWithSeed(param) {
    let { base, seed, owner } = param;
    return encodeData({
        assignWithSeed: {
            base: base.toBuffer(),
            seed,
            owner: owner.toBuffer()
        }
    }, LAYOUT.getVariant(10).span + seed.length);
}
function encodeTransferWithSeed(param) {
    let { lamports, seed, owner } = param;
    return encodeData({
        transferWithSeed: {
            lamports,
            seed,
            owner: owner.toBuffer()
        }
    }, LAYOUT.getVariant(11).span + seed.length);
}
const LAYOUT = union(u32("instruction"));
LAYOUT.addVariant(0, struct([
    ns64("lamports"),
    ns64("space"),
    publicKey$2("owner")
]), "createAccount");
LAYOUT.addVariant(1, struct([
    publicKey$2("owner")
]), "assign");
LAYOUT.addVariant(2, struct([
    ns64("lamports")
]), "transfer");
LAYOUT.addVariant(3, struct([
    publicKey$2("base"),
    rustStringLayout("seed"),
    ns64("lamports"),
    ns64("space"),
    publicKey$2("owner")
]), "createAccountWithSeed");
LAYOUT.addVariant(4, struct([
    publicKey$2("authorized")
]), "advanceNonceAccount");
LAYOUT.addVariant(5, struct([
    ns64("lamports")
]), "withdrawNonceAccount");
LAYOUT.addVariant(6, struct([
    publicKey$2("authorized")
]), "initializeNonceAccount");
LAYOUT.addVariant(7, struct([
    publicKey$2("authorized")
]), "authorizeNonceAccount");
LAYOUT.addVariant(8, struct([
    ns64("space")
]), "allocate");
LAYOUT.addVariant(9, struct([
    publicKey$2("base"),
    rustStringLayout("seed"),
    ns64("space"),
    publicKey$2("owner")
]), "allocateWithSeed");
LAYOUT.addVariant(10, struct([
    publicKey$2("base"),
    rustStringLayout("seed"),
    publicKey$2("owner")
]), "assignWithSeed");
LAYOUT.addVariant(11, struct([
    ns64("lamports"),
    rustStringLayout("seed"),
    publicKey$2("owner")
]), "transferWithSeed");
function encodeData(instruction, maxSpan) {
    const b = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].alloc(maxSpan !== null && maxSpan !== void 0 ? maxSpan : instructionMaxSpan);
    const span = LAYOUT.encode(instruction, b);
    if (maxSpan === undefined) {
        return b.slice(0, span);
    }
    return b;
}
const instructionMaxSpan = Math.max(...Object.values(LAYOUT.registry).map((r)=>r.span));
class SystemAccountsCoder {
    async encode(accountName, account) {
        switch(accountName){
            case "nonce":
                {
                    const buffer = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].alloc(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NONCE_ACCOUNT_LENGTH"]);
                    const len = NONCE_ACCOUNT_LAYOUT.encode(account, buffer);
                    return buffer.slice(0, len);
                }
            default:
                {
                    throw new Error("Invalid account name: ".concat(accountName));
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
                    throw new Error("Invalid account name: ".concat(accountName));
                }
        }
    }
    // TODO: this won't use the appendData.
    memcmp(accountName, _appendData) {
        switch(accountName){
            case "nonce":
                {
                    return {
                        dataSize: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NONCE_ACCOUNT_LENGTH"]
                    };
                }
            default:
                {
                    throw new Error("Invalid account name: ".concat(accountName));
                }
        }
    }
    size(accountName) {
        return IdlCoder.typeSize({
            defined: {
                name: accountName
            }
        }, this.idl);
    }
    constructor(idl){
        this.idl = idl;
    }
}
function decodeNonceAccount(ix) {
    return NONCE_ACCOUNT_LAYOUT.decode(ix);
}
class WrappedLayout$1 extends Layout_2 {
    decode(b, offset) {
        return this.decoder(this.layout.decode(b, offset));
    }
    encode(src, b, offset) {
        return this.layout.encode(this.encoder(src), b, offset);
    }
    getSpan(b, offset) {
        return this.layout.getSpan(b, offset);
    }
    constructor(layout, decoder, encoder, property){
        super(layout.span, property);
        this.layout = layout;
        this.decoder = decoder;
        this.encoder = encoder;
    }
}
function publicKey$1(property) {
    return new WrappedLayout$1(blob(32), (b)=>new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"](b), (key)=>key.toBuffer(), property);
}
const NONCE_ACCOUNT_LAYOUT = struct([
    u32("version"),
    u32("state"),
    publicKey$1("authorizedPubkey"),
    publicKey$1("nonce"),
    struct([
        nu64("lamportsPerSignature")
    ], "feeCalculator")
]);
class SystemEventsCoder {
    decode(_log) {
        throw new Error("System program does not have events");
    }
    constructor(_idl){}
}
class SystemTypesCoder {
    encode(_name, _type) {
        throw new Error("System does not have user-defined types");
    }
    decode(_name, _typeData) {
        throw new Error("System does not have user-defined types");
    }
    constructor(_idl){}
}
/**
 * Coder for the System program.
 */ class SystemCoder {
    constructor(idl){
        this.instruction = new SystemInstructionCoder(idl);
        this.accounts = new SystemAccountsCoder(idl);
        this.events = new SystemEventsCoder(idl);
        this.types = new SystemTypesCoder(idl);
    }
}
function hash(data) {
    return new TextDecoder().decode((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha256$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha256"])(data));
}
var sha256 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    hash: hash
});
// Sync version of web3.PublicKey.createWithSeed.
function createWithSeedSync(fromPublicKey, seed, programId) {
    const buffer = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].concat([
        fromPublicKey.toBuffer(),
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(seed),
        programId.toBuffer()
    ]);
    return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"]((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha256$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha256"])(buffer));
}
var pubkey = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    createWithSeedSync: createWithSeedSync
});
const TOKEN_PROGRAM_ID = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"]("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const ASSOCIATED_PROGRAM_ID = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"]("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
function associatedAddress(param) {
    let { mint, owner } = param;
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"].findProgramAddressSync([
        owner.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mint.toBuffer()
    ], ASSOCIATED_PROGRAM_ID)[0];
}
var token = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    TOKEN_PROGRAM_ID: TOKEN_PROGRAM_ID,
    ASSOCIATED_PROGRAM_ID: ASSOCIATED_PROGRAM_ID,
    associatedAddress: associatedAddress
});
var browserPonyfill = {
    exports: {}
};
(function(module, exports) {
    var global = typeof self !== 'undefined' ? self : commonjsGlobal;
    var __self__ = function() {
        function F() {
            this.fetch = false;
            this.DOMException = global.DOMException;
        }
        F.prototype = global;
        return new F();
    }();
    (function(self1) {
        (function(exports) {
            var support = {
                searchParams: 'URLSearchParams' in self1,
                iterable: 'Symbol' in self1 && 'iterator' in Symbol,
                blob: 'FileReader' in self1 && 'Blob' in self1 && function() {
                    try {
                        new Blob();
                        return true;
                    } catch (e) {
                        return false;
                    }
                }(),
                formData: 'FormData' in self1,
                arrayBuffer: 'ArrayBuffer' in self1
            };
            function isDataView(obj) {
                return obj && DataView.prototype.isPrototypeOf(obj);
            }
            if (support.arrayBuffer) {
                var viewClasses = [
                    '[object Int8Array]',
                    '[object Uint8Array]',
                    '[object Uint8ClampedArray]',
                    '[object Int16Array]',
                    '[object Uint16Array]',
                    '[object Int32Array]',
                    '[object Uint32Array]',
                    '[object Float32Array]',
                    '[object Float64Array]'
                ];
                var isArrayBufferView = ArrayBuffer.isView || function(obj) {
                    return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
                };
            }
            function normalizeName(name) {
                if (typeof name !== 'string') {
                    name = String(name);
                }
                if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
                    throw new TypeError('Invalid character in header field name');
                }
                return name.toLowerCase();
            }
            function normalizeValue(value) {
                if (typeof value !== 'string') {
                    value = String(value);
                }
                return value;
            }
            // Build a destructive iterator for the value list
            function iteratorFor(items) {
                var iterator = {
                    next: function() {
                        var value = items.shift();
                        return {
                            done: value === undefined,
                            value: value
                        };
                    }
                };
                if (support.iterable) {
                    iterator[Symbol.iterator] = function() {
                        return iterator;
                    };
                }
                return iterator;
            }
            function Headers(headers) {
                this.map = {};
                if (headers instanceof Headers) {
                    headers.forEach(function(value, name) {
                        this.append(name, value);
                    }, this);
                } else if (Array.isArray(headers)) {
                    headers.forEach(function(header) {
                        this.append(header[0], header[1]);
                    }, this);
                } else if (headers) {
                    Object.getOwnPropertyNames(headers).forEach(function(name) {
                        this.append(name, headers[name]);
                    }, this);
                }
            }
            Headers.prototype.append = function(name, value) {
                name = normalizeName(name);
                value = normalizeValue(value);
                var oldValue = this.map[name];
                this.map[name] = oldValue ? oldValue + ', ' + value : value;
            };
            Headers.prototype['delete'] = function(name) {
                delete this.map[normalizeName(name)];
            };
            Headers.prototype.get = function(name) {
                name = normalizeName(name);
                return this.has(name) ? this.map[name] : null;
            };
            Headers.prototype.has = function(name) {
                return this.map.hasOwnProperty(normalizeName(name));
            };
            Headers.prototype.set = function(name, value) {
                this.map[normalizeName(name)] = normalizeValue(value);
            };
            Headers.prototype.forEach = function(callback, thisArg) {
                for(var name in this.map){
                    if (this.map.hasOwnProperty(name)) {
                        callback.call(thisArg, this.map[name], name, this);
                    }
                }
            };
            Headers.prototype.keys = function() {
                var items = [];
                this.forEach(function(value, name) {
                    items.push(name);
                });
                return iteratorFor(items);
            };
            Headers.prototype.values = function() {
                var items = [];
                this.forEach(function(value) {
                    items.push(value);
                });
                return iteratorFor(items);
            };
            Headers.prototype.entries = function() {
                var items = [];
                this.forEach(function(value, name) {
                    items.push([
                        name,
                        value
                    ]);
                });
                return iteratorFor(items);
            };
            if (support.iterable) {
                Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
            }
            function consumed(body) {
                if (body.bodyUsed) {
                    return Promise.reject(new TypeError('Already read'));
                }
                body.bodyUsed = true;
            }
            function fileReaderReady(reader) {
                return new Promise(function(resolve, reject) {
                    reader.onload = function() {
                        resolve(reader.result);
                    };
                    reader.onerror = function() {
                        reject(reader.error);
                    };
                });
            }
            function readBlobAsArrayBuffer(blob) {
                var reader = new FileReader();
                var promise = fileReaderReady(reader);
                reader.readAsArrayBuffer(blob);
                return promise;
            }
            function readBlobAsText(blob) {
                var reader = new FileReader();
                var promise = fileReaderReady(reader);
                reader.readAsText(blob);
                return promise;
            }
            function readArrayBufferAsText(buf) {
                var view = new Uint8Array(buf);
                var chars = new Array(view.length);
                for(var i = 0; i < view.length; i++){
                    chars[i] = String.fromCharCode(view[i]);
                }
                return chars.join('');
            }
            function bufferClone(buf) {
                if (buf.slice) {
                    return buf.slice(0);
                } else {
                    var view = new Uint8Array(buf.byteLength);
                    view.set(new Uint8Array(buf));
                    return view.buffer;
                }
            }
            function Body() {
                this.bodyUsed = false;
                this._initBody = function(body) {
                    this._bodyInit = body;
                    if (!body) {
                        this._bodyText = '';
                    } else if (typeof body === 'string') {
                        this._bodyText = body;
                    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
                        this._bodyBlob = body;
                    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
                        this._bodyFormData = body;
                    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                        this._bodyText = body.toString();
                    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
                        this._bodyArrayBuffer = bufferClone(body.buffer);
                        // IE 10-11 can't handle a DataView body.
                        this._bodyInit = new Blob([
                            this._bodyArrayBuffer
                        ]);
                    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
                        this._bodyArrayBuffer = bufferClone(body);
                    } else {
                        this._bodyText = body = Object.prototype.toString.call(body);
                    }
                    if (!this.headers.get('content-type')) {
                        if (typeof body === 'string') {
                            this.headers.set('content-type', 'text/plain;charset=UTF-8');
                        } else if (this._bodyBlob && this._bodyBlob.type) {
                            this.headers.set('content-type', this._bodyBlob.type);
                        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                            this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                        }
                    }
                };
                if (support.blob) {
                    this.blob = function() {
                        var rejected = consumed(this);
                        if (rejected) {
                            return rejected;
                        }
                        if (this._bodyBlob) {
                            return Promise.resolve(this._bodyBlob);
                        } else if (this._bodyArrayBuffer) {
                            return Promise.resolve(new Blob([
                                this._bodyArrayBuffer
                            ]));
                        } else if (this._bodyFormData) {
                            throw new Error('could not read FormData body as blob');
                        } else {
                            return Promise.resolve(new Blob([
                                this._bodyText
                            ]));
                        }
                    };
                    this.arrayBuffer = function() {
                        if (this._bodyArrayBuffer) {
                            return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
                        } else {
                            return this.blob().then(readBlobAsArrayBuffer);
                        }
                    };
                }
                this.text = function() {
                    var rejected = consumed(this);
                    if (rejected) {
                        return rejected;
                    }
                    if (this._bodyBlob) {
                        return readBlobAsText(this._bodyBlob);
                    } else if (this._bodyArrayBuffer) {
                        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
                    } else if (this._bodyFormData) {
                        throw new Error('could not read FormData body as text');
                    } else {
                        return Promise.resolve(this._bodyText);
                    }
                };
                if (support.formData) {
                    this.formData = function() {
                        return this.text().then(decode);
                    };
                }
                this.json = function() {
                    return this.text().then(JSON.parse);
                };
                return this;
            }
            // HTTP methods whose capitalization should be normalized
            var methods = [
                'DELETE',
                'GET',
                'HEAD',
                'OPTIONS',
                'POST',
                'PUT'
            ];
            function normalizeMethod(method) {
                var upcased = method.toUpperCase();
                return methods.indexOf(upcased) > -1 ? upcased : method;
            }
            function Request(input, options) {
                options = options || {};
                var body = options.body;
                if (input instanceof Request) {
                    if (input.bodyUsed) {
                        throw new TypeError('Already read');
                    }
                    this.url = input.url;
                    this.credentials = input.credentials;
                    if (!options.headers) {
                        this.headers = new Headers(input.headers);
                    }
                    this.method = input.method;
                    this.mode = input.mode;
                    this.signal = input.signal;
                    if (!body && input._bodyInit != null) {
                        body = input._bodyInit;
                        input.bodyUsed = true;
                    }
                } else {
                    this.url = String(input);
                }
                this.credentials = options.credentials || this.credentials || 'same-origin';
                if (options.headers || !this.headers) {
                    this.headers = new Headers(options.headers);
                }
                this.method = normalizeMethod(options.method || this.method || 'GET');
                this.mode = options.mode || this.mode || null;
                this.signal = options.signal || this.signal;
                this.referrer = null;
                if ((this.method === 'GET' || this.method === 'HEAD') && body) {
                    throw new TypeError('Body not allowed for GET or HEAD requests');
                }
                this._initBody(body);
            }
            Request.prototype.clone = function() {
                return new Request(this, {
                    body: this._bodyInit
                });
            };
            function decode(body) {
                var form = new FormData();
                body.trim().split('&').forEach(function(bytes) {
                    if (bytes) {
                        var split = bytes.split('=');
                        var name = split.shift().replace(/\+/g, ' ');
                        var value = split.join('=').replace(/\+/g, ' ');
                        form.append(decodeURIComponent(name), decodeURIComponent(value));
                    }
                });
                return form;
            }
            function parseHeaders(rawHeaders) {
                var headers = new Headers();
                // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
                // https://tools.ietf.org/html/rfc7230#section-3.2
                var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
                preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
                    var parts = line.split(':');
                    var key = parts.shift().trim();
                    if (key) {
                        var value = parts.join(':').trim();
                        headers.append(key, value);
                    }
                });
                return headers;
            }
            Body.call(Request.prototype);
            function Response(bodyInit, options) {
                if (!options) {
                    options = {};
                }
                this.type = 'default';
                this.status = options.status === undefined ? 200 : options.status;
                this.ok = this.status >= 200 && this.status < 300;
                this.statusText = 'statusText' in options ? options.statusText : 'OK';
                this.headers = new Headers(options.headers);
                this.url = options.url || '';
                this._initBody(bodyInit);
            }
            Body.call(Response.prototype);
            Response.prototype.clone = function() {
                return new Response(this._bodyInit, {
                    status: this.status,
                    statusText: this.statusText,
                    headers: new Headers(this.headers),
                    url: this.url
                });
            };
            Response.error = function() {
                var response = new Response(null, {
                    status: 0,
                    statusText: ''
                });
                response.type = 'error';
                return response;
            };
            var redirectStatuses = [
                301,
                302,
                303,
                307,
                308
            ];
            Response.redirect = function(url, status) {
                if (redirectStatuses.indexOf(status) === -1) {
                    throw new RangeError('Invalid status code');
                }
                return new Response(null, {
                    status: status,
                    headers: {
                        location: url
                    }
                });
            };
            exports.DOMException = self1.DOMException;
            try {
                new exports.DOMException();
            } catch (err) {
                exports.DOMException = function(message, name) {
                    this.message = message;
                    this.name = name;
                    var error = Error(message);
                    this.stack = error.stack;
                };
                exports.DOMException.prototype = Object.create(Error.prototype);
                exports.DOMException.prototype.constructor = exports.DOMException;
            }
            function fetch(input, init) {
                return new Promise(function(resolve, reject) {
                    var request = new Request(input, init);
                    if (request.signal && request.signal.aborted) {
                        return reject(new exports.DOMException('Aborted', 'AbortError'));
                    }
                    var xhr = new XMLHttpRequest();
                    function abortXhr() {
                        xhr.abort();
                    }
                    xhr.onload = function() {
                        var options = {
                            status: xhr.status,
                            statusText: xhr.statusText,
                            headers: parseHeaders(xhr.getAllResponseHeaders() || '')
                        };
                        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
                        var body = 'response' in xhr ? xhr.response : xhr.responseText;
                        resolve(new Response(body, options));
                    };
                    xhr.onerror = function() {
                        reject(new TypeError('Network request failed'));
                    };
                    xhr.ontimeout = function() {
                        reject(new TypeError('Network request failed'));
                    };
                    xhr.onabort = function() {
                        reject(new exports.DOMException('Aborted', 'AbortError'));
                    };
                    xhr.open(request.method, request.url, true);
                    if (request.credentials === 'include') {
                        xhr.withCredentials = true;
                    } else if (request.credentials === 'omit') {
                        xhr.withCredentials = false;
                    }
                    if ('responseType' in xhr && support.blob) {
                        xhr.responseType = 'blob';
                    }
                    request.headers.forEach(function(value, name) {
                        xhr.setRequestHeader(name, value);
                    });
                    if (request.signal) {
                        request.signal.addEventListener('abort', abortXhr);
                        xhr.onreadystatechange = function() {
                            // DONE (success or failure)
                            if (xhr.readyState === 4) {
                                request.signal.removeEventListener('abort', abortXhr);
                            }
                        };
                    }
                    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
                });
            }
            fetch.polyfill = true;
            if (!self1.fetch) {
                self1.fetch = fetch;
                self1.Headers = Headers;
                self1.Request = Request;
                self1.Response = Response;
            }
            exports.Headers = Headers;
            exports.Request = Request;
            exports.Response = Response;
            exports.fetch = fetch;
            Object.defineProperty(exports, '__esModule', {
                value: true
            });
            return exports;
        })({});
    })(__self__);
    __self__.fetch.ponyfill = true;
    // Remove "polyfill" property added by whatwg-fetch
    delete __self__.fetch.polyfill;
    // Choose between native implementation (global) or custom implementation (__self__)
    // var ctx = global.fetch ? global : __self__;
    var ctx = __self__; // this line disable service worker support temporarily
    exports = ctx.fetch; // To enable: import fetch from 'cross-fetch'
    exports.default = ctx.fetch; // For TypeScript consumers without esModuleInterop.
    exports.fetch = ctx.fetch; // To enable: import {fetch} from 'cross-fetch'
    exports.Headers = ctx.Headers;
    exports.Request = ctx.Request;
    exports.Response = ctx.Response;
    module.exports = exports;
})(browserPonyfill, browserPonyfill.exports);
var fetch = /*@__PURE__*/ getDefaultExportFromCjs(browserPonyfill.exports);
/**
 * Returns a verified build from the anchor registry. null if no such
 * verified build exists, e.g., if the program has been upgraded since the
 * last verified build.
 */ async function verifiedBuild(connection, programId) {
    let limit = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 5;
    const url = "https://api.apr.dev/api/v0/program/".concat(programId.toString(), "/latest?limit=").concat(limit);
    const [programData, latestBuildsResp] = await Promise.all([
        fetchData(connection, programId),
        fetch(url)
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
/**
 * Returns the program data account for this program, containing the
 * metadata for this program, e.g., the upgrade authority.
 */ async function fetchData(connection, programId) {
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
const UPGRADEABLE_LOADER_STATE_LAYOUT = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rustEnum"]([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["struct"]([], "uninitialized"),
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["struct"]([
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["option"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["publicKey"](), "authorityAddress")
    ], "buffer"),
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["struct"]([
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["publicKey"]("programdataAddress")
    ], "program"),
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["struct"]([
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["u64"]("slot"),
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["option"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["publicKey"](), "upgradeAuthorityAddress")
    ], "programData")
], undefined, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$coral$2d$xyz$2f$borsh$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["u32"]());
function decodeUpgradeableLoaderState(data) {
    return UPGRADEABLE_LOADER_STATE_LAYOUT.decode(data);
}
var registry = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    verifiedBuild: verifiedBuild,
    fetchData: fetchData,
    decodeUpgradeableLoaderState: decodeUpgradeableLoaderState
});
var index = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    sha256: sha256,
    rpc: rpc,
    publicKey: pubkey,
    bytes: index$1,
    token: token,
    features: features,
    registry: registry
});
const PROGRAM_LOG = "Program log: ";
const PROGRAM_DATA = "Program data: ";
const PROGRAM_LOG_START_INDEX = PROGRAM_LOG.length;
const PROGRAM_DATA_START_INDEX = PROGRAM_DATA.length;
class EventManager {
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
            throw new Error("Event listener ".concat(listener, " doesn't exist!"));
        }
        const [eventName] = callback;
        // Get the listeners.
        let listeners = this._eventListeners.get(eventName);
        if (!listeners) {
            throw new Error("Event listeners don't exist for ".concat(eventName, "!"));
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
                throw new Error("Expected event listeners size to be 0 but got ".concat(this._eventListeners.size));
            }
            if (this._onLogsSubscriptionId !== undefined) {
                await this._provider.connection.removeOnLogsListener(this._onLogsSubscriptionId);
                this._onLogsSubscriptionId = undefined;
            }
        }
    }
    constructor(programId, provider, coder){
        this._programId = programId;
        this._provider = provider;
        this._eventParser = new EventParser(programId, coder);
        this._eventCallbacks = new Map();
        this._eventListeners = new Map();
        this._listenerIdCount = 0;
    }
}
class EventParser {
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
    *parseLogs(logs) {
        let errorOnDecodeFailure = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
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
                throw new Error("Unable to decode event ".concat(logStr));
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
        } else if (logStart.startsWith("Program ".concat(this.programId.toString(), " invoke"))) {
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
    constructor(programId, coder){
        this.coder = coder;
        this.programId = programId;
    }
}
// Stack frame execution context, allowing one to track what program is
// executing for a given log.
class ExecutionContext {
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
    constructor(){
        this.stack = [];
    }
}
class LogScanner {
    next() {
        if (this.logs.length === 0) {
            return null;
        }
        let l = this.logs[0];
        this.logs = this.logs.slice(1);
        return l;
    }
    constructor(logs){
        this.logs = logs;
    }
}
function splitArgsAndCtx(idlIx, args) {
    var _a, _b;
    let options = {};
    const inputLen = idlIx.args ? idlIx.args.length : 0;
    if (args.length > inputLen) {
        if (args.length !== inputLen + 1) {
            throw new Error("provided too many arguments ".concat(args, " to instruction ").concat(idlIx === null || idlIx === void 0 ? void 0 : idlIx.name, " expecting: ").concat((_b = (_a = idlIx.args) === null || _a === void 0 ? void 0 : _a.map((a)=>a.name)) !== null && _b !== void 0 ? _b : []));
        }
        options = args.pop();
    }
    return [
        args,
        options
    ];
}
class InstructionNamespaceFactory {
    static build(idlIx, encodeFn, programId) {
        if (idlIx.name === "_inner") {
            throw new IdlError("the _inner name is reserved");
        }
        const ix = function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            const [ixArgs, ctx] = splitArgsAndCtx(idlIx, [
                ...args
            ]);
            validateAccounts(idlIx.accounts, ctx.accounts);
            validateInstruction(idlIx, ...args);
            const keys = ix.accounts(ctx.accounts);
            if (ctx.remainingAccounts !== undefined) {
                keys.push(...ctx.remainingAccounts);
            }
            if (isSet("debug-logs")) {
                console.log("Outgoing account metas:", keys);
            }
            return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransactionInstruction"]({
                keys,
                programId,
                data: encodeFn(idlIx.name, toInstruction(idlIx, ...ixArgs))
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
            if (isCompositeAccounts(acc)) {
                const rpcAccs = ctx[acc.name];
                return InstructionNamespaceFactory.accountsArray(rpcAccs, acc.accounts, programId, ixName).flat();
            }
            let pubkey;
            try {
                pubkey = translateAddress(ctx[acc.name]);
            } catch (err) {
                throw new Error('Wrong input type for account "'.concat(acc.name, '" in the instruction accounts object').concat(ixName !== undefined ? ' for instruction "' + ixName + '"' : "", ". Expected PublicKey or string."));
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
function validateInstruction(ix) {
    for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        args[_key - 1] = arguments[_key];
    }
// todo
}
class TransactionFactory {
    static build(idlIx, ixFn) {
        const txFn = function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            var _a, _b, _c;
            const [, ctx] = splitArgsAndCtx(idlIx, [
                ...args
            ]);
            const tx = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transaction"]();
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
}
class RpcFactory {
    static build(idlIx, txFn, idlErrors, provider) {
        const rpc = async function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            var _a;
            const tx = txFn(...args);
            const [, ctx] = splitArgsAndCtx(idlIx, [
                ...args
            ]);
            if (provider.sendAndConfirm === undefined) {
                throw new Error("This function requires 'Provider.sendAndConfirm' to be implemented.");
            }
            try {
                return await provider.sendAndConfirm(tx, (_a = ctx.signers) !== null && _a !== void 0 ? _a : [], ctx.options);
            } catch (err) {
                throw translateError(err, idlErrors);
            }
        };
        return rpc;
    }
}
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
            throw new Error("Account does not exist or has no data ".concat(address.toString()));
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
            throw new Error("Account does not exist ".concat(address.toString()));
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
        const accounts = await getMultipleAccountsAndContext(this._provider.connection, addresses.map((address)=>translateAddress(address)), commitment);
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
        const filter = this.coder.accounts.memcmp(this._idlAccount.name, filters instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"] ? filters : undefined);
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
        return resp.map((param)=>{
            let { pubkey, account } = param;
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
        const ee = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$eventemitter3$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]();
        address = translateAddress(address);
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SystemProgram"].createAccount({
            fromPubkey: this._provider.publicKey,
            newAccountPubkey: signer.publicKey,
            space: sizeOverride !== null && sizeOverride !== void 0 ? sizeOverride : size,
            lamports: await this._provider.connection.getMinimumBalanceForRentExemption(sizeOverride !== null && sizeOverride !== void 0 ? sizeOverride : size),
            programId: this._programId
        });
    }
    async getAccountInfo(address, commitment) {
        return await this._provider.connection.getAccountInfo(translateAddress(address), commitment);
    }
    async getAccountInfoAndContext(address, commitment) {
        return await this._provider.connection.getAccountInfoAndContext(translateAddress(address), commitment);
    }
    constructor(idl, idlAccount, programId, provider, coder){
        this._idlAccount = idlAccount;
        this._programId = programId;
        this._provider = provider !== null && provider !== void 0 ? provider : getProvider();
        this._coder = coder !== null && coder !== void 0 ? coder : new BorshCoder(idl);
        this._size = this._coder.accounts.size(idlAccount.name);
    }
}
// Tracks all subscriptions.
const subscriptions = new Map();
class SimulateFactory {
    static build(idlIx, txFn, idlErrors, provider, coder, programId, idl) {
        const simulate = async function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            var _a;
            const tx = txFn(...args);
            const [, ctx] = splitArgsAndCtx(idlIx, [
                ...args
            ]);
            let resp = undefined;
            if (provider.simulate === undefined) {
                throw new Error("This function requires 'Provider.simulate' to be implemented.");
            }
            try {
                resp = await provider.simulate(tx, ctx.signers, (_a = ctx.options) === null || _a === void 0 ? void 0 : _a.commitment);
            } catch (err) {
                throw translateError(err, idlErrors);
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
                let parser = new EventParser(programId, coder);
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
}
function uint64(property) {
    return new WrappedLayout(blob(8), (b)=>u64.fromBuffer(b), (n)=>n.toBuffer(), property);
}
function publicKey(property) {
    return new WrappedLayout(blob(32), (b)=>new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"](b), (key)=>key.toBuffer(), property);
}
function coption(layout, property) {
    return new COptionLayout(layout, property);
}
class WrappedLayout extends Layout_2 {
    decode(b, offset) {
        return this.decoder(this.layout.decode(b, offset));
    }
    encode(src, b, offset) {
        return this.layout.encode(this.encoder(src), b, offset);
    }
    getSpan(b, offset) {
        return this.layout.getSpan(b, offset);
    }
    constructor(layout, decoder, encoder, property){
        super(layout.span, property);
        this.layout = layout;
        this.decoder = decoder;
        this.encoder = encoder;
    }
}
class COptionLayout extends Layout_2 {
    encode(src, b) {
        let offset = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
        if (src === null || src === undefined) {
            return this.layout.span + this.discriminator.encode(0, b, offset);
        }
        this.discriminator.encode(1, b, offset);
        return this.layout.encode(src, b, offset + 4) + 4;
    }
    decode(b) {
        let offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
        const discriminator = this.discriminator.decode(b, offset);
        if (discriminator === 0) {
            return null;
        } else if (discriminator === 1) {
            return this.layout.decode(b, offset + 4);
        }
        throw new Error("Invalid coption " + this.layout.property);
    }
    getSpan(b) {
        let offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
        return this.layout.getSpan(b, offset + 4) + 4;
    }
    constructor(layout, property){
        super(-1, property);
        this.layout = layout;
        this.discriminator = u32();
    }
}
class u64 extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] {
    /**
     * Convert to Buffer representation
     */ toBuffer() {
        const a = super.toArray().reverse();
        const b = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(a);
        if (b.length === 8) {
            return b;
        }
        if (b.length >= 8) {
            throw new Error("u64 too large");
        }
        const zeroPad = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].alloc(8);
        b.copy(zeroPad);
        return zeroPad;
    }
    /**
     * Construct a u64 from Buffer representation
     */ static fromBuffer(buffer) {
        if (buffer.length !== 8) {
            throw new Error("Invalid buffer length: ".concat(buffer.length));
        }
        return new u64([
            ...buffer
        ].reverse().map((i)=>"00".concat(i.toString(16)).slice(-2)).join(""), 16);
    }
}
const TOKEN_ACCOUNT_LAYOUT = struct([
    publicKey("mint"),
    publicKey("owner"),
    uint64("amount"),
    coption(publicKey(), "delegate"),
    ((p)=>{
        const U = union(u8("discriminator"), null, p);
        U.addVariant(0, struct([]), "uninitialized");
        U.addVariant(1, struct([]), "initialized");
        U.addVariant(2, struct([]), "frozen");
        return U;
    })("state"),
    coption(uint64(), "isNative"),
    uint64("delegatedAmount"),
    coption(publicKey(), "closeAuthority")
]);
function decodeTokenAccount(b) {
    return TOKEN_ACCOUNT_LAYOUT.decode(b);
}
// Populates a given accounts context with PDAs and common missing accounts.
class AccountsResolver {
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
                    if (!isCompositeAccounts(acc)) {
                        return !!(acc.address || acc.pda || acc.relations);
                    }
                    return acc.accounts.some(isResolvable);
                };
                const getPaths = function(accs) {
                    let path = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [], paths = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
                    for (const acc of accs){
                        if (isCompositeAccounts(acc)) {
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
                const unresolvedAccs = getPaths(resolvableAccs).filter((path)=>!this.get(path)).map((path)=>path.reduce((acc, p)=>acc + "." + p)).map((acc)=>"`".concat(acc, "`")).join(", ");
                throw new Error([
                    "Reached maximum depth for account resolution.",
                    "Unresolved accounts: ".concat(unresolvedAccs)
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
            if (isPartialAccounts(partialAccount)) {
                // is compound accounts, recurse one level deeper
                if (isCompositeAccounts(accountItem)) {
                    nestedAccountsGeneric[accountName] = this.resolveOptionalsHelper(partialAccount, accountItem["accounts"]);
                } else {
                    // Here we try our best to recover gracefully. If there are optionals we can't check, we will fail then.
                    nestedAccountsGeneric[accountName] = flattenPartialAccounts(partialAccount, true);
                }
            } else {
                // if not compound accounts, do null/optional check and proceed
                if (partialAccount !== null) {
                    nestedAccountsGeneric[accountName] = translateAddress(partialAccount);
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
     */ resolveEventCpi(accounts) {
        let path = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
        for(const i in accounts){
            const accountOrAccounts = accounts[i];
            if (isCompositeAccounts(accountOrAccounts)) {
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
                    this.set(currentPath, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"].findProgramAddressSync([
                        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from("__event_authority")
                    ], this._programId)[0]);
                }
                if (!this.get(nextPath)) {
                    this.set(nextPath, this._programId);
                }
                return;
            }
        }
    }
    resolveConst(accounts) {
        let path = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
        for (const accountOrAccounts of accounts){
            const name = accountOrAccounts.name;
            if (isCompositeAccounts(accountOrAccounts)) {
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
                        ], translateAddress(account.address));
                    }
                }
            }
        }
    }
    async resolvePdasAndRelations(accounts) {
        let path = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
        let found = 0;
        for (const accountOrAccounts of accounts){
            const name = accountOrAccounts.name;
            if (isCompositeAccounts(accountOrAccounts)) {
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
                            const [pubkey] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"].findProgramAddressSync(seeds, programId);
                            this.set([
                                ...path,
                                name
                            ], pubkey);
                        }
                    } catch (e) {}
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
                    } catch (e) {}
                }
            }
        }
        return found;
    }
    async parseProgramId(account) {
        let path = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
        var _a;
        if (!((_a = account.pda) === null || _a === void 0 ? void 0 : _a.program)) {
            return this._programId;
        }
        const buf = await this.toBuffer(account.pda.program, path);
        if (!buf) {
            throw new Error("Program seed not resolved: ".concat(account.name));
        }
        return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"](buf);
    }
    async toBuffer(seed) {
        let path = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
        switch(seed.kind){
            case "const":
                return this.toBufferConst(seed);
            case "arg":
                return await this.toBufferArg(seed);
            case "account":
                return await this.toBufferAccount(seed, path);
            default:
                throw new Error("Unexpected seed: ".concat(seed));
        }
    }
    toBufferConst(seed) {
        return this.toBufferValue("bytes", seed.value);
    }
    async toBufferArg(seed) {
        const [name, ...path] = seed.path.split(".");
        const index = this._idlIx.args.findIndex((arg)=>arg.name === name);
        if (index === -1) {
            throw new Error("Unable to find argument for seed: ".concat(name));
        }
        const value = path.reduce((acc, path)=>(acc !== null && acc !== void 0 ? acc : {})[path], this._args[index]);
        if (value === undefined) {
            return;
        }
        const type = this.getType(this._idlIx.args[index].type, path);
        return this.toBufferValue(type, value);
    }
    async toBufferAccount(seed) {
        let path = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
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
            throw new Error("Seed account is required in order to resolve type: ".concat(seed.path));
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
                return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from([
                    value
                ]);
            case "u16":
            case "i16":
                return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](value).toArrayLike(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"], "le", 2);
            case "u32":
            case "i32":
                return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](value).toArrayLike(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"], "le", 4);
            case "u64":
            case "i64":
                return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](value).toArrayLike(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"], "le", 8);
            case "u128":
            case "i128":
                return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](value).toArrayLike(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"], "le", 16);
            case "u256":
            case "i256":
                return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](value).toArrayLike(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"], "le", 32);
            case "string":
                return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(value);
            case "pubkey":
                return value.toBuffer();
            case "bytes":
                return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(value);
            default:
                if (type === null || type === void 0 ? void 0 : type.array) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(value);
                }
                throw new Error("Unexpected seed type: ".concat(type));
        }
    }
    /**
     * Recursively get the type at some path of either a primitive or a user
     * defined struct.
     */ getType(type) {
        let path = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
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
                        throw new Error("Unknown token account path: ".concat(path));
                }
            }
            const definedType = this._idlTypes.find((t)=>t.name === typeName);
            if (!definedType) {
                throw new Error("Type not found: ".concat(typeName));
            }
            // Only named structs are supported
            const [fieldName, ...subPath] = path;
            const fields = definedType.type.fields;
            const field = fields.find((field)=>field.name === fieldName);
            if (!field) {
                throw new Error("Field not found: ".concat(fieldName));
            }
            return this.getType(field.type, subPath);
        }
        return type;
    }
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
}
// TODO: this should be configurable to avoid unnecessary requests.
class AccountStore {
    async fetchAccount(param) {
        let { publicKey, name } = param;
        const address = publicKey.toBase58();
        if (!this._cache.has(address)) {
            const accountInfo = await this._provider.connection.getAccountInfo(publicKey);
            if (accountInfo === null) {
                throw new Error("Account not found: ".concat(address));
            }
            if (name === "tokenAccount") {
                const account = decodeTokenAccount(accountInfo.data);
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
            const idl = await Program.fetchIdl(programId, this._provider);
            if (idl) {
                const program = new Program(idl, this._provider);
                this._idls[programIdStr] = program.account;
            }
        }
        return this._idls[programIdStr];
    }
    constructor(_provider, accounts, programId){
        this._provider = _provider;
        this._cache = new Map();
        this._idls = {};
        this._idls[programId.toBase58()] = accounts;
    }
}
class MethodsBuilderFactory {
    static build(provider, programId, idlIx, ixFn, txFn, rpcFn, simulateFn, viewFn, accountNamespace, idlTypes, customResolver) {
        return function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            return new MethodsBuilder(args, ixFn, txFn, rpcFn, simulateFn, viewFn, provider, programId, idlIx, accountNamespace, idlTypes, customResolver);
        };
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
        toReturn[accountName] = isPartialAccounts(account) ? flattenPartialAccounts(account, true) : translateAddress(account);
    }
    return toReturn;
}
class MethodsBuilder {
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
     */ preInstructions(ixs) {
        let prepend = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
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
        this._accountsResolver = new AccountsResolver(_args, this._accounts, provider, programId, idlIx, accountNamespace, idlTypes, customResolver);
    }
}
class ViewFactory {
    static build(programId, idlIx, simulateFn, idl) {
        const isWritable = idlIx.accounts.find((a)=>a.writable);
        const hasReturn = !!idlIx.returns;
        if (isWritable || !hasReturn) return;
        const view = async function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            let simulationResult = await simulateFn(...args);
            const returnPrefix = "Program return: ".concat(programId, " ");
            let returnLog = simulationResult.raw.find((l)=>l.startsWith(returnPrefix));
            if (!returnLog) {
                throw new Error("View expected return log");
            }
            let returnData = decode(returnLog.slice(returnPrefix.length));
            let returnType = idlIx.returns;
            if (!returnType) {
                throw new Error("View expected return type");
            }
            const coder = IdlCoder.fieldLayout({
                type: returnType
            }, idl.types);
            return coder.decode(returnData);
        };
        return view;
    }
}
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
        const idlErrors = parseIdlErrors(idl);
        const account = idl.accounts ? AccountFactory.build(idl, coder, programId, provider) : {};
        idl.instructions.forEach((idlIx)=>{
            const ixItem = InstructionNamespaceFactory.build(idlIx, (ixName, ix)=>coder.instruction.encode(ixName, ix), programId);
            const txItem = TransactionFactory.build(idlIx, ixItem);
            const rpcItem = RpcFactory.build(idlIx, txItem, idlErrors, provider);
            const simulateItem = SimulateFactory.build(idlIx, txItem, idlErrors, provider, coder, programId, idl);
            const viewItem = ViewFactory.build(programId, idlIx, simulateItem, idl);
            const methodItem = MethodsBuilderFactory.build(provider, programId, idlIx, ixItem, txItem, rpcItem, simulateItem, viewItem, account, idl.types || [], getCustomResolver === null || getCustomResolver === void 0 ? void 0 : getCustomResolver(idlIx));
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
}
/**
 * ## Program
 *
 * Program provides the IDL deserialized client representation of an Anchor
 * program.
 *
 * This API is the one stop shop for all things related to communicating with
 * on-chain programs. Among other things, one can send transactions, fetch
 * deserialized accounts, decode instruction data, subscribe to account
 * changes, and listen to events.
 *
 * In addition to field accessors and methods, the object provides a set of
 * dynamically generated properties, also known as namespaces, that
 * map one-to-one to program methods and accounts. These namespaces generally
 *  can be used as follows:
 *
 * ## Usage
 *
 * ```javascript
 * program.<namespace>.<program-specific-method>
 * ```
 *
 * API specifics are namespace dependent. The examples used in the documentation
 * below will refer to the two counter examples found
 * [here](https://github.com/coral-xyz/anchor#examples).
 */ class Program {
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
     * Generates a Program client by fetching the IDL from the network.
     *
     * In order to use this method, an IDL must have been previously initialized
     * via the anchor CLI's `anchor idl init` command.
     *
     * @param programId The on-chain address of the program.
     * @param provider  The network and wallet context.
     */ static async at(address, provider) {
        const programId = translateAddress(address);
        const idl = await Program.fetchIdl(programId, provider);
        if (!idl) {
            throw new Error("IDL not found for program: ".concat(address.toString()));
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
        provider = provider !== null && provider !== void 0 ? provider : getProvider();
        const programId = translateAddress(address);
        const idlAddr = await idlAddress(programId);
        const accountInfo = await provider.connection.getAccountInfo(idlAddr);
        if (!accountInfo) {
            return null;
        }
        // Chop off account discriminator.
        let idlAccount = decodeIdlAccount(accountInfo.data.slice(8));
        const inflatedIdl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$pako$2f$dist$2f$pako$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inflate"])(idlAccount.data);
        return JSON.parse(decode$2(inflatedIdl));
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
    /**
     * @param idl       The interface definition.
     * @param provider  The network and wallet context to use. If not provided
     *                  then uses [[getProvider]].
     * @param getCustomResolver A function that returns a custom account resolver
     *                          for the given instruction. This is useful for resolving
     *                          public keys of missing accounts when building instructions
     */ constructor(idl, provider = getProvider(), coder, getCustomResolver){
        // Fields.
        this._idl = convertIdlToCamelCase(idl);
        this._rawIdl = idl;
        this._provider = provider;
        this._programId = translateAddress(idl.address);
        this._coder = coder !== null && coder !== void 0 ? coder : new BorshCoder(this._idl);
        this._events = new EventManager(this._programId, provider, this._coder);
        // Dynamic namespaces.
        const [rpc, instruction, transaction, account, simulate, methods, views] = NamespaceFactory.build(this._idl, this._coder, this._programId, provider, getCustomResolver);
        this.rpc = rpc;
        this.instruction = instruction;
        this.transaction = transaction;
        this.account = account;
        this.simulate = simulate;
        this.methods = methods;
        this.views = views;
    }
}
new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"]("11111111111111111111111111111111");
function program(provider) {
    return new Program(IDL, provider, coder());
}
function coder() {
    return new SystemCoder(IDL);
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
};
class Native {
    static system(provider) {
        return program(provider);
    }
}
;
 //# sourceMappingURL=index.js.map
}),
]);

//# sourceMappingURL=33bea_%40coral-xyz_anchor_dist_browser_index_2a1717ce.js.map