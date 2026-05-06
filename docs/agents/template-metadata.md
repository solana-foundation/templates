# Template Metadata

Template metadata is generated from template `package.json` files.

## Source Of Truth

The source of truth is each template directory's `package.json`. The generator reads template roots from root `package.json` under `repokit.groups`; do not maintain a separate hard-coded group list in docs.

Community templates belong under `community/` unless a maintainer asks for another root.

Generated outputs are:

- `templates.json`
- `TEMPLATES.md`
- `.github/workflows/templates.json`

## Automatic Generation

`pnpm generate` runs `tsx scripts/generate.ts && automd`.

The generator:

- Reads root `package.json` for configured `repokit.groups` and `repository.name`.
- Scans direct child directories in each configured group.
- Treats a child directory as a template only when it has a `package.json`.
- Reads template metadata from that `package.json`.
- Builds each template path as `<group>/<template-directory>`.
- Builds each template ID from root `repository.name` and the template path.
- Sets each image path to `<group>/<template-directory>/og-image.png`.
- Sorts templates alphabetically by `name` inside each group.
- Writes grouped metadata to `templates.json`.
- Writes a generated Markdown list to `TEMPLATES.md`.
- Writes a sorted flat path list to `.github/workflows/templates.json` for CI.

`automd` runs after metadata generation and updates README automation blocks, such as the contributors section.

CI also runs generation. Pull requests get a generated metadata preview, and pushes to `main` can auto-commit regenerated `templates.json`, `TEMPLATES.md`, and `.github/workflows/templates.json` when they change.

## Metadata Fields

The generator requires these fields before including a template:

- `name`: unique template package name.
- `description`: short summary for listings.
- `keywords`: searchable tags.

These fields are also used when present and are expected by the contributor guide for template listings:

- `displayName`: readable name shown in template UIs.
- `usecase`: category label.

## Template IDs

`scripts/generate.ts` creates IDs in this format:

```text
gh:solana-foundation/templates/<group>/<template-directory>
```

Do not hand-write these IDs in generated files.

## When To Regenerate

Run `pnpm generate` when changing:

- Template directory names.
- Template metadata fields.
- Root `repokit.groups`.
- Generator logic.

Then review generated output for accidental unrelated changes.
