use anchor_lang::prelude::*;
use mpl_core::{instructions::CreateCollectionV2CpiBuilder, ID as CORE_PROGRAM_ID};

use crate::{errors::StakeError, state::CollectionInfo};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateCollectionArgs {
    pub name: String,
    pub uri: String,
    pub nft_name: String,
    pub nft_uri: String,
}

#[derive(Accounts)]
pub struct CreateCollection<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        constraint = collection.data_is_empty() @ StakeError::CollectionAlreadyInitialized
    )]
    pub collection: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + CollectionInfo::INIT_SPACE,
        seeds = [b"collection_info", collection.key().as_ref()],
        bump
    )]
    pub collection_info: Account<'info, CollectionInfo>,

    #[account(address = CORE_PROGRAM_ID)]
    /// CHECK: Verified by address constraint
    pub core_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> CreateCollection<'info> {
    pub fn create_collection(
        &mut self,
        args: Box<CreateCollectionArgs>,
        bumps: &CreateCollectionBumps,
    ) -> Result<()> {
        self.collection_info.set_inner(CollectionInfo {
            collection: self.collection.key(),
            authority: self.authority.key(),
            name: args.name.clone(),
            uri: args.uri.clone(),
            nft_name: args.nft_name,
            nft_uri: args.nft_uri,
            bump: bumps.collection_info,
        });

        let signer_seeds: &[&[&[u8]]] = &[&[
            b"collection_info",
            &self.collection.key().to_bytes(),
            &[bumps.collection_info],
        ]];

        CreateCollectionV2CpiBuilder::new(&self.core_program.to_account_info())
            .collection(&self.collection.to_account_info())
            .payer(&self.authority.to_account_info())
            .update_authority(Some(&self.collection_info.to_account_info()))
            .system_program(&self.system_program.to_account_info())
            .name(args.name)
            .uri(args.uri)
            .plugins(vec![])
            .external_plugin_adapters(vec![])
            .invoke_signed(signer_seeds)?;

        Ok(())
    }
}
