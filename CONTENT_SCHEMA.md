# Content Schema & Bilingual Support Guide

This guide documents how content is structured, validated, and rendered bilingually in the Qoder Community platform.

## Table of Contents

- [Content Collections](#content-collections)
- [Skill File Format](#skill-file-format)
- [Bilingual Content System](#bilingual-content-system)
- [Schema Validation](#schema-validation)
- [Common Errors & Fixes](#common-errors--fixes)
- [Adding New Collection Types](#adding-new-collection-types)

---

## Content Collections

The site has 6 content collections, each with its own schema and storage location:

### 1. Skills Collection

**Purpose:** Reusable capabilities and tools for AI agents

**Paths:**
- English: `src/content/skills/`
- Chinese: `src/content/skills-zh/`

**Schema:**

```typescript
{
  // Basic identity
  name: string;                    // Lowercase, kebab-case
  title: string;                   // Human-readable name
  description: string;             // 1-2 sentences, 60-200 chars
  
  // Metadata
  source: enum;                    // 'anthropic' | 'vercel' | 'community' | 'enterprise'
  author?: string;                 // Creator name
  
  // Links
  githubUrl: string;               // Required: valid GitHub URL
  docsUrl?: string;                // Optional: documentation link
  marketplaceUrl?: string;         // Optional: marketplace link
  
  // Categorization
  category: enum;                  // See categories below
  tags?: string[];                 // Custom tags (max 5)
  roles?: string[];                // Target roles (developer, marketer, designer, etc.)
  
  // Display
  featured: boolean;               // Show on homepage (default: false)
  popular: boolean;                // Mark as popular (default: false)
  isOfficial: boolean;             // Official Qoder skill (default: false)
  
  // Installation
  installCommand?: string;         // Multi-line installation command
  
  // Metadata
  date: Date;                      // Creation date (ISO format)
  lastUpdated?: Date;              // Last modified date
}
```

**Categories:**

| Category | Purpose |
|----------|---------|
| `development` | Coding, testing, CI/CD, DevOps |
| `design` | UI/UX, graphics, prototyping |
| `marketing` | Content, SEO, campaigns |
| `productivity` | Workflow automation, tools |
| `automation` | N8N, Zapier, API automation |
| `data` | Analytics, database, reports |
| `security` | Security, encryption, compliance |
| `document` | PDF, DOCX, PPTX processing |
| `meta` | Skill creation, agent skills |

**Example:**

```yaml
---
name: postgres-skill
title: PostgreSQL Database Management
description: Master database operations with PostgreSQL agents
source: community
author: Jane Developer
githubUrl: https://github.com/example/postgres-skill
docsUrl: https://example.com/postgres-docs
category: development
tags:
  - database
  - sql
  - postgres
roles:
  - developer
  - devops
featured: true
popular: false
isOfficial: false
installCommand: |
  git clone https://github.com/example/postgres-skill
  cp -r postgres-skill ~/.qoder/skills/
date: 2026-05-08
lastUpdated: 2026-05-08
---
```

### 2. Agents Collection

**Purpose:** Community `agents.md` configurations for different tech stacks

**Path:** `src/content/agents/`

**Schema:**

```typescript
{
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;              // Valid URL
    url: string;                 // Valid GitHub URL
  };
  githubUrl: string;             // Valid URL
  tags: string[];
  category: enum;                // 'Frontend' | 'Backend' | 'Full-Stack' | 'Mobile' | 'CLI'
  useCase: string;               // Description of use case
  date: Date;                    // ISO format
  featured: boolean;             // Default: false
}
```

**Status:** Collection defined but not yet populated (coming soon)

### 3. Videos Collection

**Purpose:** Tutorial and review videos

**Path:** `src/content/videos/`

**Schema:**

```typescript
{
  title: string;
  description: string;
  youtubeId: string;             // YouTube video ID (e.g., "dQw4w9WgXcQ")
  channel: string;               // Channel name
  channelUrl: string;            // Valid URL to channel
  duration: string;              // Format: "12:34" (minutes:seconds)
  category: enum;                // 'Tutorial' | 'Review' | 'Introduction' | 'Case Study'
  tags: string[];
  date: Date;
  featured: boolean;
}
```

**Status:** Collection defined but not yet populated (coming soon)

### 4. Meetups Collection

**Purpose:** Global community meetups and hackathons

**Path:** `src/content/meetups/`

**Schema:**

```typescript
{
  title: string;
  description: string;
  location: string;              // City/Country
  date: Date;                    // Event date
  status: enum;                  // 'upcoming' | 'past'
  registrationUrl?: string;      // Optional signup link
  capacity?: number;             // Expected attendees
  attendees?: number;            // Actual attendees
  image: string;                 // Event cover image path
  recordingUrl?: string;         // Optional recording link
  photos?: string[];             // Array of photo URLs
  organizer: string;             // Organizer name
  topics: string[];              // Event topics
}
```

**Status:** Collection defined but not yet populated (coming soon)

### 5. Showcase Collection

**Purpose:** Community projects built with Qoder

**Path:** `src/content/showcase/`

**Schema:**

```typescript
{
  title: string;
  description: string;
  tags: string[];                // Min 1, max 5
  image: string;                 // Project cover image
  link?: string;                 // Optional project link (valid URL)
  featured: boolean;
  date: Date;                    // Project creation date (ISO format)
}
```

**Status:** Collection defined but not yet populated (coming soon)

### 6. Skill Sources Collection

**Purpose:** External links to skill marketplaces and communities

**Path:** `src/content/skillSources/`

**Schema:**

```typescript
{
  name: string;                  // Source name
  description: string;
  url: string;                   // Valid URL
  skillCount?: string;           // Displayed count (e.g., "500+")
  icon?: string;                 // Icon URL
  order: number;                 // Display order (1, 2, 3, ...)
}
```

**Examples:**

```yaml
---
name: Anthropic Official
description: Official Claude agent skills from Anthropic
url: https://github.com/anthropics/
skillCount: 50+
icon: /images/sources/anthropic.png
order: 1
---
```

---

## Skill File Format

### File Naming

- **Filename**: lowercase, kebab-case, `.md` extension
  - ✅ Good: `postgres-skill.md`, `web-artifacts-builder.md`
  - ❌ Bad: `PostgresSkill.md`, `postgres_skill.md`, `PostgreSQL.md`

- **Slug**: Automatically generated from filename
  - `postgres-skill.md` → URL: `/skills/postgres-skill/`

### Frontmatter Structure

Every skill file starts with frontmatter block:

```yaml
---
<field>: <value>
<field>: <value>
---
```

**Rules:**
- Starts with `---` on line 1
- Ends with `---` on separate line
- YAML format (spaces, not tabs)
- Required fields must be present
- Values must match schema types

### Content Section

After frontmatter, write the skill content in Markdown:

```markdown
## Use Cases

- List specific use cases
- How the skill helps developers

## Example

```bash
# Example code or command
```

## Notes

- Important caveats
- Limitations or prerequisites
```

**Allowed Markdown:**
- Headers: `# H1`, `## H2`, `### H3`, etc.
- Paragraphs: Blank lines between paragraphs
- Lists: `- item` or `1. item`
- Code blocks: ` ```bash ... ``` `
- Emphasis: `**bold**`, `*italic*`
- Links: `[text](url)`
- Blockquotes: `> quote`

**Not supported:**
- HTML tags (use Markdown instead)
- Front-matter after content (must be at top)
- Backticks inside code blocks (use indented code instead)

### Complete Example

```markdown
---
name: playwright-automation
title: Playwright Web Testing
description: Automate browser testing with Playwright for robust web applications
source: community
author: John Smith
githubUrl: https://github.com/example/playwright-skill
docsUrl: https://playwright.dev
category: development
tags:
  - testing
  - automation
  - qa
roles:
  - developer
  - qa
featured: true
popular: false
isOfficial: false
installCommand: |
  npm install --save-dev @playwright/test
  playwright install
date: 2026-05-08
---

## Use Cases

- End-to-end testing of web applications
- Visual regression testing
- Cross-browser compatibility testing
- Performance testing automation

## Example

```bash
# Create a test file
npx playwright codegen http://example.com

# Run tests
npx playwright test

# Run with UI
npx playwright test --ui
```

## Notes

- Requires Node.js 16+
- Supports Chromium, Firefox, WebKit
- Can run tests in parallel
```

---

## Bilingual Content System

### How Bilingual Support Works

The site is fully bilingual (English + Chinese). Content and UI are translated in two ways:

#### 1. File-based Content

Skills and other content are duplicated in both languages:

```
src/content/
├── skills/                    ← English content
│   ├── postgres-skill.md
│   └── web-artifacts.md
└── skills-zh/                 ← Chinese content (同步)
    ├── postgres-skill.md      (Same filename, Chinese content)
    └── web-artifacts.md
```

**Key Rule:** Filenames must match exactly. The system uses the slug to match English and Chinese versions.

#### 2. UI Translations

UI strings (buttons, labels, navigation) are in `src/i18n/ui.ts`:

```typescript
export const ui = {
  en: {
    'nav.skills': 'Skills',
    'page.skills.title': 'Agent Skills',
  },
  'zh-CN': {
    'nav.skills': '技能',
    'page.skills.title': '智能体技能',
  },
};
```

Components use the translation function:

```astro
---
import { useTranslations } from '../i18n';
const t = useTranslations('en');  // or 'zh-CN'
---
<h1>{t('page.skills.title')}</h1>
```

### Adding Bilingual Skill Content

#### Step 1: Create English Version

File: `src/content/skills/my-skill.md`

```markdown
---
name: my-skill
title: My Skill
description: Description
...
---

## Use Cases

- Case 1
```

#### Step 2: Create Chinese Version

File: `src/content/skills-zh/my-skill.md`

```markdown
---
name: my-skill
title: 我的技能
description: 描述
...
---

## 使用场景

- 场景 1
```

**Important:**
- Same filename as English version
- Same metadata fields (`name`, `title`, `date`, etc.)
- Translated content section

#### Step 3: Test

```bash
npm run dev
```

Visit:
- English: `http://localhost:4321/skills/my-skill/`
- Chinese: `http://localhost:4321/zh/skills/my-skill/`

Toggle language switcher to verify both versions work.

### Translating UI Strings

To add or update UI translations:

1. **Edit** `src/i18n/ui.ts`
2. **Add/update** both English and Chinese versions:

```typescript
export const ui = {
  en: {
    'my.new.string': 'English text',
  },
  'zh-CN': {
    'my.new.string': '中文文本',
  },
};
```

3. **Use** in components:

```astro
---
import { useTranslations } from '../i18n';
const t = useTranslations(lang);
---
<p>{t('my.new.string')}</p>
```

### Translating Skill Names & Descriptions

Skill content (names, descriptions) can be translated via `src/i18n/skills-translations.ts`:

```typescript
export const skillsTranslations: Record<string, SkillTranslation> = {
  'postgres-skill': {
    'zh-CN': {
      name: '数据库管理',
      title: 'PostgreSQL 数据库管理',
      description: '使用 PostgreSQL agents 掌握数据库操作',
    },
  },
};
```

Use in components:

```astro
---
import { getSkillDisplayName } from '../i18n';
const displayName = getSkillDisplayName(slug, data.name, lang);
---
<h1>{displayName}</h1>
```

---

## Schema Validation

### Validation Process

When you run `npm run build` or `npx astro check`, Astro validates all content against schemas in `src/content.config.ts`:

```typescript
const skillsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    title: z.string(),
    // ... more fields
  }),
});
```

### Validation Tools

```bash
# Check TypeScript and content validation
npx astro check

# Outputs validation errors like:
# src/content/skills/my-skill.md
#   Error: category should be one of: development, design, ...
```

### Type Safety

The schema definitions create TypeScript types automatically:

```typescript
import type { CollectionEntry } from 'astro:content';

// This type is auto-generated from skillsCollection schema
type Skill = CollectionEntry<'skills'>;

// Using it in components:
const skill: Skill = {
  data: {
    name: 'postgres',
    title: 'PostgreSQL',
    // ... other fields
  },
};
```

---

## Common Errors & Fixes

### Error: "name is required"

**Cause:** Missing `name` field in frontmatter

**Fix:**
```yaml
---
name: my-skill-name
```

**Rules:**
- Must be present
- Must be lowercase
- Must be kebab-case (no spaces or underscores)
- Usually matches filename (without `.md`)

---

### Error: "category should be one of: development, design, ..."

**Cause:** Invalid category value

**Fix:** Use exact value from list:

```yaml
category: development      # ✅ Correct
category: Development      # ❌ Wrong (capitalized)
category: dev             # ❌ Wrong (abbreviated)
category: 'development'   # ✅ Also correct (quoted)
```

**Valid values:**
- `development`, `design`, `marketing`, `productivity`, `automation`, `data`, `security`, `document`, `meta`

---

### Error: "date should be a valid date"

**Cause:** Invalid date format

**Fix:** Use ISO format (YYYY-MM-DD):

```yaml
date: 2026-05-08          # ✅ Correct
date: 05/08/2026          # ❌ Wrong format
date: May 8, 2026         # ❌ Wrong format
date: 2026-5-8            # ❌ Missing leading zeros
```

---

### Error: "githubUrl must be a valid URL"

**Cause:** Invalid or missing URL scheme

**Fix:** Include full URL with `https://`:

```yaml
githubUrl: https://github.com/user/repo        # ✅ Correct
githubUrl: github.com/user/repo                # ❌ Missing scheme
githubUrl: https://github.com/user/repo/       # ✅ Also correct
```

---

### Error: "source should be one of: anthropic, vercel, ..."

**Cause:** Invalid source value

**Fix:** Use exact enum value:

```yaml
source: community          # ✅ Correct
source: Community          # ❌ Wrong (capitalized)
source: user             # ❌ Invalid value
```

**Valid values:**
- `anthropic`, `vercel`, `community`, `enterprise`

---

### Error: "tags should be an array"

**Cause:** Missing array brackets for array field

**Fix:** Use array syntax:

```yaml
tags:                      # ✅ Correct (empty array)
  - tag1
  - tag2

tags: tag1, tag2          # ❌ Wrong (comma-separated string)
tags: tag1                # ❌ Wrong (single value, not array)
```

---

### Error: "Schema validation failed"

**Cause:** Unknown - could be multiple issues

**Debug:**
```bash
npx astro check --debug
# Shows detailed error with line numbers and field names
```

**Check:**
1. Frontmatter starts with `---` on line 1
2. Frontmatter ends with `---` on separate line
3. YAML syntax is correct (spaces not tabs)
4. All required fields are present
5. Field values match expected types

---

## Adding New Collection Types

### Step 1: Define Schema

Edit `src/content.config.ts`:

```typescript
const myNewCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
  }),
});
```

### Step 2: Add to Exports

```typescript
export const collections = {
  // ... existing collections
  myNewCollection: myNewCollection,
};
```

### Step 3: Create Content Directory

```bash
mkdir -p src/content/myNewCollection
```

### Step 4: Create Content Files

File: `src/content/myNewCollection/item-1.md`

```markdown
---
title: My Item
description: Description
date: 2026-05-08
---

Content here...
```

### Step 5: Query in Pages

```astro
---
import { getCollection } from 'astro:content';
const items = await getCollection('myNewCollection');
---

{items.map(item => (
  <div>
    <h2>{item.data.title}</h2>
    <p>{item.data.description}</p>
  </div>
))}
```

---

## Validation Checklist

Before committing content:

- [ ] File in correct directory (`src/content/skills/` for English)
- [ ] Filename is lowercase kebab-case (`my-skill.md`)
- [ ] Frontmatter starts with `---` and ends with `---`
- [ ] All required fields present: `name`, `title`, `description`, `source`, `githubUrl`, `category`, `date`
- [ ] No extra spaces or tabs in YAML
- [ ] `date` in ISO format: `YYYY-MM-DD`
- [ ] `category` is valid enum value
- [ ] `source` is valid enum value
- [ ] `githubUrl` is full HTTPS URL
- [ ] Chinese version exists (same filename in `skills-zh/`)
- [ ] Run `npx astro check` passes
- [ ] Run `npm run build` succeeds

---

*Last updated: May 8, 2026*
