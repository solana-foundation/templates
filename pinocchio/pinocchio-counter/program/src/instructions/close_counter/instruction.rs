use super::{CloseCounterAccounts, CloseCounterData};
use crate::{impl_instruction, traits::Instruction};

/// CloseCounter instruction combining accounts and data
pub struct CloseCounter<'a> {
    pub accounts: CloseCounterAccounts<'a>,
    pub data: CloseCounterData,
}

impl_instruction!(CloseCounter, CloseCounterAccounts, CloseCounterData);

impl<'a> Instruction<'a> for CloseCounter<'a> {
    type Accounts = CloseCounterAccounts<'a>;
    type Data = CloseCounterData;

    #[inline(always)]
    fn accounts(&self) -> &Self::Accounts {
        &self.accounts
    }

    #[inline(always)]
    fn data(&self) -> &Self::Data {
        &self.data
    }
}
