use crate::{
    fixtures::{CreateCounterFixture, IncrementFixture},
    utils::{
        assert_counter_account, assert_instruction_error, find_counter_pda, test_missing_signer,
        test_not_writable, test_wrong_account, test_wrong_current_program, InstructionTestFixture,
        TestContext, RANDOM_ADDRESS,
    },
};
use solana_sdk::{instruction::InstructionError, signature::Signer};

// ============================================================================
// Error Tests - Using Generic Test Helpers
// ============================================================================

#[test]
fn test_increment_missing_authority_signer() {
    let mut ctx = TestContext::new();
    test_missing_signer::<IncrementFixture>(&mut ctx, 0, 0);
}

#[test]
fn test_increment_counter_not_writable() {
    let mut ctx = TestContext::new();
    test_not_writable::<IncrementFixture>(&mut ctx, 1);
}

#[test]
fn test_increment_wrong_current_program() {
    let mut ctx = TestContext::new();
    test_wrong_current_program::<IncrementFixture>(&mut ctx);
}

#[test]
fn test_increment_invalid_event_authority() {
    let mut ctx = TestContext::new();
    // event_authority is at index 2 in instruction accounts
    // Custom error 1 = InvalidEventAuthority
    test_wrong_account::<IncrementFixture>(&mut ctx, 2, InstructionError::Custom(1));
}

// ============================================================================
// Custom Error Tests
// ============================================================================

#[test]
fn test_increment_wrong_authority() {
    let mut ctx = TestContext::new();

    let counter_ix = CreateCounterFixture::build_valid(&mut ctx);
    let authority = counter_ix.signers[0].insecure_clone();
    counter_ix.send_expect_success(&mut ctx);

    let (counter_pda, _) = find_counter_pda(&authority.pubkey());
    let wrong_authority = ctx.create_funded_keypair();

    let test_ix = IncrementFixture::build_with_counter(&mut ctx, counter_pda, wrong_authority);

    let error = test_ix.send_expect_error(&mut ctx);
    assert_instruction_error(error, InstructionError::Custom(0)); // InvalidAuthority
}

#[test]
fn test_increment_counter_not_owned_by_program() {
    let mut ctx = TestContext::new();
    let test_ix = IncrementFixture::build_valid(&mut ctx);

    let error = test_ix
        .with_account_at(1, RANDOM_ADDRESS)
        .send_expect_error(&mut ctx);
    assert_instruction_error(error, InstructionError::InvalidAccountOwner);
}

// ============================================================================
// Success Tests
// ============================================================================

#[test]
fn test_increment_success() {
    let mut ctx = TestContext::new();

    let counter_ix = CreateCounterFixture::build_valid(&mut ctx);
    let authority = counter_ix.signers[0].insecure_clone();
    let bump = counter_ix.instruction.data[1];
    counter_ix.send_expect_success(&mut ctx);

    let (counter_pda, _) = find_counter_pda(&authority.pubkey());

    // Verify initial count is 0
    assert_counter_account(&ctx, &counter_pda, &authority.pubkey(), bump, 0);

    // Increment the counter
    let increment_ix =
        IncrementFixture::build_with_counter(&mut ctx, counter_pda, authority.insecure_clone());
    increment_ix.send_expect_success(&mut ctx);

    // Verify count is now 1
    assert_counter_account(&ctx, &counter_pda, &authority.pubkey(), bump, 1);
}

#[test]
fn test_increment_multiple_times() {
    let mut ctx = TestContext::new();

    let counter_ix = CreateCounterFixture::build_valid(&mut ctx);
    let authority = counter_ix.signers[0].insecure_clone();
    let bump = counter_ix.instruction.data[1];
    counter_ix.send_expect_success(&mut ctx);

    let (counter_pda, _) = find_counter_pda(&authority.pubkey());

    // Increment 5 times
    for expected_count in 1..=5u8 {
        // Warp to next slot to get a new blockhash
        ctx.warp_to_next_slot();

        let increment_ix =
            IncrementFixture::build_with_counter(&mut ctx, counter_pda, authority.insecure_clone());
        increment_ix.send_expect_success(&mut ctx);
        assert_counter_account(
            &ctx,
            &counter_pda,
            &authority.pubkey(),
            bump,
            expected_count,
        );
    }
}

#[test]
fn test_increment_different_counters() {
    let mut ctx = TestContext::new();

    // Create first counter
    let counter1_ix = CreateCounterFixture::build_valid(&mut ctx);
    let authority1 = counter1_ix.signers[0].insecure_clone();
    let bump1 = counter1_ix.instruction.data[1];
    counter1_ix.send_expect_success(&mut ctx);
    let (counter1_pda, _) = find_counter_pda(&authority1.pubkey());

    // Create second counter
    let counter2_ix = CreateCounterFixture::build_valid(&mut ctx);
    let authority2 = counter2_ix.signers[0].insecure_clone();
    let bump2 = counter2_ix.instruction.data[1];
    counter2_ix.send_expect_success(&mut ctx);
    let (counter2_pda, _) = find_counter_pda(&authority2.pubkey());

    // Increment first counter twice
    for _ in 0..2 {
        // Warp to next slot to get a new blockhash
        ctx.warp_to_next_slot();

        let ix = IncrementFixture::build_with_counter(
            &mut ctx,
            counter1_pda,
            authority1.insecure_clone(),
        );
        ix.send_expect_success(&mut ctx);
    }

    // Increment second counter once
    let ix =
        IncrementFixture::build_with_counter(&mut ctx, counter2_pda, authority2.insecure_clone());
    ix.send_expect_success(&mut ctx);

    // Verify counts are independent
    assert_counter_account(&ctx, &counter1_pda, &authority1.pubkey(), bump1, 2);
    assert_counter_account(&ctx, &counter2_pda, &authority2.pubkey(), bump2, 1);
}

#[test]
fn test_increment_only_authority_can_increment() {
    let mut ctx = TestContext::new();

    let counter_ix = CreateCounterFixture::build_valid(&mut ctx);
    let authority = counter_ix.signers[0].insecure_clone();
    let bump = counter_ix.instruction.data[1];
    counter_ix.send_expect_success(&mut ctx);

    let (counter_pda, _) = find_counter_pda(&authority.pubkey());

    // Increment with correct authority
    let increment_ix =
        IncrementFixture::build_with_counter(&mut ctx, counter_pda, authority.insecure_clone());
    increment_ix.send_expect_success(&mut ctx);
    assert_counter_account(&ctx, &counter_pda, &authority.pubkey(), bump, 1);

    // Try to increment with wrong authority
    let attacker = ctx.create_funded_keypair();
    let bad_increment_ix = IncrementFixture::build_with_counter(&mut ctx, counter_pda, attacker);
    let error = bad_increment_ix.send_expect_error(&mut ctx);
    assert_instruction_error(error, InstructionError::Custom(0)); // InvalidAuthority

    // Verify count didn't change
    assert_counter_account(&ctx, &counter_pda, &authority.pubkey(), bump, 1);
}
