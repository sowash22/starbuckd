'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { WritingsPost } from '@/types/writings'
import { Build } from '@/lib/builds'

type SearchButtonMode = 'inline' | 'modal'

interface SearchResult {
  title: string
  description: string // This will be summary for writings, description for builds
  href: string
  type: 'writing' | 'build'
  content?: string // Only for writings
  tags?: string[] // Only for writings
}

let allContent: SearchResult[] = []
let contentFetched = false

async function fetchAllContent(): Promise<SearchResult[]> {
  try {
    // Fetch all writings
    const writingsRes = await fetch('/api/writings')
    const fetchedWritings: WritingsPost[] = await writingsRes.json()

    const writingsResults: SearchResult[] = fetchedWritings.map((w) => ({
      title: w.frontmatter.title,
      description: w.frontmatter.summary,
      href: `/writings/${w.slug}`,
      type: 'writing',
      content: w.content,
      tags: w.frontmatter.tags,
    }))

    // Fetch all builds
    const buildsRes = await fetch('/api/builds')
    const fetchedBuilds: Build[] = await buildsRes.json()

    const buildsResults: SearchResult[] = fetchedBuilds.map((b) => ({
      title: b.frontmatter.title,
      description: b.frontmatter.description,
      href: b.frontmatter.href,
      type: 'build',
    }))

    return [...writingsResults, ...buildsResults]
  } catch (error) {
    console.error('Failed to fetch content for search:', error)
    return []
  }
}

export default function SearchButton({
  mode = 'inline',
}: {
  mode?: SearchButtonMode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        handleClose()
      }
    }

    if (isOpen) {
      if (!contentFetched && !isFetching) {
        setIsFetching(true)
        fetchAllContent().then((data) => {
          allContent = data
          contentFetched = true
          setIsFetching(false)
        })
      }
      document.addEventListener('mousedown', handleOutsideClick)
    } else {
      document.removeEventListener('mousedown', handleOutsideClick)
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOpen, isFetching])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    if (searchQuery.trim() === '') {
      setResults([])
      return
    }

    const lowerCaseQuery = searchQuery.toLowerCase()
    const filteredResults: SearchResult[] = allContent
      .filter((item) => {
        const title = item.title.toLowerCase()
        const description = item.description.toLowerCase()
        const content = item.content?.toLowerCase() || '' // Optional content field
        const tags = item.tags?.map((tag) => tag.toLowerCase()).join(' ') || '' // Optional tags field

        return (
          title.includes(lowerCaseQuery) ||
          description.includes(lowerCaseQuery) ||
          content.includes(lowerCaseQuery) ||
          tags.includes(lowerCaseQuery)
        )
      })
      .slice(0, 5) // Limit results to 5

    setResults(filteredResults)
  }

  const handleClose = () => {
    setIsOpen(false)
    setQuery('')
    setResults([])
    // router.push(router.pathname); // Optional: clear search query from URL if any
  }

  const renderSearchResults = () => {
    if (query.trim() === '') {
      return null // Don't show anything if query is empty
    }

    if (isFetching) {
      return (
        <p className="text-sm text-neutral-500 dark:text-neutral-500 font-mono mt-4">
          Loading content...
        </p>
      )
    }

    if (results.length === 0) {
      return (
        <p className="text-sm text-neutral-500 dark:text-neutral-500 font-mono mt-4">
          No results found for &quot;{query}&quot;.
        </p>
      )
    }

    return (
      <ul className="mt-4 max-h-60 overflow-y-auto">
        {results.map((result) => (
          <li key={`${result.type}-${result.href}`} className="mb-2 last:mb-0">
            <Link
              href={result.href}
              onClick={handleClose}
              className="block p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {result.title} ({result.type})
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {result.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  const formContent = (
    <>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search writings and builds…"
        autoFocus={isOpen}
        className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-600 font-mono"
      />
      {/* Removed submit button as search is live */}
    </>
  )

  if (mode === 'inline' && isOpen) {
    return (
      <div className="relative" ref={searchContainerRef}>
        <div className="flex items-center gap-2">
          {formContent}
        </div>
        {query.trim() !== '' && (
          <div className="absolute top-full left-0 mt-2 w-80 max-w-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded shadow-lg z-50">
            {renderSearchResults()}
          </div>
        )}
      </div>
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
          onMouseDown={() => handleClose()}
        >
          <div
            className="mx-auto mt-24 w-[min(32rem,calc(100vw-2rem))] rounded-lg border border-dotted border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4 shadow-lg"
            onMouseDown={(e) => e.stopPropagation()}
            ref={searchContainerRef}
          >
            <div className="flex items-center gap-2">
              {formContent}
            </div>
            {renderSearchResults()}
            <div className="mt-3 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-500 font-mono">
              <span>Press Esc to close</span>
              <button
                type="button"
                onClick={handleClose}
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
