# Qoder Community Subsystems Documentation

Detailed technical documentation for core subsystems that have weak documentation or complex implementation.

## Table of Contents

1. [Content Collections Schema](#content-collections-schema)
2. [Internationalization (i18n) System](#internationalization-i18n-system)
3. [Share Image Generation](#share-image-generation)
4. [Interactive Components](#interactive-components)
5. [Styling System](#styling-system)

---

## Content Collections Schema

### Overview

The platform uses Astro's `astro:content` collections API to manage structured data. All collections are defined in `src/content.config.ts` with Zod schema validation.

### Skills Collection

**Location**: `src/content/skills/` and `src/content/skills-zh/`

**Required Frontmatter Fields**:

```yaml
name: unique-skill-name          # Unique identifier (kebab-case)
title: "Skill Display Title"     # Short title (20-40 chars)
description: "Brief description" # 1-2 sentences explaining the skill
category: development            # One of 9 categories
date: 2026-01-01               # Publication date (YYYY-MM-DD)
githubUrl: https://github.com/...  # Required: GitHub repo URL
```

**Optional Frontmatter Fields**:

```yaml
source: community               # Source: anthropic|vercel|community|enterprise
author: "Author Name"           # Creator credit
docsUrl: https://example.com   # External documentation link
marketplaceUrl: https://...    # Marketplace link
tags: [tag1, tag2]             # Search tags (array)
roles:                         # Applicable job roles
  - developer
  - designer
  - marketer
featured: false                # Homepage feature flag
popular: false                 # Popular badge flag
isOfficial: false              # Official Qoder badge flag
installCommand: |              # Custom install instructions
  git clone https://...
lastUpdated: 2026-01-15        # Last update date (optional)
```

**Schema Validation** (TypeScript):

```typescript
const skillsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    source: z.enum(['anthropic', 'vercel', 'community', 'enterprise']),
    author: z.string().optional(),
    githubUrl: z.string().url(),
    docsUrl: z.string().url().optional(),
    marketplaceUrl: z.string().url().optional(),
    category: z.enum([
      'document', 'development', 'design', 'automation',
      'marketing', 'data', 'security', 'productivity', 'meta'
    ]),
    tags: z.array(z.string()).optional(),
    roles: z.array(z.enum([
      'developer', 'marketer', 'designer', 'pm', 'data-analyst',
      'devops', 'content', 'finance', 'hr', 'legal', 'sales', 'executive'
    ])).optional(),
    featured: z.boolean().default(false),
    popular: z.boolean().default(false),
    isOfficial: z.boolean().default(false),
    installCommand: z.string().optional(),
    date: z.coerce.date(),
    lastUpdated: z.coerce.date().optional(),
  }),
});
```

**File Naming Convention**:
- Use kebab-case: `my-awesome-skill.md`
- Must match `name` field in frontmatter
- Must have corresponding file in `skills-zh/` for Chinese version

### Agents Collection

**Location**: `src/content/agents/`

**Schema Fields**:

```yaml
title: "Agent Name"
description: "What this agent does"
author:
  name: "Author Name"
  avatar: https://github.com/avatar.png  # URL required
  url: https://github.com/username       # URL required
githubUrl: https://github.com/repo      # URL required
tags: [tag1, tag2]
category: Frontend | Backend | Full-Stack | Mobile | CLI
useCase: "Example: Build React components"
date: 2026-01-01
featured: false
```

### Videos Collection

**Location**: `src/content/videos/`

**Schema Fields**:

```yaml
title: "Video Title"
description: "Video description"
youtubeId: "dQw4w9WgXcQ"        # YouTube video ID
channel: "Channel Name"
channelUrl: https://youtube.com/@channel
duration: "15:30"               # Format: MM:SS
category: Tutorial | Review | Introduction | Case Study
tags: [tag1, tag2]
date: 2026-01-01
featured: false
```

### Meetups Collection

**Location**: `src/content/meetups/`

**Schema Fields**:

```yaml
title: "Meetup Title"
description: "Event description"
location: "City, Country"
date: 2026-01-15
status: upcoming | past
registrationUrl: https://eventbrite.com/...  # optional
capacity: 100
attendees: 45
image: /images/meetups/meetup-name.jpg
recordingUrl: https://youtube.com/...        # optional
photos: [/images/meetup1.jpg, /images/meetup2.jpg]  # optional
organizer: "Organizer Name"
topics: [topic1, topic2]
```

### Showcase Collection

**Location**: `src/content/showcase/`

**Schema Fields**:

```yaml
title: "Project Name"
description: "What was built"
tags: [tag1, tag2]
image: /images/showcase/project.jpg
link: https://example.com         # optional
featured: false
date: 2026-01-01
```

### Skill Sources Collection

**Location**: `src/content/skillSources/`

**Schema Fields**:

```yaml
name: "Source Name"
description: "Brief description"
url: https://example.com/skills   # URL required
skillCount: "200+"                # optional
icon: /images/sources/icon.png    # optional
order: 1                          # Sort order (required)
```

### Docs Collection

**Location**: `src/content/docs/`

Uses Starlight's `docsLoader()` and `docsSchema()`. Automatically generates navigation and integrates with site sidebar.

---

## Internationalization (i18n) System

### System Architecture

The i18n system enables bilingual content (English/Chinese) with three levels:

1. **UI Level**: Navigation, buttons, labels (hardcoded translations)
2. **Content Level**: Skill titles/descriptions (per-file translations)
3. **Language Detection**: Automatic URL-based language routing

### Files & Exports

**`src/i18n/ui.ts`** - Global UI translations

```typescript
export const defaultLang = 'en-US';
export const languages = { 'en-US': 'English', 'zh-CN': '简体中文' };

export const ui = {
  'en-US': {
    'nav.skills': 'Skills',
    'category.development': 'Development',
    'role.developer': 'Developer',
    // ... 100+ translation keys
  },
  'zh-CN': {
    'nav.skills': 'Skills',
    'category.development': '开发',
    'role.developer': '开发者',
    // ... 100+ translation keys
  },
};

export type UIKey = keyof typeof ui['en-US'];
```

**`src/i18n/utils.ts`** - Helper functions

```typescript
// Get language from URL pathname
getLangFromUrl(url: URL): keyof typeof ui

// Get language from file path
getLangFromPath(pathname: string): keyof typeof ui

// Create translation function for language
useTranslations(lang: keyof typeof ui): (key: UIKey) => string

// Get localized path (with lang prefix)
getLocalizedPath(pathname: string, targetLang: keyof typeof ui): string

// Format date according to locale
formatDate(date: Date, lang: keyof typeof ui): string

// Get translated label for category/source/role
getCategoryLabel(category: string, lang: keyof typeof ui): string
getSourceLabel(source: string, lang: keyof typeof ui): string
getRoleLabel(role: string, lang: keyof typeof ui): string
```

**`src/i18n/skills-translations.ts`** - Per-skill translations

```typescript
export const skillsTranslations: Record<string, SkillTranslation> = {
  'skill-name': {
    title: { 'zh-CN': 'Chinese Title' },
    description: { 'zh-CN': 'Chinese Description' },
  },
  // More skills...
};

export function getSkillTranslation(slug: string, key: keyof SkillTranslation): SkillTranslation[key]
export function getSkillDisplayName(slug: string, defaultName: string, lang: keyof typeof ui): string
export function getSkillTitle(slug: string, defaultTitle: string, lang: keyof typeof ui): string
export function getSkillDescription(slug: string, defaultDesc: string, lang: keyof typeof ui): string
```

### Language Detection Flow

**In Components**:

```astro
---
import { getLangFromPath, useTranslations } from '../i18n';

const lang = getLangFromPath(Astro.url.pathname);
const t = useTranslations(lang);
---

<div>
  <h1>{t('nav.skills')}</h1>
</div>
```

**Priority**:
1. Check URL path: `/zh/...` → 'zh-CN'
2. Default: 'en-US'

### URL Routing Pattern

```
English:
  /              (home)
  /skills/       (skill listing)
  /skills/my-skill/   (skill detail)
  /agents/       (agent listing)

Chinese:
  /zh/           (home)
  /zh/skills/    (skill listing)
  /zh/skills/my-skill/ (skill detail)
  /zh/agents/    (agent listing)
```

### Astro Configuration (i18n Setup)

In `astro.config.mjs`:

```javascript
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
```

### Translation Hierarchy for Skills

When rendering a skill in SkillCard or detail page:

```
1. Check skillsTranslations[slug][field][lang]
   ↓ if exists, use it
2. Fall back to markdown frontmatter
   ↓ (English content)
3. Fall back to field name itself as fallback

Example:
  For zh-CN rendering of "my-skill":
  - skillsTranslations['my-skill']['title']['zh-CN']
  - OR frontmatter.title (if no translation)
```

### Adding New Translations

**To add UI translations**:
1. Add key to `ui.ts` in both language objects
2. Use key in component: `t('new.key')`

**To add skill translations**:
1. Add entry to `skillsTranslations` in `skills-translations.ts`
2. Override title/description for specific languages
3. Fallback to frontmatter if no translation

**Example**:

```typescript
// skills-translations.ts
export const skillsTranslations = {
  'prompt-engineering': {
    title: {
      'zh-CN': '提示工程',
    },
    description: {
      'zh-CN': '掌握编写高效提示词的技巧...',
    },
  },
};
```

---

## Share Image Generation

### Purpose & Use Case

Generate social media share images (900x1200px, 3:4 ratio) for skills on demand. Used for Xiaohongshu/TikTok sharing with skill context, Qoder branding, and QR code.

### Implementation Location

`src/utils/share-image-generator.ts` (239 lines)

### Core Functions

#### `generateShareImage(options: ShareImageOptions): Promise<string>`

Generates a complete share image and returns Base64 PNG data URL.

**Parameters**:

```typescript
interface ShareImageOptions {
  slug: string;           // Skill slug for image lookup
  skillTitle: string;     // Display title of skill
  category: string;       // Skill category (for outcome text)
}
```

**Returns**: Base64 data URL (`data:image/png;base64,...`)

**Execution Flow**:

```
1. Initialize Canvas (900x1200)
2. Load Assets (Parallel):
   - Skill image or category default
   - Qoder logo (/images/qoder-logo.png)
   - QR code (/images/qrcode-qoder.png)
3. Draw Elements (Sequential):
   a. Light gray background
   b. Title: "✨ 今日效率分享"
   c. Demo image (rounded, centered, max 500x500)
   d. Share text (2 lines, outcome mapping)
   e. Separator line
   f. Logo (scaled, centered)
   g. CTA: "下载 Qoder 体验 ↓"
   h. QR code (140x140, rounded bg)
   i. Domain: "qoder.com"
4. Export as PNG (1.0 quality)
```

#### `downloadImage(dataUrl: string, filename: string): void`

Downloads generated image to user's disk.

**Parameters**:
- `dataUrl`: Base64 PNG from `generateShareImage()`
- `filename`: Download filename (e.g., 'skill-name-share.png')

**Behavior**:
1. Create anchor element
2. Set href to data URL
3. Trigger click (browser downloads)
4. Clean up

#### `getShareImagePath(slug: string, category: string): Promise<string>`

Resolves image path with fallback logic.

**Logic**:

```
Requested: /images/skills/share/{slug}-share.jpg
  ↓
Exists? → Use it
  ↓
Not found → /images/skills/share/default-{category}.jpg
```

**Returns**: Public path to image file

#### `loadImage(src: string): Promise<HTMLImageElement>`

Promise-based image loading.

**Handles**: CORS, error states

#### Helper: `roundRect(...)`

Draws rounded rectangle on canvas context. Used for image borders and backgrounds.

### Category to Outcome Mapping

Maps skill categories to Chinese outcome descriptions in share text:

```typescript
const outcomeMap: Record<string, string> = {
  document: '文档处理',
  design: '创意设计',
  development: '开发任务',
  marketing: '营销内容',
  automation: '流程自动化',
  productivity: '效率提升',
  security: '安全分析',
  data: '数据处理',
  meta: '工具配置',
};
```

**Example Share Text**:

```
我用 Qoder +「Skills: React Development」
让 AI 帮我搞定了开发任务!
```

### Asset Files Required

For share image generation to work, ensure these files exist:

```
public/
├── images/
│   ├── qoder-logo.png              # Qoder logo (any size)
│   ├── qrcode-qoder.png            # QR code pointing to qoder.com
│   └── skills/share/
│       ├── skill-name-share.jpg    # Skill-specific images (optional)
│       ├── default-development.jpg # Category defaults (required)
│       ├── default-design.jpg
│       ├── default-marketing.jpg
│       ├── default-automation.jpg
│       ├── default-productivity.jpg
│       ├── default-security.jpg
│       ├── default-data.jpg
│       └── default-document.jpg
```

### Canvas Layout Specification

```
900 x 1200 px (3:4 ratio)

┌─────────────────────────────────┐
│                                 │
│      ✨ 今日效率分享 (70px)      │ 0-110px
│                                 │
├─────────────────────────────────┤
│                                 │
│      Demo Image (500x500)       │ 110-610px
│      (Rounded, centered)        │
│      w/ white bg (520x520)      │
│                                 │
├─────────────────────────────────┤
│                                 │
│  我用 Qoder +「Skills: Title」  │ 650-725px
│  让 AI 帮我搞定了{outcome}!     │
│                                 │
├─────────────────────────────────┤
│                                 │
│         Qoder Logo              │ 780-910px
│                                 │
│     下载 Qoder 体验 ↓            │ 930px
│                                 │
│    QR Code (140x140)            │ 960-1100px
│                                 │
│        qoder.com                │ 1150px
│                                 │
└─────────────────────────────────┘
```

### Image Compression & Optimization

Current implementation:

```typescript
// Exports as PNG with quality 1.0
canvas.toDataURL('image/png', 1.0)
```

For optimization, consider:
1. WebP format (better compression)
2. Quality 0.85 (visual quality good, file smaller)
3. Resize large images before canvas rendering

### Future Enhancements

1. **Caching**: Store generated images to avoid re-generation
2. **Templates**: Multiple layout templates for different platforms
3. **Localization**: Chinese vs English text variants
4. **Dynamic Updates**: Regenerate when skill metadata changes

---

## Interactive Components

### SkillFilter Component

**File**: `src/components/SkillFilter.astro`

**Purpose**: Filter skills by category with persistent URL state.

**Props**:

```typescript
interface Props {
  activeCategory?: string;     // Current filter (default: 'all')
  counts?: Record<string, number>;  // Skills per category
  lang?: keyof typeof ui;      // Language for labels
}
```

**Rendered Output**:

```html
<div class="skill-filter" data-filter-component>
  <div class="filter-pills">
    <button data-category="all" class="filter-pill active">
      <span class="pill-label">All Skills</span>
      <span class="pill-count">45</span>
    </button>
    <button data-category="development" class="filter-pill">
      <span class="pill-label">Development</span>
      <span class="pill-count">12</span>
    </button>
    <!-- ... more categories ... -->
  </div>
</div>
```

**Client-Side Behavior** (JavaScript):

1. **Initialization**:
   - Apply inline styles to match CSS variables
   - Set active pill from URL query param (`?category=development`)

2. **User Interaction**:
   - Listen for pill clicks
   - Update active state (inline styles)
   - Show/hide skill cards by `data-skill-category` attribute
   - Update URL: `/skills/?category=development` (using history.replaceState)

3. **DOM Selectors**:
   - `.filter-pill` buttons
   - `[data-skill-category]` cards

**CSS Classes & Styling**:

```css
.filter-pill {
  /* Base: outlined pill */
  border: 1px solid #3F5B54;
  color: #3F5B54;
  background: var(--surface-elevated);
}

.filter-pill.active {
  /* Active: filled with brand color */
  background: #2ADB5C !important;
  border-color: #2ADB5C !important;
  color: #ffffff !important;
}

.filter-pill:hover {
  border-color: #2ADB5C !important;
}
```

**Mobile Responsive**:
- Horizontal scroll on mobile (scrollbar hidden)
- Mask-image gradient to indicate more pills available

**Issues & Workarounds**:
- CSS variables not consistently applied in interactive state → Use inline styles
- Border color override needed → Use `!important` flags

### RoleSelector Component

**File**: `src/components/RoleSelector.astro`

**Purpose**: Show skills recommended for selected job role, tab-like UI.

**Props**:

```typescript
interface Props {
  skills: CollectionEntry<'skills'>[];  // All skills to filter
  lang?: keyof typeof ui;               // Language
}
```

**Features**:

1. **12 Roles**: developer, marketer, designer, PM, data-analyst, devops, content, sales, finance, hr, legal, executive

2. **Pre-computed**: Skills filtered by role at build time (max 10 per role)

3. **Rendered Output**:

```html
<div class="role-selector" data-role-selector>
  <div class="role-pills">
    <button data-role="developer" class="role-pill active">Developer</button>
    <!-- ... more roles ... -->
  </div>
  <div class="role-content">
    <div data-role-content="developer" class="role-skills active">
      <h4>Recommended Skills for Developer</h4>
      <div class="role-skills-list">
        <a href="/skills/skill-name/" class="role-skill-item">
          <span class="skill-rank">#1</span>
          <span class="skill-info">
            <span class="skill-name">Skill Name</span>
            <span class="skill-desc">Skill subtitle</span>
          </span>
        </a>
        <!-- ... more skills ... -->
      </div>
      <a href="/skills/?role=developer" class="view-all-link">View all recommendations</a>
    </div>
    <!-- ... more role contents ... -->
  </div>
</div>
```

**Client-Side Behavior**:

1. **Initialization**:
   - Apply inline styles to active role pill
   - First role (developer) shown by default

2. **User Interaction**:
   - Click role pill
   - Update active pill styling
   - Hide previous role content, show new role content
   - Fade in animation on content switch

3. **Mobile Responsive**:
   - Role pills scroll horizontally (hidden scrollbar)
   - Mask-image gradient to indicate scrollable
   - Content area stacks on smaller screens

**Animation**:

```css
.role-skills {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**Layout**:

- **Landscape**: Skills in 2-column grid
- **Mobile**: Single column layout

### Other Card Components

#### SkillCard

Simple card display, no client-side interactivity.

- Links to skill detail page
- Shows badges (official, popular, featured)
- Truncates description to 3 lines
- Hover: lift effect, green border, shadow

#### AgentCard, VideoCard, MeetupCard, ShowcaseCard

Similar pattern: static display, hover effects, navigation links.

---

## Styling System

### Design Token System

All styling uses CSS variables defined in `src/styles/custom.css`. No hardcoded colors/dimensions in components.

**Variable Categories**:

1. **Brand Colors**:
   ```css
   --qoder-brand-green: #2ADB5C;
   --qoder-brand-green-dark: #1a9f4a;
   ```

2. **Text Hierarchy**:
   ```css
   --text-primary: #1a1a1c;        /* Main text */
   --text-secondary: #525252;      /* Secondary text */
   --text-tertiary: #8a8a8a;       /* Tertiary/muted */
   --text-on-brand: #ffffff;       /* Text on green background */
   ```

3. **Surfaces**:
   ```css
   --surface-elevated: #ffffff;    /* Elevated surfaces */
   --surface-sunken: #f5f5f5;      /* Depressed surfaces */
   --background-primary: #ffffff;
   --background-tertiary: #efefef;
   ```

4. **Borders**:
   ```css
   --structural-teal: #3F5B54;     /* Primary border */
   --border-subtle: #e0e0e0;       /* Subtle border */
   ```

5. **Spacing Scale** (8px base):
   ```css
   --space-1: 0.5rem;   /* 8px */
   --space-2: 1rem;     /* 16px */
   --space-3: 1.5rem;   /* 24px */
   --space-4: 2rem;     /* 32px */
   /* ... up to --space-16: 8rem (128px) */
   ```

6. **Typography**:
   ```css
   --font-display: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
   --font-body: -apple-system, BlinkMacSystemFont, sans-serif;
   --font-mono: "Monaco", "Courier New", monospace;
   ```

7. **Border Radius**:
   ```css
   --radius-xs: 4px;
   --radius-sm: 6px;
   --radius-md: 8px;
   --radius-lg: 12px;
   --radius-xl: 16px;
   --radius-full: 9999px;
   ```

8. **Shadows**:
   ```css
   --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
   --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
   --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
   ```

9. **Animation**:
   ```css
   --duration-fast: 0.15s;
   --duration-normal: 0.3s;
   --ease-out: cubic-bezier(0.4, 0, 0.2, 1);
   --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
   ```

### Dark Mode Support

Starlight provides dark mode CSS variables automatically. Components use these generic variables which Starlight overrides:

```css
/* Component styles */
background: var(--sl-color-bg-nav);       /* Starlight bg */
color: var(--sl-color-gray-1);            /* Starlight text */
```

Custom variables fall back appropriately in dark mode via CSS variable inheritance.

### Component Styling Pattern

**Structure**:

```astro
---
// Props interface
interface Props { ... }
---

<!-- HTML Template with semantic classes -->
<div class="component-name">
  <!-- Specific elements with BEM-like naming -->
  <div class="component-name__header"></div>
  <div class="component-name__body"></div>
</div>

<style>
  /* Use CSS variables, no hardcoded values */
  .component-name {
    background: var(--surface-elevated);
    padding: var(--space-4);
    border-radius: var(--radius-lg);
  }

  /* Semantic class names */
  .component-name__header { ... }

  /* Responsive design */
  @media (max-width: 768px) { ... }
</style>
```

### Responsive Breakpoints

- **Desktop**: 1200px and up
- **Tablet**: 1024px to 1199px
- **Mobile**: 768px to 1023px
- **Small Mobile**: Below 768px

### Hover & Interactive States

All interactive elements follow pattern:

```css
.element {
  transition: all var(--duration-fast) var(--ease-out);
}

.element:hover {
  border-color: var(--qoder-brand-green);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.element:active {
  transform: translateY(0);
}
```

### Accessibility Considerations

1. **Focus states**: Visible focus outlines (Starlight default)
2. **Color contrast**: WCAG AA compliant
3. **Typography**: Readable font sizes (minimum 16px on mobile)
4. **Interactive elements**: Sufficient touch target size (44px minimum)

### CSS Architecture Best Practices

1. **No inline styles** (except state management in JS)
2. **Semantic class names** (describe content, not appearance)
3. **Component-scoped styles** (Astro `<style>` blocks)
4. **CSS variable usage** (maintainable, dark mode support)
5. **Mobile-first** media queries when possible
6. **Minimal specificity** (class-based, avoid !important)

---

## Common Patterns

### Building a New Content Type

1. Define collection schema in `src/content.config.ts`
2. Create content directory: `src/content/new-type/`
3. Add sample files with required frontmatter
4. Build card component in `src/components/NewTypeCard.astro`
5. Create listing page in `src/pages/new-type.astro`
6. Add i18n strings for labels
7. Test with `npm run build`

### Adding Translations

1. Add UI strings to `src/i18n/ui.ts` (both languages)
2. For skill-level translations, update `src/i18n/skills-translations.ts`
3. Use `useTranslations(lang)` in components
4. Test both English and Chinese rendering

### Working with Images

1. Place in `public/images/` subdirectory
2. Reference via `/images/...` (CDN-friendly path)
3. For share images: use standard sizes and formats
4. Consider responsive images for different screen sizes

