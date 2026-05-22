# Build & Development Setup Guide

This guide covers local development setup, building for production, and common troubleshooting for the Qoder Community site.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Building for Production](#building-for-production)
4. [Project Verification](#project-verification)
5. [Troubleshooting](#troubleshooting)
6. [Performance Tips](#performance-tips)

---

## Prerequisites

### Required Software

- **Node.js**: 18.0.0 or higher (check with `node --version`)
- **npm**: 9.0.0 or higher (check with `npm --version`)
- **Git**: for version control

### Verifying Your Environment

```bash
# Check Node.js version
node --version  # Should be 18.0.0 or higher

# Check npm version
npm --version   # Should be 9.0.0 or higher

# Verify npm can access registry
npm ping
```

### Optional but Recommended

- **Visual Studio Code** or equivalent editor with TypeScript support
- **Astro language support**: Install the Astro VS Code extension for syntax highlighting
- **GitHub Desktop**: For easier git operations if you're not comfortable with CLI

---

## Local Development

### Step 1: Clone and Navigate

```bash
git clone https://github.com/Qoder-AI/qoder-community.git
cd qoder-community
```

### Step 2: Install Dependencies

```bash
npm install
```

This command:
- Reads `package.json` and `package-lock.json`
- Downloads 2-3 top-level dependencies (astro, @astrojs/starlight, playwright)
- Resolves transitive dependencies automatically
- Takes 2-5 minutes on first install
- Creates `node_modules/` folder (~400MB)

**Verify installation succeeded:**

```bash
npm run astro -- --version
# Should output: astro 5.6.1 (or higher)
```

### Step 3: Start Development Server

```bash
npm run dev
```

Output should show:
```
  🚀  astro  ready in 2s

  ➜  Local    http://localhost:4321/
  ➜  Network  use --host to access
```

Open http://localhost:4321 in your browser. You should see the Qoder Community homepage.

### Step 4: Make Changes

Edit files in `src/content/` or `src/components/` and changes will reflect in the browser within 1-2 seconds.

**Try it:**
1. Open `src/content/docs/intro.md`
2. Edit the title text
3. Save the file
4. Refresh browser - you'll see changes immediately

### Step 5: Stop Development Server

Press `Ctrl+C` in the terminal.

---

## Building for Production

Production builds create optimized static HTML, CSS, and JS in the `dist/` folder.

### Build Command

```bash
npm run build
```

This command:
- Validates all TypeScript and content schemas
- Generates static pages for all routes (English and Chinese)
- Optimizes images and CSS
- Creates a search index (Pagefind)
- Takes 3-5 seconds
- Outputs to `dist/` folder (30-40MB)

### Expected Output

```
✓ Completed in 4.23s.

Pre-render complete [125 pages].
```

**Note:** The exact page count depends on how many skills are in the collection.

### Verify Build

```bash
npm run preview
```

This starts a local server serving the optimized production build at http://localhost:3000. This is what your site will look like in production.

### Build Artifacts

After `npm run build`, you'll see:

```
dist/
├── en/                    # English routes
│   ├── index.html
│   ├── skills/
│   ├── agents/
│   └── ...
├── zh/                    # Chinese routes
│   ├── index.html
│   ├── skills/
│   ├── agents/
│   └── ...
├── _astro/                # CSS, JS bundles
├── images/                # Static assets
└── pagefind/              # Search index
```

---

## Project Verification

### TypeScript Check

Verify all TypeScript is correct without building:

```bash
npx astro check
```

This checks:
- Component prop types
- Content schema validation
- i18n type safety
- No errors should appear

### Build Test

Before pushing changes, always test a production build locally:

```bash
# 1. Clean previous build
rm -rf dist .astro

# 2. Build
npm run build

# 3. Preview
npm run preview

# 4. Manually test key pages:
# - http://localhost:3000/  (English home)
# - http://localhost:3000/zh/  (Chinese home)
# - http://localhost:3000/skills/  (Skills page)
# - http://localhost:3000/zh/skills/  (Chinese skills page)
# - Search: Try searching for "skill" in top bar
```

---

## Troubleshooting

### Issue: `npm install` Fails

**Error:** `ERR! code ERESOLVE` or `npm ERR! ERESOLVE unable to resolve dependency tree`

**Solution:**

```bash
# Try with legacy peer deps flag
npm install --legacy-peer-deps

# Or, try clearing npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Prevention:** Keep Node.js and npm updated:

```bash
node --version  # Should be 18+
npm --version   # Should be 9+
```

---

### Issue: Dev Server Won't Start

**Error:** `EADDRINUSE: address already in use :::4321`

**Cause:** Port 4321 is already in use by another process.

**Solution:**

```bash
# Option 1: Kill the existing process
# On macOS/Linux:
lsof -i :4321
kill -9 <PID>

# Option 2: Use a different port
npm run dev -- --port 3333
# Then visit http://localhost:3333
```

---

### Issue: Build Fails with TypeScript Errors

**Error:** 
```
error: Incompatible prop types returned from components.

collection type 'skills' contains:
- Expected title to be type: string
- Got type: string | undefined
```

**Cause:** Content frontmatter doesn't match schema in `src/content.config.ts`.

**Solution:**

1. Check the error message for which file failed
2. Open the file (e.g., `src/content/skills/my-skill.md`)
3. Verify all required fields match schema:
   - `title`: must be a string
   - `description`: must be a string
   - `category`: must be one of: `development | design | marketing | productivity | automation | data | security | document | meta`
   - `date`: must be a valid date (e.g., `2026-01-15`)

**Example valid frontmatter:**

```yaml
---
name: postgres
title: PostgreSQL Skills
description: Master PostgreSQL with AI assistance
source: community
author: John Doe
githubUrl: https://github.com/user/postgres-skill
category: development
tags:
  - database
  - sql
roles:
  - developer
featured: false
date: 2026-05-22
---
```

---

### Issue: Content Changes Don't Appear

**Cause:** Astro has cached content.

**Solution:**

```bash
# Stop dev server (Ctrl+C)
# Then clean cache:
rm -rf .astro

# Restart dev server:
npm run dev
```

---

### Issue: "Cannot find module" Error

**Error:** `Cannot find module '@astrojs/starlight'`

**Cause:** Dependencies not installed.

**Solution:**

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# If still broken, try:
npm ci  # (uses package-lock.json strictly)
```

---

### Issue: Images Not Loading

**Error:** Images show broken icon in dev or build.

**Cause:** Image path incorrect or file doesn't exist.

**Solution:**

1. Verify image exists: `ls public/images/skills/share/my-skill-share.jpg`
2. Check frontmatter references correct path: `/images/skills/share/my-skill-share.jpg`
3. Ensure filename matches schema expectation (kebab-case)
4. For PNG files: They were converted to JPG in recent optimization

**Image naming convention:**

```
src/content/skills/my-skill.md
→ public/images/skills/share/my-skill-share.jpg  (1200x630px)
```

---

### Issue: Build Succeeds but Preview Shows Blank Page

**Cause:** Starlight configuration issue or missing locale definition.

**Solution:**

```bash
# Check astro.config.mjs has correct locale setup
grep -A 10 "locales:" astro.config.mjs

# Should show:
# locales: {
#   root: { label: 'English', lang: 'en' },
#   zh: { label: '中文', lang: 'zh-CN' },
# }

# If missing, see astro.config.mjs documentation section
```

---

### Issue: Search Index Not Building

**Error:** Pagefind search doesn't work after build.

**Cause:** Build didn't complete successfully or search disabled.

**Solution:**

```bash
# Verify build completed without errors
npm run build

# Check pagefind output folder exists
ls dist/pagefind/

# If missing, check build output for errors
npm run build 2>&1 | grep -i "error\|warn"
```

---

## Performance Tips

### Speed Up Development

1. **Use Incremental Type Checking** (if project grows large):
   ```bash
   # Check types in background
   npx astro check --watch
   ```

2. **Focus on One Page**:
   Instead of editing multiple pages, focus on one to see changes faster:
   ```bash
   # Edit one skill at a time
   ```

3. **Disable Unused Features**: If not using certain integrations, comment them out in `astro.config.mjs`

### Speed Up Builds

1. **Incremental builds** (enabled by default in Astro 5)
2. **Parallel builds** across CPU cores (enabled by default)
3. **Optimize large content collections**: If 100+ skills, consider pagination

### Storage Management

```bash
# Check what's taking space
du -sh node_modules dist .astro

# Clean up
rm -rf node_modules dist .astro  # Safe to delete, will rebuild

# When space is constrained
npm prune --production  # Remove dev dependencies
```

---

## Next Steps

- Read [CONTRIBUTING.md](CONTRIBUTING.md) to add your first skill
- Check [README.md](README.md) for project overview
- See [AGENTS.md](AGENTS.md) for project context and guidelines
- Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more issues

---

## Getting Help

If you're stuck:

1. Check [Troubleshooting](#troubleshooting) section above
2. Search closed [GitHub Issues](https://github.com/Qoder-AI/qoder-community/issues)
3. Open a new [Discussion](https://github.com/Qoder-AI/qoder-community/discussions) with error details
4. Include output from:
   ```bash
   node --version
   npm --version
   npm run astro -- --version
   ```

---

*Last updated: 2026-05-22*
