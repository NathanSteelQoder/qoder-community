# Architecture Guide

This document describes the high-level architecture and design decisions for Qoder Community.

## Table of Contents

- [System Overview](#system-overview)
- [Technology Stack](#technology-stack)
- [Data Architecture](#data-architecture)
- [Content Schema](#content-schema)
- [Routing Architecture](#routing-architecture)
- [Component Architecture](#component-architecture)
- [Internationalization Architecture](#internationalization-architecture)
- [Build Architecture](#build-architecture)
- [Performance Architecture](#performance-architecture)

## System Overview

Qoder Community is a **static site generator** built with Astro that serves as a platform for sharing AI coding skills and agent configurations.

### Core Principles

1. **Static First**: All content pre-rendered to HTML at build time
2. **No Server**: Pure HTML, CSS, JavaScript - no backend infrastructure
3. **Content-Driven**: Content stored as Markdown, structured with schemas
4. **Bilingual**: Full English/Chinese support
5. **User-Centric**: Focus on discovery, filtering, and recommendations

### Information Flow

```
Markdown Content (skills, agents, etc.)
         ↓
Schema Validation (TypeScript)
         ↓
Astro Processing
         ↓
Component Rendering
         ↓
i18n Translation
         ↓
Static HTML Output
         ↓
Cloudflare CDN
         ↓
Browser
```

## Technology Stack

### Core Framework

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Astro** | 5.6+ | Static site generator |
| **Starlight** | 0.37+ | Documentation theme |
| **TypeScript** | Latest | Type safety |
| **Node.js** | 18+ | Runtime |
| **npm** | 9+ | Package management |

### Key Dependencies

```json
{
  "@astrojs/starlight": "~0.37.0",
  "astro": "~5.6.0"
}
```

### Build & Deploy

- **Build**: Astro compiler (TypeScript, JSX to HTML/CSS/JS)
- **Deploy**: Cloudflare Pages
- **CDN**: Cloudflare edge network (100+ locations worldwide)
- **Hosting**: Cloudflare (included with Pages)

## Data Architecture

### Content Storage

All content stored in Markdown files with YAML frontmatter:

```
src/content/
├── skills/               # English skill documents
│   ├── postgres.md
│   ├── redis.md
│   └── ...
├── skills-zh/            # Chinese skill documents
│   ├── postgres.md       # Chinese version of postgres skill
│   ├── redis.md
│   └── ...
├── agents/               # Agent configurations
├── videos/               # Video references
├── meetups/              # Event information
├── showcase/             # Project showcase
└── docs/                 # Site documentation
```

### Content Validation

All content validated at build-time using Zod schemas (`src/content.config.ts`):

```typescript
const skillsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Required fields
    title: z.string(),
    description: z.string(),
    githubUrl: z.string().url(),
    date: z.coerce.date(),
    
    // Optional fields
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
    
    // Enums (strict validation)
    category: z.enum(['document', 'development', ...]),
    source: z.enum(['anthropic', 'vercel', 'community', 'enterprise']),
  }),
});
```

**Benefits**:
- Type-safe content access in components
- Build fails on invalid frontmatter
- IDE autocomplete for content fields
- Runtime schema validation

## Content Schema

### Collections Overview

| Collection | Directory | Purpose |
|-----------|-----------|---------|
| **Skills** | `skills/`, `skills-zh/` | AI coding skills (55+ total) |
| **SkillSources** | `skillSources/` | External skill source links |
| **Agents** | `agents/` | Agent configuration templates |
| **Videos** | `videos/` | Tutorial videos and reviews |
| **Meetups** | `meetups/` | Community events |
| **Showcase** | `showcase/` | Project portfolio items |
| **Docs** | `docs/` | Site documentation (Starlight) |

### Skills Schema in Detail

```typescript
{
  // Identification
  name: string;           // 'postgres' - used in URLs
  title: string;          // 'PostgreSQL Setup'
  description: string;    // 1-2 sentence summary

  // Source information
  source: enum;           // Where skill originates
  author?: string;        // Skill author name

  // Links
  githubUrl: string;      // Required - to repo/docs
  docsUrl?: string;       // Documentation link
  marketplaceUrl?: string;// Marketplace listing

  // Classification
  category: enum;         // 9 categories
  tags?: string[];        // 0-N tags
  roles?: string[];       // 12 applicable job roles

  // Visibility
  featured: boolean;      // Homepage featured section
  popular: boolean;       // Popular badge
  isOfficial: boolean;    // Official from source

  // Installation
  installCommand?: string;// How to install/use

  // Metadata
  date: Date;            // Published date
  lastUpdated?: Date;    // Last update date
}
```

### Categories (9)

```
1. document       - Document processing
2. development   - Software development
3. design        - Creative & design work
4. automation    - Process automation
5. marketing     - Marketing & growth
6. data          - Data analysis
7. security      - Security & compliance
8. productivity  - Productivity tools
9. meta          - Skill creation & meta
```

### Roles (12)

```
developer, marketer, designer, pm, data-analyst, devops,
content, finance, hr, legal, sales, executive
```

## Routing Architecture

### Route Structure

Astro generates routes from file locations:

```
src/pages/
├── index.astro              → /
├── skills.astro             → /skills/
├── skills/[slug].astro      → /skills/{skill-name}/
├── agents.astro             → /agents/
├── learn.astro              → /learn/ (coming soon)
├── meetups.astro            → /meetups/ (coming soon)
├── showcase.astro           → /showcase/ (coming soon)
└── zh/
    ├── index.astro          → /zh/
    ├── skills.astro         → /zh/skills/
    ├── skills/[slug].astro  → /zh/skills/{skill-name}/
    └── ...
```

### Dynamic Routes

**Skills detail page** (`skills/[slug].astro`):

```astro
export async function getStaticPaths() {
  const skills = await getCollection('skills');
  return skills.map(skill => ({
    params: { slug: skill.slug },
    props: { skill },
  }));
}
```

Generates 55 static pages (one per skill).

### Language Routing

- **English**: `/skills/`, `/skills/postgres/`
- **Chinese**: `/zh/skills/`, `/zh/skills/postgres/`

Language detected from URL pathname:

```typescript
export function getLangFromPath(pathname: string) {
  if (pathname.startsWith('/zh/') || pathname === '/zh') {
    return 'zh-CN';
  }
  return 'en';
}
```

## Component Architecture

### Component Hierarchy

```
Layout (Starlight)
├── Header (custom)
│   └── LanguageSwitcher
├── Page Content
│   ├── SkillCard (repeated)
│   ├── SkillFilter
│   ├── RoleSelector
│   └── ShowcaseCard (repeated)
├── Footer (custom)
└── ThemeSelect
```

### Major Components

#### SkillCard
**Purpose**: Display individual skill in grid
**Props**: `entry`, `lang`
**Features**:
- Shows name, description, category
- Badge system (official/popular/featured)
- Source indication (Anthropic/Vercel/Community/Enterprise)
- Hover effects and animations

#### SkillFilter
**Purpose**: Category filtering pills
**Props**: `activeCategory`, `counts`, `lang`
**Features**:
- 9 category buttons + "All"
- Shows count per category
- URL state persistence
- Client-side filtering

#### RoleSelector
**Purpose**: Job role-based skill recommendations
**Props**: `skills`, `lang`
**Features**:
- 12 role pills
- Pre-computed top 10 skills per role
- Fade-in animations
- Links to filtered view

#### Header/Footer
**Purpose**: Navigation and branding
**Features**:
- Language switcher
- Theme selector
- Social links
- Logo/branding

### Component State Management

**Approach**: Client-side DOM state only (no framework needed)

```astro
<script>
  function initComponent() {
    const buttons = document.querySelectorAll('[data-filter]');
    buttons.forEach(btn => {
      btn.addEventListener('click', handleClick);
    });
  }
  
  initComponent();
  document.addEventListener('astro:after-swap', initComponent);
</script>
```

**No global state** - each component manages its own state via DOM attributes.

## Internationalization Architecture

### i18n Structure

```
src/i18n/
├── index.ts                    # Module exports
├── ui.ts                       # UI string translations
├── utils.ts                    # Helper functions
├── skills-translations.ts      # Skill-specific translations
└── skillSources-translations.ts # SkillSource translations
```

### Translation Flow

```
Component renders
        ↓
Get language from route (en or zh-CN)
        ↓
Call useTranslations(lang)
        ↓
Get translation function t()
        ↓
Call t('key.name')
        ↓
Look up in ui.ts[lang]
        ↓
Return translated string
```

### UI Translation File

```typescript
export const ui = {
  'en': {
    'filter.all': 'All',
    'category.development': 'Development',
    'source.community': 'Community',
    ...
  },
  'zh-CN': {
    'filter.all': '全部',
    'category.development': '开发',
    'source.community': '社区',
    ...
  }
};
```

### Skill-Specific Translations

For each skill, optional translations:

```typescript
skillsTranslations['postgres'] = {
  en: {
    name: 'PostgreSQL Setup',
    title: 'Configure PostgreSQL Database',
    description: 'Setup guide...',
  },
  'zh-CN': {
    name: 'PostgreSQL 设置',
    title: '配置 PostgreSQL 数据库',
    description: '设置指南...',
  }
};
```

### Language Detection

```
URL: /zh/skills/ → lang = 'zh-CN'
URL: /skills/    → lang = 'en'
```

## Build Architecture

### Build Pipeline

```
1. Validation Phase
   ├── Check all content schemas
   ├── Validate TypeScript
   └── Ensure all files exist

2. Processing Phase
   ├── Parse Markdown frontmatter
   ├── Build collection indexes
   ├── Generate routes
   └── Prepare i18n mappings

3. Rendering Phase
   ├── Execute .astro templates
   ├── Inject component data
   ├── Process scoped CSS
   └── Generate HTML

4. Optimization Phase
   ├── Minify CSS/JS
   ├── Tree-shake unused code
   ├── Optimize images
   └── Generate source maps

5. Output Phase
   ├── Write dist/
   ├── Generate sitemap
   ├── Index with Pagefind
   └── Generate asset manifest
```

### Build Performance

**Typical metrics**:
- 55 skills × 2 languages = 110 skill pages
- Plus listing pages, showcase, agents = 125 total pages
- Build time: 4-6 seconds (M1 Mac)
- Output size: ~2 MB HTML

### Incremental Builds

During development (`npm run dev`):
- Only changed files rebuild
- HMR updates browser in < 100ms
- Full rebuild on save takes ~1s

## Performance Architecture

### Static Generation Benefits

| Aspect | Benefit |
|--------|---------|
| **Time to First Byte (TTFB)** | < 50ms (from CDN) |
| **Page Load** | < 1s (no server wait) |
| **Search Indexing** | Instant (pre-rendered HTML) |
| **Scaling** | Zero - static files only |
| **Cost** | Minimal (CDN bandwidth) |

### Caching Strategy

```
Browser Cache
        ↓
Cloudflare Edge Cache (300 locations)
        ↓
Cloudflare Origin (your site)
```

**Cache Headers**:
```
HTML:        Cache-Control: public, max-age=1800
CSS/JS:      Cache-Control: public, max-age=31536000
Images:      Cache-Control: public, max-age=31536000
```

### Image Optimization

Astro's built-in image optimization:

```astro
import { Image } from 'astro:assets';

<Image
  src={imageImport}
  alt="Description"
  width={400}
  height={300}
/>
```

Generates:
- Multiple formats (WebP, JPEG)
- Multiple sizes (responsive)
- Lazy loading
- LQIP (Low Quality Image Placeholder)

### Search Architecture

**Pagefind**: Client-side full-text search

```
Build Phase:
HTML Files → Pagefind → Index Generation → dist/pagefind/

Runtime:
pagefind.js → Load Index → Search Query → Results
```

**Features**:
- Zero server search queries
- Works offline
- Instant results
- English + Chinese support

### Code Splitting

Astro automatically:
- Generates one JS bundle per page
- Only loads JS for that page
- Shared code goes to `shared-*` bundle

Result: ~50KB JS per page (gzipped)

---

For more information, see:
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development workflow
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment procedures
- [Astro Architecture](https://docs.astro.build/en/concepts/why-astro/)
- [Starlight Guide](https://starlight.astro.build/)
