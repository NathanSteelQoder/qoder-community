---
name: excalidraw-diagram-skill
title: Excalidraw Diagram Skill
description: Generate visual Excalidraw diagrams from natural language with built-in Playwright validation and brand customization
source: community
author: coleam00
githubUrl: https://github.com/coleam00/excalidraw-diagram-skill
category: design
tags:
  - diagram
  - excalidraw
  - visualization
  - architecture
roles:
  - developer
  - designer
  - pm
featured: false
popular: false
isOfficial: false
installCommand: |
  git clone https://github.com/coleam00/excalidraw-diagram-skill
  cp -r excalidraw-diagram-skill ~/.qoder/skills/
date: 2026-03-07
---

## Use Cases

- Create system architecture diagrams from descriptions
- Generate workflow and process visualizations
- Build educational diagrams with real code examples
- Design product proposals with visual layouts
- Map out data flows and service interactions

## Core Capabilities

- **Visual Arguments**: Diagrams that argue visually, not just display information
- **Evidence-Based**: Technical diagrams include real code snippets and JSON payloads
- **Self-Correction**: Uses Playwright to render and validate layout issues automatically
- **Brand Customization**: Centralized color palette and styling configuration

## Example

```
Create an Excalidraw diagram showing:
- Microservices architecture with 3 services
- Message queue between services
- Database connections
- API gateway at the entry point
- Use our brand colors from references/color-palette.md
```

## Notes

- Requires optional Playwright installation for visual validation
- All styling centralized in references/color-palette.md
- Supports system architecture, workflows, educational visuals, and proposals
- Catches overlapping text, misaligned arrows, and spacing problems automatically
