import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import { getBuilds } from '@/lib/builds'

export const metadata: Metadata = {
  title: 'Ashok Marannan',
  description: 'Ashok Marannan - Curious about everything',
}

export default async function Home() {
  const posts = getAllPosts().slice(0, 6)
  const allBuilds = await getBuilds();
  const homeBuilds = allBuilds.slice(0, 6)
  // const homeBuilds = []

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* About Section */}
        <section className="mb-16">
          <p className="text-base md:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6 font-mono">
          I’m curious about how things work.
          I write about what I learn and build things I like to use.
          </p>
          
          <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
            <Link
              href="https://github.com/marannan"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </Link>
            <Link
              href="https://www.linkedin.com/in/ashokmarannan/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Featured Writings */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 font-mono">
            writings
          </h2>
          
          {posts.length === 0 ? (
            <p className="text-neutral-600 dark:text-neutral-400 font-mono">
              No writings yet. Check back soon!
            </p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => {
                const date = new Date(post.frontmatter.date)
                const formattedDate = date.toLocaleDateString('en-GB', {
                  month: 'short',
                  year: 'numeric',
                })

                return (
                  <div
                    key={post.slug}
                    className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-12 group"
                  >
                    <time className="text-sm text-neutral-400 dark:text-neutral-500 font-mono flex-shrink-0 sm:w-28 uppercase tracking-wider">
                      {formattedDate}
                    </time>
                    <Link
                      href={`/writings/${post.slug}`}
                      className="text-lg text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors font-mono flex-1 leading-snug"
                    >
                      {post.frontmatter.title}
                    </Link>
                  </div>
                )
              })}
              
              {posts.length > 0 && (
                <div className="pt-6">
                  <Link
                    href="/writings"
                    className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 underline decoration-dotted underline-offset-4 decoration-neutral-400 dark:decoration-neutral-600 hover:decoration-600 dark:hover:decoration-neutral-400 transition-colors font-mono inline-flex items-center gap-2 group"
                  >
                    view all writings 
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Builds */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 font-mono">
            builds
          </h2>

          {homeBuilds.length === 0 ? (
            <p className="text-neutral-600 dark:text-neutral-400 font-mono">
              No builds yet.
            </p>
          ) : (
            <div className="space-y-4">
              {homeBuilds.map((b) => (
                <div
                  key={b.slug}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-12 group"
                >
                  <div className="flex-shrink-0 sm:w-28">
                    {b.frontmatter.github ? (
                      <Link
                        href={b.frontmatter.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-neutral-400 dark:text-neutral-500 font-mono hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors uppercase tracking-wider underline decoration-dotted underline-offset-4"
                      >
                        github
                      </Link>
                    ) : (
                      <span className="text-sm text-neutral-400 dark:text-neutral-500 font-mono uppercase tracking-wider">
                        build
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      href={b.frontmatter.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors font-mono leading-snug"
                    >
                      {b.frontmatter.title}
                    </Link>
                    <p className="text-sm text-neutral-500 dark:text-neutral-500 font-mono mt-1">
                      {b.frontmatter.description}
                    </p>
                  </div>
                </div>
              ))}

              <div className="pt-6">
                <Link
                  href="/builds"
                  className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 underline decoration-dotted underline-offset-4 decoration-neutral-400 dark:decoration-neutral-600 hover:decoration-neutral-600 dark:hover:decoration-neutral-400 transition-colors font-mono inline-flex items-center gap-2 group"
                >
                  more builds
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
