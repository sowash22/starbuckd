'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import SearchButton from './SearchButton'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/blog', label: 'Writings' },
    { href: '/projects', label: 'Projects' },
  ]

  const isActive = (href: string) => {
    if (href === '/blog') {
      return pathname === '/blog' || pathname.startsWith('/blog/')
    }
    return pathname === href
  }

  return (
    <>
      <header className="border-b border-dotted border-neutral-300 dark:border-neutral-700">
        <nav className="mx-auto max-w-4xl px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl font-bold text-neutral-900 dark:text-neutral-100 hover:opacity-70 transition-opacity font-mono"
              onClick={() => setIsOpen(false)}
            >
              Ashok Marannan
            </Link>

            {/* Desktop Navigation with Separators */}
            <div className="hidden md:flex items-center gap-0">
              {navLinks.map((link, index) => (
                <div key={link.href} className="flex items-center">
                  {index > 0 && (
                    <span className="mx-4 text-neutral-400 dark:text-neutral-600">·</span>
                  )}
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-neutral-900 dark:hover:text-neutral-100 ${
                      isActive(link.href)
                        ? 'text-neutral-900 dark:text-neutral-100'
                        : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>

            {/* Utility Icons - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <SearchButton mode="inline" />
              <Link
                href="/feed"
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                aria-label="RSS Feed"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.109-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z" />
                </svg>
              </Link>
              <ThemeToggle />
            </div>

            {/* Mobile Utilities + Menu */}
            <div className="md:hidden flex items-center gap-4 -mr-2">
              <SearchButton mode="modal" />
              <Link
                href="/feed"
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                aria-label="RSS Feed"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.109-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z" />
                </svg>
              </Link>
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-neutral-900 dark:text-neutral-100"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
                  <span
                    className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                      isOpen ? 'rotate-45 translate-y-2' : ''
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                      isOpen ? 'opacity-0' : ''
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                      isOpen ? '-rotate-45 -translate-y-2' : ''
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="py-2 space-y-1 border-t border-dotted border-neutral-300 dark:border-neutral-700 mt-4 pt-4">
              {navLinks.map((link) => {
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 text-base font-medium transition-colors font-mono ${
                      active
                        ? 'text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-800/50'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}
