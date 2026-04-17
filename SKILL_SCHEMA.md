# Skill Schema Reference

This is the authoritative reference for Agent Skill frontmatter format. Follow this exactly when contributing skills to Qoder Community.

## Location

- **English**: `src/content/skills/your-skill-name.md`
- **Chinese**: `src/content/skills-zh/your-skill-name.md`

## Required Fields

All fields marked "Required" must be present in the frontmatter.

### Basic Information

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Unique identifier (kebab-case, used in URL: `/skills/skill-name`) |
| `title` | string | Yes | Display name (e.g., "Document Parser", "API Debugger") |
| `description` | string | Yes | One-line description (50-100 chars, shown in skill cards) |
| `category` | enum | Yes | One of: `development`, `design`, `marketing`, `productivity`, `automation`, `data`, `security`, `document`, `meta` |
| `date` | date | Yes | Publication date (YYYY-MM-DD format) |

### Author Information

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `author` | string | No | Author name (free text) |
| `source` | enum | Yes | Source: `community`, `anthropic`, `vercel`, or `enterprise` |

### Links

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `githubUrl` | URL | Yes | GitHub repository link (https://github.com/...) |
| `docsUrl` | URL | No | Documentation link (optional) |
| `marketplaceUrl` | URL | No | Marketplace or product link (optional) |

### Classification

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tags` | array of strings | No | Keywords (e.g., `["python", "api", "cli"]`) |
| `roles` | array of enums | No | Applicable roles from: `developer`, `marketer`, `designer`, `pm`, `data-analyst`, `devops`, `content`, `finance`, `hr`, `legal`, `sales`, `executive` |

### Display & Features

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `featured` | boolean | No | Highlight on homepage (default: `false`) |
| `popular` | boolean | No | Mark as trending (default: `false`) |
| `isOfficial` | boolean | No | Official Qoder skill (default: `false`) |

### Installation & Setup

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `installCommand` | string (multiline) | No | How to install/use the skill (bash, Python, etc.) |

### Metadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `lastUpdated` | date | No | Last modification date (YYYY-MM-DD format) |

## Complete Example

```markdown
---
name: document-parser
title: Document Parser
description: Extract text, tables, and metadata from PDF, DOCX, and images
source: community
author: Jane Smith
githubUrl: https://github.com/janesmith/document-parser
docsUrl: https://github.com/janesmith/document-parser/blob/main/README.md
category: document
tags:
  - pdf
  - ocr
  - table-extraction
  - document-processing
roles:
  - developer
  - data-analyst
  - content
featured: true
popular: false
isOfficial: false
installCommand: |
  git clone https://github.com/janesmith/document-parser
  cd document-parser
  pip install -r requirements.txt
  python setup.py install
date: 2026-04-15
lastUpdated: 2026-04-17
---

## Features

- Extract text with layout preservation
- Detect and extract tables
- OCR support for scanned documents
- Batch processing

## Use Cases

- Extract content from contracts
- Automate data entry from forms
- Archive and index documents
- Build searchable document databases

## Installation

Follow the install command above, or use pip:

\`\`\`bash
pip install document-parser
\`\`\`

## Examples

### Basic Text Extraction

\`\`\`python
from document_parser import Parser

parser = Parser()
text = parser.extract_text("document.pdf")
print(text)
\`\`\`

### Extract Tables

\`\`\`python
tables = parser.extract_tables("spreadsheet.docx")
for table in tables:
    print(table.to_csv())
\`\`\`

## Compatibility

- Python 3.8+
- Works with Qoder CLI, VS Code, and Cursor
- Cross-platform (macOS, Linux, Windows)

## Support

- [GitHub Issues](https://github.com/janesmith/document-parser/issues)
- [Discussions](https://github.com/janesmith/document-parser/discussions)
```

## Validation Rules

### Field Validation

1. **`name`** (required)
   - Must be kebab-case (lowercase, hyphens only)
   - Pattern: `^[a-z0-9-]+$`
   - Example: `pdf-extractor`, `api-debugger`, `test-runner`

2. **`title`** (required)
   - Max 60 characters
   - No special characters except hyphens
   - Should be title-cased

3. **`description`** (required)
   - Max 160 characters (displayed in skill cards)
   - Should be a complete sentence
   - Include the main benefit/use case

4. **`category`** (required)
   - Must be exactly one of the 9 categories
   - Choose the primary use case (if multiple, pick the strongest match)

5. **`githubUrl`** (required)
   - Must be valid HTTPS URL
   - Must start with `https://github.com/`
   - Repository must be publicly accessible

6. **`source`** (required)
   - Must be one of: `community`, `anthropic`, `vercel`, `enterprise`
   - `community` = contributed by community member
   - Others reserved for official integrations

7. **`date`** (required)
   - Format: `YYYY-MM-DD` (e.g., `2026-04-15`)
   - Should be today's date when creating
   - Will be used for sorting (newest first)

8. **`tags`** (optional, but recommended)
   - Array of strings
   - Keep to 3-5 tags
   - Use lowercase, kebab-case
   - Examples: `["python", "automation", "cli"]`

9. **`roles`** (optional, but recommended)
   - Array of valid role enums
   - Include all roles that would find this skill useful
   - Examples: `["developer", "devops"]`

10. **`installCommand`** (optional)
    - Multiline string (use `|` in YAML)
    - Include all steps from clone to usage
    - Keep clear and concise

## Common Mistakes

### ❌ Wrong: Incorrect field names (from old templates)

```markdown
---
title: "My Skill"
authorUrl: "https://github.com/user"
sourceUrl: "https://github.com/..."
shareImage: "/images/skills/share/skill-share.png"
---
```

**Fix**: Use correct field names from schema above:
- `authorUrl` → `author` (string only)
- `sourceUrl` → `githubUrl`
- `shareImage` → Remove (handled automatically)
- Add required fields: `name`, `source`, `category`, `date`

### ❌ Wrong: Invalid category

```markdown
category: "backend"  # Not a valid category
```

**Fix**: Use one of the 9 valid categories:
```markdown
category: development
```

### ❌ Wrong: Incorrect date format

```markdown
date: 2026-04-15 10:30:00  # Too detailed
date: April 15, 2026       # Wrong format
```

**Fix**: Use YYYY-MM-DD only:
```markdown
date: 2026-04-15
```

### ❌ Wrong: Missing required fields

```markdown
---
title: My Skill
description: Does something useful
---
```

**Fix**: Add all required fields:
```markdown
---
name: my-skill
title: My Skill
description: Does something useful
source: community
githubUrl: https://github.com/user/my-skill
category: development
date: 2026-04-15
---
```

## Tips for Better Skills

1. **Descriptive Names**: Use `pdf-text-extractor` not `tool-1`
2. **Clear Descriptions**: "Extract and clean text from PDFs" not "PDF thing"
3. **Relevant Tags**: Help discoverability (e.g., `["pdf", "ocr", "text-extraction"]`)
4. **Role Mapping**: Include all roles that benefit (marketer + data analyst might both use this)
5. **Good Examples**: Show actual usage, not pseudo-code
6. **Install Instructions**: Be specific (pip vs npm vs git clone)
7. **Dual Language**: Create both English (`src/content/skills/`) and Chinese (`src/content/skills-zh/`) versions

## Bilingual Naming Convention

**English**: `src/content/skills/kebab-case-name.md`
**Chinese**: `src/content/skills-zh/kebab-case-name.md`

Keep the same kebab-case filename in both directories. Only translate the frontmatter (`title`, `description`) and body content.

```markdown
# English: src/content/skills/document-parser.md
# Chinese: src/content/skills-zh/document-parser.md

---
title: "Document Parser"  # Translate this
description: "Extract text from PDFs..."  # Translate this
---
```

## Reviewing Your Frontmatter

Before committing, verify:

```bash
# 1. Check YAML syntax (no tabs, correct indentation)
grep -E "^[[:space:]]*-" src/content/skills/your-skill.md  # Should have no tabs

# 2. Verify required fields
echo "Checking required fields..."
grep "name:" src/content/skills/your-skill.md || echo "❌ Missing 'name'"
grep "title:" src/content/skills/your-skill.md || echo "❌ Missing 'title'"
grep "description:" src/content/skills/your-skill.md || echo "❌ Missing 'description'"
grep "source:" src/content/skills/your-skill.md || echo "❌ Missing 'source'"
grep "githubUrl:" src/content/skills/your-skill.md || echo "❌ Missing 'githubUrl'"
grep "category:" src/content/skills/your-skill.md || echo "❌ Missing 'category'"
grep "date:" src/content/skills/your-skill.md || echo "❌ Missing 'date'"

# 3. Build and verify no errors
npm run build

# 4. View in browser
npm run preview
# Visit http://localhost:4321/skills/
```

---

**Questions?** See [CONTRIBUTING.md](CONTRIBUTING.md) or open a GitHub issue.
