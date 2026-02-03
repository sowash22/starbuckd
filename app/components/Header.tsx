'use client'

import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { Coffee } from 'lucide-react'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      <nav className="mx-auto max-w-5xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <Coffee className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-black tracking-tighter text-neutral-900 dark:text-neutral-100 uppercase">
              Starbuck&apos;d
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}
