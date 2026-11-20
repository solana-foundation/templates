use anchor_lang::prelude::*;

#[constant]
pub const CONTRIBUTOR_SEED: &[u8] = b"contributor";

#[constant]
pub const POT_SEED: &[u8] = b"pot";

#[constant]
pub const VAULT_SEED: &[u8] = b"vault";

pub const MAX_CONTRIBUTORS: usize = 20;
pub const MAX_DESCRIPTION_LENGTH: usize = 200;
pub const MAX_NAME_LENGTH: usize = 32;

pub const SECONDS_PER_DAY: i64 = 86_400;
