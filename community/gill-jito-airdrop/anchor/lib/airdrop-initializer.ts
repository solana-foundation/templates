import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Connection, Keypair } from "@solana/web3.js";
import * as fs from "fs";
import { BuildCoordinator } from "./build-coordinator";
import { FileManager } from "./file-manager";
import type { InitializationResult, RecipientsFile } from "./types";
// Note: SolanaDistributor type will be loaded dynamically if needed

/**
 * Handles airdrop initialization with minimal redundant operations
 */
export class AirdropInitializer {
  private buildCoordinator: BuildCoordinator;
  private fileManager: FileManager;

  constructor(
    private providerUrl: string = "https://api.devnet.solana.com",
    private walletPath: string = "./deploy-wallet.json",
    workingDir: string = "anchor"
  ) {
    this.buildCoordinator = new BuildCoordinator(workingDir);
    this.fileManager = new FileManager(workingDir);
  }

  /**
   * Check if there are any issues that need fixing before initialization
   */
  private async checkPreRequisites(): Promise<{ needsBuild: boolean; issues: string[] }> {
    const issues: string[] = [];
    let needsBuild = false;

    // Check if program is built
    const status = this.buildCoordinator.getProgramStatus();
    if (!status.built) {
      issues.push("Program not built");
      needsBuild = true;
    }

    // Check if types exist
    const typesPath = "target/types/solana_distributor.ts";
    if (!fs.existsSync(typesPath)) {
      issues.push("TypeScript types missing");
      needsBuild = true;
    }

    // Check if IDL exists
    const idlPath = "target/idl/solana_distributor.json";
    if (!fs.existsSync(idlPath)) {
      issues.push("IDL file missing");
      needsBuild = true;
    }

    // Check program ID consistency
    if (!status.consistent) {
      issues.push("Program ID inconsistency detected");
      needsBuild = true;
    }

    return { needsBuild, issues };
  }

  /**
   * Fix common issues with minimal rebuilds
   */
  private async fixIssues(): Promise<boolean> {
    try {
      console.log("🔧 Checking and fixing common issues...");
      
      const { needsBuild, issues } = await this.checkPreRequisites();
      
      if (issues.length === 0) {
        console.log("✅ No issues detected");
        return true;
      }

      console.log(`⚠️  Found issues: ${issues.join(", ")}`);

      if (needsBuild) {
        // Ensure program ID consistency first
        const consistencyFixed = await this.buildCoordinator.ensureProgramIdConsistency();
        if (!consistencyFixed) {
          console.error("❌ Failed to fix program ID consistency");
          return false;
        }

        // Single build to fix all issues
        const buildResult = await this.buildCoordinator.buildIfNeeded(true);
        if (!buildResult.success) {
          console.error("❌ Build failed during issue fixing");
          return false;
        }

        // Generate TypeScript types if still missing
        const typesPath = "target/types/solana_distributor.ts";
        if (!fs.existsSync(typesPath)) {
          console.log("📝 Generating TypeScript types...");
          try {
            const { execSync } = await import("child_process");
            execSync("anchor idl type target/idl/solana_distributor.json -o target/types/solana_distributor.ts", { 
              stdio: "inherit",
              cwd: this.buildCoordinator['workingDir']
            });
            console.log("✅ TypeScript types generated");
          } catch (error) {
            console.error("⚠️  Failed to generate TypeScript types:", error);
            // Continue anyway, this is not critical for initialization
          }
        }
      }

      console.log("✅ Issues fixed successfully!");
      return true;
    } catch (error) {
      console.error("❌ Error fixing issues:", error);
      return false;
    }
  }

  /**
   * Initialize the airdrop with proper error handling and minimal rebuilds
   */
  async initializeAirdrop(recipientsFile?: string): Promise<InitializationResult> {
    try {
      console.log("🚀 Initializing airdrop...\n");

      // Step 1: Check and fix any issues
      const issuesFixed = await this.fixIssues();
      if (!issuesFixed) {
        return {
          success: false,
          error: "Failed to fix pre-requisite issues"
        };
      }



      // Step 2: Load recipients data
      const recipientsPath = recipientsFile || "recipients.json";
      let recipientsData: RecipientsFile;
      
      try {
        recipientsData = this.fileManager.loadRecipientsFile(recipientsPath);
      } catch (error) {
        return {
          success: false,
          error: `Failed to load recipients file: ${error}`
        };
      }

      console.log(`📋 Loaded ${recipientsData.recipients.length} recipients`);
      console.log(`💰 Total amount: ${parseInt(recipientsData.totalAmount) / 1e9} SOL`);
      console.log(`🌳 Merkle root: ${recipientsData.merkleRoot}`);

      // Step 3: Set up Anchor provider
      console.log("📡 Setting up provider...");
      const connection = new Connection(this.providerUrl);
      
      // Load wallet keypair
      const walletKeypair = Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(fs.readFileSync(this.walletPath, 'utf8')))
      );
      const wallet = new anchor.Wallet(walletKeypair);
      
      const provider = new anchor.AnchorProvider(connection, wallet, {
        commitment: 'confirmed',
        skipPreflight: false,
        preflightCommitment: 'confirmed'
      });
      
      anchor.setProvider(provider);

      // Load the program with proper typing
      let program: Program;
      try {
        program = anchor.workspace.SolanaDistributor as Program;
        
        if (!program) {
          throw new Error("Program not found in workspace");
        }
      } catch (error) {
        return {
          success: false,
          error: `Failed to load program: ${error}`
        };
      }

      console.log(`📍 Program ID: ${program.programId.toString()}`);
      console.log(`👤 Authority: ${provider.wallet.publicKey.toString()}`);

      // Step 4: Verify program exists on-chain
      console.log("🔍 Verifying program exists on-chain...");
      try {
        const programInfo = await provider.connection.getAccountInfo(program.programId);
        if (!programInfo) {
          return {
            success: false,
            error: "Program account not found on-chain. Please deploy the program first."
          };
        }
        console.log("✅ Program verified on-chain");
      } catch (error) {
        return {
          success: false,
          error: `Program verification failed: ${error}`
        };
      }

      // Step 5: Calculate airdrop state PDA
      const [airdropStatePda] = PublicKey.findProgramAddressSync(
        [Buffer.from("merkle_tree")],
        program.programId
      );
      console.log(`🏛️  Airdrop state PDA: ${airdropStatePda.toString()}`);

      // Step 6: Check if already initialized
      try {
        const existingState = await program.account['airdropState'].fetch(airdropStatePda);
        console.log("⚠️  Airdrop already initialized:");
        console.log(`   Root: 0x${Buffer.from(existingState.merkleRoot).toString("hex")}`);
        console.log(`   Amount: ${existingState.airdropAmount.toNumber() / 1e9} SOL`);
        console.log(`   Claimed: ${existingState.amountClaimed.toNumber() / 1e9} SOL`);
        
        return {
          success: true,
          airdropStatePda: airdropStatePda.toString(),
          alreadyInitialized: true
        };
      } catch {
        // Not initialized yet, continue
        console.log("✅ Airdrop not yet initialized, proceeding...");
      }

      // Step 7: Initialize the airdrop
      const merkleRootHex = recipientsData.merkleRoot.replace("0x", "");
      const merkleRootBytes = Buffer.from(merkleRootHex, "hex");
      const totalAmount = new anchor.BN(recipientsData.totalAmount);

      console.log("📤 Sending initialize transaction...");
      
      let signature: string;
      try {
        signature = await program.methods
          .initializeAirdrop(Array.from(merkleRootBytes), totalAmount)
          .accounts({
            authority: provider.wallet.publicKey,
          })
          .rpc();

        console.log("✅ Transaction sent successfully!");
        console.log(`📋 Transaction signature: ${signature}`);
        console.log(`🔍 View on explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      } catch (error) {
        // Check if this is a DeclaredProgramIdMismatch error
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("DeclaredProgramIdMismatch")) {
          console.log("⚠️  Program ID mismatch detected, attempting fresh deployment...");
          
          try {
            // Deploy fresh program
            const deployResult = await this.buildCoordinator.deployProgram();
            if (!deployResult.success) {
              return {
                success: false,
                error: `Fresh deployment failed: ${deployResult.error}`
              };
            }
            
            console.log("✅ Fresh deployment completed, retrying initialization...");
            
            // Retry the transaction
            signature = await program.methods
              .initializeAirdrop(Array.from(merkleRootBytes), totalAmount)
              .accounts({
                authority: provider.wallet.publicKey,
              })
              .rpc();

            console.log("✅ Transaction sent successfully after retry!");
            console.log(`📋 Transaction signature: ${signature}`);
            console.log(`🔍 View on explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
          } catch (retryError) {
            return {
              success: false,
              error: `Failed to initialize after fresh deployment: ${retryError}`
            };
          }
        } else {
          return {
            success: false,
            error: `Failed to send initialization transaction: ${error}`
          };
        }
      }

      // Step 8: Wait for confirmation
      console.log("⏳ Waiting for transaction confirmation...");
      try {
        const confirmation = await provider.connection.confirmTransaction(signature, 'confirmed');
        if (confirmation.value.err) {
          return {
            success: false,
            error: `Transaction failed: ${JSON.stringify(confirmation.value.err)}`
          };
        }
        console.log("✅ Transaction confirmed!");
      } catch (error) {
        return {
          success: false,
          error: `Failed to confirm transaction: ${error}`
        };
      }

      // Step 9: Verify initialization (with retry)
      console.log("🔍 Verifying airdrop state...");
      await new Promise(resolve => setTimeout(resolve, 3000));

      let verificationAttempts = 0;
      const maxAttempts = 3;
      
      while (verificationAttempts < maxAttempts) {
        try {
          const airdropState = await program.account['airdropState'].fetch(airdropStatePda);
          console.log("✅ Airdrop initialized and verified successfully!");
          console.log(`   Merkle root: 0x${Buffer.from(airdropState.merkleRoot).toString("hex")}`);
          console.log(`   Total amount: ${airdropState.airdropAmount.toNumber() / 1e9} SOL`);
          
          return {
            success: true,
            airdropStatePda: airdropStatePda.toString(),
            signature,
            alreadyInitialized: false
          };
        } catch {
          verificationAttempts++;
          if (verificationAttempts >= maxAttempts) {
            console.log("⚠️  Verification failed, but initialization likely succeeded");
            console.log("   Check the transaction on the explorer to confirm");
            
            return {
              success: true,
              airdropStatePda: airdropStatePda.toString(),
              signature,
              alreadyInitialized: false,
              verificationFailed: true
            };
          }
          
          console.log(`🔄 Verification attempt ${verificationAttempts} failed, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // This should not be reached, but just in case
      return {
        success: false,
        error: "Unexpected error in verification loop"
      };

    } catch (error) {
      console.error("❌ Airdrop initialization failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

/**
 * Initialize the airdrop using the new simplified architecture
 */
export async function initializeAirdrop(recipientsFile: string = "recipients.json") {
  const initializer = new AirdropInitializer("https://api.devnet.solana.com", "./deploy-wallet.json", ".");
  return await initializer.initializeAirdrop(recipientsFile);
}