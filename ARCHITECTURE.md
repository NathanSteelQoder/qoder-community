# Architecture Guide - Qoder Community

This document explains the internal architecture of the Qoder Community site, covering page structure, bilingual routing, content collections, and component patterns.

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Bilingual Routing System](#bilingual-routing-system)
3. [Skill Detail Pages](#skill-detail-pages)
4. [Content Collections & Validation](#content-collections--validation)
5. [Component Patterns](#component-patterns)
6. [Share Image Generation](#share-image-generation)
7. [Styling System](#styling-system)

---

## High-Level Architecture

The Qoder Community site is built on **Astro 5** with **Starlight** documentation theme. The architecture consists of three main layers:

```
┌─────────────────────────────────────────────────────────┐
│                    Pages (Dynamic Routes)                │
│  skills.astro | skills/[slug].astro | agents.astro etc. │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│  Components (Reusable UI Elements + Client Scripts)      │
│  SkillCard | SkillFilter | RoleSelector | ShareModal    │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│  Content Collections & Utilities                         │
│  Skills | Agents | Videos | i18n | Theme                │
└─────────────────────────────────────────────────────────┘
```

### Key Technologies

- **Astro 5**: Static site generation with optional client-side interactivity
- **Starlight 0.37+**: Astro documentation theme providing sidebar, search, dark mode
- **Zod**: TypeScript-first schema validation for content collections
- **Canvas API**: Used for generating share images (Chinese skills page)
- **i18n**: Custom i18n system using language-prefixed routes and translation dictionaries

---

## Bilingual Routing System

The site supports English (default) and Chinese via language-prefixed routes.

### Routing Pattern

```
English:  /skills, /agents, /learn, /showcase, /meetups
Chinese:  /zh/skills, /zh/agents, /zh/learn, /zh/showcase, /zh/meetups

English detail: /skills/my-skill
Chinese detail: /zh/skills/my-skill (same slug for both)
```

### Language Detection

**Location**: `src/i18n/utils.ts`

The system provides two functions to detect language:

```typescript
getLangFromUrl(url: URL): keyof typeof ui  // Parse URL pathname
getLangFromPath(pathname: string): keyof typeof ui  // Parse URL path string
```

Returns `'zh-CN'` for Chinese, `'en'` for English (default).

### Translation System

**Components**:

1. **UI Strings** (`src/i18n/ui.ts`):
   - All button labels, page titles, category names, role names
   - Structure: `ui[lang][key]` where lang is `'en'` or `'zh-CN'`
   - Usage: `const t = useTranslations(lang); t('nav.skills')` → "Skills" or "Skills"

2. **Skill-Specific Translations** (`src/i18n/skills-translations.ts`):
   - Translated titles, descriptions per skill
   - Structure: `skillsTranslations[slug][lang]`
   - Usage: `getSkillTitle(slug, fallback, lang)`
   - Fallback to English if Chinese translation doesn't exist

3. **Translation Function** (`useTranslations`):
   ```typescript
   export function useTranslations(lang: keyof typeof ui) {
     return function t(key: UIKey): string {
       return ui[lang][key] || ui[defaultLang][key] || key;
     };
   }
   ```

### Content Fallback

When Chinese routes are accessed:

1. If a translated skill (`skills-zh/my-skill.md`) exists → use Chinese content
2. If no Chinese version → render English content with Chinese UI labels
3. This allows partial Chinese translation without requiring 100% content coverage

---

## Skill Detail Pages

The most complex pages are the skill detail pages. There are two implementations:

### English Skill Detail: `src/pages/skills/[slug].astro`

**Purpose**: Display individual skill information with install command, links, and related skills

**Key Features**:
- Static generation via `getStaticPaths()` (generates one page per skill)
- Breadcrumb navigation with category filtering
- Skill badges (Official, Popular, Featured, Source)
- Related skills section (same category, excluding current)
- Install command with copy-to-clipboard
- External links: GitHub, Documentation, Marketplace

**Size**: ~746 lines

**Data Flow**:
```
getStaticPaths() → load all skills
For each skill, render page with:
  - Translated title/description (fallback to English)
  - Rendered markdown content
  - Related skills in same category
  - Localized labels (category, source, role)
```

**Frontmatter Variables Used**:
- `name`, `title`, `description` (skill identity)
- `category`, `source` (classification)
- `roles` (applicable job titles)
- `isOfficial`, `popular`, `featured` (badges)
- `githubUrl`, `docsUrl`, `marketplaceUrl` (links)
- `installCommand` (if applicable)
- `date`, `lastUpdated` (metadata)

### Chinese Skill Detail: `src/pages/zh/skills/[slug].astro`

**Purpose**: Same as English BUT with additional **share image generation** feature

**Key Differences**:
- **+790 lines** (total ~1,537) due to share functionality
- Dynamic content loading with Chinese fallback
- **Share modal** with image preview and download/copy buttons
- **Canvas-based share image** generation tailored for Xiaohongshu (Chinese social platform)
- Inline implementation of share generation (not reusing `src/utils/share-image-generator.ts`)

**Share Image Details**:
- **Dimensions**: 900×1200px (3:4 ratio, optimized for Xiaohongshu)
- **Design**: Qoder brand green gradient background with radial lines
- **Content**: Skill title, category outcome, Qoder logo, QR code, domain
- **Assets**:
  - Skill-specific: `/images/skills/share/${slug}-share.jpg`
  - Fallback: `/images/skills/share/default-${category}.jpg`
  - Brand assets: logo, QR code

**Size**: ~1,537 lines

**Why Duplication?**

The share image generation is inlined (not imported from `src/utils/share-image-generator.ts`) because:
1. **Astro limitation**: Inline `<script>` blocks run client-side with direct DOM access
2. **Design difference**: Chinese version uses a completely different visual design (brand green, gradient, radial lines) vs the utility version (gray background, no gradient)
3. **Scope difference**: English page has no share feature; only Chinese uses this

**Note**: `src/utils/share-image-generator.ts` exists but is not currently used. It was created as a reusable utility but was superseded by the custom Chinese design.

---

## Content Collections & Validation

Content is organized into collections defined in `src/content.config.ts` using Zod schemas.

### Collections Overview

| Collection | Purpose | Location | Schema | Translations |
|-----------|---------|----------|--------|--------------|
| `skills` | AI agent skills | `src/content/skills/` | 15+ fields | `src/i18n/skills-translations.ts` |
| `agents` | Community agents | `src/content/agents/` | Author, useCase, tags | Not yet implemented |
| `videos` | Tutorial videos | `src/content/videos/` | YouTube, duration, category | Not yet implemented |
| `meetups` | Events | `src/content/meetups/` | Location, date, status | Not yet implemented |
| `showcase` | Project examples | `src/content/showcase/` | Tags, image, link | Not yet implemented |
| `skillSources` | External marketplaces | `src/content/skillSources/` | URL, icon, order | `src/i18n/skillSources-translations.ts` |
| `docs` | Documentation | `src/content/docs/` | Starlight schema | Built-in i18n |

### Skills Collection Schema

The most important collection. Zod schema from `src/content.config.ts`:

```typescript
const skillsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Identity
    name: z.string(),           // e.g., "varlock"
    title: z.string(),          // e.g., "Varlock: Multi-Version Exploration"
    description: z.string(),    // 1-2 sentence summary
    
    // Classification
    category: z.enum([
      'document', 'development', 'design', 'automation', 'marketing',
      'data', 'security', 'productivity', 'meta'
    ]),
    tags: z.array(z.string()).optional(),
    
    // Source & Author
    source: z.enum(['anthropic', 'vercel', 'community', 'enterprise']),
    author: z.string().optional(),
    
    // Links
    githubUrl: z.string().url(),
    docsUrl: z.string().url().optional(),
    marketplaceUrl: z.string().url().optional(),
    
    // Roles (for role-based filtering)
    roles: z.array(z.enum([
      'developer', 'marketer', 'designer', 'pm', 'data-analyst',
      'devops', 'content', 'finance', 'hr', 'legal', 'sales', 'executive'
    ])).optional(),
    
    // Display
    featured: z.boolean().default(false),
    popular: z.boolean().default(false),
    isOfficial: z.boolean().default(false),
    
    // Install
    installCommand: z.string().optional(),
    
    // Dates
    date: z.coerce.date(),
    lastUpdated: z.coerce.date().optional(),
  }),
});
```

### Bilingual Content Pattern

Skills exist in two versions:

```
src/content/skills/my-skill.md         (English, required)
src/content/skills-zh/my-skill.md      (Chinese, optional)
```

**Rules**:
- Both files have identical slug (used as filename, no extension)
- Chinese version is optional (English is fallback)
- Metadata (category, author, links) is shared from English version
- Only the **body content** differs between language versions
- **Translations**: Title, description overrides go to `src/i18n/skills-translations.ts`

### Validation Process

When you run `npm run build`:

1. **Astro loads collections** → reads all markdown files
2. **Zod validates** → checks each file against schema
3. **Errors caught** → build fails if frontmatter is invalid
4. **Build output** → `dist/` with final HTML

**Common Validation Errors**:
- Missing required field (name, description, date, category)
- Invalid enum value (category must be one of 9 options)
- Invalid URL format (githubUrl, docsUrl, marketplaceUrl)
- Invalid date format (use ISO 8601: `2025-01-15`)

See [CONTRIBUTING.md](CONTRIBUTING.md) for frontmatter template.

---

## Component Patterns

### Stateless Components (Markdown renderers)

Most components are pure Astro components that render markdown and data:

- `SkillCard.astro` — Displays skill name, category, badges
- `AgentCard.astro` — Agent info with GitHub link
- `VideoCard.astro` — YouTube embed with metadata
- `ShowcaseCard.astro` — Project with image, tags, link

**Pattern**: Props receive data → component renders HTML (no client-side script)

### Client-Side Components (Interactive filtering)

Some components have client interactivity:

**`SkillFilter.astro`**:
- Renders category filter buttons
- Client-side `<script>` updates URL query params (`?category=development`)
- Stores selection in browser (localStorage)
- Used by both `/skills.astro` and `/zh/skills.astro`

**`RoleSelector.astro`**:
- Dropdown for role-based skill recommendations
- Updates URL with role param (`?role=developer`)
- Filters visible skills client-side

**Pattern**: Astro component + inline `<script>` (runs in browser)

### Starlight Integration

The site overrides some Starlight components:

- `Header.astro` — Custom header with logo, nav, language switcher
- `Footer.astro` — Custom footer with links
- `ThemeSelect.astro` — Custom dark/light mode toggle
- `LanguageSwitcher.astro` — English/Chinese toggle

These are configured in `astro.config.mjs`:

```javascript
components: {
  Header: './src/components/Header.astro',
  Footer: './src/components/Footer.astro',
  ThemeSelect: './src/components/ThemeSelect.astro',
}
```

---

## Share Image Generation

### Chinese Skills Page Feature

The Chinese skills detail page (`src/pages/zh/skills/[slug].astro`) includes a "Share" button that generates a beautiful social media image.

**Workflow**:

1. **User clicks "Share" button** → Triggers JavaScript
2. **Modal opens** with loading state
3. **Canvas generation** starts (runs client-side in browser)
4. **Image downloaded** → Data URL returned
5. **Preview shown** in modal with download/copy buttons

**Canvas Implementation Details**:

The inline `generateShareImage()` function (lines 562+):

1. **Load assets** (in parallel):
   - Skill image: `/images/skills/share/{slug}-share.jpg` or category default
   - Qoder logo: `/images/qoder-logo.png`
   
2. **Draw background**: Radial gradient (brand green #2EE065 to #2ADB5C)

3. **Draw texture**: Radial lines pattern overlaid on background

4. **Draw demo image**: Centered, rounded corners, scaled to fit

5. **Draw text**: Skill title, category outcome, Qoder branding

6. **Draw bottom section**: Logo, QR code, domain

7. **Export**: Convert canvas to PNG data URL

**Asset Fallback**:

```typescript
const skillImagePath = `/images/skills/share/${slug}-share.jpg`;
const defaultImagePath = `/images/skills/share/default-${category}.jpg`;

// Try skill-specific first, fall back to category default
if (await imageExists(skillImagePath)) {
  return skillImagePath;
}
return defaultImagePath;
```

**UX Features**:
- Loading spinner while generating
- Copy-to-clipboard text for caption
- Download button to save as PNG
- Success toast feedback (2 second toast)
- Error handling with fallback UI

### Why Inline Implementation?

The share generation is inlined in `zh/skills/[slug].astro` because:

1. **Direct DOM access**: Inline `<script>` can access page elements directly
2. **Design customization**: Chinese design is completely different from utility version
3. **No shared use case**: Only Chinese page uses this feature currently

**Future improvement**: If English page needs share images, the implementations could be consolidated into a shared utility with design variants.

---

## Styling System

### Theme Architecture

The site uses Starlight's CSS variable system plus custom overrides.

**Location**: `src/styles/custom.css` (~3000+ lines)

### CSS Variables (from Starlight)

Starlight provides design tokens as CSS variables. Key ones:

```css
/* Colors */
--sl-color-bg-nav:      Navigation background
--sl-color-accent:      Primary brand color
--sl-color-bg:          Main background
--sl-color-text:        Text color

/* Spacing */
--sl-sidebar-width:     Sidebar dimension
--sl-sidebar-top:       Sidebar offset from top

/* Borders */
--sl-border-radius:     Rounded corners (8px)
```

### Custom Sections

Custom CSS is organized into major sections:

1. **Variables** (top 100 lines): Brand colors, sizes, fonts
2. **Global styles**: Body, headings, links
3. **Components**: Cards, badges, modals
4. **Animations**: Fade in, slide, spin
5. **Starlight overrides**: Sidebar, search, nav
6. **Skill page styles**: Breadcrumb, detail page layout
7. **Share modal**: Modal overlay, image preview
8. **Dark mode**: `:root[data-theme="dark"]`

### Naming Conventions

- `.skill-*` — Skill-related elements
- `.badge-*` — Badge styling (source, category, featured)
- `.animate-*` — Animations
- `.source-*` — Source badges (anthropic, vercel, community)

### Key Classes

**Skills listing**:
- `.skill-card` — Individual skill card
- `.skill-filter` — Filter bar with buttons
- `.filter-button` — Category or role button

**Skill detail**:
- `.skill-detail-page` — Page container
- `.skill-header` — Title, description, badges
- `.related-skills` — Section with 3 related items
- `.skill-section` — Content sections
- `.install-section` — Install command box

**Share modal**:
- `.share-modal` — Modal overlay
- `.share-modal.active` — Visible state
- `.share-preview-image` — Image display
- `.modal-action-btn` — Download/copy buttons

---

## Development Workflow

### Adding a New Skill

1. Create `src/content/skills/my-skill.md` with frontmatter
2. Add skill-specific translations to `src/i18n/skills-translations.ts` (if needed)
3. Create share images (optional for Chinese): `public/images/skills/share/my-skill-share.jpg`
4. Run `npm run build` to validate
5. If Chinese translation needed, create `src/content/skills-zh/my-skill.md`
6. Commit and push

### Modifying a Skill Detail Page

The skill detail pages are generated from templates. To modify:

1. Edit `src/pages/skills/[slug].astro` (English) or
2. Edit `src/pages/zh/skills/[slug].astro` (Chinese)
3. Changes apply to all skills using that page
4. Run `npm run build` to verify

### Adding a New Collection

1. Define schema in `src/content.config.ts`
2. Create `src/content/new-collection/` folder
3. Create Markdown files with frontmatter
4. Define page template in `src/pages/new-collection/[slug].astro`
5. Use i18n system for translations

---

## Troubleshooting

### Share Image Generation Fails

**Symptoms**: "生成失败" (Generation Failed) button state

**Causes**:
- Image assets not found (check `/images/skills/share/` exists)
- Canvas context not available (browser doesn't support Canvas API)
- CORS issue (images must have `crossOrigin="anonymous"`)

**Fixes**:
1. Check image paths in browser console for 404 errors
2. Verify JPG/PNG format and file size < 1MB
3. Test in different browser (Canvas API very well supported)

### Bilingual Fallback Not Working

**Symptom**: Chinese page shows English content but UI is in Chinese

**Expected behavior**: This is correct! Fallback is designed to work this way.

**If entire page is blank**: Check browser console for errors; may be parsing error in translation key.

### Skills Not Appearing

**Symptom**: /skills page shows "No skills found"

**Causes**:
- Skill file in wrong location (should be `src/content/skills/`, not elsewhere)
- Frontmatter validation failed (check build logs)
- File not committed to git (dev server reads from disk)

**Fixes**:
1. Check `npm run build` output for validation errors
2. Verify file location and frontmatter format
3. Restart dev server: `npm run dev`

### Changes Not Reflecting

**Symptom**: Edited a skill file but changes don't show

**Fixes**:
1. Restart dev server: `npm run dev` (content reloads from disk)
2. Check terminal for validation errors
3. Hard refresh browser: Cmd+Shift+R (Ctrl+Shift+R on Windows)

---

## Performance Notes

- **Build time**: ~4 seconds (fast due to static generation)
- **Page load**: <1.2s LCP (Lightning Core Web Vital)
- **JavaScript**: ~2.5KB (minimal, mostly client-side filtering)
- **Image optimization**: Astro automatically optimizes images

---

## Related Documentation

- [AGENTS.md](AGENTS.md) — Project guidelines for AI agents
- [CONTRIBUTING.md](CONTRIBUTING.md) — How to add skills
- [DEVELOPER_SETUP.md](DEVELOPER_SETUP.md) — Local development setup
- [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md) — Detailed schema validation
- [DEPLOYMENT_AND_CI_CD.md](DEPLOYMENT_AND_CI_CD.md) — Build and deployment
