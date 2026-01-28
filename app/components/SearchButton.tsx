'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type SearchButtonMode = 'inline' | 'modal'

export default function SearchButton({
  mode = 'inline',
}: {
  mode?: SearchButtonMode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/blog?search=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
      setQuery('')
    }
  }

  if (mode === 'inline' && isOpen) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          autoFocus
          className="px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 font-mono"
          onBlur={() => {
            setTimeout(() => setIsOpen(false), 200)
          }}
        />
        <button
          type="submit"
          className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        aria-label="Search"
        aria-expanded={isOpen}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {mode === 'modal' && isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-white/70 dark:bg-neutral-950/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          onMouseDown={() => setIsOpen(false)}
        >
          <div
            className="mx-auto mt-24 w-[min(32rem,calc(100vw-2rem))] rounded-lg border border-dotted border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4 shadow-lg"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search writings…"
                autoFocus
                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 font-mono"
              />
              <button
                type="submit"
                className="px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 rounded hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors font-mono"
              >
                Go
              </button>
            </form>
            <div className="mt-3 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-500 font-mono">
              <span>Press Esc to close</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="underline decoration-dotted underline-offset-4 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
