# Deployment Guide

This guide covers deploying Qoder Community to production on Cloudflare Pages.

## Table of Contents

- [Deployment Architecture](#deployment-architecture)
- [Automatic Deployments](#automatic-deployments)
- [Build Configuration](#build-configuration)
- [Environment Setup](#environment-setup)
- [Deploying Manually](#deploying-manually)
- [Monitoring & Rollback](#monitoring--rollback)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

## Deployment Architecture

### Production Environment

- **Platform**: Cloudflare Pages
- **Site URL**: https://qoder-community.pages.dev
- **Repository**: https://github.com/Qoder-AI/qoder-community
- **Branch**: `main` (auto-deploys on push)
- **CDN**: Cloudflare global edge network
- **Build Framework**: Astro 5.6+
- **Node Version**: 18.x or higher
- **Build Command**: `npm run build`
- **Output Directory**: `dist/`

### Key Characteristics

✅ **Static Site Generation**: No server runtime needed
✅ **Zero-Downtime Deployments**: Blue-green strategy
✅ **Global CDN**: Content cached on Cloudflare edge
✅ **Instant Rollback**: Previous builds available
✅ **HTTPS**: Automatic SSL/TLS
✅ **Analytics**: Built-in Cloudflare analytics

## Automatic Deployments

### Deployment Flow

```
1. Developer pushes to main branch
   ↓
2. GitHub webhook triggers Cloudflare Pages
   ↓
3. Build job starts (usually within 10-30 seconds)
   ↓
4. npm install (installs dependencies from package-lock.json)
   ↓
5. npm run build (generates dist/ directory)
   ↓
6. Cloudflare validates build artifacts
   ↓
7. Pages deployed to edge network
   ↓
8. Previous version remains available for rollback
   ↓
✅ Live in 1-2 minutes
```

### Deployment Status

Check deployment status:
1. GitHub Actions tab: Shows build logs
2. Cloudflare Dashboard: Shows active version
3. Site URL: Verify live deployment

### Commit Triggers Deployment

```bash
git add .
git commit -m "docs: update content"
git push origin main

# ✅ Deployment starts automatically
```

## Build Configuration

### Cloudflare Pages Settings

**Framework preset**: Astro
**Build command**: `npm run build`
**Build output directory**: `dist`

### package.json Scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

### Build Optimization

Astro automatically optimizes for production:

- Tree-shaking unused code
- CSS minification
- JavaScript bundling
- Image optimization
- Prerendering all pages

## Environment Setup

### GitHub Repository

```
https://github.com/Qoder-AI/qoder-community
```

**Important branches**:
- `main` - Production (auto-deploys)
- `preprod` - Pre-production testing
- Feature branches - Development

### Cloudflare Pages Project

**Project name**: `qoder-community`
**Domain**: `qoder-community.pages.dev`

**Custom domains** (if configured):
- Primary: `qoder-community.pages.dev`

### Access Control

- **Repository**: Public access for read, maintainers for write
- **Cloudflare**: Team members with Pages access
- **Deployments**: Triggered automatically by main branch pushes

## Deploying Manually

Manual deployments are rarely needed, but possible.

### Via Cloudflare Dashboard

1. Go to Cloudflare Dashboard
2. Navigate to Pages → qoder-community
3. Click "View details" on desired deployment
4. If needed, revert to previous deployment

### Via GitHub

For force deployments or branch testing:

```bash
# Create temporary deployment branch
git checkout -b temp-deploy
git push origin temp-deploy

# Create Pages project for testing
# (In Cloudflare, connect to temp-deploy branch)
```

### Local Preview Before Deploy

```bash
# Build locally
npm run build

# Preview production build
npm run preview

# Test at http://localhost:3000
```

## Monitoring & Rollback

### Checking Deployment Status

**Cloudflare Pages Dashboard**:
1. Go to qoder-community project
2. View "Deployments" tab
3. See status (✅ Success or ❌ Failed)
4. Check build logs and output

**GitHub Actions**:
1. Go to repository Actions tab
2. View build logs
3. Check deployment status

### Previous Deployments

All deployments are preserved in Cloudflare:

```
✅ Latest production - qoder-community.pages.dev
✅ Previous version - [hash].qoder-community.pages.dev
✅ Previous version - [hash].qoder-community.pages.dev
✅ Previous version - [hash].qoder-community.pages.dev
```

### Rollback Procedure

If current deployment has issues:

1. **Identify previous stable deployment**:
   - Cloudflare Pages → Deployments tab
   - Look for successful build

2. **Rollback via Cloudflare Dashboard**:
   - Click desired deployment
   - Select "Rollback to this deployment"
   - Confirm

3. **Or revert commit in GitHub**:
   ```bash
   git revert HEAD
   git push origin main
   ```

### Rollback Time

- Rollback: Instant (< 30 seconds globally)
- Reason: Content already cached on edge nodes

## Performance Optimization

### Build Size

Current metrics:
- HTML: ~2 MB total (all pages)
- CSS: ~150 KB (critical + deferred)
- JavaScript: ~50 KB (site functionality)
- Images: Optimized per format
- **Total**: ~300 KB average per page (gzipped)

### Lighthouse Scores

Target scores (production):
- Performance: 95+
- Accessibility: 95+
- Best Practices: 100
- SEO: 100

Monitor at: https://pagespeed.web.dev

### Optimization Techniques

1. **Static Generation**: All pages pre-rendered
2. **CSS Critical Path**: Inline critical CSS
3. **Image Optimization**: Astro Assets pipeline
4. **Code Splitting**: Per-page JavaScript
5. **Caching Headers**: Set by Cloudflare
6. **Compression**: gzip + Brotli

### Edge Caching

Cloudflare automatically caches:

- HTML: 30 minutes
- CSS/JS: 1 year (with content hash)
- Images: 1 year
- Fonts: 1 year

Cache invalidation happens automatically on new deployments.

### Search Indexing

Full-text search powered by Pagefind:
- Built during production build
- ~4KB JavaScript + index data
- Supports English and Chinese
- Instant local search (no server needed)

## Troubleshooting

### Build Fails

**Check**: Build logs in Cloudflare Dashboard or GitHub Actions

**Common issues**:
- Missing dependencies: `npm install` locally
- TypeScript errors: `npx astro check`
- Content schema violations: Check frontmatter
- File encoding: Ensure UTF-8

**Fix**:
```bash
# Verify locally
npm install
npx astro check
npm run build

# If successful, push to main
git push origin main
```

### Deployment Takes Too Long

**Typical build time**: 4-6 seconds

**If longer**:
1. Check Cloudflare build logs
2. Verify no large file additions
3. Check network issues
4. Contact Cloudflare support

### Site Shows Old Content

**Cause**: Browser cache or CDN cache

**Fix**:
1. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear cache**: DevTools → Application → Clear site data
3. **Check deployment**: Verify new version deployed
4. **Wait for propagation**: Up to 5 minutes for global CDN

### Search Not Working

**Cause**: Pagefind index not rebuilt

**Check**:
- Build completed successfully
- `dist/pagefind/` directory exists
- JavaScript enabled in browser

**Fix**:
```bash
# Rebuild locally
npm run build

# Verify dist/pagefind exists
ls dist/pagefind/

# Deploy new build
git add .
git commit -m "fix: rebuild search index"
git push origin main
```

### 404 Errors on Specific Pages

**Cause**: Page content missing or schema error

**Check**:
1. File exists in `src/content/`
2. Frontmatter syntax valid (YAML)
3. Required fields present
4. File name and path correct

**Example**:
```bash
# Verify content file
cat src/content/skills/my-skill.md

# Check for YAML errors
npx astro check
```

### Images Not Displaying

**Cause**: Incorrect image path or missing file

**Check**:
1. Image path starts with `/`
2. Image in `public/` directory
3. File exists at that path
4. Format supported (PNG, JPG, GIF, WebP)

**Example paths**:
```
✅ /images/skills/share/postgres-share.png
❌ images/postgres-share.png (missing /)
❌ public/images/postgres-share.png (wrong path)
```

### Sitemap Issues

Sitemap auto-generated during build:

```
dist/sitemap-index.xml
dist/sitemap-0.xml
```

**Verify**:
```bash
# Check generated sitemaps
ls -la dist/sitemap*

# Inspect sitemap
curl https://qoder-community.pages.dev/sitemap-index.xml
```

### Custom Domain Issues

If custom domain configured:

```bash
# Verify DNS
dig qoder-community.pages.dev

# Should resolve to Cloudflare nameservers
```

## Deployment Best Practices

### Before Deploying

1. ✅ Test locally: `npm run build && npm run preview`
2. ✅ Type check: `npx astro check`
3. ✅ Lint: Check for obvious issues
4. ✅ Create meaningful commits
5. ✅ Write clear commit messages

### Commit Messages

```
feat: Add 5 new skills for March
fix: Correct Chinese translation typo
docs: Update deployment guide
style: Align spacing in SkillCard
perf: Optimize image loading
```

### Branching Strategy

```
main (production)
├── feature/add-new-skill
├── fix/translation-issue
└── docs/update-guides
```

### Review Process

1. Create feature branch
2. Make changes and test locally
3. Create Pull Request
4. Review and test
5. Merge to main
6. Auto-deploys within 1-2 minutes

---

For more information, see:
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Local development guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/)
