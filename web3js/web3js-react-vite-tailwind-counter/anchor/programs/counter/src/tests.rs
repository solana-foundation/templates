#[cfg(test)]
mod tests {
    use crate::{Counter, ID as PROGRAM_ID};
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

        ctx.svm.assert_account_exists(&counter.pubkey());
        ctx.svm.assert_account_owner(&counter.pubkey(), &PROGRAM_ID);

        let counter_data = ctx.get_account::<Counter>(&counter.pubkey()).unwrap();
        assert_eq!(counter_data.count, 0, "Counter should be initialized to 0");

        println!("✓ Counter initialized successfully with count = 0");
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

        let counter_data = ctx.get_account::<Counter>(&counter.pubkey()).unwrap();
        assert_eq!(counter_data.count, 1, "Counter should be 1 after increment");

        println!("✓ Counter incremented successfully to {}", counter_data.count);
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

        let counter_data = ctx.get_account::<Counter>(&counter.pubkey()).unwrap();
        assert_eq!(counter_data.count, 5, "Counter should be 5 after set");

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

        let counter_data = ctx.get_account::<Counter>(&counter.pubkey()).unwrap();
        assert_eq!(counter_data.count, 4, "Counter should be 4 after decrement");

        println!("✓ Counter set to 5, decremented to {}", counter_data.count);
    }
}
