import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Writings',
  description: 'Thoughts, notes, and write-ups',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 font-mono">
          Writings
        </h1>

        {posts.length === 0 ? (
          <p className="text-neutral-600 dark:text-neutral-400 font-mono">
            No posts yet. Check back soon!
          </p>
        ) : (
          <div className="space-y-1">
            {posts.map((post) => {
              const date = new Date(post.frontmatter.date)
              const formattedDate = date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })

              return (
                <div
                  key={post.slug}
                  className="flex items-start gap-6 py-2 group"
                >
                  <time className="text-sm text-neutral-500 dark:text-neutral-500 font-mono flex-shrink-0 w-24">
                    {formattedDate}
                  </time>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-base text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400 underline decoration-dotted underline-offset-4 decoration-neutral-400 dark:decoration-neutral-600 hover:decoration-neutral-600 dark:hover:decoration-neutral-400 transition-colors font-mono flex-1"
                  >
                    {post.frontmatter.title}
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
