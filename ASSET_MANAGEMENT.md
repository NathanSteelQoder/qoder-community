# Asset Management Guide

This guide documents how the Qoder Community project manages and optimizes static assets, particularly images used for skill cards and social sharing.

## Overview

The project maintains a dual image strategy:

1. **Skill Share Images** (`public/images/skills/share/`) — Used for social media sharing
2. **Default Category Images** (`public/images/skills/share/default-*.jpg`) — Fallback images by category

Recent optimization (Feb 2026) reduced total image size from 496MB to 23MB by converting PNG to JPEG format, a 95% reduction that improves repository size and loading performance.

## Image Format Standards

### Share Images (Skill-Specific)

**Purpose:** Social media sharing, particularly for Xiaohongshu (Little Red Book, 小红书)

**Format:**
- **Type:** JPEG (`.jpg`)
- **Dimensions:** 1200×630px (16:9 aspect ratio for most platforms)
- **Quality:** 85% compression
- **Color Space:** RGB
- **File Size:** ~200–800KB per image after optimization

**Naming Convention:**
```
{skill-slug}-share.jpg
```

Examples:
- `postgres-share.jpg`
- `mcp-builder-share.jpg`
- `web-artifacts-builder-share.jpg`

### Default Category Images

**Purpose:** Fallback when skill-specific share image doesn't exist

**Format:**
- **Type:** JPEG (`.jpg`)
- **Dimensions:** 1200×630px (16:9 aspect ratio)
- **Quality:** 85% compression
- **File Size:** ~220–400KB per category

**Naming Convention:**
```
default-{category}.jpg
```

**Category List:**
- `default-automation.jpg`
- `default-data.jpg`
- `default-design.jpg`
- `default-development.jpg`
- `default-document.jpg`
- `default-marketing.jpg`
- `default-meta.jpg`
- `default-productivity.jpg`
- `default-security.jpg`

### Logo & QR Code Images

Used by the share image generator:

- `/images/qoder-logo.png` — Qoder logo
- `/images/qrcode-qoder.png` — Download QR code

**Note:** These remain as PNG for transparency support (logos and QR codes require precise transparency).

## Asset Directory Structure

```
public/images/
├── skills/
│   └── share/           # All skill share images
│       ├── postgres-share.jpg
│       ├── mcp-builder-share.jpg
│       ├── default-automation.jpg
│       ├── default-data.jpg
│       ├── ... (9 category defaults)
│       └── ... (50+ skill-specific images)
├── qoder-logo.png       # Qoder branding
└── qrcode-qoder.png     # Download link QR
```

## Share Image Generation

The `src/utils/share-image-generator.ts` utility dynamically generates social share images on demand using the Canvas API.

### How It Works

1. **Request Phase:** User views a skill or requests a share image
2. **Asset Loading:** Utility loads the skill-specific or default category image
3. **Canvas Generation:** Generates a 900×1200px image (3:4 ratio for Xiaohongshu)
4. **Composition:**
   - Light gray background
   - Title: "✨ 今日效率分享" (Today's Efficiency Share)
   - Skill demo image (500×500px, centered, rounded corners)
   - Custom share text based on skill category
   - Qoder logo
   - Call-to-action: "下载 Qoder 体验 ↓" (Download Qoder)
   - QR code with white background
   - Domain: "qoder.com"
5. **Export:** Returns as PNG via `canvas.toDataURL()`

### Outcome Map (Category → Chinese Text)

The generator maps skill categories to outcome messages for the share image:

```typescript
const outcomeMap: Record<string, string> = {
  document: '文档处理',      // Document processing
  design: '创意设计',        // Creative design
  development: '开发任务',   // Development tasks
  marketing: '营销内容',     // Marketing content
  automation: '流程自动化',  // Process automation
  productivity: '效率提升',  // Efficiency improvement
  security: '安全分析',      // Security analysis
  data: '数据处理',          // Data processing
  meta: '工具配置',          // Tool configuration
};
```

Example output:
- Skill: "Postgres"
- Category: "development"
- Share text: "我用 Qoder +「Skills: Postgres」让 AI 帮我搞定了开发任务!"
- Translation: "I used Qoder + 'Skills: Postgres' to let AI handle my development tasks!"

### Fallback Behavior

If a skill-specific image doesn't exist:

```typescript
async function getShareImagePath(slug: string, category: string): Promise<string> {
  const skillImagePath = `/images/skills/share/${slug}-share.jpg`;
  const defaultImagePath = `/images/skills/share/default-${category}.jpg`;
  
  if (await imageExists(skillImagePath)) {
    return skillImagePath;
  }
  return defaultImagePath;
}
```

**Behavior:**
1. Check for `{slug}-share.jpg`
2. If not found, use `default-{category}.jpg`
3. If category doesn't exist, gracefully degrade (no image shown)

## Image Optimization Workflow

### When to Optimize

Optimize images when:
- Adding new skill share images
- Updating category defaults
- Repository size grows beyond acceptable limits
- Performance benchmarks show image loading is a bottleneck

### Optimization Process

The project uses a bulk optimization approach:

```bash
# Convert PNG to JPEG (quality 85)
# Reduce file size while maintaining visual quality
# Update code references from .png to .jpg
```

**Tools Used:**
- `sharp` (Node.js image library) — Listed in `optionalDependencies`
- Playwright (browser automation) — For screenshot capture

**Results from Feb 2026 Optimization:**
- 63 PNG files converted
- Total reduction: 496MB → 23MB
- Per-file average: ~7.8MB → ~366KB
- Quality maintained at 85% JPEG compression

### Adding New Skill Share Images

When adding a new skill:

1. **Create Image File**
   - Format: JPEG (`.jpg`)
   - Dimensions: 1200×630px (16:9)
   - Quality: 85% compression
   - Naming: `{skill-slug}-share.jpg`

2. **Place in Directory**
   ```
   public/images/skills/share/{skill-slug}-share.jpg
   ```

3. **Verify Naming**
   - Ensure filename matches skill slug exactly
   - Use kebab-case: `mcp-builder-share.jpg`, not `mcp_builder_share.jpg`

4. **Test Fallback**
   - Verify default category image shows if you temporarily remove the skill image
   - Ensures graceful degradation works

## Code Integration Points

### In Astro Pages

**File:** `src/pages/zh/skills/[slug].astro`

The share image generator is called when rendering skill detail pages for social media preview:

```astro
---
// Generate preview image for social sharing
const shareImage = await generateShareImage({
  slug: entry.slug,
  skillTitle: entry.data.title,
  category: entry.data.category,
});
---

<meta property="og:image" content={shareImage} />
```

### In i18n Index

**File:** `src/i18n/index.ts`

Updated to reference new `.jpg` format instead of `.png`:

```typescript
export function getShareImageUrl(slug: string): string {
  return `/images/skills/share/${slug}-share.jpg`;
}
```

## Constraints & Considerations

1. **Image Discovery:** Dynamically checks for image existence, no manifest file needed
2. **Canvas API:** Share image generation requires client-side JavaScript (browser Canvas API)
3. **Format Migration:** PNG→JPEG reduces quality slightly but maintains visual clarity at 85% quality
4. **Transparency:** JPEG doesn't support transparency; logos and QR codes remain PNG
5. **File Size:** Each skill image is ~400–800KB; with 50+ skills, total ~20MB uncompressed
6. **Performance:** On-demand generation adds ~200–500ms latency; consider pre-generation for production
7. **Fallback Risk:** If both skill and default images missing, no image shown; ensure defaults always exist

## Maintenance & Troubleshooting

### Skill-Specific Image Not Showing

**Symptom:** Share preview shows default category image instead of skill-specific image

**Diagnosis:**
1. Check filename matches skill slug: `{slug}-share.jpg`
2. Verify file exists: `public/images/skills/share/{slug}-share.jpg`
3. Check file is valid JPEG, not corrupted
4. Verify skill slug in frontmatter matches filename

**Fix:**
```bash
# Verify filename matches slug
ls -la public/images/skills/share/ | grep postgres
# Should show: postgres-share.jpg

# If filename wrong, rename:
mv public/images/skills/share/Postgres-share.jpg public/images/skills/share/postgres-share.jpg
```

### Share Image Generation Slow

**Symptom:** Social preview takes >1 second to load

**Causes:**
- Canvas rendering complex elements
- Image loading from slow CDN
- Browser performance on low-end devices

**Optimization:**
1. Pre-generate images at build time instead of on-demand
2. Cache generated images with long TTL
3. Use CDN caching headers

### Image Quality Loss After Optimization

**Symptom:** Optimized JPEGs look blurry or artifacts visible

**Fix:**
- Increase quality setting from 85 to 90–92
- Use lossless compression where acceptable
- Re-optimize with different tool settings

### New Skill Image Missing

**Symptom:** New skill added but no share image available

**Prevention Checklist:**
- [ ] Created `{slug}-share.jpg` (1200×630px, 85% quality)
- [ ] Placed in `public/images/skills/share/`
- [ ] Filename matches skill slug exactly
- [ ] Tested image loads without errors
- [ ] Verified fallback works if image removed
- [ ] Committed image file to repository

## Related Documentation

- **CONTRIBUTING.md** — How to add new skills (includes asset checklist)
- **AGENTS.md** — Skill template frontmatter and schema
- **src/utils/share-image-generator.ts** — Canvas generation logic
- **src/i18n/index.ts** — Image URL helpers

## Future Improvements

1. **Pre-Generation:** Generate share images at build time instead of on-demand
2. **Image CDN:** Host images on Cloudflare Image Optimization for further compression
3. **Dynamic Thumbnails:** Generate category-specific thumbnails for skill listings
4. **WebP Support:** Offer WebP format for browsers that support it (20–30% size reduction)
5. **Metadata Extraction:** Auto-detect optimal image dimensions from file headers
