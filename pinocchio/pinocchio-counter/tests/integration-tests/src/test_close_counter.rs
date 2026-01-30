use crate::{
    fixtures::{CloseCounterFixture, CreateCounterFixture, IncrementFixture},
    utils::{
        assert_instruction_error, find_counter_pda, test_missing_signer, test_not_writable,
        test_wrong_account, test_wrong_current_program, InstructionTestFixture, TestContext,
        RANDOM_ADDRESS,
    },
};
use solana_sdk::{instruction::InstructionError, signature::Signer};

// ============================================================================
// Error Tests - Using Generic Test Helpers
// ============================================================================

#[test]
fn test_close_counter_missing_authority_signer() {
    let mut ctx = TestContext::new();
    test_missing_signer::<CloseCounterFixture>(&mut ctx, 0, 0);
}

#[test]
fn test_close_counter_counter_not_writable() {
    let mut ctx = TestContext::new();
    test_not_writable::<CloseCounterFixture>(&mut ctx, 1);
}

#[test]
fn test_close_counter_destination_not_writable() {
    let mut ctx = TestContext::new();
    test_not_writable::<CloseCounterFixture>(&mut ctx, 2);
}

#[test]
fn test_close_counter_wrong_current_program() {
    let mut ctx = TestContext::new();
    test_wrong_current_program::<CloseCounterFixture>(&mut ctx);
}

#[test]
fn test_close_counter_invalid_event_authority() {
    let mut ctx = TestContext::new();
    // event_authority is at index 3 in instruction accounts
    // Custom error 1 = InvalidEventAuthority
    test_wrong_account::<CloseCounterFixture>(&mut ctx, 3, InstructionError::Custom(1));
}

// ============================================================================
// Custom Error Tests
// ============================================================================

#[test]
fn test_close_counter_wrong_authority() {
    let mut ctx = TestContext::new();

    let counter_ix = CreateCounterFixture::build_valid(&mut ctx);
    let authority = counter_ix.signers[0].insecure_clone();
    counter_ix.send_expect_success(&mut ctx);

    let (counter_pda, _) = find_counter_pda(&authority.pubkey());
    let wrong_authority = ctx.create_funded_keypair();
    let destination = ctx.create_funded_keypair().pubkey();

    let test_ix = CloseCounterFixture::build_with_counter(
        &mut ctx,
        counter_pda,
        wrong_authority,
        destination,
    );

    let error = test_ix.send_expect_error(&mut ctx);
    assert_instruction_error(error, InstructionError::Custom(0)); // InvalidAuthority
}

#[test]
fn test_close_counter_counter_not_owned_by_program() {
    let mut ctx = TestContext::new();
    let test_ix = CloseCounterFixture::build_valid(&mut ctx);

    let error = test_ix
        .with_account_at(1, RANDOM_ADDRESS)
        .send_expect_error(&mut ctx);
    assert_instruction_error(error, InstructionError::InvalidAccountOwner);
}

// ============================================================================
// Success Tests
// ============================================================================

#[test]
fn test_close_counter_success() {
    let mut ctx = TestContext::new();

    let counter_ix = CreateCounterFixture::build_valid(&mut ctx);
    let authority = counter_ix.signers[0].insecure_clone();
    counter_ix.send_expect_success(&mut ctx);

    let (counter_pda, _) = find_counter_pda(&authority.pubkey());

    // Get initial balances
    let destination = ctx.create_funded_keypair().pubkey();
    let counter_lamports_before = ctx.get_account(&counter_pda).unwrap().lamports;
    let destination_lamports_before = ctx.get_account(&destination).unwrap().lamports;

    // Close the counter
    let close_ix = CloseCounterFixture::build_with_counter(
        &mut ctx,
        counter_pda,
        authority.insecure_clone(),
        destination,
    );
    close_ix.send_expect_success(&mut ctx);

    // Verify counter account is closed (no longer exists or has 0 lamports)
    let counter_account = ctx.get_account(&counter_pda);
    assert!(
        counter_account.is_none() || counter_account.unwrap().lamports == 0,
        "Counter account should be closed"
    );

    // Verify destination received the lamports
    let destination_lamports_after = ctx.get_account(&destination).unwrap().lamports;
    assert_eq!(
        destination_lamports_after,
        destination_lamports_before + counter_lamports_before,
        "Destination should receive counter's lamports"
    );
}

#[test]
fn test_close_counter_after_increments() {
    let mut ctx = TestContext::new();

    let counter_ix = CreateCounterFixture::build_valid(&mut ctx);
    let authority = counter_ix.signers[0].insecure_clone();
    counter_ix.send_expect_success(&mut ctx);

    let (counter_pda, _) = find_counter_pda(&authority.pubkey());

    // Increment the counter a few times
    for _ in 0..3 {
        ctx.warp_to_next_slot();
        let increment_ix =
            IncrementFixture::build_with_counter(&mut ctx, counter_pda, authority.insecure_clone());
        increment_ix.send_expect_success(&mut ctx);
    }

    // Now close the counter
    let destination = ctx.create_funded_keypair().pubkey();
    let close_ix = CloseCounterFixture::build_with_counter(
        &mut ctx,
        counter_pda,
        authority.insecure_clone(),
        destination,
    );
    close_ix.send_expect_success(&mut ctx);

    // Verify counter account is closed
    let counter_account = ctx.get_account(&counter_pda);
    assert!(
        counter_account.is_none() || counter_account.unwrap().lamports == 0,
        "Counter account should be closed"
    );
}

#[test]
fn test_close_counter_destination_can_be_authority() {
    let mut ctx = TestContext::new();

    let counter_ix = CreateCounterFixture::build_valid(&mut ctx);
    let authority = counter_ix.signers[0].insecure_clone();
    counter_ix.send_expect_success(&mut ctx);

    let (counter_pda, _) = find_counter_pda(&authority.pubkey());

    // Use authority as destination (reclaim rent to self)
    let authority_lamports_before = ctx.get_account(&authority.pubkey()).unwrap().lamports;

    let close_ix = CloseCounterFixture::build_with_counter(
        &mut ctx,
        counter_pda,
        authority.insecure_clone(),
        authority.pubkey(),
    );
    close_ix.send_expect_success(&mut ctx);

    // Verify authority received the lamports (minus tx fee)
    let authority_lamports_after = ctx.get_account(&authority.pubkey()).unwrap().lamports;
    assert!(
        authority_lamports_after > authority_lamports_before,
        "Authority should have more lamports after closing (received rent minus tx fee)"
    );
}

#[test]
fn test_close_counter_cannot_close_twice() {
    let mut ctx = TestContext::new();

    let counter_ix = CreateCounterFixture::build_valid(&mut ctx);
    let authority = counter_ix.signers[0].insecure_clone();
    counter_ix.send_expect_success(&mut ctx);

    let (counter_pda, _) = find_counter_pda(&authority.pubkey());
    let destination = ctx.create_funded_keypair().pubkey();

    // Close the counter first time
    let close_ix = CloseCounterFixture::build_with_counter(
        &mut ctx,
        counter_pda,
        authority.insecure_clone(),
        destination,
    );
    close_ix.send_expect_success(&mut ctx);

    // Try to close again - should fail
    ctx.warp_to_next_slot();
    let close_ix2 = CloseCounterFixture::build_with_counter(
        &mut ctx,
        counter_pda,
        authority.insecure_clone(),
        destination,
    );
    let error = close_ix2.send_expect_error(&mut ctx);
    // Account is now closed/zeroed, so it should fail with InvalidAccountOwner
    // (account is no longer owned by the program)
    assert_instruction_error(error, InstructionError::InvalidAccountOwner);
}
