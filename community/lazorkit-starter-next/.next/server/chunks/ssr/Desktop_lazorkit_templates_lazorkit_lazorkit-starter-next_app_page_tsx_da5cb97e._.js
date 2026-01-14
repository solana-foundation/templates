module.exports = [
"[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$lazorkit$2f$wallet$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@lazorkit/wallet/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/@solana/web3.js/lib/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function Home() {
    const { smartWalletPubkey, isConnected, isConnecting, isSigning, connect, disconnect, signAndSendTransaction, error, wallet } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$lazorkit$2f$wallet$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useWallet"])();
    const [recipientAddress, setRecipientAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [amount, setAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('0.01');
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [txStatus, setTxStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (wallet) {
            if (!wallet.passkeyPubkey || wallet.passkeyPubkey.length === 0) {
                setTxStatus('Error: Wallet data corrupted. Please disconnect and reconnect your wallet.');
                return;
            }
            if (wallet.passkeyPubkey.length !== 33) {
                setTxStatus('Error: Invalid wallet data. Please disconnect and reconnect your wallet.');
                return;
            }
            const storedCredId = localStorage.getItem('CREDENTIAL_ID');
            if (wallet.credentialId && !storedCredId) {
                localStorage.setItem('CREDENTIAL_ID', wallet.credentialId);
            }
            setTxStatus('');
        }
    }, [
        wallet,
        isConnected
    ]);
    const handleConnect = async ()=>{
        try {
            await connect();
        } catch (err) {
            setTxStatus('Connection failed. Please try again.');
        }
    };
    const handleCopyAddress = async ()=>{
        if (smartWalletPubkey) {
            try {
                await navigator.clipboard.writeText(smartWalletPubkey.toString());
                setCopied(true);
                setTimeout(()=>setCopied(false), 2000);
            } catch (err) {
                setTxStatus('Failed to copy address');
            }
        }
    };
    const handleSend = async (e)=>{
        e.preventDefault();
        if (!smartWalletPubkey || !recipientAddress || !amount) return;
        if (!wallet || !wallet.passkeyPubkey || wallet.passkeyPubkey.length !== 33) {
            setTxStatus('Error: Invalid wallet state. Please disconnect and reconnect your wallet.');
            return;
        }
        setTxStatus('');
        try {
            let recipientPubkey;
            try {
                recipientPubkey = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"](recipientAddress);
            } catch (err) {
                setTxStatus('Error: Invalid recipient address');
                return;
            }
            const transferInstruction = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SystemProgram"].transfer({
                fromPubkey: smartWalletPubkey,
                toPubkey: recipientPubkey,
                lamports: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LAMPORTS_PER_SOL"] * parseFloat(amount)
            });
            const sig = await signAndSendTransaction({
                instructions: [
                    transferInstruction
                ],
                transactionOptions: {
                    computeUnitLimit: 200_000
                }
            });
            setTxStatus(`Success! Transaction: ${sig}`);
            setRecipientAddress('');
            setAmount('0.01');
            setTimeout(()=>setTxStatus(''), 5000);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error';
            setTxStatus(`Error: ${errorMsg}`);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-900 text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex items-center justify-between p-4 bg-gray-800",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xl font-bold",
                        children: "LazorKit Scaffold"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: !isConnected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleConnect,
                            disabled: isConnecting,
                            className: "px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-500",
                            children: isConnecting ? 'Connecting...' : 'Connect Wallet'
                        }, void 0, false, {
                            fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                            lineNumber: 104,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm",
                                            children: [
                                                smartWalletPubkey?.toString().slice(0, 4),
                                                "...",
                                                smartWalletPubkey?.toString().slice(-4)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                            lineNumber: 110,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleCopyAddress,
                                            className: "px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600",
                                            title: "Copy full address",
                                            children: copied ? '✓ Copied' : 'Copy'
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                            lineNumber: 111,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                    lineNumber: 109,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: disconnect,
                                    className: "px-4 py-2 bg-red-600 rounded hover:bg-red-700",
                                    children: "Disconnect"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                    lineNumber: 119,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                            lineNumber: 108,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "p-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid md:grid-cols-2 gap-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "https://docs.lazorkit.com/",
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "block p-6 bg-gray-800 rounded-lg hover:bg-gray-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-bold mb-2",
                                        children: "Docs"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                        lineNumber: 128,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Explore the LazorKit documentation to get started."
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                        lineNumber: 129,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "https://github.com/lazor-kit",
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "block p-6 bg-gray-800 rounded-lg hover:bg-gray-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-bold mb-2",
                                        children: "GitHub"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                        lineNumber: 132,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Contribute and see the source code on our GitHub."
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                        lineNumber: 133,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                lineNumber: 131,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this),
                    isConnected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8 max-w-md mx-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gray-800 p-6 rounded-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-2xl font-bold mb-4",
                                    children: "Send SOL"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                    lineNumber: 140,
                                    columnNumber: 15
                                }, this),
                                wallet && (!wallet.passkeyPubkey || wallet.passkeyPubkey.length !== 33) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-4 p-3 bg-red-900/50 border border-red-700 rounded",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-red-200 text-sm font-medium",
                                            children: "⚠️ Wallet data is corrupted"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                            lineNumber: 144,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-red-300 text-xs mt-1",
                                            children: "Please disconnect and reconnect your wallet to fix this issue."
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                            lineNumber: 145,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                    lineNumber: 143,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: handleSend,
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "recipient",
                                                    className: "block text-sm font-medium mb-2",
                                                    children: "Recipient Address"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                                    lineNumber: 151,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    id: "recipient",
                                                    type: "text",
                                                    value: recipientAddress,
                                                    onChange: (e)=>setRecipientAddress(e.target.value),
                                                    placeholder: "Enter Solana address",
                                                    className: "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-white",
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                                    lineNumber: 154,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                            lineNumber: 150,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "amount",
                                                    className: "block text-sm font-medium mb-2",
                                                    children: "Amount (SOL)"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                                    lineNumber: 165,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    id: "amount",
                                                    type: "number",
                                                    step: "0.001",
                                                    min: "0.001",
                                                    value: amount,
                                                    onChange: (e)=>setAmount(e.target.value),
                                                    placeholder: "0.01",
                                                    className: "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-white",
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                                    lineNumber: 168,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                            lineNumber: 164,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            disabled: isSigning || !recipientAddress || !amount,
                                            className: "w-full px-6 py-3 bg-green-600 rounded hover:bg-green-700 disabled:bg-gray-500 font-medium",
                                            children: isSigning ? 'Sending...' : 'Send SOL'
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                            lineNumber: 180,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                    lineNumber: 149,
                                    columnNumber: 15
                                }, this),
                                txStatus && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `mt-4 p-3 rounded ${txStatus.startsWith('Success') ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm break-all",
                                        children: txStatus
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                        lineNumber: 191,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                                    lineNumber: 190,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                            lineNumber: 139,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                        lineNumber: 138,
                        columnNumber: 11
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$lazorkit$2f$templates$2f$lazorkit$2f$lazorkit$2d$starter$2d$next$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 text-center text-red-500",
                        children: [
                            "Error: ",
                            error.message
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                        lineNumber: 198,
                        columnNumber: 19
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/lazorkit/templates/lazorkit/lazorkit-starter-next/app/page.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=Desktop_lazorkit_templates_lazorkit_lazorkit-starter-next_app_page_tsx_da5cb97e._.js.map