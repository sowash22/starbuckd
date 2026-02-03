import type { Metadata } from 'next'
import { JetBrains_Mono, Permanent_Marker, Inter } from 'next/font/google'
import Script from 'next/script'
import 'highlight.js/styles/github-dark.css'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const marker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-marker',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: "Starbuck'd - The Official Name Butcher",
    template: "%s | Starbuck'd",
  },
  description: 'Find out how a barista will inevitably ruin your name on a coffee cup.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${marker.variable} font-sans min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased overflow-x-hidden`}
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
