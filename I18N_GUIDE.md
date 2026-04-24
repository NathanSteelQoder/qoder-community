# Internationalization (i18n) Guide

This guide documents the internationalization system for the Qoder Community platform, covering language routing, content organization, and translation utilities.

## Overview

The platform supports two languages:

1. **English** — Default language, served at `/`
2. **Simplified Chinese (中文)** — Secondary language, served at `/zh/`

The i18n system is built on Astro's native i18n support with Starlight documentation theme, handling language detection, URL routing, content collections, and component translations.

## Language Architecture

### Supported Languages

| Language | Code | Region | Path Prefix | Locale |
|----------|------|--------|-------------|--------|
| English | `en` | US | `/` | `en-US` |
| Chinese | `zh` | China | `/zh/` | `zh-CN` |

### How Language is Determined

1. **URL-Based Detection** (primary)
   - `/` → English
   - `/zh/` → Chinese
   - `/zh/skills/` → Chinese skill listing
   - `/skills/` → English skill listing

2. **No Cookie/Storage Fallback** — Language determined purely from URL structure

3. **No Browser Accept-Language** — URL path takes precedence for consistent behavior

## Directory Structure

### Content Organization

```
src/content/
├── docs/                  # Starlight docs (shared across languages)
├── skills/                # English skills (50+ files)
├── skills-zh/             # Chinese skills (50+ files)
├── agents/                # Shared agent templates
├── agents-zh/             # Chinese agents (not yet implemented)
├── videos/                # English videos
├── videos-zh/             # Chinese videos (not yet implemented)
├── meetups/               # English meetups
├── meetups-zh/            # Chinese meetups (not yet implemented)
├── showcase/              # Shared showcase items
├── skillSources/          # English skill sources
└── skillSources-zh/       # Chinese skill sources (not yet implemented)
```

### Page Routing

```
src/pages/
├── index.astro            # English home
├── skills.astro           # English skill listing
├── agents.astro           # English agents
├── learn.astro            # English learn page
├── meetups.astro          # English meetups
├── showcase.astro         # English showcase
├── skills/
│   └── [slug].astro       # English skill detail (dynamic)
└── zh/
    ├── index.astro        # Chinese home
    ├── skills.astro       # Chinese skill listing
    ├── agents.astro       # Chinese agents
    ├── learn.astro        # Chinese learn page
    ├── meetups.astro      # Chinese meetups
    ├── showcase.astro     # Chinese showcase
    └── skills/
        └── [slug].astro   # Chinese skill detail (dynamic)
```

## Configuration

### Astro Config (`astro.config.mjs`)

```javascript
export default defineConfig({
  site: 'https://qoder-community.pages.dev',
  integrations: [
    starlight({
      title: 'Qoder Community',
      
      // i18n configuration
      locales: {
        root: {
          label: 'English',
          lang: 'en',
        },
        zh: {
          label: '中文',
          lang: 'zh-CN',
        },
      },
      defaultLocale: 'root',
      // ... rest of config
    }),
  ],
});
```

**Key Points:**
- `root` locale is English (no path prefix)
- `zh` locale is Chinese (served at `/zh/`)
- `defaultLocale: 'root'` means English is default for docs without translations

### i18n Configuration (`src/i18n/ui.ts`)

Defines UI strings for both languages:

```typescript
export const defaultLang = 'en' as const;

export const ui = {
  'en': {
    'nav.home': 'Home',
    'nav.skills': 'Learn',
    'category.development': 'Development',
    // ... 50+ UI strings
  },
  'zh-CN': {
    'nav.home': '首页',
    'nav.skills': '学习',
    'category.development': '开发',
    // ... 50+ UI strings translated
  },
} as const;
```

## Utility Functions

### From `src/i18n/utils.ts`

#### `getLangFromUrl(url: URL): keyof typeof ui`

Extract language from URL pathname.

```typescript
// From page context
const lang = getLangFromUrl(Astro.url);
// url: 'https://qoder-community.pages.dev/zh/skills/'
// returns: 'zh-CN'

// url: 'https://qoder-community.pages.dev/skills/'
// returns: 'en' (default)
```

#### `getLangFromPath(pathname: string): keyof typeof ui`

Extract language from path string (simpler than URL object).

```typescript
const lang = getLangFromPath('/zh/skills/postgres/');
// returns: 'zh-CN'

const lang = getLangFromPath('/skills/');
// returns: 'en' (default)
```

#### `useTranslations(lang: keyof typeof ui): (key: UIKey) => string`

Create translation function for a language.

```typescript
const t = useTranslations('zh-CN');
t('nav.home');           // returns '首页'
t('category.development'); // returns '开发'
t('missing.key');        // falls back to English: 'missing.key'
```

**Fallback behavior:** If translation missing, returns English version or key name.

#### `getLocalizedPath(pathname: string, targetLang: keyof typeof ui): string`

Convert path between languages.

```typescript
// Switch from English to Chinese
getLocalizedPath('/skills/', 'zh-CN');
// returns: '/zh/skills/'

// Switch from Chinese to English
getLocalizedPath('/zh/skills/postgres/', 'en');
// returns: '/skills/postgres/'

// Home page switching
getLocalizedPath('/', 'zh-CN');
// returns: '/zh/'

getLocalizedPath('/zh/', 'en');
// returns: '/'
```

#### `formatDate(date: Date, lang: keyof typeof ui): string`

Format date according to locale.

```typescript
const date = new Date('2026-04-24');

formatDate(date, 'en');      // 'April 24, 2026'
formatDate(date, 'zh-CN');   // '2026年4月24日'
```

#### `getCategoryLabel(category: string, lang: keyof typeof ui): string`

Translate skill category.

```typescript
getCategoryLabel('development', 'en');   // 'Development'
getCategoryLabel('development', 'zh-CN'); // '开发'
getCategoryLabel('unknown', 'en');       // 'unknown' (fallback)
```

#### `getSourceLabel(source: string, lang: keyof typeof ui): string`

Translate skill source.

```typescript
getSourceLabel('anthropic', 'en');   // 'Anthropic'
getSourceLabel('anthropic', 'zh-CN'); // 'Anthropic'
getSourceLabel('community', 'en');   // 'Community'
getSourceLabel('community', 'zh-CN'); // '社区'
```

#### `getRoleLabel(role: string, lang: keyof typeof ui): string`

Translate user role.

```typescript
getRoleLabel('developer', 'en');    // 'Developer'
getRoleLabel('developer', 'zh-CN');  // '开发者'
getRoleLabel('marketer', 'zh-CN');   // '营销人员'
```

## Content Collection Patterns

### Bilingual Skills (English + Chinese)

When adding a new skill, create both versions:

**English:** `src/content/skills/postgres.md`
```markdown
---
name: postgres
title: Postgres
description: Database management skill
category: development
author: Your Name
githubUrl: https://github.com/...
date: 2026-01-01
---

# Postgres Skill

Content in English...
```

**Chinese:** `src/content/skills-zh/postgres.md`
```markdown
---
name: postgres
title: Postgres
description: 数据库管理技能
category: development
author: Your Name
githubUrl: https://github.com/...
date: 2026-01-01
---

# Postgres 技能

中文内容...
```

**Important:**
- Both files must have identical `name` field
- Title and description translated
- All other fields identical
- Same date to keep versions in sync

### Skills Translation Mapping

**File:** `src/i18n/skills-translations.ts`

Maps English skill slugs to Chinese slugs for bilingual lookup:

```typescript
export const skillTranslations: Record<string, string> = {
  'postgres': 'postgres',              // Same slug for both
  'mcp-builder': 'mcp-builder',       // Slug language-neutral
  'web-artifacts-builder': 'web-artifacts-builder',
  // ... (all skills with identical slugs)
};
```

**Note:** Currently all skills use language-neutral slugs (English words). This allows content routing without slug translation.

## Component Integration

### Language Switcher

**Component:** `src/components/LanguageSwitcher.astro`

Provides UI toggle between English and Chinese:

```astro
---
import { getLangFromUrl, getLocalizedPath } from '../i18n/utils';

interface Props {
  currentPath: string;
}

const { currentPath } = Astro.props;
const currentLang = getLangFromUrl(Astro.url);

const handleLanguageSwitch = (targetLang: 'en' | 'zh-CN') => {
  const newPath = getLocalizedPath(currentPath, targetLang);
  return newPath;
};
---

<button onclick={`location.href = '${handleLanguageSwitch('zh-CN')}'`}>
  中文
</button>

<button onclick={`location.href = '${handleLanguageSwitch('en')}'`}>
  English
</button>
```

### Astro Page Pattern

**File:** `src/pages/skills.astro` (English) and `src/pages/zh/skills.astro` (Chinese)

Pattern for bilingual pages:

```astro
---
import { getLangFromUrl, useTranslations } from '../i18n/utils';
import { getCollection } from 'astro:content';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

// Load appropriate collection based on language
const allSkills = lang === 'zh-CN'
  ? await getCollection('skills-zh')
  : await getCollection('skills');
---

<h1>{t('nav.skills')}</h1>
<!-- Page content uses translations and appropriate collection -->
```

## Astro Dynamic Routes

### Skill Detail Page (`src/pages/skills/[slug].astro`)

Handles dynamic routing for skill details:

```astro
---
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  // Generate routes for all English skills
  const englishSkills = await getCollection('skills');
  const chineseSkills = await getCollection('skills-zh');
  
  const englishPaths = englishSkills.map(skill => ({
    params: { slug: skill.slug },
    props: { entry: skill, lang: 'en' },
  }));
  
  const chinesePaths = chineseSkills.map(skill => ({
    params: { slug: skill.slug },
    props: { entry: skill, lang: 'zh-CN' },
  }));
  
  return [...englishPaths, ...chinesePaths];
}

const { entry, lang } = Astro.props;
---
```

**Behavior:**
- `/skills/postgres/` → English skill detail
- `/zh/skills/postgres/` → Chinese skill detail
- Same slug works for both because pages are in different directories

## Translation Workflow

### When Adding New UI Strings

1. **Identify String:** Find UI text that should be translated (e.g., "Download Qoder")

2. **Add to `ui.ts`:**
   ```typescript
   export const ui = {
     'en': {
       'cta.download': 'Download Qoder',
       // ...
     },
     'zh-CN': {
       'cta.download': '下载 Qoder',
       // ...
     },
   };
   ```

3. **Use in Components:**
   ```astro
   ---
   import { useTranslations } from '../i18n/utils';
   const t = useTranslations(lang);
   ---
   <button>{t('cta.download')}</button>
   ```

### When Adding New Content

1. **Create English Version:** `src/content/skills/skill-name.md`
2. **Create Chinese Version:** `src/content/skills-zh/skill-name.md`
3. **Update Translation Maps** (if needed): `src/i18n/skills-translations.ts`
4. **Test Both Routes:**
   - `/skills/skill-name/` (English)
   - `/zh/skills/skill-name/` (Chinese)

## Build Behavior

When you run `npm run build`:

1. **Generates English pages** at `/skills/`, `/agents/`, etc.
2. **Generates Chinese pages** at `/zh/skills/`, `/zh/agents/`, etc.
3. **Handles routing** through Astro's i18n middleware
4. **Validates content** that all bilingual pairs exist
5. **Creates sitemap** with both language versions

Build output structure:
```
dist/
├── index.html              # English home
├── skills/
│   ├── index.html          # English skill listing
│   ├── postgres/
│   │   └── index.html      # English postgres detail
│   └── ...
├── zh/
│   ├── index.html          # Chinese home
│   ├── skills/
│   │   ├── index.html      # Chinese skill listing
│   │   ├── postgres/
│   │   │   └── index.html  # Chinese postgres detail
│   │   └── ...
│   └── ...
└── ... (agents, meetups, etc. for both languages)
```

## Constraints & Considerations

1. **Slug Neutrality:** Skill slugs are language-neutral (English words) to simplify routing
2. **Content Parity:** Both English and Chinese content should have identical slugs and names
3. **No Browser Detection:** Language never determined by browser Accept-Language header; always uses URL
4. **URL-First Design:** Users can manually edit URL path to switch languages
5. **Content Sync:** Both language versions should reflect the same skill—translate, don't localize
6. **Missing Content:** If Chinese version missing, page 404s; no automatic fallback to English
7. **SEO:** Both `/` and `/zh/` versions indexed; hreflang links help search engines
8. **Build Performance:** Generates duplicate pages for each language (2× page count)

## Troubleshooting

### Chinese Page Shows English Content

**Symptom:** `/zh/skills/postgres/` shows English text and English skill details

**Diagnosis:**
1. Check Chinese skill exists: `src/content/skills-zh/postgres.md`
2. Verify collection loaded correctly: `await getCollection('skills-zh')`
3. Check route handler loads correct language

**Fix:**
```bash
# Verify file exists
ls -la src/content/skills-zh/postgres.md

# Rebuild and test
npm run build
npm run preview
# Visit http://localhost:3000/zh/skills/postgres/
```

### Missing Translation Key

**Symptom:** Page shows key name like `nav.home` instead of translated text

**Diagnosis:**
1. Key missing from `ui.ts`
2. Language code mismatch (using 'en' instead of 'en' or vice versa)

**Fix:**
```typescript
// In src/i18n/ui.ts, add missing key:
export const ui = {
  'en': {
    'nav.home': 'Home',  // Add here
  },
  'zh-CN': {
    'nav.home': '首页',  // And here
  },
};
```

### Language Switcher Not Working

**Symptom:** Clicking Chinese button keeps page in English

**Diagnosis:**
1. Check `getLocalizedPath` correctly forms new path
2. Verify button uses correct language code
3. Check browser caching

**Fix:**
```bash
# Clear build cache and rebuild
rm -rf .astro dist
npm run build
npm run preview

# Test in incognito/private window to avoid cache
```

### Build Errors for Missing Chinese Content

**Symptom:** Build fails because Chinese skill missing

**Diagnosis:**
1. Check if `getStaticPaths()` requires both EN and ZH versions
2. Review collection setup in `content.config.ts`

**Fix:**
- Either create matching Chinese version
- Or modify route generation to allow missing translations

## Related Documentation

- **CONTRIBUTING.md** — How to add bilingual skills
- **AGENTS.md** — Content schema and frontmatter
- **ASSET_MANAGEMENT.md** — Bilingual image handling
- **astro.config.mjs** — i18n configuration
- **src/i18n/ui.ts** — UI translation strings

## Future Improvements

1. **More Languages:** Add Japanese, Korean for Asian markets
2. **Community Translations:** Allow community to contribute translations
3. **Automated Translation:** Use translation APIs for first-pass translations
4. **Translation Status:** Dashboard showing which content is translated
5. **RTL Support:** Add right-to-left language support (Arabic, Hebrew)
6. **Language Detection:** Infer language preference from geographic location or user profile
