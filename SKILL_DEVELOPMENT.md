# Skill Development Workflow

This guide documents how to create, validate, and contribute agent skills to the Qoder Community platform.

## Overview

Agent Skills are reusable AI prompts, configurations, and workflows that enhance AI agent capabilities. This platform provides a community repository for sharing skills across the Qoder ecosystem (IDE, CLI, Jetbrains plugin).

## Skill Anatomy

### Directory Structure

```
qoder-community/
├── src/content/
│   ├── skills/              # English skill documentation
│   │   ├── postgres.md
│   │   ├── mcp-builder.md
│   │   └── ... (50+ skills)
│   └── skills-zh/           # Chinese skill documentation
│       ├── postgres.md
│       ├── mcp-builder.md
│       └── ... (50+ skills, translated)
└── public/images/skills/share/
    ├── postgres-share.jpg
    ├── mcp-builder-share.jpg
    └── default-{category}.jpg
```

### Frontmatter Schema

Every skill file starts with YAML frontmatter defining metadata:

```markdown
---
# Basic identification
name: skill-name                    # Machine-readable name (kebab-case)
title: Skill Title                  # Human-readable title
description: One-sentence summary   # SEO description (1-2 sentences)

# Source and authorship
source: community                   # Source type: anthropic | vercel | community | enterprise
author: Your Name                   # Author name (optional for official sources)

# Links and documentation
githubUrl: https://github.com/...   # Required: GitHub repository or documentation
docsUrl: https://example.com/docs   # Optional: Additional documentation link
marketplaceUrl: https://...         # Optional: Marketplace/installation link

# Categorization
category: development               # See category list below
tags:                               # Optional: Additional tags
  - tag1
  - tag2

# Target audience (optional)
roles:                              # Optional: Who should use this skill
  - developer
  - marketer
  - designer

# Display properties
featured: false                     # Should appear in "featured" section
popular: false                      # High usage indicator
isOfficial: true                    # Official Qoder skill

# Installation
installCommand: |                  # Optional: How to install/use
  git clone https://github.com/.../skill
  cp -r skill ~/.qoder/skills/

# Metadata
date: 2026-01-15                    # Publication date (YYYY-MM-DD)
lastUpdated: 2026-04-24             # Optional: Last modified date
---

# Skill Content

Your skill documentation in Markdown...
```

## Category Taxonomy

Choose ONE primary category for each skill:

| Category | Use Case | Example |
|----------|----------|---------|
| `development` | Programming, coding skills | Postgres, Python utilities, Git workflows |
| `design` | Visual design, UX/UI | Canvas design, theme factory, frontend design |
| `marketing` | Content, campaigns, growth | Copywriting, paid ads, launch strategy |
| `productivity` | Tools, workflows, efficiency | Notion skills, Things3 integration, task management |
| `automation` | Workflow automation, integration | n8n patterns, Varlock, dispatching agents |
| `data` | Data processing, analysis | Data transformation, SQL queries, analytics |
| `security` | Security, compliance, auditing | Security blueprint, static analysis, root cause tracing |
| `document` | Document processing | PDF, DOCX, PPTX, XLSX handling |
| `meta` | Meta-skills, skill creation itself | Skill creator, skill template |

**Selection Guide:**
- Choose the most direct category
- If skill spans multiple categories, pick the most common use case
- Avoid forcing fit into less appropriate categories

## Frontmatter Validation

### Required Fields

These fields must be present and non-empty:

```yaml
name:          # string, kebab-case, unique per language
title:         # string, 2-100 characters
description:   # string, 1-2 sentences, 20-160 characters
category:      # one of the 9 categories
githubUrl:     # valid URL, must start with https://
date:          # YYYY-MM-DD format
```

### Optional Fields

```yaml
source:        # Defaults to 'community' if omitted
author:        # Omit for official Anthropic/Vercel skills
docsUrl:       # Include if docs differ from GitHub
marketplaceUrl: # Include if available on marketplace
tags:          # 0-5 tags, auto-lowercase
roles:         # Target audience
featured:      # Defaults to false
popular:       # Defaults to false
isOfficial:    # Defaults to false
installCommand: # Multi-line installation instructions
lastUpdated:   # Optional, if different from date
```

## Content Guidelines

### Title

- **Length:** 2-40 characters
- **Style:** Title Case
- **Clarity:** Single, focused concept
- **Examples:** ✅ "Postgres", "MCP Builder", "Theme Factory"
- **Avoid:** ❌ "The Postgres Skill", "Advanced MCP Builder", "Theme Factory Deluxe"

### Description

- **Length:** 1-2 sentences, 20-160 characters
- **Audience:** Non-technical reader
- **Content:** What problem does it solve?
- **Examples:**
  - ✅ "Database management and query optimization skill"
  - ✅ "Create reusable AI tool integrations with Model Context Protocol"
  - ❌ "This skill is about database management" (unnecessary "this skill")
  - ❌ "Advanced configuration of Model Context Protocol for enterprise deployments" (too long)

### Body Content

- **Format:** Markdown
- **Sections:** Use H2 headings (`##`) for main sections
- **Structure:**
  - What problem does it solve?
  - When to use this skill?
  - Key features or benefits
  - Example usage or workflow
  - Best practices
  - Related skills or resources

**Markdown Example:**

```markdown
# PostgreSQL Database Management

## Overview

Streamline database operations with AI-assisted SQL generation and optimization.

## When to Use

- Database design and schema creation
- Complex query optimization
- Performance analysis and tuning
- Migration planning

## Features

- Query generation from natural language
- Index recommendations
- Performance profiling
- Schema analysis

## Example

Ask Qoder:
> "Create a table for user preferences with optimized indexes"

Result: AI generates schema with best practices built-in.

## Best Practices

- Always test migrations in staging first
- Review generated queries before execution
- Use EXPLAIN ANALYZE to validate optimization
```

## File Naming Conventions

### Skill File Names

**Format:** `{slug}.md`

**Rules:**
- Use kebab-case (lowercase, hyphens)
- Match the `name` field in frontmatter exactly
- Filename = slug used in URLs
- Examples:
  - ✅ `postgres.md` → URL: `/skills/postgres/`
  - ✅ `mcp-builder.md` → URL: `/skills/mcp-builder/`
  - ✅ `web-artifacts-builder.md` → URL: `/skills/web-artifacts-builder/`
  - ❌ `Postgres.md` (capitalization)
  - ❌ `postgres_skill.md` (underscores, extra text)
  - ❌ `MCP Builder.md` (spaces)

### Share Image Names

**Format:** `{slug}-share.jpg`

**Rules:**
- Must match skill slug exactly
- Must be JPEG format
- Dimensions: 1200×630px (16:9 ratio)
- Quality: 85% compression
- Examples:
  - `postgres-share.jpg` → For skill `postgres.md`
  - `mcp-builder-share.jpg` → For skill `mcp-builder.md`

**See Also:** ASSET_MANAGEMENT.md for full image specifications

## Bilingual Skills (English + Chinese)

### Adding Both Versions

When contributing a skill, create BOTH English and Chinese versions:

**Step 1: Create English File**

File: `src/content/skills/postgres.md`

```markdown
---
name: postgres
title: PostgreSQL
description: Database management and query optimization
category: development
author: Jane Doe
githubUrl: https://github.com/qoder/skill-postgres
date: 2026-04-24
---

# PostgreSQL Skill

English content here...
```

**Step 2: Create Chinese File**

File: `src/content/skills-zh/postgres.md`

```markdown
---
name: postgres
title: PostgreSQL
description: 数据库管理和查询优化
category: development
author: Jane Doe
githubUrl: https://github.com/qoder/skill-postgres
date: 2026-04-24
---

# PostgreSQL 技能

中文内容在这里...
```

**Important Requirements:**

| Field | Requirement |
|-------|-------------|
| `name` | **MUST be identical** (e.g., both "postgres") |
| `title` | Can translate, but often kept English for consistency |
| `description` | **MUST translate** (1-2 sentences, same meaning) |
| Body content | **MUST translate** (all Markdown, same structure) |
| `date` | Should be identical (publication date) |
| `githubUrl`, `author` | Should be identical |
| `category` | Must be same category |

### Translation Best Practices

- **Translate meaning, not words** — Adapt for cultural context
- **Keep consistent terminology** — Same English terms for Qoder features
- **Test both URLs** — Verify `/skills/slug/` and `/zh/skills/slug/` both work
- **Date consistency** — Both versions published same day
- **Slug neutrality** — Use English slugs for simplicity (e.g., `mcp-builder` works in both)

## Skill Validation Checklist

Before committing and pushing, verify:

### Frontmatter

- [ ] `name` is unique in English collection
- [ ] `name` matches filename (kebab-case)
- [ ] `title` is 2-40 characters
- [ ] `description` is 20-160 characters (1-2 sentences)
- [ ] `category` is from the 9-category list
- [ ] `githubUrl` is valid HTTPS URL
- [ ] `date` is valid YYYY-MM-DD format
- [ ] All required fields present

### Content

- [ ] Body text is in Markdown format
- [ ] Headings use H2 (`##`) for main sections
- [ ] No broken links
- [ ] Code examples are valid and tested
- [ ] Grammar and spelling checked
- [ ] Length is reasonable (200-1000 words)

### Bilingual

- [ ] Chinese version exists at `src/content/skills-zh/{name}.md`
- [ ] Chinese `name` field identical to English
- [ ] Chinese content translates meaning (not literal)
- [ ] Both versions have same date
- [ ] Both URLs work: `/skills/slug/` and `/zh/skills/slug/`

### Images

- [ ] Share image exists: `public/images/skills/share/{slug}-share.jpg`
- [ ] Image is 1200×630px (16:9 ratio)
- [ ] Image is JPEG format, 85% quality
- [ ] Filename matches slug exactly

### Git

- [ ] Files added to correct directories
- [ ] No unrelated changes included
- [ ] Commit message follows format: `feat: add {skill-name} skill`
- [ ] All changes committed (not staging partial changes)

## Common Mistakes & Fixes

### ❌ Wrong Frontmatter Format

```yaml
# WRONG: Missing quotes, wrong format
name: skill name
title: My Awesome Skill!
description:
  - "First point"
  - "Second point"
```

**Fix:** Use valid YAML syntax

```yaml
# CORRECT
name: skill-name
title: My Awesome Skill
description: "First point. Second point."
```

### ❌ URL Slug Doesn't Match Filename

```
Filename: src/content/skills/PostgreSQL_Skill.md
URL Slug: /skills/postgres/
```

**Fix:** Filename must exactly match the `name` field

```
Filename: src/content/skills/postgres.md
name field: postgres
URL Slug: /skills/postgres/ ✅
```

### ❌ Missing Category

```yaml
# WRONG: Category missing
title: PostgreSQL Skill
description: Database management
# ...
```

**Fix:** Include required category

```yaml
# CORRECT
title: PostgreSQL Skill
description: Database management
category: development  # Added
```

### ❌ Image Format Wrong

```
Image: public/images/skills/share/postgres-share.png
Problem: Should be .jpg, not .png
Size: 2000×2000px
Problem: Should be 1200×630px (16:9)
```

**Fix:** Convert to JPEG and resize

```bash
# Convert PNG to JPEG, resize to 1200×630px
convert postgres-share.png -resize 1200x630 -quality 85 postgres-share.jpg
```

### ❌ GitHub URL is HTTP, Not HTTPS

```yaml
# WRONG
githubUrl: http://github.com/user/repo

# CORRECT
githubUrl: https://github.com/user/repo
```

### ❌ Chinese Version Missing or Out of Sync

```
English: src/content/skills/postgres.md (date: 2026-04-24, name: postgres)
Chinese: Missing or different name

Problem: Build will fail or serve English on /zh/ routes
```

**Fix:** Create matching Chinese file with same `name` field

```
src/content/skills/postgres.md (English, name: postgres, date: 2026-04-24)
src/content/skills-zh/postgres.md (Chinese, name: postgres, date: 2026-04-24)
```

### ❌ Description Too Long or Vague

```yaml
# WRONG: Too long
description: "This is a comprehensive skill for managing PostgreSQL databases including query optimization, performance tuning, schema design, and advanced administrative tasks."

# WRONG: Too vague
description: "Database stuff"

# CORRECT
description: "Database management and query optimization"
```

## Contributing Workflow

### 1. Set Up Local Environment

```bash
# Clone repository
git clone https://github.com/Qoder-AI/qoder-community.git
cd qoder-community

# Install dependencies
npm install

# Start dev server
npm run dev

# Visit http://localhost:4321
```

### 2. Create Skill Files

```bash
# Create English skill
touch src/content/skills/my-skill.md

# Create Chinese skill
touch src/content/skills-zh/my-skill.md

# Create share image (or use default)
cp template-share.jpg public/images/skills/share/my-skill-share.jpg
```

### 3. Write Content

Edit both `src/content/skills/my-skill.md` and `src/content/skills-zh/my-skill.md` with:
- Frontmatter metadata
- Markdown body content

### 4. Test Locally

```bash
# Build to check for errors
npm run build

# Check TypeScript
npx astro check

# Preview build result
npm run preview

# Visit http://localhost:3000/skills/my-skill/
# Visit http://localhost:3000/zh/skills/my-skill/
```

### 5. Verify Against Checklist

Run through validation checklist above.

### 6. Commit and Push

```bash
# Stage files
git add src/content/skills/my-skill.md
git add src/content/skills-zh/my-skill.md
git add public/images/skills/share/my-skill-share.jpg

# Commit with descriptive message
git commit -m "feat: add my-skill to community"

# Push to your fork
git push origin feature/add-my-skill
```

### 7. Create Pull Request

Submit PR with description:
- What does the skill do?
- Who should use it?
- Any related skills or dependencies?

## Schema Reference

For detailed schema information, see `src/content.config.ts`:

```typescript
const skillsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    source: z.enum(['anthropic', 'vercel', 'community', 'enterprise']),
    author: z.string().optional(),
    githubUrl: z.string().url(),
    docsUrl: z.string().url().optional(),
    marketplaceUrl: z.string().url().optional(),
    category: z.enum([
      'document', 'development', 'design', 'automation',
      'marketing', 'data', 'security', 'productivity', 'meta'
    ]),
    tags: z.array(z.string()).optional(),
    roles: z.array(z.enum([...11 role options...])).optional(),
    featured: z.boolean().default(false),
    popular: z.boolean().default(false),
    isOfficial: z.boolean().default(false),
    installCommand: z.string().optional(),
    date: z.coerce.date(),
    lastUpdated: z.coerce.date().optional(),
  }),
});
```

## Related Documentation

- **CONTRIBUTING.md** — General contribution guidelines
- **AGENTS.md** — Project overview and standards
- **ASSET_MANAGEMENT.md** — Share image specifications
- **I18N_GUIDE.md** — Bilingual content patterns
- **src/content.config.ts** — Schema definitions
- **src/i18n/skills-translations.ts** — Skill slug mapping

## Need Help?

- GitHub Issues: Report problems or ask questions
- Discussion Forum: Connect with other contributors
- Discord Community: Real-time chat and support
- Email: support@qoder.com
