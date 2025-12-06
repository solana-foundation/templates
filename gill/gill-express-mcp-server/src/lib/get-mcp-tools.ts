import { z } from "zod";
import {
    generateExtractableKeyPairSigner,
    extractBytesFromKeyPairSigner,
    address,
    lamportsToSol,
    createSignableMessage,
    getBase58Decoder,
} from "gill";
import { getMcpContext } from "./get-mcp-context.js";

export interface ToolDefinition {
    name: string;
    config: {
        title: string;
        description: string;
        inputSchema: Record<string, z.ZodTypeAny>;
    }
    callback: (args: any) => Promise<{ content: Array<{ type: string; data?: string, mimeType?: string, text?: string }> }>;
}

const context = await getMcpContext()

export function getMcpTools(): ToolDefinition[] {
    const tools: ToolDefinition[] = [
        {
            name: "create_keypair",
            config: {
                title: "Create Keypair",
                description: "Generate a new Solana keypair",
                inputSchema: {},
            },
            callback: async () => {
                try {
                    const keypair = await generateExtractableKeyPairSigner();
                    const keypairBytes = await extractBytesFromKeyPairSigner(keypair);

                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(
                                    {
                                        keypair: keypairBytes,
                                        publicKey: keypair.address,
                                    },
                                    null,
                                    2
                                ),
                            },
                        ],
                    };
                } catch (err) {
                    context.log.error(`Failed to generate keypair: ${err}`);
                    throw new Error(`Failed to generate keypair: ${(err as Error)?.message ?? err}`);
                }
            }
        },
        {
            name: "get_sol_balance",
            config: {
                title: "Get SOL Balance",
                description: "Retrieve the SOL balance for a given public key",
                inputSchema: {
                    publicKey: z.string().describe("The Solana public key (base58 address) to check balance for"),
                },
            },
            callback: async (args: { publicKey: string }) => {

                const publicKey = args.publicKey;

                try {
                    const lamportsResult = await context.client.rpc.getBalance(address(publicKey)).send();
                    const lamportsValue = lamportsResult.value

                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(
                                    {
                                        lamports: lamportsValue.toString(),
                                        uiBalance: lamportsToSol(lamportsValue)
                                    },
                                    null,
                                    2
                                ),
                            },
                        ],
                    };
                } catch (err) {
                    context.log.error(`Failed to retrieve balance: ${err}`);
                    throw new Error(`Failed to retrieve balance: ${(err as Error)?.message ?? err}`);
                }
            }
        },
        {
            name: "get_slot",
            config: {
                title: "Get Current Slot",
                description: "Retrieve the current slot number from the Solana blockchain",
                inputSchema: {},
            },
            callback: async () => {
                try {
                    const slotResult = await context.client.rpc.getSlot().send();
                    const slot = slotResult.toString();

                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(
                                    {
                                        slot
                                    },
                                    null,
                                    2
                                ),
                            },
                        ],
                    };
                } catch (err) {
                    context.log.error(`Failed to retrieve current slot: ${err}`);
                    throw new Error(`Failed to retrieve current slot: ${(err as Error)?.message ?? err}`);
                }
            }
        },
        {
            name: "get_latest_blockhash",
            config: {
                title: "Get Latest Blockhash",
                description: "Retrieve the latest blockhash from the Solana blockchain",
                inputSchema: {},
            },
            callback: async () => {
                try {
                    const blockhashResult = await context.client.rpc.getLatestBlockhash().send();

                    const blockhash = blockhashResult.value.blockhash.toString();
                    const blockHeight = blockhashResult.value.lastValidBlockHeight.toString();

                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(
                                    {
                                        blockhash,
                                        blockHeight
                                    },
                                    null,
                                    2
                                ),
                            },
                        ],
                    };
                } catch (err) {
                    context.log.error(`Failed to retrieve latest blockhash: ${err}`);
                    throw new Error(`Failed to retrieve latest blockhash: ${(err as Error)?.message ?? err}`);
                }
            }
        },
        {
            name: "sign_message",
            config: {
                title: "Sign Message",
                description: "Sign a message using the server's private key",
                inputSchema: {
                    message: z.string().describe("The message to be signed"),
                },
            },
            callback: async (args: { message: string }) => {
                const message = args.message;

                try {
                    const signableMessage = createSignableMessage(message);
                    const signedMessages = await context.signer.signMessages([signableMessage]);
                    const signedMessage = signedMessages[0];

                    if (!signedMessage) {
                        throw new Error('No signed message returned');
                    }

                    const signatureBytes = signedMessage[context.signer.address];

                    if (!signatureBytes) {
                        throw new Error('Signature not found in signed message');
                    }

                    const base58Decoder = getBase58Decoder();
                    const signatureBase58 = base58Decoder.decode(signatureBytes);

                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(
                                    {
                                        message,
                                        signature: signatureBase58,
                                        publicKey: context.signer.address,
                                    },
                                    null,
                                    2
                                ),
                            },
                        ],
                    };
                } catch (err) {
                    context.log.error(`Failed to sign message: ${err}`);
                    throw new Error(`Failed to sign message: ${(err as Error)?.message ?? err}`);
                }
            }
        },
        {
            name: "get_signer_sol_balance",
            config: {
                title: "Get Signer SOL Balance",
                description: "Retrieve the SOL balance for the server's signer public key",
                inputSchema: {},
            },
            callback: async () => {
                try {
                    const signerAddress = context.signer.address;
                    const lamportsResult = await context.client.rpc.getBalance(address(signerAddress)).send();
                    const lamportsValue = lamportsResult.value

                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(
                                    {
                                        lamports: lamportsValue.toString(),
                                        uiBalance: lamportsToSol(lamportsValue),
                                        signerAddress: signerAddress
                                    },
                                    null,
                                    2
                                ),
                            },
                        ],
                    };
                } catch (err) {
                    context.log.error(`Failed to retrieve signer balance: ${err}`);
                    throw new Error(`Failed to retrieve signer balance: ${(err as Error)?.message ?? err}`);
                }
            }
        },
        {
            name: "get_signer_address",
            config: {
                title: "Get Signer Address",
                description: "Retrieve the public address of the server's signer",
                inputSchema: {},
            },
            callback: async () => {
                try {
                    const signerAddress = context.signer.address;

                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(
                                    {
                                        signerAddress
                                    },
                                    null,
                                    2
                                ),
                            },
                        ],
                    };
                } catch (err) {
                    context.log.error(`Failed to retrieve signer address: ${err}`);
                    throw new Error(`Failed to retrieve signer address: ${(err as Error)?.message ?? err}`);
                }
            }
        }
    ];

    return tools;
}