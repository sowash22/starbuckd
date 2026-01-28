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
          builds
        </h1>

        {builds.length === 0 ? (
          <p className="text-neutral-600 dark:text-neutral-400 font-mono">
            No builds yet.
          </p>
        ) : (
          <div className="space-y-4">
            {builds.map((b) => (
              <div key={b.slug} className="font-mono">
                <Link
                  href={b.frontmatter.href}
                  className="text-base text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400 underline decoration-dotted underline-offset-4 decoration-neutral-400 dark:decoration-neutral-600 hover:decoration-neutral-600 dark:hover:decoration-neutral-400 transition-colors"
                >
                  {b.frontmatter.title}
                </Link>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {b.frontmatter.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
