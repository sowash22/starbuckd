export interface BlogFrontmatter {
  title: string
  date: string
  summary: string
  tags?: string[]
}

export interface BlogPost {
  slug: string
  frontmatter: BlogFrontmatter
  content: string
}
