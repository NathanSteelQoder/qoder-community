# Qoder Community - Deployment & Build Guide

Comprehensive guide for building, testing, and deploying the Qoder Community platform.

## Table of Contents

1. [Build Pipeline](#build-pipeline)
2. [Local Development](#local-development)
3. [Production Deployment](#production-deployment)
4. [Troubleshooting](#troubleshooting)
5. [Performance Optimization](#performance-optimization)
6. [CI/CD Configuration](#cicd-configuration)

---

## Build Pipeline

### Overview

```
Source Files              Astro Build                Output
(.md, .astro, .ts)  →    Processing       →         (dist/)
├─ Content                ├─ Markdown → HTML         ├─ HTML pages
├─ Components            ├─ Astro → SSG              ├─ CSS
├─ TypeScript            ├─ TypeScript → JS          ├─ JavaScript
├─ CSS                   ├─ Image optimization       ├─ Assets
└─ Assets                └─ Minification             └─ Manifest

                                                    ↓
                                          Cloudflare Pages
                                          (Auto-deploy on push)
```

### Build Command

```bash
npm run build
```

**What happens**:
1. Validates TypeScript with `astro check`
2. Processes all markdown files
3. Renders Astro components to static HTML
4. Bundles and minifies JavaScript
5. Optimizes CSS
6. Copies assets to dist/
7. Generates sitemap and manifest

**Output**: `dist/` directory (~50-100MB depending on assets)

**Build Time**: ~4 seconds (fast!)

**Success Indicator**:

```
✓ Done in Xs

dist/index.html          XX kB
dist/skills/index.html   XX kB
...
```

### Build Environment Variables

None currently required for basic builds.

For future integrations (analytics, etc):
- `PUBLIC_*` prefix required for client-side access
- Non-public vars use standard NODE_ or custom naming
- Add to `.env` file (never commit secrets)

### Asset Optimization

Astro automatically optimizes assets:

**Images**:
- Formats: WebP primary, PNG/JPEG fallback
- Responsive sizes generated
- Lazy loading by default

**CSS**:
- Scoped to components (Astro feature)
- Minified in production
- Unused CSS removed (tree-shaking)

**JavaScript**:
- Only shipped for interactive components
- Minimal total: ~2.5KB for SkillFilter + RoleSelector
- Island architecture (load on demand)

---

## Local Development

### Prerequisites

- Node.js 18+
- npm or pnpm
- Git

### Initial Setup

```bash
# Clone repository
git clone https://github.com/Qoder-AI/qoder-community.git
cd qoder-community

# Install dependencies
npm install

# Verify install
npm run build  # Should complete without errors
```

### Development Server

```bash
npm run dev
```

**Output**:

```
  🧑‍🚀 Astro v5.6.1 ready in 500ms

  Local      http://localhost:4321/
  Network    Use --host to expose
```

**Features**:
- Hot module reloading (HMR) - changes appear instantly
- Error overlay for build errors
- Markdown preview with syntax highlighting
- Full dev server at `http://localhost:4321`

### Development Workflow

1. **Add/Edit Content**:
   ```bash
   # Create new skill
   echo "---
   name: my-skill
   title: My Awesome Skill
   # ... frontmatter ...
   ---
   
   # Content here
   " > src/content/skills/my-skill.md
   ```
   Changes auto-reload in browser

2. **Edit Components**:
   ```astro
   --- src/components/MyComponent.astro
   // Edit component
   ---
   Changes auto-reload
   ```

3. **Update Styles**:
   ```css
   /* Edit src/styles/custom.css or component <style> */
   /* Changes auto-reflect */
   ```

4. **Test Navigation**:
   - Switch language: Click language switcher or navigate `/zh/`
   - Test filters: Click category pills on /skills/
   - Test role selector: Click role buttons on /skills/

### Testing Locally

**Build test** (catches most issues):

```bash
npm run build
```

**Preview production build**:

```bash
npm run preview
```

This runs a simple HTTP server of the `dist/` directory, simulating production.

**TypeScript checking**:

```bash
npm run astro check
```

Validates all TypeScript without building.

---

## Production Deployment

### Deployment Target: Cloudflare Pages

**Setup**: Already configured in repository

**Git Integration**: 
- Push to GitHub → Automatic webhook to Cloudflare
- ~1-2 minute deploy time

### Deployment Process

```
1. Commit and Push to GitHub
   $ git add .
   $ git commit -m "feat: add new skill"
   $ git push origin main

2. GitHub webhook triggers Cloudflare build

3. Cloudflare receives webhook:
   - Clone repository
   - Run `npm install`
   - Run `npm run build`
   - Deploy `dist/` to edge network

4. Live at https://qoder-community.pages.dev
   - Global CDN distribution
   - Cached at 200+ locations
   - ~50ms latency globally

5. Check status:
   https://dash.cloudflare.com → Pages → Deployments
```

### Manual Deploy (if needed)

1. **Build locally first**:
   ```bash
   npm run build
   ```

2. **Verify output**:
   ```bash
   npm run preview
   # Test at http://localhost:3000
   ```

3. **Push to deploy**:
   ```bash
   git push origin main
   ```

### Deploy from Feature Branch

For testing before main:

```bash
git push origin feature-branch
# Push triggers deploy
# Get preview URL from Cloudflare dashboard
```

### Rollback Procedure

If issues after deploy:

1. **Identify issue**:
   - Check Cloudflare dashboard for errors
   - Review build logs
   - Check GitHub Actions if enabled

2. **Rollback options**:
   - **Fast rollback**: Cloudflare Pages → Deployments → Redeploy previous
   - **Git rollback**: `git revert <commit-hash>` && git push
   - **Revert last commit**: `git reset --soft HEAD~1` && fix && push

3. **Verify rollback**:
   - Check site at https://qoder-community.pages.dev
   - Verify content loaded correctly

### Deployment Checklist

Before pushing to main:

- [ ] All content files valid (run build locally)
- [ ] No TypeScript errors (`npm run astro check`)
- [ ] Tested in preview (`npm run preview`)
- [ ] Commit message clear and descriptive
- [ ] No secrets committed (.env file in .gitignore)
- [ ] Bilingual content complete (English + Chinese)

---

## Troubleshooting

### Build Failures

#### Error: "Content collection `skills` has invalid frontmatter"

**Cause**: Frontmatter doesn't match schema (missing required field or wrong type)

**Solution**:
```bash
# Check specific skill file
cat src/content/skills/problematic-skill.md

# Fix frontmatter:
# - Ensure 'name' field is kebab-case
# - Check 'category' is one of 9 allowed values
# - Verify 'githubUrl' is valid URL
# - Ensure 'date' is YYYY-MM-DD format
```

**Example fix**:

```yaml
# ❌ Wrong
name: My Skill Name              # Should be kebab-case
category: web-development        # Not valid (should be 'development')
date: Jan 1, 2026               # Wrong format

# ✅ Correct
name: my-skill-name
category: development
date: 2026-01-01
```

#### Error: "Cannot find module '@astrojs/starlight'"

**Cause**: Dependencies not installed or corrupted

**Solution**:

```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

#### Error: Image files not found

**Cause**: Asset reference path incorrect or file missing

**Solution**:

```bash
# Check asset exists
ls -la public/images/skills/share/

# Fix references in frontmatter
# Wrong: shareImage: "skill-name-share.png"
# Correct: shareImage: "/images/skills/share/skill-name-share.png"
```

#### Error: "Type 'CollectionEntry<'skills'>' not assignable"

**Cause**: TypeScript type mismatch in component

**Solution**:

```bash
# Run type check
npm run astro check

# Fix type issues
npx astro check --fix
```

### Content Issues

#### Skill not appearing on site

**Checklist**:
1. File in correct directory (`src/content/skills/` for English)
2. Frontmatter valid (matches schema)
3. Frontmatter has `name` field (must match filename)
4. Rebuild site: `npm run build`
5. Check for underscore prefix (files starting with `_` are excluded)

#### Images not loading

**Issue**: Image URLs showing broken links

**Debug**:

```bash
# Check public/ directory structure
ls -la public/images/

# Common path issues:
# Wrong: images/my-image.png (relative, broken)
# Correct: /images/my-image.png (absolute)

# Verify in markdown:
# ![alt text](/images/correct-path.png)
```

#### Translation not showing

**Issue**: Chinese/English text not translating correctly

**Debug**:

1. **Check language detection**:
   - URL should be `/zh/skills/` for Chinese
   - Not `/skills/` with Chinese locale

2. **Check i18n mappings**:
   ```bash
   # View ui.ts
   grep "your-key" src/i18n/ui.ts
   
   # If missing, add to both languages
   ```

3. **For skill translations**:
   ```bash
   grep "skill-slug" src/i18n/skills-translations.ts
   
   # If missing, add to translations
   ```

### Performance Issues

#### Build getting slower

**Solution**:

```bash
# Clean Astro cache
rm -rf .astro/

# Clean and rebuild
rm -rf dist/ .astro/
npm run build

# Check size of content collections
find src/content -type f | wc -l  # Should be <500 files

# If many files, consider archiving old content
```

#### Site feels sluggish

**Solutions**:

1. **Check payload size**:
   ```bash
   # Analyze build
   npm run build
   # Check dist/ size (should be <100MB)
   ```

2. **Reduce JavaScript**:
   - Minimize interactive components
   - Use static HTML where possible
   - Check for unnecessary scripts

3. **Optimize images**:
   - Use WebP format
   - Compress before upload
   - Resize to max 1200px width
   - Run through: https://tinypng.com/

---

## Performance Optimization

### Lighthouse Scores

Target: 95+ across all metrics

**Current baseline**: 98-100 (Performance, Accessibility, Best Practices, SEO)

### Build Optimization Tips

1. **Minimize markdown files**:
   ```bash
   # Check for large files
   find src/content -type f -exec wc -l {} \; | sort -n | tail -20
   ```

2. **Lazy load images**:
   ```astro
   <img src="/image.jpg" loading="lazy" alt="description" />
   ```

3. **Use native HTML**:
   - Prefer `<img>` over image components where possible
   - Use `<a>` for navigation (faster than client-side routing)

### Runtime Performance

1. **Minimize JavaScript**:
   - Current: 2.5KB (SkillFilter + RoleSelector only)
   - Load interactive components only where needed

2. **Edge caching**:
   - Cloudflare automatically caches HTML
   - Cache headers already optimized

3. **Content delivery**:
   - Assets served from 200+ global edge locations
   - Typical latency: <50ms

### SEO Optimization

Currently implemented:
- Sitemap auto-generated
- Meta tags from frontmatter
- Open Graph tags for social sharing
- Structured data (JSON-LD for skills)
- Mobile responsive design

### Pagefind Search Index

Currently disabled. To enable full-text search:

1. **Install pagefind**:
   ```bash
   npm install -D pagefind
   ```

2. **Build index**:
   ```bash
   npm run build
   npx pagefind --source dist
   ```

3. **Add search UI**: Create search component with Pagefind API

---

## CI/CD Configuration

### GitHub Actions (Future)

To automate testing and deployment:

```yaml
# .github/workflows/build-and-deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run astro check
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: qoder-community
          directory: dist
```

### Pre-commit Hooks

Prevent accidental commits of secrets:

```bash
# Install git-secrets
brew install git-secrets

# Configure patterns
git secrets --register-aws

# Run pre-commit hook
pre-commit install
```

---

## Deployment Monitoring

### Check Deploy Status

```bash
# Cloudflare Pages dashboard
https://dash.cloudflare.com

# GitHub deployments
https://github.com/Qoder-AI/qoder-community/deployments
```

### Health Check

```bash
# Test homepage loads
curl -I https://qoder-community.pages.dev

# Check specific page
curl https://qoder-community.pages.dev/skills/

# Verify image assets
curl -I https://qoder-community.pages.dev/images/qoder-logo.png
```

### Error Tracking

**Check build logs**:
1. Go to Cloudflare Pages dashboard
2. Click repository
3. View "Deployments" tab
4. Click "View Details" on failed build
5. Scroll to "Build & Deployment" logs

### Traffic Analytics

Available in Cloudflare Analytics:
- Requests per day
- Geographic distribution
- Cache hit ratio
- Error rates

---

## Disaster Recovery

### Backup Strategy

Source of truth: **GitHub repository**

- All content files version controlled
- Commit history preserved
- Can rollback to any commit

### Data Loss Prevention

1. **Content**: Always in git (src/content/)
2. **Configuration**: In git (astro.config.mjs, etc)
3. **Assets**: In git (public/images/)
4. **Dependencies**: Locked via package-lock.json

### Recovery Procedures

**Accidental file deletion**:

```bash
git reset HEAD~1
# Restore deleted file
git checkout <file-path>
```

**Corrupted dist folder** (safe to delete):

```bash
rm -rf dist/
npm run build
# Rebuilds cleanly
```

**Full disaster recovery**:

```bash
# Clone fresh
git clone https://github.com/Qoder-AI/qoder-community.git fresh-copy
cd fresh-copy
npm install
npm run build
# Ready to deploy
```

---

## Common Operations

### Adding a New Skill

```bash
# 1. Create English version
cat > src/content/skills/new-skill.md << 'EOF'
---
name: new-skill
title: My New Skill
description: What this skill does
category: development
author: Your Name
githubUrl: https://github.com/repo
date: 2026-04-01
---

## Usage

Describe how to use this skill...
EOF

# 2. Create Chinese version
cat > src/content/skills-zh/new-skill.md << 'EOF'
---
name: new-skill
title: 我的新 Skill
description: 这个 Skill 做什么
category: development
author: Your Name
githubUrl: https://github.com/repo
date: 2026-04-01
---

## 使用方法

描述如何使用这个 Skill...
EOF

# 3. Build and test
npm run build

# 4. Preview
npm run preview
# Visit http://localhost:3000/skills/new-skill/

# 5. Commit and push
git add src/content/skills/new-skill.md src/content/skills-zh/new-skill.md
git commit -m "feat: add new-skill"
git push
```

### Updating Site Copy

```bash
# Edit markdown content
vim src/content/skills/existing-skill.md

# Rebuild
npm run build

# Preview changes
npm run preview

# Commit
git add src/content/skills/existing-skill.md
git commit -m "docs: update skill description"
git push
```

### Fixing Typos/Bugs

```bash
# Quick fix workflow
npm run dev          # See live changes
# Edit files
npm run build        # Verify no build errors
git add .
git commit -m "fix: typo in skill description"
git push
```

---

## Additional Resources

- **Astro Docs**: https://docs.astro.build/
- **Starlight Docs**: https://starlight.astro.build/
- **Cloudflare Pages**: https://pages.cloudflare.com/
- **GitHub Pages Deploy**: https://docs.github.com/en/pages
