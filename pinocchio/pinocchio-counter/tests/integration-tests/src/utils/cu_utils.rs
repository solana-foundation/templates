use std::fs::File;
use std::io::Write;
use std::path::PathBuf;

const CU_TRACKING_DIR: &str = ".cus";
const CU_TRACKING_FILE: &str = "results.txt";

pub struct CuTracker {
    file: File,
}

impl CuTracker {
    pub fn new() -> Option<Self> {
        let repo_root: PathBuf = [env!("CARGO_MANIFEST_DIR"), "..", ".."].iter().collect();
        let cus_dir = repo_root.join(CU_TRACKING_DIR);
        std::fs::create_dir_all(&cus_dir).ok()?;
        let file = std::fs::OpenOptions::new()
            .create(true)
            .append(true)
            .open(cus_dir.join(CU_TRACKING_FILE))
            .ok()?;
        Some(Self { file })
    }

    pub fn write(&mut self, instruction_name: &str, cus: u64) {
        let _ = writeln!(self.file, "{},{}", instruction_name, cus);
    }
}
