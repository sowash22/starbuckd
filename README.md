# Personal Site + Writings

A Next.js personal site and writings built with TypeScript, App Router, and MDX.

## Features

- ✅ TypeScript-first development
- ✅ Next.js App Router
- ✅ MDX/Markdown writings
- ✅ Tailwind CSS with typography plugin
- ✅ Static site generation
- ✅ Type-safe writings utilities
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

3. Open [http://localhost:3000](http://localhost://localhost:3000) in your browser.

## Project Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Home page
├── about/
│   └── page.tsx           # About page
├── writings/
│   ├── page.tsx           # Writings index
│   └── [slug]/
│       └── page.tsx       # Individual writings post
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── WritingsCard.tsx
└── globals.css

content/writings/              # Writings posts (MDX/Markdown)
├── doing-things-badly.mdx
└── notes-on-agents.mdx

lib/
├── posts.ts               # Writings utilities
└── mdx.ts                 # MDX serialization

types/
└── writings.ts                # TypeScript types
```

## Adding Writings Posts

Create a new `.mdx` or `.md` file in `content/writings/` with frontmatter:

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
- Add your own content in `content/writings/`

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **MDX** - Markdown with JSX
- **gray-matter** - Frontmatter parsing
- **next-mdx-remote** - MDX rendering
- **remark-gfm** - GitHub Flavored Markdown
- **rehype-highlight** - Syntax highlighting
