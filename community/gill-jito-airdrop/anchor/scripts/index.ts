#!/usr/bin/env ts-node

import { SolanaDeploymentSetup } from "./deploy-setup";
import { initializeAirdrop } from "../lib/airdrop-initializer";

/**
 * Command-line interface for airdrop scripts
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "setup":
      console.log("🚀 Running deployment setup...\n");
      const setup = new SolanaDeploymentSetup();
      await setup.run();
      break;

    case "fix-program-id":
    case "fix":
      console.log("🔧 Fixing program ID issues...\n");
      const fixSetup = new SolanaDeploymentSetup();
      await fixSetup.fixProgramIdMismatch();
      break;

    case "initialize":
    case "init":
      console.log("🎯 Initializing airdrop...\n");
      const recipientsFile = args[1] || "recipients.json";
      const result = await initializeAirdrop(recipientsFile);
      
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
      break;

    case "help":
    case "--help":
    case "-h":
    default:
      console.log("🎯 Airdrop Scripts CLI\n");
      console.log("Available commands:");
      console.log("  setup                   - Interactive deployment setup");
      console.log("  initialize [file]       - Initialize airdrop (default: recipients.json)");
      console.log("  fix-program-id          - Fix program ID consistency issues");
      console.log("  help                    - Show this help message");
      console.log("\nExamples:");
      console.log("  npx ts-node scripts/index.ts setup");
      console.log("  npx ts-node scripts/index.ts initialize");
      console.log("  npx ts-node scripts/index.ts initialize custom-recipients.json");
      console.log("  npx ts-node scripts/index.ts fix-program-id");
      
      if (command && command !== "help" && command !== "--help" && command !== "-h") {
        console.log(`\n❌ Unknown command: ${command}`);
        process.exit(1);
      }
      break;
  }
}

main().catch((error) => {
  console.error("💥 Script failed:", error);
  process.exit(1);
}); 