import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Writings',
  description: 'Thoughts, notes, and write-ups',
}

export default function WritingsPage() {
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
                month: 'short',
                year: 'numeric',
              })

              return (
                <div
                  key={post.slug}
                  className="py-2 group flex flex-col md:flex-row md:items-baseline md:gap-6"
                >
                  <time className="text-sm text-neutral-500 dark:text-neutral-500 font-mono mb-1 md:mb-0 md:flex-shrink-0 md:w-24">
                    {formattedDate}
                  </time>
                  <Link
                    href={`/writings/${post.slug}`}
                    className="text-base text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400 underline decoration-dotted underline-offset-4 decoration-neutral-400 dark:decoration-neutral-600 hover:decoration-neutral-600 dark:hover:text-neutral-400 transition-colors font-mono"
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
