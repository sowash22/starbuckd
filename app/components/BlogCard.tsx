import Link from 'next/link'
import { WritingsPost } from '@/types/writings'

interface WritingsCardProps {
  post: WritingsPost
  featured?: boolean
}

export default function WritingsCard({ post, featured = false }: WritingsCardProps) {
  const formattedDate = new Date(post.frontmatter.date).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  )

  if (featured) {
    return (
      <article className="group relative">
        <Link
          href={`/writings/${post.slug}`}
          className="block overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-300 hover:shadow-2xl"
        >
          <div className="p-6 md:p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
                Featured
              </span>
              <time className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                {formattedDate}
              </time>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-neutral-100 mb-4 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors leading-tight">
              {post.frontmatter.title}
            </h2>
            
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 line-clamp-3">
              {post.frontmatter.summary}
            </p>

            {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-semibold bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:gap-2 transition-all">
              Read Article
              <svg
                className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
        </Link>
      </article>
    )
  }

  return (
    <article className="group">
      <Link
        href={`/writings/${post.slug}`}
        className="block p-6 md:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900 hover:shadow-lg transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
          <time className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            {formattedDate}
          </time>
          {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.frontmatter.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-3 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors leading-tight">
          {post.frontmatter.title}
        </h2>

        <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4 line-clamp-2">
          {post.frontmatter.summary}
        </p>

        <div className="flex items-center text-sm font-semibold text-neutral-900 dark:text-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity">
          Read more
          <svg
            className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Link>
    </article>
  )
}
