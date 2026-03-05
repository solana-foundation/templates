use anchor_lang::error_code;

#[error_code]
pub enum StakeError {
    #[msg("Max Stake Reached")]
    MaxStakeReached,
    #[msg("Freeze Time Not Passed")]
    FreezePeriodNotPassed,
    #[msg("Invalid Asset")]
    InvalidAsset,
    #[msg("Asset Not Initialized")]
    AssetNotInitialized,
    #[msg("Invalid Collection")]
    InvalidCollection,
    #[msg("Collection Not Initialized")]
    CollectionNotInitialized,
    #[msg("Collection Already Initialized")]
    CollectionAlreadyInitialized,
    #[msg("Asset Already Initialized")]
    AssetAlreadyInitialized,
    #[msg("Not Owner")]
    NotOwner,
}
