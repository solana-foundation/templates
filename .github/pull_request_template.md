# Template Submission

## Template Information

**Template Name:** `template-[framework]-[description]`  
**Category:** [ ] Frontend [ ] Full Stack [ ] Programs [ ] API [ ] Mobile  
**Framework:** (e.g., Next.js, React+Vite, Node.js)  
**Use Cases:** (e.g., DeFi, NFTs, Gaming, Payments)

## Description

Brief description of what this template provides and its intended use case.

## Quality Checklist

### Required Files
- [ ] `package.json` with complete metadata
- [ ] `README.md` with setup instructions
- [ ] Working code that builds without errors
- [ ] Proper TypeScript configuration (if applicable)

### Package.json Requirements
- [ ] `name` follows naming convention: `template-[framework]-[description]`
- [ ] `description` clearly explains the template
- [ ] `keywords` array includes relevant tags (framework, libraries, use cases)
- [ ] Scripts include `build`, `dev`, and other standard commands
- [ ] Dependencies are up-to-date and minimal

### Code Quality
- [ ] Code follows existing patterns in the repository
- [ ] No hardcoded secrets or API keys
- [ ] Proper error handling
- [ ] Clean, readable code with consistent formatting
- [ ] No unused dependencies or files

### Documentation
- [ ] README includes clear setup instructions
- [ ] Prerequisites are documented
- [ ] Example usage is provided
- [ ] Environment variables are documented (if any)

### Testing
- [ ] Template builds successfully (`npm run build` or equivalent)
- [ ] Template runs without errors (`npm run dev` or equivalent)
- [ ] All dependencies install correctly
- [ ] Tested on fresh environment

### Optional Enhancements
- [ ] Custom `solanaTemplate` configuration in package.json
- [ ] Preview image/screenshot
- [ ] Live demo URL
- [ ] Comprehensive example implementation

## Metadata Configuration (Optional)

If you want to customize how your template appears in the showcase, add this to your `package.json`:

```json
{
  "solanaTemplate": {
    "slug": "custom-url-friendly-name",
    "thumbnail": "./preview.png",
    "demoUrl": "https://your-demo.vercel.app",
    "author": "Your Name",
    "useCases": ["defi", "nfts"],
    "category": "full-stack",
    "features": {
      "transactions": ["transfer", "mint"],
      "integrations": ["jupiter", "metaplex"]
    }
  }
}
```

## Additional Notes

- [ ] I have tested this template on a fresh environment
- [ ] I have followed the contributing guidelines
- [ ] This template adds value to the Solana developer ecosystem

---

**Reviewer Notes:**
- After merging, run `npm run update-template-readmes` to regenerate metadata
- Verify the template appears correctly in `templates.json`