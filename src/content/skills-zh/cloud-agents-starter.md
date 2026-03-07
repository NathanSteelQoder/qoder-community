---
name: cloud-agents-starter
title: Cloud Agents 入门
description: Cloud Agent 最小运行手册——按代码区域组织，包含 Qoder Community 代码库的安装、运行、测试与验证流程
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

## 快速开始

```bash
npm install
npm run dev
```

访问 http://localhost:4321。无需登录或凭证——这是静态 Astro/Starlight 站点。

## 环境与工作流

- **无需 `.env`** — 站点无需环境变量即可运行。`.env` 文件已加入 gitignore。
- **功能开关** — 内容展示由 frontmatter 控制（如 `featured: true`）。编辑 `src/content/skills/*.md` 或其他内容文件即可调整展示行为。
- **干净重建** — 若构建失败：`rm -rf node_modules dist .astro && npm install && npm run build`

## 按代码区域划分的测试流程

### 内容 (`src/content/`)

| 区域 | 路径 | 测试流程 |
|------|------|----------|
| Skills（英文） | `src/content/skills/` | 新增/编辑 `.md`，执行 `npm run build`。在 `/skills/` 和 `/skills/[slug]` 验证。 |
| Skills（中文） | `src/content/skills-zh/` | 新增/编辑 `.md`，在 `src/i18n/skills-translations.ts` 添加条目。在 `/zh/skills/` 验证。 |
| Agents | `src/content/agents/` | 编辑 `.md`，在 `/agents/` 验证。 |
| Videos | `src/content/videos/` | 编辑 `.md`，在 `/learn/` 验证。 |
| Meetups | `src/content/meetups/` | 编辑 `.md`，在 `/meetups/` 验证。 |
| Showcase | `src/content/showcase/` | 编辑 `.md`，在 `/showcase/` 验证。 |
| Docs | `src/content/docs/` | 编辑 `.md`，在 `/docs/` 验证。 |

**内容校验**：确保 frontmatter 符合 `src/content.config.ts` 中的 schema。运行 `npx astro check` 检查类型错误。

### 组件与页面

| 区域 | 路径 | 测试流程 |
|------|------|----------|
| 组件 | `src/components/` | 编辑 `.astro`，运行 `npm run dev`，访问使用该组件的页面。 |
| 页面 | `src/pages/` | 编辑 `.astro`，运行 `npm run dev`，访问对应路由。 |
| 样式 | `src/styles/custom.css` | 编辑 CSS，刷新开发服务器。 |

### 构建与类型检查

```bash
npm run build          # 完整生产构建
npx astro check       # TypeScript + Astro 校验
npm run preview       # 本地预览构建结果
```

### 截图（Playwright）

```bash
npm run capture
```

将 `public/demos/` 中的 HTML 文件截图到 `public/screenshots/`。需要 Playwright（`npm install` 已包含）。

## 模拟 Featured / 展示开关

要让内容出现在精选区域，在 frontmatter 中设置：

```yaml
featured: true
```

适用于：skills、agents、videos、showcase。Skills 在 `/skills/` 和 `/zh/skills/` 中会优先展示 featured 项。

## 如何更新本 Skill

发现新的测试技巧、运行手册步骤或环境说明时：

1. 编辑 `src/content/skills/cloud-agents-starter.md`（本文件）。
2. 编辑 `src/content/skills-zh/cloud-agents-starter.md` 更新中文版。
3. 若 skill 名称/标题/描述有变更，在 `src/i18n/skills-translations.ts` 中新增或更新条目。
4. 运行 `npm run build` 验证。
5. 提交时使用类似 `docs: update cloud-agents-starter runbook` 的 commit 信息。

保持 Skill 精简：聚焦命令、路径和具体流程，避免冗长描述。
