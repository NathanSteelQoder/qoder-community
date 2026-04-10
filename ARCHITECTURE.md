# Qoder Community Architecture

This document describes the system architecture, data flow, and key components of the Qoder Community platform.

## System Overview

Qoder Community is a static site generator built with Astro and Starlight that serves as a discovery and learning hub for Qoder agent skills. The platform supports bilingual content (English/Chinese) and features content filtering, role-based recommendations, and share image generation for social media.

```
┌─────────────────────────────────────────────────────────────┐
│                    Qoder Community                          │
│                  Static Site (Astro 5.6+)                  │
└──────────────────────────┬──────────────────────────────────┘
        │
        ├─── Content Collections ───┐
        │    (Markdown/YAML)        │
        │    • Skills               │
        │    • Agents               │
        │    • Videos               │
        │    • Meetups              │
        │    • Showcase             │
        │    • Skill Sources        │
        │    • Docs                 │
        │                           │
        ├─── i18n System ───────────┤
        │    • UI Translations      │
        │    • Skill Translations   │
        │    • Language Detection   │
        │    • Path Routing         │
        │                           │
        ├─── Components ────────────┤
        │    • SkillCard            │
        │    • SkillFilter          │
        │    • RoleSelector         │
        │    • Cards (Agents, etc)  │
        │                           │
        ├─── Utilities ─────────────┤
        │    • Share Image Gen      │
        │    • Format Functions     │
        │    • Translation Helpers  │
        │                           │
        └─── Styling ───────────────┘
             (CSS Variables)
             Dark Mode Support
```

## Content Architecture

### Collections & Data Flow

The platform uses Astro's content collections system to manage structured content. Each collection has a strict schema enforced via Zod validation.

```
src/content/
├── skills/              # English skill content
│   └── skill-name.md   # Skill file with frontmatter
├── skills-zh/          # Chinese skill translations
├── agents/             # Agent configuration templates
├── videos/             # Tutorial video references
├── meetups/            # Community event listings
├── showcase/           # Featured projects
├── skillSources/       # External skill repositories
└── docs/               # Site documentation (Starlight)
```

**Collection Schema Validation** (`src/content.config.ts`):

- **Skills**: Frontmatter includes name, title, description, category, source, author, links, roles, flags (featured/popular/official), install command
- **Agents**: Author info, GitHub URL, tags, category, use case
- **Videos**: YouTube ID, channel info, duration, category, tags
- **Meetups**: Location, date, status, capacity, attendees, media URLs
- **Showcase**: Title, description, tags, image, link, featured flag
- **Skill Sources**: Name, description, URL, skill count, order weight
- **Docs**: Starlight documentation pages with markdown support

### Content Flow

```
Markdown File
    ↓
Schema Validation (Zod)
    ↓
Collection Entry Object
    ↓
Page Generation
    ↓
Component Rendering (Astro)
    ↓
Static HTML
```

## Internationalization (i18n) Architecture

The platform supports bilingual content with automatic language detection and localized routing.

### Structure

```
src/i18n/
├── index.ts                    # Module exports
├── ui.ts                       # UI string translations
├── utils.ts                    # i18n helper functions
├── skills-translations.ts      # Skill-level translations
└── skillSources-translations.ts # Skill source translations
```

### Language Detection Flow

```
URL Request
    ↓
getLangFromPath() or getLangFromUrl()
    ├─ URL starts with /zh/ → 'zh-CN'
    └─ Otherwise → 'en-US'
    ↓
useTranslations(lang) → Translation Function
    ↓
Component renders translated strings
```

### Routing Pattern

- **English**: `/skills/`, `/agents/`, `/meetups/`, `/learn/`
- **Chinese**: `/zh/skills/`, `/zh/agents/`, `/zh/meetups/`, `/zh/learn/`

### Translation Hierarchy

1. **UI Translations** (`ui.ts`): Global UI strings (buttons, labels, nav)
2. **Skill Translations** (`skills-translations.ts`): Per-skill title/description overrides
3. **Fallback**: If translation missing, falls back to default language, then key itself

## Component Architecture

### Interactive Components

#### SkillFilter
- **Purpose**: Filter skills by category with URL query params
- **Behavior**: 
  - Renders category pills
  - Shows skill count per category
  - Updates URL without page reload
  - Initializes from URL on page load
- **Data Attributes**: `data-filter-component`, `data-category`, `data-skill-category`
- **Styling**: Uses CSS variables, inline styles for active state

#### RoleSelector
- **Purpose**: Show role-based skill recommendations
- **Behavior**:
  - Displays 12 role pills (developer, marketer, designer, PM, etc)
  - Shows top 10 skills per role
  - Tab-like UI with animated transitions
  - Responsive: scrollable pills on mobile
- **Data Attributes**: `data-role-selector`, `data-role`, `data-role-content`
- **Pre-computation**: Skills filtered by role at build time

#### SkillCard
- **Purpose**: Display skill summary in grid
- **Content**: Name, title, description (3 line truncate), source badge, category tag
- **Styling**: Hover lift effect, gradient top border
- **States**: Featured, popular, official badges

#### Other Cards
- **AgentCard**: Agent info with author avatar, category, use case
- **VideoCard**: Video preview with YouTube embed, channel, duration
- **MeetupCard**: Event info with location, date, status, capacity
- **ShowcaseCard**: Project preview with image, tags, featured flag
- **SkillSourceCard**: External resource with count, icon, link

### Page Layouts

#### Skills Page (`src/pages/skills.astro`)
1. Hero section with badge, title, CTA
2. Stats row (skill count, categories, roles, ecosystem size)
3. How-to steps (3-column grid)
4. Role-based recommendations (RoleSelector component)
5. Featured skills section (SkillFilter + grid)
6. External sources (4-column grid)
7. CTA to create/contribute

#### Skill Detail Page (`src/pages/skills/[slug].astro`)
1. Breadcrumb navigation
2. Header with title, badges, action buttons
3. Two-column layout:
   - Main: Description, roles, tags, markdown content
   - Sidebar: Install command, info card, links card
4. Related skills (3-column grid)
5. Back link

## Share Image Generation System

### Purpose
Dynamically generate social media share images (900x1200px, 3:4 ratio for Xiaohongshu/TikTok).

### Architecture

```
Canvas Generation (Client-side)
    ↓
Load Assets (Parallel)
├── Skill-specific image or category default
├── Qoder logo
└── QR code
    ↓
Draw Elements (Sequential)
├── Background
├── Title ("✨ 今日效率分享")
├── Demo image (rounded, centered)
├── Share text
├── Separator line
├── Logo
├── CTA text
└── QR code
    ↓
Export as PNG (Base64 data URL)
```

### Key Functions

- `generateShareImage()`: Main function, returns Base64 data URL
- `downloadImage()`: Download generated image to disk
- `getShareImagePath()`: Resolve skill image with fallback to category default
- `loadImage()`: Promise-based image loading
- `roundRect()`: Helper to draw rounded rectangles

### Image Fallback Logic

```
Requested: /images/skills/share/{slug}-share.jpg
    ↓
If exists: Use skill-specific image
If not found: Fall back to /images/skills/share/default-{category}.jpg
If missing: Canvas generation still proceeds (blank area)
```

### Category to Outcome Mapping

Maps skill categories to Chinese outcome labels for share text:

```
document    → 文档处理
design      → 创意设计
development → 开发任务
marketing   → 营销内容
automation  → 流程自动化
productivity → 效率提升
security    → 安全分析
data        → 数据处理
meta        → 工具配置
```

## Styling Architecture

### Design Tokens (CSS Variables)

Located in `src/styles/custom.css`, available globally:

**Colors**:
- `--qoder-brand-green`: Primary brand color (#2ADB5C)
- `--text-primary`, `--text-secondary`, `--text-tertiary`: Text hierarchy
- `--surface-elevated`, `--surface-sunken`: Surface backgrounds
- `--structural-teal`, `--border-subtle`: Borders

**Spacing** (8px base):
- `--space-1` through `--space-16` (8px to 128px)

**Typography**:
- `--font-display`: Display/heading font
- `--font-body`: Body text font
- `--font-mono`: Monospace font

**Radius**:
- `--radius-xs`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-full`

**Shadows**:
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`

**Duration & Easing**:
- `--duration-fast`, `--duration-normal`
- `--ease-out`, `--ease-out-expo`

### Component Styling Pattern

1. Semantic class names (.skill-card, .filter-pill, .role-selector)
2. CSS variables for colors, spacing, typography
3. Responsive design with media queries (1200px, 1024px, 768px breakpoints)
4. Dark mode support via Starlight CSS variable overrides
5. Interactive states: hover, active, disabled

## Data Flow Example: Skill Discovery

```
User Navigates to /skills/
    ↓
getCollection('skills') fetches all markdown files
    ↓
Sort by featured, then date (newest first)
    ↓
Build category counts (all + per-category)
    ↓
Render page with:
├── Stats (computed at build time)
├── SkillFilter (with counts)
├── RoleSelector (with pre-filtered skills)
└── SkillCard grid (with category data attributes)
    ↓
Browser loads, JavaScript initializes:
├── SkillFilter: Listen for clicks, filter cards by category
├── RoleSelector: Listen for role clicks, show/hide content
└── Both components update URL without reload
    ↓
User filters or selects role
    ↓
Client-side DOM manipulation (CSS display property)
```

## Build & Deployment Pipeline

```
Source Files (.md, .astro, .ts, .css)
    ↓
Astro Build
├── Markdown → HTML
├── Astro components → Static HTML
├── TypeScript → JavaScript
├── CSS → Optimized CSS
└── Assets → Copied to dist/
    ↓
Output: dist/ directory
    ↓
Cloudflare Pages
    ├── Fetch from GitHub
    ├── Build: npm run build
    ├── Deploy: dist/ → Global CDN
    └── Live at qoder-community.pages.dev
```

## Performance Considerations

### Build Time
- Quick builds (~4 seconds)
- Lightweight: 50+ skills processed efficiently
- No dynamic routing overhead

### Runtime Performance
- Minimal JavaScript (~2.5KB)
- Client-side filtering only (SkillFilter, RoleSelector)
- No external API calls
- Static assets served from CDN

### Lighthouse Scores
- 98-100: Performance, Accessibility, Best Practices, SEO

## Future Architecture Considerations

1. **Search Index**: Pagefind integration for full-text search
2. **Dynamic Content**: Future API endpoints for real-time skill updates
3. **Analytics**: Event tracking for filter/role selections
4. **Caching**: Edge caching strategies for translated variants
5. **A/B Testing**: URL-based experimentation framework
