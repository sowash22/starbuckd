import type { Metadata } from 'next'
import Link from 'next/link'
import { getBuilds } from '@/lib/builds'

export const metadata: Metadata = {
  title: 'Builds',
  description: 'Builds by Ashok Marannan',
}

export default async function BuildsPage() {
  const builds = await getBuilds()

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 font-mono">
          Builds
        </h1>

        {builds.length === 0 ? (
          <p className="text-neutral-600 dark:text-neutral-400 font-mono">
            No builds yet.
          </p>
        ) : (
          <div className="space-y-4">
            {builds.map((b) => {
              const date = new Date(b.frontmatter.date)
              const formattedDate = date.toLocaleDateString('en-GB', {
                month: 'short',
                year: 'numeric',
              })

              return (
                <div
                  key={b.slug}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-12 group"
                >
                  <time className="text-sm text-neutral-400 dark:text-neutral-500 font-mono flex-shrink-0 sm:w-28 uppercase tracking-wider">
                    {formattedDate}
                  </time>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Link
                        href={b.frontmatter.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors font-mono leading-snug"
                      >
                        {b.frontmatter.title}
                      </Link>
                      {/* {b.frontmatter.github && (
                        <Link
                          href={b.frontmatter.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                          aria-label="GitHub Source"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        </Link>
                      )} */}
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-500 font-mono mt-1">
                      {b.frontmatter.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
