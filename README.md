# Qoder Community

Global community platform for Qoder developers - share agents, learn together, build faster.

## Tech Stack

- **Framework**: [Astro](https://astro.build/) 5.6+
- **Theme**: [Starlight](https://starlight.astro.build/) 0.37+
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **Language**: TypeScript + Markdown/MDX

## Features

- Lightning-fast performance (Lighthouse 98-100)
- Quick builds (~4 seconds)
- Minimal JavaScript (~2.5KB)
- Built-in full-text search
- Dark mode support
- Fully responsive
- Global CDN via Cloudflare
- Free web analytics

## Project Structure

```
qoder-community/
├── src/
│   ├── content/                # All content collections (Markdown/MDX)
│   │   ├── skills/             # Agent skills (English, 50+)
│   │   ├── skills-zh/          # Agent skills (Chinese, translated)
│   │   ├── skillSources/       # External skill marketplace links
│   │   ├── agents/             # Community agent configurations
│   │   ├── videos/             # Video tutorials and reviews
│   │   ├── meetups/            # Global meetup events
│   │   ├── showcase/           # Community projects and case studies
│   │   └── docs/               # Documentation pages
│   ├── components/             # Reusable Astro components
│   │   ├── SkillCard.astro
│   │   ├── SkillFilter.astro   # Client-side filtering
│   │   ├── RoleSelector.astro  # Role-based recommendations
│   │   ├── AgentCard.astro
│   │   ├── VideoCard.astro
│   │   ├── MeetupCard.astro
│   │   ├── ShowcaseCard.astro
│   │   ├── SkillSourceCard.astro
│   │   └── Starlight overrides (Header, Footer, ThemeSelect, LanguageSwitcher)
│   ├── pages/                  # Route pages
│   │   ├── skills.astro        # Skills listing with filters
│   │   ├── skills/[slug].astro # Skill detail (English)
│   │   ├── agents.astro
│   │   ├── learn.astro
│   │   ├── meetups.astro
│   │   ├── showcase.astro
│   │   ├── skillSources.astro  # External skills marketplace
│   │   └── zh/                 # Chinese versions
│   │       ├── skills.astro    # Skills listing (Chinese)
│   │       └── skills/[slug].astro # Skill detail (Chinese, with share feature)
│   ├── i18n/                   # Internationalization system
│   │   ├── ui.ts              # UI strings (English + Chinese)
│   │   ├── utils.ts           # i18n helpers (lang detection, translation function)
│   │   ├── skills-translations.ts      # Per-skill translations
│   │   └── skillSources-translations.ts # Per-source translations
│   ├── utils/
│   │   └── share-image-generator.ts   # Canvas-based share image generation
│   ├── styles/
│   │   └── custom.css         # Theme variables, components, animations
│   ├── content.config.ts      # Content collection schemas (Zod)
│   └── astro.config.mjs       # Astro configuration with Starlight theme
├── public/
│   ├── images/                # Static images
│   │   ├── skills/share/      # Share images for skills (jpg/png)
│   │   ├── qoder-logo.png
│   │   └── qrcode-qoder.png
├── scripts/
│   └── capture-screenshots.js # Playwright-based screenshot capture
├── AGENTS.md                   # Project guidelines for AI agents
├── CONTRIBUTING.md             # Contribution guidelines (skill creation)
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

## Local Development

### Install Dependencies

```bash
npm install
```

### Start Dev Server

```bash
npm run dev
```

Visit: http://localhost:4321

### Bilingual Routing

The site supports English and Chinese (simplified). Routes are automatically handled:

- **English**: `/skills`, `/skills/[slug]`, `/agents`, etc.
- **Chinese**: `/zh/skills`, `/zh/skills/[slug]`, `/zh/agents`, etc.

The system uses:
- Language detection in `src/i18n/utils.ts` (`getLangFromPath`, `getLangFromUrl`)
- Translation strings in `src/i18n/ui.ts` (UI labels and buttons)
- Per-skill translations in `src/i18n/skills-translations.ts`
- Content fallback: Chinese pages fall back to English content if translated versions don't exist

### Skill Content System

Skills are stored as Markdown files with standardized frontmatter:

```
src/content/skills/my-skill.md (English)
src/content/skills-zh/my-skill.md (Chinese, optional)
```

Frontmatter fields: `title`, `description`, `category`, `author`, `githubUrl`, `roles`, `date`, etc.

For complete schema and content validation rules, see [CONTRIBUTING.md](CONTRIBUTING.md).

### Key Architectural Patterns

### Build for Production

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

## How to Contribute

We currently welcome contributions for **Agent Skills**. Help the community by sharing your specialized skills!

For detailed instructions on how to add and format your skills, please refer to our **[Contributing Guide](CONTRIBUTING.md)**.

## Deployment

### Deploy to Cloudflare Pages

See `DEPLOYMENT.md` for detailed instructions.

Quick steps:

```bash
# 1. Push to GitHub
git add .
git commit -m "Update content"
git push

# 2. Cloudflare Pages auto-deploys (1-2 minutes)
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing agent configurations.

## Links

- **Live Site**: https://qoder-community.pages.dev
- **GitHub**: https://github.com/Qoder-AI/qoder-community
- **Astro Docs**: https://docs.astro.build/
- **Starlight Guide**: https://starlight.astro.build/

## Troubleshooting

### Build Errors

```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Content Not Showing

Check frontmatter format is correct.

### Search Not Working

Check Pagefind output in build logs.

---

Powered by Astro and Starlight  
Hosted on Cloudflare Pages
