use anchor_lang::prelude::*;

#[constant]
pub const CONFIG_SEED: &[u8] = b"config";

#[constant]
pub const CODE_SEED: &[u8] = b"code";

const _: () = assert!(secret_code_verifier::NUM_PUBLIC_INPUTS == interface::PublicInputs::COUNT);
