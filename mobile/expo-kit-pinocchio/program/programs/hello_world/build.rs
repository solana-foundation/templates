use std::{env, fs, path::Path};

// Writes the Codama IDL to `target/idl/hello_world.json` on every host build, so the client can be regenerated.
fn main() {
    let crate_dir = env::var("CARGO_MANIFEST_DIR").unwrap();
    println!("cargo:rerun-if-changed=src");

    let idl = codama::Codama::load(&crate_dir)
        .and_then(|codama| codama.get_json_idl())
        .expect("generate Codama IDL");
    let idl_dir = Path::new(&crate_dir).join("../../target/idl");
    fs::create_dir_all(&idl_dir).unwrap();
    fs::write(idl_dir.join("hello_world.json"), idl).unwrap();
}
