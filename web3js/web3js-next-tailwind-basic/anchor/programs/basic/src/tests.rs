#[cfg(test)]
mod tests {
    use crate::ID as PROGRAM_ID;
    use anchor_litesvm::{build_anchor_instruction, AnchorLiteSVM};
    use litesvm_utils::{AssertionHelpers, TestHelpers};
    use solana_sdk::signer::Signer;

    const LAMPORTS_PER_SOL: u64 = 1_000_000_000;

    #[test]
    fn test_hello_world() {
        let mut ctx = AnchorLiteSVM::build_with_program(
            PROGRAM_ID,
            include_bytes!("../../../target/deploy/basic.so"),
        );

        let user = ctx.svm.create_funded_account(10 * LAMPORTS_PER_SOL).unwrap();
        ctx.svm.assert_sol_balance(&user.pubkey(), 10 * LAMPORTS_PER_SOL);

        println!("✓ Basic program loaded successfully");
        println!("✓ Test user created with 10 SOL");
    }

    #[test]
    fn test_greet() {
        let mut ctx = AnchorLiteSVM::build_with_program(
            PROGRAM_ID,
            include_bytes!("../../../target/deploy/basic.so"),
        );

        let user = ctx.svm.create_funded_account(10 * LAMPORTS_PER_SOL).unwrap();

        let greet_ix = build_anchor_instruction(&PROGRAM_ID, "greet", vec![], ()).unwrap();

        let result = ctx.execute_instruction(greet_ix, &[&user]).unwrap();
        result.assert_success();
        assert!(result.has_log("GM!"), "Expected 'GM!' message in logs");

        println!("✓ Greet instruction executed successfully");
        println!("✓ Program logged: GM!");
    }
}
