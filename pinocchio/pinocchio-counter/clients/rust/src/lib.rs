// Suppress warnings for generated code
#![allow(warnings)]

// Re-export generated code
pub mod generated;
pub use generated::*;

// Re-export commonly used items
pub use generated::accounts::*;
pub use generated::errors::*;
pub use generated::programs::*;
