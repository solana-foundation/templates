use crate::{
    fixtures::CreateCounterFixture,
    utils::{
        assert_counter_account, assert_instruction_error, find_event_authority_pda,
        test_empty_data, test_missing_signer, test_not_writable, test_wrong_account,
        test_wrong_current_program, test_wrong_system_program, InstructionTestFixture, TestContext,
    },
};
use pinocchio_counter_client::instructions::CreateCounterBuilder;
use solana_sdk::{instruction::InstructionError, signature::Signer};

// ============================================================================
// Error Tests - Using Generic Test Helpers
// ============================================================================

#[test]
fn test_create_counter_missing_authority_signer() {
    let mut ctx = TestContext::new();
    // authority is at account index 1, signer vec index 0 (payer is handled separately)
    test_missing_signer::<CreateCounterFixture>(&mut ctx, 1, 0);
}

#[test]
fn test_create_counter_counter_not_writable() {
    let mut ctx = TestContext::new();
    // counter is at index 2 in instruction accounts
    test_not_writable::<CreateCounterFixture>(&mut ctx, 2);
}

#[test]
fn test_create_counter_wrong_system_program() {
    let mut ctx = TestContext::new();
    test_wrong_system_program::<CreateCounterFixture>(&mut ctx);
}

#[test]
fn test_create_counter_wrong_current_program() {
    let mut ctx = TestContext::new();
    test_wrong_current_program::<CreateCounterFixture>(&mut ctx);
}

#[test]
fn test_create_counter_invalid_event_authority() {
    let mut ctx = TestContext::new();
    // event_authority is at index 4 in instruction accounts
    // Custom error 1 = InvalidEventAuthority
    test_wrong_account::<CreateCounterFixture>(&mut ctx, 4, InstructionError::Custom(1));
}

#[test]
fn test_create_counter_invalid_bump() {
    let mut ctx = TestContext::new();

    // Build a valid instruction first to get the correct bump
    let valid_ix = CreateCounterFixture::build_valid(&mut ctx);
    let correct_bump = valid_ix.instruction.data[1];

    // Use incorrect bump (correct_bump + 1, wrapping)
    let invalid_bump = correct_bump.wrapping_add(1);

    let error = valid_ix
        .with_data_byte_at(1, invalid_bump)
        .send_expect_error(&mut ctx);

    assert_instruction_error(error, InstructionError::InvalidSeeds);
}

#[test]
fn test_create_counter_empty_data() {
    let mut ctx = TestContext::new();
    test_empty_data::<CreateCounterFixture>(&mut ctx);
}

// ============================================================================
// Happy Path Test
// ============================================================================

#[test]
fn test_create_counter_success() {
    let mut ctx = TestContext::new();
    let test_ix = CreateCounterFixture::build_valid(&mut ctx);

    let authority_pubkey = test_ix.signers[0].pubkey();
    let counter_pda = test_ix.instruction.accounts[2].pubkey;
    let bump = test_ix.instruction.data[1];

    test_ix.send_expect_success(&mut ctx);

    assert_counter_account(&ctx, &counter_pda, &authority_pubkey, bump, 0);
}

// ============================================================================
// Re-initialization Protection Tests
// ============================================================================

#[test]
fn test_create_counter_reinitialization_fails() {
    let mut ctx = TestContext::new();
    let test_ix = CreateCounterFixture::build_valid(&mut ctx);

    let authority = test_ix.signers[0].insecure_clone();
    let counter_pda = test_ix.instruction.accounts[2].pubkey;
    let bump = test_ix.instruction.data[1];

    test_ix.send_expect_success(&mut ctx);

    assert_counter_account(&ctx, &counter_pda, &authority.pubkey(), bump, 0);

    // Try to reinitialize the same counter
    // Warp to next slot to get a new blockhash
    ctx.warp_to_next_slot();

    let (event_authority, _) = find_event_authority_pda();
    let reinit_ix = CreateCounterBuilder::new()
        .payer(ctx.payer.pubkey())
        .authority(authority.pubkey())
        .counter(counter_pda)
        .event_authority(event_authority)
        .bump(bump)
        .instruction();

    let error = ctx.send_transaction_expect_error(reinit_ix, &[&authority]);

    assert_instruction_error(error, InstructionError::AccountAlreadyInitialized);

    // Verify the counter wasn't modified
    assert_counter_account(&ctx, &counter_pda, &authority.pubkey(), bump, 0);
}
