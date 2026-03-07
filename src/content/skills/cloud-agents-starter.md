---
name: cloud-agents-starter
title: Cloud Agents Starter
description: Minimal runbook for Cloud agents—setup, run, test, and verify the Qoder Community codebase with practical workflows by area
source: community
author: Qoder Community
githubUrl: https://github.com/Qoder-AI/qoder-community
category: meta
tags:
  - cloud-agents
  - runbook
  - testing
  - setup
roles:
  - developer
  - devops
featured: false
popular: false
isOfficial: false
date: 2026-03-07
---

## Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:4321. No login or credentials required—this is a static Astro/Starlight site.

## Environment & Workflow

- **No `.env` required** — Site runs without env vars. `.env` files are gitignored.
- **Feature flags** — Content visibility is controlled by frontmatter (e.g. `featured: true`). Edit `src/content/skills/*.md` or other content files to change display behavior.
- **Clean rebuild** — If builds fail: `rm -rf node_modules dist .astro && npm install && npm run build`

## Testing Workflows by Codebase Area

### Content (`src/content/`)

| Area | Path | Test workflow |
|------|------|---------------|
| Skills (EN) | `src/content/skills/` | Add/edit `.md`, run `npm run build`. Verify at `/skills/` and `/skills/[slug]`. |
| Skills (ZH) | `src/content/skills-zh/` | Add/edit `.md`, add entry to `src/i18n/skills-translations.ts`. Verify at `/zh/skills/`. |
| Agents | `src/content/agents/` | Edit `.md`, verify at `/agents/`. |
| Videos | `src/content/videos/` | Edit `.md`, verify at `/learn/`. |
| Meetups | `src/content/meetups/` | Edit `.md`, verify at `/meetups/`. |
| Showcase | `src/content/showcase/` | Edit `.md`, verify at `/showcase/`. |
| Docs | `src/content/docs/` | Edit `.md`, verify at `/docs/`. |

**Content validation**: Ensure frontmatter matches `src/content.config.ts` schema. Run `npx astro check` for type errors.

### Components & Pages

| Area | Path | Test workflow |
|------|------|---------------|
| Components | `src/components/` | Edit `.astro`, run `npm run dev`, hit pages that use the component. |
| Pages | `src/pages/` | Edit `.astro`, run `npm run dev`, navigate to the route. |
| Styles | `src/styles/custom.css` | Edit CSS, refresh dev server. |

### Build & Type Check

```bash
npm run build          # Full production build
npx astro check        # TypeScript + Astro validation
npm run preview        # Preview built site locally
```

### Screenshots (Playwright)

```bash
npm run capture
```

Captures screenshots of HTML files in `public/demos/` to `public/screenshots/`. Requires Playwright (`npm install` includes it).

## Mocking Featured / Display Flags

To surface content in featured sections, set in frontmatter:

```yaml
featured: true
```

Used by: skills, agents, videos, showcase. Skills sort featured first on `/skills/` and `/zh/skills/`.

## Updating This Skill

When you discover new testing tricks, runbook steps, or environment notes:

1. Edit `src/content/skills/cloud-agents-starter.md` (this file).
2. Edit `src/content/skills-zh/cloud-agents-starter.md` for the Chinese version.
3. Add or update the entry in `src/i18n/skills-translations.ts` if the skill name/title/description changed.
4. Run `npm run build` to verify.
5. Commit with a message like `docs: update cloud-agents-starter runbook`.

Keep the skill minimal: focus on commands, paths, and concrete workflows. Avoid long prose.
