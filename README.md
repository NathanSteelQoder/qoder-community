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
│   ├── content/
│   │   ├── skills/        # Agent skills (English)
│   │   ├── skills-zh/     # Agent skills (Chinese)
│   │   ├── agents/        # Community agent configurations
│   │   ├── videos/        # Tutorial videos
│   │   ├── meetups/       # Global meetup events
│   │   ├── showcase/      # Community projects
│   │   └── docs/          # Site pages
│   ├── components/
│   │   ├── AgentCard.astro
│   │   ├── VideoCard.astro
│   │   └── MeetupCard.astro
│   ├── pages/
│   │   ├── agents.astro
│   │   ├── learn.astro
│   │   ├── meetups.astro
│   │   └── showcase.astro
│   └── styles/
│       └── custom.css
├── public/
├── astro.config.mjs
└── package.json
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

**Having issues?** See [BUILD_SETUP.md](BUILD_SETUP.md) for detailed setup instructions and troubleshooting.

### Build for Production

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

For more details, see [BUILD_SETUP.md](BUILD_SETUP.md).

## How to Contribute

We currently welcome contributions for **Agent Skills**. Help the community by sharing your specialized skills!

For detailed instructions on how to add and format your skills, please refer to our **[Contributing Guide](CONTRIBUTING.md)**.

## Documentation

- **[BUILD_SETUP.md](BUILD_SETUP.md)** - Local development setup and troubleshooting
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Quick solutions for common issues
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to add Agent Skills and improve docs
- **[AGENTS.md](AGENTS.md)** - Project context and guidelines for AI assistants
- **[README.md](README.md)** - This file

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
