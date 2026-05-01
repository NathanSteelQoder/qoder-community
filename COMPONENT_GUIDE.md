# Component Architecture Guide

This guide documents the Astro components that power the Qoder Community site, including their props, behavior, and usage patterns.

## Table of Contents

- [Component Overview](#component-overview)
- [Card Components](#card-components)
- [Interactive Components](#interactive-components)
- [Page Architecture](#page-architecture)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

## Component Overview

All components are Astro components (`.astro` files) located in `src/components/`. They use:

- **Props Interface**: TypeScript `Props` interface for type-safe props
- **Styling**: CSS scoped to component with CSS variables from `src/styles/custom.css`
- **Client Interactivity**: Optional inline `<script>` tags for client-side behavior
- **i18n Support**: Components accept optional `lang` prop for bilingual rendering

### CSS Variables Used

Components reference these design tokens:

```
/* Colors */
--qoder-brand-green: #2ADB5C
--qoder-brand-green-dark: (darker shade)
--text-primary, --text-secondary, --text-tertiary
--surface-elevated, --background-primary

/* Sizing */
--space-1 through --space-12 (spacing scale)
--radius-xs, --radius-sm, --radius-md, --radius-lg, --radius-xl
--shadow-sm, --shadow-lg, --shadow-card-hover

/* Animation */
--duration-fast, --duration-normal, --duration-slow
--ease-out, --ease-out-expo
```

---

## Card Components

### SkillCard

Displays a single skill in a grid card format.

**Location**: `src/components/SkillCard.astro`

**Props**:

```typescript
interface Props {
  entry: CollectionEntry<'skills'>;  // From astro:content
  lang?: keyof typeof ui;             // 'en' or 'zh-CN' (default: 'en')
}
```

**Features**:

- Shows skill name, title, and description (truncated to 3 lines)
- Badge indicators: `[Official]`, `[Popular]`, `[Featured]`
- Source tag (anthropic, vercel, community, enterprise) with color coding
- Category tag
- Hover animation (lift effect, border highlight)
- Responsive grid layout

**Usage Example**:

```astro
---
import SkillCard from '../components/SkillCard.astro';
import { getCollection } from 'astro:content';

const skills = await getCollection('skills', ({ id }) => !id.startsWith('_'));
const lang = 'en'; // or 'zh-CN'
---

<div class="skills-grid">
  {skills.map(entry => (
    <SkillCard entry={entry} lang={lang} />
  ))}
</div>

<style>
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
</style>
```

**Codepaths**:

- Translates skill metadata using `src/i18n/index.ts` functions
- Links to `/skills/{slug}/` or `/zh/skills/{slug}/`

---

### AgentCard

Flip card component for agent configurations. Shows metadata on front, scrollable config content on back (on hover).

**Location**: `src/components/AgentCard.astro`

**Props**:

```typescript
interface Props {
  entry: CollectionEntry<'agents'>;
}
```

**Features**:

- **Front face**: Title, author avatar, description, category badge, tags, hint text
- **Back face**: Scrollable markdown content from the agent file
- 3D flip animation on hover (180° rotateY)
- Links to GitHub repo
- Mobile fallback: disables flip, shows front only

**Usage Example**:

```astro
---
import AgentCard from '../components/AgentCard.astro';
import { getCollection } from 'astro:content';

const agents = await getCollection('agents', ({ id }) => !id.startsWith('_'));
---

<div class="agents-grid">
  {agents.map(entry => (
    <AgentCard entry={entry} />
  ))}
</div>

<style>
  .agents-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
  }
</style>
```

**CSS Notes**:

- Uses `transform-style: preserve-3d` and `backface-visibility: hidden`
- Back face has dark background (`--structural-navy`) for code readability
- Scroll indicator at bottom of back face

**Mobile Behavior**: Flip effect disabled on screens < 768px (perspective: none)

---

### VideoCard

Responsive YouTube video embed with metadata overlay.

**Location**: `src/components/VideoCard.astro`

**Props**:

```typescript
interface Props {
  entry: CollectionEntry<'videos'>;
}
```

**Features**:

- Responsive 16:9 iframe container
- Duration badge (bottom-right, dark overlay)
- Title (2 lines max), description (2 lines max)
- Channel link with YouTube icon
- Category badge with dynamic color based on category
- Lazy loading iframe

**Usage Example**:

```astro
---
import VideoCard from '../components/VideoCard.astro';
import { getCollection } from 'astro:content';

const videos = await getCollection('videos', ({ id }) => !id.startsWith('_'));
---

<div class="videos-grid">
  {videos.map(entry => (
    <VideoCard entry={entry} />
  ))}
</div>

<style>
  .videos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
</style>
```

**Category Colors**:

- `Tutorial`: Green (#2ADB5C)
- `Review`: Blue (#3B82F6)
- `Introduction`: Purple (#8B5CF6)
- `Case Study`: Amber (#F59E0B)

---

### MeetupCard

Displays a single meetup event with location, date, and status.

**Location**: `src/components/MeetupCard.astro`

**Props**:

```typescript
interface Props {
  entry: CollectionEntry<'meetups'>;
}
```

**Features**:

- Event image
- Title, location, date
- Status badge (upcoming/past)
- Attendee count
- Registration link (if available)

---

### ShowcaseCard

Display for community project showcases.

**Location**: `src/components/ShowcaseCard.astro`

**Props**:

```typescript
interface Props {
  entry: CollectionEntry<'showcase'>;
}
```

**Features**:

- Project image with overlay
- Title, description, tags
- Link to project
- Featured badge

---

### SkillSourceCard

External skill marketplace/resource link card.

**Location**: `src/components/SkillSourceCard.astro`

**Props**:

```typescript
interface Props {
  entry: CollectionEntry<'skillSources'>;
}
```

**Features**:

- Source icon
- Name and description
- Skill count
- Link to resource

---

## Interactive Components

### SkillFilter

Category filter pills for the skills page. Allows users to filter displayed skills by category.

**Location**: `src/components/SkillFilter.astro`

**Props**:

```typescript
interface Props {
  activeCategory?: string;              // Default: 'all'
  counts?: Record<string, number>;      // Skill count per category
  lang?: keyof typeof ui;               // Default: 'en'
}
```

**Features**:

- Pill-style filter buttons for all categories
- Shows skill count per category
- Active state styling (green background)
- URL-based state persistence (via `?category=development`)
- Client-side filtering (no page reload)
- Responsive: horizontal scroll on mobile

**Behavior**:

1. Component renders category pills with counts
2. JavaScript initializes click handlers
3. Clicking a pill:
   - Updates URL with `category` query param
   - Filters cards with `data-skill-category` attribute
   - Updates pill styling
4. On page load, reads URL parameter and auto-filters if present

**Usage Example**:

```astro
---
import SkillFilter from '../components/SkillFilter.astro';
import { getCollection } from 'astro:content';

const allSkills = await getCollection('skills', ({ id }) => !id.startsWith('_'));

// Count by category
const categoryCounts: Record<string, number> = { all: allSkills.length };
allSkills.forEach(skill => {
  categoryCounts[skill.data.category] = (categoryCounts[skill.data.category] || 0) + 1;
});
---

<SkillFilter activeCategory="all" counts={categoryCounts} lang="en" />

<!-- Add data attribute to skill cards for filtering -->
{allSkills.map(skill => (
  <div data-skill-category={skill.data.category}>
    <!-- skill card -->
  </div>
))}
```

**JavaScript Events**:

- Listens for `astro:after-swap` to reinitialize after navigation
- Uses inline styles for pill states (overrides CSS)

---

### RoleSelector

Role-based skill recommendations. Displays 12 job roles as pills and shows top 10 skills for selected role.

**Location**: `src/components/RoleSelector.astro`

**Props**:

```typescript
interface Props {
  skills: CollectionEntry<'skills'>[];
  lang?: keyof typeof ui;               // Default: 'en'
}
```

**Supported Roles**:

```
developer, marketer, designer, pm, data-analyst, devops,
content, sales, finance, hr, legal, executive
```

**Features**:

- 12 role pills (scrollable on mobile)
- Developer selected by default
- Displays top 10 skills ranked for selected role
- 2-column grid layout on desktop, 1-column on mobile
- Shows rank (#1, #2, etc.) and skill preview
- "View all recommendations" link to filtered skill list
- Bilingual labels

**Behavior**:

1. First role (developer) is pre-selected
2. Clicking a role pill:
   - Updates active pill styling
   - Shows that role's skill list
   - Toggles visibility with fade animation
3. Skill items link to individual skill pages

**Usage Example**:

```astro
---
import RoleSelector from '../components/RoleSelector.astro';
import { getCollection } from 'astro:content';

const allSkills = await getCollection('skills', ({ id }) => !id.startsWith('_'));
---

<RoleSelector skills={allSkills} lang="en" />
```

**Requirements**:

- Skills must have `roles` array in frontmatter
- Example: `roles: [developer, designer, pm]`

---

### ShowcaseFilter

Filters showcase projects by tags.

**Location**: `src/components/ShowcaseFilter.astro`

**Props**:

```typescript
interface Props {
  activeTag?: string;
  counts?: Record<string, number>;
  lang?: keyof typeof ui;
}
```

**Similar to**: SkillFilter, but for showcase tags instead of skill categories.

---

### LanguageSwitcher

Language toggle between English and Chinese.

**Location**: `src/components/LanguageSwitcher.astro`

**Features**:

- Two-button toggle
- Updates page language by switching to `/zh/` version or back to `/`
- Uses `getLocalizedPath()` utility

---

## Page Architecture

### Skills Page

**Location**: `src/pages/skills.astro`

**Structure**:

1. **Hero Section**: Title, badge, description
2. **Stats**: Total skills, categories, roles (dynamic counts)
3. **External Sources**: Cards linking to skill marketplaces
4. **Category Filter**: SkillFilter component
5. **Featured Skills Grid**: Top skills with `featured: true`
6. **All Skills Grid**: All skills with data-attribute for filtering
7. **Role Selector**: Recommendation engine by job role

**Data Loading**:

```astro
---
// Loads all skills, excluding template
const allSkills = (await getCollection('skills', ({ id }) => !id.startsWith('_')))
  .sort((a, b) => {
    // Featured first, then by date
    if (a.data.featured && !b.data.featured) return -1;
    if (!a.data.featured && b.data.featured) return 1;
    return b.data.date.getTime() - a.data.date.getTime();
  });

// Computes category counts for filter badges
const categoryCounts: Record<string, number> = { all: allSkills.length };
allSkills.forEach(skill => {
  categoryCounts[skill.data.category] = (categoryCounts[skill.data.category] || 0) + 1;
});
```

**Key Features**:

- Dynamic stats computed from collection
- Bilingual (English and Chinese versions in `/pages/zh/skills.astro`)
- Client-side filtering preserves URL state
- Lazy-loads all skill grids

---

### Individual Skill Page

**Location**: `src/pages/skills/[slug].astro` (dynamic route)

**Data Loading**:

```astro
---
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const skills = await getCollection('skills', ({ id }) => !id.startsWith('_'));
  return skills.map(entry => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
```

**Features**:

- Displays full skill markdown content
- Shows metadata (author, source, category, tags)
- Links to GitHub/docs
- Related skills (same category)
- Breadcrumb navigation

---

### Agents Page

**Location**: `src/pages/agents.astro`

**Structure**:

1. Hero section
2. Agent cards grid (using AgentCard component)
3. Call-to-action to create own agent

**Data Loading**:

```astro
---
const agents = (await getCollection('agents', ({ id }) => !id.startsWith('_')))
  .sort((a, b) => {
    if (a.data.featured && !b.data.featured) return -1;
    if (!a.data.featured && b.data.featured) return 1;
    return b.data.date.getTime() - a.data.date.getTime();
  });
```

---

### Learn Page

**Location**: `src/pages/learn.astro`

**Components**:

- VideoCard components for tutorials
- RoleSelector for role-based learning paths

---

### Meetups Page

**Location**: `src/pages/meetups.astro`

**Components**:

- MeetupCard components
- Separates upcoming vs past events

---

### Showcase Page

**Location**: `src/pages/showcase.astro`

**Components**:

- ShowcaseFilter for tag filtering
- ShowcaseCard components in grid
- Featured projects highlighted

---

## Common Patterns

### 1. Bilingual Components

Components support `lang` prop for translations:

```astro
---
import type { CollectionEntry } from 'astro:content';
import { useTranslations, defaultLang, type ui } from '../i18n';

interface Props {
  entry: CollectionEntry<'skills'>;
  lang?: keyof typeof ui;
}

const { entry, lang = defaultLang } = Astro.props;
const t = useTranslations(lang);
---

<!-- Use t() to translate strings -->
<span>{t('badge.official')}</span>
```

### 2. Client-Side Filtering

Use `data-*` attributes for client filtering:

```astro
{skills.map(skill => (
  <div data-skill-category={skill.data.category}>
    <!-- component -->
  </div>
))}

<script>
  function initFilter() {
    const cards = document.querySelectorAll('[data-skill-category]');
    // Filter logic...
  }
  initFilter();
  document.addEventListener('astro:after-swap', initFilter);
</script>
```

### 3. Dynamic Collection Counting

```astro
---
const items = await getCollection('skills');
const counts: Record<string, number> = { all: items.length };
items.forEach(item => {
  counts[item.data.category] = (counts[item.data.category] || 0) + 1;
});
---
```

### 4. URL State Persistence

Components update URL without reload:

```javascript
const url = new URL(window.location.href);
url.searchParams.set('category', 'development');
window.history.replaceState({}, '', url.toString());
```

---

## Troubleshooting

### Issue: Component styling not applied

**Cause**: CSS variables not available or specificity conflict

**Solution**:

1. Check that component is scoped with `<style>` tag (not `<style is:global>`)
2. Verify CSS variable names in `src/styles/custom.css`
3. Use `!important` sparingly for overrides (e.g., pill button states)

### Issue: Bilingual content showing wrong text

**Cause**: `lang` prop not passed or i18n utility misconfigured

**Solution**:

1. Pass `lang` prop explicitly: `<SkillCard entry={entry} lang="zh-CN" />`
2. Check that translation keys exist in `src/i18n/ui.ts`
3. Verify skill slug matching in `src/i18n/skills-translations.ts`

### Issue: Filter not responding to clicks

**Cause**: Component not initialized or event listeners not attached

**Solution**:

1. Check browser console for JavaScript errors
2. Verify `[data-filter-component]` or `[data-skill-category]` attributes exist
3. Ensure `astro:after-swap` listener is registered for view transitions
4. Clear browser cache and rebuild: `npm run build`

### Issue: Mobile layout broken on smaller screens

**Cause**: Media query not matching or mobile styles overridden

**Solution**:

1. Test with `viewport` meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1">`
2. Check media query breakpoint (most components use `max-width: 768px`)
3. Verify CSS variables have mobile values defined
4. Use browser DevTools device mode to test

### Issue: Card animation stuttering or laggy

**Cause**: GPU acceleration not enabled or animation too complex

**Solution**:

1. Use `transform` and `opacity` for animations (GPU-accelerated)
2. Avoid animating `width` or `height` (causes layout recalculation)
3. Check for excessive shadow effects on hover
4. Profile with DevTools Performance tab

---

## Performance Tips

1. **Lazy-load content**: Use `loading="lazy"` on images and iframes
2. **Memoize collection queries**: Cache results, don't query twice per page
3. **Limit card grid**: Consider pagination for 100+ cards
4. **Optimize images**: Use next-gen formats (WebP with fallback)
5. **Use CSS variables**: Centralized design tokens reduce CSS size
6. **Minimize JavaScript**: Move logic to Astro compile time when possible

---

## References

- **Astro Docs**: https://docs.astro.build/
- **Collections API**: https://docs.astro.build/en/guides/content-collections/
- **CSS Variables**: See `src/styles/custom.css`
- **i18n System**: See `src/i18n/utils.ts` and `AGENTS.md`

