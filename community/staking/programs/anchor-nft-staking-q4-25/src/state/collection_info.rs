use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct CollectionInfo {
    pub collection: Pubkey,
    pub authority: Pubkey,
    #[max_len(32)]
    pub name: String,
    #[max_len(200)]
    pub uri: String,
    #[max_len(32)]
    pub nft_name: String,
    #[max_len(200)]
    pub nft_uri: String,
    pub bump: u8,
}
