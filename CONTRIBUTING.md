# Contributing to Qoder Community

[English](#english) | [简体中文](#简体中文)

<a name="english"></a>
# Contributing to Qoder Community (English)

Thank you for your interest in contributing to the Qoder Community! This guide will help you get started.

## Ways to Contribute

We currently welcome contributions for **Agent Skills**. Help the community by sharing your specialized skills to enhance AI agents!

### 1. Share Your Agent Skills

1. Fork this repository.
2. Create a new file in `src/content/skills/your-skill-name.md` (English) and/or `src/content/skills-zh/your-skill-name.md` (Chinese).
3. Use the template below. **For complete schema details with all fields and validation rules, see [SKILL_SCHEMA.md](SKILL_SCHEMA.md)**.
4. Submit a Pull Request.

**Skill Template:**

````markdown
---
name: skill-name
title: Skill Title
description: A brief description of what this skill does
source: community
author: Your Name
githubUrl: https://github.com/username/skill
docsUrl: https://example.com/docs
category: development # development | design | marketing | productivity | automation | data | security | document | meta
tags:
  - tag1
  - tag2
roles:
  - developer
featured: false
date: 2026-01-01
---

## Use Cases

- Use case 1
- Use case 2

## Example

\`\`\`bash
# Example command
\`\`\`

## Notes

- Note 1
````

### 2. Improve Documentation

Found a typo or want to improve docs?

1. Edit the file directly on GitHub
2. Submit a Pull Request
3. We'll review and merge

## Development Setup

### Prerequisites

- Node.js 18+
- npm or pnpm

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

## Content Guidelines

### For Agent Skills

- Write clear, step-by-step instructions.
- Include code examples and use cases.
- Test your skill in both English and Chinese if possible.
- Ensure the frontmatter follows the required schema.

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
3. 使用下面的模板。**有关完整架构详情以及所有字段和验证规则，请参见 [SKILL_SCHEMA.md](SKILL_SCHEMA.md)**。
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
date: 2026-01-01
---

## 使用场景

- 场景 1
- 场景 2

## 示例

\`\`\`bash
# 示例命令
\`\`\`

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
