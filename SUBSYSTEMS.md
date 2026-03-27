# Qoder Community - Technical Subsystems Guide

This document explains the key technical subsystems, their architecture, and how to work with them.

## Table of Contents

1. [Content Collections & Schema](#content-collections--schema)
2. [Internationalization (i18n) System](#internationalization-i18n-system)
3. [Share Image Generation](#share-image-generation)
4. [Interactive Components](#interactive-components)

---

## Content Collections & Schema

### Overview

The project uses Astro's Content Collections API to manage structured content with Zod validation. Content is organized into six main collections.

**Location:** `src/content.config.ts`

### Collections

#### 1. Skills Collection

**Path:** `src/content/skills/` (English), `src/content/skills-zh/` (Chinese)

**Schema:**

```typescript
{
  name: string;                    // Internal slug (kebab-case)
  title: string;                   // Display title
  description: string;             // Short description (1-2 sentences)
  source: 'anthropic' | 'vercel' | 'community' | 'enterprise';
  author?: string;                 // Contributor name
  githubUrl: string;               // Required: GitHub repository URL
  docsUrl?: string;                // Optional: skill documentation
  marketplaceUrl?: string;         // Optional: marketplace link
  category: 'document' | 'development' | 'design' | 'automation' | 
            'marketing' | 'data' | 'security' | 'productivity' | 'meta';
  tags?: string[];                 // Searchable tags
  roles?: ['developer' | 'marketer' | 'designer' | 'pm' | 'data-analyst' | 
           'devops' | 'content' | 'finance' | 'hr' | 'legal' | 'sales' | 'executive'][];
  featured?: boolean;              // Show on homepage
  popular?: boolean;               // Mark as popular
  isOfficial?: boolean;            // Verify as official
  installCommand?: string;         // Shell command to install
  date: Date;                      // Creation date
  lastUpdated?: Date;              // Last update date
}
```

**Content Structure:**

Skills markdown files use standard frontmatter + markdown body. Common sections include:

- **Use Cases** - Practical scenarios where the skill applies
- **Core Capabilities** - Key features and capabilities
- **Example** - Usage examples or commands
- **Notes** - Important considerations and limitations

**Example:**

```markdown
---
name: postgres
title: PostgreSQL Setup & Query Skills
description: Database administration and query optimization for PostgreSQL
source: community
author: John Doe
githubUrl: https://github.com/user/postgres-skill
category: development
tags:
  - database
  - sql
roles:
  - developer
  - devops
featured: false
date: 2026-01-15
---

## Use Cases

- Setting up PostgreSQL for development
- Writing optimized queries
- Managing database migrations

## Core Capabilities

- Connection pooling with PgBouncer
- Query performance analysis
- Backup and restore procedures

## Example

\`\`\`sql
SELECT * FROM users WHERE created_at > NOW() - INTERVAL '30 days';
\`\`\`

## Notes

- Always use parameterized queries to prevent SQL injection
- Index frequently queried columns
```

#### 2. Agents Collection

**Path:** `src/content/agents/`

**Schema:**

```typescript
{
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;    // URL to avatar image
    url: string;       // GitHub/personal URL
  };
  githubUrl: string;
  tags: string[];
  category: 'Frontend' | 'Backend' | 'Full-Stack' | 'Mobile' | 'CLI';
  useCase: string;
  date: Date;
  featured?: boolean;
}
```

#### 3. Videos Collection

**Path:** `src/content/videos/`

**Schema:**

```typescript
{
  title: string;
  description: string;
  youtubeId: string;                    // YouTube video ID
  channel: string;                      // Channel name
  channelUrl: string;
  duration: string;                     // e.g., "25:45"
  category: 'Tutorial' | 'Review' | 'Introduction' | 'Case Study';
  tags: string[];
  date: Date;
  featured?: boolean;
}
```

#### 4. Meetups Collection

**Path:** `src/content/meetups/`

**Schema:**

```typescript
{
  title: string;
  description: string;
  location: string;
  date: Date;
  status: 'upcoming' | 'past';
  registrationUrl?: string;
  capacity?: number;
  attendees?: number;
  image: string;                       // Path to cover image
  recordingUrl?: string;               // Video recording link
  photos?: string[];                   // Photo gallery paths
  organizer: string;
  topics: string[];
}
```

#### 5. Showcase Collection

**Path:** `src/content/showcase/`

**Schema:**

```typescript
{
  title: string;
  description: string;
  tags: string[];                      // 1-5 tags max
  image: string;
  link?: string;                       // Project URL
  featured?: boolean;
  date: Date;
}
```

#### 6. Skill Sources Collection

**Path:** `src/content/skillSources/`

**Schema:**

```typescript
{
  name: string;                        // Source name
  description: string;
  url: string;                         // Source URL
  skillCount?: string;                 // e.g., "50+"
  icon?: string;                       // Path to icon
  order: number;                       // Display order
}
```

### Adding Content

1. **Create the markdown file** in the appropriate collection folder
2. **Add frontmatter** with all required fields
3. **Write markdown content** for the body
4. **Build locally** to validate schema: `npm run build`
5. **Submit PR** with the changes

**Validation Errors:**

If you see schema validation errors during build, check:
- All required fields are present
- Field values match the allowed enum values
- Date fields are in YYYY-MM-DD format
- URLs are properly formatted

---

## Internationalization (i18n) System

### Overview

The project supports English and Chinese (Simplified) with a centralized translation system for UI strings, labels, and skill metadata.

**Location:** `src/i18n/`

### Architecture

#### 1. Core Module (`index.ts`)

Exports all i18n utilities and translations:

```typescript
export { ui, languages, defaultLang, type UIKey } from './ui';
export { getLangFromUrl, getLangFromPath, useTranslations, getLocalizedPath, ... } from './utils';
export { skillsTranslations, getSkillTranslation, ... } from './skills-translations';
export { skillSourcesTranslations, getSkillSourceDescription, ... } from './skillSources-translations';
```

#### 2. UI Translations (`ui.ts`)

Contains all translatable UI strings for the interface.

**Structure:**

```typescript
export const ui = {
  en: {
    'nav.skills': 'Skills',
    'page.skills.title': 'Skills',
    'category.development': 'Development',
    // ... 100+ keys
  },
  'zh-CN': {
    'nav.skills': 'Skills',  // Keep in English
    'page.skills.title': 'Agent Skills',
    'category.development': '开发',
    // ... Chinese translations
  }
};
```

**Naming Convention:**

- `nav.*` - Navigation items
- `page.*` - Page titles and descriptions
- `skill.*` - Skill detail page labels
- `info.*` - Information field labels
- `badge.*` - Badge text
- `category.*` - Skill categories
- `source.*` - Skill sources
- `role.*` - Job roles
- `filter.*` - Filter UI
- `agent.*` - Agent card labels
- `common.*` - Common terms
- `footer.*` - Footer text

**Adding a New String:**

1. Add key-value pair to `en` object
2. Add Chinese translation to `zh-CN` object
3. Use `useTranslations()` in components to access: `t('nav.skills')`

#### 3. Utility Functions (`utils.ts`)

**Key Functions:**

```typescript
// Get language from URL
getLangFromUrl(url: string): 'en' | 'zh-CN'

// Build localized path
getLocalizedPath(slug: string, lang: string): string
// Returns: /skills/postgres/ or /zh/skills/postgres/

// Get translation function
useTranslations(lang: string): (key: UIKey) => string

// Format date with locale
formatDate(date: Date, lang: string): string

// Get translated category label
getCategoryLabel(category: string, lang: string): string

// Get translated source label
getSourceLabel(source: string, lang: string): string

// Get translated role label
getRoleLabel(role: string, lang: string): string
```

#### 4. Skill Translations (`skills-translations.ts`)

Maps skill slugs to bilingual titles and descriptions. Used when skill metadata differs between languages.

**Structure:**

```typescript
export const skillsTranslations = {
  'skill-name': {
    name: 'Skill Name (English)',
    'name-zh': 'Skill Name (Chinese)',
    title: 'Skill title...',
    'title-zh': 'Skill title...',
    description: '...',
    'description-zh': '...',
  }
};
```

**Usage in Components:**

```typescript
import { getSkillTitle, getSkillTranslation } from '../i18n';

// Get title with fallback to frontmatter
const title = getSkillTitle(slug, skill.data.title, lang);

// Get full translation object
const trans = getSkillTranslation(slug);
```

#### 5. Skill Sources Translations (`skillSources-translations.ts`)

Similar to skill translations but for external skill sources.

### Language Detection & Routing

**URL Structure:**

- English: `/skills/`, `/agents/`, `/learn/`
- Chinese: `/zh/skills/`, `/zh/agents/`, `/zh/learn/`

**How It Works:**

1. Astro routes with `src/pages/zh/` prefix automatically handle Chinese locale
2. Components receive `lang` prop from layout context
3. `useTranslations(lang)` provides localized strings
4. Links use `getLocalizedPath()` to build correct URLs

**Example Component:**

```astro
---
import { useTranslations, getLangFromUrl, getLocalizedPath } from '../i18n';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const skillLink = getLocalizedPath('postgres', lang);
---

<a href={skillLink}>
  {t('nav.skills')}
</a>
```

### Best Practices

1. **Always use translation keys** for UI strings
2. **Avoid hardcoding Chinese text** in components
3. **Test both languages** when making UI changes
4. **Keep translations concise** for space-constrained layouts
5. **Use skill translations** only when frontmatter values need different translations

---

## Share Image Generation

### Overview

Generates Xiaohongshu (小红书) optimized share images (900×1200px, 3:4 ratio) with skill branding, QR codes, and category-specific messaging.

**Location:** `src/utils/share-image-generator.ts`

### Architecture

#### Main Export: `generateShareImage(options)`

**Parameters:**

```typescript
interface ShareImageOptions {
  slug: string;          // Skill slug for image fallback
  skillTitle: string;    // Skill name to display
  category: string;      // Skill category for messaging
}
```

**Returns:** `Promise<string>` (Base64 data URL)

**Usage Example:**

```typescript
const dataUrl = await generateShareImage({
  slug: 'postgres',
  skillTitle: 'PostgreSQL Setup',
  category: 'development'
});

// Download or display
downloadImage(dataUrl, 'postgres-share.png');
```

#### Image Layout

The generated image is structured as follows (top to bottom):

```
┌─────────────────────────────┐
│                             │
│  ✨ 今日效率分享            │  (Header)
│                             │
├─────────────────────────────┤
│                             │
│    [Skill Demo Image]       │  (500×500px centered)
│    (with rounded corners)   │
│                             │
├─────────────────────────────┤
│  我用 Qoder +「Skills: X」   │  (Headline)
│  让 AI 帮我搞定了开发任务!   │  (Subheading)
│                             │
├─────────────────────────────┤
│           [Qoder Logo]      │  (Brand)
│                             │
│    下载 Qoder 体验 ↓         │  (CTA)
│                             │
│       [QR Code]             │  (QR Code)
│      qoder.com              │  (Domain)
│                             │
└─────────────────────────────┘
```

### Key Features

#### 1. Image Fallback System

Images loaded in priority order:

1. **Skill-specific image:** `/images/skills/share/{slug}-share.jpg`
2. **Category default:** `/images/skills/share/default-{category}.jpg`

If skill image doesn't exist, uses category default automatically.

#### 2. Category Mapping

**Categories → Outcome Messages:**

```typescript
{
  document: '文档处理',      // Document processing
  design: '创意设计',        // Creative design
  development: '开发任务',   // Development tasks
  marketing: '营销内容',     // Marketing content
  automation: '流程自动化', // Process automation
  productivity: '效率提升',  // Productivity boost
  security: '安全分析',      // Security analysis
  data: '数据处理',          // Data processing
  meta: '工具配置'           // Tool configuration
}
```

#### 3. Dynamic Layout

**Font Sizes & Spacing:**
- Title: 36px (bold)
- Main headline: 32px (bold)
- Subheading: 28px
- Call-to-action: 24px
- Domain: 20px

**Colors:**
- Background: `#f4f4f4` (light gray)
- Text primary: `#161616` (dark)
- Text secondary: `#525252` (medium gray)
- Accent: `#2ADB5C` (Qoder green)

#### 4. Image Loading & Error Handling

**Promise-based image loading:**

```typescript
function loadImage(src: string): Promise<HTMLImageElement>
```

- Handles CORS with `crossOrigin: 'anonymous'`
- Rejects on load failure with descriptive error
- Parallel loading of multiple images with `Promise.all()`

**Image Existence Check:**

```typescript
async function imageExists(src: string): Promise<boolean>
```

Uses HEAD request to check if image exists without downloading.

### Canvas Rendering Process

1. **Create canvas** (900×1200px)
2. **Get context** (`2d`)
3. **Load all images in parallel** (demo, logo, QR code)
4. **Draw layers in order:**
   - Background (light gray)
   - Header text
   - Demo image (with rounded corners and shadow)
   - Share text lines
   - Separator line
   - Logo
   - Call-to-action text
   - QR code
   - Domain text
5. **Export as PNG** (lossless, quality 1.0)

### Helper: `roundRect()`

Draws rounded rectangles on canvas (not natively supported).

**Usage:**

```typescript
roundRect(ctx, x, y, width, height, radius);
ctx.fill();
```

### Download Function

```typescript
export function downloadImage(dataUrl: string, filename: string): void
```

- Creates temporary `<a>` element
- Triggers browser download
- Cleans up DOM

### Performance Considerations

- All image loading is parallelized with `Promise.all()`
- Canvas rendering is synchronous after images load
- Base64 data URL is memory-resident (suitable for display, not storage)
- Typical generation time: 100-200ms

### Extending the System

To add new categories or customize messaging:

1. Update `outcomeMap` in the file
2. Add corresponding images to `public/images/skills/share/`
3. Test with `generateShareImage()` to verify layout

---

## Interactive Components

### Overview

Complex Astro components with client-side interactivity for skill browsing and role-based recommendations.

### SkillFilter Component

**Location:** `src/components/SkillFilter.astro`

**Purpose:** Filter skills by category with visual feedback

**Props:**

```typescript
interface Props {
  activeCategory?: string;     // Initial category filter
  counts?: Record<string, number>;  // Item counts per category
  lang?: keyof typeof ui;      // Language (en/zh-CN)
}
```

**Features:**

- **Pill-based UI:** Rounded pill buttons for each category
- **Count badges:** Show number of items per category
- **URL state:** Filters update `?category=` query parameter
- **Keyboard accessible:** Button elements with proper events

**DOM Structure:**

```html
<div class="skill-filter" data-filter-component>
  <div class="filter-pills">
    <button class="filter-pill active" data-category="all">
      <span class="pill-label">All</span>
      <span class="pill-count">42</span>
    </button>
    <!-- More pills... -->
  </div>
</div>

<div data-skill-category="development">Skill Card</div>
<!-- More cards with data-skill-category... -->
```

**Client-Side Logic:**

1. **Initialize on load:**
   - Apply inline styles to pills (border, background, color)
   - Restore filter from URL query parameters

2. **On pill click:**
   - Update all pill styles (active pill = green, others = teal)
   - Show/hide skill cards based on category match
   - Update URL without page reload

3. **Persist across navigation:**
   - Re-initialize on `astro:after-swap` event (Astro view transitions)

**Styling Notes:**

- Inline styles override CSS (ensures correct colors)
- Active pill: `#2ADB5C` background, white text
- Inactive pill: `#3F5B54` border, transparent background
- Mobile: Horizontal scroll with fade-out gradient

### RoleSelector Component

**Location:** `src/components/RoleSelector.astro`

**Purpose:** Show top 10 skills recommended for each job role

**Props:**

```typescript
interface Props {
  skills: CollectionEntry<'skills'>[];  // All available skills
  lang?: keyof typeof ui;               // Language
}
```

**Features:**

- **Role pills:** 12 role options (Developer, Designer, PM, etc.)
- **Pre-computed skills:** Skills filtered & sorted per role at build time
- **Ranked display:** Numbered list (#1, #2, etc.)
- **Bilingual labels:** Role names in English or Chinese
- **Language-aware links:** Links include `/zh/` prefix for Chinese

**Supported Roles:**

```
developer, marketer, designer, pm, data-analyst, devops, 
content, sales, finance, hr, legal, executive
```

**DOM Structure:**

```html
<div class="role-selector" data-role-selector>
  <div class="role-pills">
    <button class="role-pill active" data-role="developer">
      Developer
    </button>
    <!-- More roles... -->
  </div>
  
  <div class="role-content">
    <div class="role-skills active" data-role-content="developer">
      <h4>Recommended Skills for Developer</h4>
      <div class="role-skills-list">
        <a href="/skills/postgres/" class="role-skill-item">
          <span class="skill-rank">#1</span>
          <span class="skill-info">
            <span class="skill-name">postgres</span>
            <span class="skill-desc">PostgreSQL Setup...</span>
          </span>
        </a>
        <!-- More skills... -->
      </div>
    </div>
    <!-- More role content... -->
  </div>
</div>
```

**Client-Side Logic:**

1. **Initialize:**
   - Apply inline styles to all role pills
   - Make first role (developer) active

2. **On role pill click:**
   - Update pill styles (clicked pill active, others inactive)
   - Show/hide role content divs with fade animation
   - Ensure inline styles override CSS

3. **Persist across navigation:**
   - Re-initialize on `astro:after-swap` event

**Performance:**

- Skills are pre-filtered at build time (not runtime)
- Each role caches top 10 relevant skills
- No API calls or dynamic filtering
- Fast client-side toggle with CSS transitions

**Styling Notes:**

- Inline styles enforced for pill state colors
- Active state: `#2ADB5C` background, `#ffffff` text
- Inactive state: `#3F5B54` border
- Fade-in animation: `opacity: 0 → 1` in 150ms
- Hover effect: Slight translate on skill items

**Mobile Considerations:**

- Role pills scroll horizontally (masked fade-out on right)
- Single column for skill list
- Touch-friendly tap targets (36px height)
- Responsive font sizes

---

## Troubleshooting

### Build Errors

**Schema Validation Failed**

Check `src/content.config.ts` and your markdown frontmatter:
- Ensure all required fields present
- Verify enum values match allowed options
- Check date format (YYYY-MM-DD)

**404 on Skill Link**

Ensure skill slug exists:
```bash
ls src/content/skills/ | grep postgres
# Should show: postgres.md
```

### Component Issues

**Filter not responding to clicks**

Check browser console for errors. Ensure:
- `data-filter-component` selector is present
- `data-skill-category` attributes on skill cards match category values
- No CSS conflicts with `!important` rules

**Role selector showing empty**

Verify skills have `roles` array in frontmatter:
```yaml
roles:
  - developer
  - devops
```

**Images not generating**

Check `public/images/skills/share/` folder exists:
```bash
ls public/images/skills/share/ | head
```

Ensure image naming matches:
- Skill-specific: `{slug}-share.jpg`
- Category default: `default-{category}.jpg`

---

## Related Files

- **Content schema:** `src/content.config.ts`
- **i18n utilities:** `src/i18n/utils.ts`
- **Translation strings:** `src/i18n/ui.ts`, `src/i18n/skills-translations.ts`
- **Components:** `src/components/SkillFilter.astro`, `src/components/RoleSelector.astro`
- **Share images:** `src/utils/share-image-generator.ts`
- **Styles:** `src/styles/custom.css`
- **Layout:** `src/pages/skills.astro`, `src/pages/zh/skills.astro`
