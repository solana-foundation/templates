use anchor_lang::prelude::*;
use mpl_core::{
    instructions::CreateV2CpiBuilder,
    types::{Attribute, Attributes, Plugin, PluginAuthorityPair},
    ID as CORE_PROGRAM_ID,
};

use crate::{errors::StakeError, state::CollectionInfo};

#[derive(Accounts)]
pub struct MintNft<'info> {
    #[account(mut)]
    pub minter: Signer<'info>,

    #[account(
        mut,
        constraint = asset.data_is_empty() @ StakeError::AssetAlreadyInitialized
    )]
    pub asset: Signer<'info>,

    #[account(
        mut,
        constraint = collection.owner == &CORE_PROGRAM_ID @ StakeError::InvalidCollection,
        constraint = !collection.data_is_empty() @ StakeError::CollectionNotInitialized
    )]
    /// CHECK: Verified by mpl-core
    pub collection: UncheckedAccount<'info>,

    #[account(
        seeds = [b"collection_info", collection.key().as_ref()],
        bump = collection_info.bump,
    )]
    pub collection_info: Account<'info, CollectionInfo>,

    #[account(address = CORE_PROGRAM_ID)]
    /// CHECK: Verified by address constraint
    pub core_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> MintNft<'info> {
    pub fn mint_nft(&mut self) -> Result<()> {
        let signer_seeds: &[&[&[u8]]] = &[&[
            b"collection_info",
            &self.collection.key().to_bytes(),
            &[self.collection_info.bump],
        ]];

        CreateV2CpiBuilder::new(&self.core_program.to_account_info())
            .asset(&self.asset.to_account_info())
            .collection(Some(&self.collection.to_account_info()))
            .authority(Some(&self.collection_info.to_account_info()))
            .payer(&self.minter.to_account_info())
            .owner(Some(&self.minter.to_account_info()))
            .update_authority(None)
            .system_program(&self.system_program.to_account_info())
            .name(self.collection_info.nft_name.clone())
            .uri(self.collection_info.nft_uri.clone())
            .plugins(vec![PluginAuthorityPair {
                plugin: Plugin::Attributes(Attributes {
                    attribute_list: vec![
                        Attribute {
                            key: "Minter".to_string(),
                            value: self.minter.key().to_string(),
                        },
                        Attribute {
                            key: "Timestamp".to_string(),
                            value: Clock::get()?.unix_timestamp.to_string(),
                        },
                    ],
                }),
                authority: None,
            }])
            .external_plugin_adapters(vec![])
            .invoke_signed(signer_seeds)?;

        Ok(())
    }
}
