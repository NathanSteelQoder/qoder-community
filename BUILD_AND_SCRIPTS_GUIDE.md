# Build, Scripts & Workflows Guide

This guide documents the build process, npm scripts, and operational workflows for the Qoder Community project.

## Table of Contents

- [Quick Reference](#quick-reference)
- [Build Pipeline](#build-pipeline)
- [Available Scripts](#available-scripts)
- [Screenshot Capture Workflow](#screenshot-capture-workflow)
- [Content Validation](#content-validation)
- [Deployment](#deployment)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

---

## Quick Reference

| Task | Command | Output |
|------|---------|--------|
| Install deps | `npm install` | `node_modules/`, `package-lock.json` |
| Start dev server | `npm run dev` | http://localhost:4321 |
| Build production | `npm run build` | `dist/` folder (~25MB) |
| Preview build | `npm run preview` | localhost preview of build |
| Type check | `npx astro check` | TypeScript diagnostics |
| Capture screenshots | `npm run capture` | `public/screenshots/` |

---

## Build Pipeline

### Development Build

```bash
npm run dev
```

**Process**:

1. Astro + Starlight initialization
2. Collection loading and validation (6 content types)
3. i18n routing setup (English + Chinese)
4. Component bundling
5. Dev server starts on port 4321
6. HMR (hot module reload) enabled for live edits

**Watch Includes**:

- `src/` (components, pages, content)
- `public/` (static assets)
- `astro.config.mjs`

**Watch Excludes**:

- `node_modules/`, `.git/`, `dist/`

### Production Build

```bash
npm run build
```

**Process**:

1. Full TypeScript type checking
2. Collection validation with Zod schemas
3. Content rendering (Markdown → HTML)
4. Component optimization
5. CSS minification
6. JavaScript minification (tree-shaking)
7. Image optimization (via `noop` service - no transform)
8. Static site generation to `dist/`

**Build Time**: ~5 seconds

**Output Size**:

- HTML: ~15MB (60+ pages × 250KB average)
- CSS: ~200KB (minified)
- JS: ~2.5KB (minimal client code)
- Images: ~8MB (compressed PNGs + JPEGs)
- Total: ~25MB

**Build Artifacts**:

```
dist/
├── en/           # English pages
│   ├── index.html
│   ├── skills/
│   ├── agents/
│   ├── learn/
│   ├── meetups/
│   ├── showcase/
│   └── _astro/   # CSS + JS bundles
├── zh/           # Chinese pages (same structure)
└── images/       # Assets
```

---

## Available Scripts

### `npm run dev`

Start development server with hot reload.

**Usage**: 
```bash
npm run dev
```

**Output**:
```
➜ Local:    http://localhost:4321/
➜ press h to show help
```

**Access**: Open http://localhost:4321 in browser

**Features**:

- Hot module reload (HMR)
- Error overlay with stack traces
- Collection validation on save
- TypeScript checking (in VS Code)

---

### `npm run build`

Create optimized production build.

**Usage**:
```bash
npm run build
```

**Checks Performed**:

1. ✅ TypeScript validation
2. ✅ Content schema validation (Zod)
3. ✅ All collections loadable
4. ✅ All routes generateable
5. ✅ No broken references

**Common Errors**:

| Error | Cause | Fix |
|-------|-------|-----|
| `Collection entries have invalid frontmatter` | YAML syntax error in `.md` file | Check frontmatter keys and types |
| `[collection].data.field is missing` | Required field not in frontmatter | Add missing required field |
| `Cannot find module ...` | Missing component import | Check import path and file exists |
| `Validation error in [slug]` | Field type mismatch (e.g., string vs array) | Fix type in frontmatter |

**Exit Codes**:

- `0`: Build successful
- `1`: Build failed (see error message)

---

### `npm run preview`

Preview production build locally before deployment.

**Usage**:
```bash
npm run build  # Must run build first
npm run preview
```

**Purpose**: 

- Tests production build locally
- Verifies site works in production mode
- Checks performance optimizations applied
- Tests Cloudflare Pages rewrites

**Output**: 
```
Preview server running at:
  http://localhost:3000
```

---

### `npm run astro`

Direct Astro CLI access for advanced commands.

**Examples**:

```bash
npx astro check                # Type checking
npx astro add @astrojs/react   # Add integration
npx astro --help               # See all commands
```

---

### `npm run capture`

Capture screenshots of demo pages (for marketing/documentation).

**Usage**:
```bash
npm run capture
```

**Details**: See [Screenshot Capture Workflow](#screenshot-capture-workflow) section below.

---

## Screenshot Capture Workflow

### Purpose

Generate consistent 16:9 (1920×1080) screenshots of demo pages for social media and documentation.

### Script Location

`scripts/capture-screenshots.js` - Node.js + Playwright browser automation

### Configuration

```javascript
DEMOS_DIR = './public/demos'        // Source demo HTML files
OUTPUT_DIR = './public/screenshots' // Output PNG screenshots
VIEWPORT_WIDTH = 1920
VIEWPORT_HEIGHT = 1080
DEVICE_SCALE_FACTOR = 1
```

### Workflow

**Step 1**: Create demo HTML files

```bash
# Create demo pages in public/demos/
public/demos/
├── skill-demo.html
├── agent-config-demo.html
└── dashboard-demo.html
```

**Step 2**: Run capture script

```bash
npm run capture
```

**Step 3**: Verify output

```bash
# Screenshot saved to:
public/screenshots/
├── skill-demo.png
├── agent-config-demo.png
└── dashboard-demo.png
```

### Script Behavior

1. Launches Chromium browser instance
2. Sets viewport to 1920×1080 (16:9)
3. Loads each `.html` file from `public/demos/`
4. Takes full-page screenshot
5. Saves as PNG to `public/screenshots/`
6. Logs progress and any errors
7. Closes browser when complete

### Example Demo Page

Create `public/demos/skill-example.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: system-ui; margin: 0; padding: 20px; background: #f5f5f5; }
    .demo-card { background: white; padding: 40px; border-radius: 8px; }
    h1 { color: #2ADB5C; }
  </style>
</head>
<body>
  <div class="demo-card">
    <h1>Skill Name</h1>
    <p>Description of skill capability</p>
  </div>
</body>
</html>
```

### Troubleshooting Screenshots

**Issue**: "Browser launch failed"

- Ensure Playwright is installed: `npm install playwright`
- Run on system with display (X11/Wayland on Linux, or Windows/macOS)

**Issue**: "Timeout while taking screenshot"

- Increase timeout in script
- Check if demo HTML loads in browser

**Issue**: "Screenshots are blank"

- Verify demo HTML loads at `file://` URL
- Add explicit `wait: { for: 'networkidle' }`
- Check browser console for errors

---

## Content Validation

### Manual Validation

**Check frontmatter format**:

```bash
# Dry run: validate all collections
npx astro check
```

**Validate individual file**:

```bash
# Edit a skill file and save (dev server will show errors)
npm run dev
# Make changes to src/content/skills/example.md
# Check terminal for validation errors
```

### Automated Checks (Build Time)

The build process validates:

1. **YAML Syntax**: All frontmatter must be valid YAML
2. **Required Fields**: All collection-specific required fields present
3. **Type Matching**: Field types match schema (e.g., `date` must be ISO 8601)
4. **Enum Validation**: 
   - `category` in: `[development, design, marketing, ...]`
   - `source` in: `[anthropic, vercel, community, enterprise]`
   - `status` in: `[upcoming, past]`
5. **URL Validation**: `githubUrl`, `docsUrl`, etc. must be valid URLs
6. **Collection-Specific**:
   - Skills: `name`, `githubUrl`, `category`, `date` required
   - Agents: author object with `name`, `avatar`, `url` required
   - Videos: `youtubeId` must be valid

### Common Validation Errors

**Error**: `Unknown field "authorUrl"`

**Fix**: 
```yaml
# ❌ Old format (pre-refactor)
authorUrl: "https://github.com/user"

# ✅ New format
author: "User Name"
githubUrl: "https://github.com/user"
```

**Error**: `Field "date" does not match type Date`

**Fix**:
```yaml
# ❌ Invalid format
date: January 15, 2025

# ✅ Valid ISO 8601 format
date: 2025-01-15
# Also works:
date: 2025-01-15T10:30:00Z
```

**Error**: `Invalid enum value "learning"`

**Fix**:
```yaml
# ❌ Invalid category
category: "learning"

# ✅ Valid categories
category: "development"  # or: design, marketing, automation, data, security, productivity, document, meta
```

---

## Deployment

### Cloudflare Pages Auto-Deployment

This project is configured for automatic deployment to Cloudflare Pages.

**Setup**:

1. Repository connected to Cloudflare Pages
2. Build command: `npm run build`
3. Output directory: `dist/`

**Deployment Trigger**:

```bash
git push origin main
```

**Process**:

1. Webhook triggers Cloudflare Pages build
2. Cloudflare runs `npm install && npm run build`
3. Outputs `dist/` contents
4. Deploys to https://qoder-community.pages.dev
5. CDN caches assets globally (~1-2 min)

**Build Status**:

- Check Cloudflare Pages dashboard: https://dash.cloudflare.com
- Latest deployments visible in "Build" tab
- Logs available for each build

**Rollback**:

```bash
# Revert to previous commit
git revert <commit-hash>
git push origin main

# Cloudflare will rebuild from previous code
```

---

## Performance Optimization

### Build Optimizations

**Code Splitting**:

- Astro automatically splits routes into separate JS files
- Shared code extracted to common chunks
- Result: Only ~2.5KB client JS loaded

**CSS Optimization**:

- Astro bundles all component CSS
- PostCSS minification applied
- CSS custom properties inlined where possible

**Image Optimization**:

- Images in `src/` automatically optimized by Astro
- `public/` images (skill share images) are pre-compressed:
  - Format: JPEG 85% quality (Feb 2026 migration from PNG)
  - Size: ~50-100KB per image
  - Result: 496MB → 23MB (95% reduction)

### Runtime Optimizations

**Minimal Client JavaScript**:

- Astro renders to static HTML (0% JS required for static content)
- Interactive components use minimal JS (filter, role selector)
- Event listeners attached after DOM load

**CSS Variables**:

- Design tokens defined once in `src/styles/custom.css`
- Single HTTP request for all styles
- Dark mode switching without reload (CSS var updates)

**Content Delivery**:

- Static HTML cached by Cloudflare edge
- 60+ pages served from nearest edge location
- TTL: 24 hours (can adjust per path)

### Measurement

**Lighthouse Scores** (from README):

- Performance: 98-100
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

**Build Time**: ~5 seconds on Cloudflare

**First Contentful Paint (FCP)**: <1s (static HTML + CDN)

---

## Troubleshooting

### Build Fails: "Cannot find module"

**Cause**: Missing dependency or import path incorrect

**Fix**:

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Build Fails: "Collection entries have invalid frontmatter"

**Cause**: YAML syntax error in `.md` file

**Fix**:

1. Find the file (error message shows path)
2. Check for:
   - Mismatched quotes (use straight quotes: `"` not `"`)
   - Incorrect indentation (YAML is whitespace-sensitive)
   - Missing colons after keys
3. Validate YAML: https://www.yamllint.com/

**Example**:

```yaml
# ❌ Wrong indentation
- item: value
  - nested  # Should be 2-space indent

# ✅ Correct
- item: value
  nested: value
```

### Dev Server Crashes

**Issue**: "EADDRINUSE: address already in use :::4321"

**Fix**:

```bash
# Kill process on port 4321
lsof -ti:4321 | xargs kill -9
# Or use different port
npx astro dev --port 3000
```

### Build Timeout on Cloudflare Pages

**Issue**: Build takes >30 minutes and times out

**Cause**: 

- Large image processing
- Slow Git clone
- Memory limits

**Fix**:

- Ensure images pre-compressed before pushing
- Check build logs for slowest steps
- Contact Cloudflare support for timeout extension

### Screenshots Not Generating

**Issue**: `npm run capture` fails

**Fixes**:

```bash
# 1. Ensure Playwright installed
npm install playwright

# 2. Create demo directory
mkdir -p public/demos

# 3. Add test demo file
echo '<html><body>Test</body></html>' > public/demos/test.html

# 4. Run capture
npm run capture
```

### Type Errors After Collection Update

**Issue**: TypeScript errors about collection types

**Cause**: 

- Schema changed in `src/content.config.ts`
- VSCode cache out of sync

**Fix**:

```bash
# 1. Run TypeScript check
npx astro check

# 2. If errors persist, clear TypeScript cache
# In VSCode: Cmd+Shift+P → "TypeScript: Restart TS Server"

# 3. Rebuild
npm run build
```

---

## CI/CD Integration

### GitHub Actions (Example)

To add automated testing on pull requests, create `.github/workflows/build.yml`:

```yaml
name: Build & Validate

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Type check
        run: npx astro check
      
      - name: Build
        run: npm run build
```

---

## References

- **Astro Docs**: https://docs.astro.build/
- **Content Collections**: https://docs.astro.build/en/guides/content-collections/
- **Starlight**: https://starlight.astro.build/
- **Cloudflare Pages**: https://pages.cloudflare.com/
- **Playwright**: https://playwright.dev/

