# Contributing & Operational Workflows

This document explains common development tasks and workflows for the Qoder Community project.

## Quick Reference

| Task | Command/Location | Notes |
|------|-----------------|-------|
| Install deps | `npm install` | Run once after cloning |
| Dev server | `npm run dev` | Runs on http://localhost:4321 |
| Build | `npm run build` | Produces `dist/` folder |
| Type check | `npx astro check` | Validate TypeScript |
| Add skill | Create `src/content/skills/skill-name.md` | See template below |
| Add Chinese skill | Create `src/content/skills-zh/skill-name.md` | Must provide both versions |
| Search content | Use Pagefind (built-in) | Search available on live site |
| Deploy | Push to main → Cloudflare Pages | Auto-deploys (1-2 min) |

---

## Adding a New Skill

### Step 1: Create the English Version

**File:** `src/content/skills/skill-name.md`

Use this template:

```markdown
---
name: skill-name
title: Skill Display Name
description: A brief one-sentence description of what this skill does
source: community  # community | anthropic | vercel | enterprise
author: Your Name
githubUrl: https://github.com/username/repo
docsUrl: https://example.com/docs  # optional
category: development  # development|design|marketing|productivity|automation|data|security|document|meta
tags:
  - tag1
  - tag2
roles:
  - developer
  - devops
featured: false
popular: false
isOfficial: false
installCommand: |
  git clone https://github.com/username/skill
  cd skill && npm install
date: 2026-03-27
---

## Use Cases

- Use case 1
- Use case 2
- Use case 3

## Core Capabilities

- Capability 1
- Capability 2
- Capability 3

## Example

\`\`\`bash
# Example command or code
skill-command --option value
\`\`\`

## Notes

- Important note 1
- Important note 2
- Key limitation or requirement
```

### Step 2: Create the Chinese Version

**File:** `src/content/skills-zh/skill-name.md`

Translate all sections to Chinese. Keep frontmatter mostly the same except:

```yaml
title: Skill 中文名称  # Translated title
description: 这是这个技能的简要描述
# ... other frontmatter
```

### Step 3: Add Translation Mapping (if needed)

If the skill title or description needs different translation, edit `src/i18n/skills-translations.ts`:

```typescript
export const skillsTranslations = {
  // ... existing skills ...
  'skill-name': {
    name: 'skill-name',
    'name-zh': 'skill-name (unchanged)',
    title: 'English Title Here',
    'title-zh': '中文标题',
    description: 'English description',
    'description-zh': '中文描述',
  }
};
```

### Step 4: Create Share Image

**Optional but recommended for visibility**

Create an image for social sharing (900×630px PNG, <100KB):

1. Save as `public/images/skills/share/skill-name-share.jpg`
2. Use category-specific design or default
3. Include skill name and Qoder branding
4. Keep visual consistent with existing share images

**If you skip this step:** System falls back to category default image automatically.

### Step 5: Validate & Build

```bash
# Build locally to catch schema errors
npm run build

# Check for TypeScript errors
npx astro check

# Start dev server to preview
npm run dev
# Visit http://localhost:4321/skills/skill-name/
```

**Common Issues:**

| Error | Solution |
|-------|----------|
| `frontmatter validation failed` | Check schema requirements in `src/content.config.ts` |
| `Unknown category` | Use only allowed values: development, design, etc. |
| `Invalid date format` | Use YYYY-MM-DD format |
| `URL validation failed` | Ensure `githubUrl` is valid HTTP(S) URL |

### Step 6: Submit PR

```bash
git checkout -b add/skill-name
git add src/content/skills/skill-name.md src/content/skills-zh/skill-name.md
git commit -m "feat: add skill-name skill"
git push origin add/skill-name
```

Create PR with description:

```
## Adds [Skill Name] Skill

- Skill slug: `skill-name`
- Category: development
- Roles: developer, devops
- Status: ✅ Builds locally without errors

### Added Files
- `src/content/skills/skill-name.md` (English)
- `src/content/skills-zh/skill-name.md` (Chinese)
- `public/images/skills/share/skill-name-share.jpg` (optional)
```

---

## Working with i18n

### Adding a New UI String

**Scenario:** You're adding a new UI element and need to translate it.

1. **Edit `src/i18n/ui.ts`:**

```typescript
export const ui = {
  en: {
    // ... existing keys ...
    'page.newFeature.title': 'New Feature',
    'page.newFeature.description': 'This is a new feature',
  },
  'zh-CN': {
    // ... existing keys ...
    'page.newFeature.title': '新功能',
    'page.newFeature.description': '这是一个新功能',
  },
};
```

2. **Use in component:**

```astro
---
import { useTranslations } from '../i18n';

const lang = 'en'; // or from context
const t = useTranslations(lang);
---

<h1>{t('page.newFeature.title')}</h1>
<p>{t('page.newFeature.description')}</p>
```

3. **Test both languages:**
   - `http://localhost:4321/`
   - `http://localhost:4321/zh/`

### Adding Skill Translations

**Scenario:** A skill needs different English/Chinese titles.

1. **Edit `src/i18n/skills-translations.ts`:**

```typescript
export const skillsTranslations = {
  'mcp-builder': {
    name: 'mcp-builder',
    'name-zh': 'mcp-builder',
    title: 'MCP Builder - Create Custom Model Context Protocol Servers',
    'title-zh': 'MCP Builder - 创建自定义模型上下文协议服务',
    description: 'Build Model Context Protocol servers',
    'description-zh': '构建模型上下文协议服务器',
  }
};
```

2. **Component will use it automatically:**

```typescript
import { getSkillTitle } from '../i18n';

const title = getSkillTitle(slug, skill.data.title, lang);
// Falls back to skill.data.title if not in skillsTranslations
```

---

## Building & Deployment

### Local Build

```bash
# Clean build
rm -rf dist .astro

# Install dependencies (if needed)
npm install

# Type check
npx astro check

# Build
npm run build

# Preview built site
npm run preview
# Runs on http://localhost:3000
```

### What Gets Built

- **Static HTML:** All pages pre-rendered
- **JavaScript:** Minimal (only interactive components)
- **CSS:** Optimized, including dark mode
- **Assets:** Images, fonts (SVG logo)

**Build Output:** `dist/` folder (ready for deployment)

### Deployment Process

1. **Push to `main` branch:**

```bash
git add .
git commit -m "Update content or feature"
git push origin main
```

2. **Cloudflare Pages Auto-Deploy:**
   - Webhook triggered automatically
   - Runs `npm install && npm run build`
   - Deploys `dist/` folder
   - Takes 1-2 minutes

3. **View deployment:**
   - Live: https://qoder-community.pages.dev
   - GitHub: Commit shows deployment status badge

**Rollback:**

If deployment fails, the previous build remains live. Fix issues and push again.

---

## Content Management Workflows

### Updating Existing Skill

```bash
# 1. Edit both files
vim src/content/skills/skill-name.md
vim src/content/skills-zh/skill-name.md

# 2. Update lastUpdated field
# 2026-03-27

# 3. Rebuild & test
npm run build
npm run dev

# 4. Commit & push
git add src/content/skills-zh/skill-name.md src/content/skills/skill-name.md
git commit -m "docs: update skill-name skill documentation"
git push origin main
```

### Removing a Skill

```bash
# 1. Delete both files
rm src/content/skills/skill-name.md
rm src/content/skills-zh/skill-name.md

# 2. Remove from translations (if exists)
# Edit src/i18n/skills-translations.ts

# 3. Rebuild & test
npm run build

# 4. Commit & push
git add -A
git commit -m "docs: remove skill-name skill"
git push origin main
```

### Featured Skills Management

Featured skills appear on homepage Learn page.

To mark a skill as featured:

```yaml
featured: true
```

**Current featured skills limit:** No hard limit, but recommend 3-5 max for good UX.

---

## Common Issues & Solutions

### Build Fails: "Unknown category"

**Problem:** Schema validation error during build

```
Error: Unknown category "developement"
```

**Solution:** Check spelling in frontmatter

```yaml
category: development  # Correct
# NOT: category: developement
```

**Valid categories:**
```
development, design, marketing, productivity, automation, data, security, document, meta
```

### Component Not Responding on Mobile

**Problem:** Role selector or skill filter doesn't work on phone

**Cause:** JavaScript initialization failing

**Solution:**

1. Check browser console for errors
2. Verify DOM structure (open DevTools > Inspector)
3. Check if `data-*` attributes match JavaScript selectors

### Images Not Displaying

**Problem:** Skill share images or showcase images show broken image icon

**Cause:** Image file missing or wrong path

**Solution:**

```bash
# Check file exists
ls -lh public/images/skills/share/skill-name-share.jpg

# Verify path in markdown
# Should be: /images/skills/share/skill-name-share.jpg
```

### Search Not Working

**Problem:** Pagefind search not indexing content

**Cause:** Content not included in build

**Solution:**

1. Verify content has proper frontmatter
2. Rebuild: `rm -rf dist .astro && npm run build`
3. Check build log for "Pagefind" output

---

## Git Workflow

### Branch Naming

```
feat/skill-name          # New skill
docs/update-readme       # Documentation
fix/category-styling     # Bug fix
refactor/i18n-system     # Code refactoring
```

### Commit Messages

```bash
# Skill additions
git commit -m "feat: add postgres skill"
git commit -m "feat: add zh translation for postgres skill"

# Documentation
git commit -m "docs: add SUBSYSTEMS guide"
git commit -m "docs: update CONTRIBUTING workflow"

# Fixes
git commit -m "fix: image path typo in skill"
git commit -m "fix: role selector mobile scroll"

# Refactoring
git commit -m "refactor: simplify i18n utils"
```

### Pull Request Template

```markdown
## Description
What does this PR do?

## Type of Change
- [ ] New skill
- [ ] Documentation update
- [ ] Bug fix
- [ ] Component improvement
- [ ] Other: ___

## Checklist
- [ ] Tested locally: `npm run build` passes
- [ ] Both English and Chinese versions added (if skill)
- [ ] Links and references verified
- [ ] Follow project style guide

## Screenshots
(if applicable)
```

---

## Performance & Optimization

### Current Metrics

- **Build time:** ~4 seconds
- **JavaScript:** ~2.5KB (gzipped)
- **Lighthouse:** 98-100 scores
- **Time to Interactive:** <1 second

### Best Practices

1. **Keep images optimized**
   - Max 100KB for skill share images
   - Use JPEG format (better compression)
   - 900×630px for share images

2. **Write concise content**
   - Skill descriptions: 1-2 sentences max
   - Short section headers
   - Use lists for readability

3. **Avoid unnecessary assets**
   - Only add images that add value
   - Use inline SVG for icons (smaller)
   - No video embeds in main content

---

## Related Documentation

- **Technical Subsystems:** `SUBSYSTEMS.md`
- **Project Context:** `AGENTS.md`
- **Component Guide:** `src/components/` (component comments)
- **Content Schema:** `src/content.config.ts`
- **i18n Guide:** `src/i18n/index.ts`
