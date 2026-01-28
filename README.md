# Personal Site + Blog

A Next.js personal site and blog built with TypeScript, App Router, and MDX.

## Features

- ✅ TypeScript-first development
- ✅ Next.js App Router
- ✅ MDX/Markdown blog posts
- ✅ Tailwind CSS with typography plugin
- ✅ Static site generation
- ✅ Type-safe blog utilities
- ✅ Dark mode support
- ✅ SEO-friendly metadata

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Home page
├── about/
│   └── page.tsx           # About page
├── blog/
│   ├── page.tsx           # Blog index
│   └── [slug]/
│       └── page.tsx       # Individual blog post
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── BlogCard.tsx
└── globals.css

content/blog/              # Blog posts (MDX/Markdown)
├── doing-things-badly.mdx
└── notes-on-agents.mdx

lib/
├── posts.ts               # Blog utilities
└── mdx.ts                 # MDX serialization

types/
└── blog.ts                # TypeScript types
```

## Adding Blog Posts

Create a new `.mdx` or `.md` file in `content/blog/` with frontmatter:

```mdx
---
title: Your Post Title
date: 2026-01-27
summary: A brief summary of your post
tags:
  - tag1
  - tag2
---

Your content here...
```

## Deployment

This site is optimized for static export and can be deployed to:

- **Vercel** (recommended): Connect your GitHub repo
- **Netlify**: Use the Next.js build preset
- **Any static host**: Run `npm run build` and deploy the `out` directory

## Customization

- Update metadata in `app/layout.tsx`
- Customize styles in `tailwind.config.ts`
- Modify components in `app/components/`
- Add your own content in `content/blog/`

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **MDX** - Markdown with JSX
- **gray-matter** - Frontmatter parsing
- **next-mdx-remote** - MDX rendering
- **remark-gfm** - GitHub Flavored Markdown
- **rehype-highlight** - Syntax highlighting
