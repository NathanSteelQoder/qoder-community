# Contributing to Qoder Community

[English](#english) | [简体中文](#简体中文)

<a name="english"></a>
# Contributing to Qoder Community (English)

Thank you for your interest in contributing to the Qoder Community! This guide will help you get started.

## Ways to Contribute

We currently welcome contributions for **Agent Skills**. Help the community by sharing your specialized skills to enhance AI agents!

### 1. Share Your Agent Skills

#### Step 1: Fork the Repository
1. Click "Fork" at https://github.com/Qoder-AI/qoder-community
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/qoder-community.git`
3. Create a branch: `git checkout -b feat/add-my-skill`

#### Step 2: Create Your Skill File

Create a file with the skill name in kebab-case:

**For English skill:**
- Path: `src/content/skills/my-awesome-skill.md`
- Use the template below, replacing placeholders

**For Chinese skill:**
- Path: `src/content/skills-zh/my-awesome-skill.md`
- Translate frontmatter fields and content

**Bilingual Skills:** Add both English and Chinese versions with the same filename

#### Step 3: Use the Template

Copy this frontmatter and adapt for your skill:

````markdown
---
name: my-awesome-skill
title: My Awesome Skill
description: One or two sentences explaining what this skill does and why developers should use it
source: community
author: Your Name
githubUrl: https://github.com/your-username/my-awesome-skill
docsUrl: https://docs.example.com/my-skill
category: development # One of: development | design | marketing | productivity | automation | data | security | document | meta
tags:
  - python
  - automation
roles:
  - developer
  - devops
featured: false
popular: false
isOfficial: false
installCommand: |
  git clone https://github.com/your-username/my-awesome-skill
  cp -r my-awesome-skill ~/.qoder/skills/
date: 2026-05-22
---

# My Awesome Skill

## What It Does

A clear explanation of the skill's purpose and capabilities.

## Use Cases

- **Scenario 1**: Description of first use case
- **Scenario 2**: Description of second use case
- **Scenario 3**: Description of third use case

## How to Use

Step-by-step instructions on how to use this skill:

1. First step
2. Second step
3. Third step

## Example

\`\`\`bash
# Example command showing how to use the skill
qoder my-awesome-skill --option value
\`\`\`

Expected output:
\`\`\`
Output description here
\`\`\`

## Configuration

Optional configuration or parameters:

- `--param1`: Description of parameter
- `--param2`: Description of parameter

## Troubleshooting

### Common issue 1
Solution here

### Common issue 2
Solution here

## Learn More

- [Full Documentation](https://docs.example.com)
- [Repository](https://github.com/your-username/my-awesome-skill)
- [Examples](https://github.com/your-username/my-awesome-skill/tree/main/examples)
````

#### Step 4: Test Locally

Before submitting, verify your skill displays correctly:

```bash
# Install dependencies (if not done yet)
npm install

# Start dev server
npm run dev

# Visit http://localhost:4321/skills/
# Search for your skill or scroll to find it
# Click to view the detail page
```

#### Step 5: Validate

Check that your skill file is valid:

```bash
# Verify TypeScript and schema validation
npx astro check

# Should show no errors for your new file
```

#### Step 6: Build Test

Test a production build to ensure everything works:

```bash
npm run build
npm run preview
# Visit http://localhost:3000/skills/
# Verify your skill appears
```

#### Step 7: Submit Pull Request

```bash
# Stage your changes
git add src/content/skills/my-awesome-skill.md

# Commit with a clear message
git commit -m "feat: add my-awesome-skill"

# Push to your fork
git push origin feat/add-my-skill

# Create PR on GitHub
# Visit https://github.com/Qoder-AI/qoder-community/pulls
# Click "New Pull Request"
```

**In PR description, include:**
- Brief description of the skill
- Why this skill is useful
- Link to skill documentation (if external)

**Example PR template:**
```
## What is this skill?
My Awesome Skill helps developers automate repetitive code tasks.

## Who should use it?
Python developers and DevOps engineers

## Links
- GitHub: https://github.com/your-username/my-awesome-skill
- Docs: https://docs.example.com/my-skill
```

### 2. Improve Documentation

Found a typo or want to improve docs?

1. Edit the file directly on GitHub
2. Submit a Pull Request
3. We'll review and merge

## Troubleshooting Your Contribution

### My skill won't appear on the website

**Check:**
1. File is in correct folder: `src/content/skills/my-skill.md` (not skills, not other folders)
2. Filename matches slug in frontmatter: `name: my-skill` ✅, not `name: my skill` ❌
3. All required fields in frontmatter exist and are correct
4. Build succeeds: `npm run build` (no errors)

**Debug:**
```bash
npx astro check
# Look for errors mentioning your file
```

### "Expected X to be type Y" error

**This means your frontmatter has incorrect data types.** Examples:

```yaml
# ❌ WRONG - title is missing
---
description: My skill description
# Missing: title
---

# ✅ CORRECT
---
title: My Skill Title
description: My skill description
---
```

### Category validation fails

**Valid categories only:**
- `development`, `design`, `marketing`, `productivity`, `automation`
- `data`, `security`, `document`, `meta`

```yaml
# ❌ WRONG
category: web-development

# ✅ CORRECT
category: development
```

### Roles validation fails

**Valid roles only:**
- `developer`, `marketer`, `designer`, `pm`, `data-analyst`, `devops`, `content`
- `finance`, `hr`, `legal`, `sales`, `executive`

```yaml
# ❌ WRONG
roles:
  - coder
  - devOps

# ✅ CORRECT
roles:
  - developer
  - devops
```

### Date validation fails

**Format must be:** `YYYY-MM-DD`

```yaml
# ❌ WRONG
date: 05/22/2026
date: May 22, 2026

# ✅ CORRECT
date: 2026-05-22
```

### URL validation fails

`githubUrl`, `docsUrl`, and `marketplaceUrl` must be valid URLs:

```yaml
# ❌ WRONG
githubUrl: github.com/user/repo

# ✅ CORRECT
githubUrl: https://github.com/user/repo
```

## Development Setup

### Prerequisites

- Node.js 18+
- npm 9+

### Local Development

```bash
# Clone the repository
git clone https://github.com/Qoder-AI/qoder-community.git
cd qoder-community

# Install dependencies
npm install

# Start dev server
npm run dev

# Visit http://localhost:4321
```

### Building

```bash
npm run build
npm run preview
```

## Pull Request Guidelines

1. **One feature per PR** - Keep PRs focused and reviewable
2. **Clear description** - Explain what and why
3. **Test locally** - Ensure `npm run build` passes
4. **Follow existing style** - Match the code/content style
5. **Validate frontmatter** - Run `npx astro check` before submitting

**Before submitting:**
```bash
# Verify everything works
npx astro check
npm run build
npm run preview
# Manually visit http://localhost:3000/skills/ and check your skill
```

## Content Guidelines

### For Agent Skills

- Write clear, step-by-step instructions
- Include practical examples and use cases
- Test your skill in dev server before submitting
- Ensure all frontmatter fields are correct
- If adding Chinese version, translate key content
- Keep descriptions concise (2-3 sentences max)

### Field Requirements

| Field | Type | Required | Example |
|-------|------|----------|---------|
| `name` | string | ✅ | `my-awesome-skill` |
| `title` | string | ✅ | `My Awesome Skill` |
| `description` | string | ✅ | `Helps developers do X faster` |
| `source` | enum | ✅ | `community` |
| `author` | string | ❌ | `John Doe` |
| `githubUrl` | URL | ✅ | `https://github.com/...` |
| `docsUrl` | URL | ❌ | `https://docs.example.com` |
| `category` | enum | ✅ | `development` |
| `tags` | string[] | ❌ | `[python, automation]` |
| `roles` | enum[] | ❌ | `[developer, devops]` |
| `featured` | boolean | ❌ | `false` |
| `popular` | boolean | ❌ | `false` |
| `isOfficial` | boolean | ❌ | `false` |
| `installCommand` | string | ❌ | Multi-line bash commands |
| `date` | date | ✅ | `2026-05-22` |



## Code of Conduct

- Be respectful and inclusive
- Help others learn
- Give credit where due
- No spam or self-promotion without value

## Questions?

- Open a [Discussion](https://github.com/Qoder-AI/qoder-community/discussions)
---

Thank you for contributing! 🎉

---

<a name="简体中文"></a>
# 贡献指南 (简体中文)

感谢您对 Qoder 社区的贡献感兴趣！本指南将帮助您开始贡献。

## 贡献方式

我们目前欢迎对 **Agent Skills** 的贡献。分享您的专业技能，帮助社区提升 AI Agent 的能力！

### 1. 分享您的 Agent Skills

1. Fork 本仓库。
2. 在 `src/content/skills/your-skill-name.md`（英文）和/或 `src/content/skills-zh/your-skill-name.md`（中文）中创建新文件。
3. 使用下面的模板。
4. 提交 Pull Request。

**Skill 模板：**

````markdown
---
name: skill-name
title: Skill 标题
description: 简要描述此 Skill 的功能
source: community
author: 您的名字
githubUrl: https://github.com/username/skill
docsUrl: https://example.com/docs
category: development # development | design | marketing | productivity | automation | data | security | document | meta
tags:
  - 标签1
  - 标签2
roles:
  - developer
featured: false
popular: false
isOfficial: false
installCommand: |
  git clone https://github.com/username/skill
  cp -r skill-name ~/.qoder/skills/
date: 2026-01-01
---

## 使用场景

- 场景 1
- 场景 2

## 示例

```bash
# 示例命令
```

## 注意事项

- 注意事项 1
````

### 2. 改进文档

发现错别字或想改进文档？

1. 直接在 GitHub 上编辑文件
2. 提交 Pull Request
3. 我们将审核并合并

## 开发设置

### 前提条件

- Node.js 18+
- npm 或 pnpm

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/Qoder-AI/qoder-community.git
cd qoder-community

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:4321
```

### 构建

```bash
npm run build
npm run preview
```

## Pull Request 指南

1. **每个 PR 仅限一个功能** - 保持 PR 聚焦且易于评审
2. **清晰的描述** - 解释做了什么以及为什么要这么做
3. **本地测试** - 确保 `npm run build` 通过
4. **遵循现有风格** - 与代码/内容风格保持一致

## 内容指南

### 关于 Agent Skills

- 编写清晰、逐步的说明。
- 包含代码示例和使用场景。
- 如果可能，请测试您的 Skill 的英文和中文版本。
- 确保 Frontmatter 符合要求的 Schema。

## 行为准则

- 保持尊重和包容
- 帮助他人学习
- 在适当的地方给予致谢
- 不发送垃圾信息或无意义的自我推广

## 有疑问？

- 发起 [Discussion](https://github.com/Qoder-AI/qoder-community/discussions)

---

感谢您的贡献！🎉
