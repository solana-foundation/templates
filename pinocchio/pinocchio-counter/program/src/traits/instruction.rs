use pinocchio::{account::AccountView, error::ProgramError};

/// Discriminators for the Pinocchio Counter Program instructions.
#[repr(u8)]
pub enum PinocchioCounterInstructionDiscriminators {
    CreateCounter = 0,
    Increment = 1,
    CloseCounter = 2,
    /// 228 is the Anchor event instruction discriminator used for CPI-based event emission.
    /// Events are emitted by invoking CPI to this instruction with serialized event data.
    EmitEvent = 228,
}

impl TryFrom<u8> for PinocchioCounterInstructionDiscriminators {
    type Error = ProgramError;

    fn try_from(value: u8) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(Self::CreateCounter),
            1 => Ok(Self::Increment),
            2 => Ok(Self::CloseCounter),
            228 => Ok(Self::EmitEvent),
            _ => Err(ProgramError::InvalidInstructionData),
        }
    }
}

/// Marker trait for instruction account structs
///
/// Implementors should use TryFrom<&'a [AccountView]> for parsing
pub trait InstructionAccounts<'a>:
    Sized + TryFrom<&'a [AccountView], Error = ProgramError>
{
}

/// Marker trait for instruction data structs
///
/// Implementors should use TryFrom<&'a [u8]> for parsing
pub trait InstructionData<'a>: Sized + TryFrom<&'a [u8], Error = ProgramError> {
    /// Expected length of instruction data
    const LEN: usize;
}

/// Full instruction combining accounts and data
///
/// Implementors get automatic TryFrom<(&'a [u8], &'a [AccountView])>
pub trait Instruction<'a>: Sized {
    type Accounts: InstructionAccounts<'a>;
    type Data: InstructionData<'a>;

    fn accounts(&self) -> &Self::Accounts;
    fn data(&self) -> &Self::Data;

    /// Parse instruction from data and accounts tuple
    #[inline(always)]
    fn parse(data: &'a [u8], accounts: &'a [AccountView]) -> Result<Self, ProgramError>
    where
        Self: From<(Self::Accounts, Self::Data)>,
    {
        let accounts = Self::Accounts::try_from(accounts)?;
        let data = Self::Data::try_from(data)?;
        Ok(Self::from((accounts, data)))
    }
}
