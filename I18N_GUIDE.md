# Internationalization (i18n) Guide

This document explains the internationalization system used in Qoder Community to support English and Chinese (Simplified) languages.

## Quick Start

### Adding a Translated Skill

1. **Create English skill** (required):
   ```
   src/content/skills/my-skill.md
   ```

2. **Create Chinese translations** (if needed):
   ```
   src/content/skills-zh/my-skill.md       (content in Chinese)
   src/i18n/skills-translations.ts         (title/description overrides)
   ```

3. **Translations object format**:
   ```typescript
   'my-skill': {
     zhName?: string;        // Optional: Chinese name
     zhTitle: string;        // Required: Chinese title
     zhDescription: string;  // Required: Chinese description
   }
   ```

---

## Architecture

### Three Layers of Translation

```
┌─────────────────────────────────────────────┐
│ 1. UI Strings (ui.ts)                      │
│    Button labels, category names, etc.     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 2. Skill Metadata (skills-translations.ts) │
│    Title, description per skill            │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 3. Content Body (skills-zh/*)              │
│    Full markdown content in Chinese        │
└─────────────────────────────────────────────┘
```

### File Organization

```
src/i18n/
├── index.ts                    # Exports all i18n functions
├── ui.ts                       # UI string translations (222 keys)
├── utils.ts                    # i18n helpers (7 functions)
├── skills-translations.ts      # Skill-specific translations (100+ entries)
└── skillSources-translations.ts # External source translations
```

---

## Layer 1: UI Strings (`src/i18n/ui.ts`)

### Purpose

Translate all UI elements: buttons, labels, category names, role names.

### Structure

```typescript
export const ui = {
  en: {
    'nav.skills': 'Skills',
    'nav.agents': 'Agents',
    'category.development': 'Development',
    'role.developer': 'Developer',
    // ... more keys
  },
  'zh-CN': {
    'nav.skills': 'Skills',                    // Keep English for navigation
    'nav.agents': 'Agents',
    'category.development': '开发',
    'role.developer': '开发者',
    // ... more keys
  },
} as const;
```

### Key Convention

- Language key for Chinese: `'zh-CN'` (not just `'zh'`)
- English is `'en'` (not `'en-US'`)

### Usage

```typescript
// In Astro component
import { getLangFromPath, useTranslations } from '../i18n';

const lang = getLangFromPath(Astro.url.pathname);  // Returns 'en' or 'zh-CN'
const t = useTranslations(lang);

// In template
<h1>{t('nav.skills')}</h1>
<span>{t('category.development')}</span>
```

### When to Add New Strings

Add strings to `ui.ts` when they are:
- Generic UI labels used across multiple pages
- Category names, role names, badge labels
- Button text, form labels, error messages

**Do NOT add here**:
- Content body text (goes in markdown)
- Skill-specific strings (goes in `skills-translations.ts`)

---

## Layer 2: Skill Translations (`src/i18n/skills-translations.ts`)

### Purpose

Provide Chinese translations for skill metadata (title, description) without requiring a full Chinese markdown file.

### Why This Layer Exists

Not all skills have Chinese markdown content. This layer allows partial translation:

```
Scenario A: Skill with full Chinese translation
  English:   src/content/skills/my-skill.md
  Chinese:   src/content/skills-zh/my-skill.md
  Metadata:  src/i18n/skills-translations.ts (used for metadata override)

Scenario B: Skill with only English content
  English:   src/content/skills/my-skill.md
  Chinese:   (none)
  Metadata:  src/i18n/skills-translations.ts (provides title/description)
  Result:    Chinese page shows English content with Chinese UI labels + translated title/description
```

### Structure

```typescript
export interface SkillTranslation {
  zhName?: string;        // Optional Chinese name (if different from slug)
  zhTitle: string;        // Chinese title (required)
  zhDescription: string;  // Chinese description (required)
}

export const skillsTranslations: Record<string, SkillTranslation> = {
  'my-skill': {
    zhName: '我的技能',
    zhTitle: '我的技能标题',
    zhDescription: '技能的中文描述，1-2 句话',
  },
  // ... more skills
};
```

### Adding a Translation Entry

**Example: Translating "Python PostgreSQL" skill**

```typescript
'postgres': {
  // Optional: Chinese name (if slug doesn't work well in Chinese)
  // Often omitted, keep English name for clarity
  
  // Required: Chinese title
  zhTitle: 'PostgreSQL 数据库操作',
  
  // Required: Chinese description (1-2 sentences)
  zhDescription: '使用 PostgreSQL 数据库的完整 SQL 操作，包括连接、查询、事务和优化技巧',
},
```

### Helper Functions

```typescript
// Get translated title (with English fallback)
getSkillTitle(slug: string, fallbackTitle: string, lang: keyof typeof ui): string

// Get translated description (with English fallback)
getSkillDescription(slug: string, fallbackDesc: string, lang: keyof typeof ui): string

// Get translated skill name/display name
getSkillDisplayName(slug: string, fallbackName: string, lang: keyof typeof ui): string

// Get translation object for a skill
getSkillTranslation(slug: string): SkillTranslation | undefined
```

### Usage in Components

```typescript
// In pages/zh/skills/[slug].astro
import { getSkillTitle, getSkillDescription } from '../../../i18n';

const displayTitle = getSkillTitle(skill.slug, skill.data.title, lang);
const displayDesc = getSkillDescription(skill.slug, skill.data.description, lang);

// In template
<h1>{displayTitle}</h1>
<p>{displayDesc}</p>
```

### When to Update

Add a translation entry when:
1. You create a new skill (add English + Chinese entries)
2. You want better Chinese descriptions than auto-translation
3. Skill titles need cultural localization

---

## Layer 3: Content Body (`src/content/skills-zh/`)

### Purpose

Provide complete Chinese markdown content for skills (the full body/description).

### File Naming

```
Same slug, same filename:
  src/content/skills/my-skill.md           (English)
  src/content/skills-zh/my-skill.md        (Chinese)
```

### When to Create

Create a Chinese markdown file when:
- Skill has culturally-specific information
- Code examples need Chinese comments
- Explanation benefits from native-speaker nuance
- You want to make it easier for Chinese developers

**Don't create if**:
- Translation layer is sufficient
- Content is purely technical (code doesn't need translation)
- Skill focuses on English-specific tools

### Front Matter

**Both files share the same metadata** — frontmatter is identical:

```markdown
---
name: "my-skill"
title: "My Skill Title"
description: "English description"
category: "development"
author: "Author Name"
githubUrl: "https://..."
date: 2025-01-15
---

# Skill Content

(This part differs between English and Chinese)
```

**Key**: Only the **body content** (below `---`) should differ.

### Content Fallback Logic

When `/zh/skills/my-skill` is accessed:

```
1. Try to load: src/content/skills-zh/my-skill.md
2. If exists:
   - Render Chinese content + Chinese UI labels
3. If NOT exists:
   - Fall back to: src/content/skills/my-skill.md
   - Render English content + Chinese UI labels
   - Use translated title/description from skills-translations.ts
```

**Result**: Seamless bilingual experience even with partial translation.

---

## Language Detection

### How Language is Determined

```typescript
// Location: src/i18n/utils.ts

export function getLangFromPath(pathname: string): keyof typeof ui {
  if (pathname.startsWith('/zh/') || pathname === '/zh') {
    return 'zh-CN';
  }
  return 'en';
}
```

### Route Examples

| URL | Language |
|-----|----------|
| `/skills` | `'en'` |
| `/skills/my-skill` | `'en'` |
| `/zh/skills` | `'zh-CN'` |
| `/zh/skills/my-skill` | `'zh-CN'` |
| `/agents` | `'en'` |
| `/zh/agents` | `'zh-CN'` |

---

## Translation Workflow for Developers

### Scenario 1: Adding a New Skill (With English Only)

```
1. Create: src/content/skills/my-skill.md
   - Write English content
   - Frontmatter: name, title, description, category, etc.

2. Build and verify: npm run build

3. Chinese page shows:
   - English content (fallback)
   - Chinese UI labels (from ui.ts)
   - You can add translation later!
```

### Scenario 2: Adding a New Skill (With Chinese)

```
1. Create: src/content/skills/my-skill.md (English)

2. Create: src/content/skills-zh/my-skill.md (Chinese)
   - Same frontmatter
   - Chinese body content

3. Update: src/i18n/skills-translations.ts
   - Add zhTitle
   - Add zhDescription
   - Optional: zhName

4. Build: npm run build

5. Result:
   - /skills/my-skill → English content
   - /zh/skills/my-skill → Chinese content
   - Metadata translated in both versions
```

### Scenario 3: Updating Translations

```
1. Edit: src/i18n/skills-translations.ts
   - Update zhTitle or zhDescription
   - Changes appear immediately

2. OR edit: src/content/skills-zh/my-skill.md
   - Update Chinese body content
   - Changes appear on Chinese page

3. Build: npm run build
```

---

## Common Tasks

### Adding a Chinese Translation for Existing English Skill

```typescript
// src/i18n/skills-translations.ts

// Find the skill slug
'existing-skill': {
  zhName: '中文名称',           // Optional
  zhTitle: '中文标题',          // Required
  zhDescription: '一到两句话的中文描述',  // Required
},
```

### Creating a Full Chinese Skill Entry

**Step 1**: Create markdown
```
Copy src/content/skills/skill-name.md to src/content/skills-zh/skill-name.md
Translate the body content to Chinese
Keep the frontmatter identical
```

**Step 2**: Add translation entry
```typescript
// src/i18n/skills-translations.ts
'skill-name': {
  zhTitle: 'Chinese Title',
  zhDescription: 'Chinese description of the skill',
},
```

**Step 3**: Verify
```bash
npm run build
# Visit /zh/skills/skill-name to preview
```

### Checking What's Translated

The `skillsTranslations` object in `skills-translations.ts` is the source of truth. Each entry represents a skill with a Chinese translation.

To find what's **not yet translated**:
1. Count skills in `src/content/skills/` (e.g., 80 skills)
2. Count entries in `skillsTranslations` (e.g., 50 entries)
3. 30 skills need translations

---

## Helper Functions Reference

### Location: `src/i18n/utils.ts`

```typescript
// Get language from URL pathname
getLangFromPath(pathname: string): keyof typeof ui

// Get language from Astro URL object
getLangFromUrl(url: URL): keyof typeof ui

// Create translation function for a language
useTranslations(lang: keyof typeof ui): (key: UIKey) => string

// Get localized path for language switching
getLocalizedPath(pathname: string, targetLang: keyof typeof ui): string

// Format date according to locale
formatDate(date: Date, lang: keyof typeof ui): string

// Get category label
getCategoryLabel(category: string, lang: keyof typeof ui): string

// Get source label (anthropic, vercel, community, enterprise)
getSourceLabel(source: string, lang: keyof typeof ui): string

// Get role label (developer, marketer, designer, etc.)
getRoleLabel(role: string, lang: keyof typeof ui): string
```

### Location: `src/i18n/skills-translations.ts`

```typescript
// Get translation for a skill
getSkillTranslation(slug: string): SkillTranslation | undefined

// Get translated skill title (with fallback)
getSkillTitle(slug: string, fallbackTitle: string, lang: keyof typeof ui): string

// Get translated skill description (with fallback)
getSkillDescription(slug: string, fallbackDesc: string, lang: keyof typeof ui): string

// Get translated skill name (with fallback)
getSkillDisplayName(slug: string, fallbackName: string, lang: keyof typeof ui): string
```

---

## Best Practices

### ✅ Do

- **Consistency**: Use same terminology in translations (e.g., always "开发者" for "developer")
- **Brevity**: Keep descriptions concise (1-2 sentences)
- **Context**: Consider how Chinese developers think about the skill
- **Testing**: Test at `/zh/skills` to preview Chinese version
- **Fallback**: Don't worry if you can't translate everything — English fallback works great
- **Iterative**: Add translations gradually as you expand Chinese audience

### ❌ Avoid

- **Auto-translation**: Don't use Google Translate for `skillsTranslations` — results are often awkward
- **Over-translation**: Only translate UI strings and skill metadata — content body should be markdown files
- **Inconsistency**: Don't translate same term multiple ways in the same file
- **Mixing languages**: Keep UI strings consistent within each language
- **Hardcoded UI text**: Always use `t()` function instead of hardcoding strings

---

## Troubleshooting

### Translated Text Not Appearing

**Symptom**: Chinese page shows English text even though translation exists

**Causes**:
1. Translation key is wrong
2. Language detection failed
3. Markdown file exists but translation doesn't

**Fix**:
1. Verify translation key matches slug exactly
2. Check URL starts with `/zh/` for Chinese
3. Verify both title + description are in translation object

### Translation Key Missing Error

**Symptom**: UI element shows raw key like `'nav.skills'` instead of translated text

**Cause**: Key not found in `ui[lang]` and no fallback to English

**Fix**:
1. Check typo in key name
2. Verify key exists in `ui.ts`
3. Check language detection is working

### Bilingual Content Not Working

**Symptom**: Both English and Chinese routes show same content

**Cause**: Chinese markdown file not found or fallback triggered

**Fix**:
1. Verify file exists: `src/content/skills-zh/my-skill.md`
2. Check filename matches slug exactly
3. Verify frontmatter is valid YAML

### Build Fails on Translations

**Symptom**: `npm run build` fails with validation error

**Cause**: Malformed TypeScript in `skills-translations.ts`

**Fix**:
1. Check for syntax errors (missing commas, quotes)
2. Verify all entries have required fields (zhTitle, zhDescription)
3. Run: `npx astro check` for type errors

---

## Examples

### Complete Translation Entry

```typescript
'varlock': {
  // Name: Use slug or Chinese version
  zhName: 'Varlock',                    // Keep English for code clarity
  
  // Title: Chinese translation of skill title
  zhTitle: 'Varlock: 多版本探索工具',
  
  // Description: 1-2 sentence summary
  zhDescription: '在多个代码版本之间灵活切换和比较，快速探索不同的实现方案和功能迭代',
},
```

### Using Translations in Component

```astro
---
// src/pages/zh/skills/[slug].astro
import { useTranslations, getSkillTitle, getSkillDescription } from '../../../i18n';

const lang = 'zh-CN';
const t = useTranslations(lang);
const skillTitle = getSkillTitle(skill.slug, skill.data.title, lang);
const skillDesc = getSkillDescription(skill.slug, skill.data.description, lang);
---

<h1>{skillTitle}</h1>
<p>{skillDesc}</p>
<button>{t('skill.install')}</button>
```

---

## Performance Notes

- i18n is **zero-runtime**: All translations are static strings compiled at build time
- No loading delay for language switching
- Translation lookups are simple dictionary access (`O(1)` time complexity)
- Build time impact: negligible (~50ms for translation validation)

---

## Related Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) — Bilingual routing overview
- [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md) — Content validation and frontmatter
- [CONTRIBUTING.md](CONTRIBUTING.md) — Adding skills with translations
