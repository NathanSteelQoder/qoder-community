# Deployment Guide

This guide covers deploying Qoder Community to production on Cloudflare Pages.

## Production Environment

**Live Site**: https://qoder-community.pages.dev

**Deployment Platform**: [Cloudflare Pages](https://pages.cloudflare.com/)

**Repository**: https://github.com/Qoder-AI/qoder-community

## Automatic Deployment (Recommended)

Cloudflare Pages automatically builds and deploys when you push to the `main` branch.

### Prerequisites

1. **Repository**: Must be connected to Cloudflare Pages (already configured)
2. **Build Settings**: 
   - Framework: Astro
   - Build command: `npm run build`
   - Build output directory: `dist`

### Deployment Flow

```
1. Developer commits and pushes to main branch
   git commit -m "feat: add new skill"
   git push origin main

2. GitHub webhook notifies Cloudflare Pages

3. Cloudflare Pages auto-triggers build:
   npm install
   npm run build
   
4. If build succeeds:
   - Pages are generated and deployed to CDN
   - Live site updates within 1-2 minutes
   - DNS caches invalidate automatically

5. If build fails:
   - Previous production version remains live
   - Build logs available in Cloudflare dashboard
   - Developers receive notification
```

### Monitoring Deployments

**Via GitHub**:
- Go to repository > Actions
- Recent workflows show build status
- Click on workflow for detailed logs

**Via Cloudflare Dashboard**:
- Go to Cloudflare Pages > qoder-community
- Deployments tab shows all builds
- Each deployment links to logs and preview URLs

## Local Verification Before Pushing

Always verify locally before pushing to main:

```bash
# Install dependencies
npm install

# Run type checking
npx astro check

# Build for production
npm run build

# Preview the production build
npm run preview
```

Visit http://localhost:4321 to verify the production build renders correctly.

### Common Pre-push Checks

```bash
# Check for build errors
npm run build 2>&1 | grep -i "error"

# Verify no TypeScript errors
npx astro check

# Ensure content is valid (try loading a page)
npm run preview &
curl http://localhost:4321
```

## Troubleshooting Deployment Failures

### Build Fails Immediately

**Check**: Build logs in Cloudflare Dashboard or GitHub Actions

**Common Causes**:

1. **Syntax Error in Content**
   ```
   Error: Invalid frontmatter in skill-name.md
   
   Solution:
   - Check YAML syntax in frontmatter
   - Run: npm run build locally to catch errors before pushing
   - Verify all required fields are present
   ```

2. **TypeScript Error**
   ```
   Error: src/components/SomeComponent.astro:10:15 - error TS...
   
   Solution:
   - Run: npx astro check locally
   - Fix type errors, commit, and retry
   ```

3. **Missing Dependency**
   ```
   Error: Cannot find module '@astrojs/starlight'
   
   Solution:
   - This shouldn't happen (deps locked)
   - Clear Cloudflare build cache in dashboard
   - Redeploy: push empty commit
   git commit --allow-empty -m "trigger rebuild"
   git push
   ```

### Build Succeeds but Page Shows Error

1. **404 Page**: Route not found
   - Verify route exists in `src/pages/*.astro`
   - Check `astro.config.mjs` sidebar configuration
   - Rebuild and clear browser cache

2. **Content Not Loading**: Skill/agent missing
   - Verify markdown file in correct directory
   - Check frontmatter syntax (YAML)
   - Run `npm run build` locally to verify

3. **Styling Issues**: CSS not applied
   - Check `src/styles/custom.css`
   - Verify CSS variable names in Starlight docs
   - Clear browser cache (Cmd+Shift+Delete)

### Rollback to Previous Version

If a broken build made it to production:

**Option 1: Revert via GitHub** (Recommended)
```bash
# View recent commits
git log --oneline -10

# Revert to previous good commit
git revert <commit-hash>
git push origin main

# Cloudflare Pages auto-redeploys within 1-2 minutes
```

**Option 2: Force Rebuild from Dashboard**
1. Go to Cloudflare Pages > qoder-community > Deployments
2. Find the last successful deployment
3. Click three dots (...) > Retry deployment
4. Cloudflare rebuilds from that commit

**Option 3: Direct HTML Deployment** (Emergency only)
1. Manually build: `npm run build`
2. Upload `dist/` contents to Cloudflare via dashboard
3. (Not recommended: loses version history)

## Performance & Caching

### CDN Caching Strategy

Cloudflare automatically caches:
- **Static assets** (JS, CSS, images): 30 days
- **HTML pages**: 2 hours (Starlight default)
- **API responses**: N/A (static site)

### Cache Invalidation

Cache is **automatically invalidated** on each deployment. No manual cache purge needed.

To force cache purge (rare):
1. Go to Cloudflare Dashboard > Caching > Cache Purge
2. Purge all
3. Wait 30 seconds for propagation

### Lighthouse Scores

Target scores (measured on live site):

| Metric | Target |
|--------|--------|
| Performance | 95+ |
| Accessibility | 95+ |
| Best Practices | 90+ |
| SEO | 100 |

Check current scores:
```bash
# Install Lighthouse CLI
npm install -g @lhci/cli@

# Run audit on live site
lhci autorun --config=lighthouserc.json
```

## Content Updates

### Adding or Updating Skills

1. Create/edit `.md` file in `src/content/skills/` (English) or `src/content/skills-zh/` (Chinese)
2. Follow schema from `src/content.config.ts`
3. Include share image in `public/images/skills/share/`
4. Commit and push to main
5. Deployment happens automatically

### Updating Docs Pages

1. Edit `.md` or `.mdx` file in `src/content/docs/`
2. Commit and push to main
3. Cloudflare rebuilds and deploys within 1-2 minutes

### Publishing Screenshots

```bash
# After updating demo HTML in public/demos/
npm run capture

# This generates screenshots in public/screenshots/
# Commit and push
git add public/screenshots/
git commit -m "docs: update demo screenshots"
git push origin main
```

## Monitoring & Alerts

### Health Checks

**Manual Check**:
```bash
# Test homepage
curl -I https://qoder-community.pages.dev/

# Test a skill page
curl -I https://qoder-community.pages.dev/skills/

# Check sitemap
curl https://qoder-community.pages.dev/sitemap-index.xml
```

**Expected Response**: HTTP 200 OK

### Cloudflare Analytics

1. Go to Cloudflare Dashboard > qoder-community > Analytics
2. Monitor:
   - Requests: Should be consistent day-to-day
   - Cache hit ratio: Should be 80%+
   - Error rates: Watch for 4xx/5xx spikes

### GitHub Actions Workflow

Verify workflow status:
- Go to https://github.com/Qoder-AI/qoder-community/actions
- Most recent workflow should be ✅ green
- Click to view build logs and deployment details

## Credentials & Secrets

**Cloudflare Pages** is configured with:
- Site URL: https://qoder-community.pages.dev
- GitHub integration: Auto-synced
- Custom domain: None (using Cloudflare subdomain)

**No secrets needed** for this build (static site, no API keys).

## Advanced: Manual Build & Deploy

For edge cases where automatic deployment doesn't work:

```bash
# 1. Verify build locally
npm run build
npm run preview

# 2. On Cloudflare dashboard:
# - Go to Pages > qoder-community > Build Configuration
# - Click "Save and Deploy"

# 3. Or trigger via Cloudflare API:
curl -X POST "https://api.cloudflare.com/client/v4/accounts/{account-id}/pages/projects/qoder-community/deployments" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

(Requires Cloudflare API token—ask repo admin for access)

---

**Questions?** Open an issue on GitHub or check [Cloudflare Pages docs](https://developers.cloudflare.com/pages/).
