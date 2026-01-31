use super::{CreateCounterAccounts, CreateCounterData};
use crate::{impl_instruction, traits::Instruction};

/// CreateCounter instruction combining accounts and data
pub struct CreateCounter<'a> {
    pub accounts: CreateCounterAccounts<'a>,
    pub data: CreateCounterData,
}

impl_instruction!(CreateCounter, CreateCounterAccounts, CreateCounterData);

impl<'a> Instruction<'a> for CreateCounter<'a> {
    type Accounts = CreateCounterAccounts<'a>;
    type Data = CreateCounterData;

    #[inline(always)]
    fn accounts(&self) -> &Self::Accounts {
        &self.accounts
    }

    #[inline(always)]
    fn data(&self) -> &Self::Data {
        &self.data
    }
}
