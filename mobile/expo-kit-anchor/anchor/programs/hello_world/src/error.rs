use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Counter has reached the maximum value")]
    CounterOverflow,
}
