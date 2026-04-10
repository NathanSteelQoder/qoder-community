# Qoder Community - Development Workflows

Step-by-step guides for common development tasks and workflows.

## Table of Contents

1. [Setting Up Development Environment](#setting-up-development-environment)
2. [Adding a New Skill](#adding-a-new-skill)
3. [Managing Translations](#managing-translations)
4. [Creating Components](#creating-components)
5. [Working with Content Collections](#working-with-content-collections)
6. [Testing & Quality](#testing--quality)
7. [Git Workflow](#git-workflow)

---

## Setting Up Development Environment

### One-Time Setup

```bash
# Clone repository
git clone https://github.com/Qoder-AI/qoder-community.git
cd qoder-community

# Install Node.js 18+ (if not installed)
# macOS with Homebrew:
brew install node

# Windows/Linux: https://nodejs.org/

# Verify Node installation
node --version  # Should be v18+
npm --version   # Should be 9+

# Install project dependencies
npm install

# Verify setup
npm run build
npm run preview  # Should serve at http://localhost:3000
```

### Daily Development

```bash
# Start dev server
npm run dev

# In another terminal, watch for errors
npm run astro check --watch

# Or run TypeScript checker (standalone)
npm run astro check
```

### VSCode Setup (Recommended)

Install extensions:
- Astro (official Astro extension)
- Markdown Language Features
- Code Spell Checker
- ESLint (if using)

Settings (`.vscode/settings.json`):

```json
{
  "astro.enable-all-experiments": true,
  "[astro]": {
    "editor.defaultFormatter": "astro-build.astro-vscode",
    "editor.formatOnSave": true
  },
  "[markdown]": {
    "editor.wordWrap": "on"
  },
  "editor.formatOnSave": true
}
```

---

## Adding a New Skill

### Complete Workflow

#### 1. Prepare Skill Content

Gather information:
- **Name**: Unique identifier (kebab-case, e.g., `prompt-engineering`)
- **Title**: Display name (e.g., "Prompt Engineering")
- **Description**: 1-2 sentences summarizing the skill
- **Category**: One of: development, design, marketing, productivity, automation, data, security, document, meta
- **GitHub URL**: Link to GitHub repository
- **Author**: Optional creator name
- **Roles**: Who this is for (developer, marketer, designer, PM, etc)

#### 2. Create English Markdown

File: `src/content/skills/{name}.md`

```markdown
---
name: prompt-engineering
title: Prompt Engineering
description: Master the art of writing effective prompts to get better results from AI models
category: development
author: Jane Doe
githubUrl: https://github.com/example/prompt-engineering-skill
docsUrl: https://example.com/docs
date: 2026-04-03
roles:
  - developer
  - marketer
  - content
tags:
  - prompting
  - ai
  - llm
featured: false
popular: false
isOfficial: false
installCommand: |
  git clone https://github.com/example/prompt-engineering-skill
  cp -r prompt-engineering ~/.qoder/skills/
lastUpdated: 2026-04-03
---

## Getting Started

This skill helps you write better prompts for Qoder...

### Key Concepts

- Clarity and specificity
- Context provision
- Output format specification

### Example Prompt

\`\`\`
Write a blog post about [topic] in the style of [author].
Include:
- Introduction
- 3 main points
- Conclusion
\`\`\`

### Tips & Best Practices

1. Be specific about the task
2. Provide context or examples
3. Specify output format
4. Test and iterate

## Use Cases

- Improving AI output quality
- Automating content generation
- Code generation and review
```

**Markdown Guidelines**:
- Use clear headings (## for sections)
- Include practical examples
- Keep sentences short and clear
- Use lists for multiple items
- Avoid repetition

#### 3. Create Chinese Markdown

File: `src/content/skills-zh/{name}.md`

```markdown
---
name: prompt-engineering
title: 提示词工程
description: 掌握编写有效提示词的艺术，从 AI 模型获得更好的结果
category: development
author: Jane Doe
githubUrl: https://github.com/example/prompt-engineering-skill
docsUrl: https://example.com/docs
date: 2026-04-03
roles:
  - developer
  - marketer
  - content
tags:
  - 提示
  - AI
  - LLM
featured: false
popular: false
isOfficial: false
installCommand: |
  git clone https://github.com/example/prompt-engineering-skill
  cp -r prompt-engineering ~/.qoder/skills/
lastUpdated: 2026-04-03
---

## 入门指南

这个技能帮助你为 Qoder 编写更好的提示词...

### 核心概念

- 清晰和具体性
- 提供上下文
- 指定输出格式

### 示例提示词

\`\`\`
为 [主题] 撰写一篇博客，风格参考 [作者]。
包含内容：
- 介绍
- 3 个主要观点
- 结论
\`\`\`

### 技巧与最佳实践

1. 明确描述任务
2. 提供上下文或示例
3. 指定输出格式
4. 测试并迭代

## 使用场景

- 提高 AI 输出质量
- 自动生成内容
- 代码生成和审查
```

**Important**: 
- Keep structure parallel to English version
- Translate titles, descriptions accurately
- Use Chinese-specific examples if relevant

#### 4. Create Share Image (Optional)

File: `public/images/skills/share/{name}-share.jpg`

Dimensions: 1200x630px (16:9 for Twitter/LinkedIn) or 900x1200px (3:4 for Xiaohongshu)

Or rely on category defaults:
- `public/images/skills/share/default-development.jpg`
- etc.

#### 5. Test Locally

```bash
# Build project
npm run build

# Should complete without errors
# ✓ Done in Xs

# Preview
npm run preview

# Visit http://localhost:3000/skills/prompt-engineering/
# Verify:
# - Content loads
# - Links work
# - Images display
# - Both English and Chinese versions work (/zh/skills/prompt-engineering/)
```

#### 6. Commit & Push

```bash
# Stage files
git add src/content/skills/prompt-engineering.md
git add src/content/skills-zh/prompt-engineering.md
# (Optional) git add public/images/skills/share/prompt-engineering-share.jpg

# Commit with descriptive message
git commit -m "feat: add prompt-engineering skill

- Comprehensive guide to writing effective prompts
- Includes examples and best practices
- Available in English and Chinese"

# Push to repository
git push origin main
# (Or create PR if on feature branch)

# Cloudflare auto-deploys
# Check https://qoder-community.pages.dev/skills/prompt-engineering/
```

---

## Managing Translations

### Adding UI Translations

For new buttons, labels, or navigation strings:

#### 1. Add to `src/i18n/ui.ts`

```typescript
export const ui = {
  'en-US': {
    // ... existing keys ...
    'newfeature.title': 'New Feature',
    'newfeature.description': 'This is a new feature',
  },
  'zh-CN': {
    // ... existing keys ...
    'newfeature.title': '新功能',
    'newfeature.description': '这是一个新功能',
  },
};
```

#### 2. Use in Component

```astro
---
import { useTranslations } from '../i18n';

const lang = getLangFromPath(Astro.url.pathname);
const t = useTranslations(lang);
---

<div>
  <h3>{t('newfeature.title')}</h3>
  <p>{t('newfeature.description')}</p>
</div>
```

### Adding Skill Translations

When skill title/description needs custom Chinese translation:

#### 1. Update `src/i18n/skills-translations.ts`

```typescript
export const skillsTranslations: Record<string, SkillTranslation> = {
  // ... existing skills ...
  'prompt-engineering': {
    title: {
      'zh-CN': '提示词工程',
    },
    description: {
      'zh-CN': '掌握编写有效提示词的艺术，从 AI 模型获得更好的结果',
    },
  },
};
```

#### 2. Use in Component

```astro
---
import { getSkillTitle, getSkillDescription } from '../i18n';

const displayTitle = getSkillTitle(slug, data.title, lang);
const displayDesc = getSkillDescription(slug, data.description, lang);
---

<h2>{displayTitle}</h2>
<p>{displayDesc}</p>
```

### Category/Role Translations

Categories and roles auto-translate via `ui.ts`:

```typescript
// In ui.ts
export const ui = {
  'en-US': {
    'category.development': 'Development',
    'role.developer': 'Developer',
  },
  'zh-CN': {
    'category.development': '开发',
    'role.developer': '开发者',
  },
};

// In component
const label = getCategoryLabel('development', lang);  // Automatically translated
```

### Testing Translations

```bash
# Start dev server
npm run dev

# Navigate to English version
http://localhost:4321/skills/

# Switch to Chinese
http://localhost:4321/zh/skills/

# Verify:
# - All strings translated
# - No English text in Chinese version
# - Links use correct language prefix
```

---

## Creating Components

### Astro Component Template

File: `src/components/MyComponent.astro`

```astro
---
/**
 * MyComponent - Description of what this does
 * Props description here
 */
import { ui, defaultLang, useTranslations } from '../i18n';

interface Props {
  title: string;
  description?: string;
  lang?: keyof typeof ui;
}

const { title, description = '', lang = defaultLang } = Astro.props;
const t = useTranslations(lang);
---

<!-- HTML Template -->
<div class="my-component">
  <h3 class="my-component__title">{title}</h3>
  {description && <p class="my-component__desc">{description}</p>}
  <button class="my-component__btn">{t('common.submit')}</button>
</div>

<!-- Client-side Script (Optional) -->
<script>
  function initMyComponent() {
    const components = document.querySelectorAll('[data-my-component]');
    components.forEach(el => {
      // Add event listeners, initialization logic
    });
  }

  initMyComponent();
  // Re-initialize after Astro navigation
  document.addEventListener('astro:after-swap', initMyComponent);
</script>

<!-- Scoped Styles -->
<style>
  .my-component {
    padding: var(--space-4);
    background: var(--surface-elevated);
    border-radius: var(--radius-lg);
    border: 1px solid var(--structural-teal);
  }

  .my-component__title {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 var(--space-2);
  }

  .my-component__desc {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin: 0 0 var(--space-4);
  }

  .my-component__btn {
    padding: var(--space-2) var(--space-4);
    background: var(--qoder-brand-green);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .my-component__btn:hover {
    background: var(--qoder-brand-green-dark);
    transform: translateY(-2px);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .my-component {
      padding: var(--space-3);
    }
  }
</style>
```

### Component Best Practices

1. **Props Interface**: Define clear types
2. **Default Values**: Provide sensible defaults
3. **Semantic HTML**: Use proper elements
4. **CSS Variables**: No hardcoded colors/sizes
5. **Responsive Design**: Mobile-first or breakpoint-focused
6. **Accessibility**: ARIA labels, focus states, semantic buttons
7. **Comments**: Document non-obvious logic
8. **Naming**: BEM-like class naming (component__element--modifier)

### Using Components in Pages

```astro
---
import MyComponent from '../components/MyComponent.astro';
import { getLangFromPath } from '../i18n';

const lang = getLangFromPath(Astro.url.pathname);
---

<MyComponent 
  title="Example" 
  description="An example component"
  lang={lang}
/>
```

---

## Working with Content Collections

### Collection Structure

```
src/content/
├── skills/                 # English skills
├── skills-zh/             # Chinese skills
├── agents/                # Agent configs
├── videos/                # Video listings
├── meetups/               # Event listings
├── showcase/              # Project showcases
├── skillSources/          # External sources
└── docs/                  # Documentation pages
```

### Adding Content

**General pattern**:

1. Create markdown file in collection directory
2. Add frontmatter matching schema (required fields enforced)
3. Add markdown content
4. Run `npm run build` to validate
5. Push to deploy

### Querying Collections

In pages/components:

```astro
---
import { getCollection } from 'astro:content';

// Get all items (excluding templates starting with _)
const skills = await getCollection('skills', ({ id }) => !id.startsWith('_'));

// Get with sorting
const sortedSkills = skills.sort((a, b) => 
  b.data.date.getTime() - a.data.date.getTime()
);

// Get with filtering
const devSkills = skills.filter(s => s.data.category === 'development');

// Get specific item
const skill = skills.find(s => s.slug === 'my-skill');

// Get count
const count = skills.length;
---
```

### Markdown Best Practices

- Use markdown v2 syntax
- Keep lines under 80 characters for readability
- Use fenced code blocks with language identifier
- Use relative links for internal navigation: `[link](/skills/)`
- Use absolute paths for images: `/images/path/to/image.jpg`

### Content Validation

```bash
# Type check all content
npm run astro check

# Build to catch schema errors
npm run build

# Preview to visually verify
npm run preview
```

---

## Testing & Quality

### Manual Testing Checklist

Before committing new content:

```
Content:
  [ ] Required frontmatter fields present
  [ ] Frontmatter values match schema (categories, dates, URLs)
  [ ] Markdown renders without errors
  [ ] Links work (both internal and external)
  [ ] Images load correctly
  [ ] Bilingual content complete (EN + ZH)

Functionality:
  [ ] Build passes: npm run build
  [ ] Type check passes: npm run astro check
  [ ] Preview looks correct: npm run preview
  [ ] English version loads: http://localhost:3000/skills/
  [ ] Chinese version loads: http://localhost:3000/zh/skills/
  [ ] Filters work (category, role)
  [ ] Mobile responsive (test at 768px width)

Performance:
  [ ] Page loads in <2 seconds
  [ ] Images optimized and compressed
  [ ] No console errors (F12 DevTools)
```

### Automated Checks

```bash
# Type checking
npm run astro check

# Build test
npm run build

# All-in-one
npm run build && npm run preview
```

### Common Testing Scenarios

**Test 1: Add a skill and verify it appears**

```bash
npm run dev
# Create src/content/skills/test-skill.md
# Wait for hot reload
# Navigate to /skills/test-skill/ → Should load
```

**Test 2: Verify translations**

```bash
# Navigate to /skills/ and /zh/skills/
# Verify all text is in correct language
# Check category labels translate
```

**Test 3: Test filters**

```bash
# On /skills/ page
# Click category pill → Cards should filter
# URL should update to ?category=development
```

---

## Git Workflow

### Commit Message Convention

```
type(scope): short description

Longer description explaining what and why.
Can be multiple paragraphs.

Fixes #123
```

**Types**: feat, fix, docs, style, refactor, perf, test, chore

**Examples**:

```
feat(skills): add prompt-engineering skill
- Comprehensive guide to writing effective prompts
- Includes examples and best practices
- Available in English and Chinese

fix(components): correct SkillCard hover effect
- Fix z-index issue causing overflow
- Adjust shadow depth for better visibility

docs(deployment): add Cloudflare Pages guide
- Explain build process
- Add troubleshooting section

refactor(i18n): consolidate translation utilities
- Combine duplicate functions
- Simplify language detection
```

### Branch Naming

```
feature/add-new-section
fix/skill-card-styling
docs/deployment-guide
refactor/i18n-system
```

### Pull Request Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-skill

# 2. Make changes
# Add/edit files

# 3. Commit changes
git add .
git commit -m "feat(skills): add new skill"

# 4. Push to remote
git push -u origin feature/new-skill

# 5. Create PR on GitHub
# (GitHub will show link in terminal)

# 6. Request review
# (Tag maintainers in PR description)

# 7. Address feedback
# Make changes, commit, push again

# 8. Merge when approved
# (Use "Squash and merge" for clean history)
```

### Staying in Sync

```bash
# Fetch latest from main
git fetch origin

# Update your branch
git rebase origin/main

# Or merge (creates merge commit)
git merge origin/main

# Resolve conflicts if needed
git status
# Edit conflicted files
git add .
git commit -m "resolve merge conflicts"
```

### Reverting Changes

```bash
# Revert last commit (keep changes)
git reset --soft HEAD~1

# Revert last commit (discard changes)
git reset --hard HEAD~1

# Revert specific commit (create new commit)
git revert <commit-hash>

# Check reflog if accidentally deleted
git reflog
git checkout <lost-commit>
```

---

## IDE Tips & Tricks

### VSCode Shortcuts

- `Cmd+P` / `Ctrl+P`: Quick file open
- `Cmd+Shift+F` / `Ctrl+Shift+F`: Find across project
- `Cmd+/` / `Ctrl+/`: Toggle comment
- `Alt+Up/Down` / `Alt+Up/Down`: Move line up/down
- `Cmd+D` / `Ctrl+D`: Multi-cursor select

### Useful VSCode Extensions

- Astro official extension
- Markdown All in One
- Better Comments
- Code Spell Checker
- GitLens

### Debugging

```bash
# Debug in Chrome
npm run dev

# Open DevTools (F12)
# - Console: check for errors
# - Network: verify image/asset loading
# - Performance: profile if slow
```

---

## Helpful Commands Reference

```bash
# Daily
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Check code quality
npm run astro check      # TypeScript validation

# Git operations
git status               # Check changes
git add .               # Stage all changes
git commit -m "message" # Commit
git push                # Push to remote
git log --oneline       # See commit history

# Clean up
rm -rf node_modules     # Remove dependencies
rm -rf .astro dist      # Remove cache/build
npm install             # Reinstall everything
npm run build            # Fresh build
```
