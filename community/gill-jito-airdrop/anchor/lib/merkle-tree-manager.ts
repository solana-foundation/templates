import { PublicKey } from "@solana/web3.js";
import { keccak_256 } from "js-sha3";
import type { Recipient } from "./types";

/**
 * Simple Merkle Tree implementation for airdrop verification
 */
export class SimpleMerkleTree {
  public root: Uint8Array;
  private leaves: Uint8Array[];
  private tree: Uint8Array[][];

  constructor(recipients: Recipient[]) {
    // Create leaves
    this.leaves = recipients.map((r) => this.createLeaf(r.recipient, r.amount));

    // Build tree
    this.tree = [this.leaves];
    let currentLevel = this.leaves;

    while (currentLevel.length > 1) {
      const nextLevel: Uint8Array[] = [];

      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
        const parent = this.hashPair(left, right);
        nextLevel.push(parent);
      }

      this.tree.push(nextLevel);
      currentLevel = nextLevel;
    }

    this.root = currentLevel[0];
  }

  private createLeaf(recipient: PublicKey, amount: number): Uint8Array {
    const data = Buffer.concat([
      recipient.toBuffer(),
      Buffer.from(new Uint8Array(new BigUint64Array([BigInt(amount)]).buffer)),
      Buffer.from([0]), // isClaimed = false
    ]);
    return new Uint8Array(keccak_256.arrayBuffer(data));
  }

  private hashPair(left: Uint8Array, right: Uint8Array): Uint8Array {
    const data = Buffer.concat([Buffer.from(left), Buffer.from(right)]);
    return new Uint8Array(keccak_256.arrayBuffer(data));
  }

  public getProof(leafIndex: number): Uint8Array[] {
    const proof: Uint8Array[] = [];
    let index = leafIndex;

    for (let level = 0; level < this.tree.length - 1; level++) {
      const currentLevel = this.tree[level];
      const siblingIndex = index % 2 === 0 ? index + 1 : index - 1;

      if (siblingIndex < currentLevel.length) {
        proof.push(currentLevel[siblingIndex]);
      }

      index = Math.floor(index / 2);
    }

    return proof;
  }

  public getRootHex(): string {
    return "0x" + Buffer.from(this.root).toString("hex");
  }

  public getLeafCount(): number {
    return this.leaves.length;
  }
}

/**
 * Manages merkle tree operations for airdrop distribution
 */
export class MerkleTreeManager {
  /**
   * Generate merkle tree from recipients data and update recipients file
   */
  static generateMerkleTree(recipientsData: {
    recipients: { publicKey: string; amount: string }[];
  }): { merkleRoot: string; merkleTree: SimpleMerkleTree } {
    try {
      console.log("🌳 Generating Merkle tree...");

      // Convert to format expected by merkle tree
      const recipients: Recipient[] = recipientsData.recipients.map((r) => ({
        recipient: new PublicKey(r.publicKey),
        amount: parseInt(r.amount),
      }));

      // Generate merkle tree
      const merkleTree = new SimpleMerkleTree(recipients);
      const merkleRootHex = merkleTree.getRootHex();

      console.log(`✅ Merkle tree generated!`);
      console.log(`   Leaves: ${merkleTree.getLeafCount()}`);
      console.log(`   Root: ${merkleRootHex}`);

      return {
        merkleRoot: merkleRootHex,
        merkleTree,
      };
    } catch (error) {
      console.error("❌ Error generating merkle tree:", error);
      throw error;
    }
  }

  /**
   * Generate proof for a specific recipient
   */
  static generateProof(
    merkleTree: SimpleMerkleTree,
    recipientIndex: number
  ): {
    proof: string[];
    leaf: string;
  } {
    try {
      const proof = merkleTree.getProof(recipientIndex);
      const proofHex = proof.map((p) => "0x" + Buffer.from(p).toString("hex"));
      
      // Get the leaf for this recipient
      const leaves = (merkleTree as any).leaves as Uint8Array[];
      const leaf = "0x" + Buffer.from(leaves[recipientIndex]).toString("hex");

      return {
        proof: proofHex,
        leaf,
      };
    } catch (error) {
      console.error("❌ Error generating proof:", error);
      throw error;
    }
  }

  /**
   * Verify a proof against the merkle root
   */
  static verifyProof(
    proof: string[],
    leaf: string,
    root: string
  ): boolean {
    try {
      let computedHash = Buffer.from(leaf.replace("0x", ""), "hex");

      for (const proofElement of proof) {
        const proofBuf = Buffer.from(proofElement.replace("0x", ""), "hex");
        
        // Determine the order for hashing
        if (Buffer.compare(computedHash, proofBuf) < 0) {
          computedHash = Buffer.from(
            keccak_256.arrayBuffer(Buffer.concat([computedHash, proofBuf]))
          );
        } else {
          computedHash = Buffer.from(
            keccak_256.arrayBuffer(Buffer.concat([proofBuf, computedHash]))
          );
        }
      }

      const computedRoot = "0x" + computedHash.toString("hex");
      return computedRoot === root;
    } catch (error) {
      console.error("❌ Error verifying proof:", error);
      return false;
    }
  }

  /**
   * Create leaf hash for a recipient (used for proof generation and verification)
   */
  static createLeafHash(
    recipient: PublicKey,
    amount: number,
    isClaimed: boolean = false
  ): string {
    const data = Buffer.concat([
      recipient.toBuffer(),
      Buffer.from(new Uint8Array(new BigUint64Array([BigInt(amount)]).buffer)),
      Buffer.from([isClaimed ? 1 : 0]),
    ]);
    return "0x" + Buffer.from(keccak_256.arrayBuffer(data)).toString("hex");
  }
}