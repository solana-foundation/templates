//! `interface` hardcodes these for the Pinocchio program and the client.

use anchor_lang::{Discriminator, InstructionData};
use interface::{error, ix, seeds, state};
use xark_starter_anchor::{error::ErrorCode, instruction, Code, Config, CODE_SEED, CONFIG_SEED};

#[test]
fn instruction_discriminators_match() {
    assert_eq!(instruction::Initialize::DISCRIMINATOR, ix::INITIALIZE);
    assert_eq!(instruction::Register::DISCRIMINATOR, ix::REGISTER);
    assert_eq!(instruction::Claim::DISCRIMINATOR, ix::CLAIM);
    assert_eq!(instruction::Initialize {}.data(), ix::INITIALIZE);
}

#[test]
fn seeds_match() {
    assert_eq!(CONFIG_SEED, seeds::CONFIG);
    assert_eq!(CODE_SEED, seeds::CODE);
}

#[test]
fn account_discriminators_match() {
    assert_eq!(Config::DISCRIMINATOR, state::CONFIG_DISCRIMINATOR);
    assert_eq!(Code::DISCRIMINATOR, state::CODE_DISCRIMINATOR);
}

#[test]
fn error_codes_match() {
    assert_eq!(
        u32::from(ErrorCode::InvalidPublicInputs),
        error::INVALID_PUBLIC_INPUTS
    );
    assert_eq!(u32::from(ErrorCode::SignerMismatch), error::SIGNER_MISMATCH);
    assert_eq!(u32::from(ErrorCode::AlreadyClaimed), error::ALREADY_CLAIMED);
    assert_eq!(u32::from(ErrorCode::InvalidProof), error::INVALID_PROOF);
}
