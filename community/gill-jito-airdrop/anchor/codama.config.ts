import { createFromRoot } from 'codama';
import { rootNodeFromAnchor, AnchorIdl } from '@codama/nodes-from-anchor';
import { renderJavaScriptVisitor } from '@codama/renderers';
import { visit } from '@codama/visitors-core';
import anchorIdl from './target/idl/solana_distributor.json';
import path from 'path';

/**
 * Codama Configuration for Solana Distributor Program
 * 
 * This configuration generates TypeScript clients from the Anchor IDL
 * using Codama's code generation capabilities. The generated clients
 * will be compatible with Gill (Solana Kit) instead of @solana/web3.js v1.
 */

async function generateClients() {
  console.log('🚀 Starting Codama client generation...');
  
  try {
    // Convert Anchor IDL to Codama tree
    console.log('📝 Converting Anchor IDL to Codama tree...');
    const codama = createFromRoot(rootNodeFromAnchor(anchorIdl as AnchorIdl));
    
    // Define client generation targets
    const clients = [
      { 
        type: "TypeScript", 
        dir: path.join(__dirname, "generated", "clients", "ts"),
        renderVisitor: renderJavaScriptVisitor 
      }
    ];

    // Generate clients
    for (const client of clients) {
      console.log(`⚡ Generating ${client.type} client in ${client.dir}...`);
      
      await visit(
        codama.getRoot(),
        await client.renderVisitor(client.dir)
      );
      
      console.log(`✅ Successfully generated ${client.type} client!`);
    }
    
    console.log('🎉 All clients generated successfully!');
    console.log('📁 Generated files location: anchor/generated/clients/');
    
  } catch (error) {
    console.error('❌ Error generating clients:', error);
    throw error;
  }
}

// Export the configuration for programmatic use
export const codamaConfig = {
  idl: anchorIdl,
  outputDir: path.join(__dirname, "generated", "clients"),
  generateClients
};

// Run generation if this file is executed directly
if (require.main === module) {
  generateClients().catch(console.error);
}

export default generateClients;