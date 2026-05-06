# Known Gotchas

## Generated Files

`templates.json`, `TEMPLATES.md`, and `.github/workflows/templates.json` are generated. If they change unexpectedly, run `pnpm generate` from a clean worktree and inspect the diff before keeping the changes.

## Template Group Scanning

The generator and linter scan direct children of each root `repokit.groups` path. A directory inside a scanned group without `package.json` can fail lint.

## Open Graph Images

Every template needs `og-image.png` at `1200x630` and under the enforced size limit. Use `pnpm create-image` when a quick generated image is enough.

## Formatting

Root `pnpm lint` includes `prettier --check .`, so docs and template files can fail lint even if template metadata is valid.

Generated files and the root `pnpm-lock.yaml` are intentionally ignored by root Prettier rules. Some template lockfiles are tracked, so check existing patterns before adding or removing one.

## Template Tests

`test-templates.yml` filters out `community/` templates. For tested templates, the shared action always runs `npm run ci` after installation, so those templates need a working `ci` script.

## Package Manager Matrix

CI can expose issues that only appear with one package manager. Engine constraints in dependencies can break a package manager/Node combination even when local installs work.

## Community Templates

Community templates may use different frameworks and package managers. Preserve their local conventions unless a repository rule or maintainer request requires a change.
