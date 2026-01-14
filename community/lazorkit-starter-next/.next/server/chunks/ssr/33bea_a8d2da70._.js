module.exports = [
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@noble/hashes/esm/cryptoNode.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Internal webcrypto alias.
 * We prefer WebCrypto aka globalThis.crypto, which exists in node.js 16+.
 * Falls back to Node.js built-in crypto for Node.js <=v14.
 * See utils.ts for details.
 * @module
 */ // @ts-ignore
__turbopack_context__.s([
    "crypto",
    ()=>crypto
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
const crypto = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ && typeof __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ === 'object' && 'webcrypto' in __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ ? __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__.webcrypto : __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ && typeof __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ === 'object' && 'randomBytes' in __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ ? __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ : undefined; //# sourceMappingURL=cryptoNode.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@noble/hashes/esm/utils.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Utilities for hex, bytes, CSPRNG.
 * @module
 */ /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */ // We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
// node.js versions earlier than v19 don't declare it in global scope.
// For node.js, package.json#exports field mapping rewrites import
// from `crypto` to `cryptoNode`, which imports native module.
// Makes the utils un-importable in browsers without a bundler.
// Once node.js 18 is deprecated (2025-04-30), we can just drop the import.
__turbopack_context__.s([
    "Hash",
    ()=>Hash,
    "abytes",
    ()=>abytes,
    "aexists",
    ()=>aexists,
    "ahash",
    ()=>ahash,
    "anumber",
    ()=>anumber,
    "aoutput",
    ()=>aoutput,
    "asyncLoop",
    ()=>asyncLoop,
    "byteSwap",
    ()=>byteSwap,
    "byteSwap32",
    ()=>byteSwap32,
    "byteSwapIfBE",
    ()=>byteSwapIfBE,
    "bytesToHex",
    ()=>bytesToHex,
    "bytesToUtf8",
    ()=>bytesToUtf8,
    "checkOpts",
    ()=>checkOpts,
    "clean",
    ()=>clean,
    "concatBytes",
    ()=>concatBytes,
    "createHasher",
    ()=>createHasher,
    "createOptHasher",
    ()=>createOptHasher,
    "createView",
    ()=>createView,
    "createXOFer",
    ()=>createXOFer,
    "hexToBytes",
    ()=>hexToBytes,
    "isBytes",
    ()=>isBytes,
    "isLE",
    ()=>isLE,
    "kdfInputToBytes",
    ()=>kdfInputToBytes,
    "nextTick",
    ()=>nextTick,
    "randomBytes",
    ()=>randomBytes,
    "rotl",
    ()=>rotl,
    "rotr",
    ()=>rotr,
    "swap32IfBE",
    ()=>swap32IfBE,
    "swap8IfBE",
    ()=>swap8IfBE,
    "toBytes",
    ()=>toBytes,
    "u32",
    ()=>u32,
    "u8",
    ()=>u8,
    "utf8ToBytes",
    ()=>utf8ToBytes,
    "wrapConstructor",
    ()=>wrapConstructor,
    "wrapConstructorWithOpts",
    ()=>wrapConstructorWithOpts,
    "wrapXOFConstructorWithOpts",
    ()=>wrapXOFConstructorWithOpts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$cryptoNode$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@noble/hashes/esm/cryptoNode.js [app-ssr] (ecmascript)");
;
function isBytes(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === 'Uint8Array';
}
function anumber(n) {
    if (!Number.isSafeInteger(n) || n < 0) throw new Error('positive integer expected, got ' + n);
}
function abytes(b, ...lengths) {
    if (!isBytes(b)) throw new Error('Uint8Array expected');
    if (lengths.length > 0 && !lengths.includes(b.length)) throw new Error('Uint8Array expected of length ' + lengths + ', got length=' + b.length);
}
function ahash(h) {
    if (typeof h !== 'function' || typeof h.create !== 'function') throw new Error('Hash should be wrapped by utils.createHasher');
    anumber(h.outputLen);
    anumber(h.blockLen);
}
function aexists(instance, checkFinished = true) {
    if (instance.destroyed) throw new Error('Hash instance has been destroyed');
    if (checkFinished && instance.finished) throw new Error('Hash#digest() has already been called');
}
function aoutput(out, instance) {
    abytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
        throw new Error('digestInto() expects output buffer of length at least ' + min);
    }
}
function u8(arr) {
    return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
}
function u32(arr) {
    return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
function clean(...arrays) {
    for(let i = 0; i < arrays.length; i++){
        arrays[i].fill(0);
    }
}
function createView(arr) {
    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr(word, shift) {
    return word << 32 - shift | word >>> shift;
}
function rotl(word, shift) {
    return word << shift | word >>> 32 - shift >>> 0;
}
const isLE = /* @__PURE__ */ (()=>new Uint8Array(new Uint32Array([
        0x11223344
    ]).buffer)[0] === 0x44)();
function byteSwap(word) {
    return word << 24 & 0xff000000 | word << 8 & 0xff0000 | word >>> 8 & 0xff00 | word >>> 24 & 0xff;
}
const swap8IfBE = isLE ? (n)=>n : (n)=>byteSwap(n);
const byteSwapIfBE = swap8IfBE;
function byteSwap32(arr) {
    for(let i = 0; i < arr.length; i++){
        arr[i] = byteSwap(arr[i]);
    }
    return arr;
}
const swap32IfBE = isLE ? (u)=>u : byteSwap32;
// Built-in hex conversion https://caniuse.com/mdn-javascript_builtins_uint8array_fromhex
const hasHexBuiltin = /* @__PURE__ */ (()=>// @ts-ignore
    typeof Uint8Array.from([]).toHex === 'function' && typeof Uint8Array.fromHex === 'function')();
// Array where index 0xf0 (240) is mapped to string 'f0'
const hexes = /* @__PURE__ */ Array.from({
    length: 256
}, (_, i)=>i.toString(16).padStart(2, '0'));
function bytesToHex(bytes) {
    abytes(bytes);
    // @ts-ignore
    if (hasHexBuiltin) return bytes.toHex();
    // pre-caching improves the speed 6x
    let hex = '';
    for(let i = 0; i < bytes.length; i++){
        hex += hexes[bytes[i]];
    }
    return hex;
}
// We use optimized technique to convert hex string to byte array
const asciis = {
    _0: 48,
    _9: 57,
    A: 65,
    F: 70,
    a: 97,
    f: 102
};
function asciiToBase16(ch) {
    if (ch >= asciis._0 && ch <= asciis._9) return ch - asciis._0; // '2' => 50-48
    if (ch >= asciis.A && ch <= asciis.F) return ch - (asciis.A - 10); // 'B' => 66-(65-10)
    if (ch >= asciis.a && ch <= asciis.f) return ch - (asciis.a - 10); // 'b' => 98-(97-10)
    return;
}
function hexToBytes(hex) {
    if (typeof hex !== 'string') throw new Error('hex string expected, got ' + typeof hex);
    // @ts-ignore
    if (hasHexBuiltin) return Uint8Array.fromHex(hex);
    const hl = hex.length;
    const al = hl / 2;
    if (hl % 2) throw new Error('hex string expected, got unpadded hex of length ' + hl);
    const array = new Uint8Array(al);
    for(let ai = 0, hi = 0; ai < al; ai++, hi += 2){
        const n1 = asciiToBase16(hex.charCodeAt(hi));
        const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
        if (n1 === undefined || n2 === undefined) {
            const char = hex[hi] + hex[hi + 1];
            throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
        }
        array[ai] = n1 * 16 + n2; // multiply first octet, e.g. 'a3' => 10*16+3 => 160 + 3 => 163
    }
    return array;
}
const nextTick = async ()=>{};
async function asyncLoop(iters, tick, cb) {
    let ts = Date.now();
    for(let i = 0; i < iters; i++){
        cb(i);
        // Date.now() is not monotonic, so in case if clock goes backwards we return return control too
        const diff = Date.now() - ts;
        if (diff >= 0 && diff < tick) continue;
        await nextTick();
        ts += diff;
    }
}
function utf8ToBytes(str) {
    if (typeof str !== 'string') throw new Error('string expected');
    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
function bytesToUtf8(bytes) {
    return new TextDecoder().decode(bytes);
}
function toBytes(data) {
    if (typeof data === 'string') data = utf8ToBytes(data);
    abytes(data);
    return data;
}
function kdfInputToBytes(data) {
    if (typeof data === 'string') data = utf8ToBytes(data);
    abytes(data);
    return data;
}
function concatBytes(...arrays) {
    let sum = 0;
    for(let i = 0; i < arrays.length; i++){
        const a = arrays[i];
        abytes(a);
        sum += a.length;
    }
    const res = new Uint8Array(sum);
    for(let i = 0, pad = 0; i < arrays.length; i++){
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
    }
    return res;
}
function checkOpts(defaults, opts) {
    if (opts !== undefined && ({}).toString.call(opts) !== '[object Object]') throw new Error('options should be object or undefined');
    const merged = Object.assign(defaults, opts);
    return merged;
}
class Hash {
}
function createHasher(hashCons) {
    const hashC = (msg)=>hashCons().update(toBytes(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = ()=>hashCons();
    return hashC;
}
function createOptHasher(hashCons) {
    const hashC = (msg, opts)=>hashCons(opts).update(toBytes(msg)).digest();
    const tmp = hashCons({});
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (opts)=>hashCons(opts);
    return hashC;
}
function createXOFer(hashCons) {
    const hashC = (msg, opts)=>hashCons(opts).update(toBytes(msg)).digest();
    const tmp = hashCons({});
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (opts)=>hashCons(opts);
    return hashC;
}
const wrapConstructor = createHasher;
const wrapConstructorWithOpts = createOptHasher;
const wrapXOFConstructorWithOpts = createXOFer;
function randomBytes(bytesLength = 32) {
    if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$cryptoNode$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["crypto"] && typeof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$cryptoNode$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["crypto"].getRandomValues === 'function') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$cryptoNode$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["crypto"].getRandomValues(new Uint8Array(bytesLength));
    }
    // Legacy Node.js compatibility
    if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$cryptoNode$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["crypto"] && typeof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$cryptoNode$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["crypto"].randomBytes === 'function') {
        return Uint8Array.from(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$cryptoNode$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["crypto"].randomBytes(bytesLength));
    }
    throw new Error('crypto.getRandomValues must be defined');
} //# sourceMappingURL=utils.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@noble/hashes/esm/_md.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Internal Merkle-Damgard hash utils.
 * @module
 */ __turbopack_context__.s([
    "Chi",
    ()=>Chi,
    "HashMD",
    ()=>HashMD,
    "Maj",
    ()=>Maj,
    "SHA224_IV",
    ()=>SHA224_IV,
    "SHA256_IV",
    ()=>SHA256_IV,
    "SHA384_IV",
    ()=>SHA384_IV,
    "SHA512_IV",
    ()=>SHA512_IV,
    "setBigUint64",
    ()=>setBigUint64
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@noble/hashes/esm/utils.js [app-ssr] (ecmascript)");
;
function setBigUint64(view, byteOffset, value, isLE) {
    if (typeof view.setBigUint64 === 'function') return view.setBigUint64(byteOffset, value, isLE);
    const _32n = BigInt(32);
    const _u32_max = BigInt(0xffffffff);
    const wh = Number(value >> _32n & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE ? 4 : 0;
    const l = isLE ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE);
    view.setUint32(byteOffset + l, wl, isLE);
}
function Chi(a, b, c) {
    return a & b ^ ~a & c;
}
function Maj(a, b, c) {
    return a & b ^ a & c ^ b & c;
}
class HashMD extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Hash"] {
    constructor(blockLen, outputLen, padOffset, isLE){
        super();
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE;
        this.buffer = new Uint8Array(blockLen);
        this.view = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createView"])(this.buffer);
    }
    update(data) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["aexists"])(this);
        data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toBytes"])(data);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["abytes"])(data);
        const { view, buffer, blockLen } = this;
        const len = data.length;
        for(let pos = 0; pos < len;){
            const take = Math.min(blockLen - this.pos, len - pos);
            // Fast path: we have at least one block in input, cast it to view and process
            if (take === blockLen) {
                const dataView = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createView"])(data);
                for(; blockLen <= len - pos; pos += blockLen)this.process(dataView, pos);
                continue;
            }
            buffer.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
                this.process(view, 0);
                this.pos = 0;
            }
        }
        this.length += data.length;
        this.roundClean();
        return this;
    }
    digestInto(out) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["aexists"])(this);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["aoutput"])(out, this);
        this.finished = true;
        // Padding
        // We can avoid allocation of buffer for padding completely if it
        // was previously not allocated here. But it won't change performance.
        const { buffer, view, blockLen, isLE } = this;
        let { pos } = this;
        // append the bit '1' to the message
        buffer[pos++] = 0b10000000;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clean"])(this.buffer.subarray(pos));
        // we have less than padOffset left in buffer, so we cannot put length in
        // current block, need process it and pad again
        if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            pos = 0;
        }
        // Pad until full block byte with zeros
        for(let i = pos; i < blockLen; i++)buffer[i] = 0;
        // Note: sha512 requires length to be 128bit integer, but length in JS will overflow before that
        // You need to write around 2 exabytes (u64_max / 8 / (1024**6)) for this to happen.
        // So we just write lowest 64 bits of that value.
        setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
        this.process(view, 0);
        const oview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createView"])(out);
        const len = this.outputLen;
        // NOTE: we do division by 4 later, which should be fused in single op with modulo by JIT
        if (len % 4) throw new Error('_sha2: outputLen should be aligned to 32bit');
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length) throw new Error('_sha2: outputLen bigger than state');
        for(let i = 0; i < outLen; i++)oview.setUint32(4 * i, state[i], isLE);
    }
    digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
    }
    _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.destroyed = destroyed;
        to.finished = finished;
        to.length = length;
        to.pos = pos;
        if (length % blockLen) to.buffer.set(buffer);
        return to;
    }
    clone() {
        return this._cloneInto();
    }
}
const SHA256_IV = /* @__PURE__ */ Uint32Array.from([
    0x6a09e667,
    0xbb67ae85,
    0x3c6ef372,
    0xa54ff53a,
    0x510e527f,
    0x9b05688c,
    0x1f83d9ab,
    0x5be0cd19
]);
const SHA224_IV = /* @__PURE__ */ Uint32Array.from([
    0xc1059ed8,
    0x367cd507,
    0x3070dd17,
    0xf70e5939,
    0xffc00b31,
    0x68581511,
    0x64f98fa7,
    0xbefa4fa4
]);
const SHA384_IV = /* @__PURE__ */ Uint32Array.from([
    0xcbbb9d5d,
    0xc1059ed8,
    0x629a292a,
    0x367cd507,
    0x9159015a,
    0x3070dd17,
    0x152fecd8,
    0xf70e5939,
    0x67332667,
    0xffc00b31,
    0x8eb44a87,
    0x68581511,
    0xdb0c2e0d,
    0x64f98fa7,
    0x47b5481d,
    0xbefa4fa4
]);
const SHA512_IV = /* @__PURE__ */ Uint32Array.from([
    0x6a09e667,
    0xf3bcc908,
    0xbb67ae85,
    0x84caa73b,
    0x3c6ef372,
    0xfe94f82b,
    0xa54ff53a,
    0x5f1d36f1,
    0x510e527f,
    0xade682d1,
    0x9b05688c,
    0x2b3e6c1f,
    0x1f83d9ab,
    0xfb41bd6b,
    0x5be0cd19,
    0x137e2179
]); //# sourceMappingURL=_md.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@noble/hashes/esm/_u64.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Internal helpers for u64. BigUint64Array is too slow as per 2025, so we implement it using Uint32Array.
 * @todo re-check https://issues.chromium.org/issues/42212588
 * @module
 */ __turbopack_context__.s([
    "add",
    ()=>add,
    "add3H",
    ()=>add3H,
    "add3L",
    ()=>add3L,
    "add4H",
    ()=>add4H,
    "add4L",
    ()=>add4L,
    "add5H",
    ()=>add5H,
    "add5L",
    ()=>add5L,
    "default",
    ()=>__TURBOPACK__default__export__,
    "fromBig",
    ()=>fromBig,
    "rotlBH",
    ()=>rotlBH,
    "rotlBL",
    ()=>rotlBL,
    "rotlSH",
    ()=>rotlSH,
    "rotlSL",
    ()=>rotlSL,
    "rotr32H",
    ()=>rotr32H,
    "rotr32L",
    ()=>rotr32L,
    "rotrBH",
    ()=>rotrBH,
    "rotrBL",
    ()=>rotrBL,
    "rotrSH",
    ()=>rotrSH,
    "rotrSL",
    ()=>rotrSL,
    "shrSH",
    ()=>shrSH,
    "shrSL",
    ()=>shrSL,
    "split",
    ()=>split,
    "toBig",
    ()=>toBig
]);
const U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
const _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
    if (le) return {
        h: Number(n & U32_MASK64),
        l: Number(n >> _32n & U32_MASK64)
    };
    return {
        h: Number(n >> _32n & U32_MASK64) | 0,
        l: Number(n & U32_MASK64) | 0
    };
}
function split(lst, le = false) {
    const len = lst.length;
    let Ah = new Uint32Array(len);
    let Al = new Uint32Array(len);
    for(let i = 0; i < len; i++){
        const { h, l } = fromBig(lst[i], le);
        [Ah[i], Al[i]] = [
            h,
            l
        ];
    }
    return [
        Ah,
        Al
    ];
}
const toBig = (h, l)=>BigInt(h >>> 0) << _32n | BigInt(l >>> 0);
// for Shift in [0, 32)
const shrSH = (h, _l, s)=>h >>> s;
const shrSL = (h, l, s)=>h << 32 - s | l >>> s;
// Right rotate for Shift in [1, 32)
const rotrSH = (h, l, s)=>h >>> s | l << 32 - s;
const rotrSL = (h, l, s)=>h << 32 - s | l >>> s;
// Right rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotrBH = (h, l, s)=>h << 64 - s | l >>> s - 32;
const rotrBL = (h, l, s)=>h >>> s - 32 | l << 64 - s;
// Right rotate for shift===32 (just swaps l&h)
const rotr32H = (_h, l)=>l;
const rotr32L = (h, _l)=>h;
// Left rotate for Shift in [1, 32)
const rotlSH = (h, l, s)=>h << s | l >>> 32 - s;
const rotlSL = (h, l, s)=>l << s | h >>> 32 - s;
// Left rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotlBH = (h, l, s)=>l << s - 32 | h >>> 64 - s;
const rotlBL = (h, l, s)=>h << s - 32 | l >>> 64 - s;
// JS uses 32-bit signed integers for bitwise operations which means we cannot
// simple take carry out of low bit sum by shift, we need to use division.
function add(Ah, Al, Bh, Bl) {
    const l = (Al >>> 0) + (Bl >>> 0);
    return {
        h: Ah + Bh + (l / 2 ** 32 | 0) | 0,
        l: l | 0
    };
}
// Addition with more than 2 elements
const add3L = (Al, Bl, Cl)=>(Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
const add3H = (low, Ah, Bh, Ch)=>Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
const add4L = (Al, Bl, Cl, Dl)=>(Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
const add4H = (low, Ah, Bh, Ch, Dh)=>Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
const add5L = (Al, Bl, Cl, Dl, El)=>(Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
const add5H = (low, Ah, Bh, Ch, Dh, Eh)=>Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
;
// prettier-ignore
const u64 = {
    fromBig,
    split,
    toBig,
    shrSH,
    shrSL,
    rotrSH,
    rotrSL,
    rotrBH,
    rotrBL,
    rotr32H,
    rotr32L,
    rotlSH,
    rotlSL,
    rotlBH,
    rotlBL,
    add,
    add3L,
    add3H,
    add4L,
    add4H,
    add5H,
    add5L
};
const __TURBOPACK__default__export__ = u64;
 //# sourceMappingURL=_u64.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@noble/hashes/esm/sha2.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * SHA2 hash function. A.k.a. sha256, sha384, sha512, sha512_224, sha512_256.
 * SHA256 is the fastest hash implementable in JS, even faster than Blake3.
 * Check out [RFC 4634](https://datatracker.ietf.org/doc/html/rfc4634) and
 * [FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf).
 * @module
 */ __turbopack_context__.s([
    "SHA224",
    ()=>SHA224,
    "SHA256",
    ()=>SHA256,
    "SHA384",
    ()=>SHA384,
    "SHA512",
    ()=>SHA512,
    "SHA512_224",
    ()=>SHA512_224,
    "SHA512_256",
    ()=>SHA512_256,
    "sha224",
    ()=>sha224,
    "sha256",
    ()=>sha256,
    "sha384",
    ()=>sha384,
    "sha512",
    ()=>sha512,
    "sha512_224",
    ()=>sha512_224,
    "sha512_256",
    ()=>sha512_256
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@noble/hashes/esm/_md.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@noble/hashes/esm/_u64.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@noble/hashes/esm/utils.js [app-ssr] (ecmascript)");
;
;
;
/**
 * Round constants:
 * First 32 bits of fractional parts of the cube roots of the first 64 primes 2..311)
 */ // prettier-ignore
const SHA256_K = /* @__PURE__ */ Uint32Array.from([
    0x428a2f98,
    0x71374491,
    0xb5c0fbcf,
    0xe9b5dba5,
    0x3956c25b,
    0x59f111f1,
    0x923f82a4,
    0xab1c5ed5,
    0xd807aa98,
    0x12835b01,
    0x243185be,
    0x550c7dc3,
    0x72be5d74,
    0x80deb1fe,
    0x9bdc06a7,
    0xc19bf174,
    0xe49b69c1,
    0xefbe4786,
    0x0fc19dc6,
    0x240ca1cc,
    0x2de92c6f,
    0x4a7484aa,
    0x5cb0a9dc,
    0x76f988da,
    0x983e5152,
    0xa831c66d,
    0xb00327c8,
    0xbf597fc7,
    0xc6e00bf3,
    0xd5a79147,
    0x06ca6351,
    0x14292967,
    0x27b70a85,
    0x2e1b2138,
    0x4d2c6dfc,
    0x53380d13,
    0x650a7354,
    0x766a0abb,
    0x81c2c92e,
    0x92722c85,
    0xa2bfe8a1,
    0xa81a664b,
    0xc24b8b70,
    0xc76c51a3,
    0xd192e819,
    0xd6990624,
    0xf40e3585,
    0x106aa070,
    0x19a4c116,
    0x1e376c08,
    0x2748774c,
    0x34b0bcb5,
    0x391c0cb3,
    0x4ed8aa4a,
    0x5b9cca4f,
    0x682e6ff3,
    0x748f82ee,
    0x78a5636f,
    0x84c87814,
    0x8cc70208,
    0x90befffa,
    0xa4506ceb,
    0xbef9a3f7,
    0xc67178f2
]);
/** Reusable temporary buffer. "W" comes straight from spec. */ const SHA256_W = /* @__PURE__ */ new Uint32Array(64);
class SHA256 extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HashMD"] {
    constructor(outputLen = 32){
        super(64, outputLen, 8, false);
        // We cannot use array here since array allows indexing by variable
        // which means optimizer/compiler cannot use registers.
        this.A = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA256_IV"][0] | 0;
        this.B = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA256_IV"][1] | 0;
        this.C = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA256_IV"][2] | 0;
        this.D = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA256_IV"][3] | 0;
        this.E = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA256_IV"][4] | 0;
        this.F = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA256_IV"][5] | 0;
        this.G = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA256_IV"][6] | 0;
        this.H = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA256_IV"][7] | 0;
    }
    get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [
            A,
            B,
            C,
            D,
            E,
            F,
            G,
            H
        ];
    }
    // prettier-ignore
    set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
    }
    process(view, offset) {
        // Extend the first 16 words into the remaining 48 words w[16..63] of the message schedule array
        for(let i = 0; i < 16; i++, offset += 4)SHA256_W[i] = view.getUint32(offset, false);
        for(let i = 16; i < 64; i++){
            const W15 = SHA256_W[i - 15];
            const W2 = SHA256_W[i - 2];
            const s0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotr"])(W15, 7) ^ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotr"])(W15, 18) ^ W15 >>> 3;
            const s1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotr"])(W2, 17) ^ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotr"])(W2, 19) ^ W2 >>> 10;
            SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
        }
        // Compression function main loop, 64 rounds
        let { A, B, C, D, E, F, G, H } = this;
        for(let i = 0; i < 64; i++){
            const sigma1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotr"])(E, 6) ^ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotr"])(E, 11) ^ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotr"])(E, 25);
            const T1 = H + sigma1 + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Chi"])(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
            const sigma0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotr"])(A, 2) ^ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotr"])(A, 13) ^ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotr"])(A, 22);
            const T2 = sigma0 + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Maj"])(A, B, C) | 0;
            H = G;
            G = F;
            F = E;
            E = D + T1 | 0;
            D = C;
            C = B;
            B = A;
            A = T1 + T2 | 0;
        }
        // Add the compressed chunk to the current hash value
        A = A + this.A | 0;
        B = B + this.B | 0;
        C = C + this.C | 0;
        D = D + this.D | 0;
        E = E + this.E | 0;
        F = F + this.F | 0;
        G = G + this.G | 0;
        H = H + this.H | 0;
        this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clean"])(SHA256_W);
    }
    destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clean"])(this.buffer);
    }
}
class SHA224 extends SHA256 {
    constructor(){
        super(28);
        this.A = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA224_IV"][0] | 0;
        this.B = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA224_IV"][1] | 0;
        this.C = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA224_IV"][2] | 0;
        this.D = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA224_IV"][3] | 0;
        this.E = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA224_IV"][4] | 0;
        this.F = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA224_IV"][5] | 0;
        this.G = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA224_IV"][6] | 0;
        this.H = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA224_IV"][7] | 0;
    }
}
// SHA2-512 is slower than sha256 in js because u64 operations are slow.
// Round contants
// First 32 bits of the fractional parts of the cube roots of the first 80 primes 2..409
// prettier-ignore
const K512 = /* @__PURE__ */ (()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["split"]([
        '0x428a2f98d728ae22',
        '0x7137449123ef65cd',
        '0xb5c0fbcfec4d3b2f',
        '0xe9b5dba58189dbbc',
        '0x3956c25bf348b538',
        '0x59f111f1b605d019',
        '0x923f82a4af194f9b',
        '0xab1c5ed5da6d8118',
        '0xd807aa98a3030242',
        '0x12835b0145706fbe',
        '0x243185be4ee4b28c',
        '0x550c7dc3d5ffb4e2',
        '0x72be5d74f27b896f',
        '0x80deb1fe3b1696b1',
        '0x9bdc06a725c71235',
        '0xc19bf174cf692694',
        '0xe49b69c19ef14ad2',
        '0xefbe4786384f25e3',
        '0x0fc19dc68b8cd5b5',
        '0x240ca1cc77ac9c65',
        '0x2de92c6f592b0275',
        '0x4a7484aa6ea6e483',
        '0x5cb0a9dcbd41fbd4',
        '0x76f988da831153b5',
        '0x983e5152ee66dfab',
        '0xa831c66d2db43210',
        '0xb00327c898fb213f',
        '0xbf597fc7beef0ee4',
        '0xc6e00bf33da88fc2',
        '0xd5a79147930aa725',
        '0x06ca6351e003826f',
        '0x142929670a0e6e70',
        '0x27b70a8546d22ffc',
        '0x2e1b21385c26c926',
        '0x4d2c6dfc5ac42aed',
        '0x53380d139d95b3df',
        '0x650a73548baf63de',
        '0x766a0abb3c77b2a8',
        '0x81c2c92e47edaee6',
        '0x92722c851482353b',
        '0xa2bfe8a14cf10364',
        '0xa81a664bbc423001',
        '0xc24b8b70d0f89791',
        '0xc76c51a30654be30',
        '0xd192e819d6ef5218',
        '0xd69906245565a910',
        '0xf40e35855771202a',
        '0x106aa07032bbd1b8',
        '0x19a4c116b8d2d0c8',
        '0x1e376c085141ab53',
        '0x2748774cdf8eeb99',
        '0x34b0bcb5e19b48a8',
        '0x391c0cb3c5c95a63',
        '0x4ed8aa4ae3418acb',
        '0x5b9cca4f7763e373',
        '0x682e6ff3d6b2b8a3',
        '0x748f82ee5defb2fc',
        '0x78a5636f43172f60',
        '0x84c87814a1f0ab72',
        '0x8cc702081a6439ec',
        '0x90befffa23631e28',
        '0xa4506cebde82bde9',
        '0xbef9a3f7b2c67915',
        '0xc67178f2e372532b',
        '0xca273eceea26619c',
        '0xd186b8c721c0c207',
        '0xeada7dd6cde0eb1e',
        '0xf57d4f7fee6ed178',
        '0x06f067aa72176fba',
        '0x0a637dc5a2c898a6',
        '0x113f9804bef90dae',
        '0x1b710b35131c471b',
        '0x28db77f523047d84',
        '0x32caab7b40c72493',
        '0x3c9ebe0a15c9bebc',
        '0x431d67c49c100d4c',
        '0x4cc5d4becb3e42b6',
        '0x597f299cfc657e2a',
        '0x5fcb6fab3ad6faec',
        '0x6c44198c4a475817'
    ].map((n)=>BigInt(n))))();
const SHA512_Kh = /* @__PURE__ */ (()=>K512[0])();
const SHA512_Kl = /* @__PURE__ */ (()=>K512[1])();
// Reusable temporary buffers
const SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
const SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
class SHA512 extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HashMD"] {
    constructor(outputLen = 64){
        super(128, outputLen, 16, false);
        // We cannot use array here since array allows indexing by variable
        // which means optimizer/compiler cannot use registers.
        // h -- high 32 bits, l -- low 32 bits
        this.Ah = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA512_IV"][0] | 0;
        this.Al = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA512_IV"][1] | 0;
        this.Bh = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA512_IV"][2] | 0;
        this.Bl = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA512_IV"][3] | 0;
        this.Ch = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA512_IV"][4] | 0;
        this.Cl = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA512_IV"][5] | 0;
        this.Dh = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA512_IV"][6] | 0;
        this.Dl = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA512_IV"][7] | 0;
        this.Eh = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA512_IV"][8] | 0;
        this.El = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA512_IV"][9] | 0;
        this.Fh = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA512_IV"][10] | 0;
        this.Fl = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA512_IV"][11] | 0;
        this.Gh = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA512_IV"][12] | 0;
        this.Gl = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA512_IV"][13] | 0;
        this.Hh = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA512_IV"][14] | 0;
        this.Hl = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA512_IV"][15] | 0;
    }
    // prettier-ignore
    get() {
        const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        return [
            Ah,
            Al,
            Bh,
            Bl,
            Ch,
            Cl,
            Dh,
            Dl,
            Eh,
            El,
            Fh,
            Fl,
            Gh,
            Gl,
            Hh,
            Hl
        ];
    }
    // prettier-ignore
    set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
        this.Ah = Ah | 0;
        this.Al = Al | 0;
        this.Bh = Bh | 0;
        this.Bl = Bl | 0;
        this.Ch = Ch | 0;
        this.Cl = Cl | 0;
        this.Dh = Dh | 0;
        this.Dl = Dl | 0;
        this.Eh = Eh | 0;
        this.El = El | 0;
        this.Fh = Fh | 0;
        this.Fl = Fl | 0;
        this.Gh = Gh | 0;
        this.Gl = Gl | 0;
        this.Hh = Hh | 0;
        this.Hl = Hl | 0;
    }
    process(view, offset) {
        // Extend the first 16 words into the remaining 64 words w[16..79] of the message schedule array
        for(let i = 0; i < 16; i++, offset += 4){
            SHA512_W_H[i] = view.getUint32(offset);
            SHA512_W_L[i] = view.getUint32(offset += 4);
        }
        for(let i = 16; i < 80; i++){
            // s0 := (w[i-15] rightrotate 1) xor (w[i-15] rightrotate 8) xor (w[i-15] rightshift 7)
            const W15h = SHA512_W_H[i - 15] | 0;
            const W15l = SHA512_W_L[i - 15] | 0;
            const s0h = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotrSH"](W15h, W15l, 1) ^ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotrSH"](W15h, W15l, 8) ^ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shrSH"](W15h, W15l, 7);
            const s0l = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotrSL"](W15h, W15l, 1) ^ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotrSL"](W15h, W15l, 8) ^ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shrSL"](W15h, W15l, 7);
            // s1 := (w[i-2] rightrotate 19) xor (w[i-2] rightrotate 61) xor (w[i-2] rightshift 6)
            const W2h = SHA512_W_H[i - 2] | 0;
            const W2l = SHA512_W_L[i - 2] | 0;
            const s1h = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotrSH"](W2h, W2l, 19) ^ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotrBH"](W2h, W2l, 61) ^ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shrSH"](W2h, W2l, 6);
            const s1l = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotrSL"](W2h, W2l, 19) ^ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotrBL"](W2h, W2l, 61) ^ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shrSL"](W2h, W2l, 6);
            // SHA256_W[i] = s0 + s1 + SHA256_W[i - 7] + SHA256_W[i - 16];
            const SUMl = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["add4L"](s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
            const SUMh = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["add4H"](SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
            SHA512_W_H[i] = SUMh | 0;
            SHA512_W_L[i] = SUMl | 0;
        }
        let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        // Compression function main loop, 80 rounds
        for(let i = 0; i < 80; i++){
            // S1 := (e rightrotate 14) xor (e rightrotate 18) xor (e rightrotate 41)
            const sigma1h = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotrSH"](Eh, El, 14) ^ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotrSH"](Eh, El, 18) ^ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotrBH"](Eh, El, 41);
            const sigma1l = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotrSL"](Eh, El, 14) ^ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotrSL"](Eh, El, 18) ^ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotrBL"](Eh, El, 41);
            //const T1 = (H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i]) | 0;
            const CHIh = Eh & Fh ^ ~Eh & Gh;
            const CHIl = El & Fl ^ ~El & Gl;
            // T1 = H + sigma1 + Chi(E, F, G) + SHA512_K[i] + SHA512_W[i]
            // prettier-ignore
            const T1ll = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["add5L"](Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
            const T1h = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["add5H"](T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
            const T1l = T1ll | 0;
            // S0 := (a rightrotate 28) xor (a rightrotate 34) xor (a rightrotate 39)
            const sigma0h = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotrSH"](Ah, Al, 28) ^ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotrBH"](Ah, Al, 34) ^ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotrBH"](Ah, Al, 39);
            const sigma0l = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotrSL"](Ah, Al, 28) ^ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotrBL"](Ah, Al, 34) ^ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotrBL"](Ah, Al, 39);
            const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
            const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
            Hh = Gh | 0;
            Hl = Gl | 0;
            Gh = Fh | 0;
            Gl = Fl | 0;
            Fh = Eh | 0;
            Fl = El | 0;
            ({ h: Eh, l: El } = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["add"](Dh | 0, Dl | 0, T1h | 0, T1l | 0));
            Dh = Ch | 0;
            Dl = Cl | 0;
            Ch = Bh | 0;
            Cl = Bl | 0;
            Bh = Ah | 0;
            Bl = Al | 0;
            const All = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["add3L"](T1l, sigma0l, MAJl);
            Ah = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["add3H"](All, T1h, sigma0h, MAJh);
            Al = All | 0;
        }
        // Add the compressed chunk to the current hash value
        ({ h: Ah, l: Al } = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["add"](this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
        ({ h: Bh, l: Bl } = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["add"](this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
        ({ h: Ch, l: Cl } = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["add"](this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
        ({ h: Dh, l: Dl } = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["add"](this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
        ({ h: Eh, l: El } = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["add"](this.Eh | 0, this.El | 0, Eh | 0, El | 0));
        ({ h: Fh, l: Fl } = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["add"](this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
        ({ h: Gh, l: Gl } = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["add"](this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
        ({ h: Hh, l: Hl } = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["add"](this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
        this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
    }
    roundClean() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clean"])(SHA512_W_H, SHA512_W_L);
    }
    destroy() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clean"])(this.buffer);
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
}
class SHA384 extends SHA512 {
    constructor(){
        super(48);
        this.Ah = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA384_IV"][0] | 0;
        this.Al = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA384_IV"][1] | 0;
        this.Bh = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA384_IV"][2] | 0;
        this.Bl = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA384_IV"][3] | 0;
        this.Ch = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA384_IV"][4] | 0;
        this.Cl = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA384_IV"][5] | 0;
        this.Dh = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA384_IV"][6] | 0;
        this.Dl = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA384_IV"][7] | 0;
        this.Eh = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA384_IV"][8] | 0;
        this.El = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA384_IV"][9] | 0;
        this.Fh = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA384_IV"][10] | 0;
        this.Fl = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA384_IV"][11] | 0;
        this.Gh = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA384_IV"][12] | 0;
        this.Gl = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA384_IV"][13] | 0;
        this.Hh = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA384_IV"][14] | 0;
        this.Hl = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_md$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA384_IV"][15] | 0;
    }
}
/**
 * Truncated SHA512/256 and SHA512/224.
 * SHA512_IV is XORed with 0xa5a5a5a5a5a5a5a5, then used as "intermediary" IV of SHA512/t.
 * Then t hashes string to produce result IV.
 * See `test/misc/sha2-gen-iv.js`.
 */ /** SHA512/224 IV */ const T224_IV = /* @__PURE__ */ Uint32Array.from([
    0x8c3d37c8,
    0x19544da2,
    0x73e19966,
    0x89dcd4d6,
    0x1dfab7ae,
    0x32ff9c82,
    0x679dd514,
    0x582f9fcf,
    0x0f6d2b69,
    0x7bd44da8,
    0x77e36f73,
    0x04c48942,
    0x3f9d85a8,
    0x6a1d36c8,
    0x1112e6ad,
    0x91d692a1
]);
/** SHA512/256 IV */ const T256_IV = /* @__PURE__ */ Uint32Array.from([
    0x22312194,
    0xfc2bf72c,
    0x9f555fa3,
    0xc84c64c2,
    0x2393b86b,
    0x6f53b151,
    0x96387719,
    0x5940eabd,
    0x96283ee2,
    0xa88effe3,
    0xbe5e1e25,
    0x53863992,
    0x2b0199fc,
    0x2c85b8aa,
    0x0eb72ddc,
    0x81c52ca2
]);
class SHA512_224 extends SHA512 {
    constructor(){
        super(28);
        this.Ah = T224_IV[0] | 0;
        this.Al = T224_IV[1] | 0;
        this.Bh = T224_IV[2] | 0;
        this.Bl = T224_IV[3] | 0;
        this.Ch = T224_IV[4] | 0;
        this.Cl = T224_IV[5] | 0;
        this.Dh = T224_IV[6] | 0;
        this.Dl = T224_IV[7] | 0;
        this.Eh = T224_IV[8] | 0;
        this.El = T224_IV[9] | 0;
        this.Fh = T224_IV[10] | 0;
        this.Fl = T224_IV[11] | 0;
        this.Gh = T224_IV[12] | 0;
        this.Gl = T224_IV[13] | 0;
        this.Hh = T224_IV[14] | 0;
        this.Hl = T224_IV[15] | 0;
    }
}
class SHA512_256 extends SHA512 {
    constructor(){
        super(32);
        this.Ah = T256_IV[0] | 0;
        this.Al = T256_IV[1] | 0;
        this.Bh = T256_IV[2] | 0;
        this.Bl = T256_IV[3] | 0;
        this.Ch = T256_IV[4] | 0;
        this.Cl = T256_IV[5] | 0;
        this.Dh = T256_IV[6] | 0;
        this.Dl = T256_IV[7] | 0;
        this.Eh = T256_IV[8] | 0;
        this.El = T256_IV[9] | 0;
        this.Fh = T256_IV[10] | 0;
        this.Fl = T256_IV[11] | 0;
        this.Gh = T256_IV[12] | 0;
        this.Gl = T256_IV[13] | 0;
        this.Hh = T256_IV[14] | 0;
        this.Hl = T256_IV[15] | 0;
    }
}
const sha256 = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHasher"])(()=>new SHA256());
const sha224 = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHasher"])(()=>new SHA224());
const sha512 = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHasher"])(()=>new SHA512());
const sha384 = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHasher"])(()=>new SHA384());
const sha512_256 = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHasher"])(()=>new SHA512_256());
const sha512_224 = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHasher"])(()=>new SHA512_224()); //# sourceMappingURL=sha2.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@noble/hashes/esm/sha256.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * SHA2-256 a.k.a. sha256. In JS, it is the fastest hash, even faster than Blake3.
 *
 * To break sha256 using birthday attack, attackers need to try 2^128 hashes.
 * BTC network is doing 2^70 hashes/sec (2^95 hashes/year) as per 2025.
 *
 * Check out [FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf).
 * @module
 * @deprecated
 */ __turbopack_context__.s([
    "SHA224",
    ()=>SHA224,
    "SHA256",
    ()=>SHA256,
    "sha224",
    ()=>sha224,
    "sha256",
    ()=>sha256
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@noble/hashes/esm/sha2.js [app-ssr] (ecmascript)");
;
const SHA256 = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA256"];
const sha256 = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sha256"];
const SHA224 = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHA224"];
const sha224 = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$sha2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sha224"]; //# sourceMappingURL=sha256.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@noble/hashes/esm/sha3.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * SHA3 (keccak) hash function, based on a new "Sponge function" design.
 * Different from older hashes, the internal state is bigger than output size.
 *
 * Check out [FIPS-202](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf),
 * [Website](https://keccak.team/keccak.html),
 * [the differences between SHA-3 and Keccak](https://crypto.stackexchange.com/questions/15727/what-are-the-key-differences-between-the-draft-sha-3-standard-and-the-keccak-sub).
 *
 * Check out `sha3-addons` module for cSHAKE, k12, and others.
 * @module
 */ __turbopack_context__.s([
    "Keccak",
    ()=>Keccak,
    "keccakP",
    ()=>keccakP,
    "keccak_224",
    ()=>keccak_224,
    "keccak_256",
    ()=>keccak_256,
    "keccak_384",
    ()=>keccak_384,
    "keccak_512",
    ()=>keccak_512,
    "sha3_224",
    ()=>sha3_224,
    "sha3_256",
    ()=>sha3_256,
    "sha3_384",
    ()=>sha3_384,
    "sha3_512",
    ()=>sha3_512,
    "shake128",
    ()=>shake128,
    "shake256",
    ()=>shake256
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@noble/hashes/esm/_u64.js [app-ssr] (ecmascript)");
// prettier-ignore
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@noble/hashes/esm/utils.js [app-ssr] (ecmascript)");
;
;
// No __PURE__ annotations in sha3 header:
// EVERYTHING is in fact used on every export.
// Various per round constants calculations
const _0n = BigInt(0);
const _1n = BigInt(1);
const _2n = BigInt(2);
const _7n = BigInt(7);
const _256n = BigInt(256);
const _0x71n = BigInt(0x71);
const SHA3_PI = [];
const SHA3_ROTL = [];
const _SHA3_IOTA = [];
for(let round = 0, R = _1n, x = 1, y = 0; round < 24; round++){
    // Pi
    [x, y] = [
        y,
        (2 * x + 3 * y) % 5
    ];
    SHA3_PI.push(2 * (5 * y + x));
    // Rotational
    SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
    // Iota
    let t = _0n;
    for(let j = 0; j < 7; j++){
        R = (R << _1n ^ (R >> _7n) * _0x71n) % _256n;
        if (R & _2n) t ^= _1n << (_1n << /* @__PURE__ */ BigInt(j)) - _1n;
    }
    _SHA3_IOTA.push(t);
}
const IOTAS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["split"])(_SHA3_IOTA, true);
const SHA3_IOTA_H = IOTAS[0];
const SHA3_IOTA_L = IOTAS[1];
// Left rotation (without 0, 32, 64)
const rotlH = (h, l, s)=>s > 32 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotlBH"])(h, l, s) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotlSH"])(h, l, s);
const rotlL = (h, l, s)=>s > 32 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotlBL"])(h, l, s) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$_u64$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rotlSL"])(h, l, s);
function keccakP(s, rounds = 24) {
    const B = new Uint32Array(5 * 2);
    // NOTE: all indices are x2 since we store state as u32 instead of u64 (bigints to slow in js)
    for(let round = 24 - rounds; round < 24; round++){
        // Theta θ
        for(let x = 0; x < 10; x++)B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
        for(let x = 0; x < 10; x += 2){
            const idx1 = (x + 8) % 10;
            const idx0 = (x + 2) % 10;
            const B0 = B[idx0];
            const B1 = B[idx0 + 1];
            const Th = rotlH(B0, B1, 1) ^ B[idx1];
            const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
            for(let y = 0; y < 50; y += 10){
                s[x + y] ^= Th;
                s[x + y + 1] ^= Tl;
            }
        }
        // Rho (ρ) and Pi (π)
        let curH = s[2];
        let curL = s[3];
        for(let t = 0; t < 24; t++){
            const shift = SHA3_ROTL[t];
            const Th = rotlH(curH, curL, shift);
            const Tl = rotlL(curH, curL, shift);
            const PI = SHA3_PI[t];
            curH = s[PI];
            curL = s[PI + 1];
            s[PI] = Th;
            s[PI + 1] = Tl;
        }
        // Chi (χ)
        for(let y = 0; y < 50; y += 10){
            for(let x = 0; x < 10; x++)B[x] = s[y + x];
            for(let x = 0; x < 10; x++)s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
        }
        // Iota (ι)
        s[0] ^= SHA3_IOTA_H[round];
        s[1] ^= SHA3_IOTA_L[round];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clean"])(B);
}
class Keccak extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Hash"] {
    // NOTE: we accept arguments in bytes instead of bits here.
    constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24){
        super();
        this.pos = 0;
        this.posOut = 0;
        this.finished = false;
        this.destroyed = false;
        this.enableXOF = false;
        this.blockLen = blockLen;
        this.suffix = suffix;
        this.outputLen = outputLen;
        this.enableXOF = enableXOF;
        this.rounds = rounds;
        // Can be passed from user as dkLen
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["anumber"])(outputLen);
        // 1600 = 5x5 matrix of 64bit.  1600 bits === 200 bytes
        // 0 < blockLen < 200
        if (!(0 < blockLen && blockLen < 200)) throw new Error('only keccak-f1600 function is supported');
        this.state = new Uint8Array(200);
        this.state32 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u32"])(this.state);
    }
    clone() {
        return this._cloneInto();
    }
    keccak() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["swap32IfBE"])(this.state32);
        keccakP(this.state32, this.rounds);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["swap32IfBE"])(this.state32);
        this.posOut = 0;
        this.pos = 0;
    }
    update(data) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["aexists"])(this);
        data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toBytes"])(data);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["abytes"])(data);
        const { blockLen, state } = this;
        const len = data.length;
        for(let pos = 0; pos < len;){
            const take = Math.min(blockLen - this.pos, len - pos);
            for(let i = 0; i < take; i++)state[this.pos++] ^= data[pos++];
            if (this.pos === blockLen) this.keccak();
        }
        return this;
    }
    finish() {
        if (this.finished) return;
        this.finished = true;
        const { state, suffix, pos, blockLen } = this;
        // Do the padding
        state[pos] ^= suffix;
        if ((suffix & 0x80) !== 0 && pos === blockLen - 1) this.keccak();
        state[blockLen - 1] ^= 0x80;
        this.keccak();
    }
    writeInto(out) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["aexists"])(this, false);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["abytes"])(out);
        this.finish();
        const bufferOut = this.state;
        const { blockLen } = this;
        for(let pos = 0, len = out.length; pos < len;){
            if (this.posOut >= blockLen) this.keccak();
            const take = Math.min(blockLen - this.posOut, len - pos);
            out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
            this.posOut += take;
            pos += take;
        }
        return out;
    }
    xofInto(out) {
        // Sha3/Keccak usage with XOF is probably mistake, only SHAKE instances can do XOF
        if (!this.enableXOF) throw new Error('XOF is not possible for this instance');
        return this.writeInto(out);
    }
    xof(bytes) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["anumber"])(bytes);
        return this.xofInto(new Uint8Array(bytes));
    }
    digestInto(out) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["aoutput"])(out, this);
        if (this.finished) throw new Error('digest() was already called');
        this.writeInto(out);
        this.destroy();
        return out;
    }
    digest() {
        return this.digestInto(new Uint8Array(this.outputLen));
    }
    destroy() {
        this.destroyed = true;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clean"])(this.state);
    }
    _cloneInto(to) {
        const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
        to || (to = new Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
        to.state32.set(this.state32);
        to.pos = this.pos;
        to.posOut = this.posOut;
        to.finished = this.finished;
        to.rounds = rounds;
        // Suffix can change in cSHAKE
        to.suffix = suffix;
        to.outputLen = outputLen;
        to.enableXOF = enableXOF;
        to.destroyed = this.destroyed;
        return to;
    }
}
const gen = (suffix, blockLen, outputLen)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHasher"])(()=>new Keccak(blockLen, suffix, outputLen));
const sha3_224 = /* @__PURE__ */ (()=>gen(0x06, 144, 224 / 8))();
const sha3_256 = /* @__PURE__ */ (()=>gen(0x06, 136, 256 / 8))();
const sha3_384 = /* @__PURE__ */ (()=>gen(0x06, 104, 384 / 8))();
const sha3_512 = /* @__PURE__ */ (()=>gen(0x06, 72, 512 / 8))();
const keccak_224 = /* @__PURE__ */ (()=>gen(0x01, 144, 224 / 8))();
const keccak_256 = /* @__PURE__ */ (()=>gen(0x01, 136, 256 / 8))();
const keccak_384 = /* @__PURE__ */ (()=>gen(0x01, 104, 384 / 8))();
const keccak_512 = /* @__PURE__ */ (()=>gen(0x01, 72, 512 / 8))();
const genShake = (suffix, blockLen, outputLen)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createXOFer"])((opts = {})=>new Keccak(blockLen, suffix, opts.dkLen === undefined ? outputLen : opts.dkLen, true));
const shake128 = /* @__PURE__ */ (()=>genShake(0x1f, 168, 128 / 8))();
const shake256 = /* @__PURE__ */ (()=>genShake(0x1f, 136, 256 / 8))(); //# sourceMappingURL=sha3.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@noble/hashes/esm/hmac.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * HMAC: RFC2104 message authentication code.
 * @module
 */ __turbopack_context__.s([
    "HMAC",
    ()=>HMAC,
    "hmac",
    ()=>hmac
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@noble/hashes/esm/utils.js [app-ssr] (ecmascript)");
;
class HMAC extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Hash"] {
    constructor(hash, _key){
        super();
        this.finished = false;
        this.destroyed = false;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ahash"])(hash);
        const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toBytes"])(_key);
        this.iHash = hash.create();
        if (typeof this.iHash.update !== 'function') throw new Error('Expected instance of class which extends utils.Hash');
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad = new Uint8Array(blockLen);
        // blockLen can be bigger than outputLen
        pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
        for(let i = 0; i < pad.length; i++)pad[i] ^= 0x36;
        this.iHash.update(pad);
        // By doing update (processing of first block) of outer hash here we can re-use it between multiple calls via clone
        this.oHash = hash.create();
        // Undo internal XOR && apply outer XOR
        for(let i = 0; i < pad.length; i++)pad[i] ^= 0x36 ^ 0x5c;
        this.oHash.update(pad);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clean"])(pad);
    }
    update(buf) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["aexists"])(this);
        this.iHash.update(buf);
        return this;
    }
    digestInto(out) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["aexists"])(this);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["abytes"])(out, this.outputLen);
        this.finished = true;
        this.iHash.digestInto(out);
        this.oHash.update(out);
        this.oHash.digestInto(out);
        this.destroy();
    }
    digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
    }
    _cloneInto(to) {
        // Create new instance without calling constructor since key already in state and we don't know it.
        to || (to = Object.create(Object.getPrototypeOf(this), {}));
        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
    }
    clone() {
        return this._cloneInto();
    }
    destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
    }
}
const hmac = (hash, key, message)=>new HMAC(hash, key).update(message).digest();
hmac.create = (hash, key)=>new HMAC(hash, key); //# sourceMappingURL=hmac.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/bn.js/lib/bn.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

(function(module1, exports) {
    'use strict';
    // Utils
    function assert(val, msg) {
        if (!val) throw new Error(msg || 'Assertion failed');
    }
    // Could use `inherits` module, but don't want to move from single file
    // architecture yet.
    function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function() {};
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
    }
    // BN
    function BN(number, base, endian) {
        if (BN.isBN(number)) {
            return number;
        }
        this.negative = 0;
        this.words = null;
        this.length = 0;
        // Reduction context
        this.red = null;
        if (number !== null) {
            if (base === 'le' || base === 'be') {
                endian = base;
                base = 10;
            }
            this._init(number || 0, base || 10, endian || 'be');
        }
    }
    if ("TURBOPACK compile-time truthy", 1) {
        module1.exports = BN;
    } else //TURBOPACK unreachable
    ;
    BN.BN = BN;
    BN.wordSize = 26;
    var Buffer;
    try {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        else {
            Buffer = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)").Buffer;
        }
    } catch (e) {}
    BN.isBN = function isBN(num) {
        if (num instanceof BN) {
            return true;
        }
        return num !== null && typeof num === 'object' && num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
    };
    BN.max = function max(left, right) {
        if (left.cmp(right) > 0) return left;
        return right;
    };
    BN.min = function min(left, right) {
        if (left.cmp(right) < 0) return left;
        return right;
    };
    BN.prototype._init = function init(number, base, endian) {
        if (typeof number === 'number') {
            return this._initNumber(number, base, endian);
        }
        if (typeof number === 'object') {
            return this._initArray(number, base, endian);
        }
        if (base === 'hex') {
            base = 16;
        }
        assert(base === (base | 0) && base >= 2 && base <= 36);
        number = number.toString().replace(/\s+/g, '');
        var start = 0;
        if (number[0] === '-') {
            start++;
            this.negative = 1;
        }
        if (start < number.length) {
            if (base === 16) {
                this._parseHex(number, start, endian);
            } else {
                this._parseBase(number, base, start);
                if (endian === 'le') {
                    this._initArray(this.toArray(), base, endian);
                }
            }
        }
    };
    BN.prototype._initNumber = function _initNumber(number, base, endian) {
        if (number < 0) {
            this.negative = 1;
            number = -number;
        }
        if (number < 0x4000000) {
            this.words = [
                number & 0x3ffffff
            ];
            this.length = 1;
        } else if (number < 0x10000000000000) {
            this.words = [
                number & 0x3ffffff,
                number / 0x4000000 & 0x3ffffff
            ];
            this.length = 2;
        } else {
            assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)
            this.words = [
                number & 0x3ffffff,
                number / 0x4000000 & 0x3ffffff,
                1
            ];
            this.length = 3;
        }
        if (endian !== 'le') return;
        // Reverse the bytes
        this._initArray(this.toArray(), base, endian);
    };
    BN.prototype._initArray = function _initArray(number, base, endian) {
        // Perhaps a Uint8Array
        assert(typeof number.length === 'number');
        if (number.length <= 0) {
            this.words = [
                0
            ];
            this.length = 1;
            return this;
        }
        this.length = Math.ceil(number.length / 3);
        this.words = new Array(this.length);
        for(var i = 0; i < this.length; i++){
            this.words[i] = 0;
        }
        var j, w;
        var off = 0;
        if (endian === 'be') {
            for(i = number.length - 1, j = 0; i >= 0; i -= 3){
                w = number[i] | number[i - 1] << 8 | number[i - 2] << 16;
                this.words[j] |= w << off & 0x3ffffff;
                this.words[j + 1] = w >>> 26 - off & 0x3ffffff;
                off += 24;
                if (off >= 26) {
                    off -= 26;
                    j++;
                }
            }
        } else if (endian === 'le') {
            for(i = 0, j = 0; i < number.length; i += 3){
                w = number[i] | number[i + 1] << 8 | number[i + 2] << 16;
                this.words[j] |= w << off & 0x3ffffff;
                this.words[j + 1] = w >>> 26 - off & 0x3ffffff;
                off += 24;
                if (off >= 26) {
                    off -= 26;
                    j++;
                }
            }
        }
        return this._strip();
    };
    function parseHex4Bits(string, index) {
        var c = string.charCodeAt(index);
        // '0' - '9'
        if (c >= 48 && c <= 57) {
            return c - 48;
        // 'A' - 'F'
        } else if (c >= 65 && c <= 70) {
            return c - 55;
        // 'a' - 'f'
        } else if (c >= 97 && c <= 102) {
            return c - 87;
        } else {
            assert(false, 'Invalid character in ' + string);
        }
    }
    function parseHexByte(string, lowerBound, index) {
        var r = parseHex4Bits(string, index);
        if (index - 1 >= lowerBound) {
            r |= parseHex4Bits(string, index - 1) << 4;
        }
        return r;
    }
    BN.prototype._parseHex = function _parseHex(number, start, endian) {
        // Create possibly bigger array to ensure that it fits the number
        this.length = Math.ceil((number.length - start) / 6);
        this.words = new Array(this.length);
        for(var i = 0; i < this.length; i++){
            this.words[i] = 0;
        }
        // 24-bits chunks
        var off = 0;
        var j = 0;
        var w;
        if (endian === 'be') {
            for(i = number.length - 1; i >= start; i -= 2){
                w = parseHexByte(number, start, i) << off;
                this.words[j] |= w & 0x3ffffff;
                if (off >= 18) {
                    off -= 18;
                    j += 1;
                    this.words[j] |= w >>> 26;
                } else {
                    off += 8;
                }
            }
        } else {
            var parseLength = number.length - start;
            for(i = parseLength % 2 === 0 ? start + 1 : start; i < number.length; i += 2){
                w = parseHexByte(number, start, i) << off;
                this.words[j] |= w & 0x3ffffff;
                if (off >= 18) {
                    off -= 18;
                    j += 1;
                    this.words[j] |= w >>> 26;
                } else {
                    off += 8;
                }
            }
        }
        this._strip();
    };
    function parseBase(str, start, end, mul) {
        var r = 0;
        var b = 0;
        var len = Math.min(str.length, end);
        for(var i = start; i < len; i++){
            var c = str.charCodeAt(i) - 48;
            r *= mul;
            // 'a'
            if (c >= 49) {
                b = c - 49 + 0xa;
            // 'A'
            } else if (c >= 17) {
                b = c - 17 + 0xa;
            // '0' - '9'
            } else {
                b = c;
            }
            assert(c >= 0 && b < mul, 'Invalid character');
            r += b;
        }
        return r;
    }
    BN.prototype._parseBase = function _parseBase(number, base, start) {
        // Initialize as zero
        this.words = [
            0
        ];
        this.length = 1;
        // Find length of limb in base
        for(var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base){
            limbLen++;
        }
        limbLen--;
        limbPow = limbPow / base | 0;
        var total = number.length - start;
        var mod = total % limbLen;
        var end = Math.min(total, total - mod) + start;
        var word = 0;
        for(var i = start; i < end; i += limbLen){
            word = parseBase(number, i, i + limbLen, base);
            this.imuln(limbPow);
            if (this.words[0] + word < 0x4000000) {
                this.words[0] += word;
            } else {
                this._iaddn(word);
            }
        }
        if (mod !== 0) {
            var pow = 1;
            word = parseBase(number, i, number.length, base);
            for(i = 0; i < mod; i++){
                pow *= base;
            }
            this.imuln(pow);
            if (this.words[0] + word < 0x4000000) {
                this.words[0] += word;
            } else {
                this._iaddn(word);
            }
        }
        this._strip();
    };
    BN.prototype.copy = function copy(dest) {
        dest.words = new Array(this.length);
        for(var i = 0; i < this.length; i++){
            dest.words[i] = this.words[i];
        }
        dest.length = this.length;
        dest.negative = this.negative;
        dest.red = this.red;
    };
    function move(dest, src) {
        dest.words = src.words;
        dest.length = src.length;
        dest.negative = src.negative;
        dest.red = src.red;
    }
    BN.prototype._move = function _move(dest) {
        move(dest, this);
    };
    BN.prototype.clone = function clone() {
        var r = new BN(null);
        this.copy(r);
        return r;
    };
    BN.prototype._expand = function _expand(size) {
        while(this.length < size){
            this.words[this.length++] = 0;
        }
        return this;
    };
    // Remove leading `0` from `this`
    BN.prototype._strip = function strip() {
        while(this.length > 1 && this.words[this.length - 1] === 0){
            this.length--;
        }
        return this._normSign();
    };
    BN.prototype._normSign = function _normSign() {
        // -0 = 0
        if (this.length === 1 && this.words[0] === 0) {
            this.negative = 0;
        }
        return this;
    };
    // Check Symbol.for because not everywhere where Symbol defined
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol#Browser_compatibility
    if (typeof Symbol !== 'undefined' && typeof Symbol.for === 'function') {
        try {
            BN.prototype[Symbol.for('nodejs.util.inspect.custom')] = inspect;
        } catch (e) {
            BN.prototype.inspect = inspect;
        }
    } else {
        BN.prototype.inspect = inspect;
    }
    function inspect() {
        return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
    }
    /*

  var zeros = [];
  var groupSizes = [];
  var groupBases = [];

  var s = '';
  var i = -1;
  while (++i < BN.wordSize) {
    zeros[i] = s;
    s += '0';
  }
  groupSizes[0] = 0;
  groupSizes[1] = 0;
  groupBases[0] = 0;
  groupBases[1] = 0;
  var base = 2 - 1;
  while (++base < 36 + 1) {
    var groupSize = 0;
    var groupBase = 1;
    while (groupBase < (1 << BN.wordSize) / base) {
      groupBase *= base;
      groupSize += 1;
    }
    groupSizes[base] = groupSize;
    groupBases[base] = groupBase;
  }

  */ var zeros = [
        '',
        '0',
        '00',
        '000',
        '0000',
        '00000',
        '000000',
        '0000000',
        '00000000',
        '000000000',
        '0000000000',
        '00000000000',
        '000000000000',
        '0000000000000',
        '00000000000000',
        '000000000000000',
        '0000000000000000',
        '00000000000000000',
        '000000000000000000',
        '0000000000000000000',
        '00000000000000000000',
        '000000000000000000000',
        '0000000000000000000000',
        '00000000000000000000000',
        '000000000000000000000000',
        '0000000000000000000000000'
    ];
    var groupSizes = [
        0,
        0,
        25,
        16,
        12,
        11,
        10,
        9,
        8,
        8,
        7,
        7,
        7,
        7,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5
    ];
    var groupBases = [
        0,
        0,
        33554432,
        43046721,
        16777216,
        48828125,
        60466176,
        40353607,
        16777216,
        43046721,
        10000000,
        19487171,
        35831808,
        62748517,
        7529536,
        11390625,
        16777216,
        24137569,
        34012224,
        47045881,
        64000000,
        4084101,
        5153632,
        6436343,
        7962624,
        9765625,
        11881376,
        14348907,
        17210368,
        20511149,
        24300000,
        28629151,
        33554432,
        39135393,
        45435424,
        52521875,
        60466176
    ];
    BN.prototype.toString = function toString(base, padding) {
        base = base || 10;
        padding = padding | 0 || 1;
        var out;
        if (base === 16 || base === 'hex') {
            out = '';
            var off = 0;
            var carry = 0;
            for(var i = 0; i < this.length; i++){
                var w = this.words[i];
                var word = ((w << off | carry) & 0xffffff).toString(16);
                carry = w >>> 24 - off & 0xffffff;
                off += 2;
                if (off >= 26) {
                    off -= 26;
                    i--;
                }
                if (carry !== 0 || i !== this.length - 1) {
                    out = zeros[6 - word.length] + word + out;
                } else {
                    out = word + out;
                }
            }
            if (carry !== 0) {
                out = carry.toString(16) + out;
            }
            while(out.length % padding !== 0){
                out = '0' + out;
            }
            if (this.negative !== 0) {
                out = '-' + out;
            }
            return out;
        }
        if (base === (base | 0) && base >= 2 && base <= 36) {
            // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
            var groupSize = groupSizes[base];
            // var groupBase = Math.pow(base, groupSize);
            var groupBase = groupBases[base];
            out = '';
            var c = this.clone();
            c.negative = 0;
            while(!c.isZero()){
                var r = c.modrn(groupBase).toString(base);
                c = c.idivn(groupBase);
                if (!c.isZero()) {
                    out = zeros[groupSize - r.length] + r + out;
                } else {
                    out = r + out;
                }
            }
            if (this.isZero()) {
                out = '0' + out;
            }
            while(out.length % padding !== 0){
                out = '0' + out;
            }
            if (this.negative !== 0) {
                out = '-' + out;
            }
            return out;
        }
        assert(false, 'Base should be between 2 and 36');
    };
    BN.prototype.toNumber = function toNumber() {
        var ret = this.words[0];
        if (this.length === 2) {
            ret += this.words[1] * 0x4000000;
        } else if (this.length === 3 && this.words[2] === 0x01) {
            // NOTE: at this stage it is known that the top bit is set
            ret += 0x10000000000000 + this.words[1] * 0x4000000;
        } else if (this.length > 2) {
            assert(false, 'Number can only safely store up to 53 bits');
        }
        return this.negative !== 0 ? -ret : ret;
    };
    BN.prototype.toJSON = function toJSON() {
        return this.toString(16, 2);
    };
    if (Buffer) {
        BN.prototype.toBuffer = function toBuffer(endian, length) {
            return this.toArrayLike(Buffer, endian, length);
        };
    }
    BN.prototype.toArray = function toArray(endian, length) {
        return this.toArrayLike(Array, endian, length);
    };
    var allocate = function allocate(ArrayType, size) {
        if (ArrayType.allocUnsafe) {
            return ArrayType.allocUnsafe(size);
        }
        return new ArrayType(size);
    };
    BN.prototype.toArrayLike = function toArrayLike(ArrayType, endian, length) {
        this._strip();
        var byteLength = this.byteLength();
        var reqLength = length || Math.max(1, byteLength);
        assert(byteLength <= reqLength, 'byte array longer than desired length');
        assert(reqLength > 0, 'Requested array length <= 0');
        var res = allocate(ArrayType, reqLength);
        var postfix = endian === 'le' ? 'LE' : 'BE';
        this['_toArrayLike' + postfix](res, byteLength);
        return res;
    };
    BN.prototype._toArrayLikeLE = function _toArrayLikeLE(res, byteLength) {
        var position = 0;
        var carry = 0;
        for(var i = 0, shift = 0; i < this.length; i++){
            var word = this.words[i] << shift | carry;
            res[position++] = word & 0xff;
            if (position < res.length) {
                res[position++] = word >> 8 & 0xff;
            }
            if (position < res.length) {
                res[position++] = word >> 16 & 0xff;
            }
            if (shift === 6) {
                if (position < res.length) {
                    res[position++] = word >> 24 & 0xff;
                }
                carry = 0;
                shift = 0;
            } else {
                carry = word >>> 24;
                shift += 2;
            }
        }
        if (position < res.length) {
            res[position++] = carry;
            while(position < res.length){
                res[position++] = 0;
            }
        }
    };
    BN.prototype._toArrayLikeBE = function _toArrayLikeBE(res, byteLength) {
        var position = res.length - 1;
        var carry = 0;
        for(var i = 0, shift = 0; i < this.length; i++){
            var word = this.words[i] << shift | carry;
            res[position--] = word & 0xff;
            if (position >= 0) {
                res[position--] = word >> 8 & 0xff;
            }
            if (position >= 0) {
                res[position--] = word >> 16 & 0xff;
            }
            if (shift === 6) {
                if (position >= 0) {
                    res[position--] = word >> 24 & 0xff;
                }
                carry = 0;
                shift = 0;
            } else {
                carry = word >>> 24;
                shift += 2;
            }
        }
        if (position >= 0) {
            res[position--] = carry;
            while(position >= 0){
                res[position--] = 0;
            }
        }
    };
    if (Math.clz32) {
        BN.prototype._countBits = function _countBits(w) {
            return 32 - Math.clz32(w);
        };
    } else {
        BN.prototype._countBits = function _countBits(w) {
            var t = w;
            var r = 0;
            if (t >= 0x1000) {
                r += 13;
                t >>>= 13;
            }
            if (t >= 0x40) {
                r += 7;
                t >>>= 7;
            }
            if (t >= 0x8) {
                r += 4;
                t >>>= 4;
            }
            if (t >= 0x02) {
                r += 2;
                t >>>= 2;
            }
            return r + t;
        };
    }
    BN.prototype._zeroBits = function _zeroBits(w) {
        // Short-cut
        if (w === 0) return 26;
        var t = w;
        var r = 0;
        if ((t & 0x1fff) === 0) {
            r += 13;
            t >>>= 13;
        }
        if ((t & 0x7f) === 0) {
            r += 7;
            t >>>= 7;
        }
        if ((t & 0xf) === 0) {
            r += 4;
            t >>>= 4;
        }
        if ((t & 0x3) === 0) {
            r += 2;
            t >>>= 2;
        }
        if ((t & 0x1) === 0) {
            r++;
        }
        return r;
    };
    // Return number of used bits in a BN
    BN.prototype.bitLength = function bitLength() {
        var w = this.words[this.length - 1];
        var hi = this._countBits(w);
        return (this.length - 1) * 26 + hi;
    };
    function toBitArray(num) {
        var w = new Array(num.bitLength());
        for(var bit = 0; bit < w.length; bit++){
            var off = bit / 26 | 0;
            var wbit = bit % 26;
            w[bit] = num.words[off] >>> wbit & 0x01;
        }
        return w;
    }
    // Number of trailing zero bits
    BN.prototype.zeroBits = function zeroBits() {
        if (this.isZero()) return 0;
        var r = 0;
        for(var i = 0; i < this.length; i++){
            var b = this._zeroBits(this.words[i]);
            r += b;
            if (b !== 26) break;
        }
        return r;
    };
    BN.prototype.byteLength = function byteLength() {
        return Math.ceil(this.bitLength() / 8);
    };
    BN.prototype.toTwos = function toTwos(width) {
        if (this.negative !== 0) {
            return this.abs().inotn(width).iaddn(1);
        }
        return this.clone();
    };
    BN.prototype.fromTwos = function fromTwos(width) {
        if (this.testn(width - 1)) {
            return this.notn(width).iaddn(1).ineg();
        }
        return this.clone();
    };
    BN.prototype.isNeg = function isNeg() {
        return this.negative !== 0;
    };
    // Return negative clone of `this`
    BN.prototype.neg = function neg() {
        return this.clone().ineg();
    };
    BN.prototype.ineg = function ineg() {
        if (!this.isZero()) {
            this.negative ^= 1;
        }
        return this;
    };
    // Or `num` with `this` in-place
    BN.prototype.iuor = function iuor(num) {
        while(this.length < num.length){
            this.words[this.length++] = 0;
        }
        for(var i = 0; i < num.length; i++){
            this.words[i] = this.words[i] | num.words[i];
        }
        return this._strip();
    };
    BN.prototype.ior = function ior(num) {
        assert((this.negative | num.negative) === 0);
        return this.iuor(num);
    };
    // Or `num` with `this`
    BN.prototype.or = function or(num) {
        if (this.length > num.length) return this.clone().ior(num);
        return num.clone().ior(this);
    };
    BN.prototype.uor = function uor(num) {
        if (this.length > num.length) return this.clone().iuor(num);
        return num.clone().iuor(this);
    };
    // And `num` with `this` in-place
    BN.prototype.iuand = function iuand(num) {
        // b = min-length(num, this)
        var b;
        if (this.length > num.length) {
            b = num;
        } else {
            b = this;
        }
        for(var i = 0; i < b.length; i++){
            this.words[i] = this.words[i] & num.words[i];
        }
        this.length = b.length;
        return this._strip();
    };
    BN.prototype.iand = function iand(num) {
        assert((this.negative | num.negative) === 0);
        return this.iuand(num);
    };
    // And `num` with `this`
    BN.prototype.and = function and(num) {
        if (this.length > num.length) return this.clone().iand(num);
        return num.clone().iand(this);
    };
    BN.prototype.uand = function uand(num) {
        if (this.length > num.length) return this.clone().iuand(num);
        return num.clone().iuand(this);
    };
    // Xor `num` with `this` in-place
    BN.prototype.iuxor = function iuxor(num) {
        // a.length > b.length
        var a;
        var b;
        if (this.length > num.length) {
            a = this;
            b = num;
        } else {
            a = num;
            b = this;
        }
        for(var i = 0; i < b.length; i++){
            this.words[i] = a.words[i] ^ b.words[i];
        }
        if (this !== a) {
            for(; i < a.length; i++){
                this.words[i] = a.words[i];
            }
        }
        this.length = a.length;
        return this._strip();
    };
    BN.prototype.ixor = function ixor(num) {
        assert((this.negative | num.negative) === 0);
        return this.iuxor(num);
    };
    // Xor `num` with `this`
    BN.prototype.xor = function xor(num) {
        if (this.length > num.length) return this.clone().ixor(num);
        return num.clone().ixor(this);
    };
    BN.prototype.uxor = function uxor(num) {
        if (this.length > num.length) return this.clone().iuxor(num);
        return num.clone().iuxor(this);
    };
    // Not ``this`` with ``width`` bitwidth
    BN.prototype.inotn = function inotn(width) {
        assert(typeof width === 'number' && width >= 0);
        var bytesNeeded = Math.ceil(width / 26) | 0;
        var bitsLeft = width % 26;
        // Extend the buffer with leading zeroes
        this._expand(bytesNeeded);
        if (bitsLeft > 0) {
            bytesNeeded--;
        }
        // Handle complete words
        for(var i = 0; i < bytesNeeded; i++){
            this.words[i] = ~this.words[i] & 0x3ffffff;
        }
        // Handle the residue
        if (bitsLeft > 0) {
            this.words[i] = ~this.words[i] & 0x3ffffff >> 26 - bitsLeft;
        }
        // And remove leading zeroes
        return this._strip();
    };
    BN.prototype.notn = function notn(width) {
        return this.clone().inotn(width);
    };
    // Set `bit` of `this`
    BN.prototype.setn = function setn(bit, val) {
        assert(typeof bit === 'number' && bit >= 0);
        var off = bit / 26 | 0;
        var wbit = bit % 26;
        this._expand(off + 1);
        if (val) {
            this.words[off] = this.words[off] | 1 << wbit;
        } else {
            this.words[off] = this.words[off] & ~(1 << wbit);
        }
        return this._strip();
    };
    // Add `num` to `this` in-place
    BN.prototype.iadd = function iadd(num) {
        var r;
        // negative + positive
        if (this.negative !== 0 && num.negative === 0) {
            this.negative = 0;
            r = this.isub(num);
            this.negative ^= 1;
            return this._normSign();
        // positive + negative
        } else if (this.negative === 0 && num.negative !== 0) {
            num.negative = 0;
            r = this.isub(num);
            num.negative = 1;
            return r._normSign();
        }
        // a.length > b.length
        var a, b;
        if (this.length > num.length) {
            a = this;
            b = num;
        } else {
            a = num;
            b = this;
        }
        var carry = 0;
        for(var i = 0; i < b.length; i++){
            r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
            this.words[i] = r & 0x3ffffff;
            carry = r >>> 26;
        }
        for(; carry !== 0 && i < a.length; i++){
            r = (a.words[i] | 0) + carry;
            this.words[i] = r & 0x3ffffff;
            carry = r >>> 26;
        }
        this.length = a.length;
        if (carry !== 0) {
            this.words[this.length] = carry;
            this.length++;
        // Copy the rest of the words
        } else if (a !== this) {
            for(; i < a.length; i++){
                this.words[i] = a.words[i];
            }
        }
        return this;
    };
    // Add `num` to `this`
    BN.prototype.add = function add(num) {
        var res;
        if (num.negative !== 0 && this.negative === 0) {
            num.negative = 0;
            res = this.sub(num);
            num.negative ^= 1;
            return res;
        } else if (num.negative === 0 && this.negative !== 0) {
            this.negative = 0;
            res = num.sub(this);
            this.negative = 1;
            return res;
        }
        if (this.length > num.length) return this.clone().iadd(num);
        return num.clone().iadd(this);
    };
    // Subtract `num` from `this` in-place
    BN.prototype.isub = function isub(num) {
        // this - (-num) = this + num
        if (num.negative !== 0) {
            num.negative = 0;
            var r = this.iadd(num);
            num.negative = 1;
            return r._normSign();
        // -this - num = -(this + num)
        } else if (this.negative !== 0) {
            this.negative = 0;
            this.iadd(num);
            this.negative = 1;
            return this._normSign();
        }
        // At this point both numbers are positive
        var cmp = this.cmp(num);
        // Optimization - zeroify
        if (cmp === 0) {
            this.negative = 0;
            this.length = 1;
            this.words[0] = 0;
            return this;
        }
        // a > b
        var a, b;
        if (cmp > 0) {
            a = this;
            b = num;
        } else {
            a = num;
            b = this;
        }
        var carry = 0;
        for(var i = 0; i < b.length; i++){
            r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
            carry = r >> 26;
            this.words[i] = r & 0x3ffffff;
        }
        for(; carry !== 0 && i < a.length; i++){
            r = (a.words[i] | 0) + carry;
            carry = r >> 26;
            this.words[i] = r & 0x3ffffff;
        }
        // Copy rest of the words
        if (carry === 0 && i < a.length && a !== this) {
            for(; i < a.length; i++){
                this.words[i] = a.words[i];
            }
        }
        this.length = Math.max(this.length, i);
        if (a !== this) {
            this.negative = 1;
        }
        return this._strip();
    };
    // Subtract `num` from `this`
    BN.prototype.sub = function sub(num) {
        return this.clone().isub(num);
    };
    function smallMulTo(self, num, out) {
        out.negative = num.negative ^ self.negative;
        var len = self.length + num.length | 0;
        out.length = len;
        len = len - 1 | 0;
        // Peel one iteration (compiler can't do it, because of code complexity)
        var a = self.words[0] | 0;
        var b = num.words[0] | 0;
        var r = a * b;
        var lo = r & 0x3ffffff;
        var carry = r / 0x4000000 | 0;
        out.words[0] = lo;
        for(var k = 1; k < len; k++){
            // Sum all words with the same `i + j = k` and accumulate `ncarry`,
            // note that ncarry could be >= 0x3ffffff
            var ncarry = carry >>> 26;
            var rword = carry & 0x3ffffff;
            var maxJ = Math.min(k, num.length - 1);
            for(var j = Math.max(0, k - self.length + 1); j <= maxJ; j++){
                var i = k - j | 0;
                a = self.words[i] | 0;
                b = num.words[j] | 0;
                r = a * b + rword;
                ncarry += r / 0x4000000 | 0;
                rword = r & 0x3ffffff;
            }
            out.words[k] = rword | 0;
            carry = ncarry | 0;
        }
        if (carry !== 0) {
            out.words[k] = carry | 0;
        } else {
            out.length--;
        }
        return out._strip();
    }
    // TODO(indutny): it may be reasonable to omit it for users who don't need
    // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
    // multiplication (like elliptic secp256k1).
    var comb10MulTo = function comb10MulTo(self, num, out) {
        var a = self.words;
        var b = num.words;
        var o = out.words;
        var c = 0;
        var lo;
        var mid;
        var hi;
        var a0 = a[0] | 0;
        var al0 = a0 & 0x1fff;
        var ah0 = a0 >>> 13;
        var a1 = a[1] | 0;
        var al1 = a1 & 0x1fff;
        var ah1 = a1 >>> 13;
        var a2 = a[2] | 0;
        var al2 = a2 & 0x1fff;
        var ah2 = a2 >>> 13;
        var a3 = a[3] | 0;
        var al3 = a3 & 0x1fff;
        var ah3 = a3 >>> 13;
        var a4 = a[4] | 0;
        var al4 = a4 & 0x1fff;
        var ah4 = a4 >>> 13;
        var a5 = a[5] | 0;
        var al5 = a5 & 0x1fff;
        var ah5 = a5 >>> 13;
        var a6 = a[6] | 0;
        var al6 = a6 & 0x1fff;
        var ah6 = a6 >>> 13;
        var a7 = a[7] | 0;
        var al7 = a7 & 0x1fff;
        var ah7 = a7 >>> 13;
        var a8 = a[8] | 0;
        var al8 = a8 & 0x1fff;
        var ah8 = a8 >>> 13;
        var a9 = a[9] | 0;
        var al9 = a9 & 0x1fff;
        var ah9 = a9 >>> 13;
        var b0 = b[0] | 0;
        var bl0 = b0 & 0x1fff;
        var bh0 = b0 >>> 13;
        var b1 = b[1] | 0;
        var bl1 = b1 & 0x1fff;
        var bh1 = b1 >>> 13;
        var b2 = b[2] | 0;
        var bl2 = b2 & 0x1fff;
        var bh2 = b2 >>> 13;
        var b3 = b[3] | 0;
        var bl3 = b3 & 0x1fff;
        var bh3 = b3 >>> 13;
        var b4 = b[4] | 0;
        var bl4 = b4 & 0x1fff;
        var bh4 = b4 >>> 13;
        var b5 = b[5] | 0;
        var bl5 = b5 & 0x1fff;
        var bh5 = b5 >>> 13;
        var b6 = b[6] | 0;
        var bl6 = b6 & 0x1fff;
        var bh6 = b6 >>> 13;
        var b7 = b[7] | 0;
        var bl7 = b7 & 0x1fff;
        var bh7 = b7 >>> 13;
        var b8 = b[8] | 0;
        var bl8 = b8 & 0x1fff;
        var bh8 = b8 >>> 13;
        var b9 = b[9] | 0;
        var bl9 = b9 & 0x1fff;
        var bh9 = b9 >>> 13;
        out.negative = self.negative ^ num.negative;
        out.length = 19;
        /* k = 0 */ lo = Math.imul(al0, bl0);
        mid = Math.imul(al0, bh0);
        mid = mid + Math.imul(ah0, bl0) | 0;
        hi = Math.imul(ah0, bh0);
        var w0 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w0 >>> 26) | 0;
        w0 &= 0x3ffffff;
        /* k = 1 */ lo = Math.imul(al1, bl0);
        mid = Math.imul(al1, bh0);
        mid = mid + Math.imul(ah1, bl0) | 0;
        hi = Math.imul(ah1, bh0);
        lo = lo + Math.imul(al0, bl1) | 0;
        mid = mid + Math.imul(al0, bh1) | 0;
        mid = mid + Math.imul(ah0, bl1) | 0;
        hi = hi + Math.imul(ah0, bh1) | 0;
        var w1 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w1 >>> 26) | 0;
        w1 &= 0x3ffffff;
        /* k = 2 */ lo = Math.imul(al2, bl0);
        mid = Math.imul(al2, bh0);
        mid = mid + Math.imul(ah2, bl0) | 0;
        hi = Math.imul(ah2, bh0);
        lo = lo + Math.imul(al1, bl1) | 0;
        mid = mid + Math.imul(al1, bh1) | 0;
        mid = mid + Math.imul(ah1, bl1) | 0;
        hi = hi + Math.imul(ah1, bh1) | 0;
        lo = lo + Math.imul(al0, bl2) | 0;
        mid = mid + Math.imul(al0, bh2) | 0;
        mid = mid + Math.imul(ah0, bl2) | 0;
        hi = hi + Math.imul(ah0, bh2) | 0;
        var w2 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w2 >>> 26) | 0;
        w2 &= 0x3ffffff;
        /* k = 3 */ lo = Math.imul(al3, bl0);
        mid = Math.imul(al3, bh0);
        mid = mid + Math.imul(ah3, bl0) | 0;
        hi = Math.imul(ah3, bh0);
        lo = lo + Math.imul(al2, bl1) | 0;
        mid = mid + Math.imul(al2, bh1) | 0;
        mid = mid + Math.imul(ah2, bl1) | 0;
        hi = hi + Math.imul(ah2, bh1) | 0;
        lo = lo + Math.imul(al1, bl2) | 0;
        mid = mid + Math.imul(al1, bh2) | 0;
        mid = mid + Math.imul(ah1, bl2) | 0;
        hi = hi + Math.imul(ah1, bh2) | 0;
        lo = lo + Math.imul(al0, bl3) | 0;
        mid = mid + Math.imul(al0, bh3) | 0;
        mid = mid + Math.imul(ah0, bl3) | 0;
        hi = hi + Math.imul(ah0, bh3) | 0;
        var w3 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w3 >>> 26) | 0;
        w3 &= 0x3ffffff;
        /* k = 4 */ lo = Math.imul(al4, bl0);
        mid = Math.imul(al4, bh0);
        mid = mid + Math.imul(ah4, bl0) | 0;
        hi = Math.imul(ah4, bh0);
        lo = lo + Math.imul(al3, bl1) | 0;
        mid = mid + Math.imul(al3, bh1) | 0;
        mid = mid + Math.imul(ah3, bl1) | 0;
        hi = hi + Math.imul(ah3, bh1) | 0;
        lo = lo + Math.imul(al2, bl2) | 0;
        mid = mid + Math.imul(al2, bh2) | 0;
        mid = mid + Math.imul(ah2, bl2) | 0;
        hi = hi + Math.imul(ah2, bh2) | 0;
        lo = lo + Math.imul(al1, bl3) | 0;
        mid = mid + Math.imul(al1, bh3) | 0;
        mid = mid + Math.imul(ah1, bl3) | 0;
        hi = hi + Math.imul(ah1, bh3) | 0;
        lo = lo + Math.imul(al0, bl4) | 0;
        mid = mid + Math.imul(al0, bh4) | 0;
        mid = mid + Math.imul(ah0, bl4) | 0;
        hi = hi + Math.imul(ah0, bh4) | 0;
        var w4 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w4 >>> 26) | 0;
        w4 &= 0x3ffffff;
        /* k = 5 */ lo = Math.imul(al5, bl0);
        mid = Math.imul(al5, bh0);
        mid = mid + Math.imul(ah5, bl0) | 0;
        hi = Math.imul(ah5, bh0);
        lo = lo + Math.imul(al4, bl1) | 0;
        mid = mid + Math.imul(al4, bh1) | 0;
        mid = mid + Math.imul(ah4, bl1) | 0;
        hi = hi + Math.imul(ah4, bh1) | 0;
        lo = lo + Math.imul(al3, bl2) | 0;
        mid = mid + Math.imul(al3, bh2) | 0;
        mid = mid + Math.imul(ah3, bl2) | 0;
        hi = hi + Math.imul(ah3, bh2) | 0;
        lo = lo + Math.imul(al2, bl3) | 0;
        mid = mid + Math.imul(al2, bh3) | 0;
        mid = mid + Math.imul(ah2, bl3) | 0;
        hi = hi + Math.imul(ah2, bh3) | 0;
        lo = lo + Math.imul(al1, bl4) | 0;
        mid = mid + Math.imul(al1, bh4) | 0;
        mid = mid + Math.imul(ah1, bl4) | 0;
        hi = hi + Math.imul(ah1, bh4) | 0;
        lo = lo + Math.imul(al0, bl5) | 0;
        mid = mid + Math.imul(al0, bh5) | 0;
        mid = mid + Math.imul(ah0, bl5) | 0;
        hi = hi + Math.imul(ah0, bh5) | 0;
        var w5 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w5 >>> 26) | 0;
        w5 &= 0x3ffffff;
        /* k = 6 */ lo = Math.imul(al6, bl0);
        mid = Math.imul(al6, bh0);
        mid = mid + Math.imul(ah6, bl0) | 0;
        hi = Math.imul(ah6, bh0);
        lo = lo + Math.imul(al5, bl1) | 0;
        mid = mid + Math.imul(al5, bh1) | 0;
        mid = mid + Math.imul(ah5, bl1) | 0;
        hi = hi + Math.imul(ah5, bh1) | 0;
        lo = lo + Math.imul(al4, bl2) | 0;
        mid = mid + Math.imul(al4, bh2) | 0;
        mid = mid + Math.imul(ah4, bl2) | 0;
        hi = hi + Math.imul(ah4, bh2) | 0;
        lo = lo + Math.imul(al3, bl3) | 0;
        mid = mid + Math.imul(al3, bh3) | 0;
        mid = mid + Math.imul(ah3, bl3) | 0;
        hi = hi + Math.imul(ah3, bh3) | 0;
        lo = lo + Math.imul(al2, bl4) | 0;
        mid = mid + Math.imul(al2, bh4) | 0;
        mid = mid + Math.imul(ah2, bl4) | 0;
        hi = hi + Math.imul(ah2, bh4) | 0;
        lo = lo + Math.imul(al1, bl5) | 0;
        mid = mid + Math.imul(al1, bh5) | 0;
        mid = mid + Math.imul(ah1, bl5) | 0;
        hi = hi + Math.imul(ah1, bh5) | 0;
        lo = lo + Math.imul(al0, bl6) | 0;
        mid = mid + Math.imul(al0, bh6) | 0;
        mid = mid + Math.imul(ah0, bl6) | 0;
        hi = hi + Math.imul(ah0, bh6) | 0;
        var w6 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w6 >>> 26) | 0;
        w6 &= 0x3ffffff;
        /* k = 7 */ lo = Math.imul(al7, bl0);
        mid = Math.imul(al7, bh0);
        mid = mid + Math.imul(ah7, bl0) | 0;
        hi = Math.imul(ah7, bh0);
        lo = lo + Math.imul(al6, bl1) | 0;
        mid = mid + Math.imul(al6, bh1) | 0;
        mid = mid + Math.imul(ah6, bl1) | 0;
        hi = hi + Math.imul(ah6, bh1) | 0;
        lo = lo + Math.imul(al5, bl2) | 0;
        mid = mid + Math.imul(al5, bh2) | 0;
        mid = mid + Math.imul(ah5, bl2) | 0;
        hi = hi + Math.imul(ah5, bh2) | 0;
        lo = lo + Math.imul(al4, bl3) | 0;
        mid = mid + Math.imul(al4, bh3) | 0;
        mid = mid + Math.imul(ah4, bl3) | 0;
        hi = hi + Math.imul(ah4, bh3) | 0;
        lo = lo + Math.imul(al3, bl4) | 0;
        mid = mid + Math.imul(al3, bh4) | 0;
        mid = mid + Math.imul(ah3, bl4) | 0;
        hi = hi + Math.imul(ah3, bh4) | 0;
        lo = lo + Math.imul(al2, bl5) | 0;
        mid = mid + Math.imul(al2, bh5) | 0;
        mid = mid + Math.imul(ah2, bl5) | 0;
        hi = hi + Math.imul(ah2, bh5) | 0;
        lo = lo + Math.imul(al1, bl6) | 0;
        mid = mid + Math.imul(al1, bh6) | 0;
        mid = mid + Math.imul(ah1, bl6) | 0;
        hi = hi + Math.imul(ah1, bh6) | 0;
        lo = lo + Math.imul(al0, bl7) | 0;
        mid = mid + Math.imul(al0, bh7) | 0;
        mid = mid + Math.imul(ah0, bl7) | 0;
        hi = hi + Math.imul(ah0, bh7) | 0;
        var w7 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w7 >>> 26) | 0;
        w7 &= 0x3ffffff;
        /* k = 8 */ lo = Math.imul(al8, bl0);
        mid = Math.imul(al8, bh0);
        mid = mid + Math.imul(ah8, bl0) | 0;
        hi = Math.imul(ah8, bh0);
        lo = lo + Math.imul(al7, bl1) | 0;
        mid = mid + Math.imul(al7, bh1) | 0;
        mid = mid + Math.imul(ah7, bl1) | 0;
        hi = hi + Math.imul(ah7, bh1) | 0;
        lo = lo + Math.imul(al6, bl2) | 0;
        mid = mid + Math.imul(al6, bh2) | 0;
        mid = mid + Math.imul(ah6, bl2) | 0;
        hi = hi + Math.imul(ah6, bh2) | 0;
        lo = lo + Math.imul(al5, bl3) | 0;
        mid = mid + Math.imul(al5, bh3) | 0;
        mid = mid + Math.imul(ah5, bl3) | 0;
        hi = hi + Math.imul(ah5, bh3) | 0;
        lo = lo + Math.imul(al4, bl4) | 0;
        mid = mid + Math.imul(al4, bh4) | 0;
        mid = mid + Math.imul(ah4, bl4) | 0;
        hi = hi + Math.imul(ah4, bh4) | 0;
        lo = lo + Math.imul(al3, bl5) | 0;
        mid = mid + Math.imul(al3, bh5) | 0;
        mid = mid + Math.imul(ah3, bl5) | 0;
        hi = hi + Math.imul(ah3, bh5) | 0;
        lo = lo + Math.imul(al2, bl6) | 0;
        mid = mid + Math.imul(al2, bh6) | 0;
        mid = mid + Math.imul(ah2, bl6) | 0;
        hi = hi + Math.imul(ah2, bh6) | 0;
        lo = lo + Math.imul(al1, bl7) | 0;
        mid = mid + Math.imul(al1, bh7) | 0;
        mid = mid + Math.imul(ah1, bl7) | 0;
        hi = hi + Math.imul(ah1, bh7) | 0;
        lo = lo + Math.imul(al0, bl8) | 0;
        mid = mid + Math.imul(al0, bh8) | 0;
        mid = mid + Math.imul(ah0, bl8) | 0;
        hi = hi + Math.imul(ah0, bh8) | 0;
        var w8 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w8 >>> 26) | 0;
        w8 &= 0x3ffffff;
        /* k = 9 */ lo = Math.imul(al9, bl0);
        mid = Math.imul(al9, bh0);
        mid = mid + Math.imul(ah9, bl0) | 0;
        hi = Math.imul(ah9, bh0);
        lo = lo + Math.imul(al8, bl1) | 0;
        mid = mid + Math.imul(al8, bh1) | 0;
        mid = mid + Math.imul(ah8, bl1) | 0;
        hi = hi + Math.imul(ah8, bh1) | 0;
        lo = lo + Math.imul(al7, bl2) | 0;
        mid = mid + Math.imul(al7, bh2) | 0;
        mid = mid + Math.imul(ah7, bl2) | 0;
        hi = hi + Math.imul(ah7, bh2) | 0;
        lo = lo + Math.imul(al6, bl3) | 0;
        mid = mid + Math.imul(al6, bh3) | 0;
        mid = mid + Math.imul(ah6, bl3) | 0;
        hi = hi + Math.imul(ah6, bh3) | 0;
        lo = lo + Math.imul(al5, bl4) | 0;
        mid = mid + Math.imul(al5, bh4) | 0;
        mid = mid + Math.imul(ah5, bl4) | 0;
        hi = hi + Math.imul(ah5, bh4) | 0;
        lo = lo + Math.imul(al4, bl5) | 0;
        mid = mid + Math.imul(al4, bh5) | 0;
        mid = mid + Math.imul(ah4, bl5) | 0;
        hi = hi + Math.imul(ah4, bh5) | 0;
        lo = lo + Math.imul(al3, bl6) | 0;
        mid = mid + Math.imul(al3, bh6) | 0;
        mid = mid + Math.imul(ah3, bl6) | 0;
        hi = hi + Math.imul(ah3, bh6) | 0;
        lo = lo + Math.imul(al2, bl7) | 0;
        mid = mid + Math.imul(al2, bh7) | 0;
        mid = mid + Math.imul(ah2, bl7) | 0;
        hi = hi + Math.imul(ah2, bh7) | 0;
        lo = lo + Math.imul(al1, bl8) | 0;
        mid = mid + Math.imul(al1, bh8) | 0;
        mid = mid + Math.imul(ah1, bl8) | 0;
        hi = hi + Math.imul(ah1, bh8) | 0;
        lo = lo + Math.imul(al0, bl9) | 0;
        mid = mid + Math.imul(al0, bh9) | 0;
        mid = mid + Math.imul(ah0, bl9) | 0;
        hi = hi + Math.imul(ah0, bh9) | 0;
        var w9 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w9 >>> 26) | 0;
        w9 &= 0x3ffffff;
        /* k = 10 */ lo = Math.imul(al9, bl1);
        mid = Math.imul(al9, bh1);
        mid = mid + Math.imul(ah9, bl1) | 0;
        hi = Math.imul(ah9, bh1);
        lo = lo + Math.imul(al8, bl2) | 0;
        mid = mid + Math.imul(al8, bh2) | 0;
        mid = mid + Math.imul(ah8, bl2) | 0;
        hi = hi + Math.imul(ah8, bh2) | 0;
        lo = lo + Math.imul(al7, bl3) | 0;
        mid = mid + Math.imul(al7, bh3) | 0;
        mid = mid + Math.imul(ah7, bl3) | 0;
        hi = hi + Math.imul(ah7, bh3) | 0;
        lo = lo + Math.imul(al6, bl4) | 0;
        mid = mid + Math.imul(al6, bh4) | 0;
        mid = mid + Math.imul(ah6, bl4) | 0;
        hi = hi + Math.imul(ah6, bh4) | 0;
        lo = lo + Math.imul(al5, bl5) | 0;
        mid = mid + Math.imul(al5, bh5) | 0;
        mid = mid + Math.imul(ah5, bl5) | 0;
        hi = hi + Math.imul(ah5, bh5) | 0;
        lo = lo + Math.imul(al4, bl6) | 0;
        mid = mid + Math.imul(al4, bh6) | 0;
        mid = mid + Math.imul(ah4, bl6) | 0;
        hi = hi + Math.imul(ah4, bh6) | 0;
        lo = lo + Math.imul(al3, bl7) | 0;
        mid = mid + Math.imul(al3, bh7) | 0;
        mid = mid + Math.imul(ah3, bl7) | 0;
        hi = hi + Math.imul(ah3, bh7) | 0;
        lo = lo + Math.imul(al2, bl8) | 0;
        mid = mid + Math.imul(al2, bh8) | 0;
        mid = mid + Math.imul(ah2, bl8) | 0;
        hi = hi + Math.imul(ah2, bh8) | 0;
        lo = lo + Math.imul(al1, bl9) | 0;
        mid = mid + Math.imul(al1, bh9) | 0;
        mid = mid + Math.imul(ah1, bl9) | 0;
        hi = hi + Math.imul(ah1, bh9) | 0;
        var w10 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w10 >>> 26) | 0;
        w10 &= 0x3ffffff;
        /* k = 11 */ lo = Math.imul(al9, bl2);
        mid = Math.imul(al9, bh2);
        mid = mid + Math.imul(ah9, bl2) | 0;
        hi = Math.imul(ah9, bh2);
        lo = lo + Math.imul(al8, bl3) | 0;
        mid = mid + Math.imul(al8, bh3) | 0;
        mid = mid + Math.imul(ah8, bl3) | 0;
        hi = hi + Math.imul(ah8, bh3) | 0;
        lo = lo + Math.imul(al7, bl4) | 0;
        mid = mid + Math.imul(al7, bh4) | 0;
        mid = mid + Math.imul(ah7, bl4) | 0;
        hi = hi + Math.imul(ah7, bh4) | 0;
        lo = lo + Math.imul(al6, bl5) | 0;
        mid = mid + Math.imul(al6, bh5) | 0;
        mid = mid + Math.imul(ah6, bl5) | 0;
        hi = hi + Math.imul(ah6, bh5) | 0;
        lo = lo + Math.imul(al5, bl6) | 0;
        mid = mid + Math.imul(al5, bh6) | 0;
        mid = mid + Math.imul(ah5, bl6) | 0;
        hi = hi + Math.imul(ah5, bh6) | 0;
        lo = lo + Math.imul(al4, bl7) | 0;
        mid = mid + Math.imul(al4, bh7) | 0;
        mid = mid + Math.imul(ah4, bl7) | 0;
        hi = hi + Math.imul(ah4, bh7) | 0;
        lo = lo + Math.imul(al3, bl8) | 0;
        mid = mid + Math.imul(al3, bh8) | 0;
        mid = mid + Math.imul(ah3, bl8) | 0;
        hi = hi + Math.imul(ah3, bh8) | 0;
        lo = lo + Math.imul(al2, bl9) | 0;
        mid = mid + Math.imul(al2, bh9) | 0;
        mid = mid + Math.imul(ah2, bl9) | 0;
        hi = hi + Math.imul(ah2, bh9) | 0;
        var w11 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w11 >>> 26) | 0;
        w11 &= 0x3ffffff;
        /* k = 12 */ lo = Math.imul(al9, bl3);
        mid = Math.imul(al9, bh3);
        mid = mid + Math.imul(ah9, bl3) | 0;
        hi = Math.imul(ah9, bh3);
        lo = lo + Math.imul(al8, bl4) | 0;
        mid = mid + Math.imul(al8, bh4) | 0;
        mid = mid + Math.imul(ah8, bl4) | 0;
        hi = hi + Math.imul(ah8, bh4) | 0;
        lo = lo + Math.imul(al7, bl5) | 0;
        mid = mid + Math.imul(al7, bh5) | 0;
        mid = mid + Math.imul(ah7, bl5) | 0;
        hi = hi + Math.imul(ah7, bh5) | 0;
        lo = lo + Math.imul(al6, bl6) | 0;
        mid = mid + Math.imul(al6, bh6) | 0;
        mid = mid + Math.imul(ah6, bl6) | 0;
        hi = hi + Math.imul(ah6, bh6) | 0;
        lo = lo + Math.imul(al5, bl7) | 0;
        mid = mid + Math.imul(al5, bh7) | 0;
        mid = mid + Math.imul(ah5, bl7) | 0;
        hi = hi + Math.imul(ah5, bh7) | 0;
        lo = lo + Math.imul(al4, bl8) | 0;
        mid = mid + Math.imul(al4, bh8) | 0;
        mid = mid + Math.imul(ah4, bl8) | 0;
        hi = hi + Math.imul(ah4, bh8) | 0;
        lo = lo + Math.imul(al3, bl9) | 0;
        mid = mid + Math.imul(al3, bh9) | 0;
        mid = mid + Math.imul(ah3, bl9) | 0;
        hi = hi + Math.imul(ah3, bh9) | 0;
        var w12 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w12 >>> 26) | 0;
        w12 &= 0x3ffffff;
        /* k = 13 */ lo = Math.imul(al9, bl4);
        mid = Math.imul(al9, bh4);
        mid = mid + Math.imul(ah9, bl4) | 0;
        hi = Math.imul(ah9, bh4);
        lo = lo + Math.imul(al8, bl5) | 0;
        mid = mid + Math.imul(al8, bh5) | 0;
        mid = mid + Math.imul(ah8, bl5) | 0;
        hi = hi + Math.imul(ah8, bh5) | 0;
        lo = lo + Math.imul(al7, bl6) | 0;
        mid = mid + Math.imul(al7, bh6) | 0;
        mid = mid + Math.imul(ah7, bl6) | 0;
        hi = hi + Math.imul(ah7, bh6) | 0;
        lo = lo + Math.imul(al6, bl7) | 0;
        mid = mid + Math.imul(al6, bh7) | 0;
        mid = mid + Math.imul(ah6, bl7) | 0;
        hi = hi + Math.imul(ah6, bh7) | 0;
        lo = lo + Math.imul(al5, bl8) | 0;
        mid = mid + Math.imul(al5, bh8) | 0;
        mid = mid + Math.imul(ah5, bl8) | 0;
        hi = hi + Math.imul(ah5, bh8) | 0;
        lo = lo + Math.imul(al4, bl9) | 0;
        mid = mid + Math.imul(al4, bh9) | 0;
        mid = mid + Math.imul(ah4, bl9) | 0;
        hi = hi + Math.imul(ah4, bh9) | 0;
        var w13 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w13 >>> 26) | 0;
        w13 &= 0x3ffffff;
        /* k = 14 */ lo = Math.imul(al9, bl5);
        mid = Math.imul(al9, bh5);
        mid = mid + Math.imul(ah9, bl5) | 0;
        hi = Math.imul(ah9, bh5);
        lo = lo + Math.imul(al8, bl6) | 0;
        mid = mid + Math.imul(al8, bh6) | 0;
        mid = mid + Math.imul(ah8, bl6) | 0;
        hi = hi + Math.imul(ah8, bh6) | 0;
        lo = lo + Math.imul(al7, bl7) | 0;
        mid = mid + Math.imul(al7, bh7) | 0;
        mid = mid + Math.imul(ah7, bl7) | 0;
        hi = hi + Math.imul(ah7, bh7) | 0;
        lo = lo + Math.imul(al6, bl8) | 0;
        mid = mid + Math.imul(al6, bh8) | 0;
        mid = mid + Math.imul(ah6, bl8) | 0;
        hi = hi + Math.imul(ah6, bh8) | 0;
        lo = lo + Math.imul(al5, bl9) | 0;
        mid = mid + Math.imul(al5, bh9) | 0;
        mid = mid + Math.imul(ah5, bl9) | 0;
        hi = hi + Math.imul(ah5, bh9) | 0;
        var w14 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w14 >>> 26) | 0;
        w14 &= 0x3ffffff;
        /* k = 15 */ lo = Math.imul(al9, bl6);
        mid = Math.imul(al9, bh6);
        mid = mid + Math.imul(ah9, bl6) | 0;
        hi = Math.imul(ah9, bh6);
        lo = lo + Math.imul(al8, bl7) | 0;
        mid = mid + Math.imul(al8, bh7) | 0;
        mid = mid + Math.imul(ah8, bl7) | 0;
        hi = hi + Math.imul(ah8, bh7) | 0;
        lo = lo + Math.imul(al7, bl8) | 0;
        mid = mid + Math.imul(al7, bh8) | 0;
        mid = mid + Math.imul(ah7, bl8) | 0;
        hi = hi + Math.imul(ah7, bh8) | 0;
        lo = lo + Math.imul(al6, bl9) | 0;
        mid = mid + Math.imul(al6, bh9) | 0;
        mid = mid + Math.imul(ah6, bl9) | 0;
        hi = hi + Math.imul(ah6, bh9) | 0;
        var w15 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w15 >>> 26) | 0;
        w15 &= 0x3ffffff;
        /* k = 16 */ lo = Math.imul(al9, bl7);
        mid = Math.imul(al9, bh7);
        mid = mid + Math.imul(ah9, bl7) | 0;
        hi = Math.imul(ah9, bh7);
        lo = lo + Math.imul(al8, bl8) | 0;
        mid = mid + Math.imul(al8, bh8) | 0;
        mid = mid + Math.imul(ah8, bl8) | 0;
        hi = hi + Math.imul(ah8, bh8) | 0;
        lo = lo + Math.imul(al7, bl9) | 0;
        mid = mid + Math.imul(al7, bh9) | 0;
        mid = mid + Math.imul(ah7, bl9) | 0;
        hi = hi + Math.imul(ah7, bh9) | 0;
        var w16 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w16 >>> 26) | 0;
        w16 &= 0x3ffffff;
        /* k = 17 */ lo = Math.imul(al9, bl8);
        mid = Math.imul(al9, bh8);
        mid = mid + Math.imul(ah9, bl8) | 0;
        hi = Math.imul(ah9, bh8);
        lo = lo + Math.imul(al8, bl9) | 0;
        mid = mid + Math.imul(al8, bh9) | 0;
        mid = mid + Math.imul(ah8, bl9) | 0;
        hi = hi + Math.imul(ah8, bh9) | 0;
        var w17 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w17 >>> 26) | 0;
        w17 &= 0x3ffffff;
        /* k = 18 */ lo = Math.imul(al9, bl9);
        mid = Math.imul(al9, bh9);
        mid = mid + Math.imul(ah9, bl9) | 0;
        hi = Math.imul(ah9, bh9);
        var w18 = (c + lo | 0) + ((mid & 0x1fff) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w18 >>> 26) | 0;
        w18 &= 0x3ffffff;
        o[0] = w0;
        o[1] = w1;
        o[2] = w2;
        o[3] = w3;
        o[4] = w4;
        o[5] = w5;
        o[6] = w6;
        o[7] = w7;
        o[8] = w8;
        o[9] = w9;
        o[10] = w10;
        o[11] = w11;
        o[12] = w12;
        o[13] = w13;
        o[14] = w14;
        o[15] = w15;
        o[16] = w16;
        o[17] = w17;
        o[18] = w18;
        if (c !== 0) {
            o[19] = c;
            out.length++;
        }
        return out;
    };
    // Polyfill comb
    if (!Math.imul) {
        comb10MulTo = smallMulTo;
    }
    function bigMulTo(self, num, out) {
        out.negative = num.negative ^ self.negative;
        out.length = self.length + num.length;
        var carry = 0;
        var hncarry = 0;
        for(var k = 0; k < out.length - 1; k++){
            // Sum all words with the same `i + j = k` and accumulate `ncarry`,
            // note that ncarry could be >= 0x3ffffff
            var ncarry = hncarry;
            hncarry = 0;
            var rword = carry & 0x3ffffff;
            var maxJ = Math.min(k, num.length - 1);
            for(var j = Math.max(0, k - self.length + 1); j <= maxJ; j++){
                var i = k - j;
                var a = self.words[i] | 0;
                var b = num.words[j] | 0;
                var r = a * b;
                var lo = r & 0x3ffffff;
                ncarry = ncarry + (r / 0x4000000 | 0) | 0;
                lo = lo + rword | 0;
                rword = lo & 0x3ffffff;
                ncarry = ncarry + (lo >>> 26) | 0;
                hncarry += ncarry >>> 26;
                ncarry &= 0x3ffffff;
            }
            out.words[k] = rword;
            carry = ncarry;
            ncarry = hncarry;
        }
        if (carry !== 0) {
            out.words[k] = carry;
        } else {
            out.length--;
        }
        return out._strip();
    }
    function jumboMulTo(self, num, out) {
        // Temporary disable, see https://github.com/indutny/bn.js/issues/211
        // var fftm = new FFTM();
        // return fftm.mulp(self, num, out);
        return bigMulTo(self, num, out);
    }
    BN.prototype.mulTo = function mulTo(num, out) {
        var res;
        var len = this.length + num.length;
        if (this.length === 10 && num.length === 10) {
            res = comb10MulTo(this, num, out);
        } else if (len < 63) {
            res = smallMulTo(this, num, out);
        } else if (len < 1024) {
            res = bigMulTo(this, num, out);
        } else {
            res = jumboMulTo(this, num, out);
        }
        return res;
    };
    // Cooley-Tukey algorithm for FFT
    // slightly revisited to rely on looping instead of recursion
    function FFTM(x, y) {
        this.x = x;
        this.y = y;
    }
    FFTM.prototype.makeRBT = function makeRBT(N) {
        var t = new Array(N);
        var l = BN.prototype._countBits(N) - 1;
        for(var i = 0; i < N; i++){
            t[i] = this.revBin(i, l, N);
        }
        return t;
    };
    // Returns binary-reversed representation of `x`
    FFTM.prototype.revBin = function revBin(x, l, N) {
        if (x === 0 || x === N - 1) return x;
        var rb = 0;
        for(var i = 0; i < l; i++){
            rb |= (x & 1) << l - i - 1;
            x >>= 1;
        }
        return rb;
    };
    // Performs "tweedling" phase, therefore 'emulating'
    // behaviour of the recursive algorithm
    FFTM.prototype.permute = function permute(rbt, rws, iws, rtws, itws, N) {
        for(var i = 0; i < N; i++){
            rtws[i] = rws[rbt[i]];
            itws[i] = iws[rbt[i]];
        }
    };
    FFTM.prototype.transform = function transform(rws, iws, rtws, itws, N, rbt) {
        this.permute(rbt, rws, iws, rtws, itws, N);
        for(var s = 1; s < N; s <<= 1){
            var l = s << 1;
            var rtwdf = Math.cos(2 * Math.PI / l);
            var itwdf = Math.sin(2 * Math.PI / l);
            for(var p = 0; p < N; p += l){
                var rtwdf_ = rtwdf;
                var itwdf_ = itwdf;
                for(var j = 0; j < s; j++){
                    var re = rtws[p + j];
                    var ie = itws[p + j];
                    var ro = rtws[p + j + s];
                    var io = itws[p + j + s];
                    var rx = rtwdf_ * ro - itwdf_ * io;
                    io = rtwdf_ * io + itwdf_ * ro;
                    ro = rx;
                    rtws[p + j] = re + ro;
                    itws[p + j] = ie + io;
                    rtws[p + j + s] = re - ro;
                    itws[p + j + s] = ie - io;
                    /* jshint maxdepth : false */ if (j !== l) {
                        rx = rtwdf * rtwdf_ - itwdf * itwdf_;
                        itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
                        rtwdf_ = rx;
                    }
                }
            }
        }
    };
    FFTM.prototype.guessLen13b = function guessLen13b(n, m) {
        var N = Math.max(m, n) | 1;
        var odd = N & 1;
        var i = 0;
        for(N = N / 2 | 0; N; N = N >>> 1){
            i++;
        }
        return 1 << i + 1 + odd;
    };
    FFTM.prototype.conjugate = function conjugate(rws, iws, N) {
        if (N <= 1) return;
        for(var i = 0; i < N / 2; i++){
            var t = rws[i];
            rws[i] = rws[N - i - 1];
            rws[N - i - 1] = t;
            t = iws[i];
            iws[i] = -iws[N - i - 1];
            iws[N - i - 1] = -t;
        }
    };
    FFTM.prototype.normalize13b = function normalize13b(ws, N) {
        var carry = 0;
        for(var i = 0; i < N / 2; i++){
            var w = Math.round(ws[2 * i + 1] / N) * 0x2000 + Math.round(ws[2 * i] / N) + carry;
            ws[i] = w & 0x3ffffff;
            if (w < 0x4000000) {
                carry = 0;
            } else {
                carry = w / 0x4000000 | 0;
            }
        }
        return ws;
    };
    FFTM.prototype.convert13b = function convert13b(ws, len, rws, N) {
        var carry = 0;
        for(var i = 0; i < len; i++){
            carry = carry + (ws[i] | 0);
            rws[2 * i] = carry & 0x1fff;
            carry = carry >>> 13;
            rws[2 * i + 1] = carry & 0x1fff;
            carry = carry >>> 13;
        }
        // Pad with zeroes
        for(i = 2 * len; i < N; ++i){
            rws[i] = 0;
        }
        assert(carry === 0);
        assert((carry & ~0x1fff) === 0);
    };
    FFTM.prototype.stub = function stub(N) {
        var ph = new Array(N);
        for(var i = 0; i < N; i++){
            ph[i] = 0;
        }
        return ph;
    };
    FFTM.prototype.mulp = function mulp(x, y, out) {
        var N = 2 * this.guessLen13b(x.length, y.length);
        var rbt = this.makeRBT(N);
        var _ = this.stub(N);
        var rws = new Array(N);
        var rwst = new Array(N);
        var iwst = new Array(N);
        var nrws = new Array(N);
        var nrwst = new Array(N);
        var niwst = new Array(N);
        var rmws = out.words;
        rmws.length = N;
        this.convert13b(x.words, x.length, rws, N);
        this.convert13b(y.words, y.length, nrws, N);
        this.transform(rws, _, rwst, iwst, N, rbt);
        this.transform(nrws, _, nrwst, niwst, N, rbt);
        for(var i = 0; i < N; i++){
            var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
            iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
            rwst[i] = rx;
        }
        this.conjugate(rwst, iwst, N);
        this.transform(rwst, iwst, rmws, _, N, rbt);
        this.conjugate(rmws, _, N);
        this.normalize13b(rmws, N);
        out.negative = x.negative ^ y.negative;
        out.length = x.length + y.length;
        return out._strip();
    };
    // Multiply `this` by `num`
    BN.prototype.mul = function mul(num) {
        var out = new BN(null);
        out.words = new Array(this.length + num.length);
        return this.mulTo(num, out);
    };
    // Multiply employing FFT
    BN.prototype.mulf = function mulf(num) {
        var out = new BN(null);
        out.words = new Array(this.length + num.length);
        return jumboMulTo(this, num, out);
    };
    // In-place Multiplication
    BN.prototype.imul = function imul(num) {
        return this.clone().mulTo(num, this);
    };
    BN.prototype.imuln = function imuln(num) {
        var isNegNum = num < 0;
        if (isNegNum) num = -num;
        assert(typeof num === 'number');
        assert(num < 0x4000000);
        // Carry
        var carry = 0;
        for(var i = 0; i < this.length; i++){
            var w = (this.words[i] | 0) * num;
            var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
            carry >>= 26;
            carry += w / 0x4000000 | 0;
            // NOTE: lo is 27bit maximum
            carry += lo >>> 26;
            this.words[i] = lo & 0x3ffffff;
        }
        if (carry !== 0) {
            this.words[i] = carry;
            this.length++;
        }
        this.length = num === 0 ? 1 : this.length;
        return isNegNum ? this.ineg() : this;
    };
    BN.prototype.muln = function muln(num) {
        return this.clone().imuln(num);
    };
    // `this` * `this`
    BN.prototype.sqr = function sqr() {
        return this.mul(this);
    };
    // `this` * `this` in-place
    BN.prototype.isqr = function isqr() {
        return this.imul(this.clone());
    };
    // Math.pow(`this`, `num`)
    BN.prototype.pow = function pow(num) {
        var w = toBitArray(num);
        if (w.length === 0) return new BN(1);
        // Skip leading zeroes
        var res = this;
        for(var i = 0; i < w.length; i++, res = res.sqr()){
            if (w[i] !== 0) break;
        }
        if (++i < w.length) {
            for(var q = res.sqr(); i < w.length; i++, q = q.sqr()){
                if (w[i] === 0) continue;
                res = res.mul(q);
            }
        }
        return res;
    };
    // Shift-left in-place
    BN.prototype.iushln = function iushln(bits) {
        assert(typeof bits === 'number' && bits >= 0);
        var r = bits % 26;
        var s = (bits - r) / 26;
        var carryMask = 0x3ffffff >>> 26 - r << 26 - r;
        var i;
        if (r !== 0) {
            var carry = 0;
            for(i = 0; i < this.length; i++){
                var newCarry = this.words[i] & carryMask;
                var c = (this.words[i] | 0) - newCarry << r;
                this.words[i] = c | carry;
                carry = newCarry >>> 26 - r;
            }
            if (carry) {
                this.words[i] = carry;
                this.length++;
            }
        }
        if (s !== 0) {
            for(i = this.length - 1; i >= 0; i--){
                this.words[i + s] = this.words[i];
            }
            for(i = 0; i < s; i++){
                this.words[i] = 0;
            }
            this.length += s;
        }
        return this._strip();
    };
    BN.prototype.ishln = function ishln(bits) {
        // TODO(indutny): implement me
        assert(this.negative === 0);
        return this.iushln(bits);
    };
    // Shift-right in-place
    // NOTE: `hint` is a lowest bit before trailing zeroes
    // NOTE: if `extended` is present - it will be filled with destroyed bits
    BN.prototype.iushrn = function iushrn(bits, hint, extended) {
        assert(typeof bits === 'number' && bits >= 0);
        var h;
        if (hint) {
            h = (hint - hint % 26) / 26;
        } else {
            h = 0;
        }
        var r = bits % 26;
        var s = Math.min((bits - r) / 26, this.length);
        var mask = 0x3ffffff ^ 0x3ffffff >>> r << r;
        var maskedWords = extended;
        h -= s;
        h = Math.max(0, h);
        // Extended mode, copy masked part
        if (maskedWords) {
            for(var i = 0; i < s; i++){
                maskedWords.words[i] = this.words[i];
            }
            maskedWords.length = s;
        }
        if (s === 0) {
        // No-op, we should not move anything at all
        } else if (this.length > s) {
            this.length -= s;
            for(i = 0; i < this.length; i++){
                this.words[i] = this.words[i + s];
            }
        } else {
            this.words[0] = 0;
            this.length = 1;
        }
        var carry = 0;
        for(i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--){
            var word = this.words[i] | 0;
            this.words[i] = carry << 26 - r | word >>> r;
            carry = word & mask;
        }
        // Push carried bits as a mask
        if (maskedWords && carry !== 0) {
            maskedWords.words[maskedWords.length++] = carry;
        }
        if (this.length === 0) {
            this.words[0] = 0;
            this.length = 1;
        }
        return this._strip();
    };
    BN.prototype.ishrn = function ishrn(bits, hint, extended) {
        // TODO(indutny): implement me
        assert(this.negative === 0);
        return this.iushrn(bits, hint, extended);
    };
    // Shift-left
    BN.prototype.shln = function shln(bits) {
        return this.clone().ishln(bits);
    };
    BN.prototype.ushln = function ushln(bits) {
        return this.clone().iushln(bits);
    };
    // Shift-right
    BN.prototype.shrn = function shrn(bits) {
        return this.clone().ishrn(bits);
    };
    BN.prototype.ushrn = function ushrn(bits) {
        return this.clone().iushrn(bits);
    };
    // Test if n bit is set
    BN.prototype.testn = function testn(bit) {
        assert(typeof bit === 'number' && bit >= 0);
        var r = bit % 26;
        var s = (bit - r) / 26;
        var q = 1 << r;
        // Fast case: bit is much higher than all existing words
        if (this.length <= s) return false;
        // Check bit and return
        var w = this.words[s];
        return !!(w & q);
    };
    // Return only lowers bits of number (in-place)
    BN.prototype.imaskn = function imaskn(bits) {
        assert(typeof bits === 'number' && bits >= 0);
        var r = bits % 26;
        var s = (bits - r) / 26;
        assert(this.negative === 0, 'imaskn works only with positive numbers');
        if (this.length <= s) {
            return this;
        }
        if (r !== 0) {
            s++;
        }
        this.length = Math.min(s, this.length);
        if (r !== 0) {
            var mask = 0x3ffffff ^ 0x3ffffff >>> r << r;
            this.words[this.length - 1] &= mask;
        }
        return this._strip();
    };
    // Return only lowers bits of number
    BN.prototype.maskn = function maskn(bits) {
        return this.clone().imaskn(bits);
    };
    // Add plain number `num` to `this`
    BN.prototype.iaddn = function iaddn(num) {
        assert(typeof num === 'number');
        assert(num < 0x4000000);
        if (num < 0) return this.isubn(-num);
        // Possible sign change
        if (this.negative !== 0) {
            if (this.length === 1 && (this.words[0] | 0) <= num) {
                this.words[0] = num - (this.words[0] | 0);
                this.negative = 0;
                return this;
            }
            this.negative = 0;
            this.isubn(num);
            this.negative = 1;
            return this;
        }
        // Add without checks
        return this._iaddn(num);
    };
    BN.prototype._iaddn = function _iaddn(num) {
        this.words[0] += num;
        // Carry
        for(var i = 0; i < this.length && this.words[i] >= 0x4000000; i++){
            this.words[i] -= 0x4000000;
            if (i === this.length - 1) {
                this.words[i + 1] = 1;
            } else {
                this.words[i + 1]++;
            }
        }
        this.length = Math.max(this.length, i + 1);
        return this;
    };
    // Subtract plain number `num` from `this`
    BN.prototype.isubn = function isubn(num) {
        assert(typeof num === 'number');
        assert(num < 0x4000000);
        if (num < 0) return this.iaddn(-num);
        if (this.negative !== 0) {
            this.negative = 0;
            this.iaddn(num);
            this.negative = 1;
            return this;
        }
        this.words[0] -= num;
        if (this.length === 1 && this.words[0] < 0) {
            this.words[0] = -this.words[0];
            this.negative = 1;
        } else {
            // Carry
            for(var i = 0; i < this.length && this.words[i] < 0; i++){
                this.words[i] += 0x4000000;
                this.words[i + 1] -= 1;
            }
        }
        return this._strip();
    };
    BN.prototype.addn = function addn(num) {
        return this.clone().iaddn(num);
    };
    BN.prototype.subn = function subn(num) {
        return this.clone().isubn(num);
    };
    BN.prototype.iabs = function iabs() {
        this.negative = 0;
        return this;
    };
    BN.prototype.abs = function abs() {
        return this.clone().iabs();
    };
    BN.prototype._ishlnsubmul = function _ishlnsubmul(num, mul, shift) {
        var len = num.length + shift;
        var i;
        this._expand(len);
        var w;
        var carry = 0;
        for(i = 0; i < num.length; i++){
            w = (this.words[i + shift] | 0) + carry;
            var right = (num.words[i] | 0) * mul;
            w -= right & 0x3ffffff;
            carry = (w >> 26) - (right / 0x4000000 | 0);
            this.words[i + shift] = w & 0x3ffffff;
        }
        for(; i < this.length - shift; i++){
            w = (this.words[i + shift] | 0) + carry;
            carry = w >> 26;
            this.words[i + shift] = w & 0x3ffffff;
        }
        if (carry === 0) return this._strip();
        // Subtraction overflow
        assert(carry === -1);
        carry = 0;
        for(i = 0; i < this.length; i++){
            w = -(this.words[i] | 0) + carry;
            carry = w >> 26;
            this.words[i] = w & 0x3ffffff;
        }
        this.negative = 1;
        return this._strip();
    };
    BN.prototype._wordDiv = function _wordDiv(num, mode) {
        var shift = this.length - num.length;
        var a = this.clone();
        var b = num;
        // Normalize
        var bhi = b.words[b.length - 1] | 0;
        var bhiBits = this._countBits(bhi);
        shift = 26 - bhiBits;
        if (shift !== 0) {
            b = b.ushln(shift);
            a.iushln(shift);
            bhi = b.words[b.length - 1] | 0;
        }
        // Initialize quotient
        var m = a.length - b.length;
        var q;
        if (mode !== 'mod') {
            q = new BN(null);
            q.length = m + 1;
            q.words = new Array(q.length);
            for(var i = 0; i < q.length; i++){
                q.words[i] = 0;
            }
        }
        var diff = a.clone()._ishlnsubmul(b, 1, m);
        if (diff.negative === 0) {
            a = diff;
            if (q) {
                q.words[m] = 1;
            }
        }
        for(var j = m - 1; j >= 0; j--){
            var qj = (a.words[b.length + j] | 0) * 0x4000000 + (a.words[b.length + j - 1] | 0);
            // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
            // (0x7ffffff)
            qj = Math.min(qj / bhi | 0, 0x3ffffff);
            a._ishlnsubmul(b, qj, j);
            while(a.negative !== 0){
                qj--;
                a.negative = 0;
                a._ishlnsubmul(b, 1, j);
                if (!a.isZero()) {
                    a.negative ^= 1;
                }
            }
            if (q) {
                q.words[j] = qj;
            }
        }
        if (q) {
            q._strip();
        }
        a._strip();
        // Denormalize
        if (mode !== 'div' && shift !== 0) {
            a.iushrn(shift);
        }
        return {
            div: q || null,
            mod: a
        };
    };
    // NOTE: 1) `mode` can be set to `mod` to request mod only,
    //       to `div` to request div only, or be absent to
    //       request both div & mod
    //       2) `positive` is true if unsigned mod is requested
    BN.prototype.divmod = function divmod(num, mode, positive) {
        assert(!num.isZero());
        if (this.isZero()) {
            return {
                div: new BN(0),
                mod: new BN(0)
            };
        }
        var div, mod, res;
        if (this.negative !== 0 && num.negative === 0) {
            res = this.neg().divmod(num, mode);
            if (mode !== 'mod') {
                div = res.div.neg();
            }
            if (mode !== 'div') {
                mod = res.mod.neg();
                if (positive && mod.negative !== 0) {
                    mod.iadd(num);
                }
            }
            return {
                div: div,
                mod: mod
            };
        }
        if (this.negative === 0 && num.negative !== 0) {
            res = this.divmod(num.neg(), mode);
            if (mode !== 'mod') {
                div = res.div.neg();
            }
            return {
                div: div,
                mod: res.mod
            };
        }
        if ((this.negative & num.negative) !== 0) {
            res = this.neg().divmod(num.neg(), mode);
            if (mode !== 'div') {
                mod = res.mod.neg();
                if (positive && mod.negative !== 0) {
                    mod.isub(num);
                }
            }
            return {
                div: res.div,
                mod: mod
            };
        }
        // Both numbers are positive at this point
        // Strip both numbers to approximate shift value
        if (num.length > this.length || this.cmp(num) < 0) {
            return {
                div: new BN(0),
                mod: this
            };
        }
        // Very short reduction
        if (num.length === 1) {
            if (mode === 'div') {
                return {
                    div: this.divn(num.words[0]),
                    mod: null
                };
            }
            if (mode === 'mod') {
                return {
                    div: null,
                    mod: new BN(this.modrn(num.words[0]))
                };
            }
            return {
                div: this.divn(num.words[0]),
                mod: new BN(this.modrn(num.words[0]))
            };
        }
        return this._wordDiv(num, mode);
    };
    // Find `this` / `num`
    BN.prototype.div = function div(num) {
        return this.divmod(num, 'div', false).div;
    };
    // Find `this` % `num`
    BN.prototype.mod = function mod(num) {
        return this.divmod(num, 'mod', false).mod;
    };
    BN.prototype.umod = function umod(num) {
        return this.divmod(num, 'mod', true).mod;
    };
    // Find Round(`this` / `num`)
    BN.prototype.divRound = function divRound(num) {
        var dm = this.divmod(num);
        // Fast case - exact division
        if (dm.mod.isZero()) return dm.div;
        var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;
        var half = num.ushrn(1);
        var r2 = num.andln(1);
        var cmp = mod.cmp(half);
        // Round down
        if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div;
        // Round up
        return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
    };
    BN.prototype.modrn = function modrn(num) {
        var isNegNum = num < 0;
        if (isNegNum) num = -num;
        assert(num <= 0x3ffffff);
        var p = (1 << 26) % num;
        var acc = 0;
        for(var i = this.length - 1; i >= 0; i--){
            acc = (p * acc + (this.words[i] | 0)) % num;
        }
        return isNegNum ? -acc : acc;
    };
    // WARNING: DEPRECATED
    BN.prototype.modn = function modn(num) {
        return this.modrn(num);
    };
    // In-place division by number
    BN.prototype.idivn = function idivn(num) {
        var isNegNum = num < 0;
        if (isNegNum) num = -num;
        assert(num <= 0x3ffffff);
        var carry = 0;
        for(var i = this.length - 1; i >= 0; i--){
            var w = (this.words[i] | 0) + carry * 0x4000000;
            this.words[i] = w / num | 0;
            carry = w % num;
        }
        this._strip();
        return isNegNum ? this.ineg() : this;
    };
    BN.prototype.divn = function divn(num) {
        return this.clone().idivn(num);
    };
    BN.prototype.egcd = function egcd(p) {
        assert(p.negative === 0);
        assert(!p.isZero());
        var x = this;
        var y = p.clone();
        if (x.negative !== 0) {
            x = x.umod(p);
        } else {
            x = x.clone();
        }
        // A * x + B * y = x
        var A = new BN(1);
        var B = new BN(0);
        // C * x + D * y = y
        var C = new BN(0);
        var D = new BN(1);
        var g = 0;
        while(x.isEven() && y.isEven()){
            x.iushrn(1);
            y.iushrn(1);
            ++g;
        }
        var yp = y.clone();
        var xp = x.clone();
        while(!x.isZero()){
            for(var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
            if (i > 0) {
                x.iushrn(i);
                while(i-- > 0){
                    if (A.isOdd() || B.isOdd()) {
                        A.iadd(yp);
                        B.isub(xp);
                    }
                    A.iushrn(1);
                    B.iushrn(1);
                }
            }
            for(var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
            if (j > 0) {
                y.iushrn(j);
                while(j-- > 0){
                    if (C.isOdd() || D.isOdd()) {
                        C.iadd(yp);
                        D.isub(xp);
                    }
                    C.iushrn(1);
                    D.iushrn(1);
                }
            }
            if (x.cmp(y) >= 0) {
                x.isub(y);
                A.isub(C);
                B.isub(D);
            } else {
                y.isub(x);
                C.isub(A);
                D.isub(B);
            }
        }
        return {
            a: C,
            b: D,
            gcd: y.iushln(g)
        };
    };
    // This is reduced incarnation of the binary EEA
    // above, designated to invert members of the
    // _prime_ fields F(p) at a maximal speed
    BN.prototype._invmp = function _invmp(p) {
        assert(p.negative === 0);
        assert(!p.isZero());
        var a = this;
        var b = p.clone();
        if (a.negative !== 0) {
            a = a.umod(p);
        } else {
            a = a.clone();
        }
        var x1 = new BN(1);
        var x2 = new BN(0);
        var delta = b.clone();
        while(a.cmpn(1) > 0 && b.cmpn(1) > 0){
            for(var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
            if (i > 0) {
                a.iushrn(i);
                while(i-- > 0){
                    if (x1.isOdd()) {
                        x1.iadd(delta);
                    }
                    x1.iushrn(1);
                }
            }
            for(var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
            if (j > 0) {
                b.iushrn(j);
                while(j-- > 0){
                    if (x2.isOdd()) {
                        x2.iadd(delta);
                    }
                    x2.iushrn(1);
                }
            }
            if (a.cmp(b) >= 0) {
                a.isub(b);
                x1.isub(x2);
            } else {
                b.isub(a);
                x2.isub(x1);
            }
        }
        var res;
        if (a.cmpn(1) === 0) {
            res = x1;
        } else {
            res = x2;
        }
        if (res.cmpn(0) < 0) {
            res.iadd(p);
        }
        return res;
    };
    BN.prototype.gcd = function gcd(num) {
        if (this.isZero()) return num.abs();
        if (num.isZero()) return this.abs();
        var a = this.clone();
        var b = num.clone();
        a.negative = 0;
        b.negative = 0;
        // Remove common factor of two
        for(var shift = 0; a.isEven() && b.isEven(); shift++){
            a.iushrn(1);
            b.iushrn(1);
        }
        do {
            while(a.isEven()){
                a.iushrn(1);
            }
            while(b.isEven()){
                b.iushrn(1);
            }
            var r = a.cmp(b);
            if (r < 0) {
                // Swap `a` and `b` to make `a` always bigger than `b`
                var t = a;
                a = b;
                b = t;
            } else if (r === 0 || b.cmpn(1) === 0) {
                break;
            }
            a.isub(b);
        }while (true)
        return b.iushln(shift);
    };
    // Invert number in the field F(num)
    BN.prototype.invm = function invm(num) {
        return this.egcd(num).a.umod(num);
    };
    BN.prototype.isEven = function isEven() {
        return (this.words[0] & 1) === 0;
    };
    BN.prototype.isOdd = function isOdd() {
        return (this.words[0] & 1) === 1;
    };
    // And first word and num
    BN.prototype.andln = function andln(num) {
        return this.words[0] & num;
    };
    // Increment at the bit position in-line
    BN.prototype.bincn = function bincn(bit) {
        assert(typeof bit === 'number');
        var r = bit % 26;
        var s = (bit - r) / 26;
        var q = 1 << r;
        // Fast case: bit is much higher than all existing words
        if (this.length <= s) {
            this._expand(s + 1);
            this.words[s] |= q;
            return this;
        }
        // Add bit and propagate, if needed
        var carry = q;
        for(var i = s; carry !== 0 && i < this.length; i++){
            var w = this.words[i] | 0;
            w += carry;
            carry = w >>> 26;
            w &= 0x3ffffff;
            this.words[i] = w;
        }
        if (carry !== 0) {
            this.words[i] = carry;
            this.length++;
        }
        return this;
    };
    BN.prototype.isZero = function isZero() {
        return this.length === 1 && this.words[0] === 0;
    };
    BN.prototype.cmpn = function cmpn(num) {
        var negative = num < 0;
        if (this.negative !== 0 && !negative) return -1;
        if (this.negative === 0 && negative) return 1;
        this._strip();
        var res;
        if (this.length > 1) {
            res = 1;
        } else {
            if (negative) {
                num = -num;
            }
            assert(num <= 0x3ffffff, 'Number is too big');
            var w = this.words[0] | 0;
            res = w === num ? 0 : w < num ? -1 : 1;
        }
        if (this.negative !== 0) return -res | 0;
        return res;
    };
    // Compare two numbers and return:
    // 1 - if `this` > `num`
    // 0 - if `this` == `num`
    // -1 - if `this` < `num`
    BN.prototype.cmp = function cmp(num) {
        if (this.negative !== 0 && num.negative === 0) return -1;
        if (this.negative === 0 && num.negative !== 0) return 1;
        var res = this.ucmp(num);
        if (this.negative !== 0) return -res | 0;
        return res;
    };
    // Unsigned comparison
    BN.prototype.ucmp = function ucmp(num) {
        // At this point both numbers have the same sign
        if (this.length > num.length) return 1;
        if (this.length < num.length) return -1;
        var res = 0;
        for(var i = this.length - 1; i >= 0; i--){
            var a = this.words[i] | 0;
            var b = num.words[i] | 0;
            if (a === b) continue;
            if (a < b) {
                res = -1;
            } else if (a > b) {
                res = 1;
            }
            break;
        }
        return res;
    };
    BN.prototype.gtn = function gtn(num) {
        return this.cmpn(num) === 1;
    };
    BN.prototype.gt = function gt(num) {
        return this.cmp(num) === 1;
    };
    BN.prototype.gten = function gten(num) {
        return this.cmpn(num) >= 0;
    };
    BN.prototype.gte = function gte(num) {
        return this.cmp(num) >= 0;
    };
    BN.prototype.ltn = function ltn(num) {
        return this.cmpn(num) === -1;
    };
    BN.prototype.lt = function lt(num) {
        return this.cmp(num) === -1;
    };
    BN.prototype.lten = function lten(num) {
        return this.cmpn(num) <= 0;
    };
    BN.prototype.lte = function lte(num) {
        return this.cmp(num) <= 0;
    };
    BN.prototype.eqn = function eqn(num) {
        return this.cmpn(num) === 0;
    };
    BN.prototype.eq = function eq(num) {
        return this.cmp(num) === 0;
    };
    //
    // A reduce context, could be using montgomery or something better, depending
    // on the `m` itself.
    //
    BN.red = function red(num) {
        return new Red(num);
    };
    BN.prototype.toRed = function toRed(ctx) {
        assert(!this.red, 'Already a number in reduction context');
        assert(this.negative === 0, 'red works only with positives');
        return ctx.convertTo(this)._forceRed(ctx);
    };
    BN.prototype.fromRed = function fromRed() {
        assert(this.red, 'fromRed works only with numbers in reduction context');
        return this.red.convertFrom(this);
    };
    BN.prototype._forceRed = function _forceRed(ctx) {
        this.red = ctx;
        return this;
    };
    BN.prototype.forceRed = function forceRed(ctx) {
        assert(!this.red, 'Already a number in reduction context');
        return this._forceRed(ctx);
    };
    BN.prototype.redAdd = function redAdd(num) {
        assert(this.red, 'redAdd works only with red numbers');
        return this.red.add(this, num);
    };
    BN.prototype.redIAdd = function redIAdd(num) {
        assert(this.red, 'redIAdd works only with red numbers');
        return this.red.iadd(this, num);
    };
    BN.prototype.redSub = function redSub(num) {
        assert(this.red, 'redSub works only with red numbers');
        return this.red.sub(this, num);
    };
    BN.prototype.redISub = function redISub(num) {
        assert(this.red, 'redISub works only with red numbers');
        return this.red.isub(this, num);
    };
    BN.prototype.redShl = function redShl(num) {
        assert(this.red, 'redShl works only with red numbers');
        return this.red.shl(this, num);
    };
    BN.prototype.redMul = function redMul(num) {
        assert(this.red, 'redMul works only with red numbers');
        this.red._verify2(this, num);
        return this.red.mul(this, num);
    };
    BN.prototype.redIMul = function redIMul(num) {
        assert(this.red, 'redMul works only with red numbers');
        this.red._verify2(this, num);
        return this.red.imul(this, num);
    };
    BN.prototype.redSqr = function redSqr() {
        assert(this.red, 'redSqr works only with red numbers');
        this.red._verify1(this);
        return this.red.sqr(this);
    };
    BN.prototype.redISqr = function redISqr() {
        assert(this.red, 'redISqr works only with red numbers');
        this.red._verify1(this);
        return this.red.isqr(this);
    };
    // Square root over p
    BN.prototype.redSqrt = function redSqrt() {
        assert(this.red, 'redSqrt works only with red numbers');
        this.red._verify1(this);
        return this.red.sqrt(this);
    };
    BN.prototype.redInvm = function redInvm() {
        assert(this.red, 'redInvm works only with red numbers');
        this.red._verify1(this);
        return this.red.invm(this);
    };
    // Return negative clone of `this` % `red modulo`
    BN.prototype.redNeg = function redNeg() {
        assert(this.red, 'redNeg works only with red numbers');
        this.red._verify1(this);
        return this.red.neg(this);
    };
    BN.prototype.redPow = function redPow(num) {
        assert(this.red && !num.red, 'redPow(normalNum)');
        this.red._verify1(this);
        return this.red.pow(this, num);
    };
    // Prime numbers with efficient reduction
    var primes = {
        k256: null,
        p224: null,
        p192: null,
        p25519: null
    };
    // Pseudo-Mersenne prime
    function MPrime(name, p) {
        // P = 2 ^ N - K
        this.name = name;
        this.p = new BN(p, 16);
        this.n = this.p.bitLength();
        this.k = new BN(1).iushln(this.n).isub(this.p);
        this.tmp = this._tmp();
    }
    MPrime.prototype._tmp = function _tmp() {
        var tmp = new BN(null);
        tmp.words = new Array(Math.ceil(this.n / 13));
        return tmp;
    };
    MPrime.prototype.ireduce = function ireduce(num) {
        // Assumes that `num` is less than `P^2`
        // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
        var r = num;
        var rlen;
        do {
            this.split(r, this.tmp);
            r = this.imulK(r);
            r = r.iadd(this.tmp);
            rlen = r.bitLength();
        }while (rlen > this.n)
        var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
        if (cmp === 0) {
            r.words[0] = 0;
            r.length = 1;
        } else if (cmp > 0) {
            r.isub(this.p);
        } else {
            if (r.strip !== undefined) {
                // r is a BN v4 instance
                r.strip();
            } else {
                // r is a BN v5 instance
                r._strip();
            }
        }
        return r;
    };
    MPrime.prototype.split = function split(input, out) {
        input.iushrn(this.n, 0, out);
    };
    MPrime.prototype.imulK = function imulK(num) {
        return num.imul(this.k);
    };
    function K256() {
        MPrime.call(this, 'k256', 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
    }
    inherits(K256, MPrime);
    K256.prototype.split = function split(input, output) {
        // 256 = 9 * 26 + 22
        var mask = 0x3fffff;
        var outLen = Math.min(input.length, 9);
        for(var i = 0; i < outLen; i++){
            output.words[i] = input.words[i];
        }
        output.length = outLen;
        if (input.length <= 9) {
            input.words[0] = 0;
            input.length = 1;
            return;
        }
        // Shift by 9 limbs
        var prev = input.words[9];
        output.words[output.length++] = prev & mask;
        for(i = 10; i < input.length; i++){
            var next = input.words[i] | 0;
            input.words[i - 10] = (next & mask) << 4 | prev >>> 22;
            prev = next;
        }
        prev >>>= 22;
        input.words[i - 10] = prev;
        if (prev === 0 && input.length > 10) {
            input.length -= 10;
        } else {
            input.length -= 9;
        }
    };
    K256.prototype.imulK = function imulK(num) {
        // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
        num.words[num.length] = 0;
        num.words[num.length + 1] = 0;
        num.length += 2;
        // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
        var lo = 0;
        for(var i = 0; i < num.length; i++){
            var w = num.words[i] | 0;
            lo += w * 0x3d1;
            num.words[i] = lo & 0x3ffffff;
            lo = w * 0x40 + (lo / 0x4000000 | 0);
        }
        // Fast length reduction
        if (num.words[num.length - 1] === 0) {
            num.length--;
            if (num.words[num.length - 1] === 0) {
                num.length--;
            }
        }
        return num;
    };
    function P224() {
        MPrime.call(this, 'p224', 'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
    }
    inherits(P224, MPrime);
    function P192() {
        MPrime.call(this, 'p192', 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
    }
    inherits(P192, MPrime);
    function P25519() {
        // 2 ^ 255 - 19
        MPrime.call(this, '25519', '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
    }
    inherits(P25519, MPrime);
    P25519.prototype.imulK = function imulK(num) {
        // K = 0x13
        var carry = 0;
        for(var i = 0; i < num.length; i++){
            var hi = (num.words[i] | 0) * 0x13 + carry;
            var lo = hi & 0x3ffffff;
            hi >>>= 26;
            num.words[i] = lo;
            carry = hi;
        }
        if (carry !== 0) {
            num.words[num.length++] = carry;
        }
        return num;
    };
    // Exported mostly for testing purposes, use plain name instead
    BN._prime = function prime(name) {
        // Cached version of prime
        if (primes[name]) return primes[name];
        var prime;
        if (name === 'k256') {
            prime = new K256();
        } else if (name === 'p224') {
            prime = new P224();
        } else if (name === 'p192') {
            prime = new P192();
        } else if (name === 'p25519') {
            prime = new P25519();
        } else {
            throw new Error('Unknown prime ' + name);
        }
        primes[name] = prime;
        return prime;
    };
    //
    // Base reduction engine
    //
    function Red(m) {
        if (typeof m === 'string') {
            var prime = BN._prime(m);
            this.m = prime.p;
            this.prime = prime;
        } else {
            assert(m.gtn(1), 'modulus must be greater than 1');
            this.m = m;
            this.prime = null;
        }
    }
    Red.prototype._verify1 = function _verify1(a) {
        assert(a.negative === 0, 'red works only with positives');
        assert(a.red, 'red works only with red numbers');
    };
    Red.prototype._verify2 = function _verify2(a, b) {
        assert((a.negative | b.negative) === 0, 'red works only with positives');
        assert(a.red && a.red === b.red, 'red works only with red numbers');
    };
    Red.prototype.imod = function imod(a) {
        if (this.prime) return this.prime.ireduce(a)._forceRed(this);
        move(a, a.umod(this.m)._forceRed(this));
        return a;
    };
    Red.prototype.neg = function neg(a) {
        if (a.isZero()) {
            return a.clone();
        }
        return this.m.sub(a)._forceRed(this);
    };
    Red.prototype.add = function add(a, b) {
        this._verify2(a, b);
        var res = a.add(b);
        if (res.cmp(this.m) >= 0) {
            res.isub(this.m);
        }
        return res._forceRed(this);
    };
    Red.prototype.iadd = function iadd(a, b) {
        this._verify2(a, b);
        var res = a.iadd(b);
        if (res.cmp(this.m) >= 0) {
            res.isub(this.m);
        }
        return res;
    };
    Red.prototype.sub = function sub(a, b) {
        this._verify2(a, b);
        var res = a.sub(b);
        if (res.cmpn(0) < 0) {
            res.iadd(this.m);
        }
        return res._forceRed(this);
    };
    Red.prototype.isub = function isub(a, b) {
        this._verify2(a, b);
        var res = a.isub(b);
        if (res.cmpn(0) < 0) {
            res.iadd(this.m);
        }
        return res;
    };
    Red.prototype.shl = function shl(a, num) {
        this._verify1(a);
        return this.imod(a.ushln(num));
    };
    Red.prototype.imul = function imul(a, b) {
        this._verify2(a, b);
        return this.imod(a.imul(b));
    };
    Red.prototype.mul = function mul(a, b) {
        this._verify2(a, b);
        return this.imod(a.mul(b));
    };
    Red.prototype.isqr = function isqr(a) {
        return this.imul(a, a.clone());
    };
    Red.prototype.sqr = function sqr(a) {
        return this.mul(a, a);
    };
    Red.prototype.sqrt = function sqrt(a) {
        if (a.isZero()) return a.clone();
        var mod3 = this.m.andln(3);
        assert(mod3 % 2 === 1);
        // Fast case
        if (mod3 === 3) {
            var pow = this.m.add(new BN(1)).iushrn(2);
            return this.pow(a, pow);
        }
        // Tonelli-Shanks algorithm (Totally unoptimized and slow)
        //
        // Find Q and S, that Q * 2 ^ S = (P - 1)
        var q = this.m.subn(1);
        var s = 0;
        while(!q.isZero() && q.andln(1) === 0){
            s++;
            q.iushrn(1);
        }
        assert(!q.isZero());
        var one = new BN(1).toRed(this);
        var nOne = one.redNeg();
        // Find quadratic non-residue
        // NOTE: Max is such because of generalized Riemann hypothesis.
        var lpow = this.m.subn(1).iushrn(1);
        var z = this.m.bitLength();
        z = new BN(2 * z * z).toRed(this);
        while(this.pow(z, lpow).cmp(nOne) !== 0){
            z.redIAdd(nOne);
        }
        var c = this.pow(z, q);
        var r = this.pow(a, q.addn(1).iushrn(1));
        var t = this.pow(a, q);
        var m = s;
        while(t.cmp(one) !== 0){
            var tmp = t;
            for(var i = 0; tmp.cmp(one) !== 0; i++){
                tmp = tmp.redSqr();
            }
            assert(i < m);
            var b = this.pow(c, new BN(1).iushln(m - i - 1));
            r = r.redMul(b);
            c = b.redSqr();
            t = t.redMul(c);
            m = i;
        }
        return r;
    };
    Red.prototype.invm = function invm(a) {
        var inv = a._invmp(this.m);
        if (inv.negative !== 0) {
            inv.negative = 0;
            return this.imod(inv).redNeg();
        } else {
            return this.imod(inv);
        }
    };
    Red.prototype.pow = function pow(a, num) {
        if (num.isZero()) return new BN(1).toRed(this);
        if (num.cmpn(1) === 0) return a.clone();
        var windowSize = 4;
        var wnd = new Array(1 << windowSize);
        wnd[0] = new BN(1).toRed(this);
        wnd[1] = a;
        for(var i = 2; i < wnd.length; i++){
            wnd[i] = this.mul(wnd[i - 1], a);
        }
        var res = wnd[0];
        var current = 0;
        var currentLen = 0;
        var start = num.bitLength() % 26;
        if (start === 0) {
            start = 26;
        }
        for(i = num.length - 1; i >= 0; i--){
            var word = num.words[i];
            for(var j = start - 1; j >= 0; j--){
                var bit = word >> j & 1;
                if (res !== wnd[0]) {
                    res = this.sqr(res);
                }
                if (bit === 0 && current === 0) {
                    currentLen = 0;
                    continue;
                }
                current <<= 1;
                current |= bit;
                currentLen++;
                if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;
                res = this.mul(res, wnd[current]);
                currentLen = 0;
                current = 0;
            }
            start = 26;
        }
        return res;
    };
    Red.prototype.convertTo = function convertTo(num) {
        var r = num.umod(this.m);
        return r === num ? r.clone() : r;
    };
    Red.prototype.convertFrom = function convertFrom(num) {
        var res = num.clone();
        res.red = null;
        return res;
    };
    //
    // Montgomery method engine
    //
    BN.mont = function mont(num) {
        return new Mont(num);
    };
    function Mont(m) {
        Red.call(this, m);
        this.shift = this.m.bitLength();
        if (this.shift % 26 !== 0) {
            this.shift += 26 - this.shift % 26;
        }
        this.r = new BN(1).iushln(this.shift);
        this.r2 = this.imod(this.r.sqr());
        this.rinv = this.r._invmp(this.m);
        this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
        this.minv = this.minv.umod(this.r);
        this.minv = this.r.sub(this.minv);
    }
    inherits(Mont, Red);
    Mont.prototype.convertTo = function convertTo(num) {
        return this.imod(num.ushln(this.shift));
    };
    Mont.prototype.convertFrom = function convertFrom(num) {
        var r = this.imod(num.mul(this.rinv));
        r.red = null;
        return r;
    };
    Mont.prototype.imul = function imul(a, b) {
        if (a.isZero() || b.isZero()) {
            a.words[0] = 0;
            a.length = 1;
            return a;
        }
        var t = a.imul(b);
        var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
        var u = t.isub(c).iushrn(this.shift);
        var res = u;
        if (u.cmp(this.m) >= 0) {
            res = u.isub(this.m);
        } else if (u.cmpn(0) < 0) {
            res = u.iadd(this.m);
        }
        return res._forceRed(this);
    };
    Mont.prototype.mul = function mul(a, b) {
        if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);
        var t = a.mul(b);
        var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
        var u = t.isub(c).iushrn(this.shift);
        var res = u;
        if (u.cmp(this.m) >= 0) {
            res = u.isub(this.m);
        } else if (u.cmpn(0) < 0) {
            res = u.iadd(this.m);
        }
        return res._forceRed(this);
    };
    Mont.prototype.invm = function invm(a) {
        // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
        var res = this.imod(a._invmp(this.m).mul(this.r2));
        return res._forceRed(this);
    };
})(("TURBOPACK compile-time value", "object") === 'undefined' || module, /*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/bn.js/lib/bn.js [app-ssr] (ecmascript) <export default as BN>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BN",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/bn.js/lib/bn.js [app-ssr] (ecmascript)");
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/safe-buffer/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */ /* eslint-disable node/no-deprecated-api */ var buffer = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)");
var Buffer = buffer.Buffer;
// alternative to using Object.keys for old browsers
function copyProps(src, dst) {
    for(var key in src){
        dst[key] = src[key];
    }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
    module.exports = buffer;
} else {
    // Copy properties from require('buffer')
    copyProps(buffer, exports);
    exports.Buffer = SafeBuffer;
}
function SafeBuffer(arg, encodingOrOffset, length) {
    return Buffer(arg, encodingOrOffset, length);
}
SafeBuffer.prototype = Object.create(Buffer.prototype);
// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer);
SafeBuffer.from = function(arg, encodingOrOffset, length) {
    if (typeof arg === 'number') {
        throw new TypeError('Argument must not be a number');
    }
    return Buffer(arg, encodingOrOffset, length);
};
SafeBuffer.alloc = function(size, fill, encoding) {
    if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
    }
    var buf = Buffer(size);
    if (fill !== undefined) {
        if (typeof encoding === 'string') {
            buf.fill(fill, encoding);
        } else {
            buf.fill(fill);
        }
    } else {
        buf.fill(0);
    }
    return buf;
};
SafeBuffer.allocUnsafe = function(size) {
    if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
    }
    return Buffer(size);
};
SafeBuffer.allocUnsafeSlow = function(size) {
    if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
    }
    return buffer.SlowBuffer(size);
};
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/base-x/src/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// base-x encoding / decoding
// Copyright (c) 2018 base-x contributors
// Copyright (c) 2014-2018 The Bitcoin Core developers (base58.cpp)
// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php.
// @ts-ignore
var _Buffer = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/safe-buffer/index.js [app-ssr] (ecmascript)").Buffer;
function base(ALPHABET) {
    if (ALPHABET.length >= 255) {
        throw new TypeError('Alphabet too long');
    }
    var BASE_MAP = new Uint8Array(256);
    for(var j = 0; j < BASE_MAP.length; j++){
        BASE_MAP[j] = 255;
    }
    for(var i = 0; i < ALPHABET.length; i++){
        var x = ALPHABET.charAt(i);
        var xc = x.charCodeAt(0);
        if (BASE_MAP[xc] !== 255) {
            throw new TypeError(x + ' is ambiguous');
        }
        BASE_MAP[xc] = i;
    }
    var BASE = ALPHABET.length;
    var LEADER = ALPHABET.charAt(0);
    var FACTOR = Math.log(BASE) / Math.log(256) // log(BASE) / log(256), rounded up
    ;
    var iFACTOR = Math.log(256) / Math.log(BASE) // log(256) / log(BASE), rounded up
    ;
    function encode(source) {
        if (Array.isArray(source) || source instanceof Uint8Array) {
            source = _Buffer.from(source);
        }
        if (!_Buffer.isBuffer(source)) {
            throw new TypeError('Expected Buffer');
        }
        if (source.length === 0) {
            return '';
        }
        // Skip & count leading zeroes.
        var zeroes = 0;
        var length = 0;
        var pbegin = 0;
        var pend = source.length;
        while(pbegin !== pend && source[pbegin] === 0){
            pbegin++;
            zeroes++;
        }
        // Allocate enough space in big-endian base58 representation.
        var size = (pend - pbegin) * iFACTOR + 1 >>> 0;
        var b58 = new Uint8Array(size);
        // Process the bytes.
        while(pbegin !== pend){
            var carry = source[pbegin];
            // Apply "b58 = b58 * 256 + ch".
            var i = 0;
            for(var it1 = size - 1; (carry !== 0 || i < length) && it1 !== -1; it1--, i++){
                carry += 256 * b58[it1] >>> 0;
                b58[it1] = carry % BASE >>> 0;
                carry = carry / BASE >>> 0;
            }
            if (carry !== 0) {
                throw new Error('Non-zero carry');
            }
            length = i;
            pbegin++;
        }
        // Skip leading zeroes in base58 result.
        var it2 = size - length;
        while(it2 !== size && b58[it2] === 0){
            it2++;
        }
        // Translate the result into a string.
        var str = LEADER.repeat(zeroes);
        for(; it2 < size; ++it2){
            str += ALPHABET.charAt(b58[it2]);
        }
        return str;
    }
    function decodeUnsafe(source) {
        if (typeof source !== 'string') {
            throw new TypeError('Expected String');
        }
        if (source.length === 0) {
            return _Buffer.alloc(0);
        }
        var psz = 0;
        // Skip and count leading '1's.
        var zeroes = 0;
        var length = 0;
        while(source[psz] === LEADER){
            zeroes++;
            psz++;
        }
        // Allocate enough space in big-endian base256 representation.
        var size = (source.length - psz) * FACTOR + 1 >>> 0 // log(58) / log(256), rounded up.
        ;
        var b256 = new Uint8Array(size);
        // Process the characters.
        while(psz < source.length){
            // Find code of next character
            var charCode = source.charCodeAt(psz);
            // Base map can not be indexed using char code
            if (charCode > 255) {
                return;
            }
            // Decode character
            var carry = BASE_MAP[charCode];
            // Invalid character
            if (carry === 255) {
                return;
            }
            var i = 0;
            for(var it3 = size - 1; (carry !== 0 || i < length) && it3 !== -1; it3--, i++){
                carry += BASE * b256[it3] >>> 0;
                b256[it3] = carry % 256 >>> 0;
                carry = carry / 256 >>> 0;
            }
            if (carry !== 0) {
                throw new Error('Non-zero carry');
            }
            length = i;
            psz++;
        }
        // Skip leading zeroes in b256.
        var it4 = size - length;
        while(it4 !== size && b256[it4] === 0){
            it4++;
        }
        var vch = _Buffer.allocUnsafe(zeroes + (size - it4));
        vch.fill(0x00, 0, zeroes);
        var j = zeroes;
        while(it4 !== size){
            vch[j++] = b256[it4++];
        }
        return vch;
    }
    function decode(string) {
        var buffer = decodeUnsafe(string);
        if (buffer) {
            return buffer;
        }
        throw new Error('Non-base' + BASE + ' character');
    }
    return {
        encode: encode,
        decodeUnsafe: decodeUnsafe,
        decode: decode
    };
}
module.exports = base;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@lazorkit/wallet/node_modules/base-x/src/esm/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// base-x encoding / decoding
// Copyright (c) 2018 base-x contributors
// Copyright (c) 2014-2018 The Bitcoin Core developers (base58.cpp)
// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function base(ALPHABET) {
    if (ALPHABET.length >= 255) {
        throw new TypeError('Alphabet too long');
    }
    const BASE_MAP = new Uint8Array(256);
    for(let j = 0; j < BASE_MAP.length; j++){
        BASE_MAP[j] = 255;
    }
    for(let i = 0; i < ALPHABET.length; i++){
        const x = ALPHABET.charAt(i);
        const xc = x.charCodeAt(0);
        if (BASE_MAP[xc] !== 255) {
            throw new TypeError(x + ' is ambiguous');
        }
        BASE_MAP[xc] = i;
    }
    const BASE = ALPHABET.length;
    const LEADER = ALPHABET.charAt(0);
    const FACTOR = Math.log(BASE) / Math.log(256) // log(BASE) / log(256), rounded up
    ;
    const iFACTOR = Math.log(256) / Math.log(BASE) // log(256) / log(BASE), rounded up
    ;
    function encode(source) {
        // eslint-disable-next-line no-empty
        if (source instanceof Uint8Array) {} else if (ArrayBuffer.isView(source)) {
            source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
        } else if (Array.isArray(source)) {
            source = Uint8Array.from(source);
        }
        if (!(source instanceof Uint8Array)) {
            throw new TypeError('Expected Uint8Array');
        }
        if (source.length === 0) {
            return '';
        }
        // Skip & count leading zeroes.
        let zeroes = 0;
        let length = 0;
        let pbegin = 0;
        const pend = source.length;
        while(pbegin !== pend && source[pbegin] === 0){
            pbegin++;
            zeroes++;
        }
        // Allocate enough space in big-endian base58 representation.
        const size = (pend - pbegin) * iFACTOR + 1 >>> 0;
        const b58 = new Uint8Array(size);
        // Process the bytes.
        while(pbegin !== pend){
            let carry = source[pbegin];
            // Apply "b58 = b58 * 256 + ch".
            let i = 0;
            for(let it1 = size - 1; (carry !== 0 || i < length) && it1 !== -1; it1--, i++){
                carry += 256 * b58[it1] >>> 0;
                b58[it1] = carry % BASE >>> 0;
                carry = carry / BASE >>> 0;
            }
            if (carry !== 0) {
                throw new Error('Non-zero carry');
            }
            length = i;
            pbegin++;
        }
        // Skip leading zeroes in base58 result.
        let it2 = size - length;
        while(it2 !== size && b58[it2] === 0){
            it2++;
        }
        // Translate the result into a string.
        let str = LEADER.repeat(zeroes);
        for(; it2 < size; ++it2){
            str += ALPHABET.charAt(b58[it2]);
        }
        return str;
    }
    function decodeUnsafe(source) {
        if (typeof source !== 'string') {
            throw new TypeError('Expected String');
        }
        if (source.length === 0) {
            return new Uint8Array();
        }
        let psz = 0;
        // Skip and count leading '1's.
        let zeroes = 0;
        let length = 0;
        while(source[psz] === LEADER){
            zeroes++;
            psz++;
        }
        // Allocate enough space in big-endian base256 representation.
        const size = (source.length - psz) * FACTOR + 1 >>> 0 // log(58) / log(256), rounded up.
        ;
        const b256 = new Uint8Array(size);
        // Process the characters.
        while(psz < source.length){
            // Find code of next character
            const charCode = source.charCodeAt(psz);
            // Base map can not be indexed using char code
            if (charCode > 255) {
                return;
            }
            // Decode character
            let carry = BASE_MAP[charCode];
            // Invalid character
            if (carry === 255) {
                return;
            }
            let i = 0;
            for(let it3 = size - 1; (carry !== 0 || i < length) && it3 !== -1; it3--, i++){
                carry += BASE * b256[it3] >>> 0;
                b256[it3] = carry % 256 >>> 0;
                carry = carry / 256 >>> 0;
            }
            if (carry !== 0) {
                throw new Error('Non-zero carry');
            }
            length = i;
            psz++;
        }
        // Skip leading zeroes in b256.
        let it4 = size - length;
        while(it4 !== size && b256[it4] === 0){
            it4++;
        }
        const vch = new Uint8Array(zeroes + (size - it4));
        let j = zeroes;
        while(it4 !== size){
            vch[j++] = b256[it4++];
        }
        return vch;
    }
    function decode(string) {
        const buffer = decodeUnsafe(string);
        if (buffer) {
            return buffer;
        }
        throw new Error('Non-base' + BASE + ' character');
    }
    return {
        encode,
        decodeUnsafe,
        decode
    };
}
const __TURBOPACK__default__export__ = base;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@lazorkit/wallet/node_modules/bs58/src/esm/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$lazorkit$2f$wallet$2f$node_modules$2f$base$2d$x$2f$src$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@lazorkit/wallet/node_modules/base-x/src/esm/index.js [app-ssr] (ecmascript)");
;
var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$lazorkit$2f$wallet$2f$node_modules$2f$base$2d$x$2f$src$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(ALPHABET);
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@lazorkit/wallet/node_modules/eventemitter3/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var has = Object.prototype.hasOwnProperty, prefix = '~';
/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */ function Events() {}
//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
    Events.prototype = Object.create(null);
    //
    // This hack is needed because the `__proto__` property is still inherited in
    // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
    //
    if (!new Events().__proto__) prefix = false;
}
/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */ function EE(fn, context, once) {
    this.fn = fn;
    this.context = context;
    this.once = once || false;
}
/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */ function addListener(emitter, event, fn, context, once) {
    if (typeof fn !== 'function') {
        throw new TypeError('The listener must be a function');
    }
    var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
    if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
    else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
    else emitter._events[evt] = [
        emitter._events[evt],
        listener
    ];
    return emitter;
}
/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */ function clearEvent(emitter, evt) {
    if (--emitter._eventsCount === 0) emitter._events = new Events();
    else delete emitter._events[evt];
}
/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */ function EventEmitter() {
    this._events = new Events();
    this._eventsCount = 0;
}
/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */ EventEmitter.prototype.eventNames = function eventNames() {
    var names = [], events, name;
    if (this._eventsCount === 0) return names;
    for(name in events = this._events){
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
    }
    if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
    }
    return names;
};
/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */ EventEmitter.prototype.listeners = function listeners(event) {
    var evt = prefix ? prefix + event : event, handlers = this._events[evt];
    if (!handlers) return [];
    if (handlers.fn) return [
        handlers.fn
    ];
    for(var i = 0, l = handlers.length, ee = new Array(l); i < l; i++){
        ee[i] = handlers[i].fn;
    }
    return ee;
};
/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */ EventEmitter.prototype.listenerCount = function listenerCount(event) {
    var evt = prefix ? prefix + event : event, listeners = this._events[evt];
    if (!listeners) return 0;
    if (listeners.fn) return 1;
    return listeners.length;
};
/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */ EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt]) return false;
    var listeners = this._events[evt], len = arguments.length, args, i;
    if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);
        switch(len){
            case 1:
                return listeners.fn.call(listeners.context), true;
            case 2:
                return listeners.fn.call(listeners.context, a1), true;
            case 3:
                return listeners.fn.call(listeners.context, a1, a2), true;
            case 4:
                return listeners.fn.call(listeners.context, a1, a2, a3), true;
            case 5:
                return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
            case 6:
                return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for(i = 1, args = new Array(len - 1); i < len; i++){
            args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
    } else {
        var length = listeners.length, j;
        for(i = 0; i < length; i++){
            if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);
            switch(len){
                case 1:
                    listeners[i].fn.call(listeners[i].context);
                    break;
                case 2:
                    listeners[i].fn.call(listeners[i].context, a1);
                    break;
                case 3:
                    listeners[i].fn.call(listeners[i].context, a1, a2);
                    break;
                case 4:
                    listeners[i].fn.call(listeners[i].context, a1, a2, a3);
                    break;
                default:
                    if (!args) for(j = 1, args = new Array(len - 1); j < len; j++){
                        args[j - 1] = arguments[j];
                    }
                    listeners[i].fn.apply(listeners[i].context, args);
            }
        }
    }
    return true;
};
/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */ EventEmitter.prototype.on = function on(event, fn, context) {
    return addListener(this, event, fn, context, false);
};
/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */ EventEmitter.prototype.once = function once(event, fn, context) {
    return addListener(this, event, fn, context, true);
};
/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */ EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt]) return this;
    if (!fn) {
        clearEvent(this, evt);
        return this;
    }
    var listeners = this._events[evt];
    if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
            clearEvent(this, evt);
        }
    } else {
        for(var i = 0, events = [], length = listeners.length; i < length; i++){
            if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
                events.push(listeners[i]);
            }
        }
        //
        // Reset the array, or remove it completely if we have no more listeners.
        //
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
    }
    return this;
};
/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */ EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
    var evt;
    if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
    } else {
        this._events = new Events();
        this._eventsCount = 0;
    }
    return this;
};
//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;
//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;
//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;
//
// Expose the module.
//
if ("TURBOPACK compile-time truthy", 1) {
    module.exports = EventEmitter;
}
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@lazorkit/wallet/node_modules/eventemitter3/index.mjs [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$lazorkit$2f$wallet$2f$node_modules$2f$eventemitter3$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@lazorkit/wallet/node_modules/eventemitter3/index.js [app-ssr] (ecmascript)");
;
;
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$lazorkit$2f$wallet$2f$node_modules$2f$eventemitter3$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"];
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@lazorkit/wallet/node_modules/eventemitter3/index.js [app-ssr] (ecmascript) <export default as EventEmitter>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EventEmitter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$lazorkit$2f$wallet$2f$node_modules$2f$eventemitter3$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$lazorkit$2f$wallet$2f$node_modules$2f$eventemitter3$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@lazorkit/wallet/node_modules/eventemitter3/index.js [app-ssr] (ecmascript)");
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/bs58/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

var basex = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/base-x/src/index.js [app-ssr] (ecmascript)");
var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
module.exports = basex(ALPHABET);
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/text-encoding-utf-8/lib/encoding.lib.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This is free and unencumbered software released into the public domain.
// See LICENSE.md for more information.
//
// Utilities
//
/**
 * @param {number} a The number to test.
 * @param {number} min The minimum value in the range, inclusive.
 * @param {number} max The maximum value in the range, inclusive.
 * @return {boolean} True if a >= min and a <= max.
 */ function inRange(a, min, max) {
    return min <= a && a <= max;
}
/**
 * @param {*} o
 * @return {Object}
 */ function ToDictionary(o) {
    if (o === undefined) return {};
    if (o === Object(o)) return o;
    throw TypeError('Could not convert argument to dictionary');
}
/**
 * @param {string} string Input string of UTF-16 code units.
 * @return {!Array.<number>} Code points.
 */ function stringToCodePoints(string) {
    // https://heycam.github.io/webidl/#dfn-obtain-unicode
    // 1. Let S be the DOMString value.
    var s = String(string);
    // 2. Let n be the length of S.
    var n = s.length;
    // 3. Initialize i to 0.
    var i = 0;
    // 4. Initialize U to be an empty sequence of Unicode characters.
    var u = [];
    // 5. While i < n:
    while(i < n){
        // 1. Let c be the code unit in S at index i.
        var c = s.charCodeAt(i);
        // 2. Depending on the value of c:
        // c < 0xD800 or c > 0xDFFF
        if (c < 0xD800 || c > 0xDFFF) {
            // Append to U the Unicode character with code point c.
            u.push(c);
        } else if (0xDC00 <= c && c <= 0xDFFF) {
            // Append to U a U+FFFD REPLACEMENT CHARACTER.
            u.push(0xFFFD);
        } else if (0xD800 <= c && c <= 0xDBFF) {
            // 1. If i = n−1, then append to U a U+FFFD REPLACEMENT
            // CHARACTER.
            if (i === n - 1) {
                u.push(0xFFFD);
            } else {
                // 1. Let d be the code unit in S at index i+1.
                var d = string.charCodeAt(i + 1);
                // 2. If 0xDC00 ≤ d ≤ 0xDFFF, then:
                if (0xDC00 <= d && d <= 0xDFFF) {
                    // 1. Let a be c & 0x3FF.
                    var a = c & 0x3FF;
                    // 2. Let b be d & 0x3FF.
                    var b = d & 0x3FF;
                    // 3. Append to U the Unicode character with code point
                    // 2^16+2^10*a+b.
                    u.push(0x10000 + (a << 10) + b);
                    // 4. Set i to i+1.
                    i += 1;
                } else {
                    u.push(0xFFFD);
                }
            }
        }
        // 3. Set i to i+1.
        i += 1;
    }
    // 6. Return U.
    return u;
}
/**
 * @param {!Array.<number>} code_points Array of code points.
 * @return {string} string String of UTF-16 code units.
 */ function codePointsToString(code_points) {
    var s = '';
    for(var i = 0; i < code_points.length; ++i){
        var cp = code_points[i];
        if (cp <= 0xFFFF) {
            s += String.fromCharCode(cp);
        } else {
            cp -= 0x10000;
            s += String.fromCharCode((cp >> 10) + 0xD800, (cp & 0x3FF) + 0xDC00);
        }
    }
    return s;
}
//
// Implementation of Encoding specification
// https://encoding.spec.whatwg.org/
//
//
// 3. Terminology
//
/**
 * End-of-stream is a special token that signifies no more tokens
 * are in the stream.
 * @const
 */ var end_of_stream = -1;
/**
 * A stream represents an ordered sequence of tokens.
 *
 * @constructor
 * @param {!(Array.<number>|Uint8Array)} tokens Array of tokens that provide the
 * stream.
 */ function Stream(tokens) {
    /** @type {!Array.<number>} */ this.tokens = [].slice.call(tokens);
}
Stream.prototype = {
    /**
   * @return {boolean} True if end-of-stream has been hit.
   */ endOfStream: function() {
        return !this.tokens.length;
    },
    /**
   * When a token is read from a stream, the first token in the
   * stream must be returned and subsequently removed, and
   * end-of-stream must be returned otherwise.
   *
   * @return {number} Get the next token from the stream, or
   * end_of_stream.
   */ read: function() {
        if (!this.tokens.length) return end_of_stream;
        return this.tokens.shift();
    },
    /**
   * When one or more tokens are prepended to a stream, those tokens
   * must be inserted, in given order, before the first token in the
   * stream.
   *
   * @param {(number|!Array.<number>)} token The token(s) to prepend to the stream.
   */ prepend: function(token) {
        if (Array.isArray(token)) {
            var tokens = token;
            while(tokens.length)this.tokens.unshift(tokens.pop());
        } else {
            this.tokens.unshift(token);
        }
    },
    /**
   * When one or more tokens are pushed to a stream, those tokens
   * must be inserted, in given order, after the last token in the
   * stream.
   *
   * @param {(number|!Array.<number>)} token The tokens(s) to prepend to the stream.
   */ push: function(token) {
        if (Array.isArray(token)) {
            var tokens = token;
            while(tokens.length)this.tokens.push(tokens.shift());
        } else {
            this.tokens.push(token);
        }
    }
};
//
// 4. Encodings
//
// 4.1 Encoders and decoders
/** @const */ var finished = -1;
/**
 * @param {boolean} fatal If true, decoding errors raise an exception.
 * @param {number=} opt_code_point Override the standard fallback code point.
 * @return {number} The code point to insert on a decoding error.
 */ function decoderError(fatal, opt_code_point) {
    if (fatal) throw TypeError('Decoder error');
    return opt_code_point || 0xFFFD;
}
//
// 7. API
//
/** @const */ var DEFAULT_ENCODING = 'utf-8';
// 7.1 Interface TextDecoder
/**
 * @constructor
 * @param {string=} encoding The label of the encoding;
 *     defaults to 'utf-8'.
 * @param {Object=} options
 */ function TextDecoder(encoding, options) {
    if (!(this instanceof TextDecoder)) {
        return new TextDecoder(encoding, options);
    }
    encoding = encoding !== undefined ? String(encoding).toLowerCase() : DEFAULT_ENCODING;
    if (encoding !== DEFAULT_ENCODING) {
        throw new Error('Encoding not supported. Only utf-8 is supported');
    }
    options = ToDictionary(options);
    /** @private @type {boolean} */ this._streaming = false;
    /** @private @type {boolean} */ this._BOMseen = false;
    /** @private @type {?Decoder} */ this._decoder = null;
    /** @private @type {boolean} */ this._fatal = Boolean(options['fatal']);
    /** @private @type {boolean} */ this._ignoreBOM = Boolean(options['ignoreBOM']);
    Object.defineProperty(this, 'encoding', {
        value: 'utf-8'
    });
    Object.defineProperty(this, 'fatal', {
        value: this._fatal
    });
    Object.defineProperty(this, 'ignoreBOM', {
        value: this._ignoreBOM
    });
}
TextDecoder.prototype = {
    /**
   * @param {ArrayBufferView=} input The buffer of bytes to decode.
   * @param {Object=} options
   * @return {string} The decoded string.
   */ decode: function decode(input, options) {
        var bytes;
        if (typeof input === 'object' && input instanceof ArrayBuffer) {
            bytes = new Uint8Array(input);
        } else if (typeof input === 'object' && 'buffer' in input && input.buffer instanceof ArrayBuffer) {
            bytes = new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
        } else {
            bytes = new Uint8Array(0);
        }
        options = ToDictionary(options);
        if (!this._streaming) {
            this._decoder = new UTF8Decoder({
                fatal: this._fatal
            });
            this._BOMseen = false;
        }
        this._streaming = Boolean(options['stream']);
        var input_stream = new Stream(bytes);
        var code_points = [];
        /** @type {?(number|!Array.<number>)} */ var result;
        while(!input_stream.endOfStream()){
            result = this._decoder.handler(input_stream, input_stream.read());
            if (result === finished) break;
            if (result === null) continue;
            if (Array.isArray(result)) code_points.push.apply(code_points, result);
            else code_points.push(result);
        }
        if (!this._streaming) {
            do {
                result = this._decoder.handler(input_stream, input_stream.read());
                if (result === finished) break;
                if (result === null) continue;
                if (Array.isArray(result)) code_points.push.apply(code_points, result);
                else code_points.push(result);
            }while (!input_stream.endOfStream())
            this._decoder = null;
        }
        if (code_points.length) {
            // If encoding is one of utf-8, utf-16be, and utf-16le, and
            // ignore BOM flag and BOM seen flag are unset, run these
            // subsubsteps:
            if ([
                'utf-8'
            ].indexOf(this.encoding) !== -1 && !this._ignoreBOM && !this._BOMseen) {
                // If token is U+FEFF, set BOM seen flag.
                if (code_points[0] === 0xFEFF) {
                    this._BOMseen = true;
                    code_points.shift();
                } else {
                    // Otherwise, if token is not end-of-stream, set BOM seen
                    // flag and append token to output.
                    this._BOMseen = true;
                }
            }
        }
        return codePointsToString(code_points);
    }
};
// 7.2 Interface TextEncoder
/**
 * @constructor
 * @param {string=} encoding The label of the encoding;
 *     defaults to 'utf-8'.
 * @param {Object=} options
 */ function TextEncoder(encoding, options) {
    if (!(this instanceof TextEncoder)) return new TextEncoder(encoding, options);
    encoding = encoding !== undefined ? String(encoding).toLowerCase() : DEFAULT_ENCODING;
    if (encoding !== DEFAULT_ENCODING) {
        throw new Error('Encoding not supported. Only utf-8 is supported');
    }
    options = ToDictionary(options);
    /** @private @type {boolean} */ this._streaming = false;
    /** @private @type {?Encoder} */ this._encoder = null;
    /** @private @type {{fatal: boolean}} */ this._options = {
        fatal: Boolean(options['fatal'])
    };
    Object.defineProperty(this, 'encoding', {
        value: 'utf-8'
    });
}
TextEncoder.prototype = {
    /**
   * @param {string=} opt_string The string to encode.
   * @param {Object=} options
   * @return {Uint8Array} Encoded bytes, as a Uint8Array.
   */ encode: function encode(opt_string, options) {
        opt_string = opt_string ? String(opt_string) : '';
        options = ToDictionary(options);
        // NOTE: This option is nonstandard. None of the encodings
        // permitted for encoding (i.e. UTF-8, UTF-16) are stateful,
        // so streaming is not necessary.
        if (!this._streaming) this._encoder = new UTF8Encoder(this._options);
        this._streaming = Boolean(options['stream']);
        var bytes = [];
        var input_stream = new Stream(stringToCodePoints(opt_string));
        /** @type {?(number|!Array.<number>)} */ var result;
        while(!input_stream.endOfStream()){
            result = this._encoder.handler(input_stream, input_stream.read());
            if (result === finished) break;
            if (Array.isArray(result)) bytes.push.apply(bytes, result);
            else bytes.push(result);
        }
        if (!this._streaming) {
            while(true){
                result = this._encoder.handler(input_stream, input_stream.read());
                if (result === finished) break;
                if (Array.isArray(result)) bytes.push.apply(bytes, result);
                else bytes.push(result);
            }
            this._encoder = null;
        }
        return new Uint8Array(bytes);
    }
};
//
// 8. The encoding
//
// 8.1 utf-8
/**
 * @constructor
 * @implements {Decoder}
 * @param {{fatal: boolean}} options
 */ function UTF8Decoder(options) {
    var fatal = options.fatal;
    // utf-8's decoder's has an associated utf-8 code point, utf-8
    // bytes seen, and utf-8 bytes needed (all initially 0), a utf-8
    // lower boundary (initially 0x80), and a utf-8 upper boundary
    // (initially 0xBF).
    var /** @type {number} */ utf8_code_point = 0, /** @type {number} */ utf8_bytes_seen = 0, /** @type {number} */ utf8_bytes_needed = 0, /** @type {number} */ utf8_lower_boundary = 0x80, /** @type {number} */ utf8_upper_boundary = 0xBF;
    /**
   * @param {Stream} stream The stream of bytes being decoded.
   * @param {number} bite The next byte read from the stream.
   * @return {?(number|!Array.<number>)} The next code point(s)
   *     decoded, or null if not enough data exists in the input
   *     stream to decode a complete code point.
   */ this.handler = function(stream, bite) {
        // 1. If byte is end-of-stream and utf-8 bytes needed is not 0,
        // set utf-8 bytes needed to 0 and return error.
        if (bite === end_of_stream && utf8_bytes_needed !== 0) {
            utf8_bytes_needed = 0;
            return decoderError(fatal);
        }
        // 2. If byte is end-of-stream, return finished.
        if (bite === end_of_stream) return finished;
        // 3. If utf-8 bytes needed is 0, based on byte:
        if (utf8_bytes_needed === 0) {
            // 0x00 to 0x7F
            if (inRange(bite, 0x00, 0x7F)) {
                // Return a code point whose value is byte.
                return bite;
            }
            // 0xC2 to 0xDF
            if (inRange(bite, 0xC2, 0xDF)) {
                // Set utf-8 bytes needed to 1 and utf-8 code point to byte
                // − 0xC0.
                utf8_bytes_needed = 1;
                utf8_code_point = bite - 0xC0;
            } else if (inRange(bite, 0xE0, 0xEF)) {
                // 1. If byte is 0xE0, set utf-8 lower boundary to 0xA0.
                if (bite === 0xE0) utf8_lower_boundary = 0xA0;
                // 2. If byte is 0xED, set utf-8 upper boundary to 0x9F.
                if (bite === 0xED) utf8_upper_boundary = 0x9F;
                // 3. Set utf-8 bytes needed to 2 and utf-8 code point to
                // byte − 0xE0.
                utf8_bytes_needed = 2;
                utf8_code_point = bite - 0xE0;
            } else if (inRange(bite, 0xF0, 0xF4)) {
                // 1. If byte is 0xF0, set utf-8 lower boundary to 0x90.
                if (bite === 0xF0) utf8_lower_boundary = 0x90;
                // 2. If byte is 0xF4, set utf-8 upper boundary to 0x8F.
                if (bite === 0xF4) utf8_upper_boundary = 0x8F;
                // 3. Set utf-8 bytes needed to 3 and utf-8 code point to
                // byte − 0xF0.
                utf8_bytes_needed = 3;
                utf8_code_point = bite - 0xF0;
            } else {
                // Return error.
                return decoderError(fatal);
            }
            // Then (byte is in the range 0xC2 to 0xF4) set utf-8 code
            // point to utf-8 code point << (6 × utf-8 bytes needed) and
            // return continue.
            utf8_code_point = utf8_code_point << 6 * utf8_bytes_needed;
            return null;
        }
        // 4. If byte is not in the range utf-8 lower boundary to utf-8
        // upper boundary, run these substeps:
        if (!inRange(bite, utf8_lower_boundary, utf8_upper_boundary)) {
            // 1. Set utf-8 code point, utf-8 bytes needed, and utf-8
            // bytes seen to 0, set utf-8 lower boundary to 0x80, and set
            // utf-8 upper boundary to 0xBF.
            utf8_code_point = utf8_bytes_needed = utf8_bytes_seen = 0;
            utf8_lower_boundary = 0x80;
            utf8_upper_boundary = 0xBF;
            // 2. Prepend byte to stream.
            stream.prepend(bite);
            // 3. Return error.
            return decoderError(fatal);
        }
        // 5. Set utf-8 lower boundary to 0x80 and utf-8 upper boundary
        // to 0xBF.
        utf8_lower_boundary = 0x80;
        utf8_upper_boundary = 0xBF;
        // 6. Increase utf-8 bytes seen by one and set utf-8 code point
        // to utf-8 code point + (byte − 0x80) << (6 × (utf-8 bytes
        // needed − utf-8 bytes seen)).
        utf8_bytes_seen += 1;
        utf8_code_point += bite - 0x80 << 6 * (utf8_bytes_needed - utf8_bytes_seen);
        // 7. If utf-8 bytes seen is not equal to utf-8 bytes needed,
        // continue.
        if (utf8_bytes_seen !== utf8_bytes_needed) return null;
        // 8. Let code point be utf-8 code point.
        var code_point = utf8_code_point;
        // 9. Set utf-8 code point, utf-8 bytes needed, and utf-8 bytes
        // seen to 0.
        utf8_code_point = utf8_bytes_needed = utf8_bytes_seen = 0;
        // 10. Return a code point whose value is code point.
        return code_point;
    };
}
/**
 * @constructor
 * @implements {Encoder}
 * @param {{fatal: boolean}} options
 */ function UTF8Encoder(options) {
    var fatal = options.fatal;
    /**
   * @param {Stream} stream Input stream.
   * @param {number} code_point Next code point read from the stream.
   * @return {(number|!Array.<number>)} Byte(s) to emit.
   */ this.handler = function(stream, code_point) {
        // 1. If code point is end-of-stream, return finished.
        if (code_point === end_of_stream) return finished;
        // 2. If code point is in the range U+0000 to U+007F, return a
        // byte whose value is code point.
        if (inRange(code_point, 0x0000, 0x007f)) return code_point;
        // 3. Set count and offset based on the range code point is in:
        var count, offset;
        // U+0080 to U+07FF:    1 and 0xC0
        if (inRange(code_point, 0x0080, 0x07FF)) {
            count = 1;
            offset = 0xC0;
        } else if (inRange(code_point, 0x0800, 0xFFFF)) {
            count = 2;
            offset = 0xE0;
        } else if (inRange(code_point, 0x10000, 0x10FFFF)) {
            count = 3;
            offset = 0xF0;
        }
        // 4.Let bytes be a byte sequence whose first byte is (code
        // point >> (6 × count)) + offset.
        var bytes = [
            (code_point >> 6 * count) + offset
        ];
        // 5. Run these substeps while count is greater than 0:
        while(count > 0){
            // 1. Set temp to code point >> (6 × (count − 1)).
            var temp = code_point >> 6 * (count - 1);
            // 2. Append to bytes 0x80 | (temp & 0x3F).
            bytes.push(0x80 | temp & 0x3F);
            // 3. Decrease count by one.
            count -= 1;
        }
        // 6. Return bytes bytes, in order.
        return bytes;
    };
}
exports.TextEncoder = TextEncoder;
exports.TextDecoder = TextDecoder;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/borsh/lib/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true,
        get: function() {
            return m[k];
        }
    });
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __decorate = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deserializeUnchecked = exports.deserialize = exports.serialize = exports.BinaryReader = exports.BinaryWriter = exports.BorshError = exports.baseDecode = exports.baseEncode = void 0;
const bn_js_1 = __importDefault(__turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/bn.js/lib/bn.js [app-ssr] (ecmascript)"));
const bs58_1 = __importDefault(__turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/bs58/index.js [app-ssr] (ecmascript)"));
// TODO: Make sure this polyfill not included when not required
const encoding = __importStar(__turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/text-encoding-utf-8/lib/encoding.lib.js [app-ssr] (ecmascript)"));
const ResolvedTextDecoder = typeof TextDecoder !== "function" ? encoding.TextDecoder : TextDecoder;
const textDecoder = new ResolvedTextDecoder("utf-8", {
    fatal: true
});
function baseEncode(value) {
    if (typeof value === "string") {
        value = Buffer.from(value, "utf8");
    }
    return bs58_1.default.encode(Buffer.from(value));
}
exports.baseEncode = baseEncode;
function baseDecode(value) {
    return Buffer.from(bs58_1.default.decode(value));
}
exports.baseDecode = baseDecode;
const INITIAL_LENGTH = 1024;
class BorshError extends Error {
    constructor(message){
        super(message);
        this.fieldPath = [];
        this.originalMessage = message;
    }
    addToFieldPath(fieldName) {
        this.fieldPath.splice(0, 0, fieldName);
        // NOTE: Modifying message directly as jest doesn't use .toString()
        this.message = this.originalMessage + ": " + this.fieldPath.join(".");
    }
}
exports.BorshError = BorshError;
/// Binary encoder.
class BinaryWriter {
    constructor(){
        this.buf = Buffer.alloc(INITIAL_LENGTH);
        this.length = 0;
    }
    maybeResize() {
        if (this.buf.length < 16 + this.length) {
            this.buf = Buffer.concat([
                this.buf,
                Buffer.alloc(INITIAL_LENGTH)
            ]);
        }
    }
    writeU8(value) {
        this.maybeResize();
        this.buf.writeUInt8(value, this.length);
        this.length += 1;
    }
    writeU16(value) {
        this.maybeResize();
        this.buf.writeUInt16LE(value, this.length);
        this.length += 2;
    }
    writeU32(value) {
        this.maybeResize();
        this.buf.writeUInt32LE(value, this.length);
        this.length += 4;
    }
    writeU64(value) {
        this.maybeResize();
        this.writeBuffer(Buffer.from(new bn_js_1.default(value).toArray("le", 8)));
    }
    writeU128(value) {
        this.maybeResize();
        this.writeBuffer(Buffer.from(new bn_js_1.default(value).toArray("le", 16)));
    }
    writeU256(value) {
        this.maybeResize();
        this.writeBuffer(Buffer.from(new bn_js_1.default(value).toArray("le", 32)));
    }
    writeU512(value) {
        this.maybeResize();
        this.writeBuffer(Buffer.from(new bn_js_1.default(value).toArray("le", 64)));
    }
    writeBuffer(buffer) {
        // Buffer.from is needed as this.buf.subarray can return plain Uint8Array in browser
        this.buf = Buffer.concat([
            Buffer.from(this.buf.subarray(0, this.length)),
            buffer,
            Buffer.alloc(INITIAL_LENGTH)
        ]);
        this.length += buffer.length;
    }
    writeString(str) {
        this.maybeResize();
        const b = Buffer.from(str, "utf8");
        this.writeU32(b.length);
        this.writeBuffer(b);
    }
    writeFixedArray(array) {
        this.writeBuffer(Buffer.from(array));
    }
    writeArray(array, fn) {
        this.maybeResize();
        this.writeU32(array.length);
        for (const elem of array){
            this.maybeResize();
            fn(elem);
        }
    }
    toArray() {
        return this.buf.subarray(0, this.length);
    }
}
exports.BinaryWriter = BinaryWriter;
function handlingRangeError(target, propertyKey, propertyDescriptor) {
    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = function(...args) {
        try {
            return originalMethod.apply(this, args);
        } catch (e) {
            if (e instanceof RangeError) {
                const code = e.code;
                if ([
                    "ERR_BUFFER_OUT_OF_BOUNDS",
                    "ERR_OUT_OF_RANGE"
                ].indexOf(code) >= 0) {
                    throw new BorshError("Reached the end of buffer when deserializing");
                }
            }
            throw e;
        }
    };
}
class BinaryReader {
    constructor(buf){
        this.buf = buf;
        this.offset = 0;
    }
    readU8() {
        const value = this.buf.readUInt8(this.offset);
        this.offset += 1;
        return value;
    }
    readU16() {
        const value = this.buf.readUInt16LE(this.offset);
        this.offset += 2;
        return value;
    }
    readU32() {
        const value = this.buf.readUInt32LE(this.offset);
        this.offset += 4;
        return value;
    }
    readU64() {
        const buf = this.readBuffer(8);
        return new bn_js_1.default(buf, "le");
    }
    readU128() {
        const buf = this.readBuffer(16);
        return new bn_js_1.default(buf, "le");
    }
    readU256() {
        const buf = this.readBuffer(32);
        return new bn_js_1.default(buf, "le");
    }
    readU512() {
        const buf = this.readBuffer(64);
        return new bn_js_1.default(buf, "le");
    }
    readBuffer(len) {
        if (this.offset + len > this.buf.length) {
            throw new BorshError(`Expected buffer length ${len} isn't within bounds`);
        }
        const result = this.buf.slice(this.offset, this.offset + len);
        this.offset += len;
        return result;
    }
    readString() {
        const len = this.readU32();
        const buf = this.readBuffer(len);
        try {
            // NOTE: Using TextDecoder to fail on invalid UTF-8
            return textDecoder.decode(buf);
        } catch (e) {
            throw new BorshError(`Error decoding UTF-8 string: ${e}`);
        }
    }
    readFixedArray(len) {
        return new Uint8Array(this.readBuffer(len));
    }
    readArray(fn) {
        const len = this.readU32();
        const result = Array();
        for(let i = 0; i < len; ++i){
            result.push(fn());
        }
        return result;
    }
}
__decorate([
    handlingRangeError
], BinaryReader.prototype, "readU8", null);
__decorate([
    handlingRangeError
], BinaryReader.prototype, "readU16", null);
__decorate([
    handlingRangeError
], BinaryReader.prototype, "readU32", null);
__decorate([
    handlingRangeError
], BinaryReader.prototype, "readU64", null);
__decorate([
    handlingRangeError
], BinaryReader.prototype, "readU128", null);
__decorate([
    handlingRangeError
], BinaryReader.prototype, "readU256", null);
__decorate([
    handlingRangeError
], BinaryReader.prototype, "readU512", null);
__decorate([
    handlingRangeError
], BinaryReader.prototype, "readString", null);
__decorate([
    handlingRangeError
], BinaryReader.prototype, "readFixedArray", null);
__decorate([
    handlingRangeError
], BinaryReader.prototype, "readArray", null);
exports.BinaryReader = BinaryReader;
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function serializeField(schema, fieldName, value, fieldType, writer) {
    try {
        // TODO: Handle missing values properly (make sure they never result in just skipped write)
        if (typeof fieldType === "string") {
            writer[`write${capitalizeFirstLetter(fieldType)}`](value);
        } else if (fieldType instanceof Array) {
            if (typeof fieldType[0] === "number") {
                if (value.length !== fieldType[0]) {
                    throw new BorshError(`Expecting byte array of length ${fieldType[0]}, but got ${value.length} bytes`);
                }
                writer.writeFixedArray(value);
            } else if (fieldType.length === 2 && typeof fieldType[1] === "number") {
                if (value.length !== fieldType[1]) {
                    throw new BorshError(`Expecting byte array of length ${fieldType[1]}, but got ${value.length} bytes`);
                }
                for(let i = 0; i < fieldType[1]; i++){
                    serializeField(schema, null, value[i], fieldType[0], writer);
                }
            } else {
                writer.writeArray(value, (item)=>{
                    serializeField(schema, fieldName, item, fieldType[0], writer);
                });
            }
        } else if (fieldType.kind !== undefined) {
            switch(fieldType.kind){
                case "option":
                    {
                        if (value === null || value === undefined) {
                            writer.writeU8(0);
                        } else {
                            writer.writeU8(1);
                            serializeField(schema, fieldName, value, fieldType.type, writer);
                        }
                        break;
                    }
                case "map":
                    {
                        writer.writeU32(value.size);
                        value.forEach((val, key)=>{
                            serializeField(schema, fieldName, key, fieldType.key, writer);
                            serializeField(schema, fieldName, val, fieldType.value, writer);
                        });
                        break;
                    }
                default:
                    throw new BorshError(`FieldType ${fieldType} unrecognized`);
            }
        } else {
            serializeStruct(schema, value, writer);
        }
    } catch (error) {
        if (error instanceof BorshError) {
            error.addToFieldPath(fieldName);
        }
        throw error;
    }
}
function serializeStruct(schema, obj, writer) {
    if (typeof obj.borshSerialize === "function") {
        obj.borshSerialize(writer);
        return;
    }
    const structSchema = schema.get(obj.constructor);
    if (!structSchema) {
        throw new BorshError(`Class ${obj.constructor.name} is missing in schema`);
    }
    if (structSchema.kind === "struct") {
        structSchema.fields.map(([fieldName, fieldType])=>{
            serializeField(schema, fieldName, obj[fieldName], fieldType, writer);
        });
    } else if (structSchema.kind === "enum") {
        const name = obj[structSchema.field];
        for(let idx = 0; idx < structSchema.values.length; ++idx){
            const [fieldName, fieldType] = structSchema.values[idx];
            if (fieldName === name) {
                writer.writeU8(idx);
                serializeField(schema, fieldName, obj[fieldName], fieldType, writer);
                break;
            }
        }
    } else {
        throw new BorshError(`Unexpected schema kind: ${structSchema.kind} for ${obj.constructor.name}`);
    }
}
/// Serialize given object using schema of the form:
/// { class_name -> [ [field_name, field_type], .. ], .. }
function serialize(schema, obj, Writer = BinaryWriter) {
    const writer = new Writer();
    serializeStruct(schema, obj, writer);
    return writer.toArray();
}
exports.serialize = serialize;
function deserializeField(schema, fieldName, fieldType, reader) {
    try {
        if (typeof fieldType === "string") {
            return reader[`read${capitalizeFirstLetter(fieldType)}`]();
        }
        if (fieldType instanceof Array) {
            if (typeof fieldType[0] === "number") {
                return reader.readFixedArray(fieldType[0]);
            } else if (typeof fieldType[1] === "number") {
                const arr = [];
                for(let i = 0; i < fieldType[1]; i++){
                    arr.push(deserializeField(schema, null, fieldType[0], reader));
                }
                return arr;
            } else {
                return reader.readArray(()=>deserializeField(schema, fieldName, fieldType[0], reader));
            }
        }
        if (fieldType.kind === "option") {
            const option = reader.readU8();
            if (option) {
                return deserializeField(schema, fieldName, fieldType.type, reader);
            }
            return undefined;
        }
        if (fieldType.kind === "map") {
            let map = new Map();
            const length = reader.readU32();
            for(let i = 0; i < length; i++){
                const key = deserializeField(schema, fieldName, fieldType.key, reader);
                const val = deserializeField(schema, fieldName, fieldType.value, reader);
                map.set(key, val);
            }
            return map;
        }
        return deserializeStruct(schema, fieldType, reader);
    } catch (error) {
        if (error instanceof BorshError) {
            error.addToFieldPath(fieldName);
        }
        throw error;
    }
}
function deserializeStruct(schema, classType, reader) {
    if (typeof classType.borshDeserialize === "function") {
        return classType.borshDeserialize(reader);
    }
    const structSchema = schema.get(classType);
    if (!structSchema) {
        throw new BorshError(`Class ${classType.name} is missing in schema`);
    }
    if (structSchema.kind === "struct") {
        const result = {};
        for (const [fieldName, fieldType] of schema.get(classType).fields){
            result[fieldName] = deserializeField(schema, fieldName, fieldType, reader);
        }
        return new classType(result);
    }
    if (structSchema.kind === "enum") {
        const idx = reader.readU8();
        if (idx >= structSchema.values.length) {
            throw new BorshError(`Enum index: ${idx} is out of range`);
        }
        const [fieldName, fieldType] = structSchema.values[idx];
        const fieldValue = deserializeField(schema, fieldName, fieldType, reader);
        return new classType({
            [fieldName]: fieldValue
        });
    }
    throw new BorshError(`Unexpected schema kind: ${structSchema.kind} for ${classType.constructor.name}`);
}
/// Deserializes object from bytes using schema.
function deserialize(schema, classType, buffer, Reader = BinaryReader) {
    const reader = new Reader(buffer);
    const result = deserializeStruct(schema, classType, reader);
    if (reader.offset < buffer.length) {
        throw new BorshError(`Unexpected ${buffer.length - reader.offset} bytes after deserialized data`);
    }
    return result;
}
exports.deserialize = deserialize;
/// Deserializes object from bytes using schema, without checking the length read
function deserializeUnchecked(schema, classType, buffer, Reader = BinaryReader) {
    const reader = new Reader(buffer);
    return deserializeStruct(schema, classType, reader);
}
exports.deserializeUnchecked = deserializeUnchecked;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/superstruct/lib/index.es.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * A `StructFailure` represents a single specific failure in validation.
 */ /**
 * `StructError` objects are thrown (or returned) when validation fails.
 *
 * Validation logic is design to exit early for maximum performance. The error
 * represents the first error encountered during validation. For more detail,
 * the `error.failures` property is a generator function that can be run to
 * continue validation and receive all the failures in the data.
 */ __turbopack_context__.s([
    "Struct",
    ()=>Struct,
    "StructError",
    ()=>StructError,
    "any",
    ()=>any,
    "array",
    ()=>array,
    "assert",
    ()=>assert,
    "assign",
    ()=>assign,
    "bigint",
    ()=>bigint,
    "boolean",
    ()=>boolean,
    "coerce",
    ()=>coerce,
    "create",
    ()=>create,
    "date",
    ()=>date,
    "defaulted",
    ()=>defaulted,
    "define",
    ()=>define,
    "deprecated",
    ()=>deprecated,
    "dynamic",
    ()=>dynamic,
    "empty",
    ()=>empty,
    "enums",
    ()=>enums,
    "func",
    ()=>func,
    "instance",
    ()=>instance,
    "integer",
    ()=>integer,
    "intersection",
    ()=>intersection,
    "is",
    ()=>is,
    "lazy",
    ()=>lazy,
    "literal",
    ()=>literal,
    "map",
    ()=>map,
    "mask",
    ()=>mask,
    "max",
    ()=>max,
    "min",
    ()=>min,
    "never",
    ()=>never,
    "nonempty",
    ()=>nonempty,
    "nullable",
    ()=>nullable,
    "number",
    ()=>number,
    "object",
    ()=>object,
    "omit",
    ()=>omit,
    "optional",
    ()=>optional,
    "partial",
    ()=>partial,
    "pattern",
    ()=>pattern,
    "pick",
    ()=>pick,
    "record",
    ()=>record,
    "refine",
    ()=>refine,
    "regexp",
    ()=>regexp,
    "set",
    ()=>set,
    "size",
    ()=>size,
    "string",
    ()=>string,
    "struct",
    ()=>struct,
    "trimmed",
    ()=>trimmed,
    "tuple",
    ()=>tuple,
    "type",
    ()=>type,
    "union",
    ()=>union,
    "unknown",
    ()=>unknown,
    "validate",
    ()=>validate
]);
class StructError extends TypeError {
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
 * Check if a value is a plain object.
 */ function isPlainObject(x) {
    if (Object.prototype.toString.call(x) !== '[object Object]') {
        return false;
    }
    const prototype = Object.getPrototypeOf(x);
    return prototype === null || prototype === Object.prototype;
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
function assign() {
    for(var _len = arguments.length, Structs = new Array(_len), _key = 0; _key < _len; _key++){
        Structs[_key] = arguments[_key];
    }
    const isType = Structs[0].type === 'type';
    const schemas = Structs.map((s)=>s.schema);
    const schema = Object.assign({}, ...schemas);
    return isType ? type(schema) : object(schema);
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
 * Create a new struct based on an existing struct, but the value is allowed to
 * be `undefined`. `log` will be called if the value is not `undefined`.
 */ function deprecated(struct, log) {
    return new Struct({
        ...struct,
        refiner: (value, ctx)=>value === undefined || struct.refiner(value, ctx),
        validator (value, ctx) {
            if (value === undefined) {
                return true;
            } else {
                log(value, ctx);
                return struct.validator(value, ctx);
            }
        }
    });
}
/**
 * Create a struct with dynamic validation logic.
 *
 * The callback will receive the value currently being validated, and must
 * return a struct object to validate it with. This can be useful to model
 * validation logic that changes based on its input.
 */ function dynamic(fn) {
    return new Struct({
        type: 'dynamic',
        schema: null,
        *entries (value, ctx) {
            const struct = fn(value, ctx);
            yield* struct.entries(value, ctx);
        },
        validator (value, ctx) {
            const struct = fn(value, ctx);
            return struct.validator(value, ctx);
        },
        coercer (value, ctx) {
            const struct = fn(value, ctx);
            return struct.coercer(value, ctx);
        },
        refiner (value, ctx) {
            const struct = fn(value, ctx);
            return struct.refiner(value, ctx);
        }
    });
}
/**
 * Create a struct with lazily evaluated validation logic.
 *
 * The first time validation is run with the struct, the callback will be called
 * and must return a struct object to use. This is useful for cases where you
 * want to have self-referential structs for nested data structures to avoid a
 * circular definition problem.
 */ function lazy(fn) {
    let struct;
    return new Struct({
        type: 'lazy',
        schema: null,
        *entries (value, ctx) {
            var _struct;
            (_struct = struct) != null ? _struct : struct = fn();
            yield* struct.entries(value, ctx);
        },
        validator (value, ctx) {
            var _struct2;
            (_struct2 = struct) != null ? _struct2 : struct = fn();
            return struct.validator(value, ctx);
        },
        coercer (value, ctx) {
            var _struct3;
            (_struct3 = struct) != null ? _struct3 : struct = fn();
            return struct.coercer(value, ctx);
        },
        refiner (value, ctx) {
            var _struct4;
            (_struct4 = struct) != null ? _struct4 : struct = fn();
            return struct.refiner(value, ctx);
        }
    });
}
/**
 * Create a new struct based on an existing object struct, but excluding
 * specific properties.
 *
 * Like TypeScript's `Omit` utility.
 */ function omit(struct, keys) {
    const { schema } = struct;
    const subschema = {
        ...schema
    };
    for (const key of keys){
        delete subschema[key];
    }
    switch(struct.type){
        case 'type':
            return type(subschema);
        default:
            return object(subschema);
    }
}
/**
 * Create a new struct based on an existing object struct, but with all of its
 * properties allowed to be `undefined`.
 *
 * Like TypeScript's `Partial` utility.
 */ function partial(struct) {
    const schema = struct instanceof Struct ? {
        ...struct.schema
    } : {
        ...struct
    };
    for(const key in schema){
        schema[key] = optional(schema[key]);
    }
    return object(schema);
}
/**
 * Create a new struct based on an existing object struct, but only including
 * specific properties.
 *
 * Like TypeScript's `Pick` utility.
 */ function pick(struct, keys) {
    const { schema } = struct;
    const subschema = {};
    for (const key of keys){
        subschema[key] = schema[key];
    }
    return object(subschema);
}
/**
 * Define a new struct type with a custom validation function.
 *
 * @deprecated This function has been renamed to `define`.
 */ function struct(name, validator) {
    console.warn('superstruct@0.11 - The `struct` helper has been renamed to `define`.');
    return define(name, validator);
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
 * Ensure that a value is a bigint.
 */ function bigint() {
    return define('bigint', (value)=>{
        return typeof value === 'bigint';
    });
}
/**
 * Ensure that a value is a boolean.
 */ function boolean() {
    return define('boolean', (value)=>{
        return typeof value === 'boolean';
    });
}
/**
 * Ensure that a value is a valid `Date`.
 *
 * Note: this also ensures that the value is *not* an invalid `Date` object,
 * which can occur when parsing a date fails but still returns a `Date`.
 */ function date() {
    return define('date', (value)=>{
        return value instanceof Date && !isNaN(value.getTime()) || "Expected a valid `Date` object, but received: " + print(value);
    });
}
function enums(values) {
    const schema = {};
    const description = values.map((v)=>print(v)).join();
    for (const key of values){
        schema[key] = key;
    }
    return new Struct({
        type: 'enums',
        schema,
        validator (value) {
            return values.includes(value) || "Expected one of `" + description + "`, but received: " + print(value);
        }
    });
}
/**
 * Ensure that a value is a function.
 */ function func() {
    return define('func', (value)=>{
        return typeof value === 'function' || "Expected a function, but received: " + print(value);
    });
}
/**
 * Ensure that a value is an instance of a specific class.
 */ function instance(Class) {
    return define('instance', (value)=>{
        return value instanceof Class || "Expected a `" + Class.name + "` instance, but received: " + print(value);
    });
}
/**
 * Ensure that a value is an integer.
 */ function integer() {
    return define('integer', (value)=>{
        return typeof value === 'number' && !isNaN(value) && Number.isInteger(value) || "Expected an integer, but received: " + print(value);
    });
}
/**
 * Ensure that a value matches all of a set of types.
 */ function intersection(Structs) {
    return new Struct({
        type: 'intersection',
        schema: null,
        *entries (value, ctx) {
            for (const S of Structs){
                yield* S.entries(value, ctx);
            }
        },
        *validator (value, ctx) {
            for (const S of Structs){
                yield* S.validator(value, ctx);
            }
        },
        *refiner (value, ctx) {
            for (const S of Structs){
                yield* S.refiner(value, ctx);
            }
        }
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
function map(Key, Value) {
    return new Struct({
        type: 'map',
        schema: null,
        *entries (value) {
            if (Key && Value && value instanceof Map) {
                for (const [k, v] of value.entries()){
                    yield [
                        k,
                        k,
                        Key
                    ];
                    yield [
                        k,
                        v,
                        Value
                    ];
                }
            }
        },
        coercer (value) {
            return value instanceof Map ? new Map(value) : value;
        },
        validator (value) {
            return value instanceof Map || "Expected a `Map` object, but received: " + print(value);
        }
    });
}
/**
 * Ensure that no value ever passes validation.
 */ function never() {
    return define('never', ()=>false);
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
function object(schema) {
    const knowns = schema ? Object.keys(schema) : [];
    const Never = never();
    return new Struct({
        type: 'object',
        schema: schema ? schema : null,
        *entries (value) {
            if (schema && isObject(value)) {
                const unknowns = new Set(Object.keys(value));
                for (const key of knowns){
                    unknowns.delete(key);
                    yield [
                        key,
                        value[key],
                        schema[key]
                    ];
                }
                for (const key of unknowns){
                    yield [
                        key,
                        value[key],
                        Never
                    ];
                }
            }
        },
        validator (value) {
            return isObject(value) || "Expected an object, but received: " + print(value);
        },
        coercer (value) {
            return isObject(value) ? {
                ...value
            } : value;
        }
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
 * Ensure that a value is an object with keys and values of specific types, but
 * without ensuring any specific shape of properties.
 *
 * Like TypeScript's `Record` utility.
 */ function record(Key, Value) {
    return new Struct({
        type: 'record',
        schema: null,
        *entries (value) {
            if (isObject(value)) {
                for(const k in value){
                    const v = value[k];
                    yield [
                        k,
                        k,
                        Key
                    ];
                    yield [
                        k,
                        v,
                        Value
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
 * Ensure that a value is a `RegExp`.
 *
 * Note: this does not test the value against the regular expression! For that
 * you need to use the `pattern()` refinement.
 */ function regexp() {
    return define('regexp', (value)=>{
        return value instanceof RegExp;
    });
}
function set(Element) {
    return new Struct({
        type: 'set',
        schema: null,
        *entries (value) {
            if (Element && value instanceof Set) {
                for (const v of value){
                    yield [
                        v,
                        v,
                        Element
                    ];
                }
            }
        },
        coercer (value) {
            return value instanceof Set ? new Set(value) : value;
        },
        validator (value) {
            return value instanceof Set || "Expected a `Set` object, but received: " + print(value);
        }
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
 * Ensure that a value is a tuple of a specific length, and that each of its
 * elements is of a specific type.
 */ function tuple(Structs) {
    const Never = never();
    return new Struct({
        type: 'tuple',
        schema: null,
        *entries (value) {
            if (Array.isArray(value)) {
                const length = Math.max(Structs.length, value.length);
                for(let i = 0; i < length; i++){
                    yield [
                        i,
                        value[i],
                        Structs[i] || Never
                    ];
                }
            }
        },
        validator (value) {
            return Array.isArray(value) || "Expected an array, but received: " + print(value);
        }
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
 */ function union(Structs) {
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
 * Augment a struct to replace `undefined` values with a default.
 *
 * Note: You must use `create(value, Struct)` on the value to have the coercion
 * take effect! Using simply `assert()` or `is()` will not use coercion.
 */ function defaulted(struct, fallback, options) {
    if (options === void 0) {
        options = {};
    }
    return coerce(struct, unknown(), (x)=>{
        const f = typeof fallback === 'function' ? fallback() : fallback;
        if (x === undefined) {
            return f;
        }
        if (!options.strict && isPlainObject(x) && isPlainObject(f)) {
            const ret = {
                ...x
            };
            let changed = false;
            for(const key in f){
                if (ret[key] === undefined) {
                    ret[key] = f[key];
                    changed = true;
                }
            }
            if (changed) {
                return ret;
            }
        }
        return x;
    });
}
/**
 * Augment a struct to trim string inputs.
 *
 * Note: You must use `create(value, Struct)` on the value to have the coercion
 * take effect! Using simply `assert()` or `is()` will not use coercion.
 */ function trimmed(struct) {
    return coerce(struct, string(), (x)=>x.trim());
}
/**
 * Ensure that a string, array, map, or set is empty.
 */ function empty(struct) {
    return refine(struct, 'empty', (value)=>{
        const size = getSize(value);
        return size === 0 || "Expected an empty " + struct.type + " but received one with a size of `" + size + "`";
    });
}
function getSize(value) {
    if (value instanceof Map || value instanceof Set) {
        return value.size;
    } else {
        return value.length;
    }
}
/**
 * Ensure that a number or date is below a threshold.
 */ function max(struct, threshold, options) {
    if (options === void 0) {
        options = {};
    }
    const { exclusive } = options;
    return refine(struct, 'max', (value)=>{
        return exclusive ? value < threshold : value <= threshold || "Expected a " + struct.type + " less than " + (exclusive ? '' : 'or equal to ') + threshold + " but received `" + value + "`";
    });
}
/**
 * Ensure that a number or date is above a threshold.
 */ function min(struct, threshold, options) {
    if (options === void 0) {
        options = {};
    }
    const { exclusive } = options;
    return refine(struct, 'min', (value)=>{
        return exclusive ? value > threshold : value >= threshold || "Expected a " + struct.type + " greater than " + (exclusive ? '' : 'or equal to ') + threshold + " but received `" + value + "`";
    });
}
/**
 * Ensure that a string, array, map or set is not empty.
 */ function nonempty(struct) {
    return refine(struct, 'nonempty', (value)=>{
        const size = getSize(value);
        return size > 0 || "Expected a nonempty " + struct.type + " but received an empty one";
    });
}
/**
 * Ensure that a string matches a regular expression.
 */ function pattern(struct, regexp) {
    return refine(struct, 'pattern', (value)=>{
        return regexp.test(value) || "Expected a " + struct.type + " matching `/" + regexp.source + "/` but received \"" + value + "\"";
    });
}
/**
 * Ensure that a string, array, number, date, map, or set has a size (or length, or time) between `min` and `max`.
 */ function size(struct, min, max) {
    if (max === void 0) {
        max = min;
    }
    const expected = "Expected a " + struct.type;
    const of = min === max ? "of `" + min + "`" : "between `" + min + "` and `" + max + "`";
    return refine(struct, 'size', (value)=>{
        if (typeof value === 'number' || value instanceof Date) {
            return min <= value && value <= max || expected + " " + of + " but received `" + value + "`";
        } else if (value instanceof Map || value instanceof Set) {
            const { size } = value;
            return min <= size && size <= max || expected + " with a size " + of + " but received one with a size of `" + size + "`";
        } else {
            const { length } = value;
            return min <= length && length <= max || expected + " with a length " + of + " but received one with a length of `" + length + "`";
        }
    });
}
/**
 * Augment a `Struct` to add an additional refinement to the validation.
 *
 * The refiner function is guaranteed to receive a value of the struct's type,
 * because the struct's existing validation will already have passed. This
 * allows you to layer additional validation on top of existing structs.
 */ function refine(struct, name, refiner) {
    return new Struct({
        ...struct,
        *refiner (value, ctx) {
            yield* struct.refiner(value, ctx);
            const result = refiner(value, ctx);
            const failures = toFailures(result, ctx, struct, value);
            for (const failure of failures){
                yield {
                    ...failure,
                    refinement: name
                };
            }
        }
    });
}
;
 //# sourceMappingURL=index.es.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
;
;
;
;
;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/rng.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>rng
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate
let poolPtr = rnds8Pool.length;
function rng() {
    if (poolPtr > rnds8Pool.length - 16) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomFillSync(rnds8Pool);
        poolPtr = 0;
    }
    return rnds8Pool.slice(poolPtr, poolPtr += 16);
}
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/regex.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/validate.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$regex$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/regex.js [app-ssr] (ecmascript)");
;
function validate(uuid) {
    return typeof uuid === 'string' && __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$regex$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].test(uuid);
}
const __TURBOPACK__default__export__ = validate;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/stringify.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$validate$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/validate.js [app-ssr] (ecmascript)");
;
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */ const byteToHex = [];
for(let i = 0; i < 256; ++i){
    byteToHex.push((i + 0x100).toString(16).substr(1));
}
function stringify(arr, offset = 0) {
    // Note: Be careful editing this code!  It's been tuned for performance
    // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
    const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
    // of the following:
    // - One or more input array values don't map to a hex octet (leading to
    // "undefined" in the uuid)
    // - Invalid input values for the RFC `version` or `variant` fields
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$validate$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(uuid)) {
        throw TypeError('Stringified UUID is invalid');
    }
    return uuid;
}
const __TURBOPACK__default__export__ = stringify;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/v1.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$rng$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/rng.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/stringify.js [app-ssr] (ecmascript)"); // **`v1()` - Generate time-based UUID**
;
;
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;
let _clockseq; // Previous uuid creation time
let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details
function v1(options, buf, offset) {
    let i = buf && offset || 0;
    const b = buf || new Array(16);
    options = options || {};
    let node = options.node || _nodeId;
    let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
    // specified.  We do this lazily to minimize issues related to insufficient
    // system entropy.  See #189
    if (node == null || clockseq == null) {
        const seedBytes = options.random || (options.rng || __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$rng$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])();
        if (node == null) {
            // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
            node = _nodeId = [
                seedBytes[0] | 0x01,
                seedBytes[1],
                seedBytes[2],
                seedBytes[3],
                seedBytes[4],
                seedBytes[5]
            ];
        }
        if (clockseq == null) {
            // Per 4.2.2, randomize (14 bit) clockseq
            clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
        }
    } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)
    const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq === undefined) {
        clockseq = clockseq + 1 & 0x3fff;
    } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
        nsecs = 0;
    } // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
        throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
    }
    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000; // `time_low`
    const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff; // `time_mid`
    const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff; // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`
    b[i++] = clockseq & 0xff; // `node`
    for(let n = 0; n < 6; ++n){
        b[i + n] = node[n];
    }
    return buf || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(b);
}
const __TURBOPACK__default__export__ = v1;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/parse.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$validate$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/validate.js [app-ssr] (ecmascript)");
;
function parse(uuid) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$validate$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(uuid)) {
        throw TypeError('Invalid UUID');
    }
    let v;
    const arr = new Uint8Array(16); // Parse ########-....-....-....-............
    arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
    arr[1] = v >>> 16 & 0xff;
    arr[2] = v >>> 8 & 0xff;
    arr[3] = v & 0xff; // Parse ........-####-....-....-............
    arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
    arr[5] = v & 0xff; // Parse ........-....-####-....-............
    arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
    arr[7] = v & 0xff; // Parse ........-....-....-####-............
    arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
    arr[9] = v & 0xff; // Parse ........-....-....-....-############
    // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)
    arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
    arr[11] = v / 0x100000000 & 0xff;
    arr[12] = v >>> 24 & 0xff;
    arr[13] = v >>> 16 & 0xff;
    arr[14] = v >>> 8 & 0xff;
    arr[15] = v & 0xff;
    return arr;
}
const __TURBOPACK__default__export__ = parse;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/v35.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DNS",
    ()=>DNS,
    "URL",
    ()=>URL,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/stringify.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$parse$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/parse.js [app-ssr] (ecmascript)");
;
;
function stringToBytes(str) {
    str = unescape(encodeURIComponent(str)); // UTF8 escape
    const bytes = [];
    for(let i = 0; i < str.length; ++i){
        bytes.push(str.charCodeAt(i));
    }
    return bytes;
}
const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
function __TURBOPACK__default__export__(name, version, hashfunc) {
    function generateUUID(value, namespace, buf, offset) {
        if (typeof value === 'string') {
            value = stringToBytes(value);
        }
        if (typeof namespace === 'string') {
            namespace = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$parse$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(namespace);
        }
        if (namespace.length !== 16) {
            throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
        } // Compute hash of namespace and value, Per 4.3
        // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
        // hashfunc([...namespace, ... value])`
        let bytes = new Uint8Array(16 + value.length);
        bytes.set(namespace);
        bytes.set(value, namespace.length);
        bytes = hashfunc(bytes);
        bytes[6] = bytes[6] & 0x0f | version;
        bytes[8] = bytes[8] & 0x3f | 0x80;
        if (buf) {
            offset = offset || 0;
            for(let i = 0; i < 16; ++i){
                buf[offset + i] = bytes[i];
            }
            return buf;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(bytes);
    } // Function#name is not settable on some platforms (#270)
    try {
        generateUUID.name = name; // eslint-disable-next-line no-empty
    } catch (err) {} // For CommonJS default export support
    generateUUID.DNS = DNS;
    generateUUID.URL = URL;
    return generateUUID;
}
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/md5.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
function md5(bytes) {
    if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
    } else if (typeof bytes === 'string') {
        bytes = Buffer.from(bytes, 'utf8');
    }
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash('md5').update(bytes).digest();
}
const __TURBOPACK__default__export__ = md5;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/v3.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v35$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/v35.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$md5$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/md5.js [app-ssr] (ecmascript)");
;
;
const v3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v35$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])('v3', 0x30, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$md5$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = v3;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/v4.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$rng$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/rng.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/stringify.js [app-ssr] (ecmascript)");
;
;
function v4(options, buf, offset) {
    options = options || {};
    const rnds = options.random || (options.rng || __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$rng$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = rnds[6] & 0x0f | 0x40;
    rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided
    if (buf) {
        offset = offset || 0;
        for(let i = 0; i < 16; ++i){
            buf[offset + i] = rnds[i];
        }
        return buf;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(rnds);
}
const __TURBOPACK__default__export__ = v4;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/sha1.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
function sha1(bytes) {
    if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
    } else if (typeof bytes === 'string') {
        bytes = Buffer.from(bytes, 'utf8');
    }
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash('sha1').update(bytes).digest();
}
const __TURBOPACK__default__export__ = sha1;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/v5.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v35$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/v35.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$sha1$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/sha1.js [app-ssr] (ecmascript)");
;
;
const v5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v35$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])('v5', 0x50, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$sha1$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = v5;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/nil.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = '00000000-0000-0000-0000-000000000000';
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/version.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$validate$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/validate.js [app-ssr] (ecmascript)");
;
function version(uuid) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$validate$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(uuid)) {
        throw TypeError('Invalid UUID');
    }
    return parseInt(uuid.substr(14, 1), 16);
}
const __TURBOPACK__default__export__ = version;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NIL",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$nil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    "parse",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$parse$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    "stringify",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    "v1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v1$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    "v3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    "v4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v4$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    "v5",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v5$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    "validate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$validate$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    "version",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$version$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v1$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/v1.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/v3.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v4$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/v4.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v5$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/v5.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$nil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/nil.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$version$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/version.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$validate$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/validate.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/stringify.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$parse$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/parse.js [app-ssr] (ecmascript)");
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/v1.js [app-ssr] (ecmascript) <export default as v1>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "v1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v1$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v1$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/v1.js [app-ssr] (ecmascript)");
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/jayson/lib/generateRequest.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const uuid = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/index.js [app-ssr] (ecmascript)").v4;
/**
 *  Generates a JSON-RPC 1.0 or 2.0 request
 *  @param {String} method Name of method to call
 *  @param {Array|Object} params Array of parameters passed to the method as specified, or an object of parameter names and corresponding value
 *  @param {String|Number|null} [id] Request ID can be a string, number, null for explicit notification or left out for automatic generation
 *  @param {Object} [options]
 *  @param {Number} [options.version=2] JSON-RPC version to use (1 or 2)
 *  @param {Boolean} [options.notificationIdNull=false] When true, version 2 requests will set id to null instead of omitting it
 *  @param {Function} [options.generator] Passed the request, and the options object and is expected to return a request ID
 *  @throws {TypeError} If any of the parameters are invalid
 *  @return {Object} A JSON-RPC 1.0 or 2.0 request
 *  @memberOf Utils
 */ const generateRequest = function(method, params, id, options) {
    if (typeof method !== 'string') {
        throw new TypeError(method + ' must be a string');
    }
    options = options || {};
    // check valid version provided
    const version = typeof options.version === 'number' ? options.version : 2;
    if (version !== 1 && version !== 2) {
        throw new TypeError(version + ' must be 1 or 2');
    }
    const request = {
        method: method
    };
    if (version === 2) {
        request.jsonrpc = '2.0';
    }
    if (params) {
        // params given, but invalid?
        if (typeof params !== 'object' && !Array.isArray(params)) {
            throw new TypeError(params + ' must be an object, array or omitted');
        }
        request.params = params;
    }
    // if id was left out, generate one (null means explicit notification)
    if (typeof id === 'undefined') {
        const generator = typeof options.generator === 'function' ? options.generator : function() {
            return uuid();
        };
        request.id = generator(request, options);
    } else if (version === 2 && id === null) {
        // we have a version 2 notification
        if (options.notificationIdNull) {
            request.id = null; // id will not be set at all unless option provided
        }
    } else {
        request.id = id;
    }
    return request;
};
module.exports = generateRequest;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/jayson/lib/client/browser/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const uuid = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/index.js [app-ssr] (ecmascript)").v4;
const generateRequest = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/jayson/lib/generateRequest.js [app-ssr] (ecmascript)");
/**
 * Constructor for a Jayson Browser Client that does not depend any node.js core libraries
 * @class ClientBrowser
 * @param {Function} callServer Method that calls the server, receives the stringified request and a regular node-style callback
 * @param {Object} [options]
 * @param {Function} [options.reviver] Reviver function for JSON
 * @param {Function} [options.replacer] Replacer function for JSON
 * @param {Number} [options.version=2] JSON-RPC version to use (1|2)
 * @param {Function} [options.generator] Function to use for generating request IDs
 *  @param {Boolean} [options.notificationIdNull=false] When true, version 2 requests will set id to null instead of omitting it
 * @return {ClientBrowser}
 */ const ClientBrowser = function(callServer, options) {
    if (!(this instanceof ClientBrowser)) {
        return new ClientBrowser(callServer, options);
    }
    if (!options) {
        options = {};
    }
    this.options = {
        reviver: typeof options.reviver !== 'undefined' ? options.reviver : null,
        replacer: typeof options.replacer !== 'undefined' ? options.replacer : null,
        generator: typeof options.generator !== 'undefined' ? options.generator : function() {
            return uuid();
        },
        version: typeof options.version !== 'undefined' ? options.version : 2,
        notificationIdNull: typeof options.notificationIdNull === 'boolean' ? options.notificationIdNull : false
    };
    this.callServer = callServer;
};
module.exports = ClientBrowser;
/**
 *  Creates a request and dispatches it if given a callback.
 *  @param {String|Array} method A batch request if passed an Array, or a method name if passed a String
 *  @param {Array|Object} [params] Parameters for the method
 *  @param {String|Number} [id] Optional id. If undefined an id will be generated. If null it creates a notification request
 *  @param {Function} [callback] Request callback. If specified, executes the request rather than only returning it.
 *  @throws {TypeError} Invalid parameters
 *  @return {Object} JSON-RPC 1.0 or 2.0 compatible request
 */ ClientBrowser.prototype.request = function(method, params, id, callback) {
    const self = this;
    let request = null;
    // is this a batch request?
    const isBatch = Array.isArray(method) && typeof params === 'function';
    if (this.options.version === 1 && isBatch) {
        throw new TypeError('JSON-RPC 1.0 does not support batching');
    }
    // is this a raw request?
    const isRaw = !isBatch && method && typeof method === 'object' && typeof params === 'function';
    if (isBatch || isRaw) {
        callback = params;
        request = method;
    } else {
        if (typeof id === 'function') {
            callback = id;
            // specifically undefined because "null" is a notification request
            id = undefined;
        }
        const hasCallback = typeof callback === 'function';
        try {
            request = generateRequest(method, params, id, {
                generator: this.options.generator,
                version: this.options.version,
                notificationIdNull: this.options.notificationIdNull
            });
        } catch (err) {
            if (hasCallback) {
                callback(err);
                return;
            }
            throw err;
        }
        // no callback means we should just return a raw request
        if (!hasCallback) {
            return request;
        }
    }
    let message;
    try {
        message = JSON.stringify(request, this.options.replacer);
    } catch (err) {
        callback(err);
        return;
    }
    this.callServer(message, function(err, response) {
        self._parseResponse(err, response, callback);
    });
    // always return the raw request
    return request;
};
/**
 * Parses a response from a server
 * @param {Object} err Error to pass on that is unrelated to the actual response
 * @param {String} responseText JSON-RPC 1.0 or 2.0 response
 * @param {Function} callback Callback that will receive different arguments depending on the amount of parameters
 * @private
 */ ClientBrowser.prototype._parseResponse = function(err, responseText, callback) {
    if (err) {
        callback(err);
        return;
    }
    if (!responseText) {
        // empty response text, assume that is correct because it could be a
        // notification which jayson does not give any body for
        callback();
        return;
    }
    let response;
    try {
        response = JSON.parse(responseText, this.options.reviver);
    } catch (err) {
        callback(err);
        return;
    }
    if (callback.length === 3) {
        // if callback length is 3, we split callback arguments on error and response
        // is batch response?
        if (Array.isArray(response)) {
            // necessary to split strictly on validity according to spec here
            const isError = function(res) {
                return typeof res.error !== 'undefined';
            };
            const isNotError = function(res) {
                return !isError(res);
            };
            callback(null, response.filter(isError), response.filter(isNotError));
            return;
        } else {
            // split regardless of validity
            callback(null, response.error, response.result);
            return;
        }
    }
    callback(null, response);
};
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/webidl-conversions/lib/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var conversions = {};
module.exports = conversions;
function sign(x) {
    return x < 0 ? -1 : 1;
}
function evenRound(x) {
    // Round x to the nearest integer, choosing the even integer if it lies halfway between two.
    if (x % 1 === 0.5 && (x & 1) === 0) {
        return Math.floor(x);
    } else {
        return Math.round(x);
    }
}
function createNumberConversion(bitLength, typeOpts) {
    if (!typeOpts.unsigned) {
        --bitLength;
    }
    const lowerBound = typeOpts.unsigned ? 0 : -Math.pow(2, bitLength);
    const upperBound = Math.pow(2, bitLength) - 1;
    const moduloVal = typeOpts.moduloBitLength ? Math.pow(2, typeOpts.moduloBitLength) : Math.pow(2, bitLength);
    const moduloBound = typeOpts.moduloBitLength ? Math.pow(2, typeOpts.moduloBitLength - 1) : Math.pow(2, bitLength - 1);
    return function(V, opts) {
        if (!opts) opts = {};
        let x = +V;
        if (opts.enforceRange) {
            if (!Number.isFinite(x)) {
                throw new TypeError("Argument is not a finite number");
            }
            x = sign(x) * Math.floor(Math.abs(x));
            if (x < lowerBound || x > upperBound) {
                throw new TypeError("Argument is not in byte range");
            }
            return x;
        }
        if (!isNaN(x) && opts.clamp) {
            x = evenRound(x);
            if (x < lowerBound) x = lowerBound;
            if (x > upperBound) x = upperBound;
            return x;
        }
        if (!Number.isFinite(x) || x === 0) {
            return 0;
        }
        x = sign(x) * Math.floor(Math.abs(x));
        x = x % moduloVal;
        if (!typeOpts.unsigned && x >= moduloBound) {
            return x - moduloVal;
        } else if (typeOpts.unsigned) {
            if (x < 0) {
                x += moduloVal;
            } else if (x === -0) {
                return 0;
            }
        }
        return x;
    };
}
conversions["void"] = function() {
    return undefined;
};
conversions["boolean"] = function(val) {
    return !!val;
};
conversions["byte"] = createNumberConversion(8, {
    unsigned: false
});
conversions["octet"] = createNumberConversion(8, {
    unsigned: true
});
conversions["short"] = createNumberConversion(16, {
    unsigned: false
});
conversions["unsigned short"] = createNumberConversion(16, {
    unsigned: true
});
conversions["long"] = createNumberConversion(32, {
    unsigned: false
});
conversions["unsigned long"] = createNumberConversion(32, {
    unsigned: true
});
conversions["long long"] = createNumberConversion(32, {
    unsigned: false,
    moduloBitLength: 64
});
conversions["unsigned long long"] = createNumberConversion(32, {
    unsigned: true,
    moduloBitLength: 64
});
conversions["double"] = function(V) {
    const x = +V;
    if (!Number.isFinite(x)) {
        throw new TypeError("Argument is not a finite floating-point value");
    }
    return x;
};
conversions["unrestricted double"] = function(V) {
    const x = +V;
    if (isNaN(x)) {
        throw new TypeError("Argument is NaN");
    }
    return x;
};
// not quite valid, but good enough for JS
conversions["float"] = conversions["double"];
conversions["unrestricted float"] = conversions["unrestricted double"];
conversions["DOMString"] = function(V, opts) {
    if (!opts) opts = {};
    if (opts.treatNullAsEmptyString && V === null) {
        return "";
    }
    return String(V);
};
conversions["ByteString"] = function(V, opts) {
    const x = String(V);
    let c = undefined;
    for(let i = 0; (c = x.codePointAt(i)) !== undefined; ++i){
        if (c > 255) {
            throw new TypeError("Argument is not a valid bytestring");
        }
    }
    return x;
};
conversions["USVString"] = function(V) {
    const S = String(V);
    const n = S.length;
    const U = [];
    for(let i = 0; i < n; ++i){
        const c = S.charCodeAt(i);
        if (c < 0xD800 || c > 0xDFFF) {
            U.push(String.fromCodePoint(c));
        } else if (0xDC00 <= c && c <= 0xDFFF) {
            U.push(String.fromCodePoint(0xFFFD));
        } else {
            if (i === n - 1) {
                U.push(String.fromCodePoint(0xFFFD));
            } else {
                const d = S.charCodeAt(i + 1);
                if (0xDC00 <= d && d <= 0xDFFF) {
                    const a = c & 0x3FF;
                    const b = d & 0x3FF;
                    U.push(String.fromCodePoint((2 << 15) + (2 << 9) * a + b));
                    ++i;
                } else {
                    U.push(String.fromCodePoint(0xFFFD));
                }
            }
        }
    }
    return U.join('');
};
conversions["Date"] = function(V, opts) {
    if (!(V instanceof Date)) {
        throw new TypeError("Argument is not a Date object");
    }
    if (isNaN(V)) {
        return undefined;
    }
    return V;
};
conversions["RegExp"] = function(V, opts) {
    if (!(V instanceof RegExp)) {
        V = new RegExp(V);
    }
    return V;
};
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/whatwg-url/lib/utils.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports.mixin = function mixin(target, source) {
    const keys = Object.getOwnPropertyNames(source);
    for(let i = 0; i < keys.length; ++i){
        Object.defineProperty(target, keys[i], Object.getOwnPropertyDescriptor(source, keys[i]));
    }
};
module.exports.wrapperSymbol = Symbol("wrapper");
module.exports.implSymbol = Symbol("impl");
module.exports.wrapperForImpl = function(impl) {
    return impl[module.exports.wrapperSymbol];
};
module.exports.implForWrapper = function(wrapper) {
    return wrapper[module.exports.implSymbol];
};
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/whatwg-url/lib/url-state-machine.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const punycode = __turbopack_context__.r("[externals]/punycode [external] (punycode, cjs)");
const tr46 = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/tr46/index.js [app-ssr] (ecmascript)");
const specialSchemes = {
    ftp: 21,
    file: null,
    gopher: 70,
    http: 80,
    https: 443,
    ws: 80,
    wss: 443
};
const failure = Symbol("failure");
function countSymbols(str) {
    return punycode.ucs2.decode(str).length;
}
function at(input, idx) {
    const c = input[idx];
    return isNaN(c) ? undefined : String.fromCodePoint(c);
}
function isASCIIDigit(c) {
    return c >= 0x30 && c <= 0x39;
}
function isASCIIAlpha(c) {
    return c >= 0x41 && c <= 0x5A || c >= 0x61 && c <= 0x7A;
}
function isASCIIAlphanumeric(c) {
    return isASCIIAlpha(c) || isASCIIDigit(c);
}
function isASCIIHex(c) {
    return isASCIIDigit(c) || c >= 0x41 && c <= 0x46 || c >= 0x61 && c <= 0x66;
}
function isSingleDot(buffer) {
    return buffer === "." || buffer.toLowerCase() === "%2e";
}
function isDoubleDot(buffer) {
    buffer = buffer.toLowerCase();
    return buffer === ".." || buffer === "%2e." || buffer === ".%2e" || buffer === "%2e%2e";
}
function isWindowsDriveLetterCodePoints(cp1, cp2) {
    return isASCIIAlpha(cp1) && (cp2 === 58 || cp2 === 124);
}
function isWindowsDriveLetterString(string) {
    return string.length === 2 && isASCIIAlpha(string.codePointAt(0)) && (string[1] === ":" || string[1] === "|");
}
function isNormalizedWindowsDriveLetterString(string) {
    return string.length === 2 && isASCIIAlpha(string.codePointAt(0)) && string[1] === ":";
}
function containsForbiddenHostCodePoint(string) {
    return string.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|%|\/|:|\?|@|\[|\\|\]/) !== -1;
}
function containsForbiddenHostCodePointExcludingPercent(string) {
    return string.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|\/|:|\?|@|\[|\\|\]/) !== -1;
}
function isSpecialScheme(scheme) {
    return specialSchemes[scheme] !== undefined;
}
function isSpecial(url) {
    return isSpecialScheme(url.scheme);
}
function defaultPort(scheme) {
    return specialSchemes[scheme];
}
function percentEncode(c) {
    let hex = c.toString(16).toUpperCase();
    if (hex.length === 1) {
        hex = "0" + hex;
    }
    return "%" + hex;
}
function utf8PercentEncode(c) {
    const buf = new Buffer(c);
    let str = "";
    for(let i = 0; i < buf.length; ++i){
        str += percentEncode(buf[i]);
    }
    return str;
}
function utf8PercentDecode(str) {
    const input = new Buffer(str);
    const output = [];
    for(let i = 0; i < input.length; ++i){
        if (input[i] !== 37) {
            output.push(input[i]);
        } else if (input[i] === 37 && isASCIIHex(input[i + 1]) && isASCIIHex(input[i + 2])) {
            output.push(parseInt(input.slice(i + 1, i + 3).toString(), 16));
            i += 2;
        } else {
            output.push(input[i]);
        }
    }
    return new Buffer(output).toString();
}
function isC0ControlPercentEncode(c) {
    return c <= 0x1F || c > 0x7E;
}
const extraPathPercentEncodeSet = new Set([
    32,
    34,
    35,
    60,
    62,
    63,
    96,
    123,
    125
]);
function isPathPercentEncode(c) {
    return isC0ControlPercentEncode(c) || extraPathPercentEncodeSet.has(c);
}
const extraUserinfoPercentEncodeSet = new Set([
    47,
    58,
    59,
    61,
    64,
    91,
    92,
    93,
    94,
    124
]);
function isUserinfoPercentEncode(c) {
    return isPathPercentEncode(c) || extraUserinfoPercentEncodeSet.has(c);
}
function percentEncodeChar(c, encodeSetPredicate) {
    const cStr = String.fromCodePoint(c);
    if (encodeSetPredicate(c)) {
        return utf8PercentEncode(cStr);
    }
    return cStr;
}
function parseIPv4Number(input) {
    let R = 10;
    if (input.length >= 2 && input.charAt(0) === "0" && input.charAt(1).toLowerCase() === "x") {
        input = input.substring(2);
        R = 16;
    } else if (input.length >= 2 && input.charAt(0) === "0") {
        input = input.substring(1);
        R = 8;
    }
    if (input === "") {
        return 0;
    }
    const regex = R === 10 ? /[^0-9]/ : R === 16 ? /[^0-9A-Fa-f]/ : /[^0-7]/;
    if (regex.test(input)) {
        return failure;
    }
    return parseInt(input, R);
}
function parseIPv4(input) {
    const parts = input.split(".");
    if (parts[parts.length - 1] === "") {
        if (parts.length > 1) {
            parts.pop();
        }
    }
    if (parts.length > 4) {
        return input;
    }
    const numbers = [];
    for (const part of parts){
        if (part === "") {
            return input;
        }
        const n = parseIPv4Number(part);
        if (n === failure) {
            return input;
        }
        numbers.push(n);
    }
    for(let i = 0; i < numbers.length - 1; ++i){
        if (numbers[i] > 255) {
            return failure;
        }
    }
    if (numbers[numbers.length - 1] >= Math.pow(256, 5 - numbers.length)) {
        return failure;
    }
    let ipv4 = numbers.pop();
    let counter = 0;
    for (const n of numbers){
        ipv4 += n * Math.pow(256, 3 - counter);
        ++counter;
    }
    return ipv4;
}
function serializeIPv4(address) {
    let output = "";
    let n = address;
    for(let i = 1; i <= 4; ++i){
        output = String(n % 256) + output;
        if (i !== 4) {
            output = "." + output;
        }
        n = Math.floor(n / 256);
    }
    return output;
}
function parseIPv6(input) {
    const address = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ];
    let pieceIndex = 0;
    let compress = null;
    let pointer = 0;
    input = punycode.ucs2.decode(input);
    if (input[pointer] === 58) {
        if (input[pointer + 1] !== 58) {
            return failure;
        }
        pointer += 2;
        ++pieceIndex;
        compress = pieceIndex;
    }
    while(pointer < input.length){
        if (pieceIndex === 8) {
            return failure;
        }
        if (input[pointer] === 58) {
            if (compress !== null) {
                return failure;
            }
            ++pointer;
            ++pieceIndex;
            compress = pieceIndex;
            continue;
        }
        let value = 0;
        let length = 0;
        while(length < 4 && isASCIIHex(input[pointer])){
            value = value * 0x10 + parseInt(at(input, pointer), 16);
            ++pointer;
            ++length;
        }
        if (input[pointer] === 46) {
            if (length === 0) {
                return failure;
            }
            pointer -= length;
            if (pieceIndex > 6) {
                return failure;
            }
            let numbersSeen = 0;
            while(input[pointer] !== undefined){
                let ipv4Piece = null;
                if (numbersSeen > 0) {
                    if (input[pointer] === 46 && numbersSeen < 4) {
                        ++pointer;
                    } else {
                        return failure;
                    }
                }
                if (!isASCIIDigit(input[pointer])) {
                    return failure;
                }
                while(isASCIIDigit(input[pointer])){
                    const number = parseInt(at(input, pointer));
                    if (ipv4Piece === null) {
                        ipv4Piece = number;
                    } else if (ipv4Piece === 0) {
                        return failure;
                    } else {
                        ipv4Piece = ipv4Piece * 10 + number;
                    }
                    if (ipv4Piece > 255) {
                        return failure;
                    }
                    ++pointer;
                }
                address[pieceIndex] = address[pieceIndex] * 0x100 + ipv4Piece;
                ++numbersSeen;
                if (numbersSeen === 2 || numbersSeen === 4) {
                    ++pieceIndex;
                }
            }
            if (numbersSeen !== 4) {
                return failure;
            }
            break;
        } else if (input[pointer] === 58) {
            ++pointer;
            if (input[pointer] === undefined) {
                return failure;
            }
        } else if (input[pointer] !== undefined) {
            return failure;
        }
        address[pieceIndex] = value;
        ++pieceIndex;
    }
    if (compress !== null) {
        let swaps = pieceIndex - compress;
        pieceIndex = 7;
        while(pieceIndex !== 0 && swaps > 0){
            const temp = address[compress + swaps - 1];
            address[compress + swaps - 1] = address[pieceIndex];
            address[pieceIndex] = temp;
            --pieceIndex;
            --swaps;
        }
    } else if (compress === null && pieceIndex !== 8) {
        return failure;
    }
    return address;
}
function serializeIPv6(address) {
    let output = "";
    const seqResult = findLongestZeroSequence(address);
    const compress = seqResult.idx;
    let ignore0 = false;
    for(let pieceIndex = 0; pieceIndex <= 7; ++pieceIndex){
        if (ignore0 && address[pieceIndex] === 0) {
            continue;
        } else if (ignore0) {
            ignore0 = false;
        }
        if (compress === pieceIndex) {
            const separator = pieceIndex === 0 ? "::" : ":";
            output += separator;
            ignore0 = true;
            continue;
        }
        output += address[pieceIndex].toString(16);
        if (pieceIndex !== 7) {
            output += ":";
        }
    }
    return output;
}
function parseHost(input, isSpecialArg) {
    if (input[0] === "[") {
        if (input[input.length - 1] !== "]") {
            return failure;
        }
        return parseIPv6(input.substring(1, input.length - 1));
    }
    if (!isSpecialArg) {
        return parseOpaqueHost(input);
    }
    const domain = utf8PercentDecode(input);
    const asciiDomain = tr46.toASCII(domain, false, tr46.PROCESSING_OPTIONS.NONTRANSITIONAL, false);
    if (asciiDomain === null) {
        return failure;
    }
    if (containsForbiddenHostCodePoint(asciiDomain)) {
        return failure;
    }
    const ipv4Host = parseIPv4(asciiDomain);
    if (typeof ipv4Host === "number" || ipv4Host === failure) {
        return ipv4Host;
    }
    return asciiDomain;
}
function parseOpaqueHost(input) {
    if (containsForbiddenHostCodePointExcludingPercent(input)) {
        return failure;
    }
    let output = "";
    const decoded = punycode.ucs2.decode(input);
    for(let i = 0; i < decoded.length; ++i){
        output += percentEncodeChar(decoded[i], isC0ControlPercentEncode);
    }
    return output;
}
function findLongestZeroSequence(arr) {
    let maxIdx = null;
    let maxLen = 1; // only find elements > 1
    let currStart = null;
    let currLen = 0;
    for(let i = 0; i < arr.length; ++i){
        if (arr[i] !== 0) {
            if (currLen > maxLen) {
                maxIdx = currStart;
                maxLen = currLen;
            }
            currStart = null;
            currLen = 0;
        } else {
            if (currStart === null) {
                currStart = i;
            }
            ++currLen;
        }
    }
    // if trailing zeros
    if (currLen > maxLen) {
        maxIdx = currStart;
        maxLen = currLen;
    }
    return {
        idx: maxIdx,
        len: maxLen
    };
}
function serializeHost(host) {
    if (typeof host === "number") {
        return serializeIPv4(host);
    }
    // IPv6 serializer
    if (host instanceof Array) {
        return "[" + serializeIPv6(host) + "]";
    }
    return host;
}
function trimControlChars(url) {
    return url.replace(/^[\u0000-\u001F\u0020]+|[\u0000-\u001F\u0020]+$/g, "");
}
function trimTabAndNewline(url) {
    return url.replace(/\u0009|\u000A|\u000D/g, "");
}
function shortenPath(url) {
    const path = url.path;
    if (path.length === 0) {
        return;
    }
    if (url.scheme === "file" && path.length === 1 && isNormalizedWindowsDriveLetter(path[0])) {
        return;
    }
    path.pop();
}
function includesCredentials(url) {
    return url.username !== "" || url.password !== "";
}
function cannotHaveAUsernamePasswordPort(url) {
    return url.host === null || url.host === "" || url.cannotBeABaseURL || url.scheme === "file";
}
function isNormalizedWindowsDriveLetter(string) {
    return /^[A-Za-z]:$/.test(string);
}
function URLStateMachine(input, base, encodingOverride, url, stateOverride) {
    this.pointer = 0;
    this.input = input;
    this.base = base || null;
    this.encodingOverride = encodingOverride || "utf-8";
    this.stateOverride = stateOverride;
    this.url = url;
    this.failure = false;
    this.parseError = false;
    if (!this.url) {
        this.url = {
            scheme: "",
            username: "",
            password: "",
            host: null,
            port: null,
            path: [],
            query: null,
            fragment: null,
            cannotBeABaseURL: false
        };
        const res = trimControlChars(this.input);
        if (res !== this.input) {
            this.parseError = true;
        }
        this.input = res;
    }
    const res = trimTabAndNewline(this.input);
    if (res !== this.input) {
        this.parseError = true;
    }
    this.input = res;
    this.state = stateOverride || "scheme start";
    this.buffer = "";
    this.atFlag = false;
    this.arrFlag = false;
    this.passwordTokenSeenFlag = false;
    this.input = punycode.ucs2.decode(this.input);
    for(; this.pointer <= this.input.length; ++this.pointer){
        const c = this.input[this.pointer];
        const cStr = isNaN(c) ? undefined : String.fromCodePoint(c);
        // exec state machine
        const ret = this["parse " + this.state](c, cStr);
        if (!ret) {
            break; // terminate algorithm
        } else if (ret === failure) {
            this.failure = true;
            break;
        }
    }
}
URLStateMachine.prototype["parse scheme start"] = function parseSchemeStart(c, cStr) {
    if (isASCIIAlpha(c)) {
        this.buffer += cStr.toLowerCase();
        this.state = "scheme";
    } else if (!this.stateOverride) {
        this.state = "no scheme";
        --this.pointer;
    } else {
        this.parseError = true;
        return failure;
    }
    return true;
};
URLStateMachine.prototype["parse scheme"] = function parseScheme(c, cStr) {
    if (isASCIIAlphanumeric(c) || c === 43 || c === 45 || c === 46) {
        this.buffer += cStr.toLowerCase();
    } else if (c === 58) {
        if (this.stateOverride) {
            if (isSpecial(this.url) && !isSpecialScheme(this.buffer)) {
                return false;
            }
            if (!isSpecial(this.url) && isSpecialScheme(this.buffer)) {
                return false;
            }
            if ((includesCredentials(this.url) || this.url.port !== null) && this.buffer === "file") {
                return false;
            }
            if (this.url.scheme === "file" && (this.url.host === "" || this.url.host === null)) {
                return false;
            }
        }
        this.url.scheme = this.buffer;
        this.buffer = "";
        if (this.stateOverride) {
            return false;
        }
        if (this.url.scheme === "file") {
            if (this.input[this.pointer + 1] !== 47 || this.input[this.pointer + 2] !== 47) {
                this.parseError = true;
            }
            this.state = "file";
        } else if (isSpecial(this.url) && this.base !== null && this.base.scheme === this.url.scheme) {
            this.state = "special relative or authority";
        } else if (isSpecial(this.url)) {
            this.state = "special authority slashes";
        } else if (this.input[this.pointer + 1] === 47) {
            this.state = "path or authority";
            ++this.pointer;
        } else {
            this.url.cannotBeABaseURL = true;
            this.url.path.push("");
            this.state = "cannot-be-a-base-URL path";
        }
    } else if (!this.stateOverride) {
        this.buffer = "";
        this.state = "no scheme";
        this.pointer = -1;
    } else {
        this.parseError = true;
        return failure;
    }
    return true;
};
URLStateMachine.prototype["parse no scheme"] = function parseNoScheme(c) {
    if (this.base === null || this.base.cannotBeABaseURL && c !== 35) {
        return failure;
    } else if (this.base.cannotBeABaseURL && c === 35) {
        this.url.scheme = this.base.scheme;
        this.url.path = this.base.path.slice();
        this.url.query = this.base.query;
        this.url.fragment = "";
        this.url.cannotBeABaseURL = true;
        this.state = "fragment";
    } else if (this.base.scheme === "file") {
        this.state = "file";
        --this.pointer;
    } else {
        this.state = "relative";
        --this.pointer;
    }
    return true;
};
URLStateMachine.prototype["parse special relative or authority"] = function parseSpecialRelativeOrAuthority(c) {
    if (c === 47 && this.input[this.pointer + 1] === 47) {
        this.state = "special authority ignore slashes";
        ++this.pointer;
    } else {
        this.parseError = true;
        this.state = "relative";
        --this.pointer;
    }
    return true;
};
URLStateMachine.prototype["parse path or authority"] = function parsePathOrAuthority(c) {
    if (c === 47) {
        this.state = "authority";
    } else {
        this.state = "path";
        --this.pointer;
    }
    return true;
};
URLStateMachine.prototype["parse relative"] = function parseRelative(c) {
    this.url.scheme = this.base.scheme;
    if (isNaN(c)) {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.url.path = this.base.path.slice();
        this.url.query = this.base.query;
    } else if (c === 47) {
        this.state = "relative slash";
    } else if (c === 63) {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.url.path = this.base.path.slice();
        this.url.query = "";
        this.state = "query";
    } else if (c === 35) {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.url.path = this.base.path.slice();
        this.url.query = this.base.query;
        this.url.fragment = "";
        this.state = "fragment";
    } else if (isSpecial(this.url) && c === 92) {
        this.parseError = true;
        this.state = "relative slash";
    } else {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.url.path = this.base.path.slice(0, this.base.path.length - 1);
        this.state = "path";
        --this.pointer;
    }
    return true;
};
URLStateMachine.prototype["parse relative slash"] = function parseRelativeSlash(c) {
    if (isSpecial(this.url) && (c === 47 || c === 92)) {
        if (c === 92) {
            this.parseError = true;
        }
        this.state = "special authority ignore slashes";
    } else if (c === 47) {
        this.state = "authority";
    } else {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.state = "path";
        --this.pointer;
    }
    return true;
};
URLStateMachine.prototype["parse special authority slashes"] = function parseSpecialAuthoritySlashes(c) {
    if (c === 47 && this.input[this.pointer + 1] === 47) {
        this.state = "special authority ignore slashes";
        ++this.pointer;
    } else {
        this.parseError = true;
        this.state = "special authority ignore slashes";
        --this.pointer;
    }
    return true;
};
URLStateMachine.prototype["parse special authority ignore slashes"] = function parseSpecialAuthorityIgnoreSlashes(c) {
    if (c !== 47 && c !== 92) {
        this.state = "authority";
        --this.pointer;
    } else {
        this.parseError = true;
    }
    return true;
};
URLStateMachine.prototype["parse authority"] = function parseAuthority(c, cStr) {
    if (c === 64) {
        this.parseError = true;
        if (this.atFlag) {
            this.buffer = "%40" + this.buffer;
        }
        this.atFlag = true;
        // careful, this is based on buffer and has its own pointer (this.pointer != pointer) and inner chars
        const len = countSymbols(this.buffer);
        for(let pointer = 0; pointer < len; ++pointer){
            const codePoint = this.buffer.codePointAt(pointer);
            if (codePoint === 58 && !this.passwordTokenSeenFlag) {
                this.passwordTokenSeenFlag = true;
                continue;
            }
            const encodedCodePoints = percentEncodeChar(codePoint, isUserinfoPercentEncode);
            if (this.passwordTokenSeenFlag) {
                this.url.password += encodedCodePoints;
            } else {
                this.url.username += encodedCodePoints;
            }
        }
        this.buffer = "";
    } else if (isNaN(c) || c === 47 || c === 63 || c === 35 || isSpecial(this.url) && c === 92) {
        if (this.atFlag && this.buffer === "") {
            this.parseError = true;
            return failure;
        }
        this.pointer -= countSymbols(this.buffer) + 1;
        this.buffer = "";
        this.state = "host";
    } else {
        this.buffer += cStr;
    }
    return true;
};
URLStateMachine.prototype["parse hostname"] = URLStateMachine.prototype["parse host"] = function parseHostName(c, cStr) {
    if (this.stateOverride && this.url.scheme === "file") {
        --this.pointer;
        this.state = "file host";
    } else if (c === 58 && !this.arrFlag) {
        if (this.buffer === "") {
            this.parseError = true;
            return failure;
        }
        const host = parseHost(this.buffer, isSpecial(this.url));
        if (host === failure) {
            return failure;
        }
        this.url.host = host;
        this.buffer = "";
        this.state = "port";
        if (this.stateOverride === "hostname") {
            return false;
        }
    } else if (isNaN(c) || c === 47 || c === 63 || c === 35 || isSpecial(this.url) && c === 92) {
        --this.pointer;
        if (isSpecial(this.url) && this.buffer === "") {
            this.parseError = true;
            return failure;
        } else if (this.stateOverride && this.buffer === "" && (includesCredentials(this.url) || this.url.port !== null)) {
            this.parseError = true;
            return false;
        }
        const host = parseHost(this.buffer, isSpecial(this.url));
        if (host === failure) {
            return failure;
        }
        this.url.host = host;
        this.buffer = "";
        this.state = "path start";
        if (this.stateOverride) {
            return false;
        }
    } else {
        if (c === 91) {
            this.arrFlag = true;
        } else if (c === 93) {
            this.arrFlag = false;
        }
        this.buffer += cStr;
    }
    return true;
};
URLStateMachine.prototype["parse port"] = function parsePort(c, cStr) {
    if (isASCIIDigit(c)) {
        this.buffer += cStr;
    } else if (isNaN(c) || c === 47 || c === 63 || c === 35 || isSpecial(this.url) && c === 92 || this.stateOverride) {
        if (this.buffer !== "") {
            const port = parseInt(this.buffer);
            if (port > Math.pow(2, 16) - 1) {
                this.parseError = true;
                return failure;
            }
            this.url.port = port === defaultPort(this.url.scheme) ? null : port;
            this.buffer = "";
        }
        if (this.stateOverride) {
            return false;
        }
        this.state = "path start";
        --this.pointer;
    } else {
        this.parseError = true;
        return failure;
    }
    return true;
};
const fileOtherwiseCodePoints = new Set([
    47,
    92,
    63,
    35
]);
URLStateMachine.prototype["parse file"] = function parseFile(c) {
    this.url.scheme = "file";
    if (c === 47 || c === 92) {
        if (c === 92) {
            this.parseError = true;
        }
        this.state = "file slash";
    } else if (this.base !== null && this.base.scheme === "file") {
        if (isNaN(c)) {
            this.url.host = this.base.host;
            this.url.path = this.base.path.slice();
            this.url.query = this.base.query;
        } else if (c === 63) {
            this.url.host = this.base.host;
            this.url.path = this.base.path.slice();
            this.url.query = "";
            this.state = "query";
        } else if (c === 35) {
            this.url.host = this.base.host;
            this.url.path = this.base.path.slice();
            this.url.query = this.base.query;
            this.url.fragment = "";
            this.state = "fragment";
        } else {
            if (this.input.length - this.pointer - 1 === 0 || // remaining consists of 0 code points
            !isWindowsDriveLetterCodePoints(c, this.input[this.pointer + 1]) || this.input.length - this.pointer - 1 >= 2 && // remaining has at least 2 code points
            !fileOtherwiseCodePoints.has(this.input[this.pointer + 2])) {
                this.url.host = this.base.host;
                this.url.path = this.base.path.slice();
                shortenPath(this.url);
            } else {
                this.parseError = true;
            }
            this.state = "path";
            --this.pointer;
        }
    } else {
        this.state = "path";
        --this.pointer;
    }
    return true;
};
URLStateMachine.prototype["parse file slash"] = function parseFileSlash(c) {
    if (c === 47 || c === 92) {
        if (c === 92) {
            this.parseError = true;
        }
        this.state = "file host";
    } else {
        if (this.base !== null && this.base.scheme === "file") {
            if (isNormalizedWindowsDriveLetterString(this.base.path[0])) {
                this.url.path.push(this.base.path[0]);
            } else {
                this.url.host = this.base.host;
            }
        }
        this.state = "path";
        --this.pointer;
    }
    return true;
};
URLStateMachine.prototype["parse file host"] = function parseFileHost(c, cStr) {
    if (isNaN(c) || c === 47 || c === 92 || c === 63 || c === 35) {
        --this.pointer;
        if (!this.stateOverride && isWindowsDriveLetterString(this.buffer)) {
            this.parseError = true;
            this.state = "path";
        } else if (this.buffer === "") {
            this.url.host = "";
            if (this.stateOverride) {
                return false;
            }
            this.state = "path start";
        } else {
            let host = parseHost(this.buffer, isSpecial(this.url));
            if (host === failure) {
                return failure;
            }
            if (host === "localhost") {
                host = "";
            }
            this.url.host = host;
            if (this.stateOverride) {
                return false;
            }
            this.buffer = "";
            this.state = "path start";
        }
    } else {
        this.buffer += cStr;
    }
    return true;
};
URLStateMachine.prototype["parse path start"] = function parsePathStart(c) {
    if (isSpecial(this.url)) {
        if (c === 92) {
            this.parseError = true;
        }
        this.state = "path";
        if (c !== 47 && c !== 92) {
            --this.pointer;
        }
    } else if (!this.stateOverride && c === 63) {
        this.url.query = "";
        this.state = "query";
    } else if (!this.stateOverride && c === 35) {
        this.url.fragment = "";
        this.state = "fragment";
    } else if (c !== undefined) {
        this.state = "path";
        if (c !== 47) {
            --this.pointer;
        }
    }
    return true;
};
URLStateMachine.prototype["parse path"] = function parsePath(c) {
    if (isNaN(c) || c === 47 || isSpecial(this.url) && c === 92 || !this.stateOverride && (c === 63 || c === 35)) {
        if (isSpecial(this.url) && c === 92) {
            this.parseError = true;
        }
        if (isDoubleDot(this.buffer)) {
            shortenPath(this.url);
            if (c !== 47 && !(isSpecial(this.url) && c === 92)) {
                this.url.path.push("");
            }
        } else if (isSingleDot(this.buffer) && c !== 47 && !(isSpecial(this.url) && c === 92)) {
            this.url.path.push("");
        } else if (!isSingleDot(this.buffer)) {
            if (this.url.scheme === "file" && this.url.path.length === 0 && isWindowsDriveLetterString(this.buffer)) {
                if (this.url.host !== "" && this.url.host !== null) {
                    this.parseError = true;
                    this.url.host = "";
                }
                this.buffer = this.buffer[0] + ":";
            }
            this.url.path.push(this.buffer);
        }
        this.buffer = "";
        if (this.url.scheme === "file" && (c === undefined || c === 63 || c === 35)) {
            while(this.url.path.length > 1 && this.url.path[0] === ""){
                this.parseError = true;
                this.url.path.shift();
            }
        }
        if (c === 63) {
            this.url.query = "";
            this.state = "query";
        }
        if (c === 35) {
            this.url.fragment = "";
            this.state = "fragment";
        }
    } else {
        // TODO: If c is not a URL code point and not "%", parse error.
        if (c === 37 && (!isASCIIHex(this.input[this.pointer + 1]) || !isASCIIHex(this.input[this.pointer + 2]))) {
            this.parseError = true;
        }
        this.buffer += percentEncodeChar(c, isPathPercentEncode);
    }
    return true;
};
URLStateMachine.prototype["parse cannot-be-a-base-URL path"] = function parseCannotBeABaseURLPath(c) {
    if (c === 63) {
        this.url.query = "";
        this.state = "query";
    } else if (c === 35) {
        this.url.fragment = "";
        this.state = "fragment";
    } else {
        // TODO: Add: not a URL code point
        if (!isNaN(c) && c !== 37) {
            this.parseError = true;
        }
        if (c === 37 && (!isASCIIHex(this.input[this.pointer + 1]) || !isASCIIHex(this.input[this.pointer + 2]))) {
            this.parseError = true;
        }
        if (!isNaN(c)) {
            this.url.path[0] = this.url.path[0] + percentEncodeChar(c, isC0ControlPercentEncode);
        }
    }
    return true;
};
URLStateMachine.prototype["parse query"] = function parseQuery(c, cStr) {
    if (isNaN(c) || !this.stateOverride && c === 35) {
        if (!isSpecial(this.url) || this.url.scheme === "ws" || this.url.scheme === "wss") {
            this.encodingOverride = "utf-8";
        }
        const buffer = new Buffer(this.buffer); // TODO: Use encoding override instead
        for(let i = 0; i < buffer.length; ++i){
            if (buffer[i] < 0x21 || buffer[i] > 0x7E || buffer[i] === 0x22 || buffer[i] === 0x23 || buffer[i] === 0x3C || buffer[i] === 0x3E) {
                this.url.query += percentEncode(buffer[i]);
            } else {
                this.url.query += String.fromCodePoint(buffer[i]);
            }
        }
        this.buffer = "";
        if (c === 35) {
            this.url.fragment = "";
            this.state = "fragment";
        }
    } else {
        // TODO: If c is not a URL code point and not "%", parse error.
        if (c === 37 && (!isASCIIHex(this.input[this.pointer + 1]) || !isASCIIHex(this.input[this.pointer + 2]))) {
            this.parseError = true;
        }
        this.buffer += cStr;
    }
    return true;
};
URLStateMachine.prototype["parse fragment"] = function parseFragment(c) {
    if (isNaN(c)) {} else if (c === 0x0) {
        this.parseError = true;
    } else {
        // TODO: If c is not a URL code point and not "%", parse error.
        if (c === 37 && (!isASCIIHex(this.input[this.pointer + 1]) || !isASCIIHex(this.input[this.pointer + 2]))) {
            this.parseError = true;
        }
        this.url.fragment += percentEncodeChar(c, isC0ControlPercentEncode);
    }
    return true;
};
function serializeURL(url, excludeFragment) {
    let output = url.scheme + ":";
    if (url.host !== null) {
        output += "//";
        if (url.username !== "" || url.password !== "") {
            output += url.username;
            if (url.password !== "") {
                output += ":" + url.password;
            }
            output += "@";
        }
        output += serializeHost(url.host);
        if (url.port !== null) {
            output += ":" + url.port;
        }
    } else if (url.host === null && url.scheme === "file") {
        output += "//";
    }
    if (url.cannotBeABaseURL) {
        output += url.path[0];
    } else {
        for (const string of url.path){
            output += "/" + string;
        }
    }
    if (url.query !== null) {
        output += "?" + url.query;
    }
    if (!excludeFragment && url.fragment !== null) {
        output += "#" + url.fragment;
    }
    return output;
}
function serializeOrigin(tuple) {
    let result = tuple.scheme + "://";
    result += serializeHost(tuple.host);
    if (tuple.port !== null) {
        result += ":" + tuple.port;
    }
    return result;
}
module.exports.serializeURL = serializeURL;
module.exports.serializeURLOrigin = function(url) {
    // https://url.spec.whatwg.org/#concept-url-origin
    switch(url.scheme){
        case "blob":
            try {
                return module.exports.serializeURLOrigin(module.exports.parseURL(url.path[0]));
            } catch (e) {
                // serializing an opaque origin returns "null"
                return "null";
            }
        case "ftp":
        case "gopher":
        case "http":
        case "https":
        case "ws":
        case "wss":
            return serializeOrigin({
                scheme: url.scheme,
                host: url.host,
                port: url.port
            });
        case "file":
            // spec says "exercise to the reader", chrome says "file://"
            return "file://";
        default:
            // serializing an opaque origin returns "null"
            return "null";
    }
};
module.exports.basicURLParse = function(input, options) {
    if (options === undefined) {
        options = {};
    }
    const usm = new URLStateMachine(input, options.baseURL, options.encodingOverride, options.url, options.stateOverride);
    if (usm.failure) {
        return "failure";
    }
    return usm.url;
};
module.exports.setTheUsername = function(url, username) {
    url.username = "";
    const decoded = punycode.ucs2.decode(username);
    for(let i = 0; i < decoded.length; ++i){
        url.username += percentEncodeChar(decoded[i], isUserinfoPercentEncode);
    }
};
module.exports.setThePassword = function(url, password) {
    url.password = "";
    const decoded = punycode.ucs2.decode(password);
    for(let i = 0; i < decoded.length; ++i){
        url.password += percentEncodeChar(decoded[i], isUserinfoPercentEncode);
    }
};
module.exports.serializeHost = serializeHost;
module.exports.cannotHaveAUsernamePasswordPort = cannotHaveAUsernamePasswordPort;
module.exports.serializeInteger = function(integer) {
    return String(integer);
};
module.exports.parseURL = function(input, options) {
    if (options === undefined) {
        options = {};
    }
    // We don't handle blobs, so this just delegates:
    return module.exports.basicURLParse(input, {
        baseURL: options.baseURL,
        encodingOverride: options.encodingOverride
    });
};
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/whatwg-url/lib/URL-impl.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const usm = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/whatwg-url/lib/url-state-machine.js [app-ssr] (ecmascript)");
exports.implementation = class URLImpl {
    constructor(constructorArgs){
        const url = constructorArgs[0];
        const base = constructorArgs[1];
        let parsedBase = null;
        if (base !== undefined) {
            parsedBase = usm.basicURLParse(base);
            if (parsedBase === "failure") {
                throw new TypeError("Invalid base URL");
            }
        }
        const parsedURL = usm.basicURLParse(url, {
            baseURL: parsedBase
        });
        if (parsedURL === "failure") {
            throw new TypeError("Invalid URL");
        }
        this._url = parsedURL;
    // TODO: query stuff
    }
    get href() {
        return usm.serializeURL(this._url);
    }
    set href(v) {
        const parsedURL = usm.basicURLParse(v);
        if (parsedURL === "failure") {
            throw new TypeError("Invalid URL");
        }
        this._url = parsedURL;
    }
    get origin() {
        return usm.serializeURLOrigin(this._url);
    }
    get protocol() {
        return this._url.scheme + ":";
    }
    set protocol(v) {
        usm.basicURLParse(v + ":", {
            url: this._url,
            stateOverride: "scheme start"
        });
    }
    get username() {
        return this._url.username;
    }
    set username(v) {
        if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
            return;
        }
        usm.setTheUsername(this._url, v);
    }
    get password() {
        return this._url.password;
    }
    set password(v) {
        if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
            return;
        }
        usm.setThePassword(this._url, v);
    }
    get host() {
        const url = this._url;
        if (url.host === null) {
            return "";
        }
        if (url.port === null) {
            return usm.serializeHost(url.host);
        }
        return usm.serializeHost(url.host) + ":" + usm.serializeInteger(url.port);
    }
    set host(v) {
        if (this._url.cannotBeABaseURL) {
            return;
        }
        usm.basicURLParse(v, {
            url: this._url,
            stateOverride: "host"
        });
    }
    get hostname() {
        if (this._url.host === null) {
            return "";
        }
        return usm.serializeHost(this._url.host);
    }
    set hostname(v) {
        if (this._url.cannotBeABaseURL) {
            return;
        }
        usm.basicURLParse(v, {
            url: this._url,
            stateOverride: "hostname"
        });
    }
    get port() {
        if (this._url.port === null) {
            return "";
        }
        return usm.serializeInteger(this._url.port);
    }
    set port(v) {
        if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
            return;
        }
        if (v === "") {
            this._url.port = null;
        } else {
            usm.basicURLParse(v, {
                url: this._url,
                stateOverride: "port"
            });
        }
    }
    get pathname() {
        if (this._url.cannotBeABaseURL) {
            return this._url.path[0];
        }
        if (this._url.path.length === 0) {
            return "";
        }
        return "/" + this._url.path.join("/");
    }
    set pathname(v) {
        if (this._url.cannotBeABaseURL) {
            return;
        }
        this._url.path = [];
        usm.basicURLParse(v, {
            url: this._url,
            stateOverride: "path start"
        });
    }
    get search() {
        if (this._url.query === null || this._url.query === "") {
            return "";
        }
        return "?" + this._url.query;
    }
    set search(v) {
        // TODO: query stuff
        const url = this._url;
        if (v === "") {
            url.query = null;
            return;
        }
        const input = v[0] === "?" ? v.substring(1) : v;
        url.query = "";
        usm.basicURLParse(input, {
            url,
            stateOverride: "query"
        });
    }
    get hash() {
        if (this._url.fragment === null || this._url.fragment === "") {
            return "";
        }
        return "#" + this._url.fragment;
    }
    set hash(v) {
        if (v === "") {
            this._url.fragment = null;
            return;
        }
        const input = v[0] === "#" ? v.substring(1) : v;
        this._url.fragment = "";
        usm.basicURLParse(input, {
            url: this._url,
            stateOverride: "fragment"
        });
    }
    toJSON() {
        return this.href;
    }
};
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/whatwg-url/lib/URL.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const conversions = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/webidl-conversions/lib/index.js [app-ssr] (ecmascript)");
const utils = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/whatwg-url/lib/utils.js [app-ssr] (ecmascript)");
const Impl = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/whatwg-url/lib/URL-impl.js [app-ssr] (ecmascript)");
const impl = utils.implSymbol;
function URL(url) {
    if (!this || this[impl] || !(this instanceof URL)) {
        throw new TypeError("Failed to construct 'URL': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
    }
    if (arguments.length < 1) {
        throw new TypeError("Failed to construct 'URL': 1 argument required, but only " + arguments.length + " present.");
    }
    const args = [];
    for(let i = 0; i < arguments.length && i < 2; ++i){
        args[i] = arguments[i];
    }
    args[0] = conversions["USVString"](args[0]);
    if (args[1] !== undefined) {
        args[1] = conversions["USVString"](args[1]);
    }
    module.exports.setup(this, args);
}
URL.prototype.toJSON = function toJSON() {
    if (!this || !module.exports.is(this)) {
        throw new TypeError("Illegal invocation");
    }
    const args = [];
    for(let i = 0; i < arguments.length && i < 0; ++i){
        args[i] = arguments[i];
    }
    return this[impl].toJSON.apply(this[impl], args);
};
Object.defineProperty(URL.prototype, "href", {
    get () {
        return this[impl].href;
    },
    set (V) {
        V = conversions["USVString"](V);
        this[impl].href = V;
    },
    enumerable: true,
    configurable: true
});
URL.prototype.toString = function() {
    if (!this || !module.exports.is(this)) {
        throw new TypeError("Illegal invocation");
    }
    return this.href;
};
Object.defineProperty(URL.prototype, "origin", {
    get () {
        return this[impl].origin;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(URL.prototype, "protocol", {
    get () {
        return this[impl].protocol;
    },
    set (V) {
        V = conversions["USVString"](V);
        this[impl].protocol = V;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(URL.prototype, "username", {
    get () {
        return this[impl].username;
    },
    set (V) {
        V = conversions["USVString"](V);
        this[impl].username = V;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(URL.prototype, "password", {
    get () {
        return this[impl].password;
    },
    set (V) {
        V = conversions["USVString"](V);
        this[impl].password = V;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(URL.prototype, "host", {
    get () {
        return this[impl].host;
    },
    set (V) {
        V = conversions["USVString"](V);
        this[impl].host = V;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(URL.prototype, "hostname", {
    get () {
        return this[impl].hostname;
    },
    set (V) {
        V = conversions["USVString"](V);
        this[impl].hostname = V;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(URL.prototype, "port", {
    get () {
        return this[impl].port;
    },
    set (V) {
        V = conversions["USVString"](V);
        this[impl].port = V;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(URL.prototype, "pathname", {
    get () {
        return this[impl].pathname;
    },
    set (V) {
        V = conversions["USVString"](V);
        this[impl].pathname = V;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(URL.prototype, "search", {
    get () {
        return this[impl].search;
    },
    set (V) {
        V = conversions["USVString"](V);
        this[impl].search = V;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(URL.prototype, "hash", {
    get () {
        return this[impl].hash;
    },
    set (V) {
        V = conversions["USVString"](V);
        this[impl].hash = V;
    },
    enumerable: true,
    configurable: true
});
module.exports = {
    is (obj) {
        return !!obj && obj[impl] instanceof Impl.implementation;
    },
    create (constructorArgs, privateData) {
        let obj = Object.create(URL.prototype);
        this.setup(obj, constructorArgs, privateData);
        return obj;
    },
    setup (obj, constructorArgs, privateData) {
        if (!privateData) privateData = {};
        privateData.wrapper = obj;
        obj[impl] = new Impl.implementation(constructorArgs, privateData);
        obj[impl][utils.wrapperSymbol] = obj;
    },
    interface: URL,
    expose: {
        Window: {
            URL: URL
        },
        Worker: {
            URL: URL
        }
    }
};
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/whatwg-url/lib/public-api.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

exports.URL = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/whatwg-url/lib/URL.js [app-ssr] (ecmascript)").interface;
exports.serializeURL = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/whatwg-url/lib/url-state-machine.js [app-ssr] (ecmascript)").serializeURL;
exports.serializeURLOrigin = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/whatwg-url/lib/url-state-machine.js [app-ssr] (ecmascript)").serializeURLOrigin;
exports.basicURLParse = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/whatwg-url/lib/url-state-machine.js [app-ssr] (ecmascript)").basicURLParse;
exports.setTheUsername = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/whatwg-url/lib/url-state-machine.js [app-ssr] (ecmascript)").setTheUsername;
exports.setThePassword = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/whatwg-url/lib/url-state-machine.js [app-ssr] (ecmascript)").setThePassword;
exports.serializeHost = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/whatwg-url/lib/url-state-machine.js [app-ssr] (ecmascript)").serializeHost;
exports.serializeInteger = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/whatwg-url/lib/url-state-machine.js [app-ssr] (ecmascript)").serializeInteger;
exports.parseURL = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/whatwg-url/lib/url-state-machine.js [app-ssr] (ecmascript)").parseURL;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/node-fetch/lib/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AbortError",
    ()=>AbortError,
    "FetchError",
    ()=>FetchError,
    "Headers",
    ()=>Headers,
    "Request",
    ()=>Request,
    "Response",
    ()=>Response,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$stream__$5b$external$5d$__$28$stream$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/stream [external] (stream, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$http__$5b$external$5d$__$28$http$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/http [external] (http, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$url__$5b$external$5d$__$28$url$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/url [external] (url, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$whatwg$2d$url$2f$lib$2f$public$2d$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/whatwg-url/lib/public-api.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$https__$5b$external$5d$__$28$https$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/https [external] (https, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$zlib__$5b$external$5d$__$28$zlib$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/zlib [external] (zlib, cjs)");
;
;
;
;
;
;
// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js
// fix for "Readable" isn't a named export issue
const Readable = __TURBOPACK__imported__module__$5b$externals$5d2f$stream__$5b$external$5d$__$28$stream$2c$__cjs$29$__["default"].Readable;
const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');
class Blob {
    constructor(){
        this[TYPE] = '';
        const blobParts = arguments[0];
        const options = arguments[1];
        const buffers = [];
        let size = 0;
        if (blobParts) {
            const a = blobParts;
            const length = Number(a.length);
            for(let i = 0; i < length; i++){
                const element = a[i];
                let buffer;
                if (element instanceof Buffer) {
                    buffer = element;
                } else if (ArrayBuffer.isView(element)) {
                    buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
                } else if (element instanceof ArrayBuffer) {
                    buffer = Buffer.from(element);
                } else if (element instanceof Blob) {
                    buffer = element[BUFFER];
                } else {
                    buffer = Buffer.from(typeof element === 'string' ? element : String(element));
                }
                size += buffer.length;
                buffers.push(buffer);
            }
        }
        this[BUFFER] = Buffer.concat(buffers);
        let type = options && options.type !== undefined && String(options.type).toLowerCase();
        if (type && !/[^\u0020-\u007E]/.test(type)) {
            this[TYPE] = type;
        }
    }
    get size() {
        return this[BUFFER].length;
    }
    get type() {
        return this[TYPE];
    }
    text() {
        return Promise.resolve(this[BUFFER].toString());
    }
    arrayBuffer() {
        const buf = this[BUFFER];
        const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        return Promise.resolve(ab);
    }
    stream() {
        const readable = new Readable();
        readable._read = function() {};
        readable.push(this[BUFFER]);
        readable.push(null);
        return readable;
    }
    toString() {
        return '[object Blob]';
    }
    slice() {
        const size = this.size;
        const start = arguments[0];
        const end = arguments[1];
        let relativeStart, relativeEnd;
        if (start === undefined) {
            relativeStart = 0;
        } else if (start < 0) {
            relativeStart = Math.max(size + start, 0);
        } else {
            relativeStart = Math.min(start, size);
        }
        if (end === undefined) {
            relativeEnd = size;
        } else if (end < 0) {
            relativeEnd = Math.max(size + end, 0);
        } else {
            relativeEnd = Math.min(end, size);
        }
        const span = Math.max(relativeEnd - relativeStart, 0);
        const buffer = this[BUFFER];
        const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
        const blob = new Blob([], {
            type: arguments[2]
        });
        blob[BUFFER] = slicedBuffer;
        return blob;
    }
}
Object.defineProperties(Blob.prototype, {
    size: {
        enumerable: true
    },
    type: {
        enumerable: true
    },
    slice: {
        enumerable: true
    }
});
Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
    value: 'Blob',
    writable: false,
    enumerable: false,
    configurable: true
});
/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */ /**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */ function FetchError(message, type, systemError) {
    Error.call(this, message);
    this.message = message;
    this.type = type;
    // when err.type is `system`, err.code contains system error code
    if (systemError) {
        this.code = this.errno = systemError.code;
    }
    // hide custom error implementation details from end-users
    Error.captureStackTrace(this, this.constructor);
}
FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';
let convert;
try {
    convert = (()=>{
        const e = new Error("Cannot find module 'encoding'");
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    })().convert;
} catch (e) {}
const INTERNALS = Symbol('Body internals');
// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = __TURBOPACK__imported__module__$5b$externals$5d2f$stream__$5b$external$5d$__$28$stream$2c$__cjs$29$__["default"].PassThrough;
/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */ function Body(body) {
    var _this = this;
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}, _ref$size = _ref.size;
    let size = _ref$size === undefined ? 0 : _ref$size;
    var _ref$timeout = _ref.timeout;
    let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;
    if (body == null) {
        // body is undefined or null
        body = null;
    } else if (isURLSearchParams(body)) {
        // body is a URLSearchParams
        body = Buffer.from(body.toString());
    } else if (isBlob(body)) ;
    else if (Buffer.isBuffer(body)) ;
    else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
        // body is ArrayBuffer
        body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
        // body is ArrayBufferView
        body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof __TURBOPACK__imported__module__$5b$externals$5d2f$stream__$5b$external$5d$__$28$stream$2c$__cjs$29$__["default"]) ;
    else {
        // none of the above
        // coerce to string then buffer
        body = Buffer.from(String(body));
    }
    this[INTERNALS] = {
        body,
        disturbed: false,
        error: null
    };
    this.size = size;
    this.timeout = timeout;
    if (body instanceof __TURBOPACK__imported__module__$5b$externals$5d2f$stream__$5b$external$5d$__$28$stream$2c$__cjs$29$__["default"]) {
        body.on('error', function(err) {
            const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
            _this[INTERNALS].error = error;
        });
    }
}
Body.prototype = {
    get body () {
        return this[INTERNALS].body;
    },
    get bodyUsed () {
        return this[INTERNALS].disturbed;
    },
    /**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */ arrayBuffer () {
        return consumeBody.call(this).then(function(buf) {
            return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        });
    },
    /**
  * Return raw response as Blob
  *
  * @return Promise
  */ blob () {
        let ct = this.headers && this.headers.get('content-type') || '';
        return consumeBody.call(this).then(function(buf) {
            return Object.assign(// Prevent copying
            new Blob([], {
                type: ct.toLowerCase()
            }), {
                [BUFFER]: buf
            });
        });
    },
    /**
  * Decode response as json
  *
  * @return  Promise
  */ json () {
        var _this2 = this;
        return consumeBody.call(this).then(function(buffer) {
            try {
                return JSON.parse(buffer.toString());
            } catch (err) {
                return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
            }
        });
    },
    /**
  * Decode response as text
  *
  * @return  Promise
  */ text () {
        return consumeBody.call(this).then(function(buffer) {
            return buffer.toString();
        });
    },
    /**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */ buffer () {
        return consumeBody.call(this);
    },
    /**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */ textConverted () {
        var _this3 = this;
        return consumeBody.call(this).then(function(buffer) {
            return convertBody(buffer, _this3.headers);
        });
    }
};
// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
    body: {
        enumerable: true
    },
    bodyUsed: {
        enumerable: true
    },
    arrayBuffer: {
        enumerable: true
    },
    blob: {
        enumerable: true
    },
    json: {
        enumerable: true
    },
    text: {
        enumerable: true
    }
});
Body.mixIn = function(proto) {
    for (const name of Object.getOwnPropertyNames(Body.prototype)){
        // istanbul ignore else: future proof
        if (!(name in proto)) {
            const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
            Object.defineProperty(proto, name, desc);
        }
    }
};
/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */ function consumeBody() {
    var _this4 = this;
    if (this[INTERNALS].disturbed) {
        return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
    }
    this[INTERNALS].disturbed = true;
    if (this[INTERNALS].error) {
        return Body.Promise.reject(this[INTERNALS].error);
    }
    let body = this.body;
    // body is null
    if (body === null) {
        return Body.Promise.resolve(Buffer.alloc(0));
    }
    // body is blob
    if (isBlob(body)) {
        body = body.stream();
    }
    // body is buffer
    if (Buffer.isBuffer(body)) {
        return Body.Promise.resolve(body);
    }
    // istanbul ignore if: should never happen
    if (!(body instanceof __TURBOPACK__imported__module__$5b$externals$5d2f$stream__$5b$external$5d$__$28$stream$2c$__cjs$29$__["default"])) {
        return Body.Promise.resolve(Buffer.alloc(0));
    }
    // body is stream
    // get ready to actually consume the body
    let accum = [];
    let accumBytes = 0;
    let abort = false;
    return new Body.Promise(function(resolve, reject) {
        let resTimeout;
        // allow timeout on slow response body
        if (_this4.timeout) {
            resTimeout = setTimeout(function() {
                abort = true;
                reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
            }, _this4.timeout);
        }
        // handle stream errors
        body.on('error', function(err) {
            if (err.name === 'AbortError') {
                // if the request was aborted, reject with this Error
                abort = true;
                reject(err);
            } else {
                // other errors, such as incorrect content-encoding
                reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
            }
        });
        body.on('data', function(chunk) {
            if (abort || chunk === null) {
                return;
            }
            if (_this4.size && accumBytes + chunk.length > _this4.size) {
                abort = true;
                reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
                return;
            }
            accumBytes += chunk.length;
            accum.push(chunk);
        });
        body.on('end', function() {
            if (abort) {
                return;
            }
            clearTimeout(resTimeout);
            try {
                resolve(Buffer.concat(accum, accumBytes));
            } catch (err) {
                // handle streams that have accumulated too much data (issue #414)
                reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
            }
        });
    });
}
/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */ function convertBody(buffer, headers) {
    if (typeof convert !== 'function') {
        throw new Error('The package `encoding` must be installed to use the textConverted() function');
    }
    const ct = headers.get('content-type');
    let charset = 'utf-8';
    let res, str;
    // header
    if (ct) {
        res = /charset=([^;]*)/i.exec(ct);
    }
    // no charset in content type, peek at response body for at most 1024 bytes
    str = buffer.slice(0, 1024).toString();
    // html5
    if (!res && str) {
        res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
    }
    // html4
    if (!res && str) {
        res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
        if (!res) {
            res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
            if (res) {
                res.pop(); // drop last quote
            }
        }
        if (res) {
            res = /charset=(.*)/i.exec(res.pop());
        }
    }
    // xml
    if (!res && str) {
        res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
    }
    // found charset
    if (res) {
        charset = res.pop();
        // prevent decode issues when sites use incorrect encoding
        // ref: https://hsivonen.fi/encoding-menu/
        if (charset === 'gb2312' || charset === 'gbk') {
            charset = 'gb18030';
        }
    }
    // turn raw buffers into a single utf-8 buffer
    return convert(buffer, 'UTF-8', charset).toString();
}
/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */ function isURLSearchParams(obj) {
    // Duck-typing as a necessary condition.
    if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
        return false;
    }
    // Brand-checking and more duck-typing as optional condition.
    return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}
/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */ function isBlob(obj) {
    return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}
/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */ function clone(instance) {
    let p1, p2;
    let body = instance.body;
    // don't allow cloning a used body
    if (instance.bodyUsed) {
        throw new Error('cannot clone body after it is used');
    }
    // check that body is a stream and not form-data object
    // note: we can't clone the form-data object without having it as a dependency
    if (body instanceof __TURBOPACK__imported__module__$5b$externals$5d2f$stream__$5b$external$5d$__$28$stream$2c$__cjs$29$__["default"] && typeof body.getBoundary !== 'function') {
        // tee instance body
        p1 = new PassThrough();
        p2 = new PassThrough();
        body.pipe(p1);
        body.pipe(p2);
        // set instance body to teed body and return the other teed body
        instance[INTERNALS].body = p1;
        body = p2;
    }
    return body;
}
/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */ function extractContentType(body) {
    if (body === null) {
        // body is null
        return null;
    } else if (typeof body === 'string') {
        // body is string
        return 'text/plain;charset=UTF-8';
    } else if (isURLSearchParams(body)) {
        // body is a URLSearchParams
        return 'application/x-www-form-urlencoded;charset=UTF-8';
    } else if (isBlob(body)) {
        // body is blob
        return body.type || null;
    } else if (Buffer.isBuffer(body)) {
        // body is buffer
        return null;
    } else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
        // body is ArrayBuffer
        return null;
    } else if (ArrayBuffer.isView(body)) {
        // body is ArrayBufferView
        return null;
    } else if (typeof body.getBoundary === 'function') {
        // detect form data input from form-data module
        return `multipart/form-data;boundary=${body.getBoundary()}`;
    } else if (body instanceof __TURBOPACK__imported__module__$5b$externals$5d2f$stream__$5b$external$5d$__$28$stream$2c$__cjs$29$__["default"]) {
        // body is stream
        // can't really do much about this
        return null;
    } else {
        // Body constructor defaults other things to string
        return 'text/plain;charset=UTF-8';
    }
}
/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */ function getTotalBytes(instance) {
    const body = instance.body;
    if (body === null) {
        // body is null
        return 0;
    } else if (isBlob(body)) {
        return body.size;
    } else if (Buffer.isBuffer(body)) {
        // body is buffer
        return body.length;
    } else if (body && typeof body.getLengthSync === 'function') {
        // detect form data input from form-data module
        if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
        body.hasKnownLength && body.hasKnownLength()) {
            // 2.x
            return body.getLengthSync();
        }
        return null;
    } else {
        // body is stream
        return null;
    }
}
/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */ function writeToStream(dest, instance) {
    const body = instance.body;
    if (body === null) {
        // body is null
        dest.end();
    } else if (isBlob(body)) {
        body.stream().pipe(dest);
    } else if (Buffer.isBuffer(body)) {
        // body is buffer
        dest.write(body);
        dest.end();
    } else {
        // body is stream
        body.pipe(dest);
    }
}
// expose Promise
Body.Promise = /*TURBOPACK member replacement*/ __turbopack_context__.g.Promise;
/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */ const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;
function validateName(name) {
    name = `${name}`;
    if (invalidTokenRegex.test(name) || name === '') {
        throw new TypeError(`${name} is not a legal HTTP header name`);
    }
}
function validateValue(value) {
    value = `${value}`;
    if (invalidHeaderCharRegex.test(value)) {
        throw new TypeError(`${value} is not a legal HTTP header value`);
    }
}
/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */ function find(map, name) {
    name = name.toLowerCase();
    for(const key in map){
        if (key.toLowerCase() === name) {
            return key;
        }
    }
    return undefined;
}
const MAP = Symbol('map');
class Headers {
    /**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */ constructor(){
        let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
        this[MAP] = Object.create(null);
        if (init instanceof Headers) {
            const rawHeaders = init.raw();
            const headerNames = Object.keys(rawHeaders);
            for (const headerName of headerNames){
                for (const value of rawHeaders[headerName]){
                    this.append(headerName, value);
                }
            }
            return;
        }
        // We don't worry about converting prop to ByteString here as append()
        // will handle it.
        if (init == null) ;
        else if (typeof init === 'object') {
            const method = init[Symbol.iterator];
            if (method != null) {
                if (typeof method !== 'function') {
                    throw new TypeError('Header pairs must be iterable');
                }
                // sequence<sequence<ByteString>>
                // Note: per spec we have to first exhaust the lists then process them
                const pairs = [];
                for (const pair of init){
                    if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
                        throw new TypeError('Each header pair must be iterable');
                    }
                    pairs.push(Array.from(pair));
                }
                for (const pair of pairs){
                    if (pair.length !== 2) {
                        throw new TypeError('Each header pair must be a name/value tuple');
                    }
                    this.append(pair[0], pair[1]);
                }
            } else {
                // record<ByteString, ByteString>
                for (const key of Object.keys(init)){
                    const value = init[key];
                    this.append(key, value);
                }
            }
        } else {
            throw new TypeError('Provided initializer must be an object');
        }
    }
    /**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */ get(name) {
        name = `${name}`;
        validateName(name);
        const key = find(this[MAP], name);
        if (key === undefined) {
            return null;
        }
        return this[MAP][key].join(', ');
    }
    /**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */ forEach(callback) {
        let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        let pairs = getHeaders(this);
        let i = 0;
        while(i < pairs.length){
            var _pairs$i = pairs[i];
            const name = _pairs$i[0], value = _pairs$i[1];
            callback.call(thisArg, value, name, this);
            pairs = getHeaders(this);
            i++;
        }
    }
    /**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */ set(name, value) {
        name = `${name}`;
        value = `${value}`;
        validateName(name);
        validateValue(value);
        const key = find(this[MAP], name);
        this[MAP][key !== undefined ? key : name] = [
            value
        ];
    }
    /**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */ append(name, value) {
        name = `${name}`;
        value = `${value}`;
        validateName(name);
        validateValue(value);
        const key = find(this[MAP], name);
        if (key !== undefined) {
            this[MAP][key].push(value);
        } else {
            this[MAP][name] = [
                value
            ];
        }
    }
    /**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */ has(name) {
        name = `${name}`;
        validateName(name);
        return find(this[MAP], name) !== undefined;
    }
    /**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */ delete(name) {
        name = `${name}`;
        validateName(name);
        const key = find(this[MAP], name);
        if (key !== undefined) {
            delete this[MAP][key];
        }
    }
    /**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */ raw() {
        return this[MAP];
    }
    /**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */ keys() {
        return createHeadersIterator(this, 'key');
    }
    /**
  * Get an iterator on values.
  *
  * @return  Iterator
  */ values() {
        return createHeadersIterator(this, 'value');
    }
    /**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */ [Symbol.iterator]() {
        return createHeadersIterator(this, 'key+value');
    }
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];
Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
    value: 'Headers',
    writable: false,
    enumerable: false,
    configurable: true
});
Object.defineProperties(Headers.prototype, {
    get: {
        enumerable: true
    },
    forEach: {
        enumerable: true
    },
    set: {
        enumerable: true
    },
    append: {
        enumerable: true
    },
    has: {
        enumerable: true
    },
    delete: {
        enumerable: true
    },
    keys: {
        enumerable: true
    },
    values: {
        enumerable: true
    },
    entries: {
        enumerable: true
    }
});
function getHeaders(headers) {
    let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';
    const keys = Object.keys(headers[MAP]).sort();
    return keys.map(kind === 'key' ? function(k) {
        return k.toLowerCase();
    } : kind === 'value' ? function(k) {
        return headers[MAP][k].join(', ');
    } : function(k) {
        return [
            k.toLowerCase(),
            headers[MAP][k].join(', ')
        ];
    });
}
const INTERNAL = Symbol('internal');
function createHeadersIterator(target, kind) {
    const iterator = Object.create(HeadersIteratorPrototype);
    iterator[INTERNAL] = {
        target,
        kind,
        index: 0
    };
    return iterator;
}
const HeadersIteratorPrototype = Object.setPrototypeOf({
    next () {
        // istanbul ignore if
        if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
            throw new TypeError('Value of `this` is not a HeadersIterator');
        }
        var _INTERNAL = this[INTERNAL];
        const target = _INTERNAL.target, kind = _INTERNAL.kind, index = _INTERNAL.index;
        const values = getHeaders(target, kind);
        const len = values.length;
        if (index >= len) {
            return {
                value: undefined,
                done: true
            };
        }
        this[INTERNAL].index = index + 1;
        return {
            value: values[index],
            done: false
        };
    }
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));
Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
    value: 'HeadersIterator',
    writable: false,
    enumerable: false,
    configurable: true
});
/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */ function exportNodeCompatibleHeaders(headers) {
    const obj = Object.assign({
        __proto__: null
    }, headers[MAP]);
    // http.request() only supports string as Host header. This hack makes
    // specifying custom Host header possible.
    const hostHeaderKey = find(headers[MAP], 'Host');
    if (hostHeaderKey !== undefined) {
        obj[hostHeaderKey] = obj[hostHeaderKey][0];
    }
    return obj;
}
/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */ function createHeadersLenient(obj) {
    const headers = new Headers();
    for (const name of Object.keys(obj)){
        if (invalidTokenRegex.test(name)) {
            continue;
        }
        if (Array.isArray(obj[name])) {
            for (const val of obj[name]){
                if (invalidHeaderCharRegex.test(val)) {
                    continue;
                }
                if (headers[MAP][name] === undefined) {
                    headers[MAP][name] = [
                        val
                    ];
                } else {
                    headers[MAP][name].push(val);
                }
            }
        } else if (!invalidHeaderCharRegex.test(obj[name])) {
            headers[MAP][name] = [
                obj[name]
            ];
        }
    }
    return headers;
}
const INTERNALS$1 = Symbol('Response internals');
// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = __TURBOPACK__imported__module__$5b$externals$5d2f$http__$5b$external$5d$__$28$http$2c$__cjs$29$__["default"].STATUS_CODES;
/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */ class Response {
    constructor(){
        let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        Body.call(this, body, opts);
        const status = opts.status || 200;
        const headers = new Headers(opts.headers);
        if (body != null && !headers.has('Content-Type')) {
            const contentType = extractContentType(body);
            if (contentType) {
                headers.append('Content-Type', contentType);
            }
        }
        this[INTERNALS$1] = {
            url: opts.url,
            status,
            statusText: opts.statusText || STATUS_CODES[status],
            headers,
            counter: opts.counter
        };
    }
    get url() {
        return this[INTERNALS$1].url || '';
    }
    get status() {
        return this[INTERNALS$1].status;
    }
    /**
  * Convenience property representing if the request ended normally
  */ get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
    }
    get redirected() {
        return this[INTERNALS$1].counter > 0;
    }
    get statusText() {
        return this[INTERNALS$1].statusText;
    }
    get headers() {
        return this[INTERNALS$1].headers;
    }
    /**
  * Clone this response
  *
  * @return  Response
  */ clone() {
        return new Response(clone(this), {
            url: this.url,
            status: this.status,
            statusText: this.statusText,
            headers: this.headers,
            ok: this.ok,
            redirected: this.redirected
        });
    }
}
Body.mixIn(Response.prototype);
Object.defineProperties(Response.prototype, {
    url: {
        enumerable: true
    },
    status: {
        enumerable: true
    },
    ok: {
        enumerable: true
    },
    redirected: {
        enumerable: true
    },
    statusText: {
        enumerable: true
    },
    headers: {
        enumerable: true
    },
    clone: {
        enumerable: true
    }
});
Object.defineProperty(Response.prototype, Symbol.toStringTag, {
    value: 'Response',
    writable: false,
    enumerable: false,
    configurable: true
});
const INTERNALS$2 = Symbol('Request internals');
const URL = __TURBOPACK__imported__module__$5b$externals$5d2f$url__$5b$external$5d$__$28$url$2c$__cjs$29$__["default"].URL || __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$whatwg$2d$url$2f$lib$2f$public$2d$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].URL;
// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = __TURBOPACK__imported__module__$5b$externals$5d2f$url__$5b$external$5d$__$28$url$2c$__cjs$29$__["default"].parse;
const format_url = __TURBOPACK__imported__module__$5b$externals$5d2f$url__$5b$external$5d$__$28$url$2c$__cjs$29$__["default"].format;
/**
 * Wrapper around `new URL` to handle arbitrary URLs
 *
 * @param  {string} urlStr
 * @return {void}
 */ function parseURL(urlStr) {
    /*
 	Check whether the URL is absolute or not
 		Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
 	Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
 */ if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.exec(urlStr)) {
        urlStr = new URL(urlStr).toString();
    }
    // Fallback to old implementation for arbitrary URLs
    return parse_url(urlStr);
}
const streamDestructionSupported = 'destroy' in __TURBOPACK__imported__module__$5b$externals$5d2f$stream__$5b$external$5d$__$28$stream$2c$__cjs$29$__["default"].Readable.prototype;
/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */ function isRequest(input) {
    return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}
function isAbortSignal(signal) {
    const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
    return !!(proto && proto.constructor.name === 'AbortSignal');
}
/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */ class Request {
    constructor(input){
        let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        let parsedURL;
        // normalize input
        if (!isRequest(input)) {
            if (input && input.href) {
                // in order to support Node.js' Url objects; though WHATWG's URL objects
                // will fall into this branch also (since their `toString()` will return
                // `href` property anyway)
                parsedURL = parseURL(input.href);
            } else {
                // coerce input to a string before attempting to parse
                parsedURL = parseURL(`${input}`);
            }
            input = {};
        } else {
            parsedURL = parseURL(input.url);
        }
        let method = init.method || input.method || 'GET';
        method = method.toUpperCase();
        if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
            throw new TypeError('Request with GET/HEAD method cannot have body');
        }
        let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;
        Body.call(this, inputBody, {
            timeout: init.timeout || input.timeout || 0,
            size: init.size || input.size || 0
        });
        const headers = new Headers(init.headers || input.headers || {});
        if (inputBody != null && !headers.has('Content-Type')) {
            const contentType = extractContentType(inputBody);
            if (contentType) {
                headers.append('Content-Type', contentType);
            }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ('signal' in init) signal = init.signal;
        if (signal != null && !isAbortSignal(signal)) {
            throw new TypeError('Expected signal to be an instanceof AbortSignal');
        }
        this[INTERNALS$2] = {
            method,
            redirect: init.redirect || input.redirect || 'follow',
            headers,
            parsedURL,
            signal
        };
        // node-fetch-only options
        this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
        this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
        this.counter = init.counter || input.counter || 0;
        this.agent = init.agent || input.agent;
    }
    get method() {
        return this[INTERNALS$2].method;
    }
    get url() {
        return format_url(this[INTERNALS$2].parsedURL);
    }
    get headers() {
        return this[INTERNALS$2].headers;
    }
    get redirect() {
        return this[INTERNALS$2].redirect;
    }
    get signal() {
        return this[INTERNALS$2].signal;
    }
    /**
  * Clone this request
  *
  * @return  Request
  */ clone() {
        return new Request(this);
    }
}
Body.mixIn(Request.prototype);
Object.defineProperty(Request.prototype, Symbol.toStringTag, {
    value: 'Request',
    writable: false,
    enumerable: false,
    configurable: true
});
Object.defineProperties(Request.prototype, {
    method: {
        enumerable: true
    },
    url: {
        enumerable: true
    },
    headers: {
        enumerable: true
    },
    redirect: {
        enumerable: true
    },
    clone: {
        enumerable: true
    },
    signal: {
        enumerable: true
    }
});
/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */ function getNodeRequestOptions(request) {
    const parsedURL = request[INTERNALS$2].parsedURL;
    const headers = new Headers(request[INTERNALS$2].headers);
    // fetch step 1.3
    if (!headers.has('Accept')) {
        headers.set('Accept', '*/*');
    }
    // Basic fetch
    if (!parsedURL.protocol || !parsedURL.hostname) {
        throw new TypeError('Only absolute URLs are supported');
    }
    if (!/^https?:$/.test(parsedURL.protocol)) {
        throw new TypeError('Only HTTP(S) protocols are supported');
    }
    if (request.signal && request.body instanceof __TURBOPACK__imported__module__$5b$externals$5d2f$stream__$5b$external$5d$__$28$stream$2c$__cjs$29$__["default"].Readable && !streamDestructionSupported) {
        throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
    }
    // HTTP-network-or-cache fetch steps 2.4-2.7
    let contentLengthValue = null;
    if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
        contentLengthValue = '0';
    }
    if (request.body != null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === 'number') {
            contentLengthValue = String(totalBytes);
        }
    }
    if (contentLengthValue) {
        headers.set('Content-Length', contentLengthValue);
    }
    // HTTP-network-or-cache fetch step 2.11
    if (!headers.has('User-Agent')) {
        headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
    }
    // HTTP-network-or-cache fetch step 2.15
    if (request.compress && !headers.has('Accept-Encoding')) {
        headers.set('Accept-Encoding', 'gzip,deflate');
    }
    let agent = request.agent;
    if (typeof agent === 'function') {
        agent = agent(parsedURL);
    }
    // HTTP-network fetch step 4.2
    // chunked encoding is handled by Node.js
    return Object.assign({}, parsedURL, {
        method: request.method,
        headers: exportNodeCompatibleHeaders(headers),
        agent
    });
}
/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */ /**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */ function AbortError(message) {
    Error.call(this, message);
    this.type = 'aborted';
    this.message = message;
    // hide custom error implementation details from end-users
    Error.captureStackTrace(this, this.constructor);
}
AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';
const URL$1 = __TURBOPACK__imported__module__$5b$externals$5d2f$url__$5b$external$5d$__$28$url$2c$__cjs$29$__["default"].URL || __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$whatwg$2d$url$2f$lib$2f$public$2d$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].URL;
// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = __TURBOPACK__imported__module__$5b$externals$5d2f$stream__$5b$external$5d$__$28$stream$2c$__cjs$29$__["default"].PassThrough;
const isDomainOrSubdomain = function isDomainOrSubdomain(destination, original) {
    const orig = new URL$1(original).hostname;
    const dest = new URL$1(destination).hostname;
    return orig === dest || orig[orig.length - dest.length - 1] === '.' && orig.endsWith(dest);
};
/**
 * isSameProtocol reports whether the two provided URLs use the same protocol.
 *
 * Both domains must already be in canonical form.
 * @param {string|URL} original
 * @param {string|URL} destination
 */ const isSameProtocol = function isSameProtocol(destination, original) {
    const orig = new URL$1(original).protocol;
    const dest = new URL$1(destination).protocol;
    return orig === dest;
};
/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */ function fetch(url, opts) {
    // allow custom promise
    if (!fetch.Promise) {
        throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
    }
    Body.Promise = fetch.Promise;
    // wrap http.request into fetch
    return new fetch.Promise(function(resolve, reject) {
        // build request object
        const request = new Request(url, opts);
        const options = getNodeRequestOptions(request);
        const send = (options.protocol === 'https:' ? __TURBOPACK__imported__module__$5b$externals$5d2f$https__$5b$external$5d$__$28$https$2c$__cjs$29$__["default"] : __TURBOPACK__imported__module__$5b$externals$5d2f$http__$5b$external$5d$__$28$http$2c$__cjs$29$__["default"]).request;
        const signal = request.signal;
        let response = null;
        const abort = function abort() {
            let error = new AbortError('The user aborted a request.');
            reject(error);
            if (request.body && request.body instanceof __TURBOPACK__imported__module__$5b$externals$5d2f$stream__$5b$external$5d$__$28$stream$2c$__cjs$29$__["default"].Readable) {
                destroyStream(request.body, error);
            }
            if (!response || !response.body) return;
            response.body.emit('error', error);
        };
        if (signal && signal.aborted) {
            abort();
            return;
        }
        const abortAndFinalize = function abortAndFinalize() {
            abort();
            finalize();
        };
        // send request
        const req = send(options);
        let reqTimeout;
        if (signal) {
            signal.addEventListener('abort', abortAndFinalize);
        }
        function finalize() {
            req.abort();
            if (signal) signal.removeEventListener('abort', abortAndFinalize);
            clearTimeout(reqTimeout);
        }
        if (request.timeout) {
            req.once('socket', function(socket) {
                reqTimeout = setTimeout(function() {
                    reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
                    finalize();
                }, request.timeout);
            });
        }
        req.on('error', function(err) {
            reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
            if (response && response.body) {
                destroyStream(response.body, err);
            }
            finalize();
        });
        fixResponseChunkedTransferBadEnding(req, function(err) {
            if (signal && signal.aborted) {
                return;
            }
            if (response && response.body) {
                destroyStream(response.body, err);
            }
        });
        /* c8 ignore next 18 */ if (parseInt(process.version.substring(1)) < 14) {
            // Before Node.js 14, pipeline() does not fully support async iterators and does not always
            // properly handle when the socket close/end events are out of order.
            req.on('socket', function(s) {
                s.addListener('close', function(hadError) {
                    // if a data listener is still present we didn't end cleanly
                    const hasDataListener = s.listenerCount('data') > 0;
                    // if end happened before close but the socket didn't emit an error, do it now
                    if (response && hasDataListener && !hadError && !(signal && signal.aborted)) {
                        const err = new Error('Premature close');
                        err.code = 'ERR_STREAM_PREMATURE_CLOSE';
                        response.body.emit('error', err);
                    }
                });
            });
        }
        req.on('response', function(res) {
            clearTimeout(reqTimeout);
            const headers = createHeadersLenient(res.headers);
            // HTTP fetch step 5
            if (fetch.isRedirect(res.statusCode)) {
                // HTTP fetch step 5.2
                const location = headers.get('Location');
                // HTTP fetch step 5.3
                let locationURL = null;
                try {
                    locationURL = location === null ? null : new URL$1(location, request.url).toString();
                } catch (err) {
                    // error here can only be invalid URL in Location: header
                    // do not throw when options.redirect == manual
                    // let the user extract the errorneous redirect URL
                    if (request.redirect !== 'manual') {
                        reject(new FetchError(`uri requested responds with an invalid redirect URL: ${location}`, 'invalid-redirect'));
                        finalize();
                        return;
                    }
                }
                // HTTP fetch step 5.5
                switch(request.redirect){
                    case 'error':
                        reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
                        finalize();
                        return;
                    case 'manual':
                        // node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
                        if (locationURL !== null) {
                            // handle corrupted header
                            try {
                                headers.set('Location', locationURL);
                            } catch (err) {
                                // istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
                                reject(err);
                            }
                        }
                        break;
                    case 'follow':
                        // HTTP-redirect fetch step 2
                        if (locationURL === null) {
                            break;
                        }
                        // HTTP-redirect fetch step 5
                        if (request.counter >= request.follow) {
                            reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
                            finalize();
                            return;
                        }
                        // HTTP-redirect fetch step 6 (counter increment)
                        // Create a new Request object.
                        const requestOpts = {
                            headers: new Headers(request.headers),
                            follow: request.follow,
                            counter: request.counter + 1,
                            agent: request.agent,
                            compress: request.compress,
                            method: request.method,
                            body: request.body,
                            signal: request.signal,
                            timeout: request.timeout,
                            size: request.size
                        };
                        if (!isDomainOrSubdomain(request.url, locationURL) || !isSameProtocol(request.url, locationURL)) {
                            for (const name of [
                                'authorization',
                                'www-authenticate',
                                'cookie',
                                'cookie2'
                            ]){
                                requestOpts.headers.delete(name);
                            }
                        }
                        // HTTP-redirect fetch step 9
                        if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
                            reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
                            finalize();
                            return;
                        }
                        // HTTP-redirect fetch step 11
                        if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
                            requestOpts.method = 'GET';
                            requestOpts.body = undefined;
                            requestOpts.headers.delete('content-length');
                        }
                        // HTTP-redirect fetch step 15
                        resolve(fetch(new Request(locationURL, requestOpts)));
                        finalize();
                        return;
                }
            }
            // prepare response
            res.once('end', function() {
                if (signal) signal.removeEventListener('abort', abortAndFinalize);
            });
            let body = res.pipe(new PassThrough$1());
            const response_options = {
                url: request.url,
                status: res.statusCode,
                statusText: res.statusMessage,
                headers: headers,
                size: request.size,
                timeout: request.timeout,
                counter: request.counter
            };
            // HTTP-network fetch step 12.1.1.3
            const codings = headers.get('Content-Encoding');
            // HTTP-network fetch step 12.1.1.4: handle content codings
            // in following scenarios we ignore compression support
            // 1. compression support is disabled
            // 2. HEAD request
            // 3. no Content-Encoding header
            // 4. no content response (204)
            // 5. content not modified response (304)
            if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
                response = new Response(body, response_options);
                resolve(response);
                return;
            }
            // For Node v6+
            // Be less strict when decoding compressed responses, since sometimes
            // servers send slightly invalid responses that are still accepted
            // by common browsers.
            // Always using Z_SYNC_FLUSH is what cURL does.
            const zlibOptions = {
                flush: __TURBOPACK__imported__module__$5b$externals$5d2f$zlib__$5b$external$5d$__$28$zlib$2c$__cjs$29$__["default"].Z_SYNC_FLUSH,
                finishFlush: __TURBOPACK__imported__module__$5b$externals$5d2f$zlib__$5b$external$5d$__$28$zlib$2c$__cjs$29$__["default"].Z_SYNC_FLUSH
            };
            // for gzip
            if (codings == 'gzip' || codings == 'x-gzip') {
                body = body.pipe(__TURBOPACK__imported__module__$5b$externals$5d2f$zlib__$5b$external$5d$__$28$zlib$2c$__cjs$29$__["default"].createGunzip(zlibOptions));
                response = new Response(body, response_options);
                resolve(response);
                return;
            }
            // for deflate
            if (codings == 'deflate' || codings == 'x-deflate') {
                // handle the infamous raw deflate response from old servers
                // a hack for old IIS and Apache servers
                const raw = res.pipe(new PassThrough$1());
                raw.once('data', function(chunk) {
                    // see http://stackoverflow.com/questions/37519828
                    if ((chunk[0] & 0x0F) === 0x08) {
                        body = body.pipe(__TURBOPACK__imported__module__$5b$externals$5d2f$zlib__$5b$external$5d$__$28$zlib$2c$__cjs$29$__["default"].createInflate());
                    } else {
                        body = body.pipe(__TURBOPACK__imported__module__$5b$externals$5d2f$zlib__$5b$external$5d$__$28$zlib$2c$__cjs$29$__["default"].createInflateRaw());
                    }
                    response = new Response(body, response_options);
                    resolve(response);
                });
                raw.on('end', function() {
                    // some old IIS servers return zero-length OK deflate responses, so 'data' is never emitted.
                    if (!response) {
                        response = new Response(body, response_options);
                        resolve(response);
                    }
                });
                return;
            }
            // for br
            if (codings == 'br' && typeof __TURBOPACK__imported__module__$5b$externals$5d2f$zlib__$5b$external$5d$__$28$zlib$2c$__cjs$29$__["default"].createBrotliDecompress === 'function') {
                body = body.pipe(__TURBOPACK__imported__module__$5b$externals$5d2f$zlib__$5b$external$5d$__$28$zlib$2c$__cjs$29$__["default"].createBrotliDecompress());
                response = new Response(body, response_options);
                resolve(response);
                return;
            }
            // otherwise, use response as-is
            response = new Response(body, response_options);
            resolve(response);
        });
        writeToStream(req, request);
    });
}
function fixResponseChunkedTransferBadEnding(request, errorCallback) {
    let socket;
    request.on('socket', function(s) {
        socket = s;
    });
    request.on('response', function(response) {
        const headers = response.headers;
        if (headers['transfer-encoding'] === 'chunked' && !headers['content-length']) {
            response.once('close', function(hadError) {
                // tests for socket presence, as in some situations the
                // the 'socket' event is not triggered for the request
                // (happens in deno), avoids `TypeError`
                // if a data listener is still present we didn't end cleanly
                const hasDataListener = socket && socket.listenerCount('data') > 0;
                if (hasDataListener && !hadError) {
                    const err = new Error('Premature close');
                    err.code = 'ERR_STREAM_PREMATURE_CLOSE';
                    errorCallback(err);
                }
            });
        }
    });
}
function destroyStream(stream, err) {
    if (stream.destroy) {
        stream.destroy(err);
    } else {
        // node < 8
        stream.emit('error', err);
        stream.end();
    }
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */ fetch.isRedirect = function(code) {
    return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};
// expose Promise
fetch.Promise = /*TURBOPACK member replacement*/ __turbopack_context__.g.Promise;
const __TURBOPACK__default__export__ = fetch;
;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/node-gyp-build/node-gyp-build.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

var fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
var path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
var os = __turbopack_context__.r("[externals]/os [external] (os, cjs)");
// Workaround to fix webpack's build warnings: 'the request of a dependency is an expression'
var runtimeRequire = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : /*TURBOPACK member replacement*/ __turbopack_context__.t // eslint-disable-line
;
var vars = process.config && process.config.variables || {};
var prebuildsOnly = !!process.env.PREBUILDS_ONLY;
var abi = process.versions.modules // TODO: support old node where this is undef
;
var runtime = isElectron() ? 'electron' : isNwjs() ? 'node-webkit' : 'node';
var arch = process.env.npm_config_arch || os.arch();
var platform = process.env.npm_config_platform || os.platform();
var libc = process.env.LIBC || (isAlpine(platform) ? 'musl' : 'glibc');
var armv = process.env.ARM_VERSION || (arch === 'arm64' ? '8' : vars.arm_version) || '';
var uv = (process.versions.uv || '').split('.')[0];
module.exports = load;
function load(dir) {
    return runtimeRequire(load.resolve(dir));
}
load.resolve = load.path = function(dir) {
    dir = path.resolve(dir || '.');
    try {
        var name = runtimeRequire(path.join(dir, 'package.json')).name.toUpperCase().replace(/-/g, '_');
        if (process.env[name + '_PREBUILD']) dir = process.env[name + '_PREBUILD'];
    } catch (err) {}
    if (!prebuildsOnly) {
        var release = getFirst(path.join(dir, 'build/Release'), matchBuild);
        if (release) return release;
        var debug = getFirst(path.join(dir, 'build/Debug'), matchBuild);
        if (debug) return debug;
    }
    var prebuild = resolve(dir);
    if (prebuild) return prebuild;
    var nearby = resolve(path.dirname(process.execPath));
    if (nearby) return nearby;
    var target = [
        'platform=' + platform,
        'arch=' + arch,
        'runtime=' + runtime,
        'abi=' + abi,
        'uv=' + uv,
        armv ? 'armv=' + armv : '',
        'libc=' + libc,
        'node=' + process.versions.node,
        process.versions.electron ? 'electron=' + process.versions.electron : '',
        typeof __webpack_require__ === 'function' ? 'webpack=true' : '' // eslint-disable-line
    ].filter(Boolean).join(' ');
    throw new Error('No native build was found for ' + target + '\n    loaded from: ' + dir + '\n');
    function resolve(dir) {
        // Find matching "prebuilds/<platform>-<arch>" directory
        var tuples = readdirSync(path.join(dir, 'prebuilds')).map(parseTuple);
        var tuple = tuples.filter(matchTuple(platform, arch)).sort(compareTuples)[0];
        if (!tuple) return;
        // Find most specific flavor first
        var prebuilds = path.join(dir, 'prebuilds', tuple.name);
        var parsed = readdirSync(prebuilds).map(parseTags);
        var candidates = parsed.filter(matchTags(runtime, abi));
        var winner = candidates.sort(compareTags(runtime))[0];
        if (winner) return path.join(prebuilds, winner.file);
    }
};
function readdirSync(dir) {
    try {
        return fs.readdirSync(dir);
    } catch (err) {
        return [];
    }
}
function getFirst(dir, filter) {
    var files = readdirSync(dir).filter(filter);
    return files[0] && path.join(dir, files[0]);
}
function matchBuild(name) {
    return /\.node$/.test(name);
}
function parseTuple(name) {
    // Example: darwin-x64+arm64
    var arr = name.split('-');
    if (arr.length !== 2) return;
    var platform = arr[0];
    var architectures = arr[1].split('+');
    if (!platform) return;
    if (!architectures.length) return;
    if (!architectures.every(Boolean)) return;
    return {
        name,
        platform,
        architectures
    };
}
function matchTuple(platform, arch) {
    return function(tuple) {
        if (tuple == null) return false;
        if (tuple.platform !== platform) return false;
        return tuple.architectures.includes(arch);
    };
}
function compareTuples(a, b) {
    // Prefer single-arch prebuilds over multi-arch
    return a.architectures.length - b.architectures.length;
}
function parseTags(file) {
    var arr = file.split('.');
    var extension = arr.pop();
    var tags = {
        file: file,
        specificity: 0
    };
    if (extension !== 'node') return;
    for(var i = 0; i < arr.length; i++){
        var tag = arr[i];
        if (tag === 'node' || tag === 'electron' || tag === 'node-webkit') {
            tags.runtime = tag;
        } else if (tag === 'napi') {
            tags.napi = true;
        } else if (tag.slice(0, 3) === 'abi') {
            tags.abi = tag.slice(3);
        } else if (tag.slice(0, 2) === 'uv') {
            tags.uv = tag.slice(2);
        } else if (tag.slice(0, 4) === 'armv') {
            tags.armv = tag.slice(4);
        } else if (tag === 'glibc' || tag === 'musl') {
            tags.libc = tag;
        } else {
            continue;
        }
        tags.specificity++;
    }
    return tags;
}
function matchTags(runtime, abi) {
    return function(tags) {
        if (tags == null) return false;
        if (tags.runtime && tags.runtime !== runtime && !runtimeAgnostic(tags)) return false;
        if (tags.abi && tags.abi !== abi && !tags.napi) return false;
        if (tags.uv && tags.uv !== uv) return false;
        if (tags.armv && tags.armv !== armv) return false;
        if (tags.libc && tags.libc !== libc) return false;
        return true;
    };
}
function runtimeAgnostic(tags) {
    return tags.runtime === 'node' && tags.napi;
}
function compareTags(runtime) {
    // Precedence: non-agnostic runtime, abi over napi, then by specificity.
    return function(a, b) {
        if (a.runtime !== b.runtime) {
            return a.runtime === runtime ? -1 : 1;
        } else if (a.abi !== b.abi) {
            return a.abi ? -1 : 1;
        } else if (a.specificity !== b.specificity) {
            return a.specificity > b.specificity ? -1 : 1;
        } else {
            return 0;
        }
    };
}
function isNwjs() {
    return !!(process.versions && process.versions.nw);
}
function isElectron() {
    if (process.versions && process.versions.electron) return true;
    if (process.env.ELECTRON_RUN_AS_NODE) return true;
    return "undefined" !== 'undefined' && window.process && window.process.type === 'renderer';
}
function isAlpine(platform) {
    return platform === 'linux' && fs.existsSync('/etc/alpine-release');
}
// Exposed for unit tests
// TODO: move to lib
load.parseTags = parseTags;
load.matchTags = matchTags;
load.compareTags = compareTags;
load.parseTuple = parseTuple;
load.matchTuple = matchTuple;
load.compareTuples = compareTuples;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/node-gyp-build/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

const runtimeRequire = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : /*TURBOPACK member replacement*/ __turbopack_context__.t // eslint-disable-line
;
if (typeof runtimeRequire.addon === 'function') {
    module.exports = runtimeRequire.addon.bind(runtimeRequire);
} else {
    module.exports = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/node-gyp-build/node-gyp-build.js [app-ssr] (ecmascript)");
}
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/bufferutil/fallback.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Masks a buffer using the given mask.
 *
 * @param {Buffer} source The buffer to mask
 * @param {Buffer} mask The mask to use
 * @param {Buffer} output The buffer where to store the result
 * @param {Number} offset The offset at which to start writing
 * @param {Number} length The number of bytes to mask.
 * @public
 */ const mask = (source, mask, output, offset, length)=>{
    for(var i = 0; i < length; i++){
        output[offset + i] = source[i] ^ mask[i & 3];
    }
};
/**
 * Unmasks a buffer using the given mask.
 *
 * @param {Buffer} buffer The buffer to unmask
 * @param {Buffer} mask The mask to use
 * @public
 */ const unmask = (buffer, mask)=>{
    // Required until https://github.com/nodejs/node/issues/9006 is resolved.
    const length = buffer.length;
    for(var i = 0; i < length; i++){
        buffer[i] ^= mask[i & 3];
    }
};
module.exports = {
    mask,
    unmask
};
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/bufferutil/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

try {
    module.exports = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/node-gyp-build/index.js [app-ssr] (ecmascript)")(("TURBOPACK compile-time value", "/ROOT/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/bufferutil"));
} catch (e) {
    module.exports = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/bufferutil/fallback.js [app-ssr] (ecmascript)");
}
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/utf-8-validate/fallback.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Checks if a given buffer contains only correct UTF-8.
 * Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
 * Markus Kuhn.
 *
 * @param {Buffer} buf The buffer to check
 * @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
 * @public
 */ function isValidUTF8(buf) {
    const len = buf.length;
    let i = 0;
    while(i < len){
        if ((buf[i] & 0x80) === 0x00) {
            i++;
        } else if ((buf[i] & 0xe0) === 0xc0) {
            if (i + 1 === len || (buf[i + 1] & 0xc0) !== 0x80 || (buf[i] & 0xfe) === 0xc0 // overlong
            ) {
                return false;
            }
            i += 2;
        } else if ((buf[i] & 0xf0) === 0xe0) {
            if (i + 2 >= len || (buf[i + 1] & 0xc0) !== 0x80 || (buf[i + 2] & 0xc0) !== 0x80 || buf[i] === 0xe0 && (buf[i + 1] & 0xe0) === 0x80 || // overlong
            buf[i] === 0xed && (buf[i + 1] & 0xe0) === 0xa0 // surrogate (U+D800 - U+DFFF)
            ) {
                return false;
            }
            i += 3;
        } else if ((buf[i] & 0xf8) === 0xf0) {
            if (i + 3 >= len || (buf[i + 1] & 0xc0) !== 0x80 || (buf[i + 2] & 0xc0) !== 0x80 || (buf[i + 3] & 0xc0) !== 0x80 || buf[i] === 0xf0 && (buf[i + 1] & 0xf0) === 0x80 || // overlong
            buf[i] === 0xf4 && buf[i + 1] > 0x8f || buf[i] > 0xf4 // > U+10FFFF
            ) {
                return false;
            }
            i += 4;
        } else {
            return false;
        }
    }
    return true;
}
module.exports = isValidUTF8;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/utf-8-validate/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

try {
    module.exports = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/node-gyp-build/index.js [app-ssr] (ecmascript)")(("TURBOPACK compile-time value", "/ROOT/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/utf-8-validate"));
} catch (e) {
    module.exports = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/utf-8-validate/fallback.js [app-ssr] (ecmascript)");
}
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/rpc-websockets/node_modules/eventemitter3/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var has = Object.prototype.hasOwnProperty, prefix = '~';
/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */ function Events() {}
//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
    Events.prototype = Object.create(null);
    //
    // This hack is needed because the `__proto__` property is still inherited in
    // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
    //
    if (!new Events().__proto__) prefix = false;
}
/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */ function EE(fn, context, once) {
    this.fn = fn;
    this.context = context;
    this.once = once || false;
}
/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */ function addListener(emitter, event, fn, context, once) {
    if (typeof fn !== 'function') {
        throw new TypeError('The listener must be a function');
    }
    var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
    if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
    else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
    else emitter._events[evt] = [
        emitter._events[evt],
        listener
    ];
    return emitter;
}
/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */ function clearEvent(emitter, evt) {
    if (--emitter._eventsCount === 0) emitter._events = new Events();
    else delete emitter._events[evt];
}
/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */ function EventEmitter() {
    this._events = new Events();
    this._eventsCount = 0;
}
/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */ EventEmitter.prototype.eventNames = function eventNames() {
    var names = [], events, name;
    if (this._eventsCount === 0) return names;
    for(name in events = this._events){
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
    }
    if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
    }
    return names;
};
/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */ EventEmitter.prototype.listeners = function listeners(event) {
    var evt = prefix ? prefix + event : event, handlers = this._events[evt];
    if (!handlers) return [];
    if (handlers.fn) return [
        handlers.fn
    ];
    for(var i = 0, l = handlers.length, ee = new Array(l); i < l; i++){
        ee[i] = handlers[i].fn;
    }
    return ee;
};
/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */ EventEmitter.prototype.listenerCount = function listenerCount(event) {
    var evt = prefix ? prefix + event : event, listeners = this._events[evt];
    if (!listeners) return 0;
    if (listeners.fn) return 1;
    return listeners.length;
};
/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */ EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt]) return false;
    var listeners = this._events[evt], len = arguments.length, args, i;
    if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);
        switch(len){
            case 1:
                return listeners.fn.call(listeners.context), true;
            case 2:
                return listeners.fn.call(listeners.context, a1), true;
            case 3:
                return listeners.fn.call(listeners.context, a1, a2), true;
            case 4:
                return listeners.fn.call(listeners.context, a1, a2, a3), true;
            case 5:
                return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
            case 6:
                return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for(i = 1, args = new Array(len - 1); i < len; i++){
            args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
    } else {
        var length = listeners.length, j;
        for(i = 0; i < length; i++){
            if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);
            switch(len){
                case 1:
                    listeners[i].fn.call(listeners[i].context);
                    break;
                case 2:
                    listeners[i].fn.call(listeners[i].context, a1);
                    break;
                case 3:
                    listeners[i].fn.call(listeners[i].context, a1, a2);
                    break;
                case 4:
                    listeners[i].fn.call(listeners[i].context, a1, a2, a3);
                    break;
                default:
                    if (!args) for(j = 1, args = new Array(len - 1); j < len; j++){
                        args[j - 1] = arguments[j];
                    }
                    listeners[i].fn.apply(listeners[i].context, args);
            }
        }
    }
    return true;
};
/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */ EventEmitter.prototype.on = function on(event, fn, context) {
    return addListener(this, event, fn, context, false);
};
/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */ EventEmitter.prototype.once = function once(event, fn, context) {
    return addListener(this, event, fn, context, true);
};
/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */ EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt]) return this;
    if (!fn) {
        clearEvent(this, evt);
        return this;
    }
    var listeners = this._events[evt];
    if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
            clearEvent(this, evt);
        }
    } else {
        for(var i = 0, events = [], length = listeners.length; i < length; i++){
            if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
                events.push(listeners[i]);
            }
        }
        //
        // Reset the array, or remove it completely if we have no more listeners.
        //
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
    }
    return this;
};
/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */ EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
    var evt;
    if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
    } else {
        this._events = new Events();
        this._eventsCount = 0;
    }
    return this;
};
//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;
//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;
//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;
//
// Expose the module.
//
if ("TURBOPACK compile-time truthy", 1) {
    module.exports = EventEmitter;
}
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/rpc-websockets/node_modules/eventemitter3/index.mjs [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$rpc$2d$websockets$2f$node_modules$2f$eventemitter3$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/rpc-websockets/node_modules/eventemitter3/index.js [app-ssr] (ecmascript)");
;
;
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$rpc$2d$websockets$2f$node_modules$2f$eventemitter3$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"];
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/rpc-websockets/node_modules/eventemitter3/index.js [app-ssr] (ecmascript) <export default as EventEmitter>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EventEmitter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$rpc$2d$websockets$2f$node_modules$2f$eventemitter3$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$rpc$2d$websockets$2f$node_modules$2f$eventemitter3$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/rpc-websockets/node_modules/eventemitter3/index.js [app-ssr] (ecmascript)");
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/rpc-websockets/dist/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Client",
    ()=>Client,
    "CommonClient",
    ()=>CommonClient,
    "DefaultDataPack",
    ()=>DefaultDataPack,
    "Server",
    ()=>Server,
    "WebSocket",
    ()=>WebSocket,
    "createError",
    ()=>createError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$ws$2f$wrapper$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/ws/wrapper.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$ws$2f$lib$2f$websocket$2d$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__WebSocketServer$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/ws/lib/websocket-server.js [app-ssr] (ecmascript) <export default as WebSocketServer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$rpc$2d$websockets$2f$node_modules$2f$eventemitter3$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/rpc-websockets/node_modules/eventemitter3/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$rpc$2d$websockets$2f$node_modules$2f$eventemitter3$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__EventEmitter$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/rpc-websockets/node_modules/eventemitter3/index.js [app-ssr] (ecmascript) <export default as EventEmitter>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$url__$5b$external$5d$__$28$node$3a$url$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:url [external] (node:url, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v1$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v1$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/uuid/dist/esm-node/v1.js [app-ssr] (ecmascript) <export default as v1>");
;
;
;
;
// src/lib/client/websocket.ts
function WebSocket(address, options) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$ws$2f$wrapper$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"](address, options);
}
// src/lib/utils.ts
var DefaultDataPack = class {
    encode(value) {
        return JSON.stringify(value);
    }
    decode(value) {
        return JSON.parse(value);
    }
};
// src/lib/client.ts
var CommonClient = class extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$rpc$2d$websockets$2f$node_modules$2f$eventemitter3$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__EventEmitter$3e$__["EventEmitter"] {
    address;
    rpc_id;
    queue;
    options;
    autoconnect;
    ready;
    reconnect;
    reconnect_timer_id;
    reconnect_interval;
    max_reconnects;
    rest_options;
    current_reconnects;
    generate_request_id;
    socket;
    webSocketFactory;
    dataPack;
    /**
  * Instantiate a Client class.
  * @constructor
  * @param {webSocketFactory} webSocketFactory - factory method for WebSocket
  * @param {String} address - url to a websocket server
  * @param {Object} options - ws options object with reconnect parameters
  * @param {Function} generate_request_id - custom generation request Id
  * @param {DataPack} dataPack - data pack contains encoder and decoder
  * @return {CommonClient}
  */ constructor(webSocketFactory, address = "ws://localhost:8080", { autoconnect = true, reconnect = true, reconnect_interval = 1e3, max_reconnects = 5, ...rest_options } = {}, generate_request_id, dataPack){
        super();
        this.webSocketFactory = webSocketFactory;
        this.queue = {};
        this.rpc_id = 0;
        this.address = address;
        this.autoconnect = autoconnect;
        this.ready = false;
        this.reconnect = reconnect;
        this.reconnect_timer_id = void 0;
        this.reconnect_interval = reconnect_interval;
        this.max_reconnects = max_reconnects;
        this.rest_options = rest_options;
        this.current_reconnects = 0;
        this.generate_request_id = generate_request_id || (()=>typeof this.rpc_id === "number" ? ++this.rpc_id : Number(this.rpc_id) + 1);
        if (!dataPack) this.dataPack = new DefaultDataPack();
        else this.dataPack = dataPack;
        if (this.autoconnect) this._connect(this.address, {
            autoconnect: this.autoconnect,
            reconnect: this.reconnect,
            reconnect_interval: this.reconnect_interval,
            max_reconnects: this.max_reconnects,
            ...this.rest_options
        });
    }
    /**
  * Connects to a defined server if not connected already.
  * @method
  * @return {Undefined}
  */ connect() {
        if (this.socket) return;
        this._connect(this.address, {
            autoconnect: this.autoconnect,
            reconnect: this.reconnect,
            reconnect_interval: this.reconnect_interval,
            max_reconnects: this.max_reconnects,
            ...this.rest_options
        });
    }
    /**
  * Calls a registered RPC method on server.
  * @method
  * @param {String} method - RPC method name
  * @param {Object|Array} params - optional method parameters
  * @param {Number} timeout - RPC reply timeout value
  * @param {Object} ws_opts - options passed to ws
  * @return {Promise}
  */ call(method, params, timeout, ws_opts) {
        if (!ws_opts && "object" === typeof timeout) {
            ws_opts = timeout;
            timeout = null;
        }
        return new Promise((resolve, reject)=>{
            if (!this.ready) return reject(new Error("socket not ready"));
            const rpc_id = this.generate_request_id(method, params);
            const message = {
                jsonrpc: "2.0",
                method,
                params: params || void 0,
                id: rpc_id
            };
            this.socket.send(this.dataPack.encode(message), ws_opts, (error)=>{
                if (error) return reject(error);
                this.queue[rpc_id] = {
                    promise: [
                        resolve,
                        reject
                    ]
                };
                if (timeout) {
                    this.queue[rpc_id].timeout = setTimeout(()=>{
                        delete this.queue[rpc_id];
                        reject(new Error("reply timeout"));
                    }, timeout);
                }
            });
        });
    }
    /**
  * Logins with the other side of the connection.
  * @method
  * @param {Object} params - Login credentials object
  * @return {Promise}
  */ async login(params) {
        const resp = await this.call("rpc.login", params);
        if (!resp) throw new Error("authentication failed");
        return resp;
    }
    /**
  * Fetches a list of client's methods registered on server.
  * @method
  * @return {Array}
  */ async listMethods() {
        return await this.call("__listMethods");
    }
    /**
  * Sends a JSON-RPC 2.0 notification to server.
  * @method
  * @param {String} method - RPC method name
  * @param {Object} params - optional method parameters
  * @return {Promise}
  */ notify(method, params) {
        return new Promise((resolve, reject)=>{
            if (!this.ready) return reject(new Error("socket not ready"));
            const message = {
                jsonrpc: "2.0",
                method,
                params
            };
            this.socket.send(this.dataPack.encode(message), (error)=>{
                if (error) return reject(error);
                resolve();
            });
        });
    }
    /**
  * Subscribes for a defined event.
  * @method
  * @param {String|Array} event - event name
  * @return {Undefined}
  * @throws {Error}
  */ async subscribe(event) {
        if (typeof event === "string") event = [
            event
        ];
        const result = await this.call("rpc.on", event);
        if (typeof event === "string" && result[event] !== "ok") throw new Error("Failed subscribing to an event '" + event + "' with: " + result[event]);
        return result;
    }
    /**
  * Unsubscribes from a defined event.
  * @method
  * @param {String|Array} event - event name
  * @return {Undefined}
  * @throws {Error}
  */ async unsubscribe(event) {
        if (typeof event === "string") event = [
            event
        ];
        const result = await this.call("rpc.off", event);
        if (typeof event === "string" && result[event] !== "ok") throw new Error("Failed unsubscribing from an event with: " + result);
        return result;
    }
    /**
  * Closes a WebSocket connection gracefully.
  * @method
  * @param {Number} code - socket close code
  * @param {String} data - optional data to be sent before closing
  * @return {Undefined}
  */ close(code, data) {
        if (this.socket) this.socket.close(code || 1e3, data);
    }
    /**
  * Enable / disable automatic reconnection.
  * @method
  * @param {Boolean} reconnect - enable / disable reconnection
  * @return {Undefined}
  */ setAutoReconnect(reconnect) {
        this.reconnect = reconnect;
    }
    /**
  * Set the interval between reconnection attempts.
  * @method
  * @param {Number} interval - reconnection interval in milliseconds
  * @return {Undefined}
  */ setReconnectInterval(interval) {
        this.reconnect_interval = interval;
    }
    /**
  * Set the maximum number of reconnection attempts.
  * @method
  * @param {Number} max_reconnects - maximum reconnection attempts
  * @return {Undefined}
  */ setMaxReconnects(max_reconnects) {
        this.max_reconnects = max_reconnects;
    }
    /**
  * Get the current number of reconnection attempts made.
  * @method
  * @return {Number} current reconnection attempts
  */ getCurrentReconnects() {
        return this.current_reconnects;
    }
    /**
  * Get the maximum number of reconnection attempts.
  * @method
  * @return {Number} maximum reconnection attempts
  */ getMaxReconnects() {
        return this.max_reconnects;
    }
    /**
  * Check if the client is currently attempting to reconnect.
  * @method
  * @return {Boolean} true if reconnection is in progress
  */ isReconnecting() {
        return this.reconnect_timer_id !== void 0;
    }
    /**
  * Check if the client will attempt to reconnect on the next close event.
  * @method
  * @return {Boolean} true if reconnection will be attempted
  */ willReconnect() {
        return this.reconnect && (this.max_reconnects === 0 || this.current_reconnects < this.max_reconnects);
    }
    /**
  * Connection/Message handler.
  * @method
  * @private
  * @param {String} address - WebSocket API address
  * @param {Object} options - ws options object
  * @return {Undefined}
  */ _connect(address, options) {
        clearTimeout(this.reconnect_timer_id);
        this.socket = this.webSocketFactory(address, options);
        this.socket.addEventListener("open", ()=>{
            this.ready = true;
            this.emit("open");
            this.current_reconnects = 0;
        });
        this.socket.addEventListener("message", ({ data: message })=>{
            if (message instanceof ArrayBuffer) message = Buffer.from(message).toString();
            try {
                message = this.dataPack.decode(message);
            } catch (error) {
                return;
            }
            if (message.notification && this.listeners(message.notification).length) {
                if (!Object.keys(message.params).length) return this.emit(message.notification);
                const args = [
                    message.notification
                ];
                if (message.params.constructor === Object) args.push(message.params);
                else for(let i = 0; i < message.params.length; i++)args.push(message.params[i]);
                return Promise.resolve().then(()=>{
                    this.emit.apply(this, args);
                });
            }
            if (!this.queue[message.id]) {
                if (message.method) {
                    return Promise.resolve().then(()=>{
                        this.emit(message.method, message?.params);
                    });
                }
                return;
            }
            if ("error" in message === "result" in message) this.queue[message.id].promise[1](new Error('Server response malformed. Response must include either "result" or "error", but not both.'));
            if (this.queue[message.id].timeout) clearTimeout(this.queue[message.id].timeout);
            if (message.error) this.queue[message.id].promise[1](message.error);
            else this.queue[message.id].promise[0](message.result);
            delete this.queue[message.id];
        });
        this.socket.addEventListener("error", (error)=>this.emit("error", error));
        this.socket.addEventListener("close", ({ code, reason })=>{
            if (this.ready) setTimeout(()=>this.emit("close", code, reason), 0);
            this.ready = false;
            this.socket = void 0;
            if (code === 1e3) return;
            this.current_reconnects++;
            if (this.reconnect && (this.max_reconnects > this.current_reconnects || this.max_reconnects === 0)) this.reconnect_timer_id = setTimeout(()=>this._connect(address, options), this.reconnect_interval);
            else if (this.reconnect && this.max_reconnects > 0 && this.current_reconnects >= this.max_reconnects) {
                setTimeout(()=>this.emit("max_reconnects_reached", code, reason), 1);
            }
        });
    }
};
var Server = class extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$rpc$2d$websockets$2f$node_modules$2f$eventemitter3$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__EventEmitter$3e$__["EventEmitter"] {
    namespaces;
    dataPack;
    wss;
    /**
  * Instantiate a Server class.
  * @constructor
  * @param {Object} options - ws constructor's parameters with rpc
  * @param {DataPack} dataPack - data pack contains encoder and decoder
  * @return {Server} - returns a new Server instance
  */ constructor(options, dataPack){
        super();
        this.namespaces = {};
        if (!dataPack) this.dataPack = new DefaultDataPack();
        else this.dataPack = dataPack;
        this.wss = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$ws$2f$lib$2f$websocket$2d$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__WebSocketServer$3e$__["WebSocketServer"](options);
        this.wss.on("listening", ()=>this.emit("listening"));
        this.wss.on("connection", (socket, request)=>{
            const u = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$url__$5b$external$5d$__$28$node$3a$url$2c$__cjs$29$__["default"].parse(request.url, true);
            const ns = u.pathname;
            if (u.query.socket_id) socket._id = u.query.socket_id;
            else socket._id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v1$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v1$3e$__["v1"])();
            socket["_authenticated"] = false;
            socket.on("error", (error)=>this.emit("socket-error", socket, error));
            socket.on("close", ()=>{
                this.namespaces[ns].clients.delete(socket._id);
                for (const event of Object.keys(this.namespaces[ns].events)){
                    const index = this.namespaces[ns].events[event].sockets.indexOf(socket._id);
                    if (index >= 0) this.namespaces[ns].events[event].sockets.splice(index, 1);
                }
                this.emit("disconnection", socket);
            });
            if (!this.namespaces[ns]) this._generateNamespace(ns);
            this.namespaces[ns].clients.set(socket._id, socket);
            this.emit("connection", socket, request);
            return this._handleRPC(socket, ns);
        });
        this.wss.on("error", (error)=>this.emit("error", error));
    }
    /**
  * Registers an RPC method.
  * @method
  * @param {String} name - method name
  * @param {Function} fn - a callee function
  * @param {String} ns - namespace identifier
  * @throws {TypeError}
  * @return {Object} - returns an IMethod object
  */ register(name, fn, ns = "/") {
        if (!this.namespaces[ns]) this._generateNamespace(ns);
        this.namespaces[ns].rpc_methods[name] = {
            fn,
            protected: false
        };
        return {
            protected: ()=>this._makeProtectedMethod(name, ns),
            public: ()=>this._makePublicMethod(name, ns)
        };
    }
    /**
  * Sets an auth method.
  * @method
  * @param {Function} fn - an arbitrary auth method
  * @param {String} ns - namespace identifier
  * @throws {TypeError}
  * @return {Undefined}
  */ setAuth(fn, ns = "/") {
        this.register("rpc.login", fn, ns);
    }
    /**
  * Marks an RPC method as protected.
  * @method
  * @param {String} name - method name
  * @param {String} ns - namespace identifier
  * @return {Undefined}
  */ _makeProtectedMethod(name, ns = "/") {
        this.namespaces[ns].rpc_methods[name].protected = true;
    }
    /**
  * Marks an RPC method as public.
  * @method
  * @param {String} name - method name
  * @param {String} ns - namespace identifier
  * @return {Undefined}
  */ _makePublicMethod(name, ns = "/") {
        this.namespaces[ns].rpc_methods[name].protected = false;
    }
    /**
  * Marks an event as protected.
  * @method
  * @param {String} name - event name
  * @param {String} ns - namespace identifier
  * @return {Undefined}
  */ _makeProtectedEvent(name, ns = "/") {
        this.namespaces[ns].events[name].protected = true;
    }
    /**
  * Marks an event as public.
  * @method
  * @param {String} name - event name
  * @param {String} ns - namespace identifier
  * @return {Undefined}
  */ _makePublicEvent(name, ns = "/") {
        this.namespaces[ns].events[name].protected = false;
    }
    /**
  * Removes a namespace and closes all connections
  * @method
  * @param {String} ns - namespace identifier
  * @throws {TypeError}
  * @return {Undefined}
  */ closeNamespace(ns) {
        const namespace = this.namespaces[ns];
        if (namespace) {
            delete namespace.rpc_methods;
            delete namespace.events;
            for (const socket of namespace.clients.values())socket.close();
            delete this.namespaces[ns];
        }
    }
    /**
  * Creates a new event that can be emitted to clients.
  * @method
  * @param {String} name - event name
  * @param {String} ns - namespace identifier
  * @throws {TypeError}
  * @return {Object} - returns an IEvent object
  */ event(name, ns = "/") {
        if (!this.namespaces[ns]) this._generateNamespace(ns);
        else {
            const index = this.namespaces[ns].events[name];
            if (index !== void 0) throw new Error(`Already registered event ${ns}${name}`);
        }
        this.namespaces[ns].events[name] = {
            sockets: [],
            protected: false
        };
        this.on(name, (...params)=>{
            if (params.length === 1 && params[0] instanceof Object) params = params[0];
            for (const socket_id of this.namespaces[ns].events[name].sockets){
                const socket = this.namespaces[ns].clients.get(socket_id);
                if (!socket) continue;
                socket.send(this.dataPack.encode({
                    notification: name,
                    params
                }));
            }
        });
        return {
            protected: ()=>this._makeProtectedEvent(name, ns),
            public: ()=>this._makePublicEvent(name, ns)
        };
    }
    /**
  * Returns a requested namespace object
  * @method
  * @param {String} name - namespace identifier
  * @throws {TypeError}
  * @return {Object} - namespace object
  */ of(name) {
        if (!this.namespaces[name]) this._generateNamespace(name);
        const self = this;
        return {
            // self.register convenience method
            register (fn_name, fn) {
                if (arguments.length !== 2) throw new Error("must provide exactly two arguments");
                if (typeof fn_name !== "string") throw new Error("name must be a string");
                if (typeof fn !== "function") throw new Error("handler must be a function");
                return self.register(fn_name, fn, name);
            },
            // self.event convenience method
            event (ev_name) {
                if (arguments.length !== 1) throw new Error("must provide exactly one argument");
                if (typeof ev_name !== "string") throw new Error("name must be a string");
                return self.event(ev_name, name);
            },
            // self.eventList convenience method
            get eventList () {
                return Object.keys(self.namespaces[name].events);
            },
            /**
      * Emits a specified event to this namespace.
      * @inner
      * @method
      * @param {String} event - event name
      * @param {Array} params - event parameters
      * @return {Undefined}
      */ emit (event, ...params) {
                const nsEvent = self.namespaces[name].events[event];
                if (nsEvent) for (const socket_id of nsEvent.sockets){
                    const socket = self.namespaces[name].clients.get(socket_id);
                    if (!socket) continue;
                    socket.send(self.dataPack.encode({
                        notification: event,
                        params
                    }));
                }
            },
            /**
      * Returns a name of this namespace.
      * @inner
      * @method
      * @kind constant
      * @return {String}
      */ get name () {
                return name;
            },
            /**
      * Returns a hash of websocket objects connected to this namespace.
      * @inner
      * @method
      * @return {Object}
      */ connected () {
                const socket_ids = [
                    ...self.namespaces[name].clients.keys()
                ];
                return socket_ids.reduce((acc, curr)=>({
                        ...acc,
                        [curr]: self.namespaces[name].clients.get(curr)
                    }), {});
            },
            /**
      * Returns a list of client unique identifiers connected to this namespace.
      * @inner
      * @method
      * @return {Array}
      */ clients () {
                return self.namespaces[name];
            }
        };
    }
    /**
  * Lists all created events in a given namespace. Defaults to "/".
  * @method
  * @param {String} ns - namespaces identifier
  * @readonly
  * @return {Array} - returns a list of created events
  */ eventList(ns = "/") {
        if (!this.namespaces[ns]) return [];
        return Object.keys(this.namespaces[ns].events);
    }
    /**
  * Creates a JSON-RPC 2.0 compliant error
  * @method
  * @param {Number} code - indicates the error type that occurred
  * @param {String} message - provides a short description of the error
  * @param {String|Object} data - details containing additional information about the error
  * @return {Object}
  */ createError(code, message, data) {
        return {
            code,
            message,
            data: data || null
        };
    }
    /**
  * Closes the server and terminates all clients.
  * @method
  * @return {Promise}
  */ close() {
        return new Promise((resolve, reject)=>{
            try {
                this.wss.close();
                this.emit("close");
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
    /**
  * Handles all WebSocket JSON RPC 2.0 requests.
  * @private
  * @param {Object} socket - ws socket instance
  * @param {String} ns - namespaces identifier
  * @return {Undefined}
  */ _handleRPC(socket, ns = "/") {
        socket.on("message", async (data)=>{
            const msg_options = {};
            if (data instanceof ArrayBuffer) {
                msg_options.binary = true;
                data = Buffer.from(data).toString();
            }
            if (socket.readyState !== 1) return;
            let parsedData;
            try {
                parsedData = this.dataPack.decode(data);
            } catch (error) {
                return socket.send(this.dataPack.encode({
                    jsonrpc: "2.0",
                    error: createError(-32700, error.toString()),
                    id: null
                }), msg_options);
            }
            if (Array.isArray(parsedData)) {
                if (!parsedData.length) return socket.send(this.dataPack.encode({
                    jsonrpc: "2.0",
                    error: createError(-32600, "Invalid array"),
                    id: null
                }), msg_options);
                const responses = [];
                for (const message of parsedData){
                    const response2 = await this._runMethod(message, socket._id, ns);
                    if (!response2) continue;
                    responses.push(response2);
                }
                if (!responses.length) return;
                return socket.send(this.dataPack.encode(responses), msg_options);
            }
            const response = await this._runMethod(parsedData, socket._id, ns);
            if (!response) return;
            return socket.send(this.dataPack.encode(response), msg_options);
        });
    }
    /**
  * Runs a defined RPC method.
  * @private
  * @param {Object} message - a message received
  * @param {Object} socket_id - user's socket id
  * @param {String} ns - namespaces identifier
  * @return {Object|undefined}
  */ async _runMethod(message, socket_id, ns = "/") {
        if (typeof message !== "object" || message === null) return {
            jsonrpc: "2.0",
            error: createError(-32600),
            id: null
        };
        if (message.jsonrpc !== "2.0") return {
            jsonrpc: "2.0",
            error: createError(-32600, "Invalid JSON RPC version"),
            id: message.id || null
        };
        if (!message.method) return {
            jsonrpc: "2.0",
            error: createError(-32602, "Method not specified"),
            id: message.id || null
        };
        if (typeof message.method !== "string") return {
            jsonrpc: "2.0",
            error: createError(-32600, "Invalid method name"),
            id: message.id || null
        };
        if (message.params && typeof message.params === "string") return {
            jsonrpc: "2.0",
            error: createError(-32600),
            id: message.id || null
        };
        if (message.method === "rpc.on") {
            if (!message.params) return {
                jsonrpc: "2.0",
                error: createError(-32e3),
                id: message.id || null
            };
            const results = {};
            const event_names = Object.keys(this.namespaces[ns].events);
            for (const name of message.params){
                const index = event_names.indexOf(name);
                const namespace = this.namespaces[ns];
                if (index === -1) {
                    results[name] = "provided event invalid";
                    continue;
                }
                if (namespace.events[event_names[index]].protected === true && namespace.clients.get(socket_id)["_authenticated"] === false) {
                    return {
                        jsonrpc: "2.0",
                        error: createError(-32606),
                        id: message.id || null
                    };
                }
                const socket_index = namespace.events[event_names[index]].sockets.indexOf(socket_id);
                if (socket_index >= 0) {
                    results[name] = "socket has already been subscribed to event";
                    continue;
                }
                namespace.events[event_names[index]].sockets.push(socket_id);
                results[name] = "ok";
            }
            return {
                jsonrpc: "2.0",
                result: results,
                id: message.id || null
            };
        } else if (message.method === "rpc.off") {
            if (!message.params) return {
                jsonrpc: "2.0",
                error: createError(-32e3),
                id: message.id || null
            };
            const results = {};
            for (const name of message.params){
                if (!this.namespaces[ns].events[name]) {
                    results[name] = "provided event invalid";
                    continue;
                }
                const index = this.namespaces[ns].events[name].sockets.indexOf(socket_id);
                if (index === -1) {
                    results[name] = "not subscribed";
                    continue;
                }
                this.namespaces[ns].events[name].sockets.splice(index, 1);
                results[name] = "ok";
            }
            return {
                jsonrpc: "2.0",
                result: results,
                id: message.id || null
            };
        } else if (message.method === "rpc.login") {
            if (!message.params) return {
                jsonrpc: "2.0",
                error: createError(-32604),
                id: message.id || null
            };
        }
        if (!this.namespaces[ns].rpc_methods[message.method]) {
            return {
                jsonrpc: "2.0",
                error: createError(-32601),
                id: message.id || null
            };
        }
        let response = null;
        if (this.namespaces[ns].rpc_methods[message.method].protected === true && this.namespaces[ns].clients.get(socket_id)["_authenticated"] === false) {
            return {
                jsonrpc: "2.0",
                error: createError(-32605),
                id: message.id || null
            };
        }
        try {
            response = await this.namespaces[ns].rpc_methods[message.method].fn(message.params, socket_id);
        } catch (error) {
            if (!message.id) return;
            if (error instanceof Error) return {
                jsonrpc: "2.0",
                error: {
                    code: -32e3,
                    message: error.name,
                    data: error.message
                },
                id: message.id
            };
            return {
                jsonrpc: "2.0",
                error,
                id: message.id
            };
        }
        if (!message.id) return;
        if (message.method === "rpc.login" && response === true) {
            const s = this.namespaces[ns].clients.get(socket_id);
            s["_authenticated"] = true;
            this.namespaces[ns].clients.set(socket_id, s);
        }
        return {
            jsonrpc: "2.0",
            result: response,
            id: message.id
        };
    }
    /**
  * Generate a new namespace store.
  * Also preregister some special namespace methods.
  * @private
  * @param {String} name - namespaces identifier
  * @return {undefined}
  */ _generateNamespace(name) {
        this.namespaces[name] = {
            rpc_methods: {
                __listMethods: {
                    fn: ()=>Object.keys(this.namespaces[name].rpc_methods),
                    protected: false
                }
            },
            clients: /* @__PURE__ */ new Map(),
            events: {}
        };
    }
};
var RPC_ERRORS = /* @__PURE__ */ new Map([
    [
        -32e3,
        "Event not provided"
    ],
    [
        -32600,
        "Invalid Request"
    ],
    [
        -32601,
        "Method not found"
    ],
    [
        -32602,
        "Invalid params"
    ],
    [
        -32603,
        "Internal error"
    ],
    [
        -32604,
        "Params not found"
    ],
    [
        -32605,
        "Method forbidden"
    ],
    [
        -32606,
        "Event forbidden"
    ],
    [
        -32700,
        "Parse error"
    ]
]);
function createError(code, details) {
    const error = {
        code,
        message: RPC_ERRORS.get(code) || "Internal Server Error"
    };
    if (details) error["data"] = details;
    return error;
}
// src/index.ts
var Client = class extends CommonClient {
    constructor(address = "ws://localhost:8080", { autoconnect = true, reconnect = true, reconnect_interval = 1e3, max_reconnects = 5, ...rest_options } = {}, generate_request_id){
        super(WebSocket, address, {
            autoconnect,
            reconnect,
            reconnect_interval,
            max_reconnects,
            ...rest_options
        }, generate_request_id);
    }
};
;
 //# sourceMappingURL=index.mjs.map
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/eventemitter3/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var has = Object.prototype.hasOwnProperty, prefix = '~';
/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */ function Events() {}
//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
    Events.prototype = Object.create(null);
    //
    // This hack is needed because the `__proto__` property is still inherited in
    // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
    //
    if (!new Events().__proto__) prefix = false;
}
/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */ function EE(fn, context, once) {
    this.fn = fn;
    this.context = context;
    this.once = once || false;
}
/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */ function addListener(emitter, event, fn, context, once) {
    if (typeof fn !== 'function') {
        throw new TypeError('The listener must be a function');
    }
    var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
    if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
    else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
    else emitter._events[evt] = [
        emitter._events[evt],
        listener
    ];
    return emitter;
}
/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */ function clearEvent(emitter, evt) {
    if (--emitter._eventsCount === 0) emitter._events = new Events();
    else delete emitter._events[evt];
}
/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */ function EventEmitter() {
    this._events = new Events();
    this._eventsCount = 0;
}
/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */ EventEmitter.prototype.eventNames = function eventNames() {
    var names = [], events, name;
    if (this._eventsCount === 0) return names;
    for(name in events = this._events){
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
    }
    if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
    }
    return names;
};
/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */ EventEmitter.prototype.listeners = function listeners(event) {
    var evt = prefix ? prefix + event : event, handlers = this._events[evt];
    if (!handlers) return [];
    if (handlers.fn) return [
        handlers.fn
    ];
    for(var i = 0, l = handlers.length, ee = new Array(l); i < l; i++){
        ee[i] = handlers[i].fn;
    }
    return ee;
};
/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */ EventEmitter.prototype.listenerCount = function listenerCount(event) {
    var evt = prefix ? prefix + event : event, listeners = this._events[evt];
    if (!listeners) return 0;
    if (listeners.fn) return 1;
    return listeners.length;
};
/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */ EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt]) return false;
    var listeners = this._events[evt], len = arguments.length, args, i;
    if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);
        switch(len){
            case 1:
                return listeners.fn.call(listeners.context), true;
            case 2:
                return listeners.fn.call(listeners.context, a1), true;
            case 3:
                return listeners.fn.call(listeners.context, a1, a2), true;
            case 4:
                return listeners.fn.call(listeners.context, a1, a2, a3), true;
            case 5:
                return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
            case 6:
                return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for(i = 1, args = new Array(len - 1); i < len; i++){
            args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
    } else {
        var length = listeners.length, j;
        for(i = 0; i < length; i++){
            if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);
            switch(len){
                case 1:
                    listeners[i].fn.call(listeners[i].context);
                    break;
                case 2:
                    listeners[i].fn.call(listeners[i].context, a1);
                    break;
                case 3:
                    listeners[i].fn.call(listeners[i].context, a1, a2);
                    break;
                case 4:
                    listeners[i].fn.call(listeners[i].context, a1, a2, a3);
                    break;
                default:
                    if (!args) for(j = 1, args = new Array(len - 1); j < len; j++){
                        args[j - 1] = arguments[j];
                    }
                    listeners[i].fn.apply(listeners[i].context, args);
            }
        }
    }
    return true;
};
/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */ EventEmitter.prototype.on = function on(event, fn, context) {
    return addListener(this, event, fn, context, false);
};
/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */ EventEmitter.prototype.once = function once(event, fn, context) {
    return addListener(this, event, fn, context, true);
};
/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */ EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt]) return this;
    if (!fn) {
        clearEvent(this, evt);
        return this;
    }
    var listeners = this._events[evt];
    if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
            clearEvent(this, evt);
        }
    } else {
        for(var i = 0, events = [], length = listeners.length; i < length; i++){
            if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
                events.push(listeners[i]);
            }
        }
        //
        // Reset the array, or remove it completely if we have no more listeners.
        //
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
    }
    return this;
};
/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */ EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
    var evt;
    if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
    } else {
        this._events = new Events();
        this._eventsCount = 0;
    }
    return this;
};
//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;
//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;
//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;
//
// Expose the module.
//
if ("TURBOPACK compile-time truthy", 1) {
    module.exports = EventEmitter;
}
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/zustand/esm/vanilla.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createStore",
    ()=>createStore
]);
const createStoreImpl = (createState)=>{
    let state;
    const listeners = /* @__PURE__ */ new Set();
    const setState = (partial, replace)=>{
        const nextState = typeof partial === "function" ? partial(state) : partial;
        if (!Object.is(nextState, state)) {
            const previousState = state;
            state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
            listeners.forEach((listener)=>listener(state, previousState));
        }
    };
    const getState = ()=>state;
    const getInitialState = ()=>initialState;
    const subscribe = (listener)=>{
        listeners.add(listener);
        return ()=>listeners.delete(listener);
    };
    const api = {
        setState,
        getState,
        getInitialState,
        subscribe
    };
    const initialState = state = createState(setState, getState, api);
    return api;
};
const createStore = (createState)=>createState ? createStoreImpl(createState) : createStoreImpl;
;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "create",
    ()=>create,
    "useStore",
    ()=>useStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$zustand$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/zustand/esm/vanilla.mjs [app-ssr] (ecmascript)");
;
;
const identity = (arg)=>arg;
function useStore(api, selector = identity) {
    const slice = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useSyncExternalStore(api.subscribe, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback(()=>selector(api.getState()), [
        api,
        selector
    ]), __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback(()=>selector(api.getInitialState()), [
        api,
        selector
    ]));
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useDebugValue(slice);
    return slice;
}
const createImpl = (createState)=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$zustand$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createStore"])(createState);
    const useBoundStore = (selector)=>useStore(api, selector);
    Object.assign(useBoundStore, api);
    return useBoundStore;
};
const create = (createState)=>createState ? createImpl(createState) : createImpl;
;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/camelcase/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const UPPERCASE = /[\p{Lu}]/u;
const LOWERCASE = /[\p{Ll}]/u;
const LEADING_CAPITAL = /^[\p{Lu}](?![\p{Lu}])/gu;
const IDENTIFIER = /([\p{Alpha}\p{N}_]|$)/u;
const SEPARATORS = /[_.\- ]+/;
const LEADING_SEPARATORS = new RegExp('^' + SEPARATORS.source);
const SEPARATORS_AND_IDENTIFIER = new RegExp(SEPARATORS.source + IDENTIFIER.source, 'gu');
const NUMBERS_AND_IDENTIFIER = new RegExp('\\d+' + IDENTIFIER.source, 'gu');
const preserveCamelCase = (string, toLowerCase, toUpperCase)=>{
    let isLastCharLower = false;
    let isLastCharUpper = false;
    let isLastLastCharUpper = false;
    for(let i = 0; i < string.length; i++){
        const character = string[i];
        if (isLastCharLower && UPPERCASE.test(character)) {
            string = string.slice(0, i) + '-' + string.slice(i);
            isLastCharLower = false;
            isLastLastCharUpper = isLastCharUpper;
            isLastCharUpper = true;
            i++;
        } else if (isLastCharUpper && isLastLastCharUpper && LOWERCASE.test(character)) {
            string = string.slice(0, i - 1) + '-' + string.slice(i - 1);
            isLastLastCharUpper = isLastCharUpper;
            isLastCharUpper = false;
            isLastCharLower = true;
        } else {
            isLastCharLower = toLowerCase(character) === character && toUpperCase(character) !== character;
            isLastLastCharUpper = isLastCharUpper;
            isLastCharUpper = toUpperCase(character) === character && toLowerCase(character) !== character;
        }
    }
    return string;
};
const preserveConsecutiveUppercase = (input, toLowerCase)=>{
    LEADING_CAPITAL.lastIndex = 0;
    return input.replace(LEADING_CAPITAL, (m1)=>toLowerCase(m1));
};
const postProcess = (input, toUpperCase)=>{
    SEPARATORS_AND_IDENTIFIER.lastIndex = 0;
    NUMBERS_AND_IDENTIFIER.lastIndex = 0;
    return input.replace(SEPARATORS_AND_IDENTIFIER, (_, identifier)=>toUpperCase(identifier)).replace(NUMBERS_AND_IDENTIFIER, (m)=>toUpperCase(m));
};
const camelCase = (input, options)=>{
    if (!(typeof input === 'string' || Array.isArray(input))) {
        throw new TypeError('Expected the input to be `string | string[]`');
    }
    options = {
        pascalCase: false,
        preserveConsecutiveUppercase: false,
        ...options
    };
    if (Array.isArray(input)) {
        input = input.map((x)=>x.trim()).filter((x)=>x.length).join('-');
    } else {
        input = input.trim();
    }
    if (input.length === 0) {
        return '';
    }
    const toLowerCase = options.locale === false ? (string)=>string.toLowerCase() : (string)=>string.toLocaleLowerCase(options.locale);
    const toUpperCase = options.locale === false ? (string)=>string.toUpperCase() : (string)=>string.toLocaleUpperCase(options.locale);
    if (input.length === 1) {
        return options.pascalCase ? toUpperCase(input) : toLowerCase(input);
    }
    const hasUpperCase = input !== toLowerCase(input);
    if (hasUpperCase) {
        input = preserveCamelCase(input, toLowerCase, toUpperCase);
    }
    input = input.replace(LEADING_SEPARATORS, '');
    if (options.preserveConsecutiveUppercase) {
        input = preserveConsecutiveUppercase(input, toLowerCase);
    } else {
        input = toLowerCase(input);
    }
    if (options.pascalCase) {
        input = toUpperCase(input.charAt(0)) + input.slice(1);
    }
    return postProcess(input, toUpperCase);
};
module.exports = camelCase;
// TODO: Remove this for the next major release
module.exports.default = camelCase;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/buffer-layout/lib/Layout.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

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
 * Support for translating between Buffer instances and JavaScript
 * native types.
 *
 * {@link module:Layout~Layout|Layout} is the basis of a class
 * hierarchy that associates property names with sequences of encoded
 * bytes.
 *
 * Layouts are supported for these scalar (numeric) types:
 * * {@link module:Layout~UInt|Unsigned integers in little-endian
 *   format} with {@link module:Layout.u8|8-bit}, {@link
 *   module:Layout.u16|16-bit}, {@link module:Layout.u24|24-bit},
 *   {@link module:Layout.u32|32-bit}, {@link
 *   module:Layout.u40|40-bit}, and {@link module:Layout.u48|48-bit}
 *   representation ranges;
 * * {@link module:Layout~UIntBE|Unsigned integers in big-endian
 *   format} with {@link module:Layout.u16be|16-bit}, {@link
 *   module:Layout.u24be|24-bit}, {@link module:Layout.u32be|32-bit},
 *   {@link module:Layout.u40be|40-bit}, and {@link
 *   module:Layout.u48be|48-bit} representation ranges;
 * * {@link module:Layout~Int|Signed integers in little-endian
 *   format} with {@link module:Layout.s8|8-bit}, {@link
 *   module:Layout.s16|16-bit}, {@link module:Layout.s24|24-bit},
 *   {@link module:Layout.s32|32-bit}, {@link
 *   module:Layout.s40|40-bit}, and {@link module:Layout.s48|48-bit}
 *   representation ranges;
 * * {@link module:Layout~IntBE|Signed integers in big-endian format}
 *   with {@link module:Layout.s16be|16-bit}, {@link
 *   module:Layout.s24be|24-bit}, {@link module:Layout.s32be|32-bit},
 *   {@link module:Layout.s40be|40-bit}, and {@link
 *   module:Layout.s48be|48-bit} representation ranges;
 * * 64-bit integral values that decode to an exact (if magnitude is
 *   less than 2^53) or nearby integral Number in {@link
 *   module:Layout.nu64|unsigned little-endian}, {@link
 *   module:Layout.nu64be|unsigned big-endian}, {@link
 *   module:Layout.ns64|signed little-endian}, and {@link
 *   module:Layout.ns64be|unsigned big-endian} encodings;
 * * 32-bit floating point values with {@link
 *   module:Layout.f32|little-endian} and {@link
 *   module:Layout.f32be|big-endian} representations;
 * * 64-bit floating point values with {@link
 *   module:Layout.f64|little-endian} and {@link
 *   module:Layout.f64be|big-endian} representations;
 * * {@link module:Layout.const|Constants} that take no space in the
 *   encoded expression.
 *
 * and for these aggregate types:
 * * {@link module:Layout.seq|Sequence}s of instances of a {@link
 *   module:Layout~Layout|Layout}, with JavaScript representation as
 *   an Array and constant or data-dependent {@link
 *   module:Layout~Sequence#count|length};
 * * {@link module:Layout.struct|Structure}s that aggregate a
 *   heterogeneous sequence of {@link module:Layout~Layout|Layout}
 *   instances, with JavaScript representation as an Object;
 * * {@link module:Layout.union|Union}s that support multiple {@link
 *   module:Layout~VariantLayout|variant layouts} over a fixed
 *   (padded) or variable (not padded) span of bytes, using an
 *   unsigned integer at the start of the data or a separate {@link
 *   module:Layout.unionLayoutDiscriminator|layout element} to
 *   determine which layout to use when interpreting the buffer
 *   contents;
 * * {@link module:Layout.bits|BitStructure}s that contain a sequence
 *   of individual {@link
 *   module:Layout~BitStructure#addField|BitField}s packed into an 8,
 *   16, 24, or 32-bit unsigned integer starting at the least- or
 *   most-significant bit;
 * * {@link module:Layout.cstr|C strings} of varying length;
 * * {@link module:Layout.blob|Blobs} of fixed- or variable-{@link
 *   module:Layout~Blob#length|length} raw data.
 *
 * All {@link module:Layout~Layout|Layout} instances are immutable
 * after construction, to prevent internal state from becoming
 * inconsistent.
 *
 * @local Layout
 * @local ExternalLayout
 * @local GreedyCount
 * @local OffsetLayout
 * @local UInt
 * @local UIntBE
 * @local Int
 * @local IntBE
 * @local NearUInt64
 * @local NearUInt64BE
 * @local NearInt64
 * @local NearInt64BE
 * @local Float
 * @local FloatBE
 * @local Double
 * @local DoubleBE
 * @local Sequence
 * @local Structure
 * @local UnionDiscriminator
 * @local UnionLayoutDiscriminator
 * @local Union
 * @local VariantLayout
 * @local BitStructure
 * @local BitField
 * @local Boolean
 * @local Blob
 * @local CString
 * @local Constant
 * @local bindConstructorLayout
 * @module Layout
 * @license MIT
 * @author Peter A. Bigot
 * @see {@link https://github.com/pabigot/buffer-layout|buffer-layout on GitHub}
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
}
exports.Layout = Layout;
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
exports.nameWithProperty = nameWithProperty;
/**
 * Augment a class so that instances can be encoded/decoded using a
 * given layout.
 *
 * Calling this function couples `Class` with `layout` in several ways:
 *
 * * `Class.layout_` becomes a static member property equal to `layout`;
 * * `layout.boundConstructor_` becomes a static member property equal
 *    to `Class`;
 * * The {@link Layout#makeDestinationObject|makeDestinationObject()}
 *   property of `layout` is set to a function that returns a `new
 *   Class()`;
 * * `Class.decode(b, offset)` becomes a static member function that
 *   delegates to {@link Layout#decode|layout.decode}.  The
 *   synthesized function may be captured and extended.
 * * `Class.prototype.encode(b, offset)` provides an instance member
 *   function that delegates to {@link Layout#encode|layout.encode}
 *   with `src` set to `this`.  The synthesized function may be
 *   captured and extended, but when the extension is invoked `this`
 *   must be explicitly bound to the instance.
 *
 * @param {class} Class - a JavaScript class with a nullary
 * constructor.
 *
 * @param {Layout} layout - the {@link Layout} instance used to encode
 * instances of `Class`.
 */ function bindConstructorLayout(Class, layout) {
    if ('function' !== typeof Class) {
        throw new TypeError('Class must be constructor');
    }
    if (Class.hasOwnProperty('layout_')) {
        throw new Error('Class is already bound to a layout');
    }
    if (!(layout && layout instanceof Layout)) {
        throw new TypeError('layout must be a Layout');
    }
    if (layout.hasOwnProperty('boundConstructor_')) {
        throw new Error('layout is already bound to a constructor');
    }
    Class.layout_ = layout;
    layout.boundConstructor_ = Class;
    layout.makeDestinationObject = ()=>new Class();
    Object.defineProperty(Class.prototype, 'encode', {
        value: function(b, offset) {
            return layout.encode(this, b, offset);
        },
        writable: true
    });
    Object.defineProperty(Class, 'decode', {
        value: function(b, offset) {
            return layout.decode(b, offset);
        },
        writable: true
    });
}
exports.bindConstructorLayout = bindConstructorLayout;
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
 * An {@link ExternalLayout} that determines its {@link
 * Layout#decode|value} based on offset into and length of the buffer
 * on which it is invoked.
 *
 * *Factory*: {@link module:Layout.greedy|greedy}
 *
 * @param {Number} [elementSpan] - initializer for {@link
 * GreedyCount#elementSpan|elementSpan}.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {ExternalLayout}
 */ class GreedyCount extends ExternalLayout {
    constructor(elementSpan, property){
        if (undefined === elementSpan) {
            elementSpan = 1;
        }
        if (!Number.isInteger(elementSpan) || 0 >= elementSpan) {
            throw new TypeError('elementSpan must be a (positive) integer');
        }
        super(-1, property);
        /** The layout for individual elements of the sequence.  The value
     * must be a positive integer.  If not provided, the value will be
     * 1. */ this.elementSpan = elementSpan;
    }
    /** @override */ isCount() {
        return true;
    }
    /** @override */ decode(b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        const rem = b.length - offset;
        return Math.floor(rem / this.elementSpan);
    }
    /** @override */ encode(src, b, offset) {
        return 0;
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
    constructor(span, property){
        super(span, property);
        if (6 < this.span) {
            throw new RangeError('span must not exceed 6 bytes');
        }
    }
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
    constructor(span, property){
        super(span, property);
        if (6 < this.span) {
            throw new RangeError('span must not exceed 6 bytes');
        }
    }
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
}
/**
 * Represent a signed integer in little-endian format.
 *
 * *Factory*: {@link module:Layout.s8|s8}, {@link
 *  module:Layout.s16|s16}, {@link module:Layout.s24|s24}, {@link
 *  module:Layout.s32|s32}, {@link module:Layout.s40|s40}, {@link
 *  module:Layout.s48|s48}
 *
 * @param {Number} span - initializer for {@link Layout#span|span}.
 * The parameter can range from 1 through 6.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */ class Int extends Layout {
    constructor(span, property){
        super(span, property);
        if (6 < this.span) {
            throw new RangeError('span must not exceed 6 bytes');
        }
    }
    /** @override */ decode(b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        return b.readIntLE(offset, this.span);
    }
    /** @override */ encode(src, b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        b.writeIntLE(src, offset, this.span);
        return this.span;
    }
}
/**
 * Represent a signed integer in big-endian format.
 *
 * *Factory*: {@link module:Layout.s8be|s8be}, {@link
 * module:Layout.s16be|s16be}, {@link module:Layout.s24be|s24be},
 * {@link module:Layout.s32be|s32be}, {@link
 * module:Layout.s40be|s40be}, {@link module:Layout.s48be|s48be}
 *
 * @param {Number} span - initializer for {@link Layout#span|span}.
 * The parameter can range from 1 through 6.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */ class IntBE extends Layout {
    constructor(span, property){
        super(span, property);
        if (6 < this.span) {
            throw new RangeError('span must not exceed 6 bytes');
        }
    }
    /** @override */ decode(b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        return b.readIntBE(offset, this.span);
    }
    /** @override */ encode(src, b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        b.writeIntBE(src, offset, this.span);
        return this.span;
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
    constructor(property){
        super(8, property);
    }
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
}
/**
 * Represent an unsigned 64-bit integer in big-endian format when
 * encoded and as a near integral JavaScript Number when decoded.
 *
 * *Factory*: {@link module:Layout.nu64be|nu64be}
 *
 * **NOTE** Values with magnitude greater than 2^52 may not decode to
 * the exact value of the encoded representation.
 *
 * @augments {Layout}
 */ class NearUInt64BE extends Layout {
    constructor(property){
        super(8, property);
    }
    /** @override */ decode(b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        const hi32 = b.readUInt32BE(offset);
        const lo32 = b.readUInt32BE(offset + 4);
        return roundedInt64(hi32, lo32);
    }
    /** @override */ encode(src, b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        const split = divmodInt64(src);
        b.writeUInt32BE(split.hi32, offset);
        b.writeUInt32BE(split.lo32, offset + 4);
        return 8;
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
    constructor(property){
        super(8, property);
    }
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
}
/**
 * Represent a signed 64-bit integer in big-endian format when
 * encoded and as a near integral JavaScript Number when decoded.
 *
 * *Factory*: {@link module:Layout.ns64be|ns64be}
 *
 * **NOTE** Values with magnitude greater than 2^52 may not decode to
 * the exact value of the encoded representation.
 *
 * @augments {Layout}
 */ class NearInt64BE extends Layout {
    constructor(property){
        super(8, property);
    }
    /** @override */ decode(b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        const hi32 = b.readInt32BE(offset);
        const lo32 = b.readUInt32BE(offset + 4);
        return roundedInt64(hi32, lo32);
    }
    /** @override */ encode(src, b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        const split = divmodInt64(src);
        b.writeInt32BE(split.hi32, offset);
        b.writeUInt32BE(split.lo32, offset + 4);
        return 8;
    }
}
/**
 * Represent a 32-bit floating point number in little-endian format.
 *
 * *Factory*: {@link module:Layout.f32|f32}
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */ class Float extends Layout {
    constructor(property){
        super(4, property);
    }
    /** @override */ decode(b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        return b.readFloatLE(offset);
    }
    /** @override */ encode(src, b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        b.writeFloatLE(src, offset);
        return 4;
    }
}
/**
 * Represent a 32-bit floating point number in big-endian format.
 *
 * *Factory*: {@link module:Layout.f32be|f32be}
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */ class FloatBE extends Layout {
    constructor(property){
        super(4, property);
    }
    /** @override */ decode(b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        return b.readFloatBE(offset);
    }
    /** @override */ encode(src, b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        b.writeFloatBE(src, offset);
        return 4;
    }
}
/**
 * Represent a 64-bit floating point number in little-endian format.
 *
 * *Factory*: {@link module:Layout.f64|f64}
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */ class Double extends Layout {
    constructor(property){
        super(8, property);
    }
    /** @override */ decode(b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        return b.readDoubleLE(offset);
    }
    /** @override */ encode(src, b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        b.writeDoubleLE(src, offset);
        return 8;
    }
}
/**
 * Represent a 64-bit floating point number in big-endian format.
 *
 * *Factory*: {@link module:Layout.f64be|f64be}
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */ class DoubleBE extends Layout {
    constructor(property){
        super(8, property);
    }
    /** @override */ decode(b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        return b.readDoubleBE(offset);
    }
    /** @override */ encode(src, b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        b.writeDoubleBE(src, offset);
        return 8;
    }
}
/**
 * Represent a contiguous sequence of a specific layout as an Array.
 *
 * *Factory*: {@link module:Layout.seq|seq}
 *
 * @param {Layout} elementLayout - initializer for {@link
 * Sequence#elementLayout|elementLayout}.
 *
 * @param {(Number|ExternalLayout)} count - initializer for {@link
 * Sequence#count|count}.  The parameter must be either a positive
 * integer or an instance of {@link ExternalLayout}.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */ class Sequence extends Layout {
    constructor(elementLayout, count, property){
        if (!(elementLayout instanceof Layout)) {
            throw new TypeError('elementLayout must be a Layout');
        }
        if (!(count instanceof ExternalLayout && count.isCount() || Number.isInteger(count) && 0 <= count)) {
            throw new TypeError('count must be non-negative integer ' + 'or an unsigned integer ExternalLayout');
        }
        let span = -1;
        if (!(count instanceof ExternalLayout) && 0 < elementLayout.span) {
            span = count * elementLayout.span;
        }
        super(span, property);
        /** The layout for individual elements of the sequence. */ this.elementLayout = elementLayout;
        /** The number of elements in the sequence.
     *
     * This will be either a non-negative integer or an instance of
     * {@link ExternalLayout} for which {@link
     * ExternalLayout#isCount|isCount()} is `true`. */ this.count = count;
    }
    /** @override */ getSpan(b, offset) {
        if (0 <= this.span) {
            return this.span;
        }
        if (undefined === offset) {
            offset = 0;
        }
        let span = 0;
        let count = this.count;
        if (count instanceof ExternalLayout) {
            count = count.decode(b, offset);
        }
        if (0 < this.elementLayout.span) {
            span = count * this.elementLayout.span;
        } else {
            let idx = 0;
            while(idx < count){
                span += this.elementLayout.getSpan(b, offset + span);
                ++idx;
            }
        }
        return span;
    }
    /** @override */ decode(b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        const rv = [];
        let i = 0;
        let count = this.count;
        if (count instanceof ExternalLayout) {
            count = count.decode(b, offset);
        }
        while(i < count){
            rv.push(this.elementLayout.decode(b, offset));
            offset += this.elementLayout.getSpan(b, offset);
            i += 1;
        }
        return rv;
    }
    /** Implement {@link Layout#encode|encode} for {@link Sequence}.
   *
   * **NOTE** If `src` is shorter than {@link Sequence#count|count} then
   * the unused space in the buffer is left unchanged.  If `src` is
   * longer than {@link Sequence#count|count} the unneeded elements are
   * ignored.
   *
   * **NOTE** If {@link Layout#count|count} is an instance of {@link
   * ExternalLayout} then the length of `src` will be encoded as the
   * count after `src` is encoded. */ encode(src, b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        const elo = this.elementLayout;
        const span = src.reduce((span, v)=>{
            return span + elo.encode(v, b, offset + span);
        }, 0);
        if (this.count instanceof ExternalLayout) {
            this.count.encode(src.length, b, offset);
        }
        return span;
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
    constructor(property){
        /** The {@link Layout#property|property} to be used when the
     * discriminator is referenced in isolation (generally when {@link
     * Union#decode|Union decode} cannot delegate to a specific
     * variant). */ this.property = property;
    }
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
    constructor(layout, property){
        if (!(layout instanceof ExternalLayout && layout.isCount())) {
            throw new TypeError('layout must be an unsigned integer ExternalLayout');
        }
        super(property || layout.property || 'variant');
        /** The {@link ExternalLayout} used to access the discriminator
     * value. */ this.layout = layout;
    }
    /** Delegate decoding to {@link UnionLayoutDiscriminator#layout|layout}. */ decode(b, offset) {
        return this.layout.decode(b, offset);
    }
    /** Delegate encoding to {@link UnionLayoutDiscriminator#layout|layout}. */ encode(src, b, offset) {
        return this.layout.encode(src, b, offset);
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
        if (Buffer.isBuffer(vb)) {
            if (undefined === offset) {
                offset = 0;
            }
            variant = this.discriminator.decode(vb, offset);
        }
        return this.registry[variant];
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
}
/** JavaScript chose to define bitwise operations as operating on
 * signed 32-bit values in 2's complement form, meaning any integer
 * with bit 31 set is going to look negative.  For right shifts that's
 * not a problem, because `>>>` is a logical shift, but for every
 * other bitwise operator we have to compensate for possible negative
 * results. */ function fixBitwiseResult(v) {
    if (0 > v) {
        v += 0x100000000;
    }
    return v;
}
/**
 * Contain a sequence of bit fields as an unsigned integer.
 *
 * *Factory*: {@link module:Layout.bits|bits}
 *
 * This is a container element; within it there are {@link BitField}
 * instances that provide the extracted properties.  The container
 * simply defines the aggregate representation and its bit ordering.
 * The representation is an object containing properties with numeric
 * or {@link Boolean} values.
 *
 * {@link BitField}s are added with the {@link
 * BitStructure#addField|addField} and {@link
 * BitStructure#addBoolean|addBoolean} methods.

 * @param {Layout} word - initializer for {@link
 * BitStructure#word|word}.  The parameter must be an instance of
 * {@link UInt} (or {@link UIntBE}) that is no more than 4 bytes wide.
 *
 * @param {bool} [msb] - `true` if the bit numbering starts at the
 * most significant bit of the containing word; `false` (default) if
 * it starts at the least significant bit of the containing word.  If
 * the parameter at this position is a string and `property` is
 * `undefined` the value of this argument will instead be used as the
 * value of `property`.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */ class BitStructure extends Layout {
    constructor(word, msb, property){
        if (!(word instanceof UInt || word instanceof UIntBE)) {
            throw new TypeError('word must be a UInt or UIntBE layout');
        }
        if ('string' === typeof msb && undefined === property) {
            property = msb;
            msb = undefined;
        }
        if (4 < word.span) {
            throw new RangeError('word cannot exceed 32 bits');
        }
        super(word.span, property);
        /** The layout used for the packed value.  {@link BitField}
     * instances are packed sequentially depending on {@link
     * BitStructure#msb|msb}. */ this.word = word;
        /** Whether the bit sequences are packed starting at the most
     * significant bit growing down (`true`), or the least significant
     * bit growing up (`false`).
     *
     * **NOTE** Regardless of this value, the least significant bit of
     * any {@link BitField} value is the least significant bit of the
     * corresponding section of the packed value. */ this.msb = !!msb;
        /** The sequence of {@link BitField} layouts that comprise the
     * packed structure.
     *
     * **NOTE** The array remains mutable to allow fields to be {@link
     * BitStructure#addField|added} after construction.  Users should
     * not manipulate the content of this property.*/ this.fields = [];
        /* Storage for the value.  Capture a variable instead of using an
     * instance property because we don't want anything to change the
     * value without going through the mutator. */ let value = 0;
        this._packedSetValue = function(v) {
            value = fixBitwiseResult(v);
            return this;
        };
        this._packedGetValue = function() {
            return value;
        };
    }
    /** @override */ decode(b, offset) {
        const dest = this.makeDestinationObject();
        if (undefined === offset) {
            offset = 0;
        }
        const value = this.word.decode(b, offset);
        this._packedSetValue(value);
        for (const fd of this.fields){
            if (undefined !== fd.property) {
                dest[fd.property] = fd.decode(value);
            }
        }
        return dest;
    }
    /** Implement {@link Layout#encode|encode} for {@link BitStructure}.
   *
   * If `src` is missing a property for a member with a defined {@link
   * Layout#property|property} the corresponding region of the packed
   * value is left unmodified.  Unused bits are also left unmodified. */ encode(src, b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        const value = this.word.decode(b, offset);
        this._packedSetValue(value);
        for (const fd of this.fields){
            if (undefined !== fd.property) {
                const fv = src[fd.property];
                if (undefined !== fv) {
                    fd.encode(fv);
                }
            }
        }
        return this.word.encode(this._packedGetValue(), b, offset);
    }
    /** Register a new bitfield with a containing bit structure.  The
   * resulting bitfield is returned.
   *
   * @param {Number} bits - initializer for {@link BitField#bits|bits}.
   *
   * @param {string} property - initializer for {@link
   * Layout#property|property}.
   *
   * @return {BitField} */ addField(bits, property) {
        const bf = new BitField(this, bits, property);
        this.fields.push(bf);
        return bf;
    }
    /** As with {@link BitStructure#addField|addField} for single-bit
   * fields with `boolean` value representation.
   *
   * @param {string} property - initializer for {@link
   * Layout#property|property}.
   *
   * @return {Boolean} */ addBoolean(property) {
        // This is my Boolean, not the Javascript one.
        // eslint-disable-next-line no-new-wrappers
        const bf = new Boolean(this, property);
        this.fields.push(bf);
        return bf;
    }
    /**
   * Get access to the bit field for a given property.
   *
   * @param {String} property - the bit field of interest.
   *
   * @return {BitField} - the field associated with `property`, or
   * undefined if there is no such property.
   */ fieldFor(property) {
        if ('string' !== typeof property) {
            throw new TypeError('property must be string');
        }
        for (const fd of this.fields){
            if (fd.property === property) {
                return fd;
            }
        }
    }
}
/**
 * Represent a sequence of bits within a {@link BitStructure}.
 *
 * All bit field values are represented as unsigned integers.
 *
 * **NOTE** User code should not invoke this constructor directly.
 * Use the container {@link BitStructure#addField|addField} helper
 * method.
 *
 * **NOTE** BitField instances are not instances of {@link Layout}
 * since {@link Layout#span|span} measures 8-bit units.
 *
 * @param {BitStructure} container - initializer for {@link
 * BitField#container|container}.
 *
 * @param {Number} bits - initializer for {@link BitField#bits|bits}.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 */ class BitField {
    constructor(container, bits, property){
        if (!(container instanceof BitStructure)) {
            throw new TypeError('container must be a BitStructure');
        }
        if (!Number.isInteger(bits) || 0 >= bits) {
            throw new TypeError('bits must be positive integer');
        }
        const totalBits = 8 * container.span;
        const usedBits = container.fields.reduce((sum, fd)=>sum + fd.bits, 0);
        if (bits + usedBits > totalBits) {
            throw new Error('bits too long for span remainder (' + (totalBits - usedBits) + ' of ' + totalBits + ' remain)');
        }
        /** The {@link BitStructure} instance to which this bit field
     * belongs. */ this.container = container;
        /** The span of this value in bits. */ this.bits = bits;
        /** A mask of {@link BitField#bits|bits} bits isolating value bits
     * that fit within the field.
     *
     * That is, it masks a value that has not yet been shifted into
     * position within its containing packed integer. */ this.valueMask = (1 << bits) - 1;
        if (32 === bits) {
            this.valueMask = 0xFFFFFFFF;
        }
        /** The offset of the value within the containing packed unsigned
     * integer.  The least significant bit of the packed value is at
     * offset zero, regardless of bit ordering used. */ this.start = usedBits;
        if (this.container.msb) {
            this.start = totalBits - usedBits - bits;
        }
        /** A mask of {@link BitField#bits|bits} isolating the field value
     * within the containing packed unsigned integer. */ this.wordMask = fixBitwiseResult(this.valueMask << this.start);
        /** The property name used when this bitfield is represented in an
     * Object.
     *
     * Intended to be functionally equivalent to {@link
     * Layout#property}.
     *
     * If left undefined the corresponding span of bits will be
     * treated as padding: it will not be mutated by {@link
     * Layout#encode|encode} nor represented as a property in the
     * decoded Object. */ this.property = property;
    }
    /** Store a value into the corresponding subsequence of the containing
   * bit field. */ decode() {
        const word = this.container._packedGetValue();
        const wordValue = fixBitwiseResult(word & this.wordMask);
        const value = wordValue >>> this.start;
        return value;
    }
    /** Store a value into the corresponding subsequence of the containing
   * bit field.
   *
   * **NOTE** This is not a specialization of {@link
   * Layout#encode|Layout.encode} and there is no return value. */ encode(value) {
        if (!Number.isInteger(value) || value !== fixBitwiseResult(value & this.valueMask)) {
            throw new TypeError(nameWithProperty('BitField.encode', this) + ' value must be integer not exceeding ' + this.valueMask);
        }
        const word = this.container._packedGetValue();
        const wordValue = fixBitwiseResult(value << this.start);
        this.container._packedSetValue(fixBitwiseResult(word & ~this.wordMask) | wordValue);
    }
}
/**
 * Represent a single bit within a {@link BitStructure} as a
 * JavaScript boolean.
 *
 * **NOTE** User code should not invoke this constructor directly.
 * Use the container {@link BitStructure#addBoolean|addBoolean} helper
 * method.
 *
 * @param {BitStructure} container - initializer for {@link
 * BitField#container|container}.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {BitField}
 */ /* eslint-disable no-extend-native */ class Boolean extends BitField {
    constructor(container, property){
        super(container, 1, property);
    }
    /** Override {@link BitField#decode|decode} for {@link Boolean|Boolean}.
   *
   * @returns {boolean} */ decode(b, offset) {
        return !!BitField.prototype.decode.call(this, b, offset);
    }
    /** @override */ encode(value) {
        if ('boolean' === typeof value) {
            // BitField requires integer values
            value = +value;
        }
        return BitField.prototype.encode.call(this, value);
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
 */ class Blob extends Layout {
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
        if (!(Buffer.isBuffer(src) && span === src.length)) {
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
}
/**
 * Contain a `NUL`-terminated UTF8 string.
 *
 * *Factory*: {@link module:Layout.cstr|cstr}
 *
 * **NOTE** Any UTF8 string that incorporates a zero-valued byte will
 * not be correctly decoded by this layout.
 *
 * @param {String} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */ class CString extends Layout {
    constructor(property){
        super(-1, property);
    }
    /** @override */ getSpan(b, offset) {
        if (!Buffer.isBuffer(b)) {
            throw new TypeError('b must be a Buffer');
        }
        if (undefined === offset) {
            offset = 0;
        }
        let idx = offset;
        while(idx < b.length && 0 !== b[idx]){
            idx += 1;
        }
        return 1 + idx - offset;
    }
    /** @override */ decode(b, offset, dest) {
        if (undefined === offset) {
            offset = 0;
        }
        let span = this.getSpan(b, offset);
        return b.slice(offset, offset + span - 1).toString('utf-8');
    }
    /** @override */ encode(src, b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        /* Must force this to a string, lest it be a number and the
     * "utf8-encoding" below actually allocate a buffer of length
     * src */ if ('string' !== typeof src) {
            src = src.toString();
        }
        const srcb = new Buffer(src, 'utf8');
        const span = srcb.length;
        if (offset + span > b.length) {
            throw new RangeError('encoding overruns Buffer');
        }
        srcb.copy(b, offset);
        b[offset + span] = 0;
        return span + 1;
    }
}
/**
 * Contain a UTF8 string with implicit length.
 *
 * *Factory*: {@link module:Layout.utf8|utf8}
 *
 * **NOTE** Because the length is implicit in the size of the buffer
 * this layout should be used only in isolation, or in a situation
 * where the length can be expressed by operating on a slice of the
 * containing buffer.
 *
 * @param {Number} [maxSpan] - the maximum length allowed for encoded
 * string content.  If not provided there is no bound on the allowed
 * content.
 *
 * @param {String} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */ class UTF8 extends Layout {
    constructor(maxSpan, property){
        if ('string' === typeof maxSpan && undefined === property) {
            property = maxSpan;
            maxSpan = undefined;
        }
        if (undefined === maxSpan) {
            maxSpan = -1;
        } else if (!Number.isInteger(maxSpan)) {
            throw new TypeError('maxSpan must be an integer');
        }
        super(-1, property);
        /** The maximum span of the layout in bytes.
     *
     * Positive values are generally expected.  Zero is abnormal.
     * Attempts to encode or decode a value that exceeds this length
     * will throw a `RangeError`.
     *
     * A negative value indicates that there is no bound on the length
     * of the content. */ this.maxSpan = maxSpan;
    }
    /** @override */ getSpan(b, offset) {
        if (!Buffer.isBuffer(b)) {
            throw new TypeError('b must be a Buffer');
        }
        if (undefined === offset) {
            offset = 0;
        }
        return b.length - offset;
    }
    /** @override */ decode(b, offset, dest) {
        if (undefined === offset) {
            offset = 0;
        }
        let span = this.getSpan(b, offset);
        if (0 <= this.maxSpan && this.maxSpan < span) {
            throw new RangeError('text length exceeds maxSpan');
        }
        return b.slice(offset, offset + span).toString('utf-8');
    }
    /** @override */ encode(src, b, offset) {
        if (undefined === offset) {
            offset = 0;
        }
        /* Must force this to a string, lest it be a number and the
     * "utf8-encoding" below actually allocate a buffer of length
     * src */ if ('string' !== typeof src) {
            src = src.toString();
        }
        const srcb = new Buffer(src, 'utf8');
        const span = srcb.length;
        if (0 <= this.maxSpan && this.maxSpan < span) {
            throw new RangeError('text length exceeds maxSpan');
        }
        if (offset + span > b.length) {
            throw new RangeError('encoding overruns Buffer');
        }
        srcb.copy(b, offset);
        return span;
    }
}
/**
 * Contain a constant value.
 *
 * This layout may be used in cases where a JavaScript value can be
 * inferred without an expression in the binary encoding.  An example
 * would be a {@link VariantLayout|variant layout} where the content
 * is implied by the union {@link Union#discriminator|discriminator}.
 *
 * @param {Object|Number|String} value - initializer for {@link
 * Constant#value|value}.  If the value is an object (or array) and
 * the application intends the object to remain unchanged regardless
 * of what is done to values decoded by this layout, the value should
 * be frozen prior passing it to this constructor.
 *
 * @param {String} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */ class Constant extends Layout {
    constructor(value, property){
        super(0, property);
        /** The value produced by this constant when the layout is {@link
     * Constant#decode|decoded}.
     *
     * Any JavaScript value including `null` and `undefined` is
     * permitted.
     *
     * **WARNING** If `value` passed in the constructor was not
     * frozen, it is possible for users of decoded values to change
     * the content of the value. */ this.value = value;
    }
    /** @override */ decode(b, offset, dest) {
        return this.value;
    }
    /** @override */ encode(src, b, offset) {
        /* Constants take no space */ return 0;
    }
}
exports.ExternalLayout = ExternalLayout;
exports.GreedyCount = GreedyCount;
exports.OffsetLayout = OffsetLayout;
exports.UInt = UInt;
exports.UIntBE = UIntBE;
exports.Int = Int;
exports.IntBE = IntBE;
exports.Float = Float;
exports.FloatBE = FloatBE;
exports.Double = Double;
exports.DoubleBE = DoubleBE;
exports.Sequence = Sequence;
exports.Structure = Structure;
exports.UnionDiscriminator = UnionDiscriminator;
exports.UnionLayoutDiscriminator = UnionLayoutDiscriminator;
exports.Union = Union;
exports.VariantLayout = VariantLayout;
exports.BitStructure = BitStructure;
exports.BitField = BitField;
exports.Boolean = Boolean;
exports.Blob = Blob;
exports.CString = CString;
exports.UTF8 = UTF8;
exports.Constant = Constant;
/** Factory for {@link GreedyCount}. */ exports.greedy = (elementSpan, property)=>new GreedyCount(elementSpan, property);
/** Factory for {@link OffsetLayout}. */ exports.offset = (layout, offset, property)=>new OffsetLayout(layout, offset, property);
/** Factory for {@link UInt|unsigned int layouts} spanning one
 * byte. */ exports.u8 = (property)=>new UInt(1, property);
/** Factory for {@link UInt|little-endian unsigned int layouts}
 * spanning two bytes. */ exports.u16 = (property)=>new UInt(2, property);
/** Factory for {@link UInt|little-endian unsigned int layouts}
 * spanning three bytes. */ exports.u24 = (property)=>new UInt(3, property);
/** Factory for {@link UInt|little-endian unsigned int layouts}
 * spanning four bytes. */ exports.u32 = (property)=>new UInt(4, property);
/** Factory for {@link UInt|little-endian unsigned int layouts}
 * spanning five bytes. */ exports.u40 = (property)=>new UInt(5, property);
/** Factory for {@link UInt|little-endian unsigned int layouts}
 * spanning six bytes. */ exports.u48 = (property)=>new UInt(6, property);
/** Factory for {@link NearUInt64|little-endian unsigned int
 * layouts} interpreted as Numbers. */ exports.nu64 = (property)=>new NearUInt64(property);
/** Factory for {@link UInt|big-endian unsigned int layouts}
 * spanning two bytes. */ exports.u16be = (property)=>new UIntBE(2, property);
/** Factory for {@link UInt|big-endian unsigned int layouts}
 * spanning three bytes. */ exports.u24be = (property)=>new UIntBE(3, property);
/** Factory for {@link UInt|big-endian unsigned int layouts}
 * spanning four bytes. */ exports.u32be = (property)=>new UIntBE(4, property);
/** Factory for {@link UInt|big-endian unsigned int layouts}
 * spanning five bytes. */ exports.u40be = (property)=>new UIntBE(5, property);
/** Factory for {@link UInt|big-endian unsigned int layouts}
 * spanning six bytes. */ exports.u48be = (property)=>new UIntBE(6, property);
/** Factory for {@link NearUInt64BE|big-endian unsigned int
 * layouts} interpreted as Numbers. */ exports.nu64be = (property)=>new NearUInt64BE(property);
/** Factory for {@link Int|signed int layouts} spanning one
 * byte. */ exports.s8 = (property)=>new Int(1, property);
/** Factory for {@link Int|little-endian signed int layouts}
 * spanning two bytes. */ exports.s16 = (property)=>new Int(2, property);
/** Factory for {@link Int|little-endian signed int layouts}
 * spanning three bytes. */ exports.s24 = (property)=>new Int(3, property);
/** Factory for {@link Int|little-endian signed int layouts}
 * spanning four bytes. */ exports.s32 = (property)=>new Int(4, property);
/** Factory for {@link Int|little-endian signed int layouts}
 * spanning five bytes. */ exports.s40 = (property)=>new Int(5, property);
/** Factory for {@link Int|little-endian signed int layouts}
 * spanning six bytes. */ exports.s48 = (property)=>new Int(6, property);
/** Factory for {@link NearInt64|little-endian signed int layouts}
 * interpreted as Numbers. */ exports.ns64 = (property)=>new NearInt64(property);
/** Factory for {@link Int|big-endian signed int layouts}
 * spanning two bytes. */ exports.s16be = (property)=>new IntBE(2, property);
/** Factory for {@link Int|big-endian signed int layouts}
 * spanning three bytes. */ exports.s24be = (property)=>new IntBE(3, property);
/** Factory for {@link Int|big-endian signed int layouts}
 * spanning four bytes. */ exports.s32be = (property)=>new IntBE(4, property);
/** Factory for {@link Int|big-endian signed int layouts}
 * spanning five bytes. */ exports.s40be = (property)=>new IntBE(5, property);
/** Factory for {@link Int|big-endian signed int layouts}
 * spanning six bytes. */ exports.s48be = (property)=>new IntBE(6, property);
/** Factory for {@link NearInt64BE|big-endian signed int layouts}
 * interpreted as Numbers. */ exports.ns64be = (property)=>new NearInt64BE(property);
/** Factory for {@link Float|little-endian 32-bit floating point} values. */ exports.f32 = (property)=>new Float(property);
/** Factory for {@link FloatBE|big-endian 32-bit floating point} values. */ exports.f32be = (property)=>new FloatBE(property);
/** Factory for {@link Double|little-endian 64-bit floating point} values. */ exports.f64 = (property)=>new Double(property);
/** Factory for {@link DoubleBE|big-endian 64-bit floating point} values. */ exports.f64be = (property)=>new DoubleBE(property);
/** Factory for {@link Structure} values. */ exports.struct = (fields, property, decodePrefixes)=>new Structure(fields, property, decodePrefixes);
/** Factory for {@link BitStructure} values. */ exports.bits = (word, msb, property)=>new BitStructure(word, msb, property);
/** Factory for {@link Sequence} values. */ exports.seq = (elementLayout, count, property)=>new Sequence(elementLayout, count, property);
/** Factory for {@link Union} values. */ exports.union = (discr, defaultLayout, property)=>new Union(discr, defaultLayout, property);
/** Factory for {@link UnionLayoutDiscriminator} values. */ exports.unionLayoutDiscriminator = (layout, property)=>new UnionLayoutDiscriminator(layout, property);
/** Factory for {@link Blob} values. */ exports.blob = (length, property)=>new Blob(length, property);
/** Factory for {@link CString} values. */ exports.cstr = (property)=>new CString(property);
/** Factory for {@link UTF8} values. */ exports.utf8 = (maxSpan, property)=>new UTF8(maxSpan, property);
/** Factory for {@link Constant} values. */ exports.const = (value, property)=>new Constant(value, property);
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/borsh/dist/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.struct = exports.f64 = exports.f32 = exports.i32 = exports.u32 = exports.i16 = exports.u16 = exports.i8 = exports.u8 = void 0;
exports.u64 = u64;
exports.i64 = i64;
exports.u128 = u128;
exports.i128 = i128;
exports.u256 = u256;
exports.i256 = i256;
exports.publicKey = publicKey;
exports.option = option;
exports.bool = bool;
exports.vec = vec;
exports.tagged = tagged;
exports.vecU8 = vecU8;
exports.str = str;
exports.rustEnum = rustEnum;
exports.array = array;
exports.map = map;
const buffer_layout_1 = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/buffer-layout/lib/Layout.js [app-ssr] (ecmascript)");
const web3_js_1 = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/web3.js/lib/index.esm.js [app-ssr] (ecmascript)");
const bn_js_1 = __importDefault(__turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/bn.js/lib/bn.js [app-ssr] (ecmascript)"));
var buffer_layout_2 = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/buffer-layout/lib/Layout.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "u8", {
    enumerable: true,
    get: function() {
        return buffer_layout_2.u8;
    }
});
Object.defineProperty(exports, "i8", {
    enumerable: true,
    get: function() {
        return buffer_layout_2.s8;
    }
});
Object.defineProperty(exports, "u16", {
    enumerable: true,
    get: function() {
        return buffer_layout_2.u16;
    }
});
Object.defineProperty(exports, "i16", {
    enumerable: true,
    get: function() {
        return buffer_layout_2.s16;
    }
});
Object.defineProperty(exports, "u32", {
    enumerable: true,
    get: function() {
        return buffer_layout_2.u32;
    }
});
Object.defineProperty(exports, "i32", {
    enumerable: true,
    get: function() {
        return buffer_layout_2.s32;
    }
});
Object.defineProperty(exports, "f32", {
    enumerable: true,
    get: function() {
        return buffer_layout_2.f32;
    }
});
Object.defineProperty(exports, "f64", {
    enumerable: true,
    get: function() {
        return buffer_layout_2.f64;
    }
});
Object.defineProperty(exports, "struct", {
    enumerable: true,
    get: function() {
        return buffer_layout_2.struct;
    }
});
class BNLayout extends buffer_layout_1.Layout {
    constructor(span, signed, property){
        super(span, property);
        this.blob = (0, buffer_layout_1.blob)(span);
        this.signed = signed;
    }
    decode(b, offset = 0) {
        const num = new bn_js_1.default(this.blob.decode(b, offset), 10, "le");
        if (this.signed) {
            return num.fromTwos(this.span * 8).clone();
        }
        return num;
    }
    encode(src, b, offset = 0) {
        if (this.signed) {
            src = src.toTwos(this.span * 8);
        }
        return this.blob.encode(src.toArrayLike(Buffer, "le", this.span), b, offset);
    }
}
function u64(property) {
    return new BNLayout(8, false, property);
}
function i64(property) {
    return new BNLayout(8, true, property);
}
function u128(property) {
    return new BNLayout(16, false, property);
}
function i128(property) {
    return new BNLayout(16, true, property);
}
function u256(property) {
    return new BNLayout(32, false, property);
}
function i256(property) {
    return new BNLayout(32, true, property);
}
class WrappedLayout extends buffer_layout_1.Layout {
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
    return new WrappedLayout((0, buffer_layout_1.blob)(32), (b)=>new web3_js_1.PublicKey(b), (key)=>key.toBuffer(), property);
}
class OptionLayout extends buffer_layout_1.Layout {
    constructor(layout, property){
        super(-1, property);
        this.layout = layout;
        this.discriminator = (0, buffer_layout_1.u8)();
    }
    encode(src, b, offset = 0) {
        if (src === null || src === undefined) {
            return this.discriminator.encode(0, b, offset);
        }
        this.discriminator.encode(1, b, offset);
        return this.layout.encode(src, b, offset + 1) + 1;
    }
    decode(b, offset = 0) {
        const discriminator = this.discriminator.decode(b, offset);
        if (discriminator === 0) {
            return null;
        } else if (discriminator === 1) {
            return this.layout.decode(b, offset + 1);
        }
        throw new Error("Invalid option " + this.property);
    }
    getSpan(b, offset = 0) {
        const discriminator = this.discriminator.decode(b, offset);
        if (discriminator === 0) {
            return 1;
        } else if (discriminator === 1) {
            return this.layout.getSpan(b, offset + 1) + 1;
        }
        throw new Error("Invalid option " + this.property);
    }
}
function option(layout, property) {
    return new OptionLayout(layout, property);
}
function bool(property) {
    return new WrappedLayout((0, buffer_layout_1.u8)(), decodeBool, encodeBool, property);
}
function decodeBool(value) {
    if (value === 0) {
        return false;
    } else if (value === 1) {
        return true;
    }
    throw new Error("Invalid bool: " + value);
}
function encodeBool(value) {
    return value ? 1 : 0;
}
function vec(elementLayout, property) {
    const length = (0, buffer_layout_1.u32)("length");
    const layout = (0, buffer_layout_1.struct)([
        length,
        (0, buffer_layout_1.seq)(elementLayout, (0, buffer_layout_1.offset)(length, -length.span), "values")
    ]);
    return new WrappedLayout(layout, ({ values })=>values, (values)=>({
            values
        }), property);
}
function tagged(tag, layout, property) {
    const wrappedLayout = (0, buffer_layout_1.struct)([
        u64("tag"),
        layout.replicate("data")
    ]);
    function decodeTag({ tag: receivedTag, data }) {
        if (!receivedTag.eq(tag)) {
            throw new Error("Invalid tag, expected: " + tag.toString("hex") + ", got: " + receivedTag.toString("hex"));
        }
        return data;
    }
    return new WrappedLayout(wrappedLayout, decodeTag, (data)=>({
            tag,
            data
        }), property);
}
function vecU8(property) {
    const length = (0, buffer_layout_1.u32)("length");
    const layout = (0, buffer_layout_1.struct)([
        length,
        (0, buffer_layout_1.blob)((0, buffer_layout_1.offset)(length, -length.span), "data")
    ]);
    return new WrappedLayout(layout, ({ data })=>data, (data)=>({
            data
        }), property);
}
function str(property) {
    return new WrappedLayout(vecU8(), (data)=>data.toString("utf-8"), (s)=>Buffer.from(s, "utf-8"), property);
}
function rustEnum(variants, property, discriminant) {
    const unionLayout = (0, buffer_layout_1.union)(discriminant !== null && discriminant !== void 0 ? discriminant : (0, buffer_layout_1.u8)(), property);
    variants.forEach((variant, index)=>unionLayout.addVariant(index, variant, variant.property));
    return unionLayout;
}
function array(elementLayout, length, property) {
    const layout = (0, buffer_layout_1.struct)([
        (0, buffer_layout_1.seq)(elementLayout, length, "values")
    ]);
    return new WrappedLayout(layout, ({ values })=>values, (values)=>({
            values
        }), property);
}
class MapEntryLayout extends buffer_layout_1.Layout {
    constructor(keyLayout, valueLayout, property){
        super(keyLayout.span + valueLayout.span, property);
        this.keyLayout = keyLayout;
        this.valueLayout = valueLayout;
    }
    decode(b, offset) {
        offset = offset || 0;
        const key = this.keyLayout.decode(b, offset);
        const value = this.valueLayout.decode(b, offset + this.keyLayout.getSpan(b, offset));
        return [
            key,
            value
        ];
    }
    encode(src, b, offset) {
        offset = offset || 0;
        const keyBytes = this.keyLayout.encode(src[0], b, offset);
        const valueBytes = this.valueLayout.encode(src[1], b, offset + keyBytes);
        return keyBytes + valueBytes;
    }
    getSpan(b, offset) {
        return this.keyLayout.getSpan(b, offset) + this.valueLayout.getSpan(b, offset);
    }
}
function map(keyLayout, valueLayout, property) {
    const length = (0, buffer_layout_1.u32)("length");
    const layout = (0, buffer_layout_1.struct)([
        length,
        (0, buffer_layout_1.seq)(new MapEntryLayout(keyLayout, valueLayout), (0, buffer_layout_1.offset)(length, -length.span), "values")
    ]);
    return new WrappedLayout(layout, ({ values })=>new Map(values), (values)=>({
            values: Array.from(values.entries())
        }), property);
} //# sourceMappingURL=index.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@coral-xyz/anchor-errors/dist/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Instruction errors.
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ANCHOR_ERROR__REQUIRE_EQ_VIOLATED = exports.ANCHOR_ERROR__REQUIRE_VIOLATED = exports.ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION_PROGRAM_ID = exports.ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION_AUTHORITY = exports.ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION = exports.ANCHOR_ERROR__CONSTRAINT_MINT_PERMANENT_DELEGATE_EXTENSION_DELEGATE = exports.ANCHOR_ERROR__CONSTRAINT_MINT_PERMANENT_DELEGATE_EXTENSION = exports.ANCHOR_ERROR__CONSTRAINT_MINT_CLOSE_AUTHORITY_EXTENSION_AUTHORITY = exports.ANCHOR_ERROR__CONSTRAINT_MINT_CLOSE_AUTHORITY_EXTENSION = exports.ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION_METADATA_ADDRESS = exports.ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION_AUTHORITY = exports.ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION = exports.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION_MEMBER_ADDRESS = exports.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION_AUTHORITY = exports.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION = exports.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION_GROUP_ADDRESS = exports.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION_AUTHORITY = exports.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION = exports.ANCHOR_ERROR__CONSTRAINT_ASSOCIATED_TOKEN_TOKEN_PROGRAM = exports.ANCHOR_ERROR__CONSTRAINT_MINT_TOKEN_PROGRAM = exports.ANCHOR_ERROR__CONSTRAINT_TOKEN_TOKEN_PROGRAM = exports.ANCHOR_ERROR__CONSTRAINT_ACCOUNT_IS_NONE = exports.ANCHOR_ERROR__CONSTRAINT_SPACE = exports.ANCHOR_ERROR__CONSTRAINT_MINT_DECIMALS = exports.ANCHOR_ERROR__CONSTRAINT_MINT_FREEZE_AUTHORITY = exports.ANCHOR_ERROR__CONSTRAINT_MINT_MINT_AUTHORITY = exports.ANCHOR_ERROR__CONSTRAINT_TOKEN_OWNER = exports.ANCHOR_ERROR__CONSTRAINT_TOKEN_MINT = exports.ANCHOR_ERROR__CONSTRAINT_ZERO = exports.ANCHOR_ERROR__CONSTRAINT_ADDRESS = exports.ANCHOR_ERROR__CONSTRAINT_CLOSE = exports.ANCHOR_ERROR__CONSTRAINT_ASSOCIATED_INIT = exports.ANCHOR_ERROR__CONSTRAINT_ASSOCIATED = exports.ANCHOR_ERROR__CONSTRAINT_STATE = exports.ANCHOR_ERROR__CONSTRAINT_EXECUTABLE = exports.ANCHOR_ERROR__CONSTRAINT_SEEDS = exports.ANCHOR_ERROR__CONSTRAINT_RENT_EXEMPT = exports.ANCHOR_ERROR__CONSTRAINT_OWNER = exports.ANCHOR_ERROR__CONSTRAINT_RAW = exports.ANCHOR_ERROR__CONSTRAINT_SIGNER = exports.ANCHOR_ERROR__CONSTRAINT_HAS_ONE = exports.ANCHOR_ERROR__CONSTRAINT_MUT = exports.ANCHOR_ERROR__EVENT_INSTRUCTION_STUB = exports.ANCHOR_ERROR__IDL_ACCOUNT_NOT_EMPTY = exports.ANCHOR_ERROR__IDL_INSTRUCTION_INVALID_PROGRAM = exports.ANCHOR_ERROR__IDL_INSTRUCTION_STUB = exports.ANCHOR_ERROR__INSTRUCTION_DID_NOT_SERIALIZE = exports.ANCHOR_ERROR__INSTRUCTION_DID_NOT_DESERIALIZE = exports.ANCHOR_ERROR__INSTRUCTION_FALLBACK_NOT_FOUND = exports.ANCHOR_ERROR__INSTRUCTION_MISSING = void 0;
exports.ANCHOR_ERROR__DEPRECATED = exports.ANCHOR_ERROR__INVALID_NUMERIC_CONVERSION = exports.ANCHOR_ERROR__TRYING_TO_INIT_PAYER_AS_PROGRAM_ACCOUNT = exports.ANCHOR_ERROR__DECLARED_PROGRAM_ID_MISMATCH = exports.ANCHOR_ERROR__ACCOUNT_DUPLICATE_REALLOCS = exports.ANCHOR_ERROR__ACCOUNT_REALLOC_EXCEEDS_LIMIT = exports.ANCHOR_ERROR__ACCOUNT_SYSVAR_MISMATCH = exports.ANCHOR_ERROR__ACCOUNT_NOT_ASSOCIATED_TOKEN_ACCOUNT = exports.ANCHOR_ERROR__ACCOUNT_NOT_PROGRAM_DATA = exports.ANCHOR_ERROR__ACCOUNT_NOT_INITIALIZED = exports.ANCHOR_ERROR__ACCOUNT_NOT_SYSTEM_OWNED = exports.ANCHOR_ERROR__ACCOUNT_NOT_SIGNER = exports.ANCHOR_ERROR__INVALID_PROGRAM_EXECUTABLE = exports.ANCHOR_ERROR__INVALID_PROGRAM_ID = exports.ANCHOR_ERROR__ACCOUNT_OWNED_BY_WRONG_PROGRAM = exports.ANCHOR_ERROR__ACCOUNT_NOT_MUTABLE = exports.ANCHOR_ERROR__ACCOUNT_NOT_ENOUGH_KEYS = exports.ANCHOR_ERROR__ACCOUNT_DID_NOT_SERIALIZE = exports.ANCHOR_ERROR__ACCOUNT_DID_NOT_DESERIALIZE = exports.ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_MISMATCH = exports.ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_NOT_FOUND = exports.ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_ALREADY_SET = exports.ANCHOR_ERROR__REQUIRE_GTE_VIOLATED = exports.ANCHOR_ERROR__REQUIRE_GT_VIOLATED = exports.ANCHOR_ERROR__REQUIRE_KEYS_NEQ_VIOLATED = exports.ANCHOR_ERROR__REQUIRE_NEQ_VIOLATED = exports.ANCHOR_ERROR__REQUIRE_KEYS_EQ_VIOLATED = void 0;
/** 8 byte instruction identifier not provided. */ exports.ANCHOR_ERROR__INSTRUCTION_MISSING = 100;
/** Fallback functions are not supported. */ exports.ANCHOR_ERROR__INSTRUCTION_FALLBACK_NOT_FOUND = 101;
/** The program could not deserialize the given instruction. */ exports.ANCHOR_ERROR__INSTRUCTION_DID_NOT_DESERIALIZE = 102;
/** The program could not serialize the given instruction. */ exports.ANCHOR_ERROR__INSTRUCTION_DID_NOT_SERIALIZE = 103;
// IDL instruction errors.
/** The program was compiled without idl instructions. */ exports.ANCHOR_ERROR__IDL_INSTRUCTION_STUB = 1000;
/** The transaction was given an invalid program for the IDL instruction. */ exports.ANCHOR_ERROR__IDL_INSTRUCTION_INVALID_PROGRAM = 1001;
/** IDL account must be empty in order to resize, try closing first. */ exports.ANCHOR_ERROR__IDL_ACCOUNT_NOT_EMPTY = 1002;
// Event instructions.
/** The program was compiled without `event-cpi` feature. */ exports.ANCHOR_ERROR__EVENT_INSTRUCTION_STUB = 1500;
// Constraint errors.
/** A mut constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_MUT = 2000;
/** A has one constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_HAS_ONE = 2001;
/** A signer constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_SIGNER = 2002;
/** A raw constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_RAW = 2003;
/** An owner constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_OWNER = 2004;
/** A rent exemption constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_RENT_EXEMPT = 2005;
/** A seeds constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_SEEDS = 2006;
/** An executable constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_EXECUTABLE = 2007;
/** Deprecated Error, feel free to replace with something else. */ exports.ANCHOR_ERROR__CONSTRAINT_STATE = 2008;
/** An associated constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_ASSOCIATED = 2009;
/** An associated init constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_ASSOCIATED_INIT = 2010;
/** A close constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_CLOSE = 2011;
/** An address constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_ADDRESS = 2012;
/** Expected zero account discriminant. */ exports.ANCHOR_ERROR__CONSTRAINT_ZERO = 2013;
/** A token mint constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_TOKEN_MINT = 2014;
/** A token owner constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_TOKEN_OWNER = 2015;
/** A mint mint authority constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_MINT_MINT_AUTHORITY = 2016;
/** A mint freeze authority constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_MINT_FREEZE_AUTHORITY = 2017;
/** A mint decimals constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_MINT_DECIMALS = 2018;
/** A space constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_SPACE = 2019;
/** A required account for the constraint is None. */ exports.ANCHOR_ERROR__CONSTRAINT_ACCOUNT_IS_NONE = 2020;
/** A token account token program constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_TOKEN_TOKEN_PROGRAM = 2021;
/** A mint token program constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_MINT_TOKEN_PROGRAM = 2022;
/** An associated token account token program constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_ASSOCIATED_TOKEN_TOKEN_PROGRAM = 2023;
/** A group pointer extension constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION = 2024;
/** A group pointer extension authority constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION_AUTHORITY = 2025;
/** A group pointer extension group address constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION_GROUP_ADDRESS = 2026;
/** A group member pointer extension constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION = 2027;
/** A group member pointer extension authority constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION_AUTHORITY = 2028;
/** A group member pointer extension group address constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION_MEMBER_ADDRESS = 2029;
/** A metadata pointer extension constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION = 2030;
/** A metadata pointer extension authority constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION_AUTHORITY = 2031;
/** A metadata pointer extension metadata address constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION_METADATA_ADDRESS = 2032;
/** A close authority constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_MINT_CLOSE_AUTHORITY_EXTENSION = 2033;
/** A close authority extension authority constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_MINT_CLOSE_AUTHORITY_EXTENSION_AUTHORITY = 2034;
/** A permanent delegate extension constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_MINT_PERMANENT_DELEGATE_EXTENSION = 2035;
/** A permanent delegate extension delegate constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_MINT_PERMANENT_DELEGATE_EXTENSION_DELEGATE = 2036;
/** A transfer hook extension constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION = 2037;
/** A transfer hook extension authority constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION_AUTHORITY = 2038;
/** A transfer hook extension transfer hook program id constraint was violated. */ exports.ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION_PROGRAM_ID = 2039;
// Require errors.
/** A require expression was violated. */ exports.ANCHOR_ERROR__REQUIRE_VIOLATED = 2500;
/** A require_eq expression was violated. */ exports.ANCHOR_ERROR__REQUIRE_EQ_VIOLATED = 2501;
/** A require_keys_eq expression was violated. */ exports.ANCHOR_ERROR__REQUIRE_KEYS_EQ_VIOLATED = 2502;
/** A require_neq expression was violated. */ exports.ANCHOR_ERROR__REQUIRE_NEQ_VIOLATED = 2503;
/** A require_keys_neq expression was violated. */ exports.ANCHOR_ERROR__REQUIRE_KEYS_NEQ_VIOLATED = 2504;
/** A require_gt expression was violated. */ exports.ANCHOR_ERROR__REQUIRE_GT_VIOLATED = 2505;
/** A require_gte expression was violated. */ exports.ANCHOR_ERROR__REQUIRE_GTE_VIOLATED = 2506;
// Account errors.
/** The account discriminator was already set on this account. */ exports.ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_ALREADY_SET = 3000;
/** No 8 byte discriminator was found on the account. */ exports.ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_NOT_FOUND = 3001;
/** 8 byte discriminator did not match what was expected. */ exports.ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_MISMATCH = 3002;
/** Failed to deserialize the account. */ exports.ANCHOR_ERROR__ACCOUNT_DID_NOT_DESERIALIZE = 3003;
/** Failed to serialize the account. */ exports.ANCHOR_ERROR__ACCOUNT_DID_NOT_SERIALIZE = 3004;
/** Not enough account keys given to the instruction. */ exports.ANCHOR_ERROR__ACCOUNT_NOT_ENOUGH_KEYS = 3005;
/** The given account is not mutable. */ exports.ANCHOR_ERROR__ACCOUNT_NOT_MUTABLE = 3006;
/** The given account is owned by a different program than expected. */ exports.ANCHOR_ERROR__ACCOUNT_OWNED_BY_WRONG_PROGRAM = 3007;
/** Program ID was not as expected. */ exports.ANCHOR_ERROR__INVALID_PROGRAM_ID = 3008;
/** Program account is not executable. */ exports.ANCHOR_ERROR__INVALID_PROGRAM_EXECUTABLE = 3009;
/** The given account did not sign. */ exports.ANCHOR_ERROR__ACCOUNT_NOT_SIGNER = 3010;
/** The given account is not owned by the system program. */ exports.ANCHOR_ERROR__ACCOUNT_NOT_SYSTEM_OWNED = 3011;
/** The program expected this account to be already initialized. */ exports.ANCHOR_ERROR__ACCOUNT_NOT_INITIALIZED = 3012;
/** The given account is not a program data account. */ exports.ANCHOR_ERROR__ACCOUNT_NOT_PROGRAM_DATA = 3013;
/** The given account is not the associated token account. */ exports.ANCHOR_ERROR__ACCOUNT_NOT_ASSOCIATED_TOKEN_ACCOUNT = 3014;
/** The given public key does not match the required sysvar. */ exports.ANCHOR_ERROR__ACCOUNT_SYSVAR_MISMATCH = 3015;
/** The account reallocation exceeds the MAX_PERMITTED_DATA_INCREASE limit. */ exports.ANCHOR_ERROR__ACCOUNT_REALLOC_EXCEEDS_LIMIT = 3016;
/** The account was duplicated for more than one reallocation. */ exports.ANCHOR_ERROR__ACCOUNT_DUPLICATE_REALLOCS = 3017;
// Miscellaneous errors.
/** The declared program id does not match the actual program id. */ exports.ANCHOR_ERROR__DECLARED_PROGRAM_ID_MISMATCH = 4100;
/** You cannot/should not initialize the payer account as a program account. */ exports.ANCHOR_ERROR__TRYING_TO_INIT_PAYER_AS_PROGRAM_ACCOUNT = 4101;
/** The program could not perform the numeric conversion, out of range integral type conversion attempted. */ exports.ANCHOR_ERROR__INVALID_NUMERIC_CONVERSION = 4102;
// Deprecated errors.
/** The API being used is deprecated and should no longer be used. */ exports.ANCHOR_ERROR__DEPRECATED = 5000; //# sourceMappingURL=index.js.map
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/cross-fetch/dist/node-ponyfill.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

const nodeFetch = __turbopack_context__.r("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/node-fetch/lib/index.mjs [app-ssr] (ecmascript)");
const realFetch = nodeFetch.default || nodeFetch;
const fetch = function(url, options) {
    // Support schemaless URIs on the server for parity with the browser.
    // Ex: //github.com/ -> https://github.com/
    if (/^\/\//.test(url)) {
        url = 'https:' + url;
    }
    return realFetch.call(this, url, options);
};
fetch.ponyfill = true;
module.exports = exports = fetch;
exports.fetch = fetch;
exports.Headers = nodeFetch.Headers;
exports.Request = nodeFetch.Request;
exports.Response = nodeFetch.Response;
// Needed for TypeScript consumers without esModuleInterop.
exports.default = fetch;
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/js-sha256/src/sha256.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * [js-sha256]{@link https://github.com/emn178/js-sha256}
 *
 * @version 0.11.1
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2025
 * @license MIT
 */ /*jslint bitwise: true */ (function() {
    'use strict';
    var ERROR = 'input is invalid type';
    var WINDOW = "undefined" === 'object';
    var root = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : {};
    if (root.JS_SHA256_NO_WINDOW) {
        WINDOW = false;
    }
    var WEB_WORKER = !WINDOW && typeof self === 'object';
    var NODE_JS = !root.JS_SHA256_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node && process.type != 'renderer';
    if (NODE_JS) {
        root = /*TURBOPACK member replacement*/ __turbopack_context__.g;
    } else if (WEB_WORKER) {
        root = self;
    }
    var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && ("TURBOPACK compile-time value", "object") === 'object' && module.exports;
    var AMD = typeof define === 'function' && define.amd;
    var ARRAY_BUFFER = !root.JS_SHA256_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
    var HEX_CHARS = '0123456789abcdef'.split('');
    var EXTRA = [
        -2147483648,
        8388608,
        32768,
        128
    ];
    var SHIFT = [
        24,
        16,
        8,
        0
    ];
    var K = [
        0x428a2f98,
        0x71374491,
        0xb5c0fbcf,
        0xe9b5dba5,
        0x3956c25b,
        0x59f111f1,
        0x923f82a4,
        0xab1c5ed5,
        0xd807aa98,
        0x12835b01,
        0x243185be,
        0x550c7dc3,
        0x72be5d74,
        0x80deb1fe,
        0x9bdc06a7,
        0xc19bf174,
        0xe49b69c1,
        0xefbe4786,
        0x0fc19dc6,
        0x240ca1cc,
        0x2de92c6f,
        0x4a7484aa,
        0x5cb0a9dc,
        0x76f988da,
        0x983e5152,
        0xa831c66d,
        0xb00327c8,
        0xbf597fc7,
        0xc6e00bf3,
        0xd5a79147,
        0x06ca6351,
        0x14292967,
        0x27b70a85,
        0x2e1b2138,
        0x4d2c6dfc,
        0x53380d13,
        0x650a7354,
        0x766a0abb,
        0x81c2c92e,
        0x92722c85,
        0xa2bfe8a1,
        0xa81a664b,
        0xc24b8b70,
        0xc76c51a3,
        0xd192e819,
        0xd6990624,
        0xf40e3585,
        0x106aa070,
        0x19a4c116,
        0x1e376c08,
        0x2748774c,
        0x34b0bcb5,
        0x391c0cb3,
        0x4ed8aa4a,
        0x5b9cca4f,
        0x682e6ff3,
        0x748f82ee,
        0x78a5636f,
        0x84c87814,
        0x8cc70208,
        0x90befffa,
        0xa4506ceb,
        0xbef9a3f7,
        0xc67178f2
    ];
    var OUTPUT_TYPES = [
        'hex',
        'array',
        'digest',
        'arrayBuffer'
    ];
    var blocks = [];
    if (root.JS_SHA256_NO_NODE_JS || !Array.isArray) {
        Array.isArray = function(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        };
    }
    if (ARRAY_BUFFER && (root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
        ArrayBuffer.isView = function(obj) {
            return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
        };
    }
    var createOutputMethod = function(outputType, is224) {
        return function(message) {
            return new Sha256(is224, true).update(message)[outputType]();
        };
    };
    var createMethod = function(is224) {
        var method = createOutputMethod('hex', is224);
        if (NODE_JS) {
            method = nodeWrap(method, is224);
        }
        method.create = function() {
            return new Sha256(is224);
        };
        method.update = function(message) {
            return method.create().update(message);
        };
        for(var i = 0; i < OUTPUT_TYPES.length; ++i){
            var type = OUTPUT_TYPES[i];
            method[type] = createOutputMethod(type, is224);
        }
        return method;
    };
    var nodeWrap = function(method, is224) {
        var crypto = __turbopack_context__.r("[externals]/crypto [external] (crypto, cjs)");
        var Buffer = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)").Buffer;
        var algorithm = is224 ? 'sha224' : 'sha256';
        var bufferFrom;
        if (Buffer.from && !root.JS_SHA256_NO_BUFFER_FROM) {
            bufferFrom = Buffer.from;
        } else {
            bufferFrom = function(message) {
                return new Buffer(message);
            };
        }
        var nodeMethod = function(message) {
            if (typeof message === 'string') {
                return crypto.createHash(algorithm).update(message, 'utf8').digest('hex');
            } else {
                if (message === null || message === undefined) {
                    throw new Error(ERROR);
                } else if (message.constructor === ArrayBuffer) {
                    message = new Uint8Array(message);
                }
            }
            if (Array.isArray(message) || ArrayBuffer.isView(message) || message.constructor === Buffer) {
                return crypto.createHash(algorithm).update(bufferFrom(message)).digest('hex');
            } else {
                return method(message);
            }
        };
        return nodeMethod;
    };
    var createHmacOutputMethod = function(outputType, is224) {
        return function(key, message) {
            return new HmacSha256(key, is224, true).update(message)[outputType]();
        };
    };
    var createHmacMethod = function(is224) {
        var method = createHmacOutputMethod('hex', is224);
        method.create = function(key) {
            return new HmacSha256(key, is224);
        };
        method.update = function(key, message) {
            return method.create(key).update(message);
        };
        for(var i = 0; i < OUTPUT_TYPES.length; ++i){
            var type = OUTPUT_TYPES[i];
            method[type] = createHmacOutputMethod(type, is224);
        }
        return method;
    };
    function Sha256(is224, sharedMemory) {
        if (sharedMemory) {
            blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
            this.blocks = blocks;
        } else {
            this.blocks = [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ];
        }
        if (is224) {
            this.h0 = 0xc1059ed8;
            this.h1 = 0x367cd507;
            this.h2 = 0x3070dd17;
            this.h3 = 0xf70e5939;
            this.h4 = 0xffc00b31;
            this.h5 = 0x68581511;
            this.h6 = 0x64f98fa7;
            this.h7 = 0xbefa4fa4;
        } else {
            this.h0 = 0x6a09e667;
            this.h1 = 0xbb67ae85;
            this.h2 = 0x3c6ef372;
            this.h3 = 0xa54ff53a;
            this.h4 = 0x510e527f;
            this.h5 = 0x9b05688c;
            this.h6 = 0x1f83d9ab;
            this.h7 = 0x5be0cd19;
        }
        this.block = this.start = this.bytes = this.hBytes = 0;
        this.finalized = this.hashed = false;
        this.first = true;
        this.is224 = is224;
    }
    Sha256.prototype.update = function(message) {
        if (this.finalized) {
            return;
        }
        var notString, type = typeof message;
        if (type !== 'string') {
            if (type === 'object') {
                if (message === null) {
                    throw new Error(ERROR);
                } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
                    message = new Uint8Array(message);
                } else if (!Array.isArray(message)) {
                    if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
                        throw new Error(ERROR);
                    }
                }
            } else {
                throw new Error(ERROR);
            }
            notString = true;
        }
        var code, index = 0, i, length = message.length, blocks = this.blocks;
        while(index < length){
            if (this.hashed) {
                this.hashed = false;
                blocks[0] = this.block;
                this.block = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
            }
            if (notString) {
                for(i = this.start; index < length && i < 64; ++index){
                    blocks[i >>> 2] |= message[index] << SHIFT[i++ & 3];
                }
            } else {
                for(i = this.start; index < length && i < 64; ++index){
                    code = message.charCodeAt(index);
                    if (code < 0x80) {
                        blocks[i >>> 2] |= code << SHIFT[i++ & 3];
                    } else if (code < 0x800) {
                        blocks[i >>> 2] |= (0xc0 | code >>> 6) << SHIFT[i++ & 3];
                        blocks[i >>> 2] |= (0x80 | code & 0x3f) << SHIFT[i++ & 3];
                    } else if (code < 0xd800 || code >= 0xe000) {
                        blocks[i >>> 2] |= (0xe0 | code >>> 12) << SHIFT[i++ & 3];
                        blocks[i >>> 2] |= (0x80 | code >>> 6 & 0x3f) << SHIFT[i++ & 3];
                        blocks[i >>> 2] |= (0x80 | code & 0x3f) << SHIFT[i++ & 3];
                    } else {
                        code = 0x10000 + ((code & 0x3ff) << 10 | message.charCodeAt(++index) & 0x3ff);
                        blocks[i >>> 2] |= (0xf0 | code >>> 18) << SHIFT[i++ & 3];
                        blocks[i >>> 2] |= (0x80 | code >>> 12 & 0x3f) << SHIFT[i++ & 3];
                        blocks[i >>> 2] |= (0x80 | code >>> 6 & 0x3f) << SHIFT[i++ & 3];
                        blocks[i >>> 2] |= (0x80 | code & 0x3f) << SHIFT[i++ & 3];
                    }
                }
            }
            this.lastByteIndex = i;
            this.bytes += i - this.start;
            if (i >= 64) {
                this.block = blocks[16];
                this.start = i - 64;
                this.hash();
                this.hashed = true;
            } else {
                this.start = i;
            }
        }
        if (this.bytes > 4294967295) {
            this.hBytes += this.bytes / 4294967296 << 0;
            this.bytes = this.bytes % 4294967296;
        }
        return this;
    };
    Sha256.prototype.finalize = function() {
        if (this.finalized) {
            return;
        }
        this.finalized = true;
        var blocks = this.blocks, i = this.lastByteIndex;
        blocks[16] = this.block;
        blocks[i >>> 2] |= EXTRA[i & 3];
        this.block = blocks[16];
        if (i >= 56) {
            if (!this.hashed) {
                this.hash();
            }
            blocks[0] = this.block;
            blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
        }
        blocks[14] = this.hBytes << 3 | this.bytes >>> 29;
        blocks[15] = this.bytes << 3;
        this.hash();
    };
    Sha256.prototype.hash = function() {
        var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4, f = this.h5, g = this.h6, h = this.h7, blocks = this.blocks, j, s0, s1, maj, t1, t2, ch, ab, da, cd, bc;
        for(j = 16; j < 64; ++j){
            // rightrotate
            t1 = blocks[j - 15];
            s0 = (t1 >>> 7 | t1 << 25) ^ (t1 >>> 18 | t1 << 14) ^ t1 >>> 3;
            t1 = blocks[j - 2];
            s1 = (t1 >>> 17 | t1 << 15) ^ (t1 >>> 19 | t1 << 13) ^ t1 >>> 10;
            blocks[j] = blocks[j - 16] + s0 + blocks[j - 7] + s1 << 0;
        }
        bc = b & c;
        for(j = 0; j < 64; j += 4){
            if (this.first) {
                if (this.is224) {
                    ab = 300032;
                    t1 = blocks[0] - 1413257819;
                    h = t1 - 150054599 << 0;
                    d = t1 + 24177077 << 0;
                } else {
                    ab = 704751109;
                    t1 = blocks[0] - 210244248;
                    h = t1 - 1521486534 << 0;
                    d = t1 + 143694565 << 0;
                }
                this.first = false;
            } else {
                s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
                s1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
                ab = a & b;
                maj = ab ^ a & c ^ bc;
                ch = e & f ^ ~e & g;
                t1 = h + s1 + ch + K[j] + blocks[j];
                t2 = s0 + maj;
                h = d + t1 << 0;
                d = t1 + t2 << 0;
            }
            s0 = (d >>> 2 | d << 30) ^ (d >>> 13 | d << 19) ^ (d >>> 22 | d << 10);
            s1 = (h >>> 6 | h << 26) ^ (h >>> 11 | h << 21) ^ (h >>> 25 | h << 7);
            da = d & a;
            maj = da ^ d & b ^ ab;
            ch = h & e ^ ~h & f;
            t1 = g + s1 + ch + K[j + 1] + blocks[j + 1];
            t2 = s0 + maj;
            g = c + t1 << 0;
            c = t1 + t2 << 0;
            s0 = (c >>> 2 | c << 30) ^ (c >>> 13 | c << 19) ^ (c >>> 22 | c << 10);
            s1 = (g >>> 6 | g << 26) ^ (g >>> 11 | g << 21) ^ (g >>> 25 | g << 7);
            cd = c & d;
            maj = cd ^ c & a ^ da;
            ch = g & h ^ ~g & e;
            t1 = f + s1 + ch + K[j + 2] + blocks[j + 2];
            t2 = s0 + maj;
            f = b + t1 << 0;
            b = t1 + t2 << 0;
            s0 = (b >>> 2 | b << 30) ^ (b >>> 13 | b << 19) ^ (b >>> 22 | b << 10);
            s1 = (f >>> 6 | f << 26) ^ (f >>> 11 | f << 21) ^ (f >>> 25 | f << 7);
            bc = b & c;
            maj = bc ^ b & d ^ cd;
            ch = f & g ^ ~f & h;
            t1 = e + s1 + ch + K[j + 3] + blocks[j + 3];
            t2 = s0 + maj;
            e = a + t1 << 0;
            a = t1 + t2 << 0;
            this.chromeBugWorkAround = true;
        }
        this.h0 = this.h0 + a << 0;
        this.h1 = this.h1 + b << 0;
        this.h2 = this.h2 + c << 0;
        this.h3 = this.h3 + d << 0;
        this.h4 = this.h4 + e << 0;
        this.h5 = this.h5 + f << 0;
        this.h6 = this.h6 + g << 0;
        this.h7 = this.h7 + h << 0;
    };
    Sha256.prototype.hex = function() {
        this.finalize();
        var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5, h6 = this.h6, h7 = this.h7;
        var hex = HEX_CHARS[h0 >>> 28 & 0x0F] + HEX_CHARS[h0 >>> 24 & 0x0F] + HEX_CHARS[h0 >>> 20 & 0x0F] + HEX_CHARS[h0 >>> 16 & 0x0F] + HEX_CHARS[h0 >>> 12 & 0x0F] + HEX_CHARS[h0 >>> 8 & 0x0F] + HEX_CHARS[h0 >>> 4 & 0x0F] + HEX_CHARS[h0 & 0x0F] + HEX_CHARS[h1 >>> 28 & 0x0F] + HEX_CHARS[h1 >>> 24 & 0x0F] + HEX_CHARS[h1 >>> 20 & 0x0F] + HEX_CHARS[h1 >>> 16 & 0x0F] + HEX_CHARS[h1 >>> 12 & 0x0F] + HEX_CHARS[h1 >>> 8 & 0x0F] + HEX_CHARS[h1 >>> 4 & 0x0F] + HEX_CHARS[h1 & 0x0F] + HEX_CHARS[h2 >>> 28 & 0x0F] + HEX_CHARS[h2 >>> 24 & 0x0F] + HEX_CHARS[h2 >>> 20 & 0x0F] + HEX_CHARS[h2 >>> 16 & 0x0F] + HEX_CHARS[h2 >>> 12 & 0x0F] + HEX_CHARS[h2 >>> 8 & 0x0F] + HEX_CHARS[h2 >>> 4 & 0x0F] + HEX_CHARS[h2 & 0x0F] + HEX_CHARS[h3 >>> 28 & 0x0F] + HEX_CHARS[h3 >>> 24 & 0x0F] + HEX_CHARS[h3 >>> 20 & 0x0F] + HEX_CHARS[h3 >>> 16 & 0x0F] + HEX_CHARS[h3 >>> 12 & 0x0F] + HEX_CHARS[h3 >>> 8 & 0x0F] + HEX_CHARS[h3 >>> 4 & 0x0F] + HEX_CHARS[h3 & 0x0F] + HEX_CHARS[h4 >>> 28 & 0x0F] + HEX_CHARS[h4 >>> 24 & 0x0F] + HEX_CHARS[h4 >>> 20 & 0x0F] + HEX_CHARS[h4 >>> 16 & 0x0F] + HEX_CHARS[h4 >>> 12 & 0x0F] + HEX_CHARS[h4 >>> 8 & 0x0F] + HEX_CHARS[h4 >>> 4 & 0x0F] + HEX_CHARS[h4 & 0x0F] + HEX_CHARS[h5 >>> 28 & 0x0F] + HEX_CHARS[h5 >>> 24 & 0x0F] + HEX_CHARS[h5 >>> 20 & 0x0F] + HEX_CHARS[h5 >>> 16 & 0x0F] + HEX_CHARS[h5 >>> 12 & 0x0F] + HEX_CHARS[h5 >>> 8 & 0x0F] + HEX_CHARS[h5 >>> 4 & 0x0F] + HEX_CHARS[h5 & 0x0F] + HEX_CHARS[h6 >>> 28 & 0x0F] + HEX_CHARS[h6 >>> 24 & 0x0F] + HEX_CHARS[h6 >>> 20 & 0x0F] + HEX_CHARS[h6 >>> 16 & 0x0F] + HEX_CHARS[h6 >>> 12 & 0x0F] + HEX_CHARS[h6 >>> 8 & 0x0F] + HEX_CHARS[h6 >>> 4 & 0x0F] + HEX_CHARS[h6 & 0x0F];
        if (!this.is224) {
            hex += HEX_CHARS[h7 >>> 28 & 0x0F] + HEX_CHARS[h7 >>> 24 & 0x0F] + HEX_CHARS[h7 >>> 20 & 0x0F] + HEX_CHARS[h7 >>> 16 & 0x0F] + HEX_CHARS[h7 >>> 12 & 0x0F] + HEX_CHARS[h7 >>> 8 & 0x0F] + HEX_CHARS[h7 >>> 4 & 0x0F] + HEX_CHARS[h7 & 0x0F];
        }
        return hex;
    };
    Sha256.prototype.toString = Sha256.prototype.hex;
    Sha256.prototype.digest = function() {
        this.finalize();
        var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5, h6 = this.h6, h7 = this.h7;
        var arr = [
            h0 >>> 24 & 0xFF,
            h0 >>> 16 & 0xFF,
            h0 >>> 8 & 0xFF,
            h0 & 0xFF,
            h1 >>> 24 & 0xFF,
            h1 >>> 16 & 0xFF,
            h1 >>> 8 & 0xFF,
            h1 & 0xFF,
            h2 >>> 24 & 0xFF,
            h2 >>> 16 & 0xFF,
            h2 >>> 8 & 0xFF,
            h2 & 0xFF,
            h3 >>> 24 & 0xFF,
            h3 >>> 16 & 0xFF,
            h3 >>> 8 & 0xFF,
            h3 & 0xFF,
            h4 >>> 24 & 0xFF,
            h4 >>> 16 & 0xFF,
            h4 >>> 8 & 0xFF,
            h4 & 0xFF,
            h5 >>> 24 & 0xFF,
            h5 >>> 16 & 0xFF,
            h5 >>> 8 & 0xFF,
            h5 & 0xFF,
            h6 >>> 24 & 0xFF,
            h6 >>> 16 & 0xFF,
            h6 >>> 8 & 0xFF,
            h6 & 0xFF
        ];
        if (!this.is224) {
            arr.push(h7 >>> 24 & 0xFF, h7 >>> 16 & 0xFF, h7 >>> 8 & 0xFF, h7 & 0xFF);
        }
        return arr;
    };
    Sha256.prototype.array = Sha256.prototype.digest;
    Sha256.prototype.arrayBuffer = function() {
        this.finalize();
        var buffer = new ArrayBuffer(this.is224 ? 28 : 32);
        var dataView = new DataView(buffer);
        dataView.setUint32(0, this.h0);
        dataView.setUint32(4, this.h1);
        dataView.setUint32(8, this.h2);
        dataView.setUint32(12, this.h3);
        dataView.setUint32(16, this.h4);
        dataView.setUint32(20, this.h5);
        dataView.setUint32(24, this.h6);
        if (!this.is224) {
            dataView.setUint32(28, this.h7);
        }
        return buffer;
    };
    function HmacSha256(key, is224, sharedMemory) {
        var i, type = typeof key;
        if (type === 'string') {
            var bytes = [], length = key.length, index = 0, code;
            for(i = 0; i < length; ++i){
                code = key.charCodeAt(i);
                if (code < 0x80) {
                    bytes[index++] = code;
                } else if (code < 0x800) {
                    bytes[index++] = 0xc0 | code >>> 6;
                    bytes[index++] = 0x80 | code & 0x3f;
                } else if (code < 0xd800 || code >= 0xe000) {
                    bytes[index++] = 0xe0 | code >>> 12;
                    bytes[index++] = 0x80 | code >>> 6 & 0x3f;
                    bytes[index++] = 0x80 | code & 0x3f;
                } else {
                    code = 0x10000 + ((code & 0x3ff) << 10 | key.charCodeAt(++i) & 0x3ff);
                    bytes[index++] = 0xf0 | code >>> 18;
                    bytes[index++] = 0x80 | code >>> 12 & 0x3f;
                    bytes[index++] = 0x80 | code >>> 6 & 0x3f;
                    bytes[index++] = 0x80 | code & 0x3f;
                }
            }
            key = bytes;
        } else {
            if (type === 'object') {
                if (key === null) {
                    throw new Error(ERROR);
                } else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) {
                    key = new Uint8Array(key);
                } else if (!Array.isArray(key)) {
                    if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) {
                        throw new Error(ERROR);
                    }
                }
            } else {
                throw new Error(ERROR);
            }
        }
        if (key.length > 64) {
            key = new Sha256(is224, true).update(key).array();
        }
        var oKeyPad = [], iKeyPad = [];
        for(i = 0; i < 64; ++i){
            var b = key[i] || 0;
            oKeyPad[i] = 0x5c ^ b;
            iKeyPad[i] = 0x36 ^ b;
        }
        Sha256.call(this, is224, sharedMemory);
        this.update(iKeyPad);
        this.oKeyPad = oKeyPad;
        this.inner = true;
        this.sharedMemory = sharedMemory;
    }
    HmacSha256.prototype = new Sha256();
    HmacSha256.prototype.finalize = function() {
        Sha256.prototype.finalize.call(this);
        if (this.inner) {
            this.inner = false;
            var innerHash = this.array();
            Sha256.call(this, this.is224, this.sharedMemory);
            this.update(this.oKeyPad);
            this.update(innerHash);
            Sha256.prototype.finalize.call(this);
        }
    };
    var exports = createMethod();
    exports.sha256 = exports;
    exports.sha224 = createMethod(true);
    exports.sha256.hmac = createHmacMethod();
    exports.sha224.hmac = createHmacMethod(true);
    if (COMMON_JS) {
        module.exports = exports;
    } else {
        root.sha256 = exports.sha256;
        root.sha224 = exports.sha224;
        if (AMD) {
            ((r)=>r !== undefined && __turbopack_context__.v(r))(function() {
                return exports;
            }(__turbopack_context__.r, exports, module));
        }
    }
})();
}),
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@wallet-standard/wallet/lib/esm/register.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEPRECATED_registerWallet",
    ()=>DEPRECATED_registerWallet,
    "registerWallet",
    ()=>registerWallet
]);
var __classPrivateFieldGet = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__classPrivateFieldGet || function(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__classPrivateFieldSet || function(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var _RegisterWalletEvent_detail;
function registerWallet(wallet) {
    const callback = ({ register })=>register(wallet);
    try {
        window.dispatchEvent(new RegisterWalletEvent(callback));
    } catch (error) {
        console.error('wallet-standard:register-wallet event could not be dispatched\n', error);
    }
    try {
        window.addEventListener('wallet-standard:app-ready', ({ detail: api })=>callback(api));
    } catch (error) {
        console.error('wallet-standard:app-ready event listener could not be added\n', error);
    }
}
class RegisterWalletEvent extends Event {
    get detail() {
        return __classPrivateFieldGet(this, _RegisterWalletEvent_detail, "f");
    }
    get type() {
        return 'wallet-standard:register-wallet';
    }
    constructor(callback){
        super('wallet-standard:register-wallet', {
            bubbles: false,
            cancelable: false,
            composed: false
        });
        _RegisterWalletEvent_detail.set(this, void 0);
        __classPrivateFieldSet(this, _RegisterWalletEvent_detail, callback, "f");
    }
    /** @deprecated */ preventDefault() {
        throw new Error('preventDefault cannot be called');
    }
    /** @deprecated */ stopImmediatePropagation() {
        throw new Error('stopImmediatePropagation cannot be called');
    }
    /** @deprecated */ stopPropagation() {
        throw new Error('stopPropagation cannot be called');
    }
}
_RegisterWalletEvent_detail = new WeakMap();
function DEPRECATED_registerWallet(wallet) {
    var _a;
    registerWallet(wallet);
    try {
        ((_a = window.navigator).wallets || (_a.wallets = [])).push(({ register })=>register(wallet));
    } catch (error) {
        console.error('window.navigator.wallets could not be pushed\n', error);
    }
} //# sourceMappingURL=register.js.map
}),
];

//# sourceMappingURL=33bea_a8d2da70._.js.map