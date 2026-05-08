# Developer Setup & Local Environment Guide

This guide walks new developers through setting up the Qoder Community project locally and troubleshooting common issues.

## Table of Contents

- [System Requirements](#system-requirements)
- [Initial Setup](#initial-setup)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)
- [Understanding the Architecture](#understanding-the-architecture)
- [Content Validation](#content-validation)

---

## System Requirements

### Required

- **Node.js**: 18.x or higher (verify with `node --version`)
- **npm**: 9.x or higher (included with Node.js)
- **Git**: Latest version
- **Disk Space**: ~2GB for node_modules and build artifacts

### Recommended

- **Code Editor**: VS Code with Astro and TypeScript extensions
- **Terminal**: bash, zsh, or fish (PowerShell supported on Windows)
- **OS**: macOS, Linux, or Windows (with WSL recommended)

---

## Initial Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Qoder-AI/qoder-community.git
cd qoder-community
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- `astro` (5.6.1+) - Static site generator
- `@astrojs/starlight` (0.37.1+) - Documentation theme
- `playwright` (devDependency) - Screenshot automation

**Expected output:**
```
added 500+ packages in 45s
```

### Step 3: Verify Installation

```bash
npm run build
```

This generates the production build in `dist/`. A successful build should complete in ~5 seconds and output:

```
✓ Completed in 2.26s
✓ built in 171ms
...
```

If you see errors, jump to [Troubleshooting](#troubleshooting).

### Step 4: Start Development Server

```bash
npm run dev
```

You should see:

```
Local    http://localhost:4321/
```

Open that URL in your browser. You should see the Qoder Community homepage.

---

## Development Workflow

### Adding a New Skill

Skills are the main content type. Here's the complete workflow:

#### 1. Create English Version

Create file: `src/content/skills/my-skill-name.md`

```markdown
---
name: my-skill-name
title: "My Skill Title"
description: "One-sentence description of what this skill does"
source: community
author: "Your Name"
githubUrl: https://github.com/yourname/my-skill
docsUrl: https://example.com/docs
category: development
tags:
  - tag1
  - tag2
roles:
  - developer
featured: false
popular: false
isOfficial: false
installCommand: |
  git clone https://github.com/yourname/my-skill
  cp -r my-skill ~/.qoder/skills/
date: 2026-05-08
---

## Use Cases

- Use case 1
- Use case 2

## Example

```bash
# Your example here
```

## Notes

- Note 1
```

**Required fields:**
- `name` - lowercase, no spaces (used for URL slug)
- `title` - Human-readable name
- `description` - One sentence, 60-100 characters
- `githubUrl` - Valid GitHub URL
- `category` - Must be one of: `development`, `design`, `marketing`, `productivity`, `automation`, `data`, `security`, `document`, `meta`
- `date` - ISO format (YYYY-MM-DD)

#### 2. Create Chinese Version

Create file: `src/content/skills-zh/my-skill-name.md`

Same structure as English version, but with Chinese content.

#### 3. Verify in Dev Server

```bash
npm run dev
```

Visit `http://localhost:4321/skills/my-skill-name/`

You should see:
- Your skill displayed in the grid
- Bilingual content working (toggle language switcher)
- Tags and category showing correctly

#### 4. Run Type Check

```bash
npx astro check
```

This validates TypeScript and ensures frontmatter matches the schema.

#### 5. Commit and Push

```bash
git add .
git commit -m "feat: add my-skill-name skill"
git push
```

### Making Style Changes

Styles are in `src/styles/custom.css`. They use CSS variables defined by Starlight.

```css
/* Good: Use variables ✅ */
.my-component {
  background: var(--sl-color-bg-nav);
  color: var(--text-primary);
  padding: var(--space-4);
}

/* Avoid: Hardcoded colors ❌ */
.my-component {
  background: #1a1a2e;
  color: #ffffff;
}
```

Common variables:

```css
/* Colors */
--sl-color-bg-nav        /* Navigation background */
--text-primary           /* Main text */
--text-secondary         /* Secondary text */
--text-tertiary          /* Tertiary/muted text */

/* Spacing (from 1 to 12) */
--space-4                /* 1rem */
--space-6                /* 1.5rem */
--space-8                /* 2rem */

/* Radius */
--radius-md              /* Medium border radius */
--radius-lg              /* Large border radius */
--radius-full            /* Fully rounded */

/* Shadows */
--shadow-sm              /* Small shadow */
--shadow-lg              /* Large shadow */
```

After editing `custom.css`, the dev server hot-reloads automatically.

### Editing Components

Components are in `src/components/`. They're Astro components (`.astro` files).

```astro
---
// TypeScript section
interface Props {
  title: string;
  description?: string;
}

const { title, description = '' } = Astro.props;
---

<!-- HTML section -->
<div class="card">
  <h3>{title}</h3>
  {description && <p>{description}</p>}
</div>

<!-- Scoped styles -->
<style>
  .card {
    padding: var(--space-4);
    border-radius: var(--radius-lg);
  }
</style>
```

**Guidelines:**
- Use TypeScript interfaces for props
- Prefer component composition over props drilling
- Keep inline `<script>` tags for client interactivity minimal
- Use scoped `<style>` blocks (not global)

### Editing Pages

Pages are in `src/pages/`. They're also Astro components that render full page layouts.

Example (`src/pages/skills.astro`):

```astro
---
import { getCollection } from 'astro:content';
const skills = await getCollection('skills');
---

<div class="page">
  {skills.map(skill => (
    <SkillCard entry={skill} />
  ))}
</div>
```

**Key Pattern:**
1. Fetch data in frontmatter (runs at build time)
2. Pass data to components
3. Render in template

---

## Troubleshooting

### Build Fails with "No files found matching..."

**Error:**
```
[WARN] [glob-loader] No files found matching "**/*{.md,.mdx}..." in directory "src/content/agents"
```

**Solution:** This is expected. Empty collections emit warnings but don't fail the build. It's fine to ignore.

### Content Not Showing After Adding Skill

**Problem:** You added a skill but it doesn't appear on the site.

**Checklist:**
1. ✅ File is in `src/content/skills/` (not `src/content/skills-zh/`)
2. ✅ Filename is lowercase and kebab-case (`my-skill.md`, not `MySkill.md`)
3. ✅ Frontmatter starts with `---` and ends with `---`
4. ✅ Required fields present: `name`, `title`, `description`, `githubUrl`, `category`, `date`
5. ✅ `category` is one of: `development`, `design`, `marketing`, `productivity`, `automation`, `data`, `security`, `document`, `meta`
6. ✅ `date` is in ISO format: `2026-05-08`
7. ✅ Running `npm run dev` and visited correct URL

**Debug:**
```bash
npx astro check
```

This shows validation errors.

### TypeScript Errors

**Error:** `Type 'unknown' is not assignable to type...`

**Solution:** Update the `<Props>` interface:

```astro
---
interface Props {
  entry: CollectionEntry<'skills'>;
  lang?: keyof typeof ui;  // Add type hints
}
const { entry, lang = 'en' } = Astro.props;
---
```

### Port 4321 Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::4321`

**Solution:**
```bash
# Kill existing process
lsof -i :4321 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Build Fails with Module Errors

**Error:** `Error: Cannot find module '@astrojs/starlight'`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Bilingual Content Not Working

**Problem:** Chinese version not showing or English/Chinese mix appearing.

**Checklist:**
1. ✅ Chinese file exists: `src/content/skills-zh/my-skill.md`
2. ✅ English file exists: `src/content/skills/my-skill.md`
3. ✅ Filenames match exactly (same slug)
4. ✅ Component uses `lang` prop from context
5. ✅ Clear browser cache (Ctrl+Shift+Del or Cmd+Shift+Del)

**Test:**
```bash
npm run build
npm run preview
# Visit http://localhost:3000 and toggle language
```

### Images Not Loading

**Error:** Images show as broken links in dev or build.

**Solution:**
1. ✅ Images placed in `public/images/` folder (not `src/`)
2. ✅ Reference with path from web root: `/images/my-image.png`
3. ✅ Image files are lowercase: `skill-name.png` not `SkillName.png`

---

## Understanding the Architecture

### Collection Schema

All content is validated against schemas in `src/content.config.ts`. Here are the main collections:

#### Skills Collection

Required fields:
```typescript
{
  name: string;              // Lowercase, kebab-case (used for slug)
  title: string;             // Human-readable
  description: string;       // 1-2 sentences
  source: 'anthropic' | 'vercel' | 'community' | 'enterprise';
  githubUrl: string;         // Must be valid URL
  category: 'development' | 'design' | 'marketing' | ...;
  date: Date;                // ISO format
}
```

Optional fields:
```typescript
{
  author?: string;
  docsUrl?: string;
  tags?: string[];
  roles?: string[];          // 'developer', 'marketer', 'designer', etc.
  featured?: boolean;        // Featured on homepage
  isOfficial?: boolean;
}
```

**Validation:**
```bash
npx astro check
```

#### i18n System

Content is bilingual (English + Chinese). The system works by:

1. **File structure:**
   - English: `src/content/skills/`
   - Chinese: `src/content/skills-zh/`

2. **Routing:**
   - English: `/skills/skill-name/`
   - Chinese: `/zh/skills/skill-name/`

3. **Component rendering:**
   ```astro
   ---
   const { lang = 'en' } = Astro.props;
   const t = useTranslations(lang);  // Get translation function
   ---
   <p>{t('nav.skills')}</p>
   ```

### Build Process

```
1. npm run build
   ↓
2. TypeScript compilation (astro check)
   ↓
3. Content collection loading and validation
   (src/content.config.ts schemas applied)
   ↓
4. Page generation
   (Astro renders .astro files to HTML)
   ↓
5. Asset optimization
   (CSS minification, code splitting)
   ↓
6. Output to dist/
```

**Output:**
- `dist/` - Static HTML files
- `dist/_astro/` - Optimized JS/CSS bundles
- `dist/images/` - Optimized images

---

## Content Validation

### Common Validation Errors

When you run `npx astro check`, you might see:

#### 1. Missing Required Field

```
src/content/skills/my-skill.md
  name is required
```

**Fix:** Add missing field to frontmatter:
```yaml
---
name: my-skill-name
```

#### 2. Invalid Enum Value

```
src/content/skills/my-skill.md
  category should be one of: development, design, marketing, productivity, automation, data, security, document, meta
```

**Fix:** Use correct category value:
```yaml
category: development  # not "Development" or "dev"
```

#### 3. Invalid Date Format

```
src/content/skills/my-skill.md
  date should be a valid date
```

**Fix:** Use ISO date format:
```yaml
date: 2026-05-08  # not "May 8" or "05/08/2026"
```

#### 4. Invalid URL

```
src/content/skills/my-skill.md
  githubUrl must be a valid URL
```

**Fix:** Include full URL:
```yaml
githubUrl: https://github.com/user/repo  # not "github.com/user/repo"
```

### Validation Checklist

Before committing a new skill:

```bash
# 1. Check syntax
npx astro check

# 2. Verify build succeeds
npm run build

# 3. Test in dev server
npm run dev
# Visit http://localhost:4321/skills/your-skill-name/

# 4. Test bilingual version
# Click language toggle, verify Chinese version shows

# 5. Commit
git add .
git commit -m "feat: add your-skill-name skill"
```

---

## Quick Reference

### Common Commands

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build
npx astro check         # Type check and validate content
npm run capture         # Capture screenshots (Playwright)
```

### File Locations

```
src/
├── content/
│   ├── skills/          ← Add English skills here
│   ├── skills-zh/       ← Add Chinese skills here
│   └── docs/
├── components/          ← Astro components
├── pages/               ← Page routes
├── i18n/                ← Bilingual utilities
└── styles/
    └── custom.css       ← Global styles

public/
└── images/              ← Static images
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feat/add-new-skill

# Make changes
# ... edit files ...

# Verify
npm run build

# Commit
git add .
git commit -m "feat: add new-skill"

# Push and create PR
git push origin feat/add-new-skill
```

---

## Getting Help

- **Documentation**: Check `README.md`, `CONTRIBUTING.md`, `AGENTS.md`
- **Issues**: GitHub Issues on the repository
- **Discussions**: GitHub Discussions for questions
- **Build logs**: Run `npm run build` with `--verbose` for detailed output

---

*Last updated: May 8, 2026*
