---
name: apify-agent-skills
title: Apify Agent Skills
description: Production-ready AI agent skills for automation, web scraping, and task orchestration with typed inputs and outputs
source: community
author: Apify
githubUrl: https://github.com/apify/agent-skills
category: automation
tags:
  - automation
  - web-scraping
  - orchestration
  - apify
roles:
  - developer
  - devops
  - data-analyst
featured: false
popular: false
isOfficial: false
installCommand: |
  npx skills add https://github.com/apify/agent-skills
date: 2026-03-07
---

## Use Cases

- Build production-ready AI automation workflows
- Web scraping with semantic versioning and validation
- Task orchestration with dependency-aware execution graphs
- Framework exports for CrewAI and OpenAI Agents
- Self-healing validation and failure recovery

## Core Capabilities

- **Typed I/O**: Skill definitions with typed inputs, outputs, and constraints
- **Execution Graphs**: Dependency-aware task orchestration
- **Failure Recovery**: Self-healing validation strategies
- **Framework Exports**: Support for CrewAI and OpenAI Agents

## Example

```
Please create an Apify Actor that:
1. Scrapes product listings from an e-commerce site
2. Extracts price, title, and availability
3. Outputs structured JSON data
4. Handles pagination automatically
5. Includes retry logic for failed requests
```

## Notes

- Supports multiple skill definitions within one repository
- Skills include semantic versioning
- Optional web scraping capabilities built-in
- Check Apify documentation for Actor development patterns
