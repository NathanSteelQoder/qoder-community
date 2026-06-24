# Component Development Guide

This guide covers how to develop and extend Astro components in the Qoder Community site.

## Quick Reference

| Component Type | Use Case | Client Script | Styling | Examples |
|---|---|---|---|---|
| **Markdown Renderer** | Display data-driven content | ❌ No | CSS only | SkillCard, AgentCard, VideoCard |
| **Interactive** | User input/filtering | ✅ Yes | CSS + styles | SkillFilter, RoleSelector |
| **Modal/Dialog** | Overlay UI | ✅ Yes | CSS + animations | ShareModal |
| **Starlight Override** | Custom theme integration | ✅ Maybe | CSS variables | Header, Footer, ThemeSelect |

---

## Component Patterns

### Pattern 1: Stateless Markdown Renderer

**Purpose**: Display content data (skill, agent, video) with HTML markup

**Location**: `src/components/*.astro`

**Example**: `SkillCard.astro`

```astro
---
// Props: define data structure
interface Props {
  slug: string;
  name: string;
  title: string;
  category: string;
  source: 'anthropic' | 'vercel' | 'community' | 'enterprise';
  isOfficial?: boolean;
  featured?: boolean;
}

const { slug, name, title, category, source, isOfficial, featured } = Astro.props;

// Compute derived values (labels, colors)
const href = `/skills/${slug}`;
const sourceClass = `source-${source}`;
---

<!-- Markup -->
<a {href} class="skill-card">
  <h3 class="skill-name">{name}</h3>
  <p class="skill-title">{title}</p>
  <div class="skill-meta">
    <span class={`badge ${sourceClass}`}>{source}</span>
    {isOfficial && <span class="badge badge-official">Verified</span>}
    {featured && <span class="badge badge-featured">Featured</span>}
  </div>
</a>

<!-- Styles: scoped to this component -->
<style>
  .skill-card {
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid var(--sl-color-border);
    transition: transform 0.2s;
  }

  .skill-card:hover {
    transform: translateY(-2px);
  }

  .skill-name {
    margin: 0;
    font-size: 1.1rem;
  }

  .skill-meta {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
</style>
```

**Key Pattern**:
```
Props → Compute labels/styles → Render markup → Scoped CSS
```

**Benefits**:
- ✅ No runtime overhead
- ✅ CSS scoped to component
- ✅ Easy to test (just data in, HTML out)
- ✅ Reusable across pages

### Pattern 2: Interactive Component with Client Script

**Purpose**: Add user interaction (filtering, toggling, etc.)

**Location**: `src/components/*.astro`

**Example**: `SkillFilter.astro`

```astro
---
// Server-side: generate static HTML
import { getCategoryLabel, useTranslations } from '../i18n';

interface Props {
  categories: string[];
  lang: 'en' | 'zh-CN';
}

const { categories, lang } = Astro.props;
const t = useTranslations(lang);
---

<!-- HTML: static structure -->
<div class="skill-filter">
  <div class="filter-buttons">
    <button class="filter-button active" data-category="all">
      {t('filter.all')}
    </button>
    {categories.map(cat => (
      <button class="filter-button" data-category={cat}>
        {getCategoryLabel(cat, lang)}
      </button>
    ))}
  </div>
</div>

<!-- Client script: runs in browser -->
<script>
  function initSkillFilter() {
    const buttons = document.querySelectorAll('.filter-button');
    
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        
        // Update active state
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update URL query param
        const url = new URL(window.location);
        if (category === 'all') {
          url.searchParams.delete('category');
        } else {
          url.searchParams.set('category', category);
        }
        window.history.replaceState(null, '', url);
        
        // Dispatch event for parent page to listen
        window.dispatchEvent(new CustomEvent('category-changed', {
          detail: { category }
        }));
      });
    });
  }
  
  initSkillFilter();
</script>

<style>
  .skill-filter {
    margin: 1.5rem 0;
    padding: 1rem;
    background: var(--sl-color-bg-nav);
    border-radius: 8px;
  }

  .filter-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .filter-button {
    padding: 0.5rem 1rem;
    border: 1px solid var(--sl-color-border);
    background: transparent;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .filter-button:hover {
    border-color: var(--sl-color-accent);
  }

  .filter-button.active {
    background: var(--sl-color-accent);
    color: white;
    border-color: var(--sl-color-accent);
  }
</style>
```

**Key Pattern**:
```
Server: Static HTML + buttons with data attributes
Client: Event listeners + URL manipulation + DOM updates
```

**Key Techniques**:
- ✅ Use `data-*` attributes to pass info to script
- ✅ Query selector `.filter-button` to find buttons
- ✅ `addEventListener` for click events
- ✅ `window.history.replaceState` to update URL without reload
- ✅ `window.dispatchEvent` to communicate with parent
- ✅ Always use scoped `<style>` for CSS isolation

### Pattern 3: Modal/Overlay Component

**Purpose**: Display content in overlay with open/close logic

**Location**: `src/components/*.astro` or inline in pages

**Example**: ShareModal (from `zh/skills/[slug].astro`)

```astro
---
// Modal structure (usually in parent page)
---

<div id="share-modal" class="share-modal" aria-hidden="true" role="dialog">
  <!-- Modal content -->
  <div class="modal-content">
    <button class="modal-close" aria-label="Close">×</button>
    
    <h2>分享到小红书</h2>
    
    <div class="share-preview">
      <div id="share-preview-loading" class="spinner">生成中...</div>
      <img id="share-preview-image" style="display: none;" />
    </div>
    
    <div class="modal-actions">
      <button id="download-btn">下载</button>
      <button id="copy-btn">复制</button>
    </div>
  </div>
</div>

<!-- Script: open/close logic -->
<script>
  function initShareModal() {
    const modal = document.getElementById('share-modal');
    const closeBtn = document.querySelector('.modal-close');
    
    // Open modal (called from generateShareImage)
    window.openShareModal = (dataUrl) => {
      modal?.classList.add('active');
      modal?.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    
    // Close modal
    closeBtn?.addEventListener('click', () => {
      modal?.classList.remove('active');
      modal?.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
    
    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  initShareModal();
</script>

<!-- Styles -->
<style is:global>
  .share-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s;
    z-index: 1000;
  }

  .share-modal.active {
    opacity: 1;
    visibility: visible;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    max-width: 500px;
    position: relative;
  }

  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .modal-actions button {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid var(--sl-color-accent);
    background: var(--sl-color-accent);
    color: white;
    border-radius: 8px;
    cursor: pointer;
  }
</style>
```

**Key Pattern**:
```
HTML: Static structure + hidden by default
Script: Event listeners for open/close
Style: Visibility/opacity transitions, z-index overlay
```

**Key Techniques**:
- ✅ Use `.active` class to show/hide
- ✅ Set `aria-hidden` for accessibility
- ✅ Handle Escape key for accessibility
- ✅ Use `is:global` for global modal styles
- ✅ Prevent body scroll when modal open

### Pattern 4: Starlight Component Override

**Purpose**: Customize theme components (Header, Footer, etc.)

**Location**: `src/components/*.astro` (referenced in `astro.config.mjs`)

**Example**: `Header.astro`

```astro
---
// Starlight passes specific props
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/Header.astro';
import LanguageSwitcher from './LanguageSwitcher.astro';

const props: Props = Astro.props;
---

<!-- Use Starlight's default header -->
<Default {...props}>
  <!-- Slot for additional content -->
  <fragment slot="fallback">
    <!-- Custom logo/branding -->
    <a href="/" class="qoder-logo">
      <img src="/images/qoder-logo.png" alt="Qoder" />
    </a>
  </fragment>

  <!-- Add language switcher on right -->
  <div slot="end-of-header">
    <LanguageSwitcher />
  </div>
</Default>

<style>
  .qoder-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .qoder-logo img {
    height: 32px;
  }
</style>
```

**Key Pattern**:
```
Import default component → Render with custom slots → Extend with additional elements
```

**Key Techniques**:
- ✅ Named slots like `fallback`, `end-of-header`
- ✅ Spread props: `{...props}`
- ✅ Use default component as wrapper
- ✅ Check Starlight docs for available slots

---

## Component File Structure

### Naming Convention

```
src/components/
├── SkillCard.astro           # Markdown renderer (stateless)
├── SkillFilter.astro         # Interactive filter (with script)
├── ShareModal.astro          # Modal component
├── Header.astro              # Starlight override
├── Footer.astro              # Starlight override
├── ThemeSelect.astro         # Theme toggle (Starlight override)
└── LanguageSwitcher.astro    # Language toggle
```

**Naming rules**:
- Use PascalCase: `SkillCard`, not `skill-card`
- Descriptive names: `SkillFilter`, not `Filter`
- Use full words: `LanguageSwitcher`, not `LangSwitch`

### File Template

```astro
---
/**
 * SkillCard - Display individual skill summary
 * 
 * Used by: src/pages/skills.astro, src/components/RelatedSkills.astro
 * 
 * Props:
 *   - slug: string (skill URL slug)
 *   - name: string (display name)
 *   - title: string (full title)
 *   - category: string (skill category)
 *   - isOfficial?: boolean (official badge)
 * 
 * Example:
 *   <SkillCard slug="my-skill" name="My Skill" title="Full Title" category="development" />
 */

import { getCategoryLabel } from '../i18n';

interface Props {
  slug: string;
  name: string;
  title: string;
  category: string;
  isOfficial?: boolean;
}

const { slug, name, title, category, isOfficial = false } = Astro.props;
const categoryLabel = getCategoryLabel(category, 'en');
---

<!-- Component HTML -->
<div class="skill-card">
  {/* ... */}
</div>

<!-- Component styles -->
<style>
  .skill-card {
    /* ... */
  }
</style>
```

---

## Using Components in Pages

### Importing Components

```astro
---
// In a page: src/pages/skills.astro
import SkillCard from '../components/SkillCard.astro';
import SkillFilter from '../components/SkillFilter.astro';
import { getCollection } from 'astro:content';

const skills = await getCollection('skills');
---

<SkillFilter categories={['development', 'design']} lang="en" />

<div class="skills-grid">
  {skills.map(skill => (
    <SkillCard
      slug={skill.slug}
      name={skill.data.name}
      title={skill.data.title}
      category={skill.data.category}
    />
  ))}
</div>
```

### Passing Props

```astro
<!-- ✅ Correct: Props typed in component -->
<SkillCard
  slug="my-skill"
  name="My Skill"
  title="Full Title"
  category="development"
/>

<!-- ❌ Incorrect: Missing required props -->
<SkillCard slug="my-skill" />

<!-- ✅ Correct: Spreading object -->
{skills.map(s => <SkillCard {...s} />)}
```

---

## Client-Side Script Best Practices

### Do

- ✅ **Wrap in functions**: Prevent code running multiple times
- ✅ **Use IDs/classes for selection**: `getElementById`, `querySelector`
- ✅ **Handle edge cases**: Check if element exists before using
- ✅ **Use data attributes**: Pass info from server to client via `data-*`
- ✅ **Scope CSS**: Use component-scoped `<style>` block
- ✅ **Add accessibility**: `aria-hidden`, `aria-label`, keyboard handling
- ✅ **Clean up listeners**: Remove event listeners when needed
- ✅ **Use transitions**: Smooth animation instead of instant changes

### Don't

- ❌ **Global DOM queries**: Avoid bare `getElementById` outside functions
- ❌ **Inline styles**: Use CSS classes instead of `element.style.color = 'red'`
- ❌ **Hard-coded values**: Make configurable via data attributes
- ❌ **Complex logic in scripts**: Keep scripts focused and simple
- ❌ **Forget browser support**: Test in Firefox, Safari, Chrome
- ❌ **Memory leaks**: Clean up event listeners on component unmount
- ❌ **Synchronous heavy operations**: Use async/await for network requests

### Script Template

```astro
<script>
  // IIFE to avoid global scope pollution
  (() => {
    // Initialization function
    function initComponent() {
      // 1. Get references to elements
      const container = document.getElementById('my-component');
      if (!container) return; // Safety check
      
      const buttons = container.querySelectorAll('.my-button');
      
      // 2. Define event handlers
      function handleClick(event: Event) {
        // ...
      }
      
      // 3. Attach listeners
      buttons.forEach(btn => {
        btn.addEventListener('click', handleClick);
      });
      
      // 4. Clean up (optional)
      return () => {
        buttons.forEach(btn => {
          btn.removeEventListener('click', handleClick);
        });
      };
    }
    
    // Initialize on page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initComponent);
    } else {
      initComponent();
    }
  })();
</script>
```

---

## Styling Best Practices

### CSS Variables (from Starlight)

Use Starlight's design tokens instead of hardcoding colors:

```css
/* ✅ Good: Use theme variables -->
.skill-card {
  background: var(--sl-color-bg-nav);
  border: 1px solid var(--sl-color-border);
  color: var(--sl-color-text);
  border-radius: var(--sl-border-radius);
}

/* ❌ Bad: Hardcoded colors -->
.skill-card {
  background: #1f2937;
  border: 1px solid #374151;
  color: #ffffff;
  border-radius: 8px;
}
```

### Common Variables

```css
--sl-color-bg:           Main page background
--sl-color-bg-nav:       Navigation/sidebar background
--sl-color-accent:       Primary brand color (Qoder green)
--sl-color-text:         Text color
--sl-color-text-accent:  Accent text
--sl-color-border:       Border color
--sl-border-radius:      Border radius (8px)
--sl-sidebar-width:      Sidebar width (300px)
```

### Animations

Use existing animation classes from `custom.css`:

```astro
<div class="animate-fade-in">
  Content fades in on page load
</div>

<div class="animate-slide-up">
  Content slides up
</div>

<div class="animate-spin">
  Loading spinner
</div>
```

Or define custom animations in component style:

```css
<style>
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .dropdown {
    animation: slideDown 0.2s ease-out;
  }
</style>
```

---

## Troubleshooting Components

### Component Not Rendering

**Symptom**: Page builds but component HTML doesn't appear

**Causes**:
1. Component not imported
2. Import path wrong
3. Props missing/incorrect type

**Fix**:
```astro
// Check import exists and path is correct
import SkillCard from '../components/SkillCard.astro';  // ✅ Relative path from current file

// Check all required props passed
<SkillCard slug="test" name="Test" title="Test" category="development" />
```

### Client Script Not Running

**Symptom**: Button click handler doesn't work

**Causes**:
1. Element not found in DOM
2. Script runs before HTML loads
3. Selector wrong

**Fix**:
```astro
<script>
  // Option 1: Wait for DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('my-button');
    if (btn) btn.addEventListener('click', handler);
  });
  
  // Option 2: Check if element exists (safe for multiple runs)
  const btn = document.getElementById('my-button');
  if (btn) btn.addEventListener('click', handler);
</script>
```

### Styles Not Applying

**Symptom**: CSS changes don't appear

**Causes**:
1. CSS not scoped to component (check for `<style>` tag)
2. Global CSS overriding
3. Typo in class name

**Fix**:
```astro
<!-- ✅ Ensure <style> block exists and is scoped -->
<div class="my-component">...</div>

<style>
  .my-component {
    /* Scoped styles here */
  }
</style>

<!-- ❌ Don't use is:global unless necessary -->
<style is:global>
  /* This affects entire page! -->
</style>
```

---

## Performance Tips

- **Lazy load images**: Use `loading="lazy"` on `<img>` tags
- **Minimize scripts**: Keep client-side code small and focused
- **Use CSS classes for state**: Instead of inline styles
- **Batch DOM updates**: Avoid loops that modify DOM
- **Defer heavy computation**: Move to build time when possible

---

## Testing Components

### Manual Testing

```bash
# Start dev server
npm run dev

# Add test skill with different categories
# Visit /skills and filter by category
# Check that filter updates URL: ?category=development
# Verify mobile responsive (DevTools mobile view)
```

### Build Testing

```bash
# Build and check component renders in production
npm run build
npm run preview
```

---

## Common Component Patterns

### Conditional Rendering

```astro
{condition && <div>Show if true</div>}

{condition ? <div>True</div> : <div>False</div>}

{items.length > 0 && (
  <ul>
    {items.map(item => <li>{item}</li>)}
  </ul>
)}
```

### Looping/Mapping

```astro
{items.map(item => (
  <div key={item.id} class="item">
    {item.name}
  </div>
))}
```

### Fragment (Group without wrapper)

```astro
<Fragment>
  <li>Item 1</li>
  <li>Item 2</li>
</Fragment>

<!-- Renders as: -->
<!-- <li>Item 1</li> -->
<!-- <li>Item 2</li> -->
```

---

## Related Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) — Component patterns overview
- [README.md](README.md) — Project structure
- [Astro Components Guide](https://docs.astro.build/en/basics/astro-components/)
- [Starlight Components](https://starlight.astro.build/guides/components/)
