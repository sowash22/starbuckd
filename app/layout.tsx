import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import 'highlight.js/styles/github-dark.css'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Ashok Marannan',
    template: '%s | Ashok Marannan',
  },
  description: 'Curious about everything. Thoughts on engineering, AI, and building things.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${jetbrainsMono.variable} font-mono min-h-screen flex flex-col bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 antialiased`}
        suppressHydrationWarning
      >
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function() {
              try {
                const theme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const shouldBeDark = theme === 'dark' || (!theme && prefersDark);
                if (shouldBeDark) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            })();
          `}
        </Script>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
