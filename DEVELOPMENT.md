# Development Guide

This guide explains how to set up your development environment, understand the codebase structure, and contribute to Qoder Community.

## Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Content Collections](#content-collections)
- [Component Development](#component-development)
- [Internationalization (i18n)](#internationalization-i18n)
- [Build Pipeline](#build-pipeline)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

## Quick Start

### Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Git**: For version control

### Setup

```bash
# Clone repository
git clone https://github.com/Qoder-AI/qoder-community.git
cd qoder-community

# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:4321
```

### Verify Setup

```bash
# Type checking
npx astro check

# Build test
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
qoder-community/
├── src/
│   ├── content/                    # Markdown content files
│   │   ├── skills/                 # English skills (50+)
│   │   ├── skills-zh/              # Chinese skills
│   │   ├── skillSources/           # External skill sources
│   │   ├── agents/                 # Agent configurations
│   │   ├── videos/                 # Video tutorials
│   │   ├── meetups/                # Meetup events
│   │   ├── showcase/               # Project showcase
│   │   └── docs/                   # Site documentation (Starlight)
│   ├── components/                 # Astro components
│   │   ├── SkillCard.astro
│   │   ├── SkillFilter.astro
│   │   ├── RoleSelector.astro
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── ...
│   ├── pages/                      # Route pages
│   │   ├── index.astro
│   │   ├── skills.astro
│   │   ├── agents.astro
│   │   ├── learn.astro
│   │   ├── meetups.astro
│   │   ├── showcase.astro
│   │   ├── skills/[slug].astro
│   │   └── zh/                     # Chinese pages
│   ├── i18n/                       # Internationalization
│   │   ├── index.ts
│   │   ├── ui.ts
│   │   ├── utils.ts
│   │   ├── skills-translations.ts
│   │   └── skillSources-translations.ts
│   ├── utils/
│   │   └── share-image-generator.ts
│   ├── styles/
│   │   └── custom.css
│   └── content.config.ts           # Content schema definitions
├── public/
│   ├── images/
│   │   ├── skills/share/           # Share images
│   │   └── ...
│   └── ...
├── astro.config.mjs
├── tsconfig.json
├── package.json
├── AGENTS.md                       # AI assistant guidelines
├── CONTRIBUTING.md                 # Contribution guidelines
├── README.md
├── DEVELOPMENT.md                  # This file
├── DEPLOYMENT.md                   # Deployment guide
└── ARCHITECTURE.md                 # Architecture reference
```

## Development Workflow

### Starting the Dev Server

```bash
npm run dev
```

The dev server watches for file changes and hot-reloads automatically. Access at `http://localhost:4321`.

### File Watching

Astro watches these locations:
- `src/content/**/*.md` - Content updates trigger rebuild
- `src/components/**/*.astro` - Component changes trigger rebuild
- `src/pages/**/*.astro` - Page changes trigger rebuild
- `src/styles/**/*.css` - Style changes reload
- `src/i18n/**/*.ts` - Translation updates trigger rebuild

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/skill-feature-name

# Make changes
# Commit regularly
git commit -m "feat: descriptive message"

# Push to origin
git push origin feature/skill-feature-name

# Create Pull Request on GitHub
```

### Commit Message Format

Follow conventional commits:

```
feat: Add new feature
fix: Fix a bug
docs: Update documentation
style: Style adjustments (no logic change)
refactor: Refactor without changing behavior
perf: Performance improvements
test: Add tests
chore: Dependency updates
```

## Content Collections

Content is organized into typed collections defined in `src/content.config.ts`.

### Skills Collection

**Location**: `src/content/skills/` (English) and `src/content/skills-zh/` (Chinese)

**Schema**:
```typescript
{
  // Basic info
  name: string;                    // Slug-friendly name
  title: string;                   // Display title
  description: string;             // Brief description

  // Source info
  source: 'anthropic' | 'vercel' | 'community' | 'enterprise';
  author?: string;

  // Links
  githubUrl: string;               // Required
  docsUrl?: string;
  marketplaceUrl?: string;

  // Category
  category: 'document' | 'development' | 'design' | 'automation' | 
            'marketing' | 'data' | 'security' | 'productivity' | 'meta';

  tags?: string[];
  roles?: [developer, marketer, designer, pm, data-analyst, devops, 
           content, finance, hr, legal, sales, executive];

  // Display properties
  featured?: boolean;              // Show in featured section
  popular?: boolean;               // Mark as popular
  isOfficial?: boolean;            // Official from source

  // Installation
  installCommand?: string;

  // Metadata
  date: Date;
  lastUpdated?: Date;
}
```

**Example**:
```markdown
---
name: postgres
title: PostgreSQL Database Setup
description: Configure and manage PostgreSQL for your Qoder projects
source: community
author: Jane Developer
githubUrl: https://github.com/user/postgres-skill
docsUrl: https://example.com/docs
category: development
tags:
  - database
  - sql
  - backend
roles:
  - developer
  - devops
featured: true
popular: false
date: 2025-01-15
---

# PostgreSQL Setup Guide

Your markdown content here...
```

### Showcase Collection

**Location**: `src/content/showcase/`

**Fields**:
- `title`: Project name
- `description`: Project description
- `tags`: Array of tags (1-5)
- `image`: Image path
- `link`: Optional project URL
- `featured`: Boolean
- `date`: Publication date

### Agents Collection

**Location**: `src/content/agents/`

**Fields**:
- `title`: Agent configuration name
- `description`: What this agent does
- `author`: Object with `name`, `avatar`, `url`
- `githubUrl`: Link to configuration
- `tags`: Keywords
- `category`: 'Frontend' | 'Backend' | 'Full-Stack' | 'Mobile' | 'CLI'
- `useCase`: Use case description
- `date`: Created date
- `featured`: Boolean

### Videos Collection

**Location**: `src/content/videos/`

**Fields**:
- `title`: Video title
- `description`: Video description
- `youtubeId`: YouTube video ID
- `channel`: Channel name
- `channelUrl`: Channel URL
- `duration`: Video duration (e.g., "12:34")
- `category`: 'Tutorial' | 'Review' | 'Introduction' | 'Case Study'
- `tags`: Keywords
- `date`: Published date
- `featured`: Boolean

### Meetups Collection

**Location**: `src/content/meetups/`

**Fields**:
- `title`: Meetup name
- `description`: Meetup description
- `location`: Location string
- `date`: Event date
- `status`: 'upcoming' | 'past'
- `registrationUrl`: Optional registration link
- `capacity`: Optional capacity number
- `attendees`: Optional attended count
- `image`: Event image
- `recordingUrl`: Optional recording link
- `photos`: Optional array of photo paths
- `organizer`: Organizer name
- `topics`: Array of topics discussed

## Component Development

All components are Astro components (`.astro` files) located in `src/components/`.

### Component Anatomy

Astro components have three sections:

```astro
---
// 1. Server-side TypeScript (frontmatter)
// Imports, types, server logic
import type { CollectionEntry } from 'astro:content';

interface Props {
  entry: CollectionEntry<'skills'>;
  lang?: 'en' | 'zh-CN';
}

const { entry, lang = 'en' } = Astro.props;
---

<!-- 2. HTML template -->
<div class="component">
  <h3>{entry.data.title}</h3>
  <p>{entry.data.description}</p>
</div>

<!-- 3. Optional scoped styles -->
<style>
  .component {
    padding: 1rem;
    border-radius: 8px;
  }
</style>
```

### Key Components

#### SkillCard
Displays a single skill in card format. Shows:
- Skill name and title
- Description (3-line truncated)
- Category and source badges
- Official/popular/featured indicators

**Props**:
- `entry`: CollectionEntry<'skills'>
- `lang?`: Language ('en' | 'zh-CN')

#### SkillFilter
Category filter pills for filtering skills. Features:
- Category pills with counts
- URL-based state persistence
- Keyboard accessible

**Props**:
- `activeCategory?`: Currently selected category
- `counts?`: Record of category counts
- `lang?`: Language

#### RoleSelector
Job role selector showing recommended skills per role. Features:
- 12 different roles (Developer, Designer, PM, etc.)
- Pre-computed skills per role
- Fade-in animations

**Props**:
- `skills`: CollectionEntry<'skills'>[]
- `lang?`: Language

### Component Best Practices

1. **Props Interface**: Always define `interface Props`
2. **Destructuring**: Destructure props and set defaults
3. **Type Safety**: Use `as const` for literal types
4. **Scoped Styles**: All styles are scoped by default
5. **Client Interactivity**: Wrap client code in `<script>`
6. **Language Support**: Check `lang` prop for i18n

### Client-Side Scripts

For interactivity, add `<script>` tags:

```astro
<script>
  function initComponent() {
    const element = document.querySelector('[data-component]');
    if (!element) return;
    
    // Setup event listeners
    element.addEventListener('click', handleClick);
  }
  
  initComponent();
  // Re-init on page navigation
  document.addEventListener('astro:after-swap', initComponent);
</script>
```

## Internationalization (i18n)

The site supports English (en) and Chinese (zh-CN). Translations are handled by `src/i18n/`.

### i18n Modules

**`ui.ts`**: UI string translations
- `ui['en']`, `ui['zh-CN']`
- Keys like `'filter.all'`, `'source.community'`

**`utils.ts`**: Helper functions
- `useTranslations(lang)` - Returns translation function
- `formatDate(date, lang)` - Locale-aware date formatting
- `getCategoryLabel(category, lang)` - Category translations
- `getSourceLabel(source, lang)` - Source translations
- `getRoleLabel(role, lang)` - Role translations

**`skills-translations.ts`**: Skill-specific translations
- Maps skill slugs to translated content
- Handles skill name, title, description

**`skillSources-translations.ts`**: Skill source translations

### Adding Translations

1. **Update UI strings** in `src/i18n/ui.ts`
2. **Add key** to both 'en' and 'zh-CN' objects
3. **Use in components**:

```astro
---
import { useTranslations } from '../i18n';

const t = useTranslations(lang);
---

<span>{t('filter.all')}</span>
```

### Language Detection

```astro
---
import { getLangFromPath } from '../i18n';

const lang = getLangFromPath(Astro.url.pathname);
// Returns 'en' or 'zh-CN'
---
```

### Route Structure

- English: `/`, `/skills/`, `/skills/[slug]/`
- Chinese: `/zh/`, `/zh/skills/`, `/zh/skills/[slug]/`

## Build Pipeline

### Development Build

```bash
npm run dev
```

- Hot module reloading (HMR)
- Source maps for debugging
- No optimization

### Production Build

```bash
npm run build
```

Process:
1. Validate all content against schemas
2. Process Markdown/MDX to HTML
3. Build React/Astro components
4. Optimize images
5. Generate sitemap
6. Index with Pagefind (full-text search)
7. Output to `dist/` directory

### Build Output

```
dist/
├── index.html
├── skills/
│   ├── index.html
│   ├── [slug]/
│   │   └── index.html
│   └── ...
├── assets/
│   ├── styles.css
│   ├── scripts.js
│   └── ...
├── images/
│   └── ...
├── pagefind/
│   ├── pagefind.js
│   ├── pagefind-ui.js
│   └── ...
└── sitemap-index.xml
```

### Build Time

- Typical: 4-5 seconds
- With 100+ skills: 5-6 seconds

## Common Tasks

### Add a New Skill

1. Create English version:
```bash
touch src/content/skills/new-skill.md
```

2. Create Chinese version:
```bash
touch src/content/skills-zh/new-skill.md
```

3. Fill frontmatter and content

4. Add share image (optional):
```
public/images/skills/share/new-skill-share.png
```

5. Build and test:
```bash
npm run build
npm run preview
```

### Update Skill Translations

1. Find skill slug in `src/i18n/skills-translations.ts`
2. Update translations for both 'en' and 'zh-CN'
3. Test in both languages

### Fix a Component Bug

1. Identify component in `src/components/`
2. Make changes
3. Dev server auto-reloads
4. Test in browser
5. Build and preview for production verification

### Add a New Page

1. Create `src/pages/new-page.astro`
2. Import Starlight page wrapper:
```astro
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
```

3. For Chinese version: `src/pages/zh/new-page.astro`

### Update Styles

1. Global styles: `src/styles/custom.css`
2. Component styles: Inside `<style>` tags in `.astro` files
3. CSS variables available in custom.css

## Troubleshooting

### Build Fails

```bash
# Clean build
rm -rf node_modules dist .astro
npm install
npm run build
```

### Content Not Showing

Check:
- Frontmatter YAML syntax (no tabs, proper indentation)
- Required fields: `title`, `description`, `date`
- File path matches collection location
- File naming: kebab-case.md

### Types Error

```bash
# Run type check
npx astro check

# Update Astro
npm install astro@latest
```

### Dev Server Issues

```bash
# Kill existing process
ps aux | grep node
kill -9 <PID>

# Restart
npm run dev
```

### Search Not Working

Pagefind indexes during build. Check:
- Build completes without errors
- `dist/pagefind/` directory exists
- JavaScript enabled in browser

### Images Not Loading

Check:
- Images in `public/` directory
- Path starts with `/`
- File format supported (PNG, JPG, GIF, WebP)
- For skills: `public/images/skills/share/`

### Component Script Not Running

- Add `data-*` attributes for element selection
- Use `document.addEventListener('astro:after-swap', initComponent)` for page transitions
- Check browser console for errors

### i18n Not Working

- Check language key spelling in `ui.ts`
- Verify component imports `useTranslations`
- Confirm `lang` prop passed to component
- Test with both `/` and `/zh/` URLs

---

For more information, see:
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment procedures
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [AGENTS.md](./AGENTS.md) - AI assistant context
