# Community Template Contributor Guide

This guide provides comprehensive instructions for contributing community templates to the Solana Templates repository. Community templates are discoverable through `create-solana-dapp` and showcased on https://templates.solana.com.

## Overview

Community templates are Solana project templates maintained by the community that demonstrate specific use cases, frameworks, or patterns. They are:

- Discoverable through the `create-solana-dapp` CLI
- Showcased on the official [Solana Templates marketplace](https://templates.solana.com/)

When users run `npx create-solana-dapp@latest`, they can select from all available templates, including community contributions.

## Prerequisites

Before contributing a community template, ensure you have:

1. **Node.js** version 20 or higher
2. **pnpm** version 10.5.2 or higher

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
  "keywords": ["solana", "relevant", "keywords"]
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
4. Test that the project works from a fresh install

### Step 2: Create Template Directory

```bash
cd templates
mkdir community/your-template-name
```

### Step 3: Configure package.json

Add the required metadata fields to your template's `package.json`:

```json
{
  "name": "your-template-name",
  "displayName": "Your Template Display Name",
  "description": "A clear description of what this template provides",
  "usecase": "Starter",
  "keywords": ["solana", "nextjs", "typescript", "anchor"]
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
pnpm create-image "Anchor" community/your-template-name
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
- [ ] Ran `pnpm lint` - all checks pass
- [ ] Tested template with create-solana-dapp CLI
- [ ] Template works as expected for its use case
- [ ] Created PR with descriptive title and detailed description

Welcome to the Solana Templates community, and thank you for contributing!
