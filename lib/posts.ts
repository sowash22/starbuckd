import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { BlogPost, BlogFrontmatter } from '@/types/blog'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export function getAllPosts(): BlogPost[] {
  // Get all files in the posts directory
  const fileNames = fs.existsSync(postsDirectory)
    ? fs.readdirSync(postsDirectory)
    : []

  const allPostsData = fileNames
    .filter((name) => name.endsWith('.mdx') || name.endsWith('.md'))
    .map((fileName) => {
      // Remove .mdx or .md extension to get slug
      const slug = fileName.replace(/\.(mdx|md)$/, '')

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')

      // Use gray-matter to parse the post metadata section
      const { data, content } = matter(fileContents)

      // Validate and type the frontmatter
      const frontmatter: BlogFrontmatter = {
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString(),
        summary: data.summary || '',
        tags: data.tags || [],
      }

      return {
        slug,
        frontmatter,
        content,
      }
    })

  // Sort posts by date (newest first)
  return allPostsData.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime()
    const dateB = new Date(b.frontmatter.date).getTime()
    return dateB - dateA
  })
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts()
  return posts.find((post) => post.slug === slug) || null
}

export function getAllPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug)
}
