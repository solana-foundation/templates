# Community Template Contributor Guide

This guide provides comprehensive instructions for contributing community templates to the Solana Templates repository. Community templates are discoverable through `create-solana-dapp` and showcased on https://templates.solana.com.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Template Requirements](#template-requirements)
- [Creating Your Template](#creating-your-template)
- [Metadata Configuration](#metadata-configuration)
- [OG Image Generation](#og-image-generation)
- [Generating Template Metadata](#generating-template-metadata)
- [Validation and Testing](#validation-and-testing)
- [Submission Process](#submission-process)
- [Real Examples](#real-examples)
- [Troubleshooting](#troubleshooting)

## Overview

Community templates are Solana project templates maintained by the community that demonstrate specific use cases, frameworks, or patterns. They are:

- Discoverable through the `create-solana-dapp` CLI
- Showcased on the official templates website
- Maintained by the community with support from Solana Foundation
- Located in the `community/` directory

When users run `npm create solana-dapp@latest`, they can select from all available templates, including community contributions.

## Prerequisites

Before contributing a community template, ensure you have:

1. **Node.js** version 20 or higher
2. **pnpm** version 10.5.2 or higher
   ```bash
   corepack enable
   corepack prepare pnpm@10 --activate
   ```
3. **Git** for version control
4. **GitHub account** for submitting pull requests
5. A working Solana project that you want to share as a template

## Template Requirements

All community templates must meet these requirements:

### Directory Structure

Place your template in the `community/` directory. Your template can have any structure that makes sense for your project:

```
templates/
└── community/
    └── your-template-name/
        ├── package.json          (required - with metadata)
        ├── og-image.png          (required - 1200x630 pixels)
        └── ...                   (any structure: src/, anchor/, programs/, etc.)
```

**Only these two files are required at the root:**
- `package.json` - Contains template metadata
- `og-image.png` - Social preview image (1200x630 pixels)

Everything else is flexible. Your template might be:
- A Next.js frontend with `src/` and `app/` directories
- An Anchor program with `anchor/programs/` structure
- A Node.js script with minimal files
- A fullstack app with both `anchor/` and `src/`
- A pure Rust program with `Cargo.toml`
- Any other valid Solana project structure

### Required package.json Fields

Your template's `package.json` must include these metadata fields:

```json
{
  "name": "your-template-name",
  "displayName": "Human Readable Name",
  "description": "Clear, concise description of what this template does",
  "usecase": "Category",
  "keywords": [
    "solana",
    "relevant",
    "keywords"
  ]
}
```

You can include any additional fields (scripts, dependencies, etc.) that make sense for your project.

#### Field Descriptions

- **name**: Unique identifier for your template (kebab-case recommended)
- **displayName**: Human-readable name shown in the templates website UI
- **description**: Clear description that appears in template listings (keep under 100 characters)
- **usecase**: Category for template organization. Common values:
  - `"Starter"` - Basic boilerplate templates
  - `"Payments"` - Payment processing implementations
  - `"Airdrop"` - Token distribution mechanisms
  - `"DeFi"` - Decentralized finance applications
  - `"NFT"` - NFT minting and management
  - `"Gaming"` - Game development templates
- **keywords**: Array of searchable terms (include framework names, Solana libraries, use cases)

### Optional create-solana-dapp Configuration

You can optionally include setup instructions and variable substitution:

```json
{
  "create-solana-dapp": {
    "instructions": [
      "First, install dependencies:",
      "+{pm} install",
      "Then build the project:",
      "+{pm} build",
      "Start the development server:",
      "+{pm} dev"
    ],
    "rename": {
      "project-name": {
        "to": "{{name}}",
        "paths": ["src", "README.md"]
      }
    }
  }
}
```

- **instructions**: Array of setup steps shown after project creation
- **rename**: Define text replacements (e.g., replace placeholder names with user's project name)

## Creating Your Template

### Step 1: Prepare Your Project

1. Create a clean, working Solana project
2. Remove any personal configuration, API keys, or credentials
3. Add comprehensive comments and documentation
4. Ensure all dependencies are listed in `package.json`
5. Test that the project works from a fresh install

### Step 2: Create Template Directory

```bash
cd templates
mkdir community/your-template-name
cp -r /path/to/your/project/* community/your-template-name/
```

### Step 3: Configure package.json

Add the required metadata fields to your template's `package.json`:

```json
{
  "name": "your-template-name",
  "displayName": "Your Template Display Name",
  "description": "A clear description of what this template provides",
  "usecase": "Starter",
  "keywords": [
    "solana",
    "nextjs",
    "typescript",
    "anchor"
  ]
}
```

Include any scripts, dependencies, or other configuration appropriate for your template type.

## Metadata Configuration

Template metadata is automatically generated from your `package.json` and aggregated into `templates.json`, which is consumed by:

1. `create-solana-dapp` CLI for template discovery
2. Templates website (https://templates.solana.com) for browsing

The generation process:

1. Scans all directories in `community/`, `gill/`, `web3js/`, and `mobile/`
2. Reads each template's `package.json`
3. Extracts required fields (name, displayName, description, usecase, keywords)
4. Generates unique template IDs in the format: `gh:solana-foundation/templates/community/your-template-name`
5. Creates `templates.json` and `TEMPLATES.md` with all template metadata

## OG Image Generation

Every template must include an Open Graph image (`og-image.png`) used for social media previews and the templates website.

### Image Requirements

- **Dimensions**: Exactly 1200 x 630 pixels
- **Format**: PNG
- **File size**: Under 500KB (enforced by validation)
- **File name**: Must be `og-image.png` (lowercase)

### Generating Your OG Image

Use the built-in image generation tool:

```bash
cd templates
pnpm create-image "<Text>" community/your-template-name
```

#### Option 1: Text-Based Image

Generate an image with the Solana logo and custom text:

```bash
pnpm create-image "Next.js + Anchor" community/your-template-name
```

This creates an image with:
- Solana logo on the left
- A plus sign in the middle
- Your text on the right
- Gradient background

#### Option 2: Custom Logo

Use a custom logo (SVG or PNG) instead of text:

```bash
pnpm create-image "Payment Protocol" community/your-template-name --logo ./assets/your-logo.svg
```

Or with a PNG logo:

```bash
pnpm create-image "x402" community/your-template-name --logo ./assets/x402-logo.png
```

This displays:
- Solana logo + plus sign + your custom logo

#### Option 3: Screenshot

Capture a screenshot from a live website:

```bash
pnpm create-image "Next.js App" community/your-template-name --screenshot https://your-demo.com
```

This captures a full-page screenshot (useful for showing your template's UI).

### Image Generation Process

The `create-image` tool:

1. Generates the image using `@vercel/og` (for text/logo) or Puppeteer (for screenshots)
2. Optimizes the image with Sharp (PNG compression)
3. Validates dimensions (1200x630) and file size (under 500KB)
4. Saves to `community/your-template-name/og-image.png`

### Manual Image Creation

If you prefer to create your own image:

1. Create a 1200x630 pixel PNG image
2. Optimize it to be under 500KB
3. Save as `og-image.png` in your template directory

The image will be validated during the linting process.

## Generating Template Metadata

After creating your template and OG image, generate the metadata files:

```bash
cd templates
pnpm generate
```

This command:

1. Scans all template directories (including `community/`)
2. Extracts metadata from each `package.json`
3. Validates required fields are present
4. Generates `templates.json` with complete template data
5. Generates `TEMPLATES.md` with human-readable template list
6. Runs `automd` to update `README.md`

### Generated Files

**templates.json**

Contains the complete template registry:

```json
[
  {
    "description": "Community Templates",
    "name": "Community Templates",
    "path": "community",
    "templates": [
      {
        "description": "Your template description",
        "displayName": "Your Template Name",
        "id": "gh:solana-foundation/templates/community/your-template-name",
        "image": "community/your-template-name/og-image.png",
        "keywords": ["solana", "your", "keywords"],
        "name": "your-template-name",
        "path": "community/your-template-name",
        "usecase": "Starter"
      }
    ]
  }
]
```

**TEMPLATES.md**

A markdown file listing all templates with links and metadata.

### Committing Generated Files

You must commit the generated files with your PR:

```bash
git add templates.json TEMPLATES.md README.md
git commit -m "feat: add your-template-name community template"
```

The CI will verify that these files are up to date. If you forget to run `pnpm generate`, the CI will fail with an error message.

## Validation and Testing

### Local Validation

Before submitting your PR, run the validation suite:

```bash
cd templates
pnpm install
pnpm lint
```

The `pnpm lint` command validates:

1. All templates have required `package.json` fields (name, displayName, description, usecase, keywords)
2. No duplicate template names exist
3. All templates have `og-image.png` files
4. OG images are exactly 1200x630 pixels
5. OG images are under 500KB

### Common Validation Errors

**Missing package.json fields**

```
community/your-template: Missing displayName
```

Fix: Add the `displayName` field to your `package.json`.

**Missing og-image.png**

```
community/your-template: Missing og-image.png
```

Fix: Generate an OG image using `pnpm create-image`.

**Invalid image dimensions**

```
community/your-template: Invalid image: Image dimensions are 1920×1080, must be 1200×630
```

Fix: Regenerate the image with correct dimensions.

**Image too large**

```
community/your-template: Invalid image: Image size is 650KB, must be less than 500KB
```

Fix: Regenerate with `pnpm create-image` (auto-optimizes) or compress manually.

### Testing Your Template

Test that your template works with `create-solana-dapp`:

```bash
# Test with local template path
npm create solana-dapp@latest my-test-app -- -t gh:solana-foundation/templates/community/your-template-name

# Or test from a fork
npm create solana-dapp@latest my-test-app -- -t gh:YOUR_USERNAME/templates/community/your-template-name
```

Verify:

1. The project is created successfully
2. All template files are copied correctly
3. Any post-install instructions are displayed
4. The template functions as expected for your use case

## Submission Process

### Step 1: Fork and Clone

1. Fork the repository: https://github.com/solana-foundation/templates
2. Clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/templates.git
cd templates
```

3. Add upstream remote:

```bash
git remote add upstream https://github.com/solana-foundation/templates.git
```

### Step 2: Create a Feature Branch

Use your GitHub username as a branch prefix:

```bash
git checkout -b YOUR_USERNAME/add-your-template-name
```

Example:

```bash
git checkout -b alice/add-payment-template
```

### Step 3: Make Your Changes

1. Create your template in `community/your-template-name/`
2. Add all required metadata to `package.json` (name, displayName, description, usecase, keywords)
3. Generate OG image: `pnpm create-image "Text" community/your-template-name`
4. Run `pnpm generate` to update metadata files
5. Run `pnpm lint` to validate

### Step 4: Commit Your Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat: add your-template-name community template"
```

Commit message types:

- `feat:` - New template or feature
- `fix:` - Bug fix in existing template
- `docs:` - Documentation updates
- `chore:` - Maintenance tasks

### Step 5: Push and Create PR

```bash
git push origin YOUR_USERNAME/add-your-template-name
```

Then create a pull request on GitHub with this information:

**PR Title**

```
feat: Add [Your Template Name] community template
```

**PR Description Template**

```markdown
## Summary

Brief description of what your template does and its use case.

## Template Details

- **Name**: your-template-name
- **Display Name**: Your Template Name
- **Use Case**: Starter / Payments / Airdrop / etc.
- **Framework**: Next.js / React / Node.js / etc.
- **Solana SDK**: @solana/kit (gill) / @solana/web3.js / Anchor

## Key Features

- Feature 1
- Feature 2
- Feature 3

## Testing

- [ ] Tested with create-solana-dapp CLI
- [ ] Template works as expected
- [ ] README.md includes clear instructions
- [ ] No secrets or credentials included
- [ ] All necessary dependencies are listed

## Checklist

- [ ] Added template to `community/` directory
- [ ] Added required package.json metadata (name, displayName, description, usecase, keywords)
- [ ] Generated og-image.png (1200x630 pixels, under 500KB)
- [ ] Ran `pnpm generate` and committed templates.json, TEMPLATES.md
- [ ] Ran `pnpm lint` - all checks pass
- [ ] README.md or documentation explains how to use the template
- [ ] Tested template creation with create-solana-dapp
```

### Step 6: CI Validation

When you submit your PR, GitHub Actions will automatically run:

1. **Lint template structure** - Validates metadata and images
2. **Generate metadata** - Ensures templates.json can be generated
3. **Validate output** - Checks generated files are correct
4. **Check for uncommitted changes** - Ensures you committed generated files

If CI fails:

1. Read the error messages carefully
2. Fix the issues locally
3. Run `pnpm lint` to verify fixes
4. Commit and push updates
5. CI will automatically re-run

### Step 7: Review and Merge

Maintainers will review your PR and may request changes. Common feedback:

- Improve documentation
- Simplify setup process
- Add missing dependencies
- Fix metadata validation issues
- Optimize image size

Once approved, your template will be merged and available to users!

## Real Examples

### Example 1: gill-node-solanax402

**Location**: `community/gill-node-solanax402/`

**PR**: #151 - Added x402 payment protocol template

**Key Characteristics**:

- Express.js backend template
- Complex TypeScript project structure
- PM2 process management
- Custom test scripts
- Comprehensive README and SETUP.md

**package.json highlights**:

```json
{
  "name": "x402-solana-protocol",
  "displayName": "x402 Express Server",
  "usecase": "Payments",
  "description": "x402 protocol implementation for Solana with Facilitator and Server apps using TypeScript and Gill SDK",
  "keywords": ["solana", "x402", "payment", "protocol", "blockchain", "typescript", "gill"]
}
```

### Example 2: gill-jito-airdrop

**Location**: `community/gill-jito-airdrop/`

**Key Characteristics**:

- Next.js frontend with Anchor program
- Merkle tree-based airdrop system
- Codama integration for type generation
- Custom setup scripts
- Post-installation instructions

**package.json highlights**:

```json
{
  "name": "gill-jito-airdrop",
  "displayName": "Merkletree Airdrop",
  "usecase": "Airdrop",
  "description": "A modern, script-driven Solana airdrop template that distributes SOL to many recipients efficiently using a Merkle tree",
  "create-solana-dapp": {
    "instructions": [
      "Generates the necessary TypeScript types and client code from the Solana program:",
      "+{pm} codama:generate",
      "Then set up the program:",
      "+{pm} airdrop:setup"
    ]
  }
}
```

### Common Patterns

1. **Naming Convention**: Use descriptive, kebab-case names
2. **Documentation**: Include clear README.md with setup instructions
3. **Dependencies**: List all required dependencies in package.json
4. **Instructions**: Use create-solana-dapp.instructions for post-install steps
5. **Structure**: Organize code in a way that makes sense for your template type

## Troubleshooting

### "Failed to read package.json"

**Cause**: Missing or malformed `package.json`

**Fix**: Ensure your template directory has a valid `package.json` file.

### "Missing required fields"

**Cause**: Your `package.json` is missing required metadata fields

**Fix**: Add all required fields:

```json
{
  "name": "your-template-name",
  "displayName": "Display Name",
  "description": "Description",
  "usecase": "Category",
  "keywords": ["keyword1", "keyword2"]
}
```

### "Duplicate template name"

**Cause**: Another template already uses the same `name` field

**Fix**: Choose a unique name. Check existing templates:

```bash
cat templates.json | grep '"name":'
```

### "Image dimensions are incorrect"

**Cause**: Your `og-image.png` is not exactly 1200x630 pixels

**Fix**: Regenerate using `pnpm create-image`:

```bash
pnpm create-image "Your Text" community/your-template-name
```

### "Image size exceeds 500KB"

**Cause**: Your `og-image.png` file is too large

**Fix**: The `create-image` tool automatically optimizes. If you created the image manually, compress it:

```bash
# Using sharp (already installed)
npx sharp-cli -i og-image.png -o og-image-optimized.png -- png -q 90
```

### "Generated files have uncommitted changes"

**Cause**: You forgot to run `pnpm generate` or didn't commit the changes

**Fix**:

```bash
pnpm generate
git add templates.json TEMPLATES.md README.md
git commit -m "chore: update generated template metadata"
git push
```

### "Template not appearing in create-solana-dapp"

**Cause**: The template hasn't been merged to main yet, or metadata wasn't generated

**Fix**:

- Ensure your PR is merged
- Test with your fork: `npm create solana-dapp@latest test-app -- -t gh:YOUR_USERNAME/templates/community/your-template`
- Wait a few minutes for CDN caches to clear after merge

### Metadata Validation Failures

**Cause**: Missing required metadata fields or incorrect values

**Fix**:

1. Verify all required fields are present:

```bash
cd community/your-template-name
cat package.json
```

2. Ensure name, displayName, description, usecase, and keywords are all defined
3. Run `pnpm lint` from the templates root to check validation

## Getting Help

If you encounter issues not covered in this guide:

1. **Check existing templates**: Look at `community/` for examples
2. **Read the main CONTRIBUTING.md**: General contribution guidelines
3. **Open an issue**: https://github.com/solana-foundation/templates/issues
4. **Ask in PR**: Maintainers can provide guidance in your pull request

## Summary Checklist

Before submitting your community template PR:

- [ ] Template is in `community/your-template-name/` directory
- [ ] `package.json` includes: name, displayName, description, usecase, keywords
- [ ] Generated `og-image.png` (1200x630 pixels, under 500KB)
- [ ] Ran `pnpm generate` to update templates.json and TEMPLATES.md
- [ ] Ran `pnpm lint` - all checks pass
- [ ] Tested template with create-solana-dapp CLI
- [ ] Template works as expected for its use case
- [ ] Committed all changes including generated files
- [ ] Created PR with descriptive title and detailed description

Welcome to the Solana Templates community, and thank you for contributing!
