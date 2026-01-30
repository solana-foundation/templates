use solana_sdk::signature::{Keypair, Signer};

use pinocchio_counter_client::instructions::CloseCounterBuilder;

use crate::{
    fixtures::CreateCounterFixture,
    utils::{find_counter_pda, find_event_authority_pda, Address, TestContext},
};

use crate::utils::traits::{InstructionTestFixture, TestInstruction};

pub struct CloseCounterFixture;

impl CloseCounterFixture {
    pub fn build_with_counter(
        _ctx: &mut TestContext,
        counter_pda: Address,
        authority: Keypair,
        destination: Address,
    ) -> TestInstruction {
        let (event_authority, _) = find_event_authority_pda();

        let instruction = CloseCounterBuilder::new()
            .authority(authority.pubkey())
            .counter(counter_pda)
            .destination(destination)
            .event_authority(event_authority)
            .instruction();

        TestInstruction {
            instruction,
            signers: vec![authority],
            name: Self::INSTRUCTION_NAME,
        }
    }

    pub fn build_with_destination(ctx: &mut TestContext, destination: Address) -> TestInstruction {
        let counter_ix = CreateCounterFixture::build_valid(ctx);
        let authority = counter_ix.signers[0].insecure_clone();
        counter_ix.send_expect_success(ctx);

        let (counter_pda, _) = find_counter_pda(&authority.pubkey());
        Self::build_with_counter(ctx, counter_pda, authority, destination)
    }
}

impl InstructionTestFixture for CloseCounterFixture {
    const INSTRUCTION_NAME: &'static str = "CloseCounter";

    fn build_valid(ctx: &mut TestContext) -> TestInstruction {
        let counter_ix = CreateCounterFixture::build_valid(ctx);
        let authority = counter_ix.signers[0].insecure_clone();
        counter_ix.send_expect_success(ctx);

        let (counter_pda, _) = find_counter_pda(&authority.pubkey());
        let (event_authority, _) = find_event_authority_pda();

        let destination = ctx.create_funded_keypair().pubkey();

        let instruction = CloseCounterBuilder::new()
            .authority(authority.pubkey())
            .counter(counter_pda)
            .destination(destination)
            .event_authority(event_authority)
            .instruction();

        TestInstruction {
            instruction,
            signers: vec![authority],
            name: Self::INSTRUCTION_NAME,
        }
    }

    /// Account indices that must be signers:
    /// 0: authority
    fn required_signers() -> &'static [usize] {
        &[0]
    }

    /// Account indices that must be writable:
    /// 1: counter
    /// 2: destination
    fn required_writable() -> &'static [usize] {
        &[1, 2]
    }

    fn system_program_index() -> Option<usize> {
        None
    }

    fn current_program_index() -> Option<usize> {
        Some(4)
    }

    fn data_len() -> usize {
        1 // Just the discriminator
    }
}
