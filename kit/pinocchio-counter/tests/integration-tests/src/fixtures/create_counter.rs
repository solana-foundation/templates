use pinocchio_counter_client::instructions::CreateCounterBuilder;
use solana_sdk::signature::Signer;

use crate::utils::{find_counter_pda, find_event_authority_pda, TestContext};

use crate::utils::traits::{InstructionTestFixture, TestInstruction};

pub struct CreateCounterFixture;

impl InstructionTestFixture for CreateCounterFixture {
    const INSTRUCTION_NAME: &'static str = "CreateCounter";

    fn build_valid(ctx: &mut TestContext) -> TestInstruction {
        let authority = ctx.create_funded_keypair();
        let (counter_pda, bump) = find_counter_pda(&authority.pubkey());
        let (event_authority, _) = find_event_authority_pda();

        let instruction = CreateCounterBuilder::new()
            .payer(ctx.payer.pubkey())
            .authority(authority.pubkey())
            .counter(counter_pda)
            .event_authority(event_authority)
            .bump(bump)
            .instruction();

        TestInstruction {
            instruction,
            signers: vec![authority],
            name: Self::INSTRUCTION_NAME,
        }
    }

    /// Account indices that must be signers:
    /// 0: payer (handled by TestContext)
    /// 1: authority
    fn required_signers() -> &'static [usize] {
        &[0, 1]
    }

    /// Account indices that must be writable:
    /// 0: payer
    /// 2: counter
    fn required_writable() -> &'static [usize] {
        &[0, 2]
    }

    fn system_program_index() -> Option<usize> {
        Some(3)
    }

    fn current_program_index() -> Option<usize> {
        Some(5)
    }

    fn data_len() -> usize {
        2 // discriminator (1) + bump (1)
    }
}
