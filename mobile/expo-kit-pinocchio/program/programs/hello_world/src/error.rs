use codama::CodamaErrors;
use pinocchio::error::ProgramError;

#[derive(CodamaErrors, Clone, Copy, Debug, PartialEq)]
#[repr(u32)]
pub enum HelloWorldError {
    #[codama(error(6000, "Counter has reached the maximum value"))]
    CounterOverflow = 6000,
}

impl From<HelloWorldError> for ProgramError {
    fn from(error: HelloWorldError) -> Self {
        ProgramError::Custom(error as u32)
    }
}
