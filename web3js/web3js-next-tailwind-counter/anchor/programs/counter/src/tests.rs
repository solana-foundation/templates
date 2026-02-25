#[cfg(test)]
mod tests {
    use crate::ID as PROGRAM_ID;
    use anchor_litesvm::{
        build_anchor_instruction, AccountMeta, AnchorLiteSVM, AnchorSerialize, Keypair,
    };
    use litesvm_utils::{AssertionHelpers, TestHelpers};
    use solana_sdk::{signer::Signer, system_program};

    const LAMPORTS_PER_SOL: u64 = 1_000_000_000;

    #[derive(AnchorSerialize)]
    struct SetArgs {
        value: u8,
    }

    #[test]
    fn test_hello_world() {
        let mut ctx = AnchorLiteSVM::build_with_program(
            PROGRAM_ID,
            include_bytes!("../../../target/deploy/counter.so"),
        );

        let user = ctx.svm.create_funded_account(10 * LAMPORTS_PER_SOL).unwrap();
        ctx.svm.assert_sol_balance(&user.pubkey(), 10 * LAMPORTS_PER_SOL);

        println!("✓ Counter program loaded successfully");
        println!("✓ Test user created with 10 SOL");
    }

    #[test]
    fn test_initialize_counter() {
        let mut ctx = AnchorLiteSVM::build_with_program(
            PROGRAM_ID,
            include_bytes!("../../../target/deploy/counter.so"),
        );

        let payer = ctx.svm.create_funded_account(10 * LAMPORTS_PER_SOL).unwrap();
        let counter = Keypair::new();

        let init_ix = build_anchor_instruction(
            &PROGRAM_ID,
            "initialize",
            vec![
                AccountMeta::new(payer.pubkey(), true),
                AccountMeta::new(counter.pubkey(), true),
                AccountMeta::new_readonly(system_program::id(), false),
            ],
            (),
        )
        .unwrap();

        ctx.execute_instruction(init_ix, &[&payer, &counter])
            .unwrap()
            .assert_success();

        assert!(
            ctx.svm.get_account(&counter.pubkey()).is_some(),
            "Counter account should exist"
        );

        println!("✓ Counter initialized successfully");
    }

    #[test]
    fn test_increment() {
        let mut ctx = AnchorLiteSVM::build_with_program(
            PROGRAM_ID,
            include_bytes!("../../../target/deploy/counter.so"),
        );

        let payer = ctx.svm.create_funded_account(10 * LAMPORTS_PER_SOL).unwrap();
        let counter = Keypair::new();

        let init_ix = build_anchor_instruction(
            &PROGRAM_ID,
            "initialize",
            vec![
                AccountMeta::new(payer.pubkey(), true),
                AccountMeta::new(counter.pubkey(), true),
                AccountMeta::new_readonly(system_program::id(), false),
            ],
            (),
        )
        .unwrap();

        ctx.execute_instruction(init_ix, &[&payer, &counter])
            .unwrap()
            .assert_success();

        let inc_ix = build_anchor_instruction(
            &PROGRAM_ID,
            "increment",
            vec![AccountMeta::new(counter.pubkey(), false)],
            (),
        )
        .unwrap();

        ctx.execute_instruction(inc_ix, &[&payer])
            .unwrap()
            .assert_success();

        println!("✓ Counter incremented successfully");
    }

    #[test]
    fn test_set_and_decrement() {
        let mut ctx = AnchorLiteSVM::build_with_program(
            PROGRAM_ID,
            include_bytes!("../../../target/deploy/counter.so"),
        );

        let payer = ctx.svm.create_funded_account(10 * LAMPORTS_PER_SOL).unwrap();
        let counter = Keypair::new();

        let init_ix = build_anchor_instruction(
            &PROGRAM_ID,
            "initialize",
            vec![
                AccountMeta::new(payer.pubkey(), true),
                AccountMeta::new(counter.pubkey(), true),
                AccountMeta::new_readonly(system_program::id(), false),
            ],
            (),
        )
        .unwrap();

        ctx.execute_instruction(init_ix, &[&payer, &counter])
            .unwrap()
            .assert_success();

        let set_ix = build_anchor_instruction(
            &PROGRAM_ID,
            "set",
            vec![AccountMeta::new(counter.pubkey(), false)],
            SetArgs { value: 5 },
        )
        .unwrap();

        ctx.execute_instruction(set_ix, &[&payer])
            .unwrap()
            .assert_success();

        let dec_ix = build_anchor_instruction(
            &PROGRAM_ID,
            "decrement",
            vec![AccountMeta::new(counter.pubkey(), false)],
            (),
        )
        .unwrap();

        ctx.execute_instruction(dec_ix, &[&payer])
            .unwrap()
            .assert_success();

        println!("✓ Counter set and decremented successfully");
    }
}
