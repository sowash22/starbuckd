export interface WritingsFrontmatter {
  title: string
  date: string
  summary: string
  tags?: string[]
}

export interface WritingsPost {
  slug: string
  frontmatter: WritingsFrontmatter
  content: string
}
