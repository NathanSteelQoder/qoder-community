# AGENTS.md

> This file provides project context and operational guidelines for AI coding assistants (Qoder, Cursor, GitHub Copilot, etc.).

## Project Overview

Qoder Community is an open-source community platform for sharing AI coding skills, agent configurations, and learning resources.

## Tech Stack

- **Framework**: Astro 5.6+ (Static Site Generator)
- **Theme**: Starlight 0.37+ (Documentation Theme)
- **Language**: TypeScript + Markdown/MDX
- **Styling**: CSS (custom styles in `src/styles/custom.css`)
- **Deployment**: Cloudflare Pages
- **Package Manager**: npm

## Project Structure

```
qoder-community/
├── src/
│   ├── content/           # All content files (Markdown)
│   │   ├── skills/        # English skill docs (50+)
│   │   ├── skills-zh/     # Chinese skill docs
│   │   ├── skillSources/  # External skill sources
│   │   ├── agents/        # Agent config templates
│   │   ├── videos/        # Video resources
│   │   ├── meetups/       # Meetup events
│   │   ├── showcase/      # Project showcase
│   │   └── docs/          # Site pages
│   ├── components/        # Astro components (.astro)
│   ├── pages/             # Route pages
│   │   ├── *.astro        # English pages
│   │   └── zh/*.astro     # Chinese pages
│   ├── i18n/              # Internationalization config
│   └── styles/            # CSS styles
├── public/                # Static assets
│   └── images/            # Image assets
├── astro.config.mjs       # Astro configuration
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript config
```

## Available Commands

```bash
# Development
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:4321)

# Build
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview build result

# Check
npx astro check      # TypeScript type checking
```

## Documentation Index

For detailed information on specific subsystems, refer to:

- **SKILL_DEVELOPMENT.md** — Complete skill development workflow, validation, and best practices
- **I18N_GUIDE.md** — Internationalization system, language detection, routing, and translation utilities
- **ASSET_MANAGEMENT.md** — Image formats, optimization, naming conventions, and share image generation
- **CONTRIBUTING.md** — General contribution guidelines and submission process

## Content Specifications

### Skill File Format

Location: `src/content/skills/` or `src/content/skills-zh/`

```markdown
---
name: skill-name
title: Skill Title
description: One-sentence description, 1-2 sentences
category: development
author: Your Name
githubUrl: https://github.com/username/skill
docsUrl: https://example.com/docs
date: 2026-01-01
---

# Skill Content

Write using Markdown format...
```

**For complete specification, validation, and examples, see SKILL_DEVELOPMENT.md**

### Category Options

| Category | Description |
|----------|-------------|
| `development` | Development-related skills |
| `design` | Design-related skills |
| `marketing` | Marketing-related skills |
| `productivity` | Productivity tools |
| `automation` | Automation skills |
| `data` | Data processing skills |
| `security` | Security-related skills |
| `document` | Document processing skills |
| `meta` | Meta skills (e.g., skill creation) |

### Image Specifications

**For complete image guidelines, see ASSET_MANAGEMENT.md**:

- **Share images**: 1200×630px JPEG, place in `public/images/skills/share/`
- **Naming**: Use kebab-case, e.g., `skill-name-share.jpg`
- **Quality**: 85% JPEG compression
- **Fallback**: Default category image if skill-specific image missing

## Code Style

### Astro Components

```astro
---
// Good example ✅
interface Props {
  title: string;
  description?: string;
}

const { title, description = '' } = Astro.props;
---

<div class="card">
  <h3>{title}</h3>
  {description && <p>{description}</p>}
</div>

<style>
  .card {
    padding: 1rem;
    border-radius: 8px;
  }
</style>
```

### TypeScript

```typescript
// Good example ✅ - Explicit types, clear naming
export function getSkillsByCategory(category: string): Skill[] {
  return skills.filter(skill => skill.data.category === category);
}

// Avoid ❌ - Vague types, unclear naming
export function get(c: any) {
  return skills.filter(s => s.data.category === c);
}
```

### CSS

```css
/* Good example ✅ - Use CSS variables, semantic class names */
.skill-card {
  background: var(--sl-color-bg-nav);
  border-radius: var(--sl-border-radius);
  padding: 1rem;
}

/* Avoid ❌ - Hardcoded colors, non-semantic class names */
.sc {
  background: #1a1a2e;
  border-radius: 8px;
}
```

## Internationalization

**For complete i18n documentation, see I18N_GUIDE.md**

- English content: `src/content/skills/`, `src/pages/`
- Chinese content: `src/content/skills-zh/`, `src/pages/zh/`
- Language detection: URL-based (no browser Accept-Language)
- Translation utilities: `src/i18n/utils.ts`

When adding a new skill, create both English and Chinese versions with matching `name` field.

## Git Workflow

```bash
# Commit message format
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Style adjustments
refactor: Code refactoring

# Examples
git commit -m "feat: add postgres skill"
git commit -m "docs: update CONTRIBUTING guide"
git commit -m "fix: fix SkillCard component styling"
```

## Operational Boundaries

### ✅ Always Allowed

- Create/edit Markdown files under `src/content/`
- Edit Astro components under `src/components/`
- Edit styles in `src/styles/custom.css`
- Run `npm run dev` and `npm run build`
- Edit documentation files (README, CONTRIBUTING, etc.)

### ⚠️ Ask First

- Modify `astro.config.mjs` configuration
- Add new npm dependencies
- Modify `src/content.config.ts` content schema
- Delete existing files
- Modify `package.json`

### 🚫 Never Do

- Commit API keys, passwords, or other sensitive information
- Modify the `.git/` directory
- Delete `node_modules/` without reinstalling
- Directly modify the `dist/` directory
- Push code that fails to build without testing

## Common Tasks

### Adding a New Skill

**For complete guidance, see SKILL_DEVELOPMENT.md**

1. Create `skill-name.md` in `src/content/skills/` (English)
2. Create `skill-name.md` in `src/content/skills-zh/` (Chinese)
3. Both files must have matching `name` field in frontmatter
4. Add share image to `public/images/skills/share/skill-name-share.jpg` (1200×630px JPEG, 85% quality)
5. Run `npm run build` to verify

**Validation Checklist:**
- [ ] Frontmatter valid and complete
- [ ] File naming matches slug (kebab-case)
- [ ] Both English and Chinese versions present
- [ ] Share image exists with correct dimensions and format
- [ ] Build passes without errors
- [ ] No broken links in content

### Fixing Build Errors

```bash
# Clean and reinstall
rm -rf node_modules dist .astro
npm install
npm run build
```

### Checking Content Format

Ensure frontmatter is valid YAML. Required fields:
- `name` — Unique, kebab-case identifier
- `title` — Human-readable skill name
- `description` — 1-2 sentence summary
- `category` — One of 9 categories
- `githubUrl` — HTTPS link to GitHub
- `date` — Publication date (YYYY-MM-DD)

---

*This file follows the [AGENTS.md specification](https://agentsmd.io/) to provide project context for AI coding assistants.*
