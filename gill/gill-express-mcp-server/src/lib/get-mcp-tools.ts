import z from "zod";

import { generateExtractableKeyPairSigner, extractBytesFromKeyPairSigner } from "gill";

export interface ToolDefinition {
    name: string;
    config: {
        title: string;
        description: string;
        inputSchema: Record<string, z.ZodTypeAny>;
    }
    callback: (args: any) => Promise<{ content: Array<{ type: string; data?: string, mimeType?: string, text?: string }> }>;
}

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
                    console.error(`Failed to generate keypair: ${err}`);
                    throw new Error(`Failed to generate keypair: ${(err as Error)?.message ?? err}`);
                }
            }
        },
    ];

    return tools;
}