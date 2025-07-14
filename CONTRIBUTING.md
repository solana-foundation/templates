# Contributing to Solana Templates

Thank you for your interest in contributing to the Solana Templates repository! This guide will help you create high-quality templates that benefit the entire Solana developer community.

## Before You Start

1. **Check existing templates** - Make sure your template adds unique value
2. **Follow our standards** - Review quality requirements below
3. **Test thoroughly** - Ensure your template works in fresh environments
4. **Use our PR template** - This helps streamline the review process

## Template Requirements

### Structure and Files

Every template must include:

- `package.json` with complete metadata
- `README.md` with clear setup instructions
- Working source code that builds without errors
- Appropriate configuration files (tsconfig.json, etc.)

### Package.json Metadata

Your `package.json` must include:

```json
{
  "name": "template-[framework]-[description]",
  "description": "Clear description of what the template provides",
  "keywords": [
    "framework-name",
    "solana-kit", // or "solana-web3js" for legacy
    "use-case-tags",
    "technology-tags"
  ],
  "scripts": {
    "dev": "command to start development server",
    "build": "command to build for production",
    "start": "command to start production server (if applicable)"
  }
}
```

### Keyword Guidelines

Use relevant keywords to help with categorization:

**Frameworks:** `nextjs`, `react`, `vite`, `node`, `express`  
**Libraries:** `solana-kit`, `solana-web3js`, `anchor`, `gill`  
**UI:** `tailwind`, `chakra-ui`, `material-ui`  
**Wallets:** `wallet-ui`, `wallet-adapter`  
**Use Cases:** `defi`, `nfts`, `gaming`, `payments`, `daos`  
**Features:** `anchor-basic`, `anchor-counter`, `token`, `legacy`

### Code Quality Standards

- **No hardcoded secrets or API keys**
- **Use environment variables for configuration**
- **Include proper error handling**
- **Follow TypeScript best practices**
- **Use consistent code formatting**
- **Minimal and up-to-date dependencies**
- **Clean, readable code with comments where necessary**

### Documentation Requirements

Your `README.md` should include:

1. **Clear title and description**
2. **Prerequisites** (Node.js version, etc.)
3. **Installation steps**
4. **Development instructions**
5. **Build and deployment instructions**
6. **Environment variables** (if any)
7. **Example usage or screenshots**
8. **Additional resources or links**

## Enhanced Metadata (Optional)

To customize how your template appears in showcases, add a `solanaTemplate` field:

```json
{
  "solanaTemplate": {
    "slug": "url-friendly-name",
    "thumbnail": "./preview.png",
    "demoUrl": "https://live-demo-url.com",
    "author": "Your Name or Organization",
    "useCases": ["defi", "nfts"],
    "category": "full-stack",
    "features": {
      "transactions": ["transfer", "mint", "burn"],
      "integrations": ["jupiter", "metaplex", "pyth"]
    }
  }
}
```

### Available Categories
- `frontend` - UI-only templates
- `full-stack` - Complete dApps with programs
- `programs` - Backend/CLI tools
- `api` - Backend services
- `mobile` - React Native templates

### Use Case Tags
- `defi` - Decentralized finance
- `nfts` - Non-fungible tokens
- `gaming` - Blockchain games
- `payments` - Payment solutions
- `daos` - Decentralized organizations
- `social` - Social applications
- `identity` - Identity and verification

## Directory Structure

### Modern Templates (`templates/`)
Use for templates built with modern Solana libraries:
- `@solana/kit` or `gill`
- Latest Solana libraries
- Current best practices

### Legacy Templates (`legacy/`)
Use for templates using older libraries:
- `@solana/web3.js`
- Wallet Adapter
- Previous generation tools

## Testing Your Template

Before submitting, test your template thoroughly:

1. **Fresh environment testing:**
   ```bash
   # Create a new directory
   mkdir test-template && cd test-template
   
   # Copy your template
   cp -r path/to/your-template .
   
   # Install dependencies
   npm install
   
   # Test development
   npm run dev
   
   # Test build
   npm run build
   ```

2. **Verify all scripts work**
3. **Check for any errors or warnings**
4. **Test on different operating systems if possible**

## Submission Process

1. **Fork** the repository
2. **Create your template** in the appropriate directory
3. **Test thoroughly** in a fresh environment
4. **Submit a pull request** using our PR template
5. **Respond to feedback** during the review process

## Review Process

Our maintainers will review your submission for:

- Code quality and security
- Documentation completeness
- Template functionality
- Adherence to guidelines
- Value to the community

## After Your Template is Merged

1. The template will be automatically included in metadata generation
2. Run `npm run update-template-readmes` to update the documentation
3. Your template will be available via `create-solana-dapp`
4. It will appear in template showcases and galleries

## Getting Help

If you have questions or need help:

- Open an issue in this repository
- Ask in the Solana Discord developer channels
- Review existing templates for examples

Thank you for contributing to the Solana ecosystem! 🚀