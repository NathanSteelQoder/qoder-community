# Deployment & CI/CD Guide

This guide explains how the Qoder Community site is built, tested, and deployed to production.

## Table of Contents

- [Deployment Overview](#deployment-overview)
- [Cloudflare Pages Setup](#cloudflare-pages-setup)
- [Build Pipeline](#build-pipeline)
- [GitHub Actions Workflow](#github-actions-workflow)
- [Troubleshooting Deployments](#troubleshooting-deployments)
- [Performance & Optimization](#performance--optimization)
- [Rollback Procedures](#rollback-procedures)

---

## Deployment Overview

The Qoder Community site is:

- **Hosted on**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **Live site**: https://qoder-community.pages.dev
- **Repository**: https://github.com/Qoder-AI/qoder-community
- **Deploy trigger**: Git push to `main` branch
- **Build time**: ~5 minutes total
- **Deployment time**: ~1-2 minutes after build

### Architecture

```
Developer Push
    ↓
GitHub.com/qoder-community
    ↓
GitHub Webhook → Cloudflare
    ↓
Build Server (Cloudflare)
    ├─ npm install
    ├─ npm run build
    ├─ Validate output
    └─ Deploy to Edge
    ↓
Live at https://qoder-community.pages.dev
    ↓
Cached globally on Cloudflare CDN
```

---

## Cloudflare Pages Setup

### Initial Configuration

The project is configured in Cloudflare Pages dashboard:

**Build Settings:**
- **Framework**: Astro
- **Build command**: `npm run build`
- **Build output directory**: `dist/`
- **Node.js version**: 18 (automatically detected)
- **Environment**: Production

**Custom Domain:**
- Primary domain: `qoder-community.pages.dev` (provided by Cloudflare)
- Custom domain: Can be added in Cloudflare dashboard

### Environment Variables

To add environment variables:

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to Pages → qoder-community
3. Click **Settings** → **Environment variables**
4. Add variables (if needed for build):

**Example:**
```
Variable Name: SITE_URL
Value: https://qoder-community.pages.dev
```

Currently, the project doesn't require env vars for build or runtime.

### Build Triggers

Deployments are automatically triggered by:

1. **Git push to main**
   ```bash
   git push origin main
   ```
   Deployment starts immediately

2. **Pull Request creation**
   - Automatic preview deployment created
   - URL: `https://<branch-name>--qoder-community.pages.dev`
   - Deleted when PR is closed

3. **Manual trigger** (in Cloudflare dashboard)
   - Go to Pages → qoder-community → Deployments
   - Click "Retry deployment"

---

## Build Pipeline

### Build Process

When code is pushed to `main`:

#### Stage 1: Environment Setup (30 sec)

```bash
# Cloudflare runs:
Node version detected: v18.x
Build command: npm run build
Build directory: dist/
```

#### Stage 2: Dependency Installation (60 sec)

```bash
npm install

# Output:
added 500+ packages in 45s
```

#### Stage 3: Build (90 sec)

```bash
npm run build

# Astro output:
[00:00] Collecting build info
[00:02] Building static entrypoints
[00:05] Building client
[00:08] Generating static routes
[00:09] Completed in 90ms
```

Detailed steps:
1. TypeScript type checking
2. Content collection loading (validates all .md files)
3. Astro component compilation
4. Static HTML generation for each page
5. Asset optimization (CSS minification, code splitting)

#### Stage 4: Artifact Preparation (30 sec)

```bash
# Generate deployment artifacts:
dist/index.html               # Homepage
dist/skills/index.html        # Skills page
dist/skills/[slug]/index.html # Individual skill pages
dist/agents/index.html
dist/learn/index.html
dist/meetups/index.html
dist/showcase/index.html
dist/zh/                      # Chinese versions
dist/_astro/                  # Optimized JS/CSS
dist/images/                  # Static images
```

#### Stage 5: Deploy (120 sec)

```bash
Uploading files to Cloudflare...
✓ Deployment complete
URL: https://qoder-community.pages.dev
```

### Build Output Analysis

After a successful build, `dist/` contains:

```
dist/
├── index.html              (18 KB) Homepage
├── _astro/
│   ├── *.js               (Gzip: 2-20 KB each)
│   ├── *.css              (Gzip: 3-5 KB each)
│   └── *.woff2            (Google Fonts)
├── skills/
│   ├── index.html         (52 KB) Skills page
│   └── [slug]/index.html  (35-45 KB each) Individual skills
├── agents/
├── learn/
├── meetups/
├── showcase/
├── zh/                    (Chinese versions)
├── images/                (Compressed PNGs)
└── favicon.ico

Total: ~25-30 MB
```

### Performance Metrics

**Build Performance:**
- Fresh build: ~90 seconds
- Incremental build: ~30 seconds (fewer changes)
- Production size: ~25 MB

**Runtime Performance:**
- Lighthouse score: 98-100
- First Contentful Paint: <0.5s
- Largest Contentful Paint: <1.2s
- Cumulative Layout Shift: <0.1

**Network:**
- Global CDN via Cloudflare
- ~50ms response times worldwide
- Cached at edge for instant delivery

---

## GitHub Actions Workflow

Currently, the project has minimal CI/CD in GitHub Actions. Deployments are fully managed by Cloudflare Pages webhook.

### To Add Custom CI/CD

Create `.github/workflows/build.yml`:

```yaml
name: Build and Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: npm
      
      - name: Install dependencies
        run: npm install
      
      - name: Type check
        run: npx astro check
      
      - name: Build
        run: npm run build
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
```

This workflow:
- Runs on every push and PR
- Checks TypeScript types
- Validates content
- Builds the site
- Saves artifacts for inspection

---

## Troubleshooting Deployments

### Deployment Failed: Build Error

**Symptom:** Cloudflare dashboard shows "Build failed"

**Solutions:**

1. **Check build logs:**
   - Cloudflare Dashboard → Pages → qoder-community → Deployments
   - Click failed deployment → View build logs
   - Look for error message

2. **Common causes:**
   - Content validation error (invalid YAML in .md file)
   - TypeScript error in components
   - Missing dependency

3. **Fix and retry:**
   ```bash
   # Verify locally
   npm run build
   
   # Fix issues
   # ... edit files ...
   
   # Push fix
   git add .
   git commit -m "fix: build error"
   git push origin main
   ```

### Build Error: "No files found matching..."

**Error:**
```
[WARN] [glob-loader] No files found matching "**/*{.md,.mdx}..." in directory "src/content/agents"
```

**This is expected** for empty collections. It's a warning, not an error. The build should still succeed.

**Suppress (optional):**
Edit `astro.config.mjs` and empty collection directories are skipped.

### Deployment Stuck

**Symptom:** Deployment shows "In Progress" for >10 minutes

**Solution:**
1. Wait 15 minutes (sometimes slow)
2. If still stuck, cancel in Cloudflare dashboard
3. Manually retry deployment
4. If persists, contact Cloudflare support

### Site Shows Old Content

**Symptom:** Changes not visible after deploy

**Solution:**

1. **Hard refresh browser:**
   - Windows: Ctrl+Shift+Delete
   - macOS: Cmd+Shift+Delete
   - Or open DevTools → right-click refresh → "Empty cache and hard refresh"

2. **Check deployment status:**
   - Cloudflare Dashboard → Deployments
   - Verify latest deployment shows "Success"

3. **Purge Cloudflare cache:**
   - Cloudflare Dashboard → Caching → Purge Cache
   - Select "Purge Everything"
   - Wait 5 minutes for propagation

### 404 on New Skill Pages

**Symptom:** New skill file committed but page returns 404

**Checklist:**

1. ✅ File deployed successfully (check logs)
2. ✅ Filename matches URL slug (e.g., `my-skill.md` → `/skills/my-skill/`)
3. ✅ No validation errors in build logs
4. ✅ Content validation passed (`npx astro check`)
5. ✅ Cache purged in Cloudflare

**Debug:**
```bash
# Verify file was built
npm run build
ls dist/skills/my-skill/

# Should show: index.html

# If not, run type check
npx astro check
```

### Deployment Success But Site Down

**Symptom:** Deployment shows "Success" but site returns 500 error

**Solutions:**

1. **Wait for CDN propagation** (1-2 minutes)
2. **Check Cloudflare status:** https://www.cloudflarestatus.com/
3. **Verify DNS:** Cloudflare Dashboard → DNS → Check A record points to Cloudflare nameservers
4. **Contact Cloudflare support** if issue persists

---

## Performance & Optimization

### Build Optimization

The Astro build includes automatic optimizations:

1. **CSS Minification**
   - Removes whitespace and comments
   - Extracts critical CSS
   - Inline above-fold CSS

2. **JavaScript Code Splitting**
   - Separate bundles for each page
   - Only load needed code
   - Deferred loading for non-critical JS

3. **Image Optimization**
   - Lossless compression
   - WebP format for supported browsers
   - Responsive image sizing

4. **Asset Hashing**
   - Unique hash per build: `style.a1b2c3.css`
   - Long-term caching (1 year)
   - Busts cache on content change

### Monitoring

**Lighthouse Scores:**
- Run in Cloudflare dashboard → Pages → qoder-community → Analytics

**Performance Metrics:**
- Real User Monitoring (RUM)
- Core Web Vitals
- Response times by region

### Cache Headers

Cloudflare automatically sets:

```http
Cache-Control: public, max-age=3600, s-maxage=604800
# 1 hour browser cache, 7 days edge cache

X-Cache: HIT (served from cache)
```

---

## Rollback Procedures

### Quick Rollback (Last Deploy)

**In Cloudflare Dashboard:**

1. Pages → qoder-community → Deployments
2. Find previous "Success" deployment
3. Click three-dot menu → "Rollback to this deployment"
4. Confirm

**Time to live:** ~2 minutes

### Full Rollback (Git History)

If you need to revert code changes:

```bash
# Find commit to revert to
git log --oneline | head -10

# Reset to that commit
git reset --hard <commit-hash>

# Force push
git push --force-with-lease origin main
```

⚠️ **Warning:** Force push should rarely be needed. Consider reverting commits instead:

```bash
# Safer: Create new commit that undoes changes
git revert <commit-hash>
git push origin main
```

### Rollback Strategy

**If production is broken:**

1. **Immediate (< 5 min):**
   - Use Cloudflare rollback if last deploy caused issue
   - Cloudflare → Deployments → Rollback

2. **Short term (< 1 hour):**
   - Revert problematic commit
   - `git revert <hash>` and push
   - Cloudflare auto-deploys new build

3. **Long term:**
   - Review what went wrong
   - Add validation to prevent recurrence
   - Update deployment checklist

### Deployment Checklist

Before pushing to main:

- [ ] Ran `npm run build` locally - succeeded
- [ ] Ran `npx astro check` - no errors
- [ ] Tested in dev: `npm run dev` - looks correct
- [ ] For content: Verified bilingual versions exist
- [ ] For content: Validated YAML syntax (`npx astro check`)
- [ ] Created meaningful commit message
- [ ] Pushed to correct branch (`main`)

---

## Monitoring & Alerts

### Health Checks

Monitor deployment health:

1. **Cloudflare Analytics:**
   - Pages → qoder-community → Analytics
   - View requests, bandwidth, errors

2. **GitHub Workflow Status:**
   - Repository → Actions
   - View recent workflow runs

3. **Uptime Monitoring:**
   - Set up external monitor (e.g., Uptime Robot)
   - Ping https://qoder-community.pages.dev every 5 min
   - Alert if status != 200

### Logs

**Build Logs:**
- Cloudflare Dashboard → Pages → qoder-community → Deployments
- Click deployment → View build logs

**Runtime Logs:**
- Cloudflare Dashboard → Pages → qoder-community → Analytics
- View error logs and traffic patterns

---

## Reference

### Useful Links

- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Astro Docs**: https://docs.astro.build/
- **Repository**: https://github.com/Qoder-AI/qoder-community
- **Live Site**: https://qoder-community.pages.dev

### Commands Cheat Sheet

```bash
# Local development
npm run dev               # Start dev server
npm run build             # Production build
npm run preview           # Preview production build

# Validation
npx astro check          # Type check + content validation

# Deployment (automatic, but here's what Cloudflare runs)
npm install              # Install deps
npm run build            # Build
# Deploy to CDN (automatic)
```

---

*Last updated: May 8, 2026*
