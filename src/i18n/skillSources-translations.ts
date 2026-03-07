/**
 * Skill Sources translations for Chinese
 * Contains translated descriptions for skill source cards
 */

export interface SkillSourceTranslation {
  zhDescription: string; // Chinese description
}

export const skillSourcesTranslations: Record<string, SkillSourceTranslation> = {
  'skills-sh': {
    zhDescription: '开放的 Agent Skills 生态系统，收录 27,000+ Skills，支持 Qoder 等 17+ 主流 AI Agent',
  },
  'mcp-marketplace': {
    zhDescription: '官方 Skills 市场，收录 31,000+ Skills，支持一键安装和持续更新',
  },
  'anthropic-official': {
    zhDescription: 'Anthropic 官方 Skill 集合，包含 16 个核心 Skills，涵盖文档处理、创意设计和开发工具',
  },
  'vercel-labs': {
    zhDescription: 'Vercel Labs 前端优化 Skills，凝聚 10+ 年前端性能优化经验',
  },
  'awesome-skills': {
    zhDescription: '社区精选的 Agent Skills 列表，包含 60+ 经过验证的高质量 Skills',
  },
  'apify-agent-skills': {
    zhDescription: '生产级 AI Agent Skills，支持自动化、网页抓取和任务编排，具有类型化输入输出',
  },
  'impeccable': {
    zhDescription: 'AI 代码编辑器的设计升级工具，提供 17 个专业命令打造精致前端界面',
  },
  'excalidraw-diagram-skill': {
    zhDescription: '通过自然语言生成 Excalidraw 可视化图表，内置 Playwright 验证和品牌定制',
  },
  'frontend-slides': {
    zhDescription: '创建动画丰富、零依赖的 HTML 演示文稿，支持从零创建或将 PowerPoint 转换为网页格式',
  },
  'xiaohongshu-skills': {
    zhDescription: '小红书自动化发布、评论和内容管理工具，支持多账号管理',
  },
  'bibigpt-video-skill': {
    zhDescription: 'AI Agent 视频理解和处理 Skill，基于 BibiGPT 和 OpenClaw Skills 生态',
  },
};

/**
 * Get translated description for a skill source
 */
export function getSkillSourceDescription(slug: string, description: string, lang: 'en' | 'zh-CN'): string {
  if (lang === 'en') {
    return description;
  }
  
  const translation = skillSourcesTranslations[slug];
  return translation?.zhDescription || description;
}
