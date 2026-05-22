# Troubleshooting Guide

Quick solutions for common issues in Qoder Community development.

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Development Server](#development-server)
3. [Content & Frontmatter](#content--frontmatter)
4. [Builds & Deployment](#builds--deployment)
5. [Bilingual Content](#bilingual-content)
6. [Performance & Optimization](#performance--optimization)
7. [Git & Version Control](#git--version-control)

---

## Installation & Setup

### npm install takes too long or fails

**Issue:** Installation hangs or shows network errors

**Quick Fix:**
```bash
npm install --legacy-peer-deps
# Or with retries:
npm install --legacy-peer-deps --verbose
```

**Nuclear Option:**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Prevent This:**
- Keep npm updated: `npm install -g npm@latest`
- Check internet connection
- Try a different npm registry: `npm config set registry https://registry.npmjs.org/`

---

### Node.js version error

**Issue:** `Node version X.X.X is not supported`

**Check your version:**
```bash
node --version
# Need: 18.0.0 or higher
```

**Update Node.js:**
- **macOS:** `brew install node` or use nvm
- **Windows:** Download from nodejs.org or use nvm-windows
- **Linux:** Use nvm or package manager: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`

---

### "Cannot find module" errors after npm install

**Issue:** `Cannot find module '@astrojs/starlight'`

**Solution:**
```bash
# Verify dependencies installed
ls node_modules/@astrojs/starlight

# If missing, try clean install
npm ci  # Uses package-lock.json strictly
```

---

## Development Server

### Port already in use

**Issue:** `EADDRINUSE: address already in use :::4321`

**Find & kill the process:**
```bash
# macOS/Linux
lsof -i :4321
kill -9 <PID>

# Windows
netstat -ano | findstr :4321
taskkill /PID <PID> /F
```

**Use a different port:**
```bash
npm run dev -- --port 3333
# Visit http://localhost:3333
```

---

### Dev server crashes with "ENOMEM" or "out of memory"

**Issue:** Node.js runs out of memory while watching files

**Solution - Increase memory limit:**
```bash
NODE_OPTIONS=--max-old-space-size=2048 npm run dev
```

**Prevent this:**
- Close unused apps
- Check for massive files in `src/content/` (shouldn't be >10KB each)
- Consider running on a machine with more RAM

---

### Changes not appearing in browser

**Issue:** Edit a file, save, but browser doesn't update

**Common Cause:** Astro's cache is stale

**Fix:**
```bash
# 1. Stop dev server (Ctrl+C)
# 2. Clean cache
rm -rf .astro

# 3. Restart
npm run dev
```

**Verify file was saved:** Open file in browser devtools to confirm changes exist

---

### "Can't resolve" errors for images or components

**Issue:** `Can't resolve './components/SkillCard.astro'`

**Check:**
1. Does file exist? `ls src/components/SkillCard.astro`
2. Correct import path? Should be relative from current file
3. Correct extension? `.astro` not `.tsx`

**Example:**
```astro
---
// ✅ Correct
import SkillCard from '../components/SkillCard.astro';

// ❌ Wrong extensions
import SkillCard from '../components/SkillCard.tsx';
import SkillCard from '../components/SkillCard';
---
```

---

## Content & Frontmatter

### Frontmatter validation fails

**Issue:** 
```
error: Incompatible prop types returned from components.
collection type 'skills' contains:
Expected title to be type: string | undefined
Got type: string
```

**Cause:** Content schema mismatch in `src/content.config.ts`

**Check frontmatter matches schema:**

Required fields in `src/content/skills/`:
```yaml
---
name: skill-name              # String, lowercase with hyphens
title: "Skill Title"          # String, required
description: "Brief desc"     # String, required
source: community             # One of: anthropic | vercel | community | enterprise
author: "Author Name"         # String, optional
githubUrl: https://github.com/... # Valid URL, required
category: development         # One of: development | design | marketing | productivity | automation | data | security | document | meta
date: 2026-05-22             # Valid date, required
featured: false              # Boolean, optional (default: false)
popular: false               # Boolean, optional (default: false)
isOfficial: false            # Boolean, optional (default: false)
---
```

**Validate before committing:**
```bash
npx astro check
```

---

### "Invalid date" in frontmatter

**Issue:** `Expected date to be a valid date, got: "2026-13-45"`

**Date format must be:** `YYYY-MM-DD`

**Examples:**
```yaml
# ✅ Correct
date: 2026-05-22
date: 2024-01-15

# ❌ Wrong
date: 05/22/2026     # Month/Day/Year format
date: 2026-13-45     # Invalid month/day
date: May 22, 2026   # Text format
```

---

### Enum validation fails for category

**Issue:** `Expected category to be one of: development | design | ...`

**Valid categories:**
- `development` - Dev tools and code skills
- `design` - UI/UX and design tools
- `marketing` - Marketing and growth skills
- `productivity` - Productivity and time management
- `automation` - Task automation and workflows
- `data` - Data processing and analysis
- `security` - Security and compliance
- `document` - Document processing (PDF, Word, etc.)
- `meta` - Meta skills (creating other skills)

---

### Missing required image for skill

**Issue:** Build succeeds but skill card shows broken image

**Causes:**
1. Image doesn't exist
2. Image path in frontmatter is wrong
3. Image not in correct folder

**Fix:**

1. **Verify image exists:**
   ```bash
   ls public/images/skills/share/my-skill-share.jpg
   ```

2. **Use correct path in frontmatter:**
   ```yaml
   # In src/content/skills/my-skill.md, you don't need to reference image
   # Naming convention creates implicit mapping:
   # src/content/skills/my-skill.md
   # → uses /images/skills/share/my-skill-share.jpg (automatically)
   
   # For Chinese: same skill name, same image
   # src/content/skills-zh/my-skill.md
   # → uses same /images/skills/share/my-skill-share.jpg
   ```

3. **Image must be 1200x630px** (landscape, for sharing)

---

## Builds & Deployment

### Build fails with "out of memory"

**Issue:** `JavaScript heap out of memory` during build

**Increase heap size:**
```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

**Cleaner build:**
```bash
rm -rf dist node_modules .astro
npm install
npm run build
```

---

### TypeScript errors in build

**Issue:** 
```
error: No matching function signatures for "getCategoryLabel"
```

**Cause:** i18n utility import missing

**Fix in component files:**
```astro
---
// ❌ Missing import
const label = getCategoryLabel(category, lang);

// ✅ Add import
import { getCategoryLabel } from '../i18n';
const label = getCategoryLabel(category, lang);
---
```

---

### Search index not building

**Issue:** After `npm run build`, search doesn't work

**Verify:**
```bash
# Check pagefind folder exists
ls dist/pagefind/

# If empty, pagefind didn't run
# Check build output for errors:
npm run build 2>&1 | grep -i "error\|pagefind"
```

**Usually caused by:**
- Build had errors (check output)
- No pages generated (verify `dist/` has HTML files)

---

### Build succeeds but production looks broken

**Issue:** `npm run preview` shows blank or incorrect styling

**Checklist:**
1. Are there TypeScript errors? `npx astro check`
2. Is locale config in `astro.config.mjs` correct?
3. Did build complete successfully? `npm run build` showed "Pre-render complete"

**Nuclear fix:**
```bash
rm -rf dist .astro
npm run build
npm run preview
```

---

## Bilingual Content

### Chinese page shows English content

**Issue:** `/zh/skills/` page shows English skill descriptions

**Cause:** Missing Chinese translation file

**Check:**
1. English skill exists: `src/content/skills/skill-name.md`
2. Chinese skill is missing or has wrong slug: `src/content/skills-zh/skill-name.md`

**Fix:**
```bash
# 1. Copy English version
cp src/content/skills/skill-name.md src/content/skills-zh/skill-name.md

# 2. Update frontmatter to Chinese if needed
# 3. Translate content (title, description at minimum)
```

**Rules:**
- Slug must match: `skill-name.md` in both `/skills/` and `/skills-zh/`
- Image file can be shared (same image for both)
- Frontmatter fields `name`, `source`, `date` should be identical

---

### Language switcher not working

**Issue:** Clicking language switcher does nothing

**Cause:** Browser console error in LanguageSwitcher component

**Debug:**
```bash
# 1. Open browser DevTools (F12)
# 2. Check Console tab for errors
# 3. Look for JavaScript errors in src/components/LanguageSwitcher.astro
```

**Restart dev server:**
```bash
# Stop (Ctrl+C)
rm -rf .astro
npm run dev
```

---

### Chinese characters show as boxes

**Issue:** Chinese text displays as \`\`□□□\`\`

**Cause:** Encoding issue or missing font

**Check:**
1. File saved as UTF-8: In editor, check encoding (bottom right in VS Code)
2. HTML charset correct: Check `<meta charset="utf-8">` in Starlight template

**Usually not an issue in Astro/Starlight projects**, but verify:
```bash
file src/content/skills-zh/skill-name.md
# Should show: UTF-8 Unicode text
```

---

## Performance & Optimization

### Dev server is very slow

**Issue:** `npm run dev` takes >10 seconds to start or responds slowly to changes

**Causes:**
- Too many files in `src/content/` (100+)
- Large image files (should be <2MB each)
- Node.js running on slow disk

**Quick fixes:**
```bash
# Clean everything
rm -rf node_modules dist .astro
npm install
npm run dev

# Or, if building takes forever:
NODE_OPTIONS=--max-old-space-size=2048 npm run dev
```

---

### Build takes >15 seconds

**Issue:** Production build is slow

**Expected:** 3-5 seconds for ~100 skills

**If slower:**
1. Check disk speed: `npm run build 2>&1 | grep -i "time\|duration"`
2. Check for large files: `find src/content -type f -size +1M`
3. Run build with verbose: `npm run build --verbose`

**Optimize:**
- Compress images: PNG files converted to JPG in recent update
- Reduce collection sizes if >200 items

---

## Git & Version Control

### Accidental commit of node_modules

**Issue:** Committed `node_modules/` folder (400MB+)

**Remove from git (doesn't delete locally):**
```bash
git rm -r --cached node_modules/
echo "node_modules/" >> .gitignore
git add .gitignore
git commit -m "Remove node_modules from git"
```

**Before pushing huge commits:**
```bash
# Check commit size
git diff --cached --stat
# Should be <10MB of changes
```

---

### Merge conflicts in frontmatter

**Issue:** Two branches edited the same skill file

**Resolve manually:**
```bash
# 1. Open file in editor
# 2. Look for conflict markers:
# <<<<<< HEAD
# your changes
# =======
# their changes
# >>>>>>

# 3. Edit to keep desired version
# 4. Remove markers
# 5. Save and stage
git add src/content/skills/skill-name.md
git commit -m "Resolve merge conflict"
```

---

### Deleted file still appearing

**Issue:** Deleted a skill file but it's still in builds

**Cause:** Git cache, not actual deletion

**Verify deletion:**
```bash
# Check if file actually deleted
git status
# Should show "deleted: src/content/skills/..."

# If not, force delete and commit
git rm src/content/skills/skill-name.md
git commit -m "Remove skill"
```

---

## Still Stuck?

### Collect Debug Info

Before asking for help, gather:

```bash
# System info
node --version
npm --version
git --version

# Project state
npm run astro -- --version
npx astro check

# Last few commits
git log --oneline -5

# Build output (if failing)
npm run build 2>&1 > build-output.txt
cat build-output.txt
```

### Ask for Help

1. **GitHub Discussions**: https://github.com/Qoder-AI/qoder-community/discussions
2. **GitHub Issues**: https://github.com/Qoder-AI/qoder-community/issues
3. Include debug info from above + steps to reproduce

---

*Last updated: 2026-05-22*
