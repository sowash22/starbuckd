import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPostSlugs, getPostBySlug } from '@/lib/posts'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

interface WritingsPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({
  params,
}: WritingsPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.summary,
  }
}

export default async function WritingsPostPage({ params }: WritingsPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const formattedDate = new Date(post.frontmatter.date).toLocaleDateString(
    'en-GB',
    {
      month: 'short',
      year: 'numeric',
    }
  )

  return (
    <div className="min-h-screen">
      <article className="mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/writings"
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-8 transition-colors font-mono"
        >
          <svg
            className="mr-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Writings
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 font-mono">
            {post.frontmatter.title}
          </h1>
          <div className="text-sm text-neutral-500 dark:text-neutral-500 font-mono">
            <time dateTime={post.frontmatter.date}>{formattedDate}</time>
            {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
              <p className="mt-2 text-xs uppercase">
                {post.frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-neutral-200 dark:bg-neutral-800 rounded-full px-3 py-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 mr-2 mb-2"
                  >
                    {tag}
                  </span>
                ))}
              </p>
            )}
          </div>
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-headings:font-mono prose-p:font-mono prose-p:leading-relaxed prose-a:text-neutral-900 dark:prose-a:text-neutral-100 prose-a:underline prose-a:decoration-dotted prose-a:underline-offset-4 hover:prose-a:text-neutral-600 dark:hover:prose-a:text-neutral-400 prose-strong:font-semibold prose-code:font-mono prose-code:text-sm prose-pre:bg-neutral-100 dark:prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-200 dark:prose-pre:border-neutral-800">
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeHighlight as any],
              },
            }}
          />
        </div>
      </article>
    </div>
  )
}
