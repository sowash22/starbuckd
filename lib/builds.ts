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
  const filenames = (await fs.readdir(buildsDirectory)).filter((filename) =>
    filename.endsWith('.mdx')
  )

  const builds = await Promise.all(
    filenames.map(async (filename) => {
      try {
        const filePath = path.join(buildsDirectory, filename)
        const fileContents = await fs.readFile(filePath, 'utf8')
        if (fileContents.trim() === '') return null

        const slug = filename.replace(/\.mdx$/, '')
        const { frontmatter, compiledSource: code } = await serializeMDX(
          fileContents
        )



        if (
          typeof frontmatter.title === 'string' &&
          typeof frontmatter.description === 'string' &&
          typeof frontmatter.href === 'string'
        ) {
          return {
            slug,
            frontmatter: {
              title: frontmatter.title,
              description: frontmatter.description,
              href: frontmatter.href,
              github:
                typeof frontmatter.github === 'string'
                  ? frontmatter.github
                  : undefined,
            },
            code,
          }
        }
      } catch (error) {
        console.error(`Error processing ${filename}:`, error)
      }
      return null
    })
  )

  return (builds.filter((build) => build !== null) as Build[]).sort((a, b) =>
    a.frontmatter.title.localeCompare(b.frontmatter.title)
  )
}
