---
name: xiaohongshu-skills
title: Xiaohongshu Skills
description: Automated Xiaohongshu (Little Red Book) publishing, commenting, and content management with multi-account support
source: community
author: white0dew
githubUrl: https://github.com/white0dew/XiaohongshuSkills
category: marketing
tags:
  - xiaohongshu
  - social-media
  - publishing
  - automation
roles:
  - marketer
  - content
featured: false
popular: false
isOfficial: false
installCommand: |
  git clone https://github.com/white0dew/XiaohongshuSkills
  cp -r XiaohongshuSkills ~/.qoder/skills/
date: 2026-03-07
---

## Use Cases

- Automate content publishing to Xiaohongshu
- Manage multiple Xiaohongshu accounts
- Search and retrieve note content with comments
- Automated commenting on posts
- Export dashboard data and notification scraping

## Core Capabilities

- **Auto Publishing**: Automated content posting with title, body, and image uploads
- **Multi-Account**: Isolated cookie management for multiple accounts
- **Headless Mode**: Background operation without visible browser
- **Content Search**: Search notes and retrieve detailed content with comments

## Example

```
Please publish a Xiaohongshu post:
- Title: 5 Must-Try Cafes in Shanghai
- Content: Detailed review of each cafe with ratings
- Images: Upload the 5 photos from ./cafe-photos/
- Hashtags: #Shanghai #Cafes #FoodReview
- Account: Use the marketing account profile
```

## Notes

- Requires Python 3.10+ and Google Chrome
- Login detection with 12-hour cache by default
- Supports automatic image downloading with Referer header spoofing
- Remote CDP support for connecting to remote Chrome instances
