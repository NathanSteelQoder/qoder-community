# Architecture Documentation

Comprehensive technical architecture guide for the Qoder Community platform.

## Table of Contents

- [System Architecture](#system-architecture)
- [Content Model](#content-model)
- [Build Pipeline](#build-pipeline)
- [Routing & Pages](#routing--pages)
- [Internationalization](#internationalization)
- [Component System](#component-system)
- [Data Flow](#data-flow)
- [Performance Architecture](#performance-architecture)

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Qoder Community                           │
│              Static Site Generation (Astro)                 │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
    ┌───▼───┐           ┌─────▼──────┐        ┌────▼────┐
    │Content│           │Components  │        │  Pages  │
    │(Markdown)         │(.astro)    │        │(.astro) │
    └───┬───┘           └─────┬──────┘        └────┬────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────▼────────┐
                    │   Astro Build    │
                    │   Engine         │
                    └─────────┬────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
    ┌───▼───┐           ┌─────▼──────┐        ┌────▼────┐
    │Static │           │  Search    │        │ Assets  │
    │ HTML  │           │ (Pagefind) │        │(Images) │
    └───┬───┘           └─────┬──────┘        └────┬────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────▼────────┐
                    │   dist/          │
                    │ (Build Output)   │
                    └─────────┬────────┘
                              │
                    ┌─────────▼────────┐
                    │ Cloudflare Pages │
                    │ (CDN & Hosting)  │
                    └──────────────────┘
```

### Design Principles

1. **Static First** - All content pre-rendered at build time
2. **Performance** - Minimal JavaScript (~2.5 KB)
3. **Simplicity** - No databases, APIs, or backends
4. **Scalability** - Global CDN distribution
5. **Maintainability** - Git-based content management

### Technology Stack Decision

**Why Astro?**
- Excellent for content-heavy sites
- Minimal client-side JavaScript
- Built-in i18n support
- Fast build times (~4-5 seconds)
- Starlight theme provides professional docs look

**Why Starlight?**
- Purpose-built documentation theme
- Bilingual support (English/Chinese)
- Dark mode included
- Mobile responsive
- Built-in search

**Why Cloudflare Pages?**
- Global CDN at edge
- Fast deployments
- Free tier suitable for open source
- Git integration (auto-deploy on main branch push)
- No cold starts (pre-rendered static)

## Content Model

### Content Hierarchy

```
Qoder Community
├── Skills (Primary Content)
│   ├── English Skills (src/content/skills/)
│   └── Chinese Skills (src/content/skills-zh/)
├── Learning Resources
│   ├── Agents (src/content/agents/)
│   ├── Videos (src/content/videos/)
│   └── Skill Sources (src/content/skillSources/)
├── Community
│   ├── Meetups (src/content/meetups/)
│   └── Showcase (src/content/showcase/)
└── Documentation
    └── Site Docs (src/content/docs/)
```

### Collections Schema

#### Skills Collection

**Path**: `src/content/skills/*.md` and `src/content/skills-zh/*.md`

**Purpose**: Curated AI coding skills with examples

**Fields**:
```typescript
{
  name: string              // ID: unique, kebab-case
  title: string             // Display name
  description: string       // 1-2 sentence summary
  source: 'anthropic'|'vercel'|'community'|'enterprise'
  author?: string           // Original author
  githubUrl: string         // Source repository
  docsUrl?: string          // Documentation link
  marketplaceUrl?: string   // Installation link
  category: enum            // See categories
  tags?: string[]           // Searchable tags
  roles?: enum[]            // Target user roles
  featured: boolean         // Featured flag
  popular: boolean          // Popular flag
  isOfficial: boolean       // Official Qoder skill
  installCommand?: string   // Installation instructions
  date: Date                // Published date
  lastUpdated?: Date        // Last modified date
}
```

**Categories**:
- `development` - Code and engineering
- `design` - UI/UX and design
- `marketing` - Growth and marketing
- `automation` - Workflows and automation
- `data` - Data processing
- `security` - Security and compliance
- `document` - Document processing
- `productivity` - Tools and productivity
- `meta` - About skills

#### Agents Collection

**Path**: `src/content/agents/*.md`

**Purpose**: Community-created AI agent configurations

**Key Fields**:
- `title`, `description`
- `author` (object with name, avatar, url)
- `githubUrl`, `tags`
- `category` (Frontend|Backend|Full-Stack|Mobile|CLI)
- `date`, `featured`

#### Videos Collection

**Path**: `src/content/videos/*.md`

**Purpose**: Tutorial and educational video references

**Key Fields**:
- `title`, `description`
- `youtubeId` (YouTube video ID)
- `channel`, `channelUrl`
- `duration` (HH:MM:SS format)
- `category` (Tutorial|Review|Introduction|Case Study)

#### Meetups Collection

**Path**: `src/content/meetups/*.md`

**Purpose**: Event information and scheduling

**Key Fields**:
- `title`, `description`
- `location`, `date`, `status` (upcoming|past)
- `registrationUrl`, `image`
- `organizer`, `topics`
- `capacity`, `attendees`

#### Showcase Collection

**Path**: `src/content/showcase/*.md`

**Purpose**: Community projects and case studies

**Key Fields**:
- `title`, `description`
- `tags`, `image`
- `link` (project URL)
- `date`, `featured`

### Schema Definition Location

All schemas defined in `src/content.config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const skillsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // ... field definitions ...
  }),
});

export const collections = {
  skills: skillsCollection,
  // ... other collections ...
};
```

## Build Pipeline

### Build Process Flow

```
1. npm run build
   │
   ├─→ Content Loading
   │   • Read all .md files from src/content/
   │   • Group by collection (skills, agents, etc.)
   │   • Parse frontmatter (YAML)
   │
   ├─→ Schema Validation
   │   • Validate against src/content.config.ts schemas
   │   • Type-check with Zod
   │   • Report errors and exit if invalid
   │
   ├─→ Component Rendering
   │   • Load .astro components from src/components/
   │   • Load page templates from src/pages/
   │   • Process TypeScript and JSX
   │
   ├─→ Page Generation
   │   • Render each collection item to HTML
   │   • Generate dynamic routes (e.g., /skills/[name])
   │   • Create listing pages
   │   • Generate sitemap.xml
   │
   ├─→ Asset Optimization
   │   • Copy public/ files to dist/
   │   • Minify CSS
   │   • Minify JavaScript
   │   • Optimize images (optional with sharp)
   │
   ├─→ Search Indexing
   │   • Run Pagefind indexer
   │   • Create search index in dist/_pagefind/
   │   • Generate search data structures
   │
   └─→ Output
       • Write dist/ directory
       • Ready for deployment
```

### Build Performance Targets

| Metric | Target | Typical |
|--------|--------|---------|
| Build time | < 60s | 30-40s |
| Output size | < 30MB | 15-20MB |
| Pages generated | 100+ | 120+ |
| Assets | < 50MB | 5-15MB |
| Rebuild time | < 5s | 2-4s |

### Incremental Builds

Astro caches build artifacts:

```bash
# Full rebuild
rm -rf dist .astro
npm run build

# Incremental rebuild (faster)
npm run build
# Only changed files are re-processed
```

## Routing & Pages

### Page Routing System

Astro uses file-based routing:

```
src/pages/
├── index.astro           → /
├── skills.astro          → /skills
├── agents.astro          → /agents
├── learn.astro           → /learn
├── meetups.astro         → /meetups
├── showcase.astro        → /showcase
├── skills/
│   └── [name].astro      → /skills/[skill-name]
└── zh/                   # Chinese routes (separate)
    ├── index.astro       → /zh/
    ├── skills.astro      → /zh/skills
    └── ...
```

### Dynamic Routes

The `skills/[name].astro` page handles dynamic skill routes:

```astro
---
export async function getStaticPaths() {
  const skills = await getCollection('skills');
  
  return skills.map((skill) => ({
    params: { name: skill.data.name },
    props: { skill },
  }));
}

const { skill } = Astro.props;
---
```

This generates pages like:
- `/skills/python-basics`
- `/skills/web-development`
- etc.

### Internationalization Routing

Language-based routing:

```
Default (English):  /
Chinese:           /zh/

/skills/            → English skills list
/zh/skills/         → Chinese skills list
/skills/python      → English Python skill
/zh/skills/python   → Chinese Python skill (if exists)
```

Routing logic in components handles language detection.

## Internationalization

### i18n Architecture

```
Qoder Community
├── English (Default)
│   ├── src/pages/*.astro
│   ├── src/content/skills/
│   ├── src/content/agents/
│   └── ...
└── Chinese
    ├── src/pages/zh/*.astro
    ├── src/content/skills-zh/
    ├── src/content/agents-zh/ (if needed)
    └── ...
```

### Language Configuration

**File**: `src/i18n/index.ts`

```typescript
export const LANGUAGES = {
  en: 'English',
  zh: '中文',
};

export const DEFAULT_LANGUAGE = 'en';

export const getLanguagePath = (lang: string): string => {
  return lang === 'en' ? '' : `/${lang}`;
};
```

### Translation Workflow

1. **Create English content** in `src/content/skills/skill-name.md`
2. **Translate content** to `src/content/skills-zh/skill-name.md`
3. **Keep frontmatter `name` field identical** for matching
4. **Update content** in both files when needed

### Language Switcher

**Component**: `src/components/LanguageSwitcher.astro`

Provides UI toggle between English and Chinese on each page.

## Component System

### Component Organization

```
src/components/
├── Layout Components
│   ├── Header.astro
│   ├── Footer.astro
│   └── LanguageSwitcher.astro
├── Content Cards
│   ├── SkillCard.astro
│   ├── AgentCard.astro
│   ├── VideoCard.astro
│   ├── MeetupCard.astro
│   └── ShowcaseCard.astro
├── Filters & UI
│   ├── SkillFilter.astro
│   ├── RoleSelector.astro
│   ├── ShowcaseFilter.astro
│   └── ThemeSelect.astro
└── SkillSourceCard.astro
```

### Component Pattern

Astro components are `.astro` files with three sections:

```astro
---
// Component script (server-side, runs at build time)
interface Props {
  title: string;
  featured?: boolean;
}

const { title, featured = false } = Astro.props;

// Data fetching
const data = await fetchData();
---

<!-- Component markup (JSX-like) -->
<div class:list={['card', { featured }]}>
  <h3>{title}</h3>
</div>

<!-- Component styles (scoped) -->
<style>
  .card {
    padding: 1rem;
  }
  
  .card.featured {
    border: 2px solid var(--sl-color-accent);
  }
</style>
```

### Key Components Explained

#### SkillCard.astro

Displays a single skill in gallery view:
- Shows skill title, description, tags
- Links to full skill page
- Displays source indicator (Anthropic, Vercel, Community)
- Shows featured/popular badges

#### AgentCard.astro

Displays a single agent:
- Author information with avatar
- Category and tags
- Use case description
- GitHub link

#### RoleSelector.astro

Interactive role filter:
- Shows available roles (Developer, Designer, etc.)
- Filters skills by selected role
- Multi-select support
- Persists selection in URL

## Data Flow

### Skill Display Data Flow

```
1. src/content/skills/*.md
   ↓ (Read and parse)
2. Content loader validates against schema
   ↓ (Schema defined in src/content.config.ts)
3. getCollection('skills') returns typed data
   ↓ (In page or component)
4. Filter/Sort data if needed
   ↓ (By category, role, featured status)
5. Map over data, render SkillCard components
   ↓ (Each SkillCard displays one skill)
6. SkillCard links to dynamic route /skills/[name]
   ↓ (Dynamic page loads individual skill)
7. Individual skill page renders full content
```

### Search Data Flow

```
1. Content loaded and rendered to HTML
2. Pagefind crawler indexes all pages
3. Search index built into dist/_pagefind/
4. Browser downloads search index (lazy-loaded)
5. Client-side JavaScript performs searches
6. Results returned from local index (no server needed)
```

## Performance Architecture

### Performance Characteristics

**Client-Side**:
- ~2.5 KB of JavaScript
- No frameworks or libraries shipped
- Search index lazy-loaded on demand
- Minimal CSS (~30 KB gzipped)

**Build-Time**:
- All content pre-rendered
- No server computation needed
- Search index pre-generated
- Optimizations applied at build time

**Delivery**:
- Static files served from CDN edge
- HTTP/2 and Brotli compression
- Instant first-byte response
- Global geographic distribution

### Optimization Techniques

1. **Code Splitting**: Automatic via Astro
2. **Asset Minification**: Automatic during build
3. **CSS Scoping**: Component styles scoped by default
4. **Image Optimization**: Optional via Sharp plugin
5. **Search Index**: Pre-built at build time
6. **CDN Caching**: 24-hour default TTL

### Lighthouse Targets

- **Performance**: 98-100
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 100

Achieved through:
- Minimal JavaScript
- Semantic HTML
- ARIA labels
- Meta tags and structured data

---

## Related Documents

- [DEVELOPMENT.md](DEVELOPMENT.md) - Developer guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [README.md](README.md) - Project overview

---

**Last Updated**: 2026-03-13  
**Audience**: Developers, Architects, Maintainers  
**Maintained By**: Qoder Community Team
