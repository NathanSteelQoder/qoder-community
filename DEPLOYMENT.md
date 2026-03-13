# Deployment Guide

Qoder Community is deployed on **Cloudflare Pages** with automatic deployments triggered by commits to the `main` branch.

## Table of Contents

- [Deployment Architecture](#deployment-architecture)
- [Automatic Deployments](#automatic-deployments)
- [Environment Configuration](#environment-configuration)
- [Build Process](#build-process)
- [Troubleshooting](#troubleshooting)
- [Performance Optimization](#performance-optimization)

## Deployment Architecture

### Target Platform

- **Host**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **Site URL**: https://qoder-community.pages.dev
- **Repository**: https://github.com/Qoder-AI/qoder-community
- **Build Framework**: Astro
- **Node Version**: 18.x or higher

### Key Characteristics

- **Static site generation** - Full pre-rendering at build time
- **No server-side code** - Pure HTML, CSS, JavaScript
- **CDN delivery** - Global distribution via Cloudflare edge network
- **Instant deploys** - Changes live within 1-2 minutes
- **Zero downtime** - Blue-green deployment strategy

## Automatic Deployments

### Deployment Flow

```
1. Commit pushed to main branch
   ↓
2. GitHub webhook triggers Cloudflare Pages
   ↓
3. Build job starts (usually within 10-30 seconds)
   ↓
4. Dependencies installed (npm install)
   ↓
5. Build command executed (npm run build)
   ↓
6. Build artifacts validated (dist/ directory)
   ↓
7. Site deployed to Cloudflare edge network
   ↓
8. Live within 1-2 minutes
```

### Build Command Configuration

The build command is configured in Cloudflare Pages dashboard:

```bash
npm run build
```

This runs:
1. Astro build process (`astro build`)
2. Static site generation for all pages and collections
3. Pagefind search index generation
4. TypeScript type checking
5. Output to `dist/` directory

### Deployment Triggers

Automatic deployments occur on:

- **Push to main branch** - Production deployment
- **Pull request creation** - Preview deployment (automatic)
- **Pull request update** - Preview deployment updated

Pull request preview URLs are available in the PR checks section.

## Environment Configuration

### Build Environment Variables

Currently, no environment variables are required for production builds. All configuration is committed to the repository.

### Cloudflare Pages Settings

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
dist
```

**Node Version:**
```
18.x
```

### Future Configuration (if needed)

If environment-specific configuration becomes necessary:

1. Add variables in **Settings > Environment variables**
2. Set for both **Production** and **Preview** environments
3. Reference in build scripts as `process.env.VARIABLE_NAME`
4. Document required variables in this file

## Build Process

### Local Build (Testing Before Deployment)

Test the complete build locally before pushing:

```bash
# Clean previous build artifacts
rm -rf dist .astro

# Install dependencies (if not already done)
npm install

# Run production build
npm run build

# Preview the built site locally
npm run preview
```

Visit `http://localhost:3000` to test the production build.

### Build Steps Explained

The `npm run build` command executes these Astro steps:

1. **Content Loading** - Reads all Markdown/MDX from `src/content/`
2. **Schema Validation** - Validates against schemas in `src/content.config.ts`
3. **Component Rendering** - Renders all `.astro` components to HTML
4. **Page Generation** - Creates static HTML files in `dist/`
5. **Asset Optimization** - Minifies CSS and JavaScript
6. **Search Index** - Generates Pagefind search index
7. **Sitemap** - Creates `sitemap.xml` for SEO

### Build Performance

Typical build times:
- **Local development**: ~4-5 seconds
- **Cloudflare Pages CI**: ~30-60 seconds (including dependency installation)

Build artifacts:
- **Size**: ~15-20 MB (before Cloudflare compression)
- **Pages generated**: 100+ static HTML files
- **JavaScript shipped**: ~2.5 KB (minimal)

## Troubleshooting

### Build Fails on Cloudflare Pages

**Symptom**: Build job fails with error, site not deploying.

**Solution**:

1. **Check build logs** - Click the failed deployment in Cloudflare Pages dashboard
2. **Reproduce locally** - Run `npm run build` locally
3. **Check for issues**:
   - Missing dependencies: Run `npm install`
   - TypeScript errors: Run `npx astro check`
   - Content schema violations: Verify frontmatter in Markdown files
   - Invalid links: Check all URL references

4. **Common errors**:
   ```bash
   # Error: Cannot find module
   npm install
   npm run build

   # Error: Unsupported TypeScript syntax
   npx astro check  # Check for type errors

   # Error: Content collection schema error
   # Fix frontmatter in src/content/* files
   ```

### Build Succeeds But Site Shows Errors

**Symptom**: Build passes but site shows 404 or styling issues.

**Solution**:

1. **Clear cache** - Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)
2. **Check recent commits** - Revert last commit if error just appeared
3. **Verify assets** - Check that images are in `public/` directory
4. **Check routing** - Verify Astro routes in `src/pages/`

### Partial Content Missing After Deploy

**Symptom**: Some skills/agents/content not showing on live site.

**Solution**:

1. **Verify frontmatter** - All required fields must be present
2. **Check content schema** - Must match schema in `src/content.config.ts`
3. **Validate Markdown** - No syntax errors in content files
4. **Rebuild locally** - Run `npm run build` to check for warnings

Example frontmatter issue:
```markdown
---
title: "Skill Name"
description: "Required description"
category: "development"
author: "Author Name"
date: 2026-03-13  # Required: must be valid date
---
```

### Search (Pagefind) Not Working

**Symptom**: Search bar appears but returns no results.

**Solution**:

1. **Check Pagefind generated files** - Should exist in `dist/_pagefind/`
2. **Verify content is indexable** - Check that `.md` files render correctly
3. **Clear search cache** - Hard refresh browser
4. **Check browser console** - Look for JavaScript errors

## Performance Optimization

### Monitoring

- **Lighthouse scores** - Target 95+ (98-100 typical)
- **Bundle size** - Keep below 50 KB (currently ~2.5 KB)
- **Build time** - Keep below 2 minutes on CI

Check scores at:
- https://pagespeed.web.dev/ (Google PageSpeed Insights)
- DevTools > Lighthouse (Chrome)

### Optimization Strategies

#### Image Optimization

- **Format**: Use WebP with PNG fallback
- **Compression**: Run images through optimization tools before commit
- **Size**: Share images should be 1200x630 PNG (~50-100 KB)
- **Location**: `public/images/` directory

```bash
# Compress images before committing
# Example with ImageMagick
convert input.png -quality 85 -strip output.png
```

#### CSS Performance

- **Minification**: Automatic via Astro build
- **Unused CSS**: Remove unused classes in `src/styles/custom.css`
- **Vendor prefixes**: Let Astro handle automatically

#### JavaScript Performance

- **Code splitting**: Astro automatically code-splits components
- **Lazy loading**: Images use native `loading="lazy"`
- **Minimal JS**: Keep JavaScript to essential interactivity only

#### Content Delivery

- **HTTP/2 Server Push**: Handled by Cloudflare
- **Compression**: Gzip and Brotli handled by Cloudflare
- **Caching**: CDN edge caching (24 hours default)
- **Purge cache**: Done automatically on new deploys

### Cache Invalidation

Cache is automatically purged on every deployment. No manual cache purge needed.

For emergency cache purge:
1. Go to Cloudflare Dashboard
2. Select domain `qoder-community.pages.dev`
3. Go to **Caching > Purge Cache**
4. Select **Purge Everything**

## Rollback Procedure

If a deploy introduces bugs:

### Option 1: Automatic Rollback (Fastest)

1. Navigate to **Deployments** in Cloudflare Pages
2. Find the previous successful deployment
3. Click **Rollback to this Deployment**
4. Site reverts to previous version within seconds

### Option 2: Git Rollback

1. **Local rollback**:
   ```bash
   git revert <bad-commit-hash>
   git push origin main
   ```

2. Cloudflare Pages automatically deploys the new revert commit
3. Site returns to previous state within 1-2 minutes

### Option 3: Manual Fix

1. Fix the bug locally
2. Commit and push to main
3. Wait for automatic deployment

## Deployment Checklist

Before pushing to production:

- [ ] Run `npm run build` locally - no errors
- [ ] Run `npm run preview` - site renders correctly
- [ ] Run `npx astro check` - no TypeScript errors
- [ ] Test locally at `http://localhost:3000` - all features work
- [ ] Verify no console errors (F12 > Console)
- [ ] Check links and navigation
- [ ] Test on mobile device if UI changes
- [ ] Verify images load correctly

## Support and Escalation

### Issues to Report

- Build consistently fails
- Deployment stuck in progress
- Production site down or inaccessible
- Performance degradation

### Contact

- **Repository Issues**: https://github.com/Qoder-AI/qoder-community/issues
- **Cloudflare Status**: https://www.cloudflarestatus.com/

---

**Last Updated**: 2026-03-13  
**Audience**: Developers, DevOps, Site Maintainers  
**Related Docs**: [README.md](README.md), [CONTRIBUTING.md](CONTRIBUTING.md), [DEVELOPMENT.md](DEVELOPMENT.md)
