import { initializeAirdrop } from "../lib/airdrop-initializer";

// Script execution
async function main() {
  try {
    const result = await initializeAirdrop();
    
    if (!result.success) {
      console.error(`💥 Initialization failed: ${result.error}`);
      process.exit(1);
    }
    
    if (result.alreadyInitialized) {
      console.log("✨ Airdrop was already initialized!");
    } else if (result.verificationFailed) {
      console.log("⚠️  Initialization likely succeeded but verification failed");
      console.log("💡 Check the explorer link above to confirm");
    } else {
      console.log("🎉 Airdrop initialization completed successfully!");
    }
    
    console.log("\n📋 Next steps:");
    console.log("1. Test claiming with the frontend at http://localhost:3000");
    console.log("2. Or use the claim script: npx ts-node scripts/claim-airdrop.ts");
    
    process.exit(0);
  } catch (error) {
    console.error("💥 Initialization failed:", error);
    process.exit(1);
  }
}

main();
