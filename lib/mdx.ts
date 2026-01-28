import { serialize } from 'next-mdx-remote/serialize'
import type { PluggableList } from 'unified'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

export async function serializeMDX(content: string) {
  return serialize(content, {
    parseFrontmatter: true, // Explicitly enable frontmatter parsing
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeHighlight as any],
    } as any,
  })
}
