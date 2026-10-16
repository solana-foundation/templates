# Test programs

`spl_memo.so` is the unmodified Memo v4 program from the official
[program@v4.0.0 release](https://github.com/solana-program/memo/releases/tag/program%40v4.0.0).
Surfpool 1.6.1's offline runtime does not preload the Memo v4 address used by
`@solana-program/memo`, so the test setup deploys this fixture locally through
Surfpool's public `deploy` API. The application client is unchanged.

- Program address: `Memo4c2pN8afCj432Lb7RMVKi9PbQnnW7ewFFaV3oAH`
- SHA-256: `0c92063c6838d9ad8af50aaefea9a166b5bb41a2bfa2bc6327d7db320849bc78`
- License: Apache-2.0; see `LICENSE.memo`.

To retrieve the same published artifact:

```sh
gh release download 'program@v4.0.0' --repo solana-program/memo --pattern spl_memo.so --dir tests/fixtures
```
