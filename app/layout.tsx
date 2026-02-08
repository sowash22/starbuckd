import { Lora, Raleway, Permanent_Marker } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next';
import './globals.css'
import { Metadata } from 'next'

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-sans',
})

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-body',
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
    default: "Starbuckd - The Official Name Butcher",
    template: "%s | Starbuckd",
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
        className={`${lora.variable} ${raleway.variable} ${marker.variable} font-sans min-h-screen flex flex-col bg-background text-text antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <main className="flex-1">{children}</main>
        <Analytics />
      </body>
    </html>
  )
}
