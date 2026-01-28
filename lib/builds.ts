import path from 'path'
import { promises as fs } from 'fs'
import { serializeMDX } from './mdx'

export type Build = {
  slug: string
  frontmatter: {
    title: string
    description: string
    href: string
    github?: string
  }
  code: string
}

export async function getBuilds(): Promise<Build[]> {
  const buildsDirectory = path.join(process.cwd(), 'content/builds')
  const filenames = await fs.readdir(buildsDirectory)

  const builds = await Promise.all(
    filenames.map(async (filename) => {
      const filePath = path.join(buildsDirectory, filename)
      const fileContents = await fs.readFile(filePath, 'utf8')
      const slug = filename.replace(/\.mdx$/, '')
      const { frontmatter, code } = await serializeMDX(fileContents)

      return {
        slug,
        frontmatter: frontmatter as Build['frontmatter'],
        code,
      }
    })
  )

  return builds.sort((a, b) => {
    // Sort by title for now, can be changed later if a date is added to builds
    return a.frontmatter.title.localeCompare(b.frontmatter.title)
  })
}
