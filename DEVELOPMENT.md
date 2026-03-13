# Development Guide

Complete guide for developers contributing to the Qoder Community codebase.

## Table of Contents

- [Quick Start](#quick-start)
- [Project Architecture](#project-architecture)
- [Development Workflow](#development-workflow)
- [Content Collections](#content-collections)
- [Component Development](#component-development)
- [Internationalization (i18n)](#internationalization-i18n)
- [Troubleshooting](#troubleshooting)
- [Performance Tips](#performance-tips)

## Quick Start

### Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 8.x or higher
- **Git**: Latest version

### First-Time Setup

```bash
# Clone the repository
git clone https://github.com/Qoder-AI/qoder-community.git
cd qoder-community

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# Visit http://localhost:4321
```

### Available Commands

```bash
npm run dev        # Start dev server with hot reload
npm run build      # Build for production (generates dist/)
npm run preview    # Preview production build locally
npx astro check   # TypeScript type checking
npx astro add     # Add integrations (e.g., React, Vue)
```

## Project Architecture

### Directory Structure

```
qoder-community/
├── src/
│   ├── content/                    # Content collections (Markdown)
│   │   ├── skills/                # English skills (50+)
│   │   ├── skills-zh/             # Chinese skills (translated)
│   │   ├── agents/                # Agent configurations
│   │   ├── videos/                # Tutorial videos metadata
│   │   ├── meetups/               # Event information
│   │   ├── showcase/              # Community projects
│   │   ├── skillSources/          # External skill resources
│   │   └── docs/                  # Site documentation
│   │       ├── index.mdx          # Landing page
│   │       ├── intro.md           # Product intro
│   │       ├── getting-started.md # Getting started
│   │       └── zh/                # Chinese docs
│   │
│   ├── components/                 # Astro components
│   │   ├── SkillCard.astro        # Display skill cards
│   │   ├── AgentCard.astro        # Display agent cards
│   │   ├── MeetupCard.astro       # Display event cards
│   │   ├── ShowcaseCard.astro     # Display project cards
│   │   ├── VideoCard.astro        # Display video cards
│   │   ├── SkillFilter.astro      # Skill filtering UI
│   │   ├── RoleSelector.astro     # Role filtering
│   │   ├── Header.astro           # Site header
│   │   ├── Footer.astro           # Site footer
│   │   ├── LanguageSwitcher.astro # i18n language switcher
│   │   ├── ThemeSelect.astro      # Dark mode toggle
│   │   └── ...other components
│   │
│   ├── pages/                      # Route pages
│   │   ├── index.astro            # Home page (redirects to docs)
│   │   ├── skills.astro           # Skills gallery page
│   │   ├── agents.astro           # Agents page
│   │   ├── learn.astro            # Learn resources page
│   │   ├── meetups.astro          # Events page
│   │   ├── showcase.astro         # Showcase projects page
│   │   ├── skills/
│   │   │   └── [name].astro       # Individual skill page (dynamic)
│   │   └── zh/                    # Chinese routes
│   │       ├── index.astro
│   │       ├── skills.astro
│   │       └── ...
│   │
│   ├── i18n/                      # Internationalization
│   │   ├── index.ts               # i18n configuration
│   │   └── skills-translations.ts # Skill translations mapping
│   │
│   ├── styles/
│   │   └── custom.css             # Custom Starlight theme overrides
│   │
│   └── content.config.ts          # Content collection schemas
│
├── public/                         # Static assets
│   └── images/
│       ├── skills/share/          # Share images (1200x630)
│       └── ...other images
│
├── astro.config.mjs               # Astro configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies and scripts
└── README.md, CONTRIBUTING.md, etc.
```

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Astro | 5.6+ | Static site generation |
| **Theme** | Starlight | 0.37+ | Documentation theme |
| **Language** | TypeScript | Latest | Type-safe development |
| **Styling** | CSS | Custom | Theme customization |
| **Search** | Pagefind | Built-in | Full-text search |
| **Deployment** | Cloudflare Pages | N/A | Hosting and CDN |
| **i18n** | Astro i18n | Built-in | English/Chinese support |

## Development Workflow

### Creating a Feature Branch

```bash
# Update main branch
git fetch origin
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/add-new-skill

# Work on your changes...

# Commit with descriptive message
git commit -m "feat: add new skill template"

# Push to remote
git push origin feature/add-new-skill

# Create Pull Request on GitHub
```

### Git Commit Message Format

Follow these conventions:

```
feat: add new feature
fix: fix a bug
docs: update documentation
style: code style changes (no logic change)
refactor: refactor code structure
test: add/update tests
chore: maintenance tasks
```

Examples:
```bash
git commit -m "feat: add postgres skill documentation"
git commit -m "fix: correct skill frontmatter format"
git commit -m "docs: update development guide"
git commit -m "refactor: optimize component rendering"
```

### Running Tests

Currently, the project doesn't have automated tests. Before committing:

1. **Type checking**:
   ```bash
   npx astro check
   ```

2. **Local build test**:
   ```bash
   npm run build
   ```

3. **Local preview**:
   ```bash
   npm run preview
   # Visit http://localhost:3000
   ```

4. **Manual testing**:
   - Test dev server at http://localhost:4321
   - Check all navigation links
   - Test dark mode toggle
   - Test language switcher
   - Verify new content renders correctly

## Content Collections

### Adding a Skill

Skills are the main content type. Follow this process:

#### 1. Create English Skill File

Create `src/content/skills/your-skill-name.md`:

```markdown
---
name: your-skill-name
title: Skill Title
description: Brief description (1-2 sentences)
source: community  # anthropic, vercel, community, or enterprise
author: Your Name
githubUrl: https://github.com/username/repo
category: development  # See categories below
tags:
  - tag1
  - tag2
roles:
  - developer
featured: false
popular: false
isOfficial: false
installCommand: |
  git clone https://github.com/username/repo
  cp -r folder ~/.qoder/skills/
date: 2026-03-13
---

## Use Cases

- Use case 1
- Use case 2

## Core Capabilities

- **Feature 1**: Description
- **Feature 2**: Description

## Example

\`\`\`bash
# Example command or code
\`\`\`

## Notes

- Important note 1
- Important note 2
```

#### 2. Create Chinese Translation

Copy and translate to `src/content/skills-zh/your-skill-name.md`.

#### 3. Add Share Image

Create `public/images/skills/share/your-skill-name-share.png`:
- Size: 1200x630 pixels
- Format: PNG
- Compression: Optimized (~50-100 KB)

#### 4. Verify Frontmatter

All required fields:
- `name` - kebab-case identifier
- `title` - Display title
- `description` - 1-2 sentences
- `category` - One of the categories below
- `author` - Skill author name
- `githubUrl` - Repository URL
- `date` - Creation date (YYYY-MM-DD)

### Content Categories

| Category | Description | Examples |
|----------|-------------|----------|
| `development` | Development and engineering | Python, API, Database |
| `design` | Design and UX | UI Design, Figma, Branding |
| `marketing` | Marketing and growth | SEO, Content, Analytics |
| `productivity` | Productivity tools | Task Management, Note-taking |
| `automation` | Workflow automation | CI/CD, Scripts, Workflows |
| `data` | Data processing and analysis | SQL, Analytics, ETL |
| `security` | Security and compliance | Auth, Encryption, Auditing |
| `document` | Document processing | PDF, Word, Markdown |
| `meta` | Meta skills about skills | Skill creation, Documentation |

### Skill Schema (src/content.config.ts)

```typescript
{
  // Basic info
  name: string              // Required: kebab-case
  title: string             // Required: display name
  description: string       // Required: 1-2 sentences
  
  // Source
  source: enum              // Required: anthropic|vercel|community|enterprise
  author?: string           // Optional: author name
  
  // Links
  githubUrl: string         // Required: GitHub repo
  docsUrl?: string          // Optional: documentation link
  marketplaceUrl?: string   // Optional: marketplace link
  
  // Classification
  category: enum            // Required: see categories above
  tags?: string[]           // Optional: skill tags
  roles?: enum[]            // Optional: applicable roles
  
  // Display
  featured: boolean         // Default: false
  popular: boolean          // Default: false
  isOfficial: boolean       // Default: false
  
  // Installation
  installCommand?: string   // Optional: install instructions
  
  // Metadata
  date: date                // Required: creation date
  lastUpdated?: date        // Optional: last update date
}
```

### Other Collection Types

#### Agents

Location: `src/content/agents/*.md`

```yaml
---
title: Agent Name
description: What this agent does
author:
  name: Author Name
  avatar: https://avatar-url.com/image.jpg
  url: https://github.com/username
githubUrl: https://github.com/repo
tags: [tag1, tag2]
category: Frontend  # Frontend|Backend|Full-Stack|Mobile|CLI
useCase: Brief use case description
date: 2026-03-13
featured: false
---
```

#### Videos

Location: `src/content/videos/*.md`

```yaml
---
title: Video Title
description: Video description
youtubeId: dQw4w9WgXcQ
channel: Channel Name
channelUrl: https://youtube.com/@channel
duration: "15:30"
category: Tutorial  # Tutorial|Review|Introduction|Case Study
tags: [tag1, tag2]
date: 2026-03-13
featured: false
---
```

#### Meetups

Location: `src/content/meetups/*.md`

```yaml
---
title: Event Name
description: Event description
location: City, Country
date: 2026-04-15
status: upcoming  # upcoming|past
registrationUrl: https://eventbrite.com/...
capacity: 100
image: /images/meetups/event.jpg
organizer: Organizer Name
topics: [topic1, topic2]
---
```

## Component Development

### Creating a New Component

Components are Astro components (`.astro` files) in `src/components/`.

#### Example Component

```astro
---
// src/components/MyComponent.astro
interface Props {
  title: string;
  description?: string;
  featured?: boolean;
}

const { title, description = '', featured = false } = Astro.props;
---

<div class:list={['card', { featured }]}>
  <h3>{title}</h3>
  {description && <p>{description}</p>}
</div>

<style>
  .card {
    padding: 1rem;
    border-radius: 8px;
    background: var(--sl-color-bg-nav);
    border: 1px solid var(--sl-color-gray-5);
  }

  .card.featured {
    border: 2px solid var(--sl-color-accent);
  }

  h3 {
    margin: 0 0 0.5rem 0;
    font-weight: 700;
  }

  p {
    margin: 0;
    color: var(--sl-color-gray-1);
  }
</style>
```

### Using Starlight Theme Variables

Starlight provides CSS variables for consistent styling:

```css
/* Colors */
--sl-color-accent             /* Accent color */
--sl-color-bg-nav            /* Navigation background */
--sl-color-bg-sidebar        /* Sidebar background */
--sl-color-gray-1 through 6  /* Gray scale (1=darkest, 6=lightest) */

/* Typography */
--sl-font-mono               /* Monospace font */
--sl-font-sans               /* Sans-serif font */

/* Spacing */
--sl-border-radius           /* Border radius */
--sl-margin-x                /* Horizontal margin */
--sl-margin-y                /* Vertical margin */
```

### Component Best Practices

1. **Type Props**:
   ```astro
   interface Props {
     title: string;
     description?: string;
   }
   ```

2. **Use Semantic HTML**:
   ```html
   <article>, <section>, <header>, <footer>
   ```

3. **Accessible Classes**:
   ```astro
   <button class:list={['btn', { 'btn-primary': isPrimary }]}>
   ```

4. **Avoid Inline Styles**:
   - Use `<style>` blocks instead
   - Reference CSS variables

5. **Scope Styles**:
   - Styles in `<style>` blocks are automatically scoped
   - Use descriptive class names

## Internationalization (i18n)

### Language Structure

The site supports English (default) and Chinese (Simplified):

```
/                    # English home
/skills/             # English skills page
/learn/              # English learn page
/zh/                 # Chinese home
/zh/skills/          # Chinese skills page
/zh/learn/           # Chinese learn page
```

### Adding Bilingual Content

#### For Skills

1. Create English version: `src/content/skills/skill-name.md`
2. Create Chinese version: `src/content/skills-zh/skill-name.md`
3. Content files have same `name` field for matching

#### For Pages

1. Create English page: `src/pages/page-name.astro`
2. Create Chinese page: `src/pages/zh/page-name.astro`

### i18n Configuration

Located in `src/i18n/index.ts`:

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

### Translating Skill Content

1. Open skill in English: `src/content/skills/skill-name.md`
2. Copy frontmatter and content
3. Create Chinese file: `src/content/skills-zh/skill-name.md`
4. Translate content (keep frontmatter `name` identical)
5. Translate all Markdown sections

**Translation Tips**:
- Keep technical terms consistent
- Translate section headers
- Maintain code examples (don't translate)
- Preserve formatting and links

## Troubleshooting

### Dev Server Issues

**Problem**: Server won't start

```bash
# Clear cache and reinstall
rm -rf node_modules .astro
npm install
npm run dev
```

**Problem**: Port 4321 already in use

```bash
# Use different port
npm run dev -- --port 3000

# Or kill the process using port 4321
# On Linux/Mac:
lsof -ti:4321 | xargs kill -9
```

### Content Not Showing

**Problem**: New skill doesn't appear on skills page

1. **Check frontmatter**:
   - All required fields present?
   - Correct enum values? (`category`, `source`)
   - Date valid? (format: YYYY-MM-DD)

2. **Check schema**:
   - Run `npx astro check`
   - Look for schema validation errors

3. **Rebuild**:
   ```bash
   npm run build
   # Check dist/ for generated files
   ```

### Build Fails

**Problem**: `npm run build` fails

1. **Check TypeScript**:
   ```bash
   npx astro check
   ```

2. **Check content**:
   - All .md files in `src/content/` valid?
   - Frontmatter format correct?

3. **Clear and rebuild**:
   ```bash
   rm -rf dist .astro
   npm run build
   ```

### Performance Issues

**Problem**: Dev server very slow

1. **Check file count**: Too many content files?
2. **Restart server**: Often helps
3. **Check disk space**: Ensure adequate space
4. **Upgrade Node.js**: Use Node 18+

## Performance Tips

### Development Performance

1. **Reload Times**: Usually instant with Astro's hot reload
2. **File Changes**: Only modified files rebuild
3. **Large Images**: Pre-compress before committing
4. **Node Modules**: Don't edit files in `node_modules/`

### Production Build Performance

1. **Build Time**: Target under 60 seconds
2. **Output Size**: Keep `dist/` under 20 MB
3. **Asset Optimization**: Compress images and SVGs
4. **Code Splitting**: Automatic via Astro

### Monitoring Performance

```bash
# Build with timing information
npm run build

# Check output size
du -sh dist/

# Preview production build
npm run preview
```

### Common Performance Bottlenecks

1. **Large uncompressed images**
   - Solution: Use WebP with PNG fallback

2. **Many content collections**
   - Solution: Paginate collections in pages

3. **Complex components**
   - Solution: Use Astro's built-in optimizations

## Related Documentation

- [README.md](README.md) - Project overview
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contributor guidelines
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment procedures
- [Astro Docs](https://docs.astro.build/)
- [Starlight Docs](https://starlight.astro.build/)

---

**Last Updated**: 2026-03-13  
**Audience**: Developers, Contributors  
**Maintained By**: Qoder Community Team
