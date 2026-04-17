# Architecture & Routing Guide

This document explains how Qoder Community is structured, how content flows from Markdown to the web, and how bilingual support works.

## System Overview

**Tech Stack**:
- **Framework**: Astro 5.6 (static site generator)
- **Theme**: Starlight 0.37 (documentation UI built on Astro)
- **Language**: TypeScript + Markdown/MDX
- **Styling**: CSS with Starlight variables
- **Deployment**: Cloudflare Pages (auto on main branch)

**Core Principles**:
1. **Content-first**: All content lives in Markdown (type-safe via Zod schemas)
2. **Static generation**: Built once, deployed to CDN (fast, secure)
3. **Multilingual**: English and Chinese routes with same content structure
4. **Component-driven**: Reusable Astro components for consistency

## Content Collections

Content is organized into 7 collections defined in `src/content.config.ts`. Each is a folder of Markdown files + a Zod schema.

### 1. Skills (`src/content/skills/` and `src/content/skills-zh/`)

**Purpose**: Curated AI agent skills that extend functionality

**Schema** (from `src/content.config.ts:77-136`):

```
- name: string (kebab-case, URL slug)
- title: string
- description: string
- source: enum (community | anthropic | vercel | enterprise)
- author: string (optional)
- githubUrl: URL
- docsUrl: URL (optional)
- marketplaceUrl: URL (optional)
- category: enum (development | design | marketing | productivity | automation | data | security | document | meta)
- tags: array of strings (optional)
- roles: array of enums (developer | marketer | designer | pm | data-analyst | devops | content | finance | hr | legal | sales | executive)
- featured: boolean (default false)
- popular: boolean (default false)
- isOfficial: boolean (default false)
- installCommand: string (optional, multiline)
- date: date (coerced)
- lastUpdated: date (optional)
```

**Display**: Custom page at `src/pages/skills.astro` (and `src/pages/zh/skills.astro` for Chinese)

**Bilingual Convention**:
- English: `src/content/skills/skill-name.md`
- Chinese: `src/content/skills-zh/skill-name.md`
- Use same filename in both directories
- Translate frontmatter (`title`, `description`) and body content

**Example**: `pdf-parser.md` → https://qoder-community.pages.dev/skills/pdf-parser

### 2. Agents (`src/content/agents/`)

**Purpose**: Community-shared agent configurations and setups

**Schema** (from `src/content.config.ts:19-37`):

```
- title: string
- description: string
- author: object { name, avatar (URL), url (URL) }
- githubUrl: URL
- tags: array
- category: enum (Frontend | Backend | Full-Stack | Mobile | CLI)
- useCase: string
- date: date
- featured: boolean
```

**Display**: Custom page at `src/pages/agents.astro`

**Example**: `nextjs-rag-agent.md` → https://qoder-community.pages.dev/agents/

### 3. Videos (`src/content/videos/`)

**Purpose**: Curated video tutorials about Qoder and AI agents

**Schema** (from `src/content.config.ts:39-54`):

```
- title: string
- description: string
- youtubeId: string (YouTube video ID)
- channel: string (channel name)
- channelUrl: URL
- duration: string (e.g., "12:34")
- category: enum (Tutorial | Review | Introduction | Case Study)
- tags: array
- date: date
- featured: boolean
```

**Display**: Custom page at `src/pages/learn.astro`

### 4. Meetups (`src/content/meetups/`)

**Purpose**: Global community meetups and events

**Schema** (from `src/content.config.ts:56-74`):

```
- title: string
- description: string
- location: string (city/region)
- date: date
- status: enum (upcoming | past)
- registrationUrl: URL (optional)
- capacity: number (optional)
- attendees: number (optional)
- image: string (path)
- recordingUrl: URL (optional)
- photos: array of strings (optional)
- organizer: string
- topics: array
```

**Display**: Custom page at `src/pages/meetups.astro`

### 5. Showcase (`src/content/showcase/`)

**Purpose**: Community projects and success stories

**Schema** (from `src/content.config.ts:5-17`):

```
- title: string
- description: string
- tags: array (min 1, max 5)
- image: string (path)
- link: URL (optional)
- featured: boolean
- date: date
```

**Display**: Custom page at `src/pages/showcase.astro`

### 6. Skill Sources (`src/content/skillSources/`)

**Purpose**: Links to external skill repositories and marketplaces

**Schema** (from `src/content.config.ts:138-149`):

```
- name: string
- description: string
- url: URL
- skillCount: string (optional, e.g., "500+")
- icon: string (optional, path)
- order: number (for sorting)
```

**Display**: Referenced in `src/pages/skills.astro` header

### 7. Docs (`src/content/docs/`)

**Purpose**: Site documentation pages (Starlight native)

**Schema**: Starlight's built-in schema (title, sidebar, template, etc.)

**Display**: Starlight-rendered pages under `/docs/` route

**Note**: Currently contains outdated "Quest" language. See [Docs Content Review](#docs-content-review) below.

## Routing Architecture

### URL Structure

```
https://qoder-community.pages.dev/
├── /                           # Homepage (Starlight root)
├── /docs/                       # Documentation pages
├── /agents/                     # Agents directory
├── /learn/                      # Videos directory
├── /meetups/                    # Meetups directory
├── /showcase/                   # Showcase directory
├── /skills/                     # Skills directory & filtering
├── /skills/:slug                # Individual skill page
├── /zh/                         # Chinese homepage
├── /zh/docs/                    # Chinese docs
├── /zh/agents/                  # Chinese agents
├── /zh/learn/                   # Chinese videos
├── /zh/meetups/                 # Chinese meetups
├── /zh/showcase/                # Chinese showcase
├── /zh/skills/                  # Chinese skills
└── /zh/skills/:slug             # Individual skill (Chinese)
```

### Route Organization

**Starlight Routes** (automatic from content):
- `/` → `src/content/docs/index.mdx` (English)
- `/docs/**` → `src/content/docs/**/*.md` (English docs)
- `/zh/` → `src/content/docs/zh/index.mdx` (Chinese)
- `/zh/docs/**` → `src/content/docs/zh/**/*.md` (Chinese docs)

**Custom Collection Pages** (via `src/pages/*.astro`):
- `/agents/` ← `src/pages/agents.astro`
- `/learn/` ← `src/pages/learn.astro`
- `/meetups/` ← `src/pages/meetups.astro`
- `/showcase/` ← `src/pages/showcase.astro`
- `/skills/` ← `src/pages/skills.astro`
- `/skills/:slug` ← `src/pages/skills/[slug].astro`

**Bilingual Mirrors** (via `src/pages/zh/*.astro`):
- `/zh/agents/` ← `src/pages/zh/agents.astro`
- `/zh/learn/` ← `src/pages/zh/learn.astro`
- `/zh/meetups/` ← `src/pages/zh/meetups.astro`
- `/zh/showcase/` ← `src/pages/zh/showcase.astro`
- `/zh/skills/` ← `src/pages/zh/skills.astro`
- `/zh/skills/:slug` ← `src/pages/zh/skills/[slug].astro`

### How Astro Routes Work

**Dynamic Routes** (using `[slug]` syntax):

```astro
// src/pages/skills/[slug].astro
export async function getStaticPaths() {
  const skills = await getCollection('skills');
  return skills.map(skill => ({
    params: { slug: skill.data.name },
    props: { skill }
  }));
}
```

For each skill in `src/content/skills/`, Astro generates a static `.html` file during build:
- `pdf-parser.md` → `dist/skills/pdf-parser/index.html`
- `document-ai.md` → `dist/skills/document-ai/index.html`

**Static Pages** (direct routing):

```astro
// src/pages/agents.astro
const agents = await getCollection('agents');
// Renders to dist/agents/index.html
```

## Internationalization (i18n)

### Language Configuration

**In `astro.config.mjs`**:

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

- `root`: English at `/` (not `/en/`)
- `zh`: Chinese at `/zh/`
- Default: English

### i18n Modules

Located in `src/i18n/`, exports translation utilities:

**`ui.ts`**: UI strings for buttons, labels, etc.

```typescript
export const ui = {
  en: {
    'nav.agents': 'Agents',
    'nav.learn': 'Learn',
    // ...
  },
  zh: {
    'nav.agents': '代理',
    'nav.learn': '学习',
    // ...
  },
};
```

**`utils.ts`**: Translation helper functions

```typescript
export function getLangFromUrl(url: URL): 'en' | 'zh' {
  // Returns 'zh' if URL starts with /zh/, else 'en'
}

export function useTranslations(lang: 'en' | 'zh') {
  return (key: string) => ui[lang][key] || key;
}

export function getCategoryLabel(category: string, lang: 'en' | 'zh'): string {
  // Translates category enums: 'development' → 'Development' (en) or '开发' (zh)
}
```

**`skills-translations.ts`**: Skill-specific translations (title, description for Chinese skills)

```typescript
export const skillsTranslations: Record<string, SkillTranslation> = {
  'pdf-parser': {
    zh: {
      title: 'PDF 解析器',
      description: '从 PDF 中提取文本...',
    },
  },
};
```

**`skillSources-translations.ts`**: Skill source translations

### Bilingual Content Strategy

**Markdown content is authored in both languages**:

```
src/content/skills/pdf-parser.md         (English)
src/content/skills-zh/pdf-parser.md      (Chinese)
```

Both files have identical frontmatter structure (same `name`, `date`, etc.), but translated `title` and `description`.

**In Astro pages**, language is detected and the correct collection is fetched:

```astro
---
import { useTranslations, getLangFromUrl } from '@/i18n';
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

// Fetch appropriate collection
const skills = lang === 'zh' 
  ? await getCollection('skills-zh')
  : await getCollection('skills');
---
```

### Language Detection Flow

```
User visits: https://qoder-community.pages.dev/zh/skills/

1. Astro matches route: /zh/skills/ → src/pages/zh/skills.astro
2. Inside component:
   - getLangFromUrl(Astro.url) → 'zh'
   - useTranslations('zh') → fetches 'zh' strings from ui.ts
   - getCollection('skills-zh') → loads Chinese skill files
3. Renders Chinese UI + Chinese skill content
```

## Component Architecture

### Core Components

**`src/components/SkillCard.astro`**

Displays a skill in grid/list format. Props:

```typescript
interface Props {
  skill: CollectionEntry<'skills'>;
  lang: 'en' | 'zh';
}
```

Renders:
- Skill title and description
- Category badge
- Link to skill detail page

**`src/components/SkillFilter.astro`**

Filters skills by category. Features:

- Shows category counts
- Handles URL parameter `?category=development`
- Client-side state management via query params

**`src/components/RoleSelector.astro`**

Role-based filtering. Features:

- Shows available roles from skills dataset
- Filters: `?role=developer&role=marketer`
- Multi-select support

**`src/components/AgentCard.astro`**, **`VideoCard.astro`**, **`MeetupCard.astro`**

Similar card components for other collections.

### Client-Side Script Pattern

For interactive components (filtering, sorting), Astro uses islands:

```astro
// Example: Filtering script in skill page
<script client:load>
  // This runs in browser only
  const categoryParam = new URLSearchParams(window.location.search).get('category');
  if (categoryParam) {
    document.querySelector(`[data-category="${categoryParam}"]`)?.click();
  }
</script>
```

Scripts are:
- **Only downloaded if component is interactive** (Astro automatically optimizes)
- **Isolated per component** (no global state pollution)
- **Work with URL parameters** for deep linking and bookmarkability

## Build Pipeline

### Build Process

```bash
npm run build
```

**Stages**:

1. **Collect**: Astro reads all Markdown files from `src/content/`
2. **Validate**: Zod schemas validate frontmatter for each collection
3. **Generate**: Astro generates routes and pages
   - Static routes → `dist/index.html`, `dist/agents/index.html`, etc.
   - Dynamic routes → `dist/skills/pdf-parser/index.html`, `dist/skills/document-ai/index.html`, etc.
   - i18n mirrors → `dist/zh/index.html`, `dist/zh/skills/pdf-parser/index.html`, etc.
4. **Bundle**: CSS and JS are minified and bundled
5. **Search**: Pagefind generates full-text search index
6. **Output**: All static files ready in `dist/` for deployment

### Build Output

```
dist/
├── index.html              # Homepage (Starlight)
├── docs/                   # Documentation pages
├── agents/                 # Agents page
├── learn/                  # Videos page
├── meetups/                # Meetups page
├── showcase/               # Showcase page
├── skills/                 # Skills directory
│   └── pdf-parser/         # Dynamic skill page
│       └── index.html
├── zh/                     # Chinese routes (mirrored)
│   ├── index.html
│   ├── skills/
│   │   └── pdf-parser/
│   │       └── index.html
│   └── ...
├── _pagefind/              # Search index
└── ...
```

### Build Time

- **Typical**: 4-6 seconds
- **Factors**: Number of skills (50+), component compilation, search index generation
- **Deployment**: Cloudflare Pages auto-deploys after successful build

## Performance & Optimization

### Static Site Benefits

1. **Speed**: No server computation, files served from CDN (~50-200ms globally)
2. **Security**: No backend attack surface, no database
3. **Scalability**: CDN handles spikes automatically
4. **Cost**: Cloudflare Pages free tier covers community use

### Caching Strategy

- **Static assets** (JS, CSS, images): 30 days
- **HTML pages**: 2 hours (Starlight default)
- **Search index**: 2 hours

Auto-invalidated on new deployment.

### Search

Uses Pagefind (lightweight, client-side search):
- Indexes all skill titles, descriptions, and content
- Works offline (index bundled with site)
- No analytics/tracking

## Docs Content Review

**Status**: Outdated (contains "Quest 1.0" references)

**Issue**: 
- `src/content/docs/intro.md` and `getting-started.md` describe an old product version
- Site rebranding to "Qoder Community" not reflected
- Misleads new contributors

**TODO**: 
- [ ] Update `src/content/docs/intro.md` to describe Qoder Community (not Quest 1.0)
- [ ] Update `src/content/docs/getting-started.md` with community contribution focus
- [ ] Create `src/content/docs/architecture.md` for developer onboarding (link to this doc)
- [ ] Create `src/content/docs/zh/intro.md` (Chinese mirror)

## Adding a New Section

**To add a new collection (e.g., "Tutorials")**:

1. Create folder: `src/content/tutorials/`
2. Add schema in `src/content.config.ts`
3. Create page: `src/pages/tutorials.astro`
4. Create Chinese page: `src/pages/zh/tutorials.astro`
5. Add sidebar link in `astro.config.mjs` (if using Starlight)
6. Commit and push to main (auto-deploys)

## Common Workflows

### Adding a Skill

1. `src/content/skills/my-skill.md` (English)
2. `src/content/skills-zh/my-skill.md` (Chinese, same filename)
3. Follow [SKILL_SCHEMA.md](SKILL_SCHEMA.md) for frontmatter
4. Commit and push
5. Deployed within 1-2 minutes

### Updating i18n Strings

1. Edit `src/i18n/ui.ts` (add new keys or update translations)
2. Rebuild: `npm run build`
3. Verify in browser
4. Commit and push

### Fixing a Broken Build

```bash
# Check what's wrong locally
npm run build

# Fix the error (e.g., frontmatter syntax)
# Verify fix
npm run build

# Commit and push to main
git push origin main
```

---

For questions on specific components or workflows, see [DEVELOPMENT.md](DEVELOPMENT.md).
