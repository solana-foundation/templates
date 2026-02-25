use codama::CodamaErrors;
use pinocchio::error::ProgramError;
use thiserror::Error;

/// Errors that may be returned by the Pinocchio Counter Program.
#[derive(Clone, Debug, Eq, PartialEq, Error, CodamaErrors)]
pub enum PinocchioCounterProgramError {
    /// (0) Authority invalid or does not match counter authority
    #[error("Authority invalid or does not match counter authority")]
    InvalidAuthority,

    /// (1) Event authority PDA is invalid
    #[error("Event authority PDA is invalid")]
    InvalidEventAuthority,
}

impl From<PinocchioCounterProgramError> for ProgramError {
    fn from(e: PinocchioCounterProgramError) -> Self {
        ProgramError::Custom(e as u32)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_error_conversion() {
        let error: ProgramError = PinocchioCounterProgramError::InvalidAuthority.into();
        assert_eq!(error, ProgramError::Custom(0));

        let error: ProgramError = PinocchioCounterProgramError::InvalidEventAuthority.into();
        assert_eq!(error, ProgramError::Custom(1));
    }
}
