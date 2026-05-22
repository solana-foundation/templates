use super::{IncrementAccounts, IncrementData};
use crate::{impl_instruction, traits::Instruction};

/// Increment instruction combining accounts and data
pub struct Increment<'a> {
    pub accounts: IncrementAccounts<'a>,
    pub data: IncrementData,
}

impl_instruction!(Increment, IncrementAccounts, IncrementData);

impl<'a> Instruction<'a> for Increment<'a> {
    type Accounts = IncrementAccounts<'a>;
    type Data = IncrementData;

    #[inline(always)]
    fn accounts(&self) -> &Self::Accounts {
        &self.accounts
    }

    #[inline(always)]
    fn data(&self) -> &Self::Data {
        &self.data
    }
}
