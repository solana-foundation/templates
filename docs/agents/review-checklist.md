# Review Checklist

Use this checklist for PR review or self-review before submitting a template change.

## Metadata

- New templates have `package.json` and `og-image.png`.
- Contributor-required metadata fields are present and accurate.
- Template names are unique.
- Generated files were updated with `pnpm generate` when needed.

## User Experience

- README setup commands are current.
- The template can be created from a clean directory.
- Package scripts are understandable and match the README.
- Post-create instructions in `create-solana-dapp` metadata are safe and useful.

## Security

- No secrets, private keys, seed phrases, personal wallet data, or live credentials are committed.
- `.env.example` uses placeholders only.
- Dependencies and scripts do not perform unexpected network, wallet, signing, or funding actions.
- Agent, MCP, wallet, or transaction automation behavior is clearly disclosed.

## Compatibility

- The template works with the package managers and Node versions expected by CI.
- Lockfiles are intentional, tracked or ignored according to repository rules, and match the chosen package manager.
- Generated clients, build outputs, local caches, and install artifacts are not committed unless intentionally part of the template.

## Scope

- Shared scripts or workflow changes are justified by more than one template or a recurring maintenance issue.
- Unrelated formatting, dependency updates, and generated-file churn are avoided.
